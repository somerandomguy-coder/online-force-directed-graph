## Context

The current NLP engine is too permissive, allowing short tokens, numbers, and common abbreviations to become nodes in the force-directed graph. This results in a "noisy" visualization where valuable thematic connections are obscured by structural or numerical noise. Additionally, the "Find and Replace" UI component does not respect its container's boundaries, leading to layout breakage.

## Goals / Non-Goals

**Goals:**
- Implement a more aggressive filtering layer in the NLP worker to exclude non-insightful tokens.
- Fix the CSS overflow issue in the control menu's find-and-replace section.
- Ensure the graph remains stable and focused on semantic words.

**Non-Goals:**
- Creating a comprehensive stop-word list (we rely on wink-NLP's built-in list but supplement it).
- Redesigning the entire UI layout.

## Decisions

### 1. Enhanced Token Filtering in Web Worker
- **Decision**: Filter tokens by `its.type` (excluding 'number') and check against a custom "noise" list and length constraints.
- **Rationale**: `wink-NLP` provides token types. Excluding 'number' handles digits and Greek numerals if they are typed as numbers. A length constraint and a specific list of noise tokens (like "'s", "v.", "st.") will handle structural noise.
- **Alternatives**: Using a larger NLP model (too heavy for browser worker) or manual post-processing on the main thread (less efficient).

### 2. UI Container Constraints
- **Decision**: Apply `box-sizing: border-box` globally or specifically to UI inputs, and use `min-width: 0` on flex children in `.find-replace-group`.
- **Rationale**: `box-sizing: border-box` ensures padding and borders don't add to the element's width. `min-width: 0` is a common fix for flex items that have an intrinsic minimum width (like inputs) which might otherwise force the container to overflow.
- **Alternatives**: Fixed widths for inputs (less responsive).

## Risks / Trade-offs

- **[Risk]** Over-filtering might remove valid short words (e.g., "AI", "Go"). → **Mitigation**: Maintain a minimum length of 2 and only filter specific known-noise tokens.
- **[Risk]** UI fix might affect other inputs if applied globally. → **Mitigation**: Scope CSS changes to the `#ui` container and specifically `.find-replace-group`.
