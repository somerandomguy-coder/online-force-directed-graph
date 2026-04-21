## Why

To handle large text blobs (5MB+) without UI freezing, we need a zero-overhead architecture. This change pivots from a framework-heavy approach (Next.js/React) to a raw performance engine using Vanilla JS, Web Workers, and Canvas to ensure "it just works" regardless of input size.

## What Changes

- **Framework Removal**: Elimination of Next.js and React to dedicate all available CPU/Memory to NLP and Graph compute.
- **Canvas Rendering**: Transition from SVG to HTML5 Canvas for the force-directed graph to support 10,000+ nodes.
- **Worker-First Processing**: Offloading all NLP tokenization and co-occurrence matrix generation to a background Web Worker.
- **Minimalist UI**: A raw HTML/CSS interface focused entirely on the interactive graph and file dropping.

## Capabilities

### New Capabilities
- `worker-nlp-engine`: Background processing of large text blobs for tokenization and co-occurrence analysis.
- `canvas-graph-renderer`: High-performance Canvas-based D3 force simulation capable of handling large-scale datasets.
- `direct-blob-parser`: Zero-copy or streaming-friendly ingestion of large text files and blobs.

### Modified Capabilities
<!-- None -->

## Impact

- **Tech Stack**: Vanilla TypeScript/JavaScript, D3.js, wink-nlp, HTML5 Canvas.
- **Performance**: Significant reduction in main-thread jank; capable of processing and visualizing much larger datasets than the previous SVG/React plan.
- **Development**: Shift to a lean build process (e.g., Vite or raw ESM).
