## MODIFIED Requirements

### Requirement: Asynchronous Matrix Generation
The system SHALL calculate the co-occurrence matrix in the background and return the result via message passing. The co-occurrence calculation SHALL respect semantic boundaries (e.g., sentences) and only count adjacencies within the same chunk.

#### Scenario: Matrix completion
- **WHEN** the worker finishes calculating relationships
- **THEN** it sends a JSON payload of nodes and links to the main thread for rendering.

#### Scenario: Boundary-aware co-occurrence
- **WHEN** word A is at the end of sentence 1 and word B is at the start of sentence 2
- **THEN** no co-occurrence is recorded between word A and word B for that transition.
