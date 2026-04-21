## 1. Project Initialization

- [x] 1.1 Initialize a new Vite project with Vanilla TypeScript: `npm create vite@latest . -- --template vanilla-ts`
- [x] 1.2 Install required dependencies: `d3`, `wink-nlp`
- [x] 1.3 Set up a basic project structure with `src/worker/` and `src/renderer/` directories

## 2. Worker-First NLP Engine

- [x] 2.1 Implement the Web Worker entry point in `src/worker/nlp-worker.ts`
- [x] 2.2 Integrate `wink-nlp` for tokenization and cleaning within the worker
- [x] 2.3 Implement the co-occurrence matrix generation logic in the worker
- [x] 2.4 Set up a message-passing protocol to receive text and send graph data back to the main thread

## 3. High-Performance Canvas Renderer

- [x] 3.1 Create a `CanvasRenderer` class in `src/renderer/canvas-renderer.ts`
- [x] 3.2 Implement the D3 force simulation setup decoupled from DOM manipulation
- [x] 3.3 Implement the `requestAnimationFrame` draw loop for Canvas-based node and link rendering
- [x] 3.4 Integrate a spatial index (e.g., `d3-quadtree`) to efficiently handle mouse interaction on Canvas

## 4. Main Thread Integration

- [x] 4.1 Implement the main entry point to coordinate the Web Worker and Canvas Renderer
- [x] 4.2 Create a minimalist UI with a file drop zone and a text input for loading data
- [x] 4.3 Connect the file/text input to the NLP Web Worker
- [x] 4.4 Update the `CanvasRenderer` with the graph data returned by the worker

## 5. Verification & Refinement

- [x] 5.1 Verify that 5,000+ nodes can be rendered at >30fps as per specs
- [x] 5.2 Confirm that a 5MB+ text blob does not freeze the main thread during processing
- [x] 5.3 Implement basic interactivity (drag, zoom) on the Canvas graph
- [x] 5.4 Conduct final testing with various dataset sizes to ensure stability
