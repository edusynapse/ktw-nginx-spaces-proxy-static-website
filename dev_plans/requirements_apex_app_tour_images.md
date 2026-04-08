# Requirements: Apex App Tour Page Images
**Target page:** `apex/app.html`  
**Status:** Asset requirements only

---

## Purpose

This file contains the image requirements for the public app tour page.

These requirements should stay out of the page copy itself.

---

## Required image set

### 1. Hero image

- Filename base: `student-games-dashboard`
- Placement: hero right column
- Purpose: main student dashboard / home / games overview
- Recommended exports:
  - `student-games-dashboard-540.avif`
  - `student-games-dashboard-720.avif`
  - `student-games-dashboard-960.avif`
- Weight target:
  - `150 KB` to `220 KB`

### 2. Real prizes image

- Filename base: `real-prizes-prizebox`
- Placement: real prizes section
- Purpose: prize box / prize detail / useful item catalog
- Recommended exports:
  - `real-prizes-prizebox-360.avif`
  - `real-prizes-prizebox-540.avif`
  - `real-prizes-prizebox-720.avif`
- Weight target:
  - `70 KB` to `130 KB`

### 3. Gameplay image

- Filename base: `quiz-round-gameplay`
- Placement: student app tour card 1
- Purpose: quiz or educational game round
- Recommended exports:
  - `quiz-round-gameplay-360.avif`
  - `quiz-round-gameplay-540.avif`
  - `quiz-round-gameplay-720.avif`
- Weight target:
  - `70 KB` to `130 KB`

### 4. Progress image

- Filename base: `progress-streak-level-up`
- Placement: student app tour card 2
- Purpose: performance / level / streak / stats
- Recommended exports:
  - `progress-streak-level-up-360.avif`
  - `progress-streak-level-up-540.avif`
  - `progress-streak-level-up-720.avif`
- Weight target:
  - `70 KB` to `130 KB`

### 5. Checkout image

- Filename base: `checkout-window-score-sheet`
- Placement: student app tour card 3
- Purpose: checkout windows / score sheet / eligibility context
- Recommended exports:
  - `checkout-window-score-sheet-360.avif`
  - `checkout-window-score-sheet-540.avif`
  - `checkout-window-score-sheet-720.avif`
- Weight target:
  - `70 KB` to `130 KB`

### 6. Tuition image

- Filename base: `microtuition-booking-screen`
- Placement: student app tour card 4
- Purpose: tuition search / booking / student support
- Recommended exports:
  - `microtuition-booking-screen-360.avif`
  - `microtuition-booking-screen-540.avif`
  - `microtuition-booking-screen-720.avif`
- Weight target:
  - `70 KB` to `130 KB`

---

## Optional image

### 7. Jobs image

- Filename base: `jobs-listings-screen`
- Placement: optional later addition in the "Beyond games" area
- Purpose: jobs listings / opportunities flow
- Recommended exports:
  - `jobs-listings-screen-360.avif`
  - `jobs-listings-screen-540.avif`
  - `jobs-listings-screen-720.avif`
- Weight target:
  - `70 KB` to `130 KB`

---

## Format rules

- Preferred format: `AVIF`
- Fallback format: `WebP`
- Avoid PNG unless transparency is required
- Keep portrait screenshots only unless a specific section needs landscape

---

## Responsive sizing rules

### Hero image

- Variants: `540w`, `720w`, `960w`
- Use the `960w` variant only where the layout benefits from it

### All body screenshots

- Variants: `360w`, `540w`, `720w`

---

## Delivery guidance

- Lazy-load all screenshots below the hero
- Set explicit width and height to avoid layout shift
- Use meaningful alt text per image
- Keep text in screenshots readable after compression
- Capture from clean production-like states with no debug overlays

---

## Suggested alt text directions

- `student-games-dashboard`: student dashboard showing games, credits, prizes, and progress
- `real-prizes-prizebox`: prize box showing useful real-world reward items
- `quiz-round-gameplay`: active quiz round inside the Know To Win app
- `progress-streak-level-up`: student performance screen showing streaks and level progress
- `checkout-window-score-sheet`: checkout window or score sheet showing redemption timing or eligibility
- `microtuition-booking-screen`: tuition search or booking screen for student support

---

## Suggested asset directory

Recommended location:

- `apex/assets/img/app-tour/`

If implemented, keep the naming flat and predictable.
