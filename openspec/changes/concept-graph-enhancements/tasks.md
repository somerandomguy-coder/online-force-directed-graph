## 1. Worker Refactoring

- [x] 1.1 Update `processConceptGraph` in `src/worker/nlp-worker.ts` to use `options.splitMethod` to determine text chunks (blocks or sentences).
- [x] 1.2 Implement the concept extraction logic within the unified chunking loop in `processConceptGraph`.
- [x] 1.3 Assign the label "co-occurs" to all links generated in `processConceptGraph`.
- [x] 1.4 Replace all calls to `graph.addEdge` with `graph.mergeEdge` in `nlp-worker.ts`.

## 2. Verification & Build

- [x] 2.1 Verify that "Concept" mode respects the "Split by: Block" setting in the UI.
- [x] 2.2 Confirm that relation labels "co-occurs" appear on links in Concept mode (on zoom/hover).
- [x] 2.3 Ensure no runtime errors occur during dense graph generation in Concept mode.
- [x] 2.4 Run `npm run build` to verify project integrity.
