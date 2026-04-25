## 1. UI Layout Reversion and Controls

- [x] 1.1 Update `index.html` CSS to move `#ui` back to the top-left (`top: 20px; left: 20px;`).
- [x] 1.2 Remove the flexbox centering container from `index.html`.
- [x] 1.3 Add a UI toggle or dropdown to `index.html` for \"Block Split\" vs \"Sentence Split\".
- [x] 1.4 Update `src/main.ts` to capture and send the `splitMethod` to the worker.

## 2. NLP Worker Refinements

- [x] 2.1 Update `src/worker/nlp-worker.ts` to filter out tokens with length < 2.
- [x] 2.2 Implement logic to handle \"Block Split\" (split by `\n\n`) vs \"Sentence Split\" based on the message options.

## 3. Advanced Renderer Interaction

- [x] 3.1 Modify `CanvasRenderer` in `src/renderer/canvas-renderer.ts` to build an adjacency map when data is set.
- [x] 3.2 Update the `render()` loop to check if a node is the hovered node or a neighbor of the hovered node.
- [x] 3.3 Apply red color to the hovered node and yellow to its neighbors during the draw call.

## 4. Dynamic Node Labels

- [x] 4.1 Update `CanvasRenderer` to calculate and cache font sizes for each node based on its radius.
- [x] 4.2 Use `ctx.measureText` to ensure the label width does not exceed the node circle's diameter.
- [x] 4.3 Update the fill color for labels to ensure high contrast against red, yellow, and blue nodes.
