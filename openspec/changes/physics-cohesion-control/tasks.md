## 1. UI Integration

- [x] 1.1 Add Cluster Pull and Global Gravity sliders to `index.html`.
- [x] 1.2 Update `main.ts` to capture slider inputs and add event listeners.

## 2. CanvasRenderer Updates

- [x] 2.1 Implement `updatePhysicsSettings()` in `CanvasRenderer` to update D3 simulation forces.
- [x] 2.2 Configure `forceX` and `forceY` for global gravity.
- [x] 2.3 Implement custom cluster-centroid force for D3.

## 3. Integration & Validation

- [x] 3.1 Link slider state changes to `renderer.updatePhysicsSettings()`.
- [x] 3.2 Validate smooth transitions (re-heating simulation without resetting layout).
- [x] 3.3 Verify performance with 1000+ node graph.
