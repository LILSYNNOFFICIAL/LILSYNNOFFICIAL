# LIL SYNN Suno V6 Platform Design

**Goal:** Deliver a premium, source-synced Suno V6 knowledge and creator platform at `/suno` with interconnected reference content, deterministic creator tools, production workflows, search, live source metadata, community access, and automated validation.

## Product contract
- The visitor experience is LIL SYNN branded: black, gold, white, editorial typography, restrained motion, responsive navigation.
- Suno content is the sole subject of the guide and tools.
- The canonical guide repository is a build-time source only; visitors are never sent to GitHub for guide content.
- Clean `/suno/*` routes are the public interface.
- The canonical source set is synchronized during builds and exposed through complete source pages, not hidden behind summaries.
- Interactive tools are deterministic composition/diagnostic utilities. They must not claim to execute Suno generations or fabricate results.
- Forum is an external community destination at `https://suno-forum.base44.app`, opened in a new tab.
- Donation support points to `https://cash.app/$lilsynnofficial` and is clearly framed as support for servers and development.

## Architecture
The existing static HTML/CSS/JS architecture remains the foundation. `Suno/js/suno.js` owns shared navigation, global search, live manifest behavior, and donation injection. `Suno/js/suno-tools.js` owns deterministic interactive builders. Build scripts generate topic pages, complete source pages, indexes, and manifests from the canonical source set. `scripts/audit-suno-site.mjs` is the contract test for routes, source integrity, navigation, tool surfaces, and generated metadata.

## Platform surfaces
1. Landing / guide home.
2. Sixteen core knowledge topics.
3. Seven deep-dive research documents plus the master complete guide.
4. Command Center.
5. Prompt Architect.
6. Style Builder.
7. Lyrics / Tag Builder.
8. Controls Assistant.
9. Troubleshooter.
10. Workflow Wizard.
11. Global/local search.
12. Live synchronization panel.
13. External Forum navigation.
14. Donation support CTA.

## Navigation contract
Desktop navigation uses CREATE, CONTROL, PRODUCE, RESEARCH, COMPLETE GUIDE, and FORUM. Mobile exposes the same destinations through the responsive menu. Pages with static headers must receive the same Forum destination as pages whose navigation is injected dynamically.

## Quality contract
- No canonical GitHub guide URLs in generated public HTML or search-index text.
- No `.md` navigation links in public HTML.
- All public routes map to existing generated files.
- All six interactive tools load shared runtime/styles and provide copy/reset actions.
- Search index and manifest counts agree with generated content.
- Forum link is external and uses `target="_blank"` with `rel="noopener noreferrer"`.
- Build audit passes before production QA.
- Vercel deployment is not considered a product defect while the account is blocked by its documented daily deployment quota.
