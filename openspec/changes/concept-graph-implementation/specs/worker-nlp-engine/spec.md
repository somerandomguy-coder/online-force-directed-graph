## ADDED Requirements

### Requirement: Multi-Mode Processing
The system SHALL support multiple graph generation modes: "Co-occurrence" (proximity-based) and "Concept" (semantic-based).

#### Scenario: Switching modes
- **WHEN** the user selects "Concept" mode in the UI
- **THEN** the worker receives a message with the `mode` parameter set to "CONCEPT" and executes the corresponding extraction logic.

### Requirement: Shared Graph Structure
The worker SHALL return a consistent graph structure (nodes and links) regardless of the processing mode used.

#### Scenario: Data consistency
- **WHEN** processing completes in either mode
- **THEN** the output payload is compatible with the existing `setData` method in the renderer.
