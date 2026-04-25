## ADDED Requirements

### Requirement: Word-based Find and Replace
The system SHALL provide a mechanism to replace all occurrences of a specific string with another string within the source text.

#### Scenario: Replacing a common word
- **WHEN** the user enters "the" in the Find field and "THE" in the Replace field, then clicks "Replace All"
- **THEN** every instance of "the" in the textarea is updated to "THE".

### Requirement: Graph Auto-Update after Edit
The system SHALL automatically re-process the text and update the visualization after a replace operation is performed.

#### Scenario: Updating graph after replacement
- **WHEN** the user performs a "Replace All" action
- **THEN** the graph is re-generated to reflect the updated text content.
