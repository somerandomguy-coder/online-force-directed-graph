## MODIFIED Requirements

### Requirement: Concept Graph Generation
The system SHALL support a "Concept" mode that extracts named entities and POS-filtered nouns (NOUN, PROPN) as nodes, connecting concepts that appear within the same chunk (sentence or block, based on user selection). Links between concepts SHALL be assigned a descriptive label (e.g., "co-occurs").

#### Scenario: Processing concepts in sentences
- **WHEN** text is processed in "CONCEPT" mode with "Split by: Sentence"
- **THEN** nodes are extracted from each sentence and connected with "co-occurs" labels if they appear in the same sentence.

#### Scenario: Processing concepts in blocks
- **WHEN** text is processed in "CONCEPT" mode with "Split by: Block"
- **THEN** nodes are extracted from each paragraph/block and connected if they appear in the same block.

## ADDED Requirements

### Requirement: Idempotent Edge Merging
The worker SHALL use idempotent operations (`mergeEdge`) when building the graph to ensure no runtime errors occur when redundant conceptual links are discovered.

#### Scenario: Redundant links in blocks
- **WHEN** the same pair of concepts appears multiple times in a large text block
- **THEN** the worker merges the edges without error, incrementing the weight.
