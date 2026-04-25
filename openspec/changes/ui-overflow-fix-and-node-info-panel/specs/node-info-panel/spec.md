## ADDED Requirements

### Requirement: Interactive Node Info Display
The system SHALL display a panel in the top-right corner showing the ID of the currently highlighted (hovered) node.

#### Scenario: Hovering over a node
- **WHEN** the user hovers over node "example"
- **THEN** the top-right panel displays "example".

### Requirement: Top 5 Neighbors List
The system SHALL display a sorted list of the top 5 direct neighbors (by link weight or count) of the currently highlighted node.

#### Scenario: Inspecting relationships
- **WHEN** node "A" is hovered and has 10 neighbors
- **THEN** the panel shows the 5 neighbors with the highest connection frequency.

### Requirement: Panel Visibility Toggle
The system SHALL allow users to toggle the visibility of the Node Info panel via a setting in the main control menu.

#### Scenario: Disabling info panel
- **WHEN** the user unchecks the "Show Node Info" toggle
- **THEN** the top-right info panel is hidden from view.
