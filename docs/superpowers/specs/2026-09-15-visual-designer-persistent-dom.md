# Visual Designer Persistent DOM — Design Spec

**Goal:** Turn the LIL SYNN visual designer from a preview-only editor into a safe editor whose created, duplicated, deleted, text-edited, and asset elements can survive a reload and be committed to `index.html`.

## Design
- Existing CSS layout patches remain the authoritative mechanism for styling existing page elements.
- Designer-created DOM is serialized into a bounded `LS-DESIGNER-DOM` block immediately before `</body>` in `index.html`.
- Existing elements are identified by stable selectors; destructive deletion is represented as a persisted visibility/display patch rather than rewriting arbitrary source markup.
- Created elements receive stable `data-ls-id` identifiers and are serialized with sanitized attributes/styles.
- Text content is persisted as escaped text, never executable HTML.
- Uploaded assets use repository-relative `/assets/img/...` or equivalent safe paths.
- Save requires the authenticated admin session and checks the current `main` commit SHA for conflicts.
- The server validates every structural operation and rejects scripts, event-handler attributes, unsafe URLs, excessive payloads, and unsupported tags/styles.
- Undo/redo remains client-side; GitHub save is an explicit action.

## Success Criteria
1. A created text/image/video element survives designer reload after Save to GitHub.
2. A duplicated element survives reload with a distinct stable ID.
3. Text edits survive reload without HTML injection.
4. A deleted existing element remains hidden after reload.
5. Save rejects stale base SHAs and unsafe structural payloads.
6. Existing `/Suno` and unrelated homepage source remain untouched.
7. Contract tests cover serialization, escaping, validation, and HTML block replacement.
