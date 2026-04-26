## Context

The application features a "Concept Graph" mode alongside the standard "Co-occurrence" mode. While the UI supports switching between these modes, the worker implementation for "Concept Graph" is currently a placeholder or incomplete. Furthermore, the Canvas renderer displays all edge labels simultaneously, which results in significant visual clutter, especially with dense graphs.

## Goals / Non-Goals

**Goals:**
- Implement a robust `processConceptGraph` function that extracts both named entities and key nouns/proper nouns.
- Optimize the `CanvasRenderer` to render edge labels conditionally based on zoom level and user interaction (hover).
- Enhance worker metadata to include processing time and data density metrics.

**Non-Goals:**
- Implementing hierarchical clustering.
- Changing the underlying physics engine or force layout.
- Adding new UI tabs or major layout changes.

## Decisions

### 1. Concept Extraction Strategy
We will use `wink-nlp`'s `entities()` method to capture established entities (names, locations, etc.) and `tokens()` with POS tagging to extract significant nouns and proper nouns that might not be tagged as entities.
- **Rationale**: Combining these two methods ensures a rich representation of the text's semantic content without missing key thematic elements.

### 2. Conditional Link Label Rendering
Link labels will only be rendered if:
- `transform.k > 1.5` (User is zoomed in sufficiently)
- **OR** the user is hovering over either the `source` or `target` node of the link.
- **Rationale**: This drastically reduces visual noise in the default "birds-eye" view while still providing detailed information when the user explores specific areas of the graph.

### 3. Worker Metadata Enhancements
The worker will return additional metadata:
- `processTime`: Total time spent in extraction and graph building.
- `nodeCount` / `linkCount`: Metrics on the final graph size.
- **Rationale**: This aids in debugging and performance monitoring during development and for future optimizations.

## Risks / Trade-offs

- **[Risk]** Large texts could lead to slow extraction times in the worker.
  - **Mitigation**: Ensure efficient iteration over sentences and tokens; respect the `maxNodes` option to prune the graph early.
- **[Risk]** Hover-based label rendering might feel jittery if not handled smoothly.
  - **Mitigation**: The `CanvasRenderer` already uses a `requestAnimationFrame` loop, ensuring that hover state changes trigger immediate re-renders.
