// src/main.ts
import { CanvasRenderer } from './renderer/canvas-renderer';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const renderer = new CanvasRenderer(canvas);

// Worker Initialization
const worker = new Worker(new URL('./worker/nlp-worker.ts', import.meta.url), {
  type: 'module'
});

// UI Elements
const textInput = document.getElementById('text-input') as HTMLTextAreaElement;
const processBtn = document.getElementById('process-btn') as HTMLButtonElement;
const stressTestBtn = document.getElementById('stress-test-btn') as HTMLButtonElement;
const dropZone = document.getElementById('drop-zone') as HTMLDivElement;
const statusDiv = document.getElementById('status') as HTMLDivElement;

function updateStatus(message: string) {
  statusDiv.textContent = message;
  console.log('Status:', message);
}

// Message Handler
worker.onmessage = (event) => {
  const { type, payload, metadata } = event.data;

  if (type === 'GRAPH_DATA_READY') {
    updateStatus(`Done: ${metadata.nodeCount} nodes, ${metadata.linkCount} links (${metadata.processTime.toFixed(2)}ms)`);
    renderer.setData(payload);
    processBtn.disabled = false;
  }
};

function processText(text: string) {
  if (!text.trim()) return;
  
  processBtn.disabled = true;
  updateStatus('Processing...');
  
  worker.postMessage({
    type: 'PROCESS_TEXT',
    text,
    options: {
      windowSize: 4,
      minWeight: 2,
      maxNodes: 1000
    }
  });
}

// Event Listeners
processBtn.addEventListener('click', () => {
  processText(textInput.value);
});

stressTestBtn.addEventListener('click', () => {
  updateStatus('Generating 5k nodes...');
  const nodes = Array.from({ length: 5000 }, (_, i) => ({ id: `Node ${i}`, count: Math.random() * 10 }));
  const links = Array.from({ length: 5000 }, () => ({
    source: nodes[Math.floor(Math.random() * nodes.length)].id,
    target: nodes[Math.floor(Math.random() * nodes.length)].id,
    weight: 1
  }));
  renderer.setData({ nodes, links });
  updateStatus('Stress testing 5,000 nodes');
});

// Drag & Drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const file = e.dataTransfer?.files[0];
  if (file && file.type === 'text/plain') {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      textInput.value = content;
      processText(content);
    };
    reader.readAsText(file);
  } else {
    updateStatus('Error: Please drop a .txt file');
  }
});
