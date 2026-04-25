## MODIFIED Requirements

### Requirement: Canvas-Based Node Rendering
The system SHALL draw graph nodes and links directly to an HTML5 Canvas element. When clustering is enabled, nodes SHALL be colored based on their `cluster` ID using a provided color map.

#### Scenario: Rendering clustered nodes
- **WHEN** clustering mode is active
- **THEN** each node is drawn with a fill color corresponding to its assigned cluster ID.
