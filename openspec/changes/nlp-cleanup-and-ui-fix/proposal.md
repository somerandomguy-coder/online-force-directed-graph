## Why

The current NLP engine generates nodes for non-insightful tokens (e.g., "'s", "v.", "st.", "cf", numbers, and Greek numerals), which clutters the visualization and reduces its value. Additionally, the "Find and Replace" UI block overflows its parent container, making it difficult to use.

## What Changes

- **NLP Preprocessing Enhancement**: Filter out tokens that are very short (e.g., "'s", "v."), common abbreviations ("st.", "cf"), numerical values, and Greek numerals.
- **UI Layout Fix**: Constrain the "Find and Replace" block to stay within the bounds of the control menu, preventing horizontal or vertical overflow.

## Capabilities

### New Capabilities
- `ui-layout-refinements`: Ensure UI components like the Find/Replace block are correctly contained and styled within the side menu.

### Modified Capabilities
- `worker-nlp-engine`: Add stricter filtering criteria for tokens during preprocessing to exclude non-insightful character sequences and numbers.

## Impact

- `src/worker/nlp-worker.ts`: Update token cleaning logic.
- `src/style.css`: Update UI container and find/replace block styling.
