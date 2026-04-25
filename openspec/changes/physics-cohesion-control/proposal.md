## Why

The current graph visualization is often too scattered, making it difficult to identify word clusters or see the overall structure from a high-level view. This change introduces adjustable physics controls to allow users to increase graph "tension," pulling related words together and consolidating the entire graph into a more readable, compact form.

## What Changes

- Add a **Physics Control** panel to the UI with two interactive sliders:
  - **Cluster Pull**: Controls the strength of a force that pulls nodes of the same cluster toward their shared center.
  - **Global Gravity**: Controls the strength of a force pulling all nodes toward the center of the viewport.
- Modify `CanvasRenderer` to support dynamic force updates without restarting the simulation.
- Implement a custom D3 force for cluster-based cohesion.

## Capabilities

### New Capabilities
- `physics-cohesion-control`: Provides UI controls and physics logic for adjusting the spatial density and grouping of the graph.

### Modified Capabilities
- `canvas-graph-renderer`: Requirements extended to include support for cluster-aware layout forces and dynamic gravity adjustment.

## Impact

- **UI**: New sliders in the control panel.
- **Renderer**: `CanvasRenderer` will manage new D3 forces (`forceX`, `forceY` for gravity, and a custom cluster force).
- **State**: `main.ts` will track physics settings and update the renderer in real-time.
