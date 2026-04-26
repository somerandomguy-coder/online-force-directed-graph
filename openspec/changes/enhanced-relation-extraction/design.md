## Context

The current `processConceptGraph` implementation extracts entities and nouns but connects them using a static "co-occurs" label. While this shows association, it fails to capture the semantic nature of the relationship. We want to leverage `wink-nlp`'s POS tagging to find verbs or actions that bridge these concepts.

## Goals / Non-Goals

**Goals:**
- Extract meaningful relationship labels from text.
- Improve graph semantic depth.
- Maintain high performance in the Web Worker.

**Non-Goals:**
- Upgrading to a heavier NLP model (sticking with `wink-eng-lite-web-model`).
- Full dependency tree analysis (not supported by the current lite model).
- Real-time learning of new relationship types.

## Decisions

### 1. Heuristic Verb-Based Extraction
Since we are using a "lite" model without dependency parsing, we will use a positional heuristic:
- For every pair of concepts identified in a sentence/chunk, we will scan the tokens *between* them.
- We will look for the first significant verb (`VERB` POS) or a sequence of tokens that represent an action.
- The lemmatized version of this verb will serve as the relationship label.
- **Rationale**: In English, many semantic relationships are expressed as `Subject [Verb] Object`. While not perfect without full parsing, this captures a large percentage of direct interactions.

### 2. Multi-Relation Handling
If multiple relations are found between the same two entities across different parts of the text, we will:
- Count the frequency of each distinct label.
- Select the most frequent label for the final graph link.
- **Rationale**: This prevents a single rare occurrence from defining the entire relationship in the visualization.

### 3. Fallback Mechanism
If no verb is found between two co-occurring concepts, we will fallback to "associated with" or "co-occurs" to ensure the link is not lost.
- **Rationale**: Maintaining graph connectivity is more important than having a specific label for every single edge.

## Risks / Trade-offs

- **[Risk]** The heuristic might pick up irrelevant verbs in long sentences.
  - **Mitigation**: Limit the search window between concepts; if the distance is too great, default to a generic label.
- **[Risk]** Lemmatization might make some labels feel grammatically awkward (e.g., "acquire" vs "acquired").
  - **Mitigation**: Lemmatization is standard for graph normalization to ensure "acquired" and "acquiring" merge into the same relation.
