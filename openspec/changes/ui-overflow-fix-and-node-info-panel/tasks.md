## 1. UI Layout Fixes and Structure

- [x] 1.1 Apply `box-sizing: border-box` to all input elements in `index.html` to fix control panel overflow.
- [x] 1.2 Add HTML structure for the `#node-info-panel` in the top-right corner.
- [x] 1.3 Add a "Show Node Info" checkbox toggle to the main `#ui` panel.
- [x] 1.4 Add CSS for the new info panel (absolute positioning, background, padding, shadow).

## 2. Renderer Data Exposure

- [x] 2.1 Update `CanvasRenderer` to expose the currently hovered node and its neighbors.
- [x] 2.2 Implement a callback system in the renderer that notifies the main thread when the `hoveredNode` changes.

## 3. Node Information Logic

- [x] 3.1 Implement a function in `src/main.ts` to update the `#node-info-panel` content.
- [x] 3.2 Add logic to sort neighbors of the hovered node and select the top 5 (by weight/count).
- [x] 3.3 Ensure the top 5 neighbors are rendered as a list or dropdown in the info panel.
- [x] 3.4 Bind the visibility toggle checkbox to hide/show the info panel using a CSS class.
