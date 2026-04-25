## 1. NLP Worker Enhancement

- [x] 1.1 Define a `noiseTokens` set in `src/worker/nlp-worker.ts` containing common non-insightful sequences like "'s", "v.", "st.", "cf".
- [x] 1.2 Update the filtering logic in `nlp-worker.ts` to exclude tokens where `its.type` is 'number'.
- [x] 1.3 Update the filtering logic to also check tokens against the `noiseTokens` set and ensure a minimum normalized length of 2.
- [x] 1.4 Test with sample text containing numbers and abbreviations to ensure they are filtered.

## 2. UI Overflow Fix

- [x] 2.1 Add `box-sizing: border-box` to the `#ui` and input styles in `index.html` to prevent padding/border from causing overflow.
- [x] 2.2 Update `.find-replace-group input` in `index.html` with `min-width: 0` and ensure it fits within the 300px container width.
- [x] 2.3 Verify the "Find and Replace" block is correctly contained within the `#ui` menu on various screen sizes.
