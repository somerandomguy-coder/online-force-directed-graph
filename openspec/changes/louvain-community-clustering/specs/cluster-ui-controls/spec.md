## ADDED Requirements

### Requirement: Cluster Toggle Button
The system SHALL provide a "Cluster" button located in the top-middle of the screen to toggle the clustering visualization.

#### Scenario: Toggling clustering on
- **WHEN** the "Cluster" button is clicked and clustering is currently off
- **THEN** the graph nodes are colored according to their cluster assignments.

#### Scenario: Toggling clustering off
- **WHEN** the "Cluster" button is clicked and clustering is currently on
- **THEN** the graph nodes return to their default color.

### Requirement: Accessible Coloring
The system SHALL use a color palette that is visible on a white canvas and ensures distinct colors for neighboring clusters.

#### Scenario: Color visibility
- **WHEN** clustering is enabled
- **THEN** node colors have sufficient contrast against the white background.
