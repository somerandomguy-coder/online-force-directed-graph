## ADDED Requirements

### Requirement: Off-thread Tokenization
The system SHALL perform all text tokenization and NLP cleaning within a Web Worker to prevent UI blocking.

#### Scenario: Tokenizing large text
- **WHEN** a 5MB text blob is provided
- **THEN** the main thread remains responsive (e.g., animations continue) while the worker processes tokens.

### Requirement: Asynchronous Matrix Generation
The system SHALL calculate the co-occurrence matrix in the background and return the result via message passing.

#### Scenario: Matrix completion
- **WHEN** the worker finishes calculating relationships
- **THEN** it sends a JSON payload of nodes and links to the main thread for rendering.
