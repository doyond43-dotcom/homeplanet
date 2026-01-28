# UI LOCK — Calm Core (0.1.0-calm-core)

This UI is considered **locked** so we can build behavior without visual churn.

## Allowed changes (without bumping UI_VERSION)
- Bug fixes (broken alignment, overflow, accessibility issues)
- Mobile-only adjustments
- Minor spacing tweaks that do not change the layout structure

## Changes that REQUIRE bumping UI_VERSION
- Repositioning major blocks/cards
- Changing typography scale / title hierarchy
- Changing component width rules / centering strategy
- Adding/removing large UI sections

## Current layout intent
- Everything stays centered and calm
- Maximum readability, minimal noise
- “Truth feed” stays the visual anchor

If you change layout, bump UI_VERSION and write the reason here.
