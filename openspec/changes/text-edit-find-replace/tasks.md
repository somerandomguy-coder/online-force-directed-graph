## 1. UI Implementation

- [x] 1.1 Add a new `.control-group` to `index.html` for "Find and Replace".
- [x] 1.2 Add `id="find-input"` and `id="replace-input"` fields to the new group.
- [x] 1.3 Add a "Replace All" button with `id="replace-btn"`.
- [x] 1.4 Add basic styling to ensure the new inputs fit nicely within the 300px panel.

## 2. logic Implementation

- [x] 2.1 Add event listener for `replace-btn` in `src/main.ts`.
- [x] 2.2 Implement the `replaceAll` logic: update `textInput.value` by replacing all occurrences of the "find" string.
- [x] 2.3 Call `processText()` immediately after the value update to refresh the graph.
- [x] 2.4 (Optional) Clear the "find" and "replace" fields after a successful operation to prevent accidental double-clicks.
