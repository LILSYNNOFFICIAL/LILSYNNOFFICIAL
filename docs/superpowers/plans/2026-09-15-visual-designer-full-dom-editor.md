# Visual Designer Full DOM Editor Implementation Plan

> Implementation plan approved by the user for the LIL SYNN visual designer.

## Goal
Upgrade the visual designer into a safe, non-destructive DOM editor with unrestricted nesting/reordering, true DOM duplication/deletion, inline text editing, responsive controls, asset persistence, and durable GitHub saves.

## Architecture
Keep `index.html` as the base document. Maintain a client-side structural model with stable designer IDs. Apply structural operations to the iframe DOM while editing. Persist only designer-managed DOM/hide regions plus the existing CSS patch region. Validate all structural payloads server-side, reject stale saves, and preserve pending local edits on failure.

## Constraints
- Never modify `/Suno` for this feature.
- Never accept arbitrary `innerHTML` from editor input.
- Structural tags, attributes, styles, IDs, URLs, text, references, and counts are allowlisted/bounded.
- Reject self/ancestor moves and malformed references.
- Require authenticated admin session and explicit save confirmation.
- Reject stale `main` SHA before changing GitHub.
- Normal Save must not destructively rewrite unrelated source HTML.

## Tasks
1. Add a pure structural DOM model with tests for parent/child ordering and cycle prevention.
2. Add stable identities and structural operation capture to the designer persistence layer.
3. Add INSIDE/BEFORE/AFTER drag-drop semantics with visible drop indicators.
4. Make duplicate/delete operate on real DOM subtrees and persist them.
5. Add safe inline/inspector text editing integrated with history.
6. Extend the API to serialize/hydrate recursive managed DOM safely.
7. Complete responsive inspector controls and copy/paste style support.
8. Integrate uploaded assets with the persistent structural model.
9. Extend smoke/contract coverage.
10. Verify the complete diff, managed regions, save conflict behavior, and protected `/Suno` source.

## Verification
Use focused Node contract tests and the existing GitHub Actions smoke workflow. If the execution environment cannot run local Node/browser tests, report that limitation rather than claiming success. Do not claim Vercel/browser deployment success without observed evidence.
