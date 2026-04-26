## Why

The Concept Graph implementation is currently incomplete, lacking the robust extraction logic for entities and POS-filtered nouns. Additionally, the UI rendering of link labels is excessively noisy, drawing all labels regardless of zoom level or interaction, which clutters the visualization and degrades the user experience.

## What Changes

- **Worker Completion**: Implement the full `processConceptGraph` logic in `nlp-worker.ts`, ensuring it correctly leverages wink-nlp for entity extraction and POS-based filtering.
- **UI Refinement**: Update the `CanvasRenderer` to only display link labels when certain conditions are met:
    - The zoom level is high enough (e.g., `transform.k > 1.5`).
    - The source or target node of the link is currently hovered.
- **Metadata Enhancement**: Improve the worker's output metadata to provide better insights into processing performance and data density.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `worker-nlp-engine`: Complete implementation of POS-filtered and entity-based concept graph generation.
- `canvas-graph-renderer`: Introduce conditional rendering for link labels based on zoom and interaction.

## Impact

- `src/worker/nlp-worker.ts`: Significant updates to `processConceptGraph`.
- `src/renderer/canvas-renderer.ts`: Logic changes in the `render` method for link labels.
- `src/main.ts`: Potential minor updates to handle enhanced metadata if needed.
