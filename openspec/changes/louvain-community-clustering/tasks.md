## 1. Environment & Dependencies

- [x] 1.1 Install `graphology` and `graphology-communities-louvain` dependencies.
- [x] 1.2 Update `package.json` with the new dependencies.

## 2. NLP Worker Enhancement

- [x] 2.1 Import `graphology` and `louvain` in `src/worker/nlp-worker.ts`.
- [x] 2.2 Implement community detection logic using the co-occurrence matrix.
- [x] 2.3 Update the `GRAPH_DATA_READY` payload to include the `cluster` ID for each node.

## 3. UI Implementation

- [x] 3.1 Add a "Cluster" button and toggle state logic in `src/main.ts`.
- [x] 3.2 Update `index.html` with the new button in the top-middle position and associated styling.

## 4. Renderer Updates

- [x] 4.1 Update `src/renderer/canvas-renderer.ts` to accept a `clusteringEnabled` flag.
- [x] 4.2 Implement a color scale (e.g., using `d3.schemeTableau10`) to map cluster IDs to colors.
- [x] 4.3 Update the `drawNode` logic to use cluster colors when enabled.

## 5. Verification

- [x] 5.1 Verify that clicking the "Cluster" button toggles node colors.
- [x] 5.2 Verify that colors are high-contrast and legible on the white background.
- [x] 5.3 Ensure the performance remains smooth with clustering enabled.
