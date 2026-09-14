# Command Admin Implementation Plan

## Goal
Build `/command/admin/` as a single-admin, server-authenticated control center for the LIL SYNN site. The interface will use a terrifying steel-blue/black industrial command-console aesthetic and expose site health, visual QA, deployments, Git controls, asset management, Suno/build status, audit history, and a protected Danger Zone.

## Constraints
- One administrator account only.
- Never place the administrator password or any credential in client JavaScript, HTML, Git history, logs, or API responses.
- Use server-side environment configuration and a secure session cookie.
- Destructive operations require explicit confirmation; the most destructive Git operations additionally require password re-authentication.
- Git rollback/revert must be distinguished from history rewriting/deletion.
- Asset uploads accept all file types at the UI/API boundary, but uploaded content must not become an arbitrary code-execution surface.

## Repository/context
- Repository: `LILSYNNOFFICIAL/LILSYNNOFFICIAL`
- Default branch: `main`
- Existing `/command/` is currently read-only and references `/admin/admin.css` and `/admin/admin.js`.
- Existing `vercel.json` routes `/command` and `/command/` to `command/index.html` and currently has a static-site build command.

## File map
1. `command/admin/index.html` — authenticated admin shell and navigation.
2. `command/admin/admin.css` — steel-blue/black visual system, responsive layouts, danger-state visuals, modal system.
3. `command/admin/admin.js` — client-side UI state only; no secrets; calls authenticated server endpoints.
4. `api/admin/*` (or the repository's established server-function equivalent) — authentication and privileged actions.
5. `api/admin/auth/*` — login/logout/session/re-authentication endpoints.
6. `api/admin/git/*` — commits, diffs, revert/rollback, protected history rewrite operations.
7. `api/admin/deployments/*` — deployment listing, build status, logs, redeploy/promote/rollback.
8. `api/admin/assets/*` — multipart/multi-file upload, listing, metadata, rename/delete/replace operations.
9. `api/admin/qa/*` — visual/site QA execution and result retrieval.
10. `api/admin/audit/*` — audit event storage/retrieval.
11. `api/admin/system/*` — non-secret health/config/build information.
12. `.env.example` — documented secret names only; never real credentials.
13. `vercel.json` — route `/command/admin/` and required function routing without exposing protected implementation files.
14. `.gitignore` — ensure local secret files and QA artifacts containing sensitive data are excluded where appropriate.
15. `docs/superpowers/plans/2026-09-14-command-admin-implementation.md` — this plan.

## Task 1 — Authentication foundation
- Add server-side login/session handling for the single admin identity.
- Store the credential verifier as an environment secret/hash, not source code.
- Set Secure, HttpOnly, SameSite session cookies with appropriate expiry.
- Add rate limiting and generic failed-login responses.
- Add logout and session validation.
- Add a short-lived re-authentication challenge for Danger Zone actions.
- Verify no credential appears in built client assets.

## Task 2 — Admin shell and visual system
- Create `/command/admin/` shell with persistent navigation and mobile drawer.
- Use steel blue, black, graphite, metallic borders, restrained blue glow, industrial typography, technical status indicators, and high-contrast controls.
- Build reusable cards, tables, command buttons, status pills, drawers, confirmation modals, and danger-state components.
- Make desktop/tablet/mobile layouts intentional rather than merely stacked.

## Task 3 — Dashboard
- Show production deployment, current commit, build health, site health, QA status, asset health, Suno sync status, and recent admin activity.
- Include a one-click full site check.
- Surface actionable failures with links to the relevant subsystem.

## Task 4 — Visual QA
- Provide route selection plus desktop/mobile viewport presets.
- Execute checks for HTTP failures, console errors, failed network requests, horizontal overflow, clipping, element overlap, off-screen elements, zero-size/invisible required elements, broken media/images, blank regions, and missing assets.
- Store timestamped results and screenshots where the deployment environment supports them.
- Show before/after comparisons and deployment-associated QA history.
- Include `/command/admin/` itself in admin QA.

## Task 5 — Deployment controls
- List production/preview deployments and build state.
- Show build logs and deployment metadata.
- Provide redeploy/promote/rollback actions.
- Require confirmation for production-affecting actions.
- Record every action in the audit log.

## Task 6 — Git control
- Browse commits, branches, commit metadata, and diffs.
- Safe actions: inspect, restore/revert, and deployment rollback.
- Danger Zone: history rewrite/delete operations.
- For history rewrite/delete: show exact branch, target commit/range, resulting state, and irreversible warning; require two confirmations plus password re-authentication.
- Never silently force-push or rewrite a branch.
- Record pre-operation and post-operation SHAs in audit events.

## Task 7 — Asset command
- Multi-file drag/drop upload with per-file progress and overall progress.
- Target `/assets/img/`.
- Accept arbitrary file extensions at the upload boundary while storing files safely as non-executable assets.
- List files with type, size, dimensions when detectable, modified time, and path.
- Support rename, replace, delete, download, search/filter, and bulk operations.
- Destructive asset actions use confirmation modals and audit logging.

## Task 8 — Site/Suno/system controls
- Route inventory and reachability.
- Asset integrity checks.
- Suno guide sync/build status and generated-route health.
- Workflow status and recent failures.
- Environment/config status with secret values redacted.

## Task 9 — Audit log
- Record login/logout, failed login attempts, uploads, deletes, renames, deploy actions, Git operations, QA runs, configuration changes, and danger-zone events.
- Include timestamp, action, target, outcome, and request/session correlation ID where feasible.
- Never record passwords, tokens, cookies, or secret environment values.

## Task 10 — Security and failure handling
- CSRF protection appropriate to the session architecture.
- Strict authorization checks on every privileged endpoint; UI hiding is not authorization.
- Validate paths to prevent traversal outside `/assets/img/`.
- Validate Git refs and operation targets server-side.
- Apply safe timeouts and bounded output for logs/QA.
- Return generic errors to the browser while preserving useful server-side diagnostics without secrets.

## Task 11 — Verification
- Authentication tests: valid login, invalid login, session expiry, logout, rate limiting, unauthorized endpoint access.
- File tests: multiple uploads, unusual extensions, path traversal attempts, deletion/rename authorization.
- Git tests: read-only operations, revert, rollback, double-confirmation, re-authentication, rejected malformed refs.
- Deployment tests: read state, protected production actions, failure reporting.
- QA tests: route checks and responsive checks.
- Visual verification of `/command/admin/` at mobile and desktop sizes.
- Verify the repository contains no real credential values.
- Verify the production build succeeds before claiming completion.
