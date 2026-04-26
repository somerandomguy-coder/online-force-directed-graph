## MODIFIED Requirements

### Requirement: Concept Graph Generation
The system SHALL support a "Concept" mode that extracts named entities and POS-filtered nouns (NOUN, PROPN) as nodes, connecting concepts that appear within the same chunk (sentence or block, based on user selection). Links between concepts SHALL be assigned a semantic label derived from verbs found between the concepts in the source text.

#### Scenario: Extracting semantic relations from sentences
- **WHEN** the sentence "Apple acquired NeXT in 1996" is processed
- **THEN** a link between "Apple" and "NeXT" is created with the label "acquire".

#### Scenario: Fallback for missing verbs
- **WHEN** two entities appear together without a connecting verb (e.g., "Apple, NeXT")
- **THEN** the link is assigned a fallback label such as "co-occurs" or "associated with".

## ADDED Requirements

### Requirement: Most Frequent Relation Selection
The system SHALL select the most frequently occurring semantic label for a given link if multiple different relations are found between the same pair of entities across the dataset.

#### Scenario: Resolving multiple relations
- **WHEN** "A founded B" occurs 5 times and "A acquired B" occurs 2 times
- **THEN** the final graph link between A and B is labeled "found".
