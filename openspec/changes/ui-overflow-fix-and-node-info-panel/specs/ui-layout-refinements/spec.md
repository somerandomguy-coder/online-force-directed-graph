## MODIFIED Requirements

### Requirement: Top-Left UI Menu
The system SHALL display the UI control panel in the top-left corner of the screen. The panel SHALL include sections for text input, file upload, split methods, node limits, and text editing tools. All input fields and buttons SHALL be contained within the panel boundaries (300px width) without horizontal overflow.

#### Scenario: Fixed control layout
- **WHEN** the find and replace fields are rendered
- **THEN** they fit within the 300px width of the `#ui` container using proper box-sizing or width percentages.
