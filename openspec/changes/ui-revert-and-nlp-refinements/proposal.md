## Why

The recent UI centering refinement has been found less effective than the original top-left layout for the user's workflow. Additionally, the NLP engine includes noise from single-character words, and the visualization needs better legibility and interactive context (neighbor highlighting).

## What Changes

- **Revert UI Position**: Move the control menu back to the top-left corner.
- **Word Length Filtering**: Filter out tokens with only 1 character in the NLP worker.
- **Dynamic Node Labels**: 
  - Font size scales with node size.
  - Labels must fit inside the node circle where possible.
  - Improved color contrast for visibility against node and background.
- **Configurable Split Methods**: 
  - Support "Block Split" (split by empty lines/2+ newlines).
  - Add "Sentence Split" (split by individual sentences) as a selectable method.
- **Advanced Interaction**: 
  - Hovered node turns red.
  - Immediate neighbors of the hovered node turn yellow.

## Capabilities

### New Capabilities
- `node-interaction-styling`: Defines the red-hover and yellow-neighbor highlighting logic.
- `nlp-filtering-refinements`: Filtering logic for short words and new split methods.

### Modified Capabilities
- `canvas-graph-renderer`: Requirements for dynamic font scaling, contrast, and layout reversion.
- `ui-layout-refinements`: Reverting the centering requirement.

## Impact

- `index.html`: Revert layout styles, add split method toggle.
- `src/renderer/canvas-renderer.ts`: Update render loop for dynamic fonts and neighbor highlighting.
- `src/worker/nlp-worker.ts`: Update tokenization and chunking logic.
