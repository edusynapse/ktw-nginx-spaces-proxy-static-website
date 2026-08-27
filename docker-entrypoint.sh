#!/bin/sh
set -e

log() { echo "[entrypoint] $*"; }

# Extract: const serviceWorkerVersion = "....";
extract_ver() {
  file="$1"
  [ -f "$file" ] || { echo ""; return; }
  # double-quoted, then single-quoted fallback
  ver=$(sed -n -r 's/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*"([^"]+)".*/\1/p' "$file" | head -n1)
  [ -n "$ver" ] || ver=$(sed -n -r "s/.*serviceWorkerVersion[[:space:]]*=[[:space:]]*'([^']+)'.*/\1/p" "$file" | head -n1)
  echo "$ver"
}

# Add ?version=<ver> to asset/worker/image URLs in index.html (BusyBox-safe, idempotent)
# - Handles both /workers/... and workers/... (optional leading slash)
# - Only touches /?/workers, /?/assets, /?/icons
# - Skips if a '?' or '#' already exists in the URL
versionize_index() {
  ver="$1"; file="$2"
  [ -f "$file" ] || { log "skip versionize (missing): $file"; return 0; }

  log "Versionizing assets in $file with ?version=${ver}"

  # --- canvasKitBaseUrl in flutter_bootstrap.js ----------------
  # (DISABLED: breaking Flutter's internal path joining which results in ?version=.../skwasm.js)
  # bootstrap_js="$(dirname "$file")/flutter_bootstrap.js"
  # if [ -f "$bootstrap_js" ]; then
  #   sed -r -i \
  #     's|(canvasKitBaseUrl:[[:space:]]*"/canvaskit/)(")|\1?version='"$ver"'\2|g' \
  #     "$bootstrap_js"
  #   log "Versionized canvasKitBaseUrl in $bootstrap_js"
  # fi

  # --- <link rel="preload" href="..."> -------------------------
  # (DISABLED: Mangling preloads causes them to mismatch actual fetches, leading to browser warnings)
  # workers (absolute or relative)
  # sed -r -i \
  #   's|(rel="preload"[^>]*href=")(/?workers/[^"?#+]+)(["#])|\1\2?version='"$ver"'\3|g' \
  #   "$file"
  # assets
  # sed -r -i \
  #   's|(rel="preload"[^>]*href=")(/?assets/[^"?#+]+)(["#])|\1\2?version='"$ver"'\3|g' \
  #   "$file"
  # icons
  # sed -r -i \
  #   's|(rel="preload"[^>]*href=")(/?icons/[^"?#+]+)(["#])|\1\2?version='"$ver"'\3|g' \
  #   "$file"

  # --- <img src="..."> -----------------------------------------
  sed -r -i \
    's|(src=")(/?assets/[^"?#+]+)(")|\1\2?version='"$ver"'\3|g' \
    "$file"
  sed -r -i \
    's|(src=")(/?icons/[^"?#+]+)(")|\1\2?version='"$ver"'\3|g' \
    "$file"

  # --- inline CSS: background-image: url(...) -------------------
  # Handles url(/assets/...), url(assets/...), with/without quotes.
  sed -r -i \
    's|(background-image:[^;]*url\()(["'\'']?)(/?assets/[^"'\'')#?+]+)(["'\'']?\))|\1\2\3?version='"$ver"'\4|g' \
    "$file"
}

PROD_INDEX="/usr/share/nginx/html/index.html"
DEV_INDEX="/usr/share/nginx/devhtml/index.html"

raw_prod="$(extract_ver "$PROD_INDEX")"
raw_dev="$(extract_ver "$DEV_INDEX")"

# Fall back to $APP_VERSION when not found
if [ -n "$raw_prod" ]; then
  APP_VERSION_PROD="$raw_prod"
  SRC_PROD="index.html"
else
  APP_VERSION_PROD="${APP_VERSION:-dev}"
  SRC_PROD="\$APP_VERSION fallback"
fi

if [ -n "$raw_dev" ]; then
  APP_VERSION_DEV="$raw_dev"
  SRC_DEV="index.html"
else
  APP_VERSION_DEV="${APP_VERSION:-dev}"
  SRC_DEV="\$APP_VERSION fallback"
fi

export APP_VERSION_PROD APP_VERSION_DEV

# Write probe files (handy if you swap nginx location to alias these)
echo -n "$APP_VERSION_PROD" > /usr/share/nginx/html/__app_version  || true
echo -n "$APP_VERSION_DEV"  > /usr/share/nginx/devhtml/__app_version || true

log "Resolved PROD version: $APP_VERSION_PROD (source: $SRC_PROD)"
log "Resolved  DEV version: $APP_VERSION_DEV  (source: $SRC_DEV)"

# Inject ?version=... into asset/worker/image URLs in both HTMLs
versionize_index "$APP_VERSION_PROD" "$PROD_INDEX"
versionize_index "$APP_VERSION_DEV"  "$DEV_INDEX"

# Render header snippets then the main template
for tmpl in /etc/nginx/snippets/*.conf.template; do
  [ -f "$tmpl" ] || continue
  out="${tmpl%.template}"
  envsubst '$APP_VERSION_PROD $APP_VERSION_DEV' < "$tmpl" > "$out"
  log "Rendered snippet: $out"
done

envsubst '$APP_VERSION_PROD $APP_VERSION_DEV' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

log "Nginx config rendered. Grepping version usage:"
grep -n 'APP_VERSION_' /etc/nginx/nginx.conf || true

if ! nginx -t; then
  log "nginx -t failed"
  exit 1
fi

exec nginx -g 'daemon off;'
