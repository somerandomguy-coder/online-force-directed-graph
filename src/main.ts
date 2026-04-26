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
const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
const splitMethodSelect = document.getElementById('split-method') as HTMLSelectElement;
const findInput = document.getElementById('find-input') as HTMLInputElement;
const replaceInput = document.getElementById('replace-input') as HTMLInputElement;
const replaceBtn = document.getElementById('replace-btn') as HTMLButtonElement;
const limitButtons = document.querySelectorAll('.node-limits button');
const statusDiv = document.getElementById('status') as HTMLDivElement;

// Tab UI Elements
const tabCooccurrence = document.getElementById('tab-cooccurrence') as HTMLButtonElement;
const tabConcept = document.getElementById('tab-concept') as HTMLButtonElement;

type GraphMode = 'COOCCURRENCE' | 'CONCEPT';
let currentMode: GraphMode = 'COOCCURRENCE';

function updateTabs() {
  tabCooccurrence.classList.toggle('active', currentMode === 'COOCCURRENCE');
  tabConcept.classList.toggle('active', currentMode === 'CONCEPT');
  
  if (textInput.value.trim()) {
    processText(textInput.value);
  }
}

tabCooccurrence.addEventListener('click', () => {
  if (currentMode === 'COOCCURRENCE') return;
  currentMode = 'COOCCURRENCE';
  updateTabs();
});

tabConcept.addEventListener('click', () => {
  if (currentMode === 'CONCEPT') return;
  currentMode = 'CONCEPT';
  updateTabs();
});

// Node Info UI Elements
const nodeInfoPanel = document.getElementById('node-info-panel') as HTMLDivElement;
const infoNodeId = document.getElementById('info-node-id') as HTMLHeadingElement;
const neighborList = document.getElementById('neighbor-list') as HTMLUListElement;
const toggleInfoCheckbox = document.getElementById('toggle-info') as HTMLInputElement;

// Cluster Toggle
const clusterBtn = document.getElementById('cluster-btn') as HTMLButtonElement;
let clusteringEnabled = false;

let currentMaxNodes = 1000;

function updateStatus(message: string) {
  statusDiv.textContent = message;
  console.log('Status:', message);
}

// Node Info Logic
renderer.setOnHoverChange((node, neighbors) => {
  if (!node) {
    infoNodeId.textContent = 'Node: None';
    neighborList.innerHTML = '';
    return;
  }

  infoNodeId.textContent = `Node: ${node.id}`;
  
  // Sort neighbors by count (weight) descending and take top 5
  const topNeighbors = [...neighbors]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 5);

  neighborList.innerHTML = topNeighbors.length > 0 
    ? topNeighbors.map(n => `<li>${n.id} <span>(${n.count.toFixed(1)})</span></li>`).join('')
    : '<li style="color: #999">No neighbors</li>';
});

toggleInfoCheckbox.addEventListener('change', () => {
  if (toggleInfoCheckbox.checked) {
    nodeInfoPanel.classList.remove('hidden');
  } else {
    nodeInfoPanel.classList.add('hidden');
  }
});

// Sync initial state
if (toggleInfoCheckbox.checked) {
  nodeInfoPanel.classList.remove('hidden');
} else {
  nodeInfoPanel.classList.add('hidden');
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
      maxNodes: currentMaxNodes,
      splitMethod: splitMethodSelect.value,
      mode: currentMode
    }
  });
}

// Event Listeners
const clusterPullSlider = document.getElementById('cluster-pull') as HTMLInputElement;
const globalGravitySlider = document.getElementById('global-gravity') as HTMLInputElement;

// ... (existing event listeners)

function updatePhysics() {
  renderer.updatePhysicsSettings({
    clusterPull: parseFloat(clusterPullSlider.value),
    globalGravity: parseFloat(globalGravitySlider.value)
  });
}

clusterPullSlider.addEventListener('input', updatePhysics);
globalGravitySlider.addEventListener('input', updatePhysics);

processBtn.addEventListener('click', () => {
  processText(textInput.value);
});

clusterBtn.addEventListener('click', () => {
  clusteringEnabled = !clusteringEnabled;
  clusterBtn.classList.toggle('active', clusteringEnabled);
  renderer.setClusteringEnabled(clusteringEnabled);
});

replaceBtn.addEventListener('click', () => {
  const findText = findInput.value;
  const replaceText = replaceInput.value;
  
  if (!findText) {
    updateStatus('Error: Please enter text to find');
    return;
  }

  const originalText = textInput.value;
  // Use split/join for global replace without regex escaping issues
  const newText = originalText.split(findText).join(replaceText);

  if (originalText === newText) {
    updateStatus('No occurrences found');
    return;
  }

  textInput.value = newText;
  findInput.value = '';
  replaceInput.value = '';
  
  processText(newText);
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

// File Upload
dropZone.addEventListener('click', () => {
  fileUpload.click();
});

fileUpload.addEventListener('change', () => {
  const file = fileUpload.files?.[0];
  if (file) handleFile(file);
});

// Node Limits
limitButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    limitButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMaxNodes = parseInt(btn.getAttribute('data-limit') || '1000');
    
    // Re-process if there is text
    if (textInput.value.trim()) {
      processText(textInput.value);
    }
  });
});

function handleFile(file: File) {
  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      textInput.value = content;
      processText(content);
    };
    reader.readAsText(file);
  } else {
    updateStatus('Error: Please select a .txt file');
  }
}

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
  if (file) {
    handleFile(file);
  }
});
