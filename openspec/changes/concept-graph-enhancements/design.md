## Context

The "Concept Graph" mode currently operates on a per-sentence basis and does not utilize the `splitMethod` option provided in the UI. It also produces an unlabeled graph, missing out on the visual cues provided by the renderer's label support. Additionally, the edge creation logic is fragile.

## Goals / Non-Goals

**Goals:**
- Unify splitting logic across both graph modes.
- Introduce descriptive labels for conceptual relationships.
- Improve the reliability of graph construction.

**Non-Goals:**
- Complex NLP relation extraction (e.g., dependency parsing for "subject-verb-object").
- Changing the UI layout or adding new configuration sliders.

## Decisions

### 1. Unified Splitting Logic
We will refactor `processConceptGraph` to use the same `tokensBySentence` approach as `processCoOccurrenceGraph`. This involves splitting the text into chunks (sentences or blocks) first, then performing concept extraction and clique formation within each chunk.
- **Rationale**: This ensures that "Concept" mode respects the user's "Split by" preference, allowing for different levels of conceptual granularity.

### 2. Basic Relation Labeling
For this version, all links in Concept mode will be assigned the label "co-occurs". 
- **Rationale**: This confirms that the labeling pipeline is functional and sets the stage for more advanced relation extraction in the future without adding immediate NLP complexity.

### 3. Graphology `mergeEdge` Adoption
All instances of `graph.addEdge` will be replaced with `graph.mergeEdge`.
- **Rationale**: `mergeEdge` is idempotent; it creates the edge if it doesn't exist or updates it if it does. This eliminates the need for manual checks and prevents the "Edge already exists" error.

## Risks / Trade-offs

- **[Risk]** Large "blocks" in `splitMethod` could lead to very dense cliques in the concept graph.
  - **Mitigation**: We already limit nodes via `maxNodes`. We can also consider a `maxConceptsPerChunk` limit if performance degrades.
- **[Risk]** Labels might overlap and cause visual noise at high densities.
  - **Mitigation**: The renderer's conditional label logic (zoom/hover) already mitigates this risk.
