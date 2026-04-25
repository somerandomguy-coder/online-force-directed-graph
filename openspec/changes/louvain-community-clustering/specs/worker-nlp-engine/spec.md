## MODIFIED Requirements

### Requirement: Asynchronous Matrix Generation
The system SHALL calculate the co-occurrence matrix in the background, detect communities using Louvain, and return the result via message passing.

#### Scenario: Matrix completion with clustering
- **WHEN** the worker finishes calculating relationships and clusters
- **THEN** it sends a JSON payload of nodes (with `cluster` property) and links to the main thread for rendering.
