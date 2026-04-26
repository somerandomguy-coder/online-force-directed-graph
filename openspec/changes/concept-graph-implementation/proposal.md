## Why

The current co-occurrence graph provides a useful but low-level view of word proximity. A "Concept Graph" mode will leverage semantic structures (entities and noun phrases) to provide a higher-order visualization of relationships between core concepts, making the graph more meaningful for knowledge discovery.

## What Changes

- **UI Tabs**: Introduce a tabbed interface to switch between "Co-occurrence Graph" and "Concept Graph" modes.
- **NLP Processing Mode**: Add a new processing strategy in the worker that focuses on entities and nouns at the sentence level.
- **Dynamic Graph Construction**: Reuse the existing graphology and rendering pipeline but with a different node/edge extraction logic for the Concept mode.
- **State Management**: Persist the selected mode and re-process text when switching to ensure the visualization matches the intent.

## Capabilities

### New Capabilities
- `concept-graph-generation`: Logic for extracting entities and nouns from winkNLP sentences and constructing edges between them within the same context block.

### Modified Capabilities
- `worker-nlp-engine`: Add support for multi-mode processing (switch between token-based co-occurrence and entity-based concept extraction).
- `canvas-graph-renderer`: Ensure the renderer can handle potential edge labels (e.g., verbs) if introduced, and maintain performance with entity-heavy graphs.

## Impact

- **Worker API**: `PROCESS_TEXT` message will now include a `mode` option.
- **Main Thread**: New UI elements for tab switching.
- **NLP Engine**: Increased use of winkNLP features (`entities()`, POS tagging).
- **Performance**: Processing might take slightly longer for Concept mode due to POS tagging, but will remain browser-compatible.
