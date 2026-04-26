## ADDED Requirements

### Requirement: Conditional Link Label Rendering
The system SHALL only render labels for graph links when the zoom level is above a defined threshold (1.5x) OR when one of the linked nodes is being hovered by the user.

#### Scenario: Zooming in for detail
- **WHEN** the user zooms in to 2.0x
- **THEN** link labels become visible on the Canvas.

#### Scenario: Hovering to inspect
- **WHEN** the zoom level is 1.0x and the user hovers over a node
- **THEN** labels for all links connected to that node become visible.
