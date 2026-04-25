## Context

The current force-directed graph provides a flat view of text data. To enhance analytical capabilities, we are adding Louvain Community Detection to group related nodes. This requires adding new graph-processing libraries and updating the visualization pipeline.

## Goals / Non-Goals

**Goals:**
- Add Louvain clustering to the graph generation pipeline.
- Allow users to toggle cluster coloring via the UI.
- Maintain high performance by running clustering in the Web Worker.

**Non-Goals:**
- Real-time re-clustering during physics simulation (clustering is done once per dataset update).
- Hierarchical clustering (only single-level Louvain for now).

## Decisions

### 1. Library Selection: Graphology
- **Decision**: Use `graphology` and `graphology-communities-louvain`.
- **Rationale**: These are industry-standard, lightweight, and work well in both main thread and Web Workers. The user specifically provided a snippet using these libraries in `implementation.ts`.
- **Alternatives**: Implementing Louvain from scratch (high complexity, error-prone) or using `d3-community` (less maintained).

### 2. UI Placement: Top-Middle Toggle
- **Decision**: Place the "Cluster" button in a new absolute-positioned container at `top: 20px; left: 50%; transform: translateX(-50%);`.
- **Rationale**: Keeps the control prominent but separate from the density of the left-hand configuration menu.
- **Alternatives**: Adding it to the left menu (already crowded).

### 3. Coloring Strategy: Greedy High-Contrast
- **Decision**: Use `d3.scaleOrdinal` with `d3.schemeTableau1schemeTableau10` or a custom set of high-contrast colors.
- **Rationale**: Tableau10 provides excellent visibility on white backgrounds.
- **Alternatives**: Random colors (poor contrast/readability).

### 4. Worker Integration
- **Decision**: Perform clustering immediately after link generation in `nlp-worker.ts`.
- **Rationale**: Clustering depends on the full graph topology. Doing it before sending data to the main thread reduces message overhead and keeps the UI smooth.

## Risks / Trade-offs

- **[Risk]** Large graphs might increase worker processing time. → **Mitigation**: Louvain is generally fast (O(N log N) or O(N)), and we already have node limits in place.
- **[Risk]** Color collisions (two adjacent clusters looking too similar). → **Mitigation**: Use a distinct palette like `d3.schemeCategory10` which is designed to minimize this.
