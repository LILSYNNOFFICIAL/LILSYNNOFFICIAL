# LIL SYNN Command Center Design

## Goal
Create a premium, read-only `/admin/` operational command center for the LIL SYNN main repository. It observes existing main-site health, isolated Suno health, GitHub Actions/CI state, deployment signals, repository activity, and diagnostics without becoming a dependency of the systems it monitors.

## Visual Direction
- Obsidian/near-black foundation.
- Metallic gold primary accent with restrained glow and fine borders.
- High-end editorial/technical typography.
- Dense information hierarchy without visual clutter.
- Mobile-first and fully responsive.
- Professional operations-center aesthetic; no fake hacker-console decoration.
- Motion is subtle, purposeful, and respects reduced-motion preferences.

## Architecture
The Command Center is a standalone static browser surface under `/admin/`. It is observational and read-only. Existing main-site and Suno health systems remain authoritative and independent; the dashboard may report their state but must never be required for either system to function.

The browser layer may read public/delegated GitHub information through safe APIs where available. It must not embed secrets, expose credentials, mutate repositories, trigger deployments, delete artifacts, or provide destructive controls.

## Information Architecture
1. Overview — overall operational state, subsystem status, last activity, and quick actions.
2. Main Site — browser health and Site Doctor status/signals.
3. Suno Platform — Suno browser health, isolation, search/index, and guide status.
4. GitHub Actions — workflow health, recent runs, failures, durations, and links to GitHub.
5. Deployments — latest known deployment/commit information and links to authoritative sources.
6. Repository Activity — recent commits and operational events.
7. Diagnostics — route, asset, index, and isolation diagnostics.
8. Health History — lightweight client-visible history where safe and deterministic; no claim of server-side persistence unless backed by an authoritative source.
9. Documentation — links to existing health and architecture documentation.

## Safety / Non-Goals
- No deployment buttons.
- No repository write operations.
- No delete/cancel/rerun workflow controls.
- No secret or token management.
- No private credential storage in frontend source.
- No dependency from the main site, Suno site, Site Doctor, or Suno Doctor on the Command Center.
- No invented telemetry. Unknown state must be labeled unknown/unavailable rather than guessed.

## Data Contract
Each monitored signal should expose a normalized state: `PASS`, `WARN`, `FAIL`, or `UNKNOWN`, with a human-readable explanation and an authoritative source/link when applicable. Timestamped observations must be labeled with their source and freshness.

## UX Requirements
- The first viewport communicates system state immediately.
- Gold is used for identity/highlight, not as a substitute for status semantics.
- Status remains distinguishable without color alone through text/icon/shape.
- Keyboard navigation and visible focus states are required.
- ARIA labels/live regions are used for dynamic status updates.
- Mobile layouts must remain usable at narrow widths.
- A global command/search affordance may be included if it remains lightweight and accessible.

## Integration Boundary
The dashboard can link to `/site-health.html` and `/Suno/health.html`, but those pages remain independent. GitHub links should route users to the authoritative repository/workflow/run pages rather than attempting to reproduce every GitHub capability.

## Success Criteria
A reviewer should immediately understand:
- whether the system is healthy;
- which subsystem is responsible if it is not;
- what changed recently;
- where the authoritative diagnostic is;
- and that the dashboard itself cannot damage production.

The implementation should feel exceptional while remaining small, inspectable, dependency-light, and resilient.
