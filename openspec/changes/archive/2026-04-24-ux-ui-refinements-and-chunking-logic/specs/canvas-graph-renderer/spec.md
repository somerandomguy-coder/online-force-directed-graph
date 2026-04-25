## ADDED Requirements

### Requirement: Centered Node Labels
The system SHALL render the text label for each node in the exact center of the node's circle.

#### Scenario: Rendering labels
- **WHEN** a node is drawn on the canvas
- **THEN** its text label is positioned at (node.x, node.y) with vertical and horizontal alignment set to center.

### Requirement: Radius-Accurate Hover Activation
The system SHALL activate a node's hover state (glow/highlight) only when the pointer is within the actual visual radius of the node.

#### Scenario: Hovering over a large node
- **WHEN** the mouse enters the circle of a node with radius R
- **THEN** the node glows, even if the distance from center is R.

#### Scenario: Hovering near a small node
- **WHEN** the mouse is outside the radius of a small node
- **THEN** the node does NOT glow, preventing accidental activation.
