## 1. UI Infrastructure

- [x] 1.1 Add Tab UI components to `index.html` for "Co-occurrence" and "Concept" modes.
- [x] 1.2 Update `style.css` with tab styling and active state indicators.
- [x] 1.3 Initialize `currentMode` state in `main.ts` and wire up tab click listeners.

## 2. Worker Extension

- [x] 2.1 Update `nlp-worker.ts` to accept `mode` in `PROCESS_TEXT` message.
- [x] 2.2 Implement `processConceptGraph` function in the worker using `entities()` and POS filtering.
- [x] 2.3 Refactor existing co-occurrence logic into a `processCoOccurrenceGraph` function for better maintainability.
- [x] 2.4 Ensure the worker returns consistent `GraphData` structure for both modes.

## 3. Renderer Enhancements

- [x] 3.1 Update `CanvasRenderer` link rendering to support optional `label` text.
- [x] 3.2 Ensure the renderer handle clear/re-simulation when switching graph modes.

## 4. Integration & Validation

- [x] 4.1 Trigger automatic re-processing of current text when switching tabs.
- [x] 4.2 Verify entity extraction quality with sample datasets (e.g., news articles, technical docs).
- [x] 4.3 Perform a regression check to ensure "Co-occurrence" mode still functions as expected.
