# Plan: Apex App Tour Page
**Target file:** `apex/app.html`  
**Status:** Plan only - no HTML/CSS changes in this document.

---

## 0. Goal

Create a dedicated app page that shows the product as a real student-facing learning platform, not just a list of capabilities.

The page should communicate this core journey clearly:

1. A student joins the platform.
2. The student learns through quiz-based and game-based practice.
3. Strong play builds streaks and levels.
4. Wins generate **earned credits**.
5. Earned credits can be used for **real prizes** and also for services such as tuitions and jobs-related support.

This page should remain primarily student-first, while still acknowledging the platform roles for schools, sponsors, and corporates.

---

## 1. Product Framing

### 1.1 Primary page promise

The strongest framing is:

**Learn through games. Earn real prizes. Unlock more support.**

This is stronger than a generic "feature tour" because it reflects the actual retention loop:

- learning through repeated educational gameplay
- progress through streaks and level-ups
- real-world motivation through prize redemption
- extended value through tuitions, jobs, and school/group participation

### 1.2 Positioning priorities

The page should prioritize the following ideas in this order:

1. **Game-based education for students**
2. **Real-world prizes, not badges**
3. **Progress through streaks and level-ups**
4. **Earned credits as a meaningful asset**
5. **Tuitions, jobs, and services as follow-on value**
6. **Schools, sponsors, and corporates as ecosystem participants**

### 1.3 What the page should not become

The page should not become:

- a duplicate of the landing page
- a downloads page
- a stakeholder pitch page dominated by sponsors or schools
- a dense technical feature inventory

---

## 2. Factual Product Basis

This plan is based on app and backend surfaces already present in the codebase.

### 2.1 Student-facing app areas confirmed in Flutter routes

The route map already exposes the major student and platform surfaces:

- games and dashboards
- tuitions
- jobs
- performance / stats
- prize box
- checkout windows
- won prizes
- education loans
- services dashboard
- settings
- buckets / groups

Reference:

- `know_to_win/lib/helpers/routes.dart`

Relevant route examples:

- `/games_dashboard`
- `/tuitions`
- `/jobs`
- `/stats`
- `/prizebox`
- `/checkout_windows`
- `/won_prizes`
- `/education_loans`
- `/services_dashboard`
- `/settings`
- `/buckets`

### 2.2 Level-up / streak basis

The backend confirms that streaks are part of level progression by category-subject-level triplet.

Reference:

- `ktw_do_react_api/models/userperformancemodel.js`

### 2.3 Checkout window basis

The backend confirms a fixed-window prize / order flow with active windows, utilization tracking, and score sheets.

Reference:

- `ktw_do_react_api/models/checkoutwindowmodel.js`

### 2.4 Settings and language basis

The app supports language selection and persisted app settings, and backend defaults include theme and interaction settings.

References:

- `know_to_win/lib/app_settings_page.dart`
- `know_to_win/lib/helpers/language.dart`
- `ktw_do_react_api/lib/app_settings_defaults.js`

### 2.5 School and sponsor basis

The platform also has school and sponsor models, but those should remain secondary on this page.

References:

- `ktw_do_react_api/models/schoolmodel.js`
- `ktw_do_react_api/models/sponsormodel.js`

---

## 3. Information Architecture Recommendation

### 3.1 Recommended URL

Create a dedicated page:

- `apex/app.html`

Recommended canonical URL:

- `/app`

### 3.2 Relationship to existing pages

Use the following page split:

- `index.html`: broad landing-page narrative and top-of-funnel entry
- `downloads.html`: installers, platform availability, requirements
- `app.html`: product tour with screenshots and real user flows
- `services.html`: education-loan-specific page
- `partners.html`: sponsor-specific page

This avoids overloading the landing page while giving search engines and users a specific product-tour destination.

---

## 4. Recommended Page Structure

### 4.1 Hero

**Kicker:** App tour  
**H1:** Learn through games. Earn real prizes. Unlock more support.

**Hero body goals:**

- establish the app as a student learning platform
- state that prizes are real-world items
- mention tuitions and jobs as extended support, not the first message

**Hero media:**

- 1 real screenshot only
- Use a dashboard or games-home screenshot
- Do not use an abstract illustration as the primary media

### 4.2 Section: How the app works

Use a 4-step strip:

1. Play learning games
2. Build streaks and level up
3. Earn credits from strong performance
4. Use earned credits for prizes and support services

This is the core conversion section and should appear above the fold or immediately below hero.

### 4.3 Section: Real prizes, not digital badges

This should be a dedicated section, not a passing mention.

Purpose:

- clarify the differentiator
- show why the platform matters in under-resourced environments
- make the motivation system concrete

Messaging points:

- prizes are real-world items
- examples can include books, stationery, food items, and similar useful goods
- prize booking uses a cart-like flow
- collection/redemption works through defined checkout windows

This section should use one screenshot from the prize box / prizes / cart flow.

### 4.4 Section: Student app tour

This is the main screenshot-led section.

Recommended subsections:

- Games dashboard
- In-game learning experience
- Streaks, levels, and progress
- Prize box and reward flow
- Checkout windows and collection timing
- Tuitions or jobs

### 4.5 Section: More than gameplay

Short supporting section for:

- tuitions
- jobs
- education loan services

This section should frame these as extensions of the student journey, not unrelated product add-ons.

### 4.6 Section: For schools, sponsors, and corporates

Keep this section short.

Purpose:

- acknowledge the wider ecosystem
- show that learning can also be organized at group level
- avoid letting secondary stakeholders dominate the page

Suggested treatment:

- a small 3-card teaser band
- each card links outward later if dedicated pages are expanded

### 4.7 Section: Settings, language, and accessibility

This should be a supporting section near the lower part of the page.

Suggested points:

- language selection
- app settings
- sound / haptics / interaction controls
- cross-platform continuity where verified

Important:

- do not make theming or language the main hook
- mention them only if the page includes real screenshots showing these surfaces clearly

### 4.8 Final CTA

Primary CTA:

- Open the web app

Secondary CTA:

- Download the app

Optional tertiary CTA:

- See prizes / See how it works

---

## 5. Screenshot Strategy

### 5.1 Recommended screenshot count

Use **6 primary screenshots**.

This is the best balance between:

- enough product proof
- strong SEO content depth
- manageable page weight
- not turning the page into a gallery dump

### 5.2 Recommended screenshot set

Use this exact sequence:

1. **Hero screenshot**
   - Best candidate: main dashboard or games dashboard

2. **Gameplay screenshot**
   - Best candidate: quiz or one of the educational game screens

3. **Progress screenshot**
   - Best candidate: performance / level / streak related screen

4. **Prize screenshot**
   - Best candidate: prize box, prizes page, or prize detail page

5. **Checkout window screenshot**
   - Best candidate: checkout windows or score sheet related screen

6. **Support extension screenshot**
   - Best candidate: tuitions or jobs

### 5.3 Optional seventh screenshot

Only add a seventh screenshot if needed for one of these reasons:

- the prize flow needs both catalog and cart / checkout context
- the school/group flow is important enough to justify a dedicated visual

Do **not** exceed 7 screenshots on the page body.

---

## 6. Screenshot Resolution and Asset Guidance

### 6.1 Source capture

Capture master screenshots at device-native resolution first.

Recommended master sources:

- modern phone portrait screenshots
- clean, production-like data
- no debug overlays
- no empty / placeholder-heavy states

### 6.2 Published responsive sizes

For page delivery, publish portrait screenshots at:

- `360w`
- `540w`
- `720w`

For the hero screenshot, optionally add:

- `960w`

### 6.3 Recommended display widths

Use these rendered widths in the page layout:

- Hero screenshot: around `560px` to `720px` rendered width depending on layout
- Body screenshots: around `320px` to `420px` rendered width in cards / feature bands

### 6.4 Recommended aspect handling

Prefer portrait screenshots shown inside:

- framed device mockups
- or clean rounded image cards

Do not crop so aggressively that the app UI becomes unreadable.

### 6.5 Format guidance

Preferred export order:

1. `AVIF`
2. `WebP`
3. JPEG fallback only if needed

Avoid PNG unless transparency is necessary.

### 6.6 Target per-image weights

Recommended budgets:

- Hero screenshot: `150 KB` to `220 KB`
- Body screenshots: `70 KB` to `130 KB`

### 6.7 Total page image budget

Aim for:

- above-the-fold images under `350 KB`
- total image payload around `900 KB` to `1.2 MB`

This keeps the page competitive while still using real product imagery.

---

## 7. SEO Guidance

### 7.1 Why the page helps SEO

A dedicated app page improves search competitiveness because it creates a focused destination for queries related to:

- app experience
- educational game app
- quiz learning app
- rewards-based learning app
- student learning platform

It also gives the site a place to anchor product screenshots and concrete UI descriptions.

### 7.2 SEO content principles

The page should:

- use real product screenshots
- use static HTML content, not screenshot carousels as the primary content
- give every screenshot meaningful surrounding copy
- avoid thin "gallery-only" sections

### 7.3 Image SEO requirements

Every screenshot should have:

- descriptive file names
- accurate alt text
- explicit width and height
- lazy loading below the fold

Example filename style:

- `student-games-dashboard.avif`
- `quiz-gameplay-screen.avif`
- `level-up-progress-screen.avif`
- `real-prizes-prizebox.avif`
- `checkout-window-screen.avif`
- `microtuition-booking-screen.avif`

### 7.4 Metadata recommendation

Add page metadata aligned to the app-tour use case, not just downloads.

Suggested title direction:

- `Know To Win App | Learn Through Games and Earn Real Prizes`

Suggested description direction:

- `Explore the Know To Win app for students. Play educational games, build streaks, earn credits, redeem real prizes, and access tuitions, jobs, and more.`

### 7.5 Structured data

Recommended schema:

- `WebPage`
- `SoftwareApplication`

If screenshots are strongly integrated and named assets are stable, consider image references within structured data later.

---

## 8. Performance Guidance

### 8.1 Rendering strategy

Use normal static sections, not a heavy interactive gallery.

Recommended:

- one hero screenshot eager-loaded
- all remaining screenshots lazy-loaded
- CSS-only framing where possible
- no large JS dependency for image display

### 8.2 Avoid

- autoplay media
- video embeds on initial load
- heavy carousels
- full-resolution screenshot downloads by default
- too many above-the-fold images

### 8.3 Best implementation pattern

For each screenshot:

- deliver responsive `srcset`
- set intrinsic dimensions
- compress aggressively but keep text readable

---

## 9. Messaging Recommendations

### 9.1 Core message to emphasize

The page should emphasize:

**This is an education platform that keeps students engaged through meaningful learning play and real-world rewards.**

### 9.2 Important message to protect

Do not let the prize language become gimmicky.

The page should frame prizes as:

- practical
- motivating
- relevant for underserved learners
- part of a sustained learning loop

### 9.3 Suggested tone

Use a tone that is:

- concrete
- credible
- socially aware
- product-focused

Avoid:

- overly sentimental language
- exaggerated "change the world" claims
- generic gamification clichés

---

## 10. Recommended Content Priorities

If page space is limited, prioritize content in this order:

1. Student learning loop
2. Real prizes
3. Progress / streaks / level-ups
4. Tuitions and jobs
5. Schools / sponsors / corporates
6. Settings / language / theming

This order is the best match for both user understanding and SEO clarity.

---

## 11. Implementation Notes

### 11.1 File additions likely needed

- `apex/app.html`
- `apex/app_HI.html` if Hindi rollout is included in the same phase
- screenshot assets under an appropriate static image path
- `page_routes.json` entry for `app`
- header / footer links updated if the page is promoted in navigation
- sitemap update
- nginx route entry for `/app` and translated variants if used

### 11.2 Navigation recommendation

The page should likely be linked from:

- landing-page hero or CTA area
- downloads page
- footer

Suggested nav label:

- `App`
- or `App Tour`

`App Tour` is clearer if the downloads page remains separately labeled `Downloads`.

---

## 12. Final Recommendation

The best strategy is to build **one dedicated, student-first app page with 6 strong screenshots**.

That page should:

- center the educational gameplay loop
- clearly explain earned credits and level-based progression
- strongly differentiate the platform through **real prizes**
- then expand into tuitions, jobs, school groups, and sponsor-supported ecosystem value

The page should **not** lead with theming, language support, or stakeholder admin features. Those belong in supporting sections only.

The app page should feel like a **product tour for a serious student platform**, not a generic feature dump or a lightweight marketing gallery.
