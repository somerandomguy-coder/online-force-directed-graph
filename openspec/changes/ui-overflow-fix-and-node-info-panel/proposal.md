## Why

The current "Find and Replace" UI component overflows the boundaries of the control panel, degrading the user experience. Additionally, users need a way to inspect specific node metadata and relationships (top neighbors) without relying solely on visual inspection of the graph.

## What Changes

- **Control Panel Layout Fix**: Adjust CSS to prevent find-and-replace inputs from overflowing the menu.
- **Node Info Panel**: Add a new UI component in the top-right corner to show details of the currently highlighted/hovered node.
- **Top 5 Neighbors List**: Display the top 5 most frequent/important neighbors of the highlighted node in a dropdown/list format.
- **Visibility Toggle**: Provide a setting in the main control panel to turn the Node Info panel on or off.

## Capabilities

### New Capabilities
- `node-info-panel`: Requirements for the top-right information display, neighbor sorting, and data binding to hovered state.

### Modified Capabilities
- `ui-layout-refinements`: Update layout requirements to fix overflow issues and include the new toggle setting.

## Impact

- `index.html`: New CSS for overflow fix and HTML structure for the info panel.
- `src/main.ts`: Logic to handle the info panel toggle and coordinate data between the renderer and the new UI.
- `src/renderer/canvas-renderer.ts`: (Internal) Expose highlighted node and neighbor data for the UI to consume.
