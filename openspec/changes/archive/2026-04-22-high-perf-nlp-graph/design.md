## Context

To handle large text blobs (5MB+) without UI freezing, we are pivoting from a framework-heavy approach (Next.js/React) to a raw performance engine using Vanilla JS, Web Workers, and Canvas. The current state is an empty project with two change proposals, where `high-perf-nlp-graph` represents the high-performance pivot.

## Goals / Non-Goals

**Goals:**
- Provide a zero-overhead architecture for visualizing word relationships in large text datasets.
- Use Web Workers to offload heavy NLP processing (tokenization, co-occurrence matrix generation).
- Use HTML5 Canvas and D3.js for high-performance graph rendering (supporting 10,000+ nodes).
- Minimize main-thread jank for a smooth user experience.

**Non-Goals:**
- Using React or Next.js for the core UI.
- Supporting complex UI features that don't contribute to the core graph exploration experience.
- SVG rendering for large datasets.

## Decisions

### 1. Vanilla JavaScript/TypeScript with Vite
- **Why**: Minimal overhead. Vite provides a fast development environment and lean production builds without the weight of Next.js.
- **Alternatives**: Next.js (rejected due to framework overhead and focus on SSR/routing not needed here).

### 2. Web Worker for NLP and Matrix Compute
- **Why**: NLP processing (especially on 5MB+ text) is CPU-intensive. Moving it to a worker ensures the UI remains responsive.
- **Alternatives**: Main-thread processing (rejected due to UI freezing).

### 3. HTML5 Canvas for D3 Rendering
- **Why**: Canvas can handle significantly more elements than SVG because it doesn't create DOM nodes for every node/link.
- **Alternatives**: SVG (rejected for performance limitations with 1,000+ nodes).

### 4. D3.js for Force Simulation
- **Why**: D3's force-directed simulation is the industry standard and highly configurable. It can be decoupled from DOM manipulation and used with Canvas.

## Risks / Trade-offs

- **[Risk] Complexity of Web Worker communication** → **Mitigation**: Use a clean message-passing protocol (e.g., Comlink or structured JSON messages).
- **[Risk] Canvas interactivity (hover/drag)** → **Mitigation**: Use a spatial index (e.g., d3-quadtree) to efficiently detect nodes under the mouse cursor.
- **[Risk] Build system configuration** → **Mitigation**: Use a simple Vite template for Vanilla TypeScript.
