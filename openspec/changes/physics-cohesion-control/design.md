## Context
The current graph layout relies on a fixed-force simulation that doesn't account for clustering or global gravity, leading to an overly dispersed visualization. Users need granular control over the graph's spatial "tension" to improve readability and cluster visibility.

## Goals / Non-Goals

**Goals:**
- Add UI controls for "Cluster Pull" and "Global Gravity".
- Maintain high performance (60fps) during layout transitions.
- Dynamically update D3 forces without losing current simulation state or re-parsing the graph data.

**Non-Goals:**
- Redesigning the underlying force engine.
- Adding complex constraint-based layout systems (e.g., labels overlapping avoidance).

## Decisions

- **Architecture**: The UI controls will update state in `main.ts`, which then calls `renderer.updatePhysicsSettings()`.
- **D3 Force Implementation**: 
  - `forceManyBody` strength will be adjusted dynamically.
  - `forceX` and `forceY` will be added to provide gravity to the center.
  - A custom `force` function will be added to the D3 simulation to pull nodes toward their calculated community (cluster) centroids.
- **Dynamic Updates**: When settings change, the simulation's `alpha` will be set to a small positive value (e.g., 0.1) to "re-heat" the simulation enough to allow nodes to settle into their new positions, but not so much that it loses its current visual structure.

## Risks / Trade-offs

- **Risk**: Too much re-heating might cause the graph to jump or jitter.
  - *Mitigation*: Experiment with `alpha` values and dampening to ensure smooth transitions.
- **Risk**: Added forces might impact performance on large graphs.
  - *Mitigation*: The custom cluster force will use optimized centroid calculation (cached) to keep the cost minimal per tick.
