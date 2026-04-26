## ADDED Requirements

### Requirement: Optional Edge Label Support
The renderer SHALL be capable of displaying labels on links when provided in the graph data.

#### Scenario: Displaying verb-labeled edges
- **WHEN** a link object contains a `label` property (e.g., a verb like "founded")
- **THEN** the renderer draws the text along the path of the link.
