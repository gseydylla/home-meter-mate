# Utility Meter Calculator — Offline App

An installable, offline-first app for calculating gas, electricity, and water bills from meter readings. All data stays on the device — no accounts, no internet needed.

## Screens

### 1. First-run language picker
Shown once on first open: English / Русский / Türkmençe. Saved locally, changeable later in Settings.

### 2. Home
Three large buttons: Gaz, Tok, Suw — each themed with its own accent color and icon. Top bar has Settings and History icons.

### 3. Utility screen (per utility)
- Input: previous meter reading (pre-filled from the last saved record for that utility)
- Input: current meter reading
- Buttons: Save and Calculate
- Calculate shows: units consumed (current − previous), unit price, total cost
- Save stores the record (utility, previous, current, units, price used, total, date) and updates the "previous reading" default for next time
- Validation: current must be ≥ previous, numbers only

### 4. History
List of saved records grouped by utility with a filter (All / Gaz / Tok / Suw). Each row: date, units, total cost. Swipe/long-press or a delete icon to remove a record; option to clear all.

### 5. Settings
- Theme: Light / Dark / System
- Language: English / Russian / Turkmen
- Prices: editable unit price for gas, electricity, water (with unit labels m³ / kWh / m³)
- Currency label (default TMT)
- Clear all data

## Design direction
Clean utility-app look, large tappable controls, mobile-first single column, distinct accent per utility (gas = warm amber, electric = yellow-gold, water = blue), full light/dark theming via design tokens.

## Technical notes
- Data persistence: browser `localStorage` (readings, prices, language, theme) accessed only after hydration to keep SSR safe.
- Translations: a small local dictionary module with the three locales; no i18n backend.
- Installable + offline: web app manifest with icons and a generated service worker (`vite-plugin-pwa`, NetworkFirst navigations), registered only in the published app — offline mode won't be active inside the editor preview.
- Routes: `/` (home), `/u/$utility`, `/history`, `/settings`, each with its own head metadata.
- No backend or database is needed.
