## MODIFIED Requirements

### Requirement: Optimized Physics Draw Loop
The system SHALL use `requestAnimationFrame` to synchronize D3 force simulation updates with Canvas drawing commands. The simulation SHALL support dynamic force updates (re-heating alpha) when physics parameters are adjusted.

#### Scenario: Smooth simulation
- **WHEN** the force simulation is active
- **THEN** the Canvas is cleared and redrawn on every frame to reflect updated node positions.

#### Scenario: Dynamic force adjustment
- **WHEN** the user updates a physics parameter (e.g., gravity or cluster pull)
- **THEN** the simulation alpha is increased to re-start the movement toward the new layout state.
