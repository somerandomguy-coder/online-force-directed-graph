## ADDED Requirements

### Requirement: Short Word Filtering
The system SHALL exclude any tokens with a length of 1 character from the graph data.

#### Scenario: Processing text with single characters
- **WHEN** the text contains "a", "I", or "8" as standalone words
- **THEN** these tokens are removed before co-occurrence calculation.

### Requirement: Configurable Text Splitting
The system SHALL support multiple methods for splitting text into semantic chunks.

#### Scenario: Block splitting
- **WHEN** "Block Split" is selected
- **THEN** text is split by empty lines or 2+ consecutive newlines.

#### Scenario: Sentence splitting
- **WHEN** "Sentence Split" is selected
- **THEN** text is split by individual sentences.
