# Visual Designer Persistent DOM — Design Spec

**Goal:** Turn the LIL SYNN visual designer into a safe, non-destructive visual editor that can select, edit, move, resize, nest, reorder, duplicate, delete, and persist homepage DOM changes without rewriting the original `index.html` structure on every edit.

## Product behavior
- THE SIGNAL homepage remains the base document and source of truth.
- Designer operates on a live iframe representation.
- Existing elements receive stable designer identities.
- Dragging supports unrestricted structural nesting and reordering.
- Drop zones distinguish `INSIDE`, `BEFORE`, and `AFTER`.
- Double-click text enters inline editing; inspector also exposes text content.
- Text is plain text only; arbitrary HTML is never accepted.
- Inspector is context-sensitive: content, layout, flex/grid, typography, colors, borders, effects, positioning, advanced properties, responsive overrides.
- Numeric properties support typed values and visual controls where useful.
- Copy Style, Paste Style, and Reset Property are available.
- Desktop/tablet/mobile overrides remain independent and inherit when not overridden.
- Duplicate creates a real DOM clone with a new stable designer ID.
- Delete is undoable; existing source elements use a controlled hide layer rather than arbitrary source deletion.
- Created elements live in a dedicated `LS-DESIGNER-DOM` block.
- Normal Save never destructively rewrites the original source. Source-baking is out of scope.

## Persistence model
The effective page is conceptually:

`ORIGINAL INDEX.HTML + DESIGNER DOM LAYER + DESIGNER CSS LAYER = EFFECTIVE HOMEPAGE`

### Existing elements
Existing elements are referenced by stable designer IDs/selectors. Structural edits are stored as operations, for example:

```json
{"op":"move","element":"el_8f31a","parent":"el_cta","position":"inside","index":0}
```

The client applies the operation immediately to the iframe. Save persists the structural state in the managed designer layer without regenerating unrelated source markup.

### Created elements
Created elements use stable `data-ls-id` identifiers and are serialized recursively with an allowlisted tag set, attributes, styles, and plain-text content. Nested created children survive reload as a hierarchy.

### Existing-element structural changes
Arbitrary source rewriting is avoided. Structural transformations are stored separately from base HTML and reapplied when the designer loads. Existing hidden elements use a controlled hide layer. Source-baking is explicitly out of scope for this iteration.

### CSS
Existing visual changes continue through the current `LS-DESIGNER` CSS patch mechanism. DOM and CSS persistence remain separate managed regions/interfaces.

## Save transaction
1. Verify the authenticated admin session.
2. Client supplies the base `main` commit SHA it loaded.
3. Server fetches current `main` SHA and rejects stale saves with a layout conflict.
4. Server validates the complete structural payload against strict limits and allowlists.
5. Text is HTML-escaped and unsafe attributes/URLs are rejected.
6. Server updates only managed designer DOM/hide regions in `index.html`.
7. Server creates a GitHub commit and returns its SHA.
8. Client clears pending-save state only after success.

Failed validation or conflict leaves the existing homepage unchanged.

## Safety constraints
- Never modify `/Suno` as part of this feature.
- Never accept arbitrary `innerHTML` from the browser.
- Reject scripts, event-handler attributes, `javascript:` URLs, unsupported tags/styles, and unsafe resource paths.
- Bound payload size, element count, attribute count, style count, and text length.
- Reject malformed IDs/selectors and invalid references.
- Prevent an element from becoming its own ancestor.
- Prevent cycles in the structural operation graph.
- Preserve source outside managed designer regions.
- Require explicit confirmation for GitHub persistence.

## Error handling
- `AUTH_REQUIRED`: use existing admin login flow.
- `LAYOUT_CONFLICT`: preserve local edits and require reload/reconcile.
- `INVALID_DOM_PAYLOAD`: reject the transaction without changing GitHub.
- `SAVE_DOM_FAILED`: preserve local pending state for retry.
- Asset upload failures do not discard unrelated DOM edits.

## Testing and verification
- Contract tests cover stable IDs, recursive serialization, escaping, operation validation, cycle detection, stale SHA rejection, and managed-block replacement.
- Browser smoke tests cover selection, inline text editing, drag/nest, reorder, duplicate, delete/undo, responsive overrides, asset insertion, reload, and Save DOM.
- Workflow syntax checks cover designer persistence scripts and API modules.
- Final diff verification confirms `/Suno` and unrelated homepage source were not modified.

## Success criteria
1. Created text/image/video survives designer reload after Save to GitHub.
2. Duplicated element survives reload with a distinct stable ID.
3. Text edits survive reload without HTML injection.
4. Existing elements can be nested/reordered and transformations survive reload without rewriting unrelated source HTML.
5. Deleted existing elements remain hidden after reload.
6. Save rejects stale SHAs, malformed references, cycles, and unsafe payloads.
7. Responsive overrides survive reload independently.
8. `/Suno` and unrelated homepage source remain untouched.
9. Contract and browser smoke tests cover the persistence contract and core editing flows.
