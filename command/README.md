# LIL SYNN Visual Designer

Open `/command/designer` to edit the real front page visually.

## Basic workflow

1. Sign in with the same Command Center admin credentials.
2. Choose **SELECT**, then click an element in the page preview.
3. Drag the selected element, or use the eight resize handles.
4. Use the **Inspector** on the right for exact layout, typography, color, border, effects, and advanced values.
5. Switch **DESKTOP / TABLET / MOBILE** to edit responsive overrides.
6. Use **SNAP**, **GUIDES**, and **GRID** when lining things up.
7. Use **SAVE DRAFT** for browser-local work, **PREVIEW** for a clean visitor view, and **CODE** to inspect the generated layout patch.
8. **SAVE TO GITHUB** creates a normal commit to `main` after server-side validation.

## Safety

The editor does not expose GitHub/Vercel credentials. The browser sends a small layout patch to the authenticated admin API. The server validates selectors and CSS properties, checks for a stale `main` commit, and updates only the `index.html` designer block. It never rewrites Git history.

`/Suno` is outside the editor's save scope.
