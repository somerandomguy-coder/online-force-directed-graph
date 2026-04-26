// src/worker/nlp-worker.ts
import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import Graph from 'graphology';
import louvain from 'graphology-communities-louvain';

const nlp = winkNLP(model);
const its = nlp.its;

const noiseTokens = new Set(["'s", "v.", "st.", "cf."]);

interface Node {
  id: string;
  count: number;
  cluster?: number;
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

self.onmessage = (event: MessageEvent) => {
  const { text, type, options = {} } = event.data;

  if (type === 'PROCESS_TEXT') {
    const windowSize = options.windowSize || 3;
    const minWeight = options.minWeight || 1;
    const maxNodes = options.maxNodes || 500;
    const splitMethod = options.splitMethod || 'sentence';

    console.log('Worker processing text...', { splitMethod });
    const startTime = performance.now();

    const doc = nlp.readDoc(text);
    
    // 1. Tokenization & Cleaning with configurable splitting
    let tokensBySentence: string[][];

    const isInsightful = (t: any) => {
      const type = t.out(its.type);
      const normal = t.out(its.normal);
      return type !== 'number' &&
             type === 'word' && 
             !t.out(its.stopWordFlag) && 
             normal.length >= 2 &&
             !noiseTokens.has(normal);
    };

    if (splitMethod === 'block') {
      // Split by 2+ newlines
      const blocks = text.split(/\n\s*\n/);
      tokensBySentence = blocks.map((blockText: string) => {
        const blockDoc = nlp.readDoc(blockText);
        return blockDoc.tokens()
          .filter(isInsightful)
          .out(its.normal);
      });
    } else {
      // Default: Sentence split
      tokensBySentence = doc.sentences().out().map(sentenceText => {
        const sentenceDoc = nlp.readDoc(sentenceText);
        return sentenceDoc.tokens()
          .filter(isInsightful)
          .out(its.normal);
      });
    }

    const allTokens = tokensBySentence.flat();

    // 2. Co-occurrence Matrix (sentence-aware)
    const coMatrix: Record<string, Record<string, number>> = {};
    
    tokensBySentence.forEach(tokens => {
      tokens.forEach((word, i) => {
        if (!coMatrix[word]) coMatrix[word] = {};
        
        const start = Math.max(0, i - windowSize);
        const end = Math.min(tokens.length - 1, i + windowSize);
        
        for (let j = start; j <= end; j++) {
          if (i === j) continue;
          const neighbor = tokens[j];
          coMatrix[word][neighbor] = (coMatrix[word][neighbor] || 0) + 1;
        }
      });
    });

    // 3. Transform to Graph Data (Nodes and Links)
    const nodeCounts: Record<string, number> = {};
    allTokens.forEach(t => {
      nodeCounts[t] = (nodeCounts[t] || 0) + 1;
    });

    // Sort nodes by frequency and limit if necessary
    const sortedNodes = Object.entries(nodeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxNodes);

    const topWords = new Set(sortedNodes.map(n => n[0]));

    // --- Clustering ---
    const graph = new Graph();
    sortedNodes.forEach(([id]) => graph.addNode(id));

    const links: Link[] = [];
    const processedLinks = new Set<string>();

    Object.entries(coMatrix).forEach(([source, targets]) => {
      if (!topWords.has(source)) return;

      Object.entries(targets).forEach(([target, weight]) => {
        if (!topWords.has(target)) return;
        if (weight < minWeight) return;

        const linkKey = [source, target].sort().join('|');
        if (!processedLinks.has(linkKey)) {
          graph.addEdge(source, target, { weight });
          links.push({ source, target, weight });
          processedLinks.add(linkKey);
        }
      });
    });

    const communities = louvain(graph);

    const nodes: Node[] = sortedNodes.map(([id, count]) => ({
      id,
      count,
      cluster: communities[id]
    }));

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
