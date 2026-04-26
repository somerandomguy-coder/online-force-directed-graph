## Why

Currently, all conceptual relations in the graph are labeled generically as "co-occurs". This provides limited analytical value as it doesn't describe the nature of the relationship between entities. By extracting specific verbs or action words that connect entities, we can provide a much more meaningful semantic graph.

## What Changes

- **Heuristic Relation Extraction**: Implement logic to identify verbs or descriptive tokens that appear between extracted concepts within the same sentence/chunk.
- **Dynamic Link Labeling**: Replace the static "co-occurs" label with extracted semantic relations (e.g., "acquired", "founded", "partnered with").
- **Weighting Refinement**: Adjust link weights based on the strength or frequency of these specific relations.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `worker-nlp-engine`: Update requirements to include semantic relationship extraction instead of static co-occurrence labeling.

## Impact

- `src/worker/nlp-worker.ts`: significant updates to `processConceptGraph` to identify connecting verbs.
- `src/renderer/canvas-renderer.ts`: (Informational) Existing conditional label rendering will now display these richer labels.
