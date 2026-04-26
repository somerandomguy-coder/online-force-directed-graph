## Why

While the Concept Graph MVP is structurally correct, it has several limitations: it ignores the user-selected `splitMethod`, lacks semantic relationship labels on edges, and is prone to runtime errors when adding duplicate edges. Enhancing these areas will provide a more consistent UI, richer analytical data, and a more robust implementation.

## What Changes

- **Support `splitMethod` in Concept Mode**: Extend `processConceptGraph` to support both 'sentence' and 'block' splitting, aligning it with the UI options.
- **Implement Relation Labels**: Update the extraction logic to assign basic relationship labels to links (e.g., "co-occurs") to leverage the renderer's label-drawing capabilities.
- **Robust Edge Creation**: Switch from `graph.addEdge` to `graph.mergeEdge` to prevent runtime errors when encountering duplicate or existing edges.
- **UI Consistency**: Ensure the `splitMethod` selection in the UI correctly impacts Concept mode processing.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `worker-nlp-engine`: Support configurable split methods and relation labels in Concept mode.

## Impact

- `src/worker/nlp-worker.ts`: Major updates to `processConceptGraph` for splitting logic and `mergeEdge` usage.
- `src/main.ts`: Ensure `splitMethod` is correctly passed and handled for both modes.
