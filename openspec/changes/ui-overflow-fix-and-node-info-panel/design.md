## Context

The current visualization has interaction feedback via color changes but lacks a structured way to view node properties and relationships. Additionally, layout bugs in the CSS cause elements in the control panel to overflow their containers.

## Goals / Non-Goals

**Goals:**
- Fix the CSS overflow in the find-and-replace component.
- Provide a clear, toggleable "Metadata" display for hovered nodes.
- Display the top 5 most relevant neighbors for the highlighted node.

**Non-Goals:**
- Allowing editing of node properties from the info panel.
- Permanent node selection (the panel only follows the hover state).

## Decisions

### 1. Fix Overflow with `box-sizing: border-box`
- **Choice**: Apply `box-sizing: border-box` to all inputs in the `.find-replace-group`.
- **Rationale**: Currently, padding/border adds to the 100% width, causing overflow. Standardizing box-sizing prevents this.

### 2. Event-Driven Data Binding for Info Panel
- **Choice**: Implement a callback in `src/main.ts` that triggers whenever `renderer.hoveredNode` changes.
- **Rationale**: Keeps the renderer's job focused on drawing, while the main thread handles UI updates.

### 3. Top Neighbors Calculation
- **Choice**: When a node is hovered, iterate through the `adjacencyMap`, get neighbor IDs, map them to their corresponding node objects (to get weights/counts), and sort by `weight` (descending). Slice the top 5.
- **Rationale**: Reuses the existing `adjacencyMap` for performance.

### 4. Visibility State Management
- **Choice**: Use a checkbox in the main control panel and toggle a `.hidden` class on the `#node-info-panel`.
- **Rationale**: Simple, zero-dependency way to manage UI visibility.

## Risks / Trade-offs

- **[Risk]** Updating the DOM on every `mousemove` (hover change) might impact performance. → **Mitigation**: Only update the DOM if the `hoveredNode` has actually changed (prev vs current).
- **[Risk]** Neighbors list might be empty. → **Mitigation**: Handle null/empty states by showing "No neighbors" in the UI.
