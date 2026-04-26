## 1. Worker Implementation

- [x] 1.1 Update `processConceptGraph` in `src/worker/nlp-worker.ts` to fully leverage `s.entities()` for entity extraction.
- [x] 1.2 Implement POS-based token filtering (NOUN, PROPN) in `processConceptGraph` to complement entity extraction.
- [x] 1.3 Ensure efficient co-occurrence matrix building within sentences for the concept graph.
- [x] 1.4 Update the worker's `onmessage` handler to calculate and return enhanced metadata (`processTime`, `nodeCount`, `linkCount`).

## 2. Renderer Refinement

- [x] 2.1 Modify the `render` method in `src/renderer/canvas-renderer.ts` to introduce conditional rendering for link labels.
- [x] 2.2 Implement the zoom level threshold logic (`transform.k > 1.5`) for link label visibility.
- [x] 2.3 Implement the hover-based visibility logic for link labels (show if source or target node is hovered).
- [x] 2.4 Refine label styling (font size, color) for better readability when visible.

## 3. Verification & Cleanup

- [x] 3.1 Verify that "Concept Graph" mode correctly identifies and connects entities and key nouns.
- [x] 3.2 Confirm that link labels are hidden by default and appear correctly on zoom or hover.
- [x] 3.3 Ensure metadata is correctly reported in the console or UI.
- [x] 3.4 Run `npm run build` to verify project integrity.
