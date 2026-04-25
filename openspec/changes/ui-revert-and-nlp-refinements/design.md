## Context

The project is moving towards a more refined and legible visualization. User feedback indicates that the top-left layout is more practical, and interactive highlighting of connected nodes is essential for discovering relationships in dense graphs.

## Goals / Non-Goals

**Goals:**
- Improve data signal-to-noise ratio by filtering short words.
- Restore the preferred UI layout.
- Enhance graph interactive exploration with neighbor highlighting.
- Maximize legibility of node labels.

**Non-Goals:**
- Adding a search feature for specific nodes.
- Supporting multi-language sentence splitting (sticking to `wink-nlp` defaults).

## Decisions

### 1. UI Rollback to Absolute Positioning
- **Choice**: Revert `index.html` styles to use `top: 20px; left: 20px;` for the `#ui` panel.
- **Rationale**: Direct user request. Absolute positioning is simpler and less intrusive for the full-screen canvas.

### 2. Adjacency Mapping for Highlighting
- **Choice**: Maintain a `Map<string, Set<string>>` adjacency list in `CanvasRenderer` derived from the `links` data.
- **Rationale**: Allows O(1) lookup of neighbors when a node is hovered, ensuring the 60fps render loop remains smooth.

### 3. Dynamic Font Scaling Formula
- **Choice**: `fontSize = Math.min(maxAllowed, radius * 0.8)`. Use `ctx.measureText` to check width and downscale if it exceeds `radius * 2`.
- **Rationale**: Ensures labels are as large as possible without overflowing the node circle.

### 4. Split Method Parameterization
- **Choice**: Add a `splitMethod` option to the worker message.
- **Rationale**: Decouples the UI choice from the worker implementation.

## Risks / Trade-offs

- **[Risk]** Heavy neighbor highlighting in extremely dense graphs might create visual clutter. → **Mitigation**: Use a distinct but not overwhelming yellow color; consider limiting highlighting to nodes with < 50 neighbors.
- **[Risk]** Dynamic font calculation (`measureText`) in a tight loop. → **Mitigation**: Cache the font size on the node object once when data is set.
