# LIL SYNN Suno Platform Upgrade — Design

**Goal:** Turn `/suno` from a polished static reference into a premium, searchable, interactive Suno V6 creator platform while preserving the living-source architecture.

## Product principles
- Black / gold / white LIL SYNN visual language; no generic documentation aesthetic.
- All visitor-facing knowledge stays on LILSYNN.COM; no source-repository navigation.
- Canonical source synchronization remains authoritative for factual guide content.
- Interactive tools generate structured starting points, not unsupported claims about Suno behavior.
- Every tool is usable without an account, backend, or paid dependency.
- Mobile-first interaction must remain first-class.

## Architecture
The platform remains static HTML/CSS/vanilla JavaScript so Vercel can deploy it with the existing build. The living guide generator continues to own source-derived pages; a new command-center layer owns interactive creator workflows and uses structured local data plus links into the source-derived reference pages.

### Surface map
- `/suno` — premium landing and discovery.
- `/suno/command-center` — interactive creator command center.
- `/suno/tools` — tool directory and quick launch.
- `/suno/prompt-architect` — prompt construction.
- `/suno/style-builder` — style construction.
- `/suno/lyrics-builder` — lyrics/tag/structure builder.
- `/suno/controls` — slider/control strategy assistant.
- `/suno/troubleshooter` — symptom-driven troubleshooting.
- `/suno/workflow` — end-to-end production workflow wizard.
- Existing `/suno/<topic>` and deep-dive routes remain canonical reading surfaces.

## Command Center
The command center presents six cards: Prompt Architect, Style Builder, Lyrics/Tag Builder, Controls Assistant, Troubleshooter, Workflow Wizard. It also includes global search, quick links to the 16 core topics, and a current-source status panel.

## Tool behavior
Each tool is a deterministic client-side workflow with:
- clear inputs,
- generated structured output,
- copy/reset actions,
- related guide links,
- warnings where a setting is experimental/context-sensitive,
- no fake API calls or fabricated Suno execution results.

Prompt Architect combines intent, genre, era, mood, vocal identity, instrumentation, arrangement, production, constraints, and structure into a prioritized prompt. Style Builder creates a concise style block. Lyrics Builder assembles section tags and validates structure. Controls Assistant provides strategy based on user goal and desired variance. Troubleshooter maps symptoms to likely causes and targeted interventions. Workflow Wizard turns a production goal into ordered stages.

## Search
The existing global search index remains the source of truth for guide pages. The command center additionally indexes tool names, capabilities, and terminology so users can find both knowledge and actions. Search results distinguish `GUIDE` and `TOOL`.

## UX hardening
- Consistent header/navigation on all Suno surfaces.
- Mobile menu with keyboard escape and focus-safe behavior.
- Breadcrumbs, TOCs, previous/next navigation on long-form readers.
- Responsive typography and cards; no horizontal overflow.
- Visible focus states and semantic controls.
- Copy feedback and error/empty states for interactive tools.
- Back-to-top and command-center links from readers.

## Continuous freshness
The build already pulls the eight canonical source documents. The upgrade keeps that process, expands manifest metadata, and adds a build-time audit that checks generated pages, interactive routes, navigation targets, tool metadata, and search coverage. Vercel production builds therefore fail closed if a required surface disappears or becomes empty.

## QA acceptance criteria
1. `npm run build` succeeds.
2. `npm run test:suno` succeeds.
3. Every required clean route returns HTTP 200 in production.
4. Every interactive tool has working generation/copy/reset behavior.
5. Search returns both guide and tool results.
6. No canonical source-repository URLs leak into visitor navigation.
7. No `.md` links remain in visitor navigation.
8. Mobile layout has no intentional horizontal overflow.
9. Manifest counts and indexed entries are internally consistent.
10. Production deployment is READY and the custom domain is verified after deployment.
