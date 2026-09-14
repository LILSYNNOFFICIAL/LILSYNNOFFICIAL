# INDEX2 + SUNO Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make INDEX2 visually and functionally match the approved LIL SYNN composition while keeping the `/Suno` guide as an independent black-and-gold project.

**Architecture:** INDEX2 owns its own navigation, WEBM background composition, atmospheric effects, artist modal interaction, footer, and back-to-top behavior. The `/Suno` project keeps its own navigation/CSS/JS and is not processed by the main site's global shell. Shared assets may be referenced, but runtime ownership is page-scoped.

**Tech Stack:** Existing static HTML, CSS, JavaScript, WEBM/PNG assets, GitHub repository, Vercel deployment.

**Spec:** `docs/superpowers/specs/2026-09-14-index2-suno-refinement-design.md`

## Global Constraints

- Work on `index2.html` and supporting files only; do not promote it to `index.html` yet.
- Preserve existing assets and content whenever they already exist.
- Do not invent replacement pages or duplicate projects.
- Do not use one catch-all JavaScript runtime for both the main site and `/Suno`.
- Main site and Suno may link to one another, but their CSS/JS responsibilities remain separate.
- Preserve accessibility and reduced-motion behavior.
- `LS_BG_STARS.webm` must visually continue from its transition point through the bottom of the entire INDEX2 page and span the full viewport width.
- `HERO_BG_WEBM.webm` and `LS_BG_STARS.webm` must be sequential visual regions, not competing overlapping backgrounds.

---

### Task 1: Audit the current INDEX2/Suno boundaries and source assets

**Files:**
- Read: `index2.html`
- Read: `index.html`
- Read: `latest-videos.js`
- Read: `site-global.js`
- Read: `site-global.css`
- Read: `Suno/Suno_Guide.html`
- Read: `Suno/css/suno.css`

**Interfaces:**
- Consumes: current repository source and existing asset paths.
- Produces: confirmed edit boundaries and exact existing copy/assets to preserve.

- [ ] **Step 1: Confirm the existing INDEX2 hamburger implementation and navigation DOM.**

Inspect the current `index2.html` for `.hamburger`, `.menu-panel`, `.desktop-nav`, `.nav-stack`, and all transmission/artist/footer controls. Identify any duplicate or runtime-generated navigation.

- [ ] **Step 2: Confirm the existing WEBM paths and layout rules.**

Verify the current references to `/assets/mov/HERO_BG_WEBM.webm` and `/assets/mov/LS_BG_STARS.webm`, including every CSS rule controlling their position, height, z-index, opacity, and containing section.

- [ ] **Step 3: Confirm the original artist copy.**

Read the `#about` material from `index.html` and preserve its existing section text for THE ARTIST, THE PERSONA, THE MUSIC, TOOLKIT, THE VISUAL WORLD, THE CREATOR, and THE VISION. Do not replace this material with newly invented prose.

- [ ] **Step 4: Trace main-site script injection.**

Confirm whether `site-global.js` is loaded by any `/Suno` page and identify any selectors or pathname logic that could alter Suno navigation, CSS, footer, or page structure.

- [ ] **Step 5: Commit the audit documentation if source notes are needed.**

Do not modify production source merely to record the audit; use the already committed design/plan documents as the audit record.

---

### Task 2: Rebuild INDEX2 navigation around the real hamburger

**Files:**
- Modify: `index2.html`
- Modify: `latest-videos.js` only if runtime navigation cleanup remains necessary

**Interfaces:**
- Consumes: existing `.hamburger` / `.menu-panel` structure and approved destinations.
- Produces: primary horizontal navigation with visible pink vote control plus a right-side three-line pink hamburger that opens the full menu.

- [ ] **Step 1: Remove the visible `MORE` control from the horizontal navigation.**

Do not leave a text `MORE` button pretending to be the hamburger. The visible right-side control must be the existing three-line hamburger button.

- [ ] **Step 2: Make the hamburger visibly pink and unmistakably three-line.**

Use the existing `.hamburger` element and style its three spans with the site's pink variable. Keep it compact and aligned to the right edge of the top navigation.

- [ ] **Step 3: Keep the primary horizontal row limited to actual primary destinations plus the vote control.**

Use HOME, MUSIC, VIDEOS, GALLERY, UNIVERSE, CONTACT, FORUM, with `VOTE 4 LIL SYNN` as a visible pink control in the main navigation. Do not add COMMAND.

- [ ] **Step 4: Keep the Suno forum destination distinct from Join the Signal.**

Set Suno forum navigation to `https://suno-forum.base44.app`. Ensure JOIN THE SIGNAL does not point to the forum.

- [ ] **Step 5: Set the transmission label to the exact requested text.**

Replace the old transmission number with `OFFICIAL TRANSMISSION / 369` wherever the INDEX2 transmission label is rendered.

- [ ] **Step 6: Test desktop and mobile menu open/close behavior.**

Verify the hamburger opens the intended existing panel, closes with its close control and Escape, and does not leave body scrolling locked after close.

---

### Task 3: Correct the WEBM background architecture

**Files:**
- Modify: `index2.html`
- Modify: the INDEX2-specific stylesheet only if CSS is externalized during the audit

**Interfaces:**
- Consumes: existing HERO and stars WEBM assets.
- Produces: sequential hero-to-stars visual composition with page-height stars coverage.

- [ ] **Step 1: Move the hero WEBM upward while preserving enough of the upper artwork.**

Reduce its top offset from the current position so more of the hero graphic is visible beneath the navigation, while retaining enough upper spacing that the navigation remains readable.

- [ ] **Step 2: End the hero WEBM at a defined transition boundary.**

The hero video must occupy its own upper visual region. Do not position the stars video over the same hero region.

- [ ] **Step 3: Move the stars WEBM out of the hero container as the site's continuous background layer.**

Place `LS_BG_STARS.webm` in a page-level background wrapper beginning around the requested Signal transition, behind the downstream sections. Set its width to `100vw`, left/right to viewport edges, and its height to cover the entire remaining page region through the final footer.

- [ ] **Step 4: Ensure downstream content does not create a solid-black wall over the stars video.**

Use translucent section backgrounds/overlays only where required for readability. The stars animation must remain visibly present from its starting point to the bottom of INDEX2.

- [ ] **Step 5: Verify responsive behavior.**

On narrow screens, keep the same sequential model: visible upper hero WEBM, then stars WEBM beginning below it and extending to the page bottom. Avoid viewport-fixed cropping that causes the stars file to disappear below the fold.

---

### Task 4: Add subtle site-wide atmospheric particles

**Files:**
- Modify: `index2.html` or create a narrowly scoped `index2-effects.js` if the existing source architecture warrants it

**Interfaces:**
- Consumes: page lifecycle and reduced-motion preference.
- Produces: faint decorative floating particles with no interaction interference.

- [ ] **Step 1: Create a dedicated particle layer behind content.**

Use a pointer-events-free layer with a small number of particles, low opacity, slow movement, and no bright/glowing distraction.

- [ ] **Step 2: Keep the effect subordinate to the WEBM backgrounds.**

Particles must never obscure LIL SYNN, navigation, copy, controls, or the stars artwork.

- [ ] **Step 3: Respect reduced motion.**

Disable particle animation when `prefers-reduced-motion: reduce` is active.

- [ ] **Step 4: Verify the particle layer does not increase page width or create horizontal scrolling.**

---

### Task 5: Convert Artist subsections into floating modal windows

**Files:**
- Modify: `index2.html`
- Modify: existing main-site JS responsible for INDEX2 interactions, or create a narrowly scoped INDEX2 artist script if needed

**Interfaces:**
- Consumes: original `index.html` artist copy.
- Produces: seven subsection buttons plus OVERALL, each opening a modal with the correct content and close control.

- [ ] **Step 1: Preserve the original artist copy verbatim in structured modal content.**

Use the existing text from `index.html` for THE ARTIST, THE PERSONA, THE MUSIC, TOOLKIT, THE VISUAL WORLD, THE CREATOR, and THE VISION.

- [ ] **Step 2: Add the artist control strip.**

Render buttons labeled `THE ARTIST`, `THE PERSONA`, `THE MUSIC`, `TOOLKIT`, `THE VISUAL WORLD`, `THE CREATOR`, `THE VISION`, and `OVERALL`.

- [ ] **Step 3: Open the selected subsection in a floating panel.**

The panel must overlay the page rather than jump-scroll to an anchor. It must contain the complete selected subsection.

- [ ] **Step 4: Add a visible X close control.**

Closing must return to the exact page state without accidental navigation.

- [ ] **Step 5: Add the pink internal scrollbar and keyboard behavior.**

The modal content area gets the pink scrollbar; Escape closes it; focus remains usable; background page scrolling is locked only while the modal is open.

- [ ] **Step 6: Implement OVERALL as the complete artist narrative.**

The OVERALL modal must combine all existing artist subsections into one large readable panel without inventing new material.

---

### Task 6: Restore INDEX2 footer, social icons, Easter egg, and back-to-top

**Files:**
- Modify: `index2.html`
- Modify: existing main-site footer/back-to-top JS only if needed

**Interfaces:**
- Consumes: existing footer assets, `LS_HEADPHONES.png`, and `UP_ARROWS.png`.
- Produces: final footer and floating return-to-top control.

- [ ] **Step 1: Render the eight requested social icons.**

Use existing icon assets for YouTube, Spotify, Instagram, X/Twitter, SoundCloud, TikTok, Facebook, and Apple Music.

- [ ] **Step 2: Apply platform colors.**

Apple Music controls are pink; Spotify controls are green; Tidal remains neutral/black/silver.

- [ ] **Step 3: Place Privacy and Terms below the label area.**

Keep them together in the lower legal area.

- [ ] **Step 4: Add the exact footer statements.**

Render `DARK SOUND. RAW MOTION. NO LIMITS.`, `© 2026 LIL SYNN`, and `DESIGNED WITH CHATGPT`.

- [ ] **Step 5: Make LS_HEADPHONES the sole Special Access entry point.**

Use the existing `LS_HEADPHONES.png` asset and link it to `/special_access.html`. Do not expose another normal link to that page.

- [ ] **Step 6: Add UP_ARROWS as a compact floating back-to-top control.**

Use the existing `UP_ARROWS.png`, keep it small-to-medium, float it on the right side, and scroll to `top: 0` with smooth behavior.

- [ ] **Step 7: Style the document scrollbar pink.**

Apply WebKit scrollbar styling and a Firefox-compatible thumb color where supported, while retaining usable contrast.

---

### Task 7: Isolate the Suno project

**Files:**
- Modify only affected `/Suno` source files after tracing the exact cause
- Read: `Suno/Suno_Guide.html`
- Read: `Suno/css/suno.css`
- Read: all `/Suno` JS files actually referenced by the guide

**Interfaces:**
- Consumes: existing Suno navigation and black/gold stylesheet.
- Produces: a self-contained Suno UI with no main-site shell injection.

- [ ] **Step 1: Identify every script loaded by the Suno guide.**

Build the exact dependency list from the HTML rather than assuming `site-global.js` is responsible.

- [ ] **Step 2: Remove any accidental main-site runtime injection from Suno pages.**

Do not delete legitimate Suno scripts. Remove only the cross-project shell behavior that changes Suno navigation/footer/CSS.

- [ ] **Step 3: Restore the horizontal Suno navigation.**

Keep the existing CREATE, CONTROL, PRODUCE, FIX / TEST, RESEARCH, MASTER architecture and its dropdowns. Keep the mobile menu behavior already defined by the Suno CSS.

- [ ] **Step 4: Reinforce Suno's black-and-gold link styling.**

Ensure `.guide-content a`, navigation links, cards, buttons, and other guide links do not fall through to browser-default bright blue.

- [ ] **Step 5: Verify Suno does not inherit INDEX2's pink navigation, footer, particles, or WEBM layers.**

Cross-linking between projects is allowed; visual/runtime inheritance is not.

---

### Task 8: Verify, deploy, and inspect production

**Files:**
- No source changes unless verification exposes a defect

**Interfaces:**
- Consumes: completed INDEX2 and Suno source.
- Produces: verified deployment state and evidence for approval.

- [ ] **Step 1: Check source for duplicate navigation.**

Confirm there is one visible primary navigation, one streaming row if retained, and one right-side hamburger. Confirm no `COMMAND` navigation item exists.

- [ ] **Step 2: Check WEBM composition in a real browser.**

Verify the hero WEBM is visible higher on the page, ends before the stars region, and the stars WEBM remains visible behind content all the way to the bottom.

- [ ] **Step 3: Check Artist modal behavior.**

Open every subsection and OVERALL, verify copy is present, verify X/Escape close, and verify the pink internal scrollbar.

- [ ] **Step 4: Check footer and Easter egg.**

Verify all eight social links, Privacy, Terms, Special Access icon, exact footer copy, and the UP_ARROWS control.

- [ ] **Step 5: Check Suno independently.**

Verify the horizontal Suno navigation and black/gold styling without any INDEX2 shell appearing.

- [ ] **Step 6: Run the project's available browser/deployment verification.**

Use the existing Vercel deployment/browser verification path and inspect console errors and key UI elements at desktop and mobile widths.

- [ ] **Step 7: Confirm the latest commit is deployed and READY before reporting completion.**

Do not claim production readiness until the deployment corresponding to the final source commit is confirmed READY and the live page has been checked.

- [ ] **Step 8: Commit each independently verified task.**

Use focused commit messages describing the actual change; do not bundle unrelated Suno and INDEX2 changes into one opaque commit when the repository workflow permits separate commits.
