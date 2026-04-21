// src/worker/nlp-worker.ts
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';

const nlp = winkNLP(model);
const its = nlp.its;

interface Node {
  id: string;
  count: number;
}

interface Link {
  source: string;
  target: string;
  weight: number;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

function getCoOccurrenceMatrix(tokens: string[], windowSize: number = 3): Record<string, Record<string, number>> {
  const matrix: Record<string, Record<string, number>> = {};
  
  tokens.forEach((word, i) => {
    if (!matrix[word]) matrix[word] = {};
    
    const start = Math.max(0, i - windowSize);
    const end = Math.min(tokens.length - 1, i + windowSize);
    
    for (let j = start; j <= end; j++) {
      if (i === j) continue;
      const neighbor = tokens[j];
      matrix[word][neighbor] = (matrix[word][neighbor] || 0) + 1;
    }
  });
  
  return matrix;
}

self.onmessage = (event: MessageEvent) => {
  const { text, type, options = {} } = event.data;

  if (type === 'PROCESS_TEXT') {
    const windowSize = options.windowSize || 3;
    const minWeight = options.minWeight || 1;
    const maxNodes = options.maxNodes || 500;

    console.log('Worker processing text...');
    const startTime = performance.now();

    const doc = nlp.readDoc(text);
    
    // 1. Tokenization & Cleaning
    const tokens = doc.tokens()
      .filter((t) => t.out(its.type) === 'word' && !t.out(its.stopWordFlag))
      .out(its.normal);

    // 2. Co-occurrence Matrix
    const coMatrix = getCoOccurrenceMatrix(tokens, windowSize);

    // 3. Transform to Graph Data (Nodes and Links)
    const nodeCounts: Record<string, number> = {};
    tokens.forEach(t => {
      nodeCounts[t] = (nodeCounts[t] || 0) + 1;
    });

    // Sort nodes by frequency and limit if necessary
    const sortedNodes = Object.entries(nodeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxNodes);

    const topWords = new Set(sortedNodes.map(n => n[0]));

    const nodes: Node[] = sortedNodes.map(([id, count]) => ({ id, count }));
    const links: Link[] = [];

    const processedLinks = new Set<string>();

    Object.entries(coMatrix).forEach(([source, targets]) => {
      if (!topWords.has(source)) return;

      Object.entries(targets).forEach(([target, weight]) => {
        if (!topWords.has(target)) return;
        if (weight < minWeight) return;

        // Ensure each link is only added once (undirected)
        const linkKey = [source, target].sort().join('|');
        if (!processedLinks.has(linkKey)) {
          links.push({ source, target, weight });
          processedLinks.add(linkKey);
        }
      });
    });

    const endTime = performance.now();
    console.log(`Processing complete in ${(endTime - startTime).toFixed(2)}ms`);

    self.postMessage({
      type: 'GRAPH_DATA_READY',
      payload: { nodes, links } as GraphData,
      metadata: {
        processTime: endTime - startTime,
        nodeCount: nodes.length,
        linkCount: links.length
      }
    });
  }
};
