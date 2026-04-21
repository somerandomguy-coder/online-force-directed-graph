## ADDED Requirements

### Requirement: Canvas-Based Node Rendering
The system SHALL draw graph nodes and links directly to an HTML5 Canvas element instead of creating SVG DOM nodes.

#### Scenario: Rendering thousands of nodes
- **WHEN** the dataset contains 5,000 nodes
- **THEN** the system maintains a frame rate above 30fps during physics simulation.

### Requirement: Optimized Physics Draw Loop
The system SHALL use `requestAnimationFrame` to synchronize D3 force simulation updates with Canvas drawing commands.

#### Scenario: Smooth simulation
- **WHEN** the force simulation is active
- **THEN** the Canvas is cleared and redrawn on every frame to reflect updated node positions.
