## 1. Worker Implementation: Relation Extraction

- [x] 1.1 Implement a utility in `src/worker/nlp-worker.ts` to find the most significant verb (`its.lemma`) between two token ranges in a document.
- [x] 1.2 Update `processConceptGraph` to track the positions (start/end) of extracted concepts.
- [x] 1.3 Implement relation labeling logic: for each conceptual link, search for a connecting verb between the two concept occurrences.
- [x] 1.4 Implement a frequency-based selection for link labels when multiple occurrences of a concept pair yield different verbs.
- [x] 1.5 Update the final link creation logic to use the most frequent semantic label or fallback to "co-occurs".

## 2. Verification & Build

- [ ] 2.1 Verify with a test sentence (e.g., "Apple acquired NeXT") that the link label correctly displays "acquire".
- [ ] 2.2 Verify that multiple relations are correctly aggregated and the most frequent one is chosen.
- [ ] 2.3 Run `npm run build` to ensure project integrity.
