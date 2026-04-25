## Why

The current UI and UX of the NLP Graph Visualizer have several friction points:
- The control menu is fixed to the top-left, which can feel disconnected from the central visualization.
- File uploading requires a manual drag-and-drop, lacking a traditional click-to-upload interface.
- Node interaction (hovering) is based on a fixed distance rather than the visual size of the node, leading to inconsistent feedback.
- Node labels are positioned above the circles, which can be hard to read when nodes are dense.
- The data processing logic (chunking) lacks granularity, treating the entire text as a single unit and resulting in spurious connections across semantic boundaries (e.g., between sentences or paragraphs).

## What Changes

- **Centered UI**: Move the UI control panel to the center of the screen (initially) or provide a more balanced layout.
- **Click-to-Upload**: Clicking the drop zone will now open the native file explorer.
- **Improved Node Hover**: Node activation (glow/hover) will now trigger when touching any part of the circle, dynamically adjusting to the node's radius.
- **Centered Labels**: Node text/labels will be rendered in the middle of the circles.
- **Configurable Max Nodes**: Add a UI control (predefined buttons: 50, 100, 200, 500, 1000) for the maximum number of nodes to display.
- **Semantic Chunking**: Update the NLP engine to respect document/sentence boundaries when calculating co-occurrences, preventing "cross-chunk" adjacency.

## Capabilities

### New Capabilities
- `ui-layout-refinements`: Centering the UI and improving the file upload interaction.
- `configurable-node-limits`: UI buttons to control the `maxNodes` parameter.

### Modified Capabilities
- `canvas-graph-renderer`: Update hover logic to use dynamic radii and center labels within nodes.
- `worker-nlp-engine`: Update chunking logic to respect semantic boundaries and improve co-occurrence accuracy.

## Impact

- `index.html`: UI structure and CSS for centering and new buttons.
- `src/main.ts`: Event listeners for file selection and node limit buttons.
- `src/renderer/canvas-renderer.ts`: Render loop and interaction logic for nodes.
- `src/worker/nlp-worker.ts`: NLP processing logic for sentence-based co-occurrence.
