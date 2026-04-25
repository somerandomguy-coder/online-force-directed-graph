## ADDED Requirements

### Requirement: Insightful Token Filtering
The system SHALL filter out non-insightful tokens during the NLP preprocessing phase. This includes:
- Short tokens with less than 2 characters (e.g., "s", "v").
- Common possessives and punctuation-related fragments (e.g., "'s").
- Standard abbreviations that don't add semantic value in a graph context (e.g., "st.", "cf.", "v.").
- Purely numerical tokens (e.g., "123", "45.6").
- Greek numerals and their variations.

#### Scenario: Filtering short and non-semantic tokens
- **WHEN** the input text contains "'s", "v.", "st.", "123", and "alpha"
- **THEN** "'s", "v.", "st.", and "123" are excluded from the final node list, while "alpha" is retained.
