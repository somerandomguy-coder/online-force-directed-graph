## ADDED Requirements

### Requirement: Preset Node Limit Buttons
The system SHALL provide a set of preset buttons to control the maximum number of nodes rendered in the graph.

#### Scenario: Selecting a preset limit
- **WHEN** the user clicks a button labeled "50", "100", "200", "500", or "1000"
- **THEN** the `maxNodes` parameter is updated, and the graph is re-processed with the new limit.
