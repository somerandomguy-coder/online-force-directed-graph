## 1. UI Layout and Interaction Refinements

- [x] 1.1 Update `index.html` to center the `#ui` menu using a flexbox container.
- [x] 1.2 Add a hidden `<input type="file" id="file-upload">` to `index.html`.
- [x] 1.3 Add event listener in `src/main.ts` to trigger `#file-upload` when `#drop-zone` is clicked.
- [x] 1.4 Handle file selection from the input in `src/main.ts` (reuse drop logic).

## 2. Configurable Node Limits

- [x] 2.1 Add preset buttons (50, 100, 200, 500, 1000) to the UI in `index.html`.
- [x] 2.2 Add styles for the new buttons in `index.html`.
- [x] 2.3 Implement event listeners for node limit buttons in `src/main.ts` to re-process text with updated `maxNodes`.

## 3. Canvas Renderer Enhancements

- [x] 3.1 Update `render()` in `canvas-renderer.ts` to center labels within nodes (using `textAlign = 'center'` and `textBaseline = 'middle'`).
- [x] 3.2 Refactor hover logic in `setupInteractivity()` to use the actual node radius for hit detection.
- [x] 3.3 Ensure the \"glow\" effect (stroke) covers the entire node area on hover.

## 4. Semantic NLP Chunking

- [x] 4.1 Update `nlp-worker.ts` to split the input text into sentences using `wink-nlp`.
- [x] 4.2 Modify `getCoOccurrenceMatrix` (or its caller) to process sentences individually.
- [x] 4.3 Ensure links are not created across sentence boundaries.
- [x] 4.4 Verify that the `maxNodes` parameter from the UI is correctly applied in the worker.
