# Plan 66 Supplement: Frontend Edge Container Cutover

## Scope

This plan is the Nginx/static-container supplement to:

- `know_to_win/dev_plans/plan_66_apex_html_and_app_subdomain_migration_flutter.md`
- `ktw_do_react_api/dev_plans/plan_66_apex_html_and_app_subdomain_migration_backend.md`

This repo owns the deployed container that serves the built Flutter web bundles.

Locked host roles for this repo:

- production app host: `app.knowtowin.com`
- preprod app host: `devapp.knowtowin.com`
- apex `knowtowin.com` is no longer the long-term production host for this container after the migration

## Why This Repo Needs A Supplement Plan

The Flutter and backend repos now assume:

- the public SEO/landing experience lives on apex `knowtowin.com`
- the runtime Flutter web app lives on `app.knowtowin.com`
- preprod app traffic should use `devapp.knowtowin.com`

This repo currently packages and serves the web bundles directly, so the host split is not complete until this container is updated.

## Current State In This Repo

Observed current behavior:

- `Dockerfile` copies `build/` into `/usr/share/nginx/html` and `devbuild/` into `/usr/share/nginx/devhtml`
- `nginx.conf.template` serves the production bundle on `server_name knowtowin.com`
- `nginx.conf.template` already serves the preprod bundle on `server_name devapp.knowtowin.com`
- `docker-entrypoint.sh` derives app versions from each bundle and injects `?version=...` query parameters into selected asset URLs at container startup
- the repo currently contains both bundle-local Font Awesome package fonts and extra top-level Font Awesome font files, and Nginx contains redirect rules to the top-level files
- the currently committed production bundle still carries apex-oriented crawl and metadata files
- the currently committed production bundle contains runtime references to `https://dapi.knowtowin.com`
- `devbuild/robots.txt` is currently absent, so preprod crawl handling cannot rely on the copied bundle alone

Important implication:

- if the latest Flutter build is copied into this repo without container-side adjustments, this repo will still present itself as the wrong production host
- this repo will also continue to serve whatever crawl files exist in the copied Flutter bundle, which is no longer correct once the app host stops being the apex SEO host
- this repo also needs bundle validation, not just bundle copying, because a promoted artifact can still point at the wrong API host

## Locked Decisions

For this repo, lock the following decisions before implementation:

1. This container becomes an app-host container, not the apex marketing/SEO container.
2. The production Nginx virtual host in this repo must become `app.knowtowin.com`.
3. The preprod Nginx virtual host remains `devapp.knowtowin.com`.
4. Apex `knowtowin.com` must not remain the steady-state production `server_name` here after the cutover.
5. The current Font Awesome fallback behavior stays in place until preprod proves it is no longer needed.
6. Both app hosts must return explicit crawl-safe responses and must not rely on copied apex crawl files.
7. The promoted production bundle must not contain runtime references to `https://dapi.knowtowin.com` or other non-production API hosts.

## Repo Changes Required

## 1. Update Production Host Routing

Files affected:

- `nginx.conf.template`

Required change:

- change the production `server_name` from `knowtowin.com` to `app.knowtowin.com`

Recommended rollout-safe behavior:

- during the cutover window, it is acceptable to temporarily include both `app.knowtowin.com` and `knowtowin.com` if infra is still forwarding apex traffic here
- once apex routing is moved to the HTML landing deployment, remove apex from this container config

Target outcome:

- production bundle is served on `app.knowtowin.com`
- preprod bundle is served on `devapp.knowtowin.com`
- localhost fallback may continue to use the prod bundle for local smoke checks

## 2. Treat The App Host As Non-Canonical For Search

Files affected:

- `nginx.conf.template`
- copied bundle files inside `build/`
- copied bundle files inside `devbuild/`

Reason:

- this container will now serve the app host, not the apex SEO site
- copied Flutter bundles may still contain crawl files that were intended for apex deployment

Required changes:

1. Add `X-Robots-Tag: noindex, nofollow` at least on the production app host, matching the intent already used on preprod.
2. Define a host-specific crawl-file policy for the app hosts instead of blindly serving the copied bundle files.
3. Ensure the preprod app host returns an explicit crawl-safe `robots.txt` instead of a 404.

Recommended policy:

- `app.knowtowin.com` should not expose the apex sitemap
- `devapp.knowtowin.com` should remain noindex
- app-host `robots.txt` should disallow crawl
- app-host `sitemap.xml` should either be absent or replaced with an app-host-specific placeholder that does not advertise apex URLs
- app-host `sitemap-index.xml` should follow the same suppression rule as `sitemap.xml`

Implementation options:

1. Override `robots.txt` and `sitemap.xml` directly in Nginx
2. Maintain repo-owned override files and copy them into `build/` and `devbuild/` after syncing Flutter artifacts

Recommendation:

- use repo-owned override files or a small normalization script so the copied Flutter bundle does not accidentally leak apex crawl metadata
- if Nginx keeps explicit `location = /robots.txt` or `location = /sitemap.xml` handlers, those handlers must synthesize safe app-host responses instead of serving copied bundle files

## 3. Add A Bundle-Normalization Step After Copying Flutter Web Output

Files affected:

- `build/`
- `devbuild/`
- potentially a new helper script in this repo

Today the manual promotion flow is effectively:

1. build Flutter web output in the Flutter repo
2. copy that output into this repo
3. commit to `main`
4. deploy through the existing Nginx container pipeline

That flow now needs an explicit normalization step.

Recommended target flow:

1. build the production Flutter web bundle from `know_to_win`
2. copy it into this repo's `build/`
3. normalize the copied bundle for the app host
4. build the preprod Flutter web bundle from `know_to_win`
5. copy it into this repo's `devbuild/`
6. normalize the copied bundle for the preprod app host
7. commit to `main`

Normalization should cover:

- crawl-file overrides for app hosts
- `.well-known` support files if this repo becomes the serving point for them
- any required top-level Font Awesome fallback files
- removal of stale host-specific artifacts copied from the wrong deployment context
- correction or suppression of stale app-shell metadata if upstream Flutter source still carries apex assumptions

## 4. Add Bundle-Integrity Validation Before Commit

This repo needs a validation gate between "copy bundle" and "commit to main".

Reason:

- the currently committed production bundle contains live runtime references to `https://dapi.knowtowin.com`
- the currently committed production bundle still carries apex crawl and metadata assumptions
- copy success alone does not prove deployment correctness

Minimum required validation for `build/`:

1. fail if promoted runtime artifacts reference:
   - `https://dapi.knowtowin.com`
   - `https://localdev.knowtowin.com`
2. fail if `build/index.html` still carries app-shell metadata that wrongly claims apex ownership for the app host
3. fail if `build/robots.txt` or `build/sitemap.xml` still advertise apex crawl ownership and no repo override is present

Minimum required validation for `devbuild/`:

1. confirm the bundle points to the intended preprod API host
2. confirm preprod crawl handling is explicit and does not rely on a missing `robots.txt`

Recommended implementation:

- add a small repo-owned validation or promotion script that runs host/API grep checks before commit

## 5. Keep The Versioned-Asset Boot Path Intact

Files affected:

- `docker-entrypoint.sh`
- `nginx.conf.template`

This repo already has a versioned asset boot path:

- the entrypoint extracts `serviceWorkerVersion`
- it injects `?version=...` into selected asset URLs in each copied `index.html`
- Nginx enforces the canonical `version` query string on selected assets

Migration rule:

- do not break this versioning system while changing hosts

Checks that must still pass after the cutover:

- `main.dart.mjs` still redirects to the canonical `?version=...`
- static assets still receive long-cache immutable responses once versioned
- `/__app_version` still reports the correct bundle version for prod and preprod
- `/__force_update__` still clears cache and storage on the app hosts

## 6. Keep Font Awesome Fallbacks Until Preprod Proves They Are Unnecessary

Files affected:

- `nginx.conf.template`
- copied bundle roots in `build/` and `devbuild/`

Observed current workaround:

- top-level font files exist in both `build/` and `devbuild/`
- Nginx redirects encoded package font URLs to those top-level files

This indicates the workaround is still intentionally preserved in this repo.

Plan decision:

- do not remove the workaround as part of the host migration
- tighten the Dockerfile font-directory check so missing expected font directories fail the image build instead of only logging

Preprod validation gate before any cleanup:

1. `devapp.knowtowin.com` renders Font Awesome icons correctly on the main routes that use them
2. browser network tab shows no 404s for Font Awesome font files
3. encoded and package-path font requests resolve successfully

Only after that should a follow-up cleanup decide whether the top-level font triplet and redirect rules can be removed.

## 7. Add Serving Support For App-Host `.well-known` Files

Files affected:

- `build/`
- `devbuild/`
- potentially `nginx.conf.template`
- potentially new repo-owned static support files

Reason:

- `app.knowtowin.com` will likely need to serve:
  - `/.well-known/assetlinks.json`
  - `/.well-known/apple-app-site-association`

If this container is the actual serving surface for `app.knowtowin.com`, then this repo is a strong candidate to host those files directly.

Required plan outcome:

- decide whether `.well-known` files are served from this repo or from an upstream edge layer
- if served here, add a stable place in this repo for those files and ensure the Nginx config serves them without SPA fallback interference

Recommendation:

- treat `.well-known` support as repo-owned here unless infra already injects those files elsewhere
- if this repo owns them, add an explicit `location ^~ /.well-known/` block before the SPA fallback in both prod and preprod server blocks
- do not allow `/.well-known/*` requests to fall through to `/index.html`

Note:

- actual `assetlinks.json` and Apple association payload values depend on Android package fingerprints and Apple team/app identifiers, so placeholders should not be invented blindly

## 8. Define The Manual Promotion Workflow Explicitly

This repo should stop relying on memory-only deployment steps.

Add an explicit documented promotion workflow covering:

1. build prod bundle from the Flutter repo with production host defines
2. copy that bundle into `build/`
3. run bundle normalization for prod
4. run bundle-integrity validation for prod
5. build preprod bundle from the Flutter repo with preprod host defines
6. copy that bundle into `devbuild/`
7. run bundle normalization for preprod
8. run bundle-integrity validation for preprod
9. inspect diff carefully
10. commit to `main`

Suggested copy commands:

```bash
rsync -a --delete /home/surajitray/IdeaProjects/know_to_win/build/web/ /home/surajitray/StudioProjects/ktw-nginx-spaces-proxy-static-website/build/
```

Then rebuild preprod in the Flutter repo and copy:

```bash
rsync -a --delete /home/surajitray/IdeaProjects/know_to_win/build/web/ /home/surajitray/StudioProjects/ktw-nginx-spaces-proxy-static-website/devbuild/
```

Important:

- because Flutter reuses `build/web/`, the prod copy must happen immediately after the prod build, before running the preprod build
- this ordering should be codified in a script or documented command sequence rather than left as tribal knowledge

## 9. Build-Input Expectations For The Flutter Repo

This repo depends on receiving the correct host-specific output from `know_to_win`.

Production bundle expectation:

- built for `https://app.knowtowin.com`
- built against the production API host, not `https://dapi.knowtowin.com`

Preprod bundle expectation:

- built for `https://devapp.knowtowin.com`
- built against the intended preprod API host

That primarily means the Flutter build must receive the correct `DEEP_LINK_BASE_URL`, and any environment-specific API base must also be correct for the target environment.

Example shape only:

```bash
flutter build web --release --dart-define=DEEP_LINK_BASE_URL=https://app.knowtowin.com --dart-define=API_BASE_URL=https://api.knowtowin.com
flutter build web --release --dart-define=DEEP_LINK_BASE_URL=https://devapp.knowtowin.com --dart-define=API_BASE_URL=https://dapi.knowtowin.com
```

If preprod uses a separate API base, that must be supplied during the preprod build as well.

## Suggested Implementation Order

1. add this repo's `dev_plans` documentation and lock the workflow
2. update `nginx.conf.template` for `app.knowtowin.com`
3. add app-host noindex/crawl-file behavior for prod and preprod
4. add explicit crawl-safe `robots.txt` handling for preprod
5. add `.well-known` serving strategy or placeholders
6. formalize bundle normalization and bundle-integrity validation after each Flutter build copy
7. build and promote preprod bundle into `devbuild/`
8. validate `devapp.knowtowin.com`
9. build and promote prod bundle into `build/`
10. flip infra host routing and deploy
11. validate `app.knowtowin.com`

## Verification Matrix

## Routing And Host Checks

- `app.knowtowin.com` serves `/usr/share/nginx/html`
- `devapp.knowtowin.com` serves `/usr/share/nginx/devhtml`
- apex is no longer the steady-state host on this container

## Cache And Version Checks

- `/__app_version` returns the expected version on prod and preprod
- `main.dart.mjs` receives the canonical `?version=...`
- immutable assets still resolve with the enforced version query string
- `/__force_update__` works on both app hosts

## Search/Crawl Checks

- prod app host sends `X-Robots-Tag: noindex, nofollow`
- preprod app host sends `X-Robots-Tag: noindex, nofollow`
- preprod `robots.txt` is an explicit crawl-safe response, not a passive 404
- app hosts do not serve the apex sitemap by mistake
- app hosts do not claim apex canonical crawl ownership

## Bundle Integrity Checks

- production promoted artifacts do not reference `https://dapi.knowtowin.com`
- production promoted artifacts do not reference `https://localdev.knowtowin.com`
- production promoted `index.html` does not keep stale apex app-shell ownership metadata if that metadata is not meant to ship on the app host
- preprod promoted artifacts reference the intended preprod API host

## Font Awesome Checks

- no 404s for Font Awesome files on prod or preprod
- encoded and package-path font requests resolve
- icons render correctly on pages known to use Font Awesome

## Deep Link Support Checks

- `/.well-known/assetlinks.json` is reachable on the app host if Android App Links are in scope
- `/.well-known/apple-app-site-association` is reachable on the app host if iOS Universal Links are in scope
- `/.well-known/*` responses are real files or explicit 404s, never SPA HTML

## Risks

## 1. Wrong Host Still Bound To The Prod Server Block

If the production Nginx `server_name` remains `knowtowin.com`, the container-level host split will remain incomplete even if DNS changes elsewhere.

Mitigation:

- make the `server_name` change explicit and verify host headers after deploy

## 2. Apex Crawl Files Leak Through The App Host

If copied Flutter artifacts include apex `robots.txt` or `sitemap.xml`, the app host can expose the wrong SEO metadata.

Mitigation:

- normalize copied bundles or override crawl files at the container layer

## 3. Wrong API Host Is Promoted Into The Production Bundle

If the promoted production bundle still points at `https://dapi.knowtowin.com`, the app host can call the wrong backend even though host routing is otherwise correct.

Mitigation:

- validate promoted artifacts for forbidden non-production host strings before commit

## 4. Preprod Crawl Handling Relies On Missing Files

If `devapp.knowtowin.com/robots.txt` returns 404, crawlers can treat that as no restriction and still probe the host despite the `X-Robots-Tag`.

Mitigation:

- return an explicit crawl-safe `robots.txt` for the preprod host

## 5. Font Awesome Regresses During Bundle Refresh

If the old manual font fallback is removed too early, icons may disappear again.

Mitigation:

- keep the fallback until preprod proves it is redundant

## 6. `.well-known` Files Are Assumed But Not Actually Served

If app links are configured in the app and DNS but the app host does not actually serve the host files, verification will fail.

Mitigation:

- assign `.well-known` ownership explicitly to this repo or to infra, not both and not neither

## Manual Changes

These items are outside this repo but tightly coupled to this plan.

### Deploy platform host mapping

- update the deploy target so this container is attached to `app.knowtowin.com` for prod
- keep or attach this container to `devapp.knowtowin.com` for preprod
- detach apex `knowtowin.com` from this container once the landing-page deployment is ready

### DNS and certificates

- point `app.knowtowin.com` to this container's deploy surface
- point `devapp.knowtowin.com` to the correct preprod surface
- ensure TLS is valid for both hosts

### Flutter build inputs

- provide the correct prod and preprod `--dart-define` values before copying web output into this repo

### External auth and app-link providers

- keep Google/Firebase/provider allowlists aligned with the actual hosts this repo serves
- if `.well-known` files are not served from this repo, ensure the serving layer that owns them is updated in lockstep

## Acceptance Criteria

This supplement plan is complete when all of the following are true:

1. this repo's production host is `app.knowtowin.com`
2. this repo's preprod host is `devapp.knowtowin.com`
3. copied Flutter bundles are normalized for app-host deployment
4. promoted production artifacts do not reference the wrong API host
5. prod and preprod app hosts no longer expose apex SEO crawl ownership
6. Font Awesome renders correctly without introducing new 404s
7. the repo's documented copy-and-deploy workflow is precise enough to repeat without tribal knowledge
