## ADDED Requirements

### Requirement: Concept Graph Generation
The system SHALL support a "Concept" mode that extracts named entities and POS-filtered nouns (NOUN, PROPN) as nodes, connecting concepts that appear within the same sentence.

#### Scenario: Processing concepts in text
- **WHEN** text with multiple entities and nouns is processed in "CONCEPT" mode
- **THEN** the resulting graph contains nodes representing these entities and nouns, with edges representing co-occurrence within sentences.

### Requirement: Enhanced Processing Metadata
The system SHALL return detailed performance and density metadata upon completion of graph processing.

#### Scenario: Metadata delivery
- **WHEN** graph data is sent to the main thread
- **THEN** the payload includes `processTime`, `nodeCount`, and `linkCount` fields.
