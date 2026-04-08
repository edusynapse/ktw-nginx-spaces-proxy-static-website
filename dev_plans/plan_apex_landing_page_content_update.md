# Plan: Apex Landing Page — Complete Content Update
**Files affected:** `apex/index.html` and multiple new static pages (see §0.B)
**Status:** Plan only — no HTML/CSS changes in this document.

---

## 0.A Context & Goal

The current landing page accurately describes the core quiz loop, credits, and prizes — but omits 7 major platform capabilities that exist in production:

| # | Missing Feature | Destination | Source |
|---|---|---|---|
| 1 | Crossword game | `index.html` §2.A | `crossworddatamodel.js` |
| 2 | Sudoku game | `index.html` §2.A | `sudoku_helper.js` |
| 3 | Maths Equations game | `index.html` §2.A | `mathSlotMachineGenerator.js` |
| 4 | Micro-Tuitions | `index.html` §2.B | `microtuitionmodel.js` |
| 5 | Education Loan applications | **`services.html`** (new page) | `educationloanmodel.js` |
| 6 | School / College Groups | `index.html` §2.D | `schoolmodel.js` |
| 7 | Sponsor Ads | **`partners.html`** (new page) | `sponsormodel.js` |
| 8 | App downloads | **`downloads.html`** (new page) | — |

The goal is to write the **complete, factually correct English copy** for each missing section and page, ready for implementation. All new pages follow the existing static-page pattern (`support.html`) and plug into the existing language-switch system.

---

## 0.B Static Page Architecture & Translation Mechanism

### How the translation system works (existing, from `site.js`)

1. Every page has `<html lang=".." data-page-key="<key>" data-lang-code="<LANG>">` on the `<html>` tag.
2. `site.js` fetches `/assets/i18n/page_routes.json` at load time.
3. The manifest maps `pages.<pageKey>.<LANG_CODE>` → a URL. Example:
   ```json
   {
     "defaultLang": "EN",
     "languages": [
       { "code": "EN", "name": "English" },
       { "code": "HI", "name": "हिन्दी" }
     ],
     "pages": {
       "index":     { "EN": "/",        "HI": "/index_HI" },
       "support":   { "EN": "/support", "HI": "/support_HI" }
     },
     "legal": {
       "privacy": { "EN": "https://cdn.../privacy_policy_EN.html" },
       "terms":   { "EN": "https://cdn.../terms_and_conditions_EN.html" }
     }
   }
   ```
4. `data-page-link="<key>"` attributes on any `<a>` tag are rewritten at runtime to the correct language-aware URL.
5. The language-switcher dropdown is populated from `pages.<currentPageKey>` — only languages that have an entry for the current page are shown.
6. Adding a new language for a page = add the translated static `.html` file + add its entry to `page_routes.json`. No JS changes needed.

### New pages to create

| page key | Canonical file | Hindi file | URL |
|---|---|---|---|
| `services` | `apex/services.html` | `apex/services_HI.html` | `/services` |
| `partners` | `apex/partners.html` | `apex/partners_HI.html` | `/partners` |
| `downloads` | `apex/downloads.html` | `apex/downloads_HI.html` | `/downloads` |

All three pages follow the `support.html` pattern exactly:
- Same `<head>` structure (fonts, `site.css`, OG/Twitter meta, JSON-LD)
- Same `<header>` with brand, nav, language switcher, CTA button
- Same `<footer>` with `data-page-link` attributes throughout
- Same `<script src="/assets/js/site.js" defer>` at bottom
- `data-page-key` set to the page key above
- `data-lang-code="EN"` on the English canonical; translated files get the appropriate code

### `page_routes.json` additions required

The existing manifest (`apex/assets/i18n/page_routes.json`) uses **`.html` extension in translated URLs** (confirmed: `"HI": "/index_HI.html"` at line 33). All new translated entries must follow the same convention:
```json
"services":  { "EN": "/services",  "HI": "/services_HI.html"  },
"partners":  { "EN": "/partners",  "HI": "/partners_HI.html"  },
"downloads": { "EN": "/downloads", "HI": "/downloads_HI.html" }
```
The canonical EN entries have no `.html` suffix (Nginx serves the file without extension via explicit location blocks).

### Nginx routing

The `nginx.conf.template` apex server block currently has:
- Explicit location blocks for `/support` and `/support.html`
- A regex location `^/(index|support)_[A-Z][A-Z]\.html$` for translated files (line 85)

Three changes are required in `nginx.conf.template`:

1. **Add explicit location blocks** for each new page (same pattern as `/support`):
   ```nginx
   location = /services  { add_header Cache-Control "public, max-age=600, must-revalidate" always; try_files /services.html =404; }
   location = /services/ { return 301 /services; }
   location = /services.html { add_header Cache-Control "public, max-age=600, must-revalidate" always; try_files $uri =404; }

   location = /partners  { add_header Cache-Control "public, max-age=600, must-revalidate" always; try_files /partners.html =404; }
   location = /partners/ { return 301 /partners; }
   location = /partners.html { add_header Cache-Control "public, max-age=600, must-revalidate" always; try_files $uri =404; }

   location = /downloads  { add_header Cache-Control "public, max-age=600, must-revalidate" always; try_files /downloads.html =404; }
   location = /downloads/ { return 301 /downloads; }
   location = /downloads.html { add_header Cache-Control "public, max-age=600, must-revalidate" always; try_files $uri =404; }
   ```

2. **Expand the translated-file regex** from `^/(index|support)_[A-Z][A-Z]\.html$` to include the new page names:
   ```nginx
   location ~ ^/(index|support|services|partners|downloads)_[A-Z][A-Z]\.html$ {
     add_header Cache-Control "public, max-age=600, must-revalidate" always;
     try_files $uri =404;
   }
   ```
   Without this change, translated files like `/services_HI.html` return 404.

### Sitemap
`apex/sitemap.xml` must be updated with the three new canonical URLs.

---

## 1. Feature Deep-Dive: What the Code Actually Does

### 1.1 Crossword Game (`crossworddatamodel.js`)

- Fully server-generated crosswords stored as a 2-D grid with across/down placements.
- Each crossword is associated with:
  - `schoolLevel` (1–16) and `englishProficiency` (1–16) — mapped to the same 17-band system used by quizzes.
  - `gameDifficulty` (easy / hard / custom label).
  - `baseLang` + `targetLang` — supports bilingual / multi-language clues (English base + target language variant).
  - `tags` (e.g., animals, school, geography).
  - `status` (draft / active / archived).
- Learner fills in letters; session resumable (state stored server-side).
- Grid deduplication via `gridSignature` — players won't see the same grid repeated.
- Accessed via the standard game-card flow (subject + level selection before start).

### 1.2 Sudoku Game (`sudoku_helper.js`)

- Server-generated standard 9×9 Sudoku puzzles.
- 4 difficulty levels mapped to clue counts removed:
  - **Easy** — ~46 clues remain (35 removed)
  - **Medium** — ~36 clues remain (45 removed)
  - **Hard** — ~31 clues remain (50 removed)
  - **Evil** — ~26 clues remain (55 removed; minimum known is 17)
- Each puzzle is guaranteed **uniquely solvable** (backtracking solver validates single-solution before delivery).
- Full solution stored server-side; no client-side answer exposure.
- Fits the same entry-credit / earn-credit loop as timed quizzes.

### 1.3 Maths Equations Game — Math Slot Machine (`mathSlotMachineGenerator.js`)

- An 8-column grid where each column "slots" independently (like a slot machine).
- Every valid row is a complete arithmetic equation:
  - **Hard mode** — two-digit numbers (0–99), operators +, −, ×, ÷; e.g. `24 + 18 = 42`
  - **Easy mode** — single-digit numbers (0–9); e.g. `3 × 4 = 12`
- Both Pattern A (`N1 op N2 = N3`) and Pattern B (`N1 = N2 op N3`) are valid.
- Trivial zero-spam equations (0 × anything = 0, 0 / k = 0, etc.) are explicitly filtered out.
- Learner spins columns to reveal valid equations; each solve earns points / credits.
- Supports integer-only division (no fractions) for clean puzzle logic.
- Difficulty tightly scoped: easy maps to school-level mental-maths; hard maps to multi-step arithmetic fluency.

### 1.4 Micro-Tuitions (`microtuitionmodel.js`)

- A **live, 1-on-1 or small-group tutoring session** booked inside the platform.
- Key participants: **User(s)**, **Tutor** (certified), **Moderator** (certified).
- Session lifecycle: `created → notified → in_progress → completed` (or `cancelled / abandoned`).
- Session attributes:
  - `certification` — category + subject + level (validated against master subject map).
  - `lang` — tutor and moderator must both support the requested language.
  - `tuition_slots` — time-slot array; tutor and moderator availability is checked and blocked atomically.
  - `type` — one of: `quiz, education, certification, services, game, seminar`.
  - `session_fee` — credit cost per session (1–10,000 credits or free).
  - `user_payments` — per-user cost breakdown with credit type (earned / donated / referral / purchased / none).
  - `meeting_url` + `video_recording_link` — live session and post-session recording.
  - `ratings` — tutor, moderator, and user all provide session ratings (0–10 scale).
  - `notes` — separate tutor / moderator / user notes.
  - `status_log` — full timestamped audit trail of lifecycle transitions.
- Slots are unblocked automatically on cancellation or abandonment.
- Accessible from the Services Dashboard → **Tuitions** tile (gated by `tuitions` service flag).

### 1.5 Education Loans (`educationloanmodel.js`)

- Full structured **loan application pipeline** for education financing.
- Application fields (all PII-encrypted at rest with a per-record DEK):
  - **Personal** — name, DOB, gender, phone, email, address.
  - **Educational** — institution name, course type, duration, HSC/graduation marks percentage, entrance exam score, total course fees, fee structure URL, admission letter URL.
  - **Financial** — family annual income, applicant income, co-borrower income, existing liabilities.
  - **Loan details** — amount requested (0–₹1 Cr range), purpose, repayment tenure, interest rate, EMI, grace period, prepayment options.
  - **Collateral** — type, value, documentation URL.
  - **Guarantor** — name, relation, KYC and bank statement URLs.
  - **Disbursement** — bank name, account number, IFSC code.
  - **Subsidy / Category** — category certificate, applicable government scheme, subsidy eligibility proof.
  - **Post-course** — expected employment, placement proof URL.
- Application statuses: `Draft → submitted → reviewed → approved / rejected`.
- Loan Provider Assignment — admin assigns an external loan provider ID.
- Document Request workflow — admin can request additional documents.
- Assignment History — full audit trail of provider re-assignments.
- All sensitive fields use **AES-256-CBC DEK encryption** (admin key ring + optional user secret).
- Numeric fields (income, amounts, marks) are also encrypted AND indexed via weight-based sorted sets for range queries.
- N-gram full-text search on institution name, course type, status (unsecure) and on encrypted PII fields (secure HMAC n-gram).
- Accessible from Services Dashboard → **Education Loans** tile (gated by `eduloans` service flag).

### 1.6 School / College Groups (`schoolmodel.js`)

- Schools and colleges can **register as an entity** on the platform and maintain their own learner group.
- School profile includes:
  - **Identity** — name, type, established year, country, region, coordinates (lat/lng).
  - **Classification** — management type (Government / Aided / Private / Other), school category (Primary → Senior Secondary), location type (Urban / Rural), size band (S / M / L / XL).
  - **Academics** — grades offered (min–max), curricula (IB, CBSE, IGCSE, …), academic session (start/end month).
  - **Digital** — website, primary language, additional languages, social links.
  - **CRM** — lifecycle stage (lead / qualified / pilot / contract / churned), lead source, priority score.
  - **Adoption** — adoption status (not started / pilot / active / dormant), join code for member onboarding, integration flags (Google Classroom, Microsoft Teams, …).
  - **Size** — student estimate, teacher estimate.
  - **People** — principal name, email, phone; additional contacts.
- Each school has a `primary_user_bucket` — a shared group that all school members join automatically.
- Schools can have **editors** — a list of user IDs that can update the school profile.
- Encrypted at rest (full-payload DEK encryption; public snapshot remains unencrypted for search).
- Accessed from Services Dashboard → **School** tile (gated by `school` service flag) and → **Groups** tile (`/buckets`).

### 1.7 Sponsor Ads (`sponsormodel.js`)

- Brands and organisations can become **sponsors** on the platform.
- Sponsors fund/supply prize items, and in return their **ad messages appear linked to prize visibility**.
- Sponsor profile:
  - `name`, `description`, `logo_url`, `image_assets[]` — brand assets (served from Spaces CDN).
  - `landing_page_url` — click destination for the ad.
  - **Demographic targeting** — `min_age`, `max_age`, `languages[]`, `countries[]`, `edu_levels[]`.
  - `messages[]` — individual ad creatives: title, body, image, CTA text + URL, locale, tags, enable/disable toggle.
  - Approval workflow: `edited → submitted → approved / rejected` (admin review required before live ads go live).
- **Analytics per sponsor:**
  - `view_count` / `click_count` — global totals.
  - Per-day breakdown (`daily_hash` keyed by `YYYYMMDD`).
  - Per-product and per-message view / click tracking (separate sorted sets).
- PII (phone, email) encrypted with per-sponsor DEK.
- Sponsors access a dashboard (admin-side) to manage messages, review analytics, and track approval status.

---

## 2. Proposed New / Updated Sections for `index.html`

**Placement on `index.html`:**
- Sections 2.A, 2.B, 2.C — insert after `#credits-rewards` and before `#who-its-for`
- Section 2.D — these are new audience cards inserted **inside** the existing `#who-its-for` section, not between sections

Sections 2.E–2.G are full page specs for the three new standalone pages.

### 2.A  Section — "More Than Quizzes"

**Anchor:** `#game-types`
**Section kicker:** More ways to play
**Heading:** Four game formats. All on the same credit and level system.

**Body paragraph:**
Beyond timed question rounds, Know To Win offers three more interactive formats — crossword, Sudoku, and an arithmetic slot-machine. All formats feed the same level and credit system, so learners can switch between them without losing their progress track.

**Feature grid (3 cards):**

#### Card 1 — Crossword
**Title:** Word-based crossword grids
**Body:**
Crossword puzzles are generated from the platform's own question and clue bank, calibrated to the learner's school level and language proficiency. Clues can be set in one language while the answers map to another, making crosswords a natural vocabulary and comprehension exercise. Every grid is unique — the same grid is never served twice.

#### Card 2 — Sudoku
**Title:** Logic grids, four difficulty bands
**Body:**
Standard 9×9 Sudoku puzzles generated on-demand with four calibrated difficulty settings:
- **Easy** — approx. 46 clues, suitable for first-time solvers
- **Medium** — approx. 36 clues
- **Hard** — approx. 31 clues
- **Evil** — approx. 26 clues (the hardest setting offered; well above the theoretical 17-clue minimum)

Every puzzle is validated for a single unique solution before it is served. Fully resumable — pick up where you left off.

#### Card 3 — Maths Equations
**Title:** Arithmetic equations as a slot-machine puzzle
**Body:**
An 8-column grid where each column spins independently. Learners align the columns to form valid arithmetic equations — addition, subtraction, multiplication, or division. Easy mode uses single-digit numbers; hard mode uses two-digit numbers, demanding faster mental-maths recall. Trivially obvious zero equations are filtered out to keep every solve meaningful.

---

### 2.B  Section — "Micro-Tuitions"

**Anchor:** `#micro-tuitions`
**Section kicker:** Live learning sessions
**Heading:** Book a micro-tuition session directly in the app.

**Body paragraph:**
Know To Win connects learners with verified tutors and session moderators for short, structured live sessions. Sessions are subject- and level-scoped — the tutor and moderator must both hold the relevant certification and support the requested language before a booking can go through.

**How it works (steps):**
1. Learner selects a subject, level, and preferred language.
2. The platform matches available certified tutors and moderators.
3. A time-slot is reserved for all three parties simultaneously.
4. The live session runs through the meeting URL provided after booking.
5. After the session, learner, tutor, and moderator each leave a rating.

**Detail cards:**

**Card A — Session types**
Micro-tuitions can be scoped as education, certification prep, quiz support, game coaching, or a seminar — each mapped to the appropriate subject track.

**Card B — Credit-based session fee**
Sessions carry a configurable credit cost. Credit types accepted follow the same 4-pool system used across the rest of the platform (earned, donated, referral, purchased).

**Card C — Session recording**
Sessions can include a post-session video recording link, giving learners a permanent reference after the live call ends.

**Card D — Fully resumable and auditable**
Every lifecycle change — created, notified, in progress, completed, cancelled — is logged with a timestamp, and the session state can be resumed if interrupted.

---

### 2.C  Section — "School & College Groups"

**Anchor:** `#school-groups`
**Section kicker:** Institutional access
**Heading:** Schools and colleges can maintain their own learner groups.

**Body paragraph:**
Educational institutions can register on Know To Win and manage a dedicated learner group. Once a school is onboarded, all members who join through the school's join code are added to a shared group automatically — giving administrators visibility over their cohort's activity and progress.

**Key capabilities (grid):**

**Card 1 — School profile**
Name, type (primary / secondary / tertiary), grades offered, curricula (CBSE, IGCSE, IB, state board, …), academic session, website, and language settings are all captured at registration.

**Card 2 — Learner group (bucket)**
Every registered school is backed by a primary user group. Learners join via a short join code. No manual enrolment by an admin is required.

**Card 3 — Activity ownership**
School administrators can assign editors — users who can update the school record and moderate group membership without requiring platform-level admin access.

**Card 4 — Classification and adoption tracking**
Schools are tagged by management type (Government / Aided / Private), location (Urban / Rural), and size band — and their adoption lifecycle (pilot / active / dormant) is tracked separately to help understand platform engagement patterns.

---

### 2.D  Teaser blocks for new pages (inside `#who-its-for`)

These are short audience cards added **inside the existing `#who-its-for` section** — not separate sections between `#credits-rewards` and `#who-its-for`.

**Audience card — Learners seeking finance (→ `services.html`)**
**Title:** Learners planning further education
**Body:** The platform includes a structured education loan application module. Submit your details, track your application status, and have it routed to a loan provider — all within the same platform.
**CTA:** `<a href="/services" data-page-link="services">View education loan services →</a>`

**Audience card — Sponsors / Brands (→ `partners.html`)**
**Title:** Brands and organisations
**Body:** Sponsors can associate their prize items with targeted ad messages that reach learners at the exact moment they are engaging with rewards. Full approval workflow, demographic scoping, and per-message analytics are included.
**CTA:** `<a href="/partners" data-page-link="partners">Learn about sponsorship →</a>`

---

### 2.E  New Page — `partners.html`

**`data-page-key`:** `partners`
**`<title>`:** `Know To Win | Sponsor the Platform and Reach Learners`
**`<meta description>`:** `Become a Know To Win sponsor. Fund prizes, submit ad creatives, and reach learners by age, language, country, and education level. Full analytics and approval workflow included.`
**`<link rel="canonical">`:** `https://knowtowin.com/partners`
**JSON-LD `@type`:** `WebPage`

**Page hero:**
- Kicker: For sponsors and brands
- `<h1>`: Sponsor prize items and connect with learners through targeted ad messages.
- Body: Organizations and brands that supply prize items can become Know To Win sponsors. After an admin approval step, your ad creatives appear linked to prize visibility — reaching learners at the point they are considering or redeeming a reward.

**Section 1 — `#how-it-works`**
- Kicker: How sponsorship works
- `<h2>`: A simple four-step workflow from registration to live ads.
- Steps:
  1. Register a sponsor profile — name, description, logo, landing page URL.
  2. Submit ad messages for review — each creative includes a title, body, image, and CTA.
  3. Platform administrators approve or return each submission with a written reason.
  4. Approved messages go live and appear linked to relevant prize items.

**Section 2 — `#targeting`**
- Kicker: Reach the right audience
- `<h2>`: Scope your messages by age, language, country, and education level.
- Body: Targeting dimensions available:
  - Age range (minimum and maximum age)
  - Languages (one or more)
  - Countries
  - Education levels

**Section 3 — `#analytics`**
- Kicker: Track performance
- `<h2>`: View counts, click counts, and per-day engagement — per message.
- Detail cards:
  - Global view and click totals across all messages
  - Per-day breakdown (daily hash, keyed by date)
  - Per-message view and click stats to compare creative performance

**Section 4 — `#approval`**
- Kicker: Content workflow
- `<h2>`: Every ad creative goes through a submission and approval workflow.
- Body: Sponsored content is never shown to learners before an administrator has reviewed and approved it. If a submission is rejected, the sponsor receives a written reason and can revise and resubmit. Messages can be enabled or disabled individually at any time.

**CTA card:**
- Heading: Interested in sponsoring?
- Body: Contact the Know To Win team to discuss a sponsorship arrangement.
- CTA button: Use the support page → links to `/support` via `data-page-link="support"`

---

### 2.F  New Page — `services.html`

**`data-page-key`:** `services`
**`<title>`:** `Know To Win | Education Loans and Platform Services`
**`<meta description>`:** `Apply for an education loan directly through Know To Win. Submit your application, track its status, and get routed to a loan provider — all with fully encrypted personal and financial data.`
**`<link rel="canonical">`:** `https://knowtowin.com/services`
**JSON-LD `@type`:** `WebPage`

**Page hero:**
- Kicker: Platform services
- `<h1>`: Apply for an education loan without leaving the platform.
- Body: Know To Win includes a structured loan application module that allows learners to submit, track, and manage an education loan request. All personally identifiable and financial data is encrypted at rest — each application uses its own unique encryption key.

**Section 1 — `#what-it-covers`**
- Kicker: Application scope
- `<h2>`: A complete application — personal, educational, financial, and legal.
- Field groups (info cards):
  - **Personal** — full name, date of birth, gender, phone, email, address
  - **Educational** — institution, course type, duration, marks records (HSC/graduation %, entrance exam score), total course fees, fee structure URL, admission letter URL
  - **Financial** — family annual income, applicant income, co-borrower income, existing liabilities
  - **Loan specifics** — amount requested (up to ₹1 Cr), purpose, repayment tenure, interest rate, EMI estimate, grace period, prepayment options
  - **Collateral** — type, valuation, documentation URL
  - **Guarantor** — name, relationship, KYC and bank statement documents
  - **Disbursement** — bank name, account number, IFSC code
  - **Subsidy / Category** — category certificate, applicable government scheme, subsidy eligibility proof
  - **Post-course** — expected employment role, placement proof URL

**Section 2 — `#status-flow`**
- Kicker: Application lifecycle
- `<h2>`: Track your application from draft to decision.
- Status steps:
  1. **Draft** — Fill in your details at your own pace. Nothing is submitted until you choose to submit.
  2. **Submitted** — Your completed application is sent for review by the platform team.
  3. **Under review** — Platform administrators route the application to a loan provider. Additional document requests may be raised at this stage.
  4. **Decision** — Application is approved or returned with notes requesting revision.

> **Copy note (factual):** Provider assignment is admin-driven via `assignToProvider(providerID)`. Do not use "matched" or "automatically matched" — use "assigned" or "routed by the platform team".

**Section 3 — `#data-security`**
- Kicker: Your data is protected
- `<h2>`: All sensitive fields are encrypted at rest with a per-application key.
- Body: Every education loan application uses a unique Data Encryption Key (DEK). Personal details, contact information, income figures, bank account details, and guarantor information are all encrypted with this key before they are stored. Access to decrypted data is controlled by the platform's admin key system.

> **Copy note (factual):** The model supports admin-key-based decryption paths. There is no provider-specific decryption path in the codebase.

**CTA card:**
- Heading: Ready to apply?
- Body: Log in to the platform and navigate to Services → Education Loans to start your application.
- CTA button: Open the app → `https://app.knowtowin.com/`

---

### 2.G  New Page — `downloads.html`

**`data-page-key`:** `downloads`
**`<title>`:** `Know To Win | Download the App`
**`<meta description>`:** `Download Know To Win on Android or access the web app directly. Play quiz games, earn credits, and redeem rewards on your preferred platform.`
**`<link rel="canonical">`:** `https://knowtowin.com/downloads`
**JSON-LD `@type`:** `WebPage` + `SoftwareApplication` entries per platform

**Page hero:**
- Kicker: Get the app
- `<h1>`: Download Know To Win and start playing.
- Body: Know To Win is available on the web and as a native Android app. All platforms connect to the same account, so credits and progress are shared regardless of where you play.

**Section 1 — `#platforms`**
- Kicker: Available on
- `<h2>`: Download Know To Win for your platform.
- Platform cards (4 cards, laid out in a responsive 2×2 or 4-column grid):

  **Card 1 — Android**
  - Icon: Android
  - `<h2>` or card heading: Android
  - Body: Install the Know To Win app from the Google Play Store for a native experience on Android phones and tablets.
  - CTA: Get it on Google Play → *(Release dependency: link to be supplied)*

  **Card 2 — macOS**
  - Icon: Apple / macOS
  - Heading: macOS
  - Body: The macOS desktop app is built with the Electron shell. Download the `.dmg` installer and run it directly — no App Store required.
  - CTA: Download for macOS → *(Release dependency: link to be supplied)*

  **Card 3 — Linux**
  - Icon: Linux / terminal
  - Heading: Linux
  - Body: A Linux build is available as an AppImage. Download it, mark it executable, and run — no installation step needed.
  - CTA: Download for Linux → *(Release dependency: link to be supplied)*

  **Card 4 — Windows**
  - Icon: Windows
  - Heading: Windows
  - Body: Download the Windows installer (`.exe` or `.msi`) and run it to install the Know To Win desktop app.
  - CTA: Download for Windows → *(Release dependency: link to be supplied)*

> **Note:** The web app (`app.knowtowin.com`) is already linked on the main landing page and does not need a card here.

**Section 2 — `#system-requirements`**
- Kicker: Requirements
- `<h2>`: What you need to run Know To Win.
- Requirements table:

  | Platform | Requirement |
  |---|---|
  | Android | Android 6.0 (Marshmallow) or later. |
  | macOS | macOS 11 (Big Sur) or later. Apple Silicon and Intel supported. |
  | Linux | 64-bit distribution. AppImage requires FUSE support (standard on most distros). |
  | Windows | Windows 10 or later (64-bit). |

**Section 3 — `#same-account`**
- Kicker: One account, every platform
- `<h2>`: Your credits and progress follow you across devices.
- Body: Sign in with the same account on web, Android, or desktop. Credits earned on one platform are spendable on another. Your quiz levels, game history, and group memberships are synced automatically.

---

## 3. Updates to Existing Sections

### 3.1 Hero Highlights (existing `<ul class="hero-highlights">`)

Add a fourth bullet to the existing three:

> Live micro-tuition sessions, crossword and Sudoku game formats, and an education loan module — all inside the same platform.

### 3.2 Proof Strip (existing `.proof-grid` 3 cards)

Add a fourth stat card:

> **4 game formats** — Quiz rounds, Crossword, Sudoku, and Maths Equations all run on the same level and credit system, so practice in one format counts toward overall progress.

> **Consistency rule:** Everywhere in the copy the count of game formats is stated, use **4** (Quiz + Crossword + Sudoku + Maths Equations). Do not drop Sudoku from any list.

### 3.3 `#why-it-works` — Feature Grid

Add two more `<article class="feature-card">` entries:

**Card 5 — Multiple game formats**
Different learners retain information differently. Quizzes, crosswords, and equation grids all target the same knowledge but through different cognitive routes.

**Card 6 — Institutional support built in**
School groups, educator tools, and a loan module mean the platform works for individuals and entire cohorts without requiring separate infrastructure.

### 3.4 `#who-its-for` — Audience Cards

- **Expand existing** — Schools and Coaching Teams: add mention of school registration, join-code onboarding, and group dashboard.
- **Add new teaser cards**: Learners seeking finance (→ `services.html`) and Brands/Sponsors (→ `partners.html`) — see §2.D for copy.

### 3.5 FAQ — Add Three New Items

**Q: What game types are available?**
A: Know To Win currently offers four game formats: timed quiz rounds, crossword puzzles calibrated to school level and language, Sudoku, and a maths equations slot-machine. All four run on the same credit and level system.

**Q: Can my school use the platform as a group?**
A: Yes. Schools and colleges can register an institutional profile and issue a join code. Students who join through that code are automatically added to the school's learner group.

**Q: Can I apply for an education loan through the app?**
A: Yes. The platform includes a structured loan application module. Once submitted, the application is routed to a designated loan provider. All personal and financial data is encrypted at rest.

---

## 4. Navigation and Anchor Updates

### 4.1  `index.html` nav links

| Label | Destination | New? |
|---|---|---|
| Why It Works | `#why-it-works` | Existing |
| How It Plays | `#how-it-plays` | Existing |
| Game Types | `#game-types` | **NEW** |
| Micro-Tuitions | `#micro-tuitions` | **NEW** |
| Credits & Rewards | `#credits-rewards` | Existing |
| School Groups | `#school-groups` | **NEW** |
| Who It's For | `#who-its-for` | Existing |
| Downloads | `/downloads` (`data-page-link="downloads"`) | **NEW** |
| Support | `/support` (`data-page-link="support"`) | Existing |
| FAQ | `#faq` | Existing |

### 4.2  Footer links (all pages)

Add to the existing footer `<nav>` on every page:
```html
<a href="/downloads" data-page-link="downloads">Downloads</a>
<a href="/services"  data-page-link="services">Services</a>
<a href="/partners"  data-page-link="partners">Partners</a>
```

### 4.3  Nav links for new pages

Each new page (`services.html`, `partners.html`, `downloads.html`) should use a nav consistent with `support.html`:
- Home (`data-page-link="index"`)
- Their own in-page anchor links
- Language switcher widget (rendered from manifest; no changes to the widget HTML needed)
- CTA: "Open the app"

### 4.4  `page_routes.json` additions

`apex/assets/i18n/page_routes.json` must add these entries under `pages`:
```json
"services":  { "EN": "/services",  "HI": "/services_HI.html"  },
"partners":  { "EN": "/partners",  "HI": "/partners_HI.html"  },
"downloads": { "EN": "/downloads", "HI": "/downloads_HI.html" }
```
`index.html` and all other pages will automatically show language-aware links to these pages once the manifest is updated — no per-page JS change needed.

---

## 5. SEO Considerations

- All new `index.html` sections use exactly the same semantic pattern as existing sections: `<section class="section" id="...">`, `<div class="shell">`, `<div class="section-head reveal">`, `<h2>`, `<p>`.
- Each new page has its own `<title>`, `<meta name="description">`, `<link rel="canonical">`, OG/Twitter tags, and JSON-LD.
- The FAQ JSON-LD block (`@type: FAQPage`) in `index.html` should be updated to include the 3 new Q&A pairs.
- All new heading text should remain factual and keyword-natural; avoid keyword stuffing.
- `apex/sitemap.xml` must add `/services`, `/partners`, `/downloads`.

---

## 6. Localization — Translated Pages for All New Content

### Rules (same as existing `index_HI.html` approach)

- Brand names (`Know To Win`, `app.knowtowin.com`) remain unchanged.
- Technical labels (`CBSE`, `IGCSE`, `IFSC`, `IB`, `EMI`, `DEK`) remain in their original form.
- All product/credit-type terms (`Earned`, `Donated`, `Referral`, `Purchased`) should be transliterated or kept in parentheses alongside the Hindi translation.
- Game format names (Crossword, Sudoku, Math Slot Machine) can be transliterated.
- `data-page-key`, `data-lang-code`, `data-page-link`, `data-legal-link` attributes must be preserved exactly.
- `<html lang>` changes to `hi`; `data-lang-code` changes to `HI`.
- **Canonical + reciprocal hreflang (required on BOTH versions):** Each translated page must include:
  - `<link rel="canonical" href="https://knowtowin.com/<page>_HI.html">` on the `_HI.html` file
  - `<link rel="alternate" hreflang="en" href="https://knowtowin.com/<page>">` pointing to the EN canonical
  - `<link rel="alternate" hreflang="hi" href="https://knowtowin.com/<page>_HI.html">` pointing to itself
  - `<link rel="alternate" hreflang="x-default" href="https://knowtowin.com/<page>">` pointing to the EN canonical
  - The EN canonical file must also carry a `<link rel="alternate" hreflang="hi" ...>` pointing to the `_HI.html` file.

### Files to create for each new page

| English file | Hindi file | `page_routes.json` key |
|---|---|---|
| `apex/services.html` | `apex/services_HI.html` | `services` |
| `apex/partners.html` | `apex/partners_HI.html` | `partners` |
| `apex/downloads.html` | `apex/downloads_HI.html` | `downloads` |
| `apex/index.html` (new sections) | `apex/index_HI.html` (parity update) | `index` |

> **URL format rule (confirmed from `page_routes.json`):** EN canonical entries have no `.html` suffix (e.g., `"/services"`). Translated entries **must include `.html`** (e.g., `"/services_HI.html"`), matching the existing `"/index_HI.html"` pattern.

> Additional languages (ZU, SW, DE, AM, CN, etc.) can be added by:
> 1. Creating `<file>_<LANG>.html` with a matching translation.
> 2. Adding `"<LANG>": "/<file>_<LANG>.html"` to the relevant `page_routes.json` entry.
> 3. Expanding the nginx regex to include the page name if not already listed.

---

## 7. Implementation Order (Recommended)

### Phase 1 — `index.html` content additions
1. Add `#game-types` section (crossword, sudoku, maths).
2. Update hero highlights bullet + proof strip + `#why-it-works` cards.
3. Add `#micro-tuitions` section.
4. Add `#school-groups` section.
5. Update `#who-its-for` audience cards (teaser cards for services + partners).
6. Update FAQ (3 new Q&A items) + FAQ JSON-LD block.
7. Add Downloads, Services, Partners links to `index.html` nav and footer.

### Phase 2 — New pages (English)
8. Create `apex/services.html` (education loans page).
9. Create `apex/partners.html` (sponsors page).
10. Create `apex/downloads.html` (app downloads page).

### Phase 3 — Infrastructure
11. Update `apex/assets/i18n/page_routes.json` — add EN (no `.html`) and HI (with `.html`) entries for `services`, `partners`, `downloads`.
12. Update `nginx.conf.template`:
    - Add 3×3 explicit location blocks (`/services`, `/services/`, `/services.html` pattern) for each new page.
    - Expand the translated-file regex from `^/(index|support)_[A-Z][A-Z]\.html$` to `^/(index|support|services|partners|downloads)_[A-Z][A-Z]\.html$`.
13. Update `apex/sitemap.xml` with the three new canonical URLs.

### Phase 4 — Hindi translations
14. Update `apex/index_HI.html` with all new sections from Phase 1.
15. Create `apex/services_HI.html`.
16. Create `apex/partners_HI.html`.
17. Create `apex/downloads_HI.html`.
18. Update `page_routes.json` with `HI` entries (`.html` suffix format) for the three new pages.
    - Each translated file must carry reciprocal EN/HI `hreflang` alternate link tags.

### Downloads URL placeholder policy
> The downloads page structure and copy are complete and implementation-ready. The specific Play Store URL and desktop build URLs are **release-day dependencies** — the page should be built with disabled/"Coming soon" CTAs and the URLs swapped in at release without any structural HTML change required.

### Phase 5 — Additional languages (future)
> Any language listed in `page_routes.json > languages[]` that has a translated file for a given page will appear automatically in that page's language switcher. No JS changes required.
