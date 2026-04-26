## ADDED Requirements

### Requirement: Entity-Based Node Extraction
The system SHALL extract entities (e.g., people, places, organizations) and unique noun phrases as nodes for the "Concept Graph" mode.

#### Scenario: Extracting concepts from text
- **WHEN** "Steve Jobs founded Apple in California" is processed in Concept mode
- **THEN** nodes for "Steve Jobs", "Apple", and "California" are created.

### Requirement: Sentence-Level Concept Linking
The system SHALL create links between all identified concepts that appear within the same sentence or cohesive text block.

#### Scenario: Linking entities in a sentence
- **WHEN** a sentence contains three distinct entities
- **THEN** a triangle of links is created connecting all three entities.

### Requirement: POS Filtering for Nouns
The system SHALL filter tokens to prioritize Proper Nouns and Nouns when identifying candidate concept nodes.

#### Scenario: Filtering common words
- **WHEN** processing a sentence with verbs and adjectives
- **THEN** only the nouns and entities are promoted to graph nodes.
