## Why

Users currently have no way to quickly remove specific "nodes" (words) from the graph other than manually editing the entire text block. A "Find and Replace" tool provides a streamlined way to clean up the source text, remove unwanted terms, or group similar concepts, directly reflecting those changes in the visualization.

## What Changes

- **Find and Replace UI**: Add "Find" and "Replace" input fields to the control panel.
- **Bulk Edit Action**: Add a "Replace All" button that performs the text substitution.
- **Auto-Update**: Trigger a graph re-process automatically after a successful replace operation if the text has changed.

## Capabilities

### New Capabilities
- `text-editing-tools`: Requirements for the find-and-replace interface and substitution logic.

### Modified Capabilities
- `ui-layout-refinements`: Update the top-left menu requirements to include the new editing tools.

## Impact

- `index.html`: New input fields and buttons in the `#ui` panel.
- `src/main.ts`: Event handlers for find/replace and logic to update the `textarea` and trigger re-processing.
