## Context

The project is a high-performance NLP graph visualizer using D3.js and HTML5 Canvas. Currently, the UI is positioned in the top-left corner, and data processing is performed in a Web Worker but lacks semantic awareness of sentence boundaries.

## Goals / Non-Goals

**Goals:**
- Centralize the UI for a more focused user experience.
- Enhance node interaction accuracy in the Canvas renderer.
- Improve data quality by preventing co-occurrence links between unrelated sentences.
- Provide users with direct control over the node limit.

**Non-Goals:**
- Implementing a full-featured graph layout editor.
- Changing the underlying physics engine (D3-force).
- Supporting complex file types beyond plain text.

## Decisions

### 1. UI Centering using CSS Flexbox
- **Choice**: Use a wrapper container with `display: flex; align-items: center; justify-content: center;`.
- **Rationale**: Provides the most robust and responsive way to center the `#ui` menu over the full-screen canvas.

### 2. Hidden File Input for "Click-to-Upload"
- **Choice**: Add a hidden `<input type="file">` and trigger its `.click()` method when the `#drop-zone` is clicked.
- **Rationale**: Keeps the visual design of the drop zone while providing standard file explorer access.

### 3. Dynamic Radius Hover Detection
- **Choice**: Modify the `mousemove` handler to calculate the distance to the nearest node and compare it against `node.radius`.
- **Rationale**: The current fixed-distance search (20px) is inaccurate for nodes of varying sizes.

### 4. Sentence-based Chunking in NLP Worker
- **Choice**: Use `nlp.readDoc(text).sentences().out(its.normal)` to get an array of sentences, then process each sentence individually for co-occurrences.
- **Rationale**: This prevents words at the end of one sentence from being linked to words at the beginning of the next, which are usually semantically unrelated.

## Risks / Trade-offs

- **[Risk]** Large files with very long sentences might still cause semantic noise. → **Mitigation**: The current `windowSize` (3-4) is small enough that this impact is localized.
- **[Risk]** Centered UI might block the visualization. → **Mitigation**: Make the UI panel semi-transparent or allow it to be collapsed (future enhancement).
