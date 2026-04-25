## Context

Users want a way to "clean" the visualization by removing or merging specific terms in the source text. Currently, the UI layout supports basic text entry and configuration, but lacks active text manipulation tools.

## Goals / Non-Goals

**Goals:**
- Provide a simple UI for global text replacement.
- Ensure the graph updates immediately after text changes.

**Non-Goals:**
- Regex-based find and replace (initially).
- Case-sensitivity toggles (will follow standard string matching).
- Single replacement (it will be "Replace All" by default).

## Decisions

### 1. UI Integration in `#ui` panel
- **Choice**: Add a new `.control-group` div containing two text inputs and a button.
- **Rationale**: Consistent with existing UI patterns for split methods and node limits.

### 2. Replacement Logic
- **Choice**: Use `textarea.value.split(findValue).join(replaceValue)`.
- **Rationale**: This is a simple and reliable way to perform a global "replace all" without needing to escape special characters for a `RegExp` object.

### 3. Execution Flow
- **Choice**: Update the `textarea` value, then call the existing `processText()` function.
- **Rationale**: Reuses the established Web Worker pipeline for graph generation, ensuring consistency between manual edits and automated replacements.

## Risks / Trade-offs

- **[Risk]** Accidental mass replacement (e.g., replacing 'a' with ''). → **Mitigation**: Standard "undo" (Ctrl+Z) in the textarea still works, and the user can see the change immediately.
- **[Risk]** Performance with very large text. → **Mitigation**: String splitting/joining is generally very fast in modern JS engines for typical document sizes.
