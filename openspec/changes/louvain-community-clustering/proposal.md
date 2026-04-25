## Why

Users need a way to visually group related nodes into thematic clusters to better understand the structure of the force-directed graph. Currently, the graph displays all nodes as a single group, which can make it difficult to identify sub-communities or related topics within the text.

## What Changes

- **Clustering Engine**: Implement Louvain Community Detection to automatically group nodes based on their connection density.
- **Toggle Control**: Add a "Cluster" button in the top-middle of the screen to enable/disable cluster visualization.
- **Cluster Coloring**: Assign distinct, high-contrast colors to each cluster to ensure no two neighboring clusters share the same color (greedy coloring approach).
- **Worker Integration**: Integrate clustering into the existing NLP Web Worker to keep the main thread responsive.

## Capabilities

### New Capabilities
- `louvain-community-detection`: Core algorithm and logic for identifying communities in the co-occurrence graph.
- `cluster-ui-controls`: UI components for toggling clustering and managing visual state.

### Modified Capabilities
- `worker-nlp-engine`: Add clustering step to the graph generation pipeline.
- `canvas-graph-renderer`: Add support for rendering nodes with cluster-based coloring and dynamic color mapping.

## Impact

- `src/worker/nlp-worker.ts`: Add `graphology` and Louvain clustering logic.
- `src/renderer/canvas-renderer.ts`: Update node drawing to use cluster colors.
- `src/main.ts`: Add UI button and toggle state management.
- `package.json`: Add `graphology` and `graphology-communities-louvain` dependencies.
