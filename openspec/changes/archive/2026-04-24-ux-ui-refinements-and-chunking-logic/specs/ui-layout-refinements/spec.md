## ADDED Requirements

### Requirement: Centered UI Menu
The system SHALL display the UI control panel in the center of the screen by default.

#### Scenario: Initial Load
- **WHEN** the application loads
- **THEN** the `#ui` menu is positioned at the horizontal and vertical center of the viewport.

### Requirement: Clickable Upload Zone
The system SHALL trigger a file selection dialog when the drop zone is clicked.

#### Scenario: Manual File Selection
- **WHEN** the user clicks anywhere on the `#drop-zone` element
- **THEN** the browser's native file explorer is opened for text file selection.
