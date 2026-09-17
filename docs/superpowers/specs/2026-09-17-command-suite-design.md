# LIL SYNN Command Suite GUI Design

## Goal
Turn `/command`, `/command/admin`, and `/command/designer.html` into a large, cinematic, touch-friendly operations suite while preserving the working authenticated backend.

## Design
- Command Center: large status cards, quick actions, activity, deployment health, QA launcher, and clear navigation.
- Admin: expanded operational controls for deployments, Git, assets, environment presence, audit, QA, and guarded destructive actions.
- Designer: multi-file workspace with repository file selection, tabs, source editing, visual preview, responsive viewport controls, dirty state, and authenticated save operations.
- Visual QA: replace stale `/index2` defaults with canonical `/`, expose important routes and desktop/tablet/mobile presets, and make the workflow produce useful artifacts.
- Visual language: dark cinematic LIL SYNN control-room aesthetic, oversized typography, strong depth, luminous accents, responsive cards, and large touch targets.

## Safety
- Existing login/session implementation remains unchanged.
- Secrets are never displayed.
- Designer file access is restricted to safe site-source extensions and repository paths.
- Destructive admin operations retain explicit confirmation and re-authentication.

## Acceptance criteria
- All three surfaces load after authentication on desktop and mobile.
- Designer can select one or multiple editable repository files, switch between them, edit source, preview the selected page, and save authenticated changes.
- Admin visual QA defaults to `/` and supports important command/admin/designer/release/archive/vote/Suno routes.
- Visual QA produces result JSON and screenshot artifacts and correctly fails on HTTP errors, console errors, failed requests, or layout overflow.
- Existing admin actions remain reachable.
