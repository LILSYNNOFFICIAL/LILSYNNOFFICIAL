# COMMAND ADMIN Design — 2026-09-14

## Goal
Build a single-administrator, authenticated `/command/admin/` control center for the LIL SYNN site. The interface should provide operational control over deployments, Git, assets, routes, Suno build health, visual QA, system status, audit history, and explicitly protected destructive operations.

## Identity and security
- Exactly one administrator identity.
- Login email is the configured admin identity; the password is never committed to the repository or shipped to client JavaScript.
- Credential material must be stored server-side using environment secrets. Prefer a password hash over plaintext where practical.
- Authentication uses a secure, HttpOnly, SameSite session cookie with expiration and logout.
- Rate-limit login attempts and sensitive mutation endpoints.
- Never return secret values, tokens, hashes, or environment values to the browser.
- Mutating endpoints validate the authenticated session server-side.
- Destructive actions require explicit confirmation; the highest-risk actions require a second confirmation and password re-authentication.
- Every administrative mutation is recorded in an audit log with timestamp, action, target, result, and request metadata that is safe to retain.

## UI / visual system
- `/command/admin/` is a full-screen industrial command interface.
- Palette: steel blue, gunmetal, graphite, black, restrained cold-blue glow.
- Avoid generic SaaS cards, pastel colors, bright white surfaces, and unnecessary decoration.
- Use technical typography, dense information hierarchy, sharp separators, status lamps, command labels, and high-contrast controls.
- Responsive layouts preserve the intimidating command-console character on phone, tablet, and desktop.
- Destructive areas are visually isolated as a high-risk subsystem.

## Sections
1. Dashboard — overall site state, current deployment, Git head, build health, visual QA health, asset health, recent admin activity.
2. Visual QA — run desktop/mobile route checks; collect screenshots/results; detect viewport overflow, clipping, overlap, zero-size/invisible elements, broken images/media, blank regions, console errors, failed network requests, and compare against prior runs where available.
3. Deployments — list deployments, inspect state/logs, redeploy, promote, and roll back to a selected known deployment.
4. Git Control — inspect commits, branches, diffs, revert/restore selected changes, move branch refs where supported, and expose advanced history rewrite/delete controls only in Danger Zone.
5. Asset Command — multi-file upload, drag/drop, progress, inventory, search, metadata, rename/replace/delete, and bulk operations targeting `/assets/img/`. The UI may accept arbitrary file types, but uploaded content must be stored/served safely and must not become arbitrary server-side executable code.
6. Site Control — route inventory, reachability, public page checks, asset checks, and site-level operational diagnostics.
7. Suno Control — synchronization/build status, generated-route inventory, health checks, and workflow status.
8. System — non-secret runtime/build/configuration diagnostics.
9. Audit — searchable administrative action history.
10. Danger Zone — destructive deployment, Git history, and file operations with mandatory confirmation gates.

## Confirmation model
- Normal destructive operation: confirmation modal showing exact target and consequence.
- High-risk operation: first confirmation followed by a second independent confirmation.
- Git history deletion/rewrite and similarly irreversible operations: second confirmation plus password re-entry.
- Confirmation buttons must identify the exact action (for example, `ROLL BACK TO <SHA>` or `REWRITE HISTORY`) rather than generic `OK`.
- No destructive operation is triggered by navigation, Enter-key accidents, double-clicks, or stale dialogs.

## Backend/API boundary
- Public pages remain static/public.
- `/command/admin/` client code talks only to authenticated server-side endpoints.
- GitHub and Vercel credentials remain server-side environment secrets.
- API responses are normalized, minimal, and redact credentials/tokens.
- All mutation endpoints perform authorization and input validation independently of UI state.

## Git semantics
- Safe rollback/revert is the default operational path.
- True history rewriting/deletion is available because explicitly requested, but is isolated in Danger Zone and protected by re-authentication.
- Before destructive history operations, show branch, current head, selected target, and expected resulting ref.
- Prefer creating a recovery reference before history rewrite when technically possible so the operation has a recovery point.

## Deployment semantics
- Show production and preview deployment state.
- Support redeploy, promote, and rollback through server-side Vercel credentials.
- Surface build logs and failure summaries.
- Do not claim a deployment succeeded until authoritative deployment state confirms it.

## Visual QA implementation
- QA is route-aware and viewport-aware.
- The admin UI exposes latest result, failure counts, screenshots/results, and historical comparisons.
- Browser automation should run in an environment capable of rendering the actual deployed site; if the current hosting/runtime cannot execute a browser, use a CI workflow/artifact path and have the admin panel consume its results.
- QA results must distinguish static HTTP reachability from actual browser-rendered health.

## Files
- Multi-upload uses server-side streaming/multipart handling appropriate for the hosting runtime.
- File names are normalized and path traversal is rejected.
- Upload destination is `/assets/img/` in the repository-backed asset workflow requested by the administrator.
- Large uploads report per-file failure without hiding successful files.
- File deletion/replacement is audited and confirmation-protected.

## Audit and recovery
- Record login/logout, upload/delete/replace, deployment mutations, Git mutations, QA runs, and configuration-changing operations.
- Never store passwords or bearer tokens in audit records.
- High-risk operations should record the confirmation/re-authentication event and final result.

## Non-goals
- No multi-admin role system.
- No public exposure of admin controls.
- No hardcoded administrator password in source.
- No automatic re-encoding or modification of existing WebM assets unless explicitly requested.
- No redesign of unrelated public pages as part of this feature.
