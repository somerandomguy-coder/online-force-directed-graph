## MODIFIED Requirements

### Requirement: Centered Node Labels
The system SHALL render the text label for each node in the exact center of the node's circle. The font size SHALL scale dynamically with the node's radius, ensuring the text fits within the circle for standard word lengths. The label color SHALL contrast with the node's color and the canvas background for high visibility.

#### Scenario: Rendering labels
- **WHEN** a node is drawn on the canvas
- **THEN** its text label is positioned at (node.x, node.y) with vertical and horizontal alignment set to center.
- **AND** the font size is proportional to `Math.sqrt(node.count)`.
