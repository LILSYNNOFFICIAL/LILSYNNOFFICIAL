# Index2 WebM Sizing Implementation Plan

## Goal
Correct the two WebM render surfaces on `/index2` so they display at their natural aspect ratio without CSS warping, while moving the first hero WebM farther upward as requested.

## Current behavior
The existing `index2-final-fix.js` already uses `width:100%`, `height:auto`, `object-fit:contain`, and `object-position:center top` for both videos. However, the second stars WebM is positioned in a full-width container whose height is dynamically derived from the rest of the document. The fix must decouple visual video sizing from container height so the browser never stretches the video to fill an arbitrary viewport/container box.

## Changes
1. First WebM (`.hero-webm`): keep intrinsic aspect ratio, move upward from the current `top:-70px` desktop and `top:-45px` mobile to a more elevated position while preserving responsive behavior.
2. Second WebM (`.ls2-page-stars video`): keep intrinsic aspect ratio using explicit `width:100%; height:auto; object-fit:contain; object-position:center top`; do not set a forced video height based on page height.
3. Keep the stars wrapper full-page only as a clipping/layering surface; never use its dynamic height as the video element's rendered height.
4. Preserve existing WebM files byte-for-byte; no re-encoding, compression, replacement, or file-size changes.
5. Preserve z-index/layering, lazy-loading, and existing menu/navigation behavior.

## Verification
- Check `/index2` desktop and mobile rendering.
- Confirm first WebM is visibly higher.
- Confirm both WebM elements preserve their native aspect ratio and are not vertically stretched.
- Confirm no horizontal overflow is introduced.
- Confirm the stars layer still covers the intended page region without stretching the source video.
- Confirm the actual WebM files are unchanged.
