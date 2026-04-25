## MODIFIED Requirements

### Requirement: Top-Left UI Menu
The system SHALL display the UI control panel in the top-left corner of the screen.

#### Scenario: Initial Load
- **WHEN** the application loads
- **THEN** the `#ui` menu is positioned at the top-left of the viewport (e.g., `top: 20px; left: 20px;`).

## REMOVED Requirements

### Requirement: Centered UI Menu
**Reason**: Reverted based on user feedback preferring the original layout.
**Migration**: Use the updated Top-Left UI Menu requirement.
