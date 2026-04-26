## Context

The current application provides a single view for word co-occurrence. This design introduces a multi-mode architecture allowing users to toggle between "Co-occurrence" (proximity-based) and "Concept" (entity/semantic-based) visualizations.

## Goals / Non-Goals

**Goals:**
- Implement a tabbed UI to switch between graph modes.
- Extend the NLP worker to support entity-based extraction.
- Reuse the existing graph rendering and physics pipeline.
- Maintain browser-compatible performance using winkNLP.

**Non-Goals:**
- Introducing complex deep learning models (keeping it lightweight).
- Full natural language understanding or question answering.
- Massive architectural rewrite of the renderer.

## Decisions

### 1. Mode Dispatching in Worker
**Decision**: Use a `mode` flag in the worker's `PROCESS_TEXT` message handler.
**Rationale**: Keeps the API simple and allows the worker to branch its logic early.
**Alternatives**: Separate workers for each mode (rejected due to overhead and duplicated model loading).

### 2. Concept Extraction Strategy
**Decision**: Combine `doc.entities()` with filtered tokens (Nouns and Proper Nouns).
**Rationale**: winkNLP's entity recognition is fast but might miss domain-specific terms that regular POS tagging for nouns will catch.
**Alternatives**: Entity extraction only (too restrictive), all tokens (too noisy).

### 3. Sentence-Level Edges
**Decision**: Connect all concepts within a single sentence (clique per sentence).
**Rationale**: Concepts in the same sentence are highly likely to be related. Scaling to "blocks" can be a user-configurable fallback.
**Alternatives**: Sliding window on concepts (rejected as it loses semantic sentence boundaries).

### 4. Tab UI Implementation
**Decision**: Add a tab bar to the top of the controls panel that updates a `currentMode` state in `main.ts`.
**Rationale**: Minimizes DOM changes while providing clear user feedback.

## Risks / Trade-offs

- **[Risk]** Concept mode might be slower due to more intensive NLP features. → **Mitigation**: Use winkNLP's lightweight model and process asynchronously in the worker.
- **[Risk]** Concept graphs might be sparse for small texts. → **Mitigation**: Fallback to noun phrases if no formal entities are found.
- **[Risk]** Visual noise from edge labels. → **Mitigation**: Edge labels (if implemented) will only show on hover or at high zoom levels.
