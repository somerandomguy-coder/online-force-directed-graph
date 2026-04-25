## ADDED Requirements

### Requirement: Adjustable Cohesion Controls
The system SHALL provide UI controls to adjust graph cohesion, specifically a Cluster Pull strength and a Global Gravity strength.

#### Scenario: Adjusting cluster pull
- **WHEN** the user increases the Cluster Pull slider
- **THEN** nodes of the same cluster gravitate closer to their cluster centroid.

#### Scenario: Adjusting global gravity
- **WHEN** the user increases the Global Gravity slider
- **THEN** all nodes in the graph are pulled toward the viewport center.
