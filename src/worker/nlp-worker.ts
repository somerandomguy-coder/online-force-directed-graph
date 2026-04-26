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
  label?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

interface WorkerOptions {
  windowSize?: number;
  minWeight?: number;
  maxNodes?: number;
  splitMethod?: 'sentence' | 'block';
  mode?: 'COOCCURRENCE' | 'CONCEPT';
}

const isInsightful = (t: any) => {
  const type = t.out(its.type);
  const normal = t.out(its.normal);
  return type !== 'number' &&
         type === 'word' && 
         !t.out(its.stopWordFlag) && 
         normal.length >= 2 &&
         !noiseTokens.has(normal);
};

function processCoOccurrenceGraph(doc: any, text: string, options: WorkerOptions): GraphData {
  const windowSize = options.windowSize || 3;
  const minWeight = options.minWeight || 1;
  const maxNodes = options.maxNodes || 500;
  const splitMethod = options.splitMethod || 'sentence';

  let tokensBySentence: string[][];

  if (splitMethod === 'block') {
    const blocks = text.split(/\n\s*\n/);
    tokensBySentence = blocks.map((blockText: string) => {
      const blockDoc = nlp.readDoc(blockText);
      return blockDoc.tokens()
        .filter(isInsightful)
        .out(its.normal);
    });
  } else {
    tokensBySentence = doc.sentences().out().map((sentenceText: string) => {
      const sentenceDoc = nlp.readDoc(sentenceText);
      return sentenceDoc.tokens()
        .filter(isInsightful)
        .out(its.normal);
    });
  }

  const allTokens = tokensBySentence.flat();
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

  const nodeCounts: Record<string, number> = {};
  allTokens.forEach(t => {
    nodeCounts[t] = (nodeCounts[t] || 0) + 1;
  });

  const sortedNodes = Object.entries(nodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxNodes);

  const topWords = new Set(sortedNodes.map(n => n[0]));
  const graph = new Graph({ type: 'undirected' });
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

  return { nodes, links };
}

function processConceptGraph(doc: any, _text: string, options: WorkerOptions): GraphData {
  const maxNodes = options.maxNodes || 500;
  
  const sentences = doc.sentences();
  const graph = new Graph({ type: 'undirected' });
  const nodeCounts: Record<string, number> = {};
  const coMatrix: Record<string, Record<string, number>> = {};

  sentences.each((s: any) => {
    const concepts: string[] = [];
    
    // 1. Extract Entities
    s.entities().each((e: any) => {
      concepts.push(e.out(its.normal));
    });

    // 2. Extract Nouns (POS filtering)
    s.tokens()
      .filter((t: any) => {
        const pos = t.out(its.pos);
        return (pos === 'NOUN' || pos === 'PROPN') && !t.out(its.stopWordFlag);
      })
      .each((t: any) => {
        const val = t.out(its.normal);
        if (!concepts.includes(val)) concepts.push(val);
      });

    // Count occurrences
    concepts.forEach(c => {
      nodeCounts[c] = (nodeCounts[c] || 0) + 1;
      if (!graph.hasNode(c)) graph.addNode(c);
    });

    // Create clique within sentence
    for (let i = 0; i < concepts.length; i++) {
      for (let j = i + 1; j < concepts.length; j++) {
        const a = concepts[i];
        const b = concepts[j];
        if (!coMatrix[a]) coMatrix[a] = {};
        coMatrix[a][b] = (coMatrix[a][b] || 0) + 1;
        
        if (!coMatrix[b]) coMatrix[b] = {};
        coMatrix[b][a] = (coMatrix[b][a] || 0) + 1;
      }
    }
  });

  const sortedNodes = Object.entries(nodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxNodes);
  
  const topConcepts = new Set(sortedNodes.map(n => n[0]));
  
  // Clean graph to only top nodes
  graph.nodes().forEach(n => {
    if (!topConcepts.has(n)) graph.dropNode(n);
  });

  const links: Link[] = [];
  const processedLinks = new Set<string>();

  Object.entries(coMatrix).forEach(([source, targets]) => {
    if (!topConcepts.has(source)) return;
    Object.entries(targets).forEach(([target, weight]) => {
      if (!topConcepts.has(target)) return;
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

  return { nodes, links };
}

self.onmessage = (event: MessageEvent) => {
  const { text, type, options = {} } = event.data;

  if (type === 'PROCESS_TEXT') {
    const mode = options.mode || 'COOCCURRENCE';
    console.log(`Worker processing text in ${mode} mode...`);
    const startTime = performance.now();

    const doc = nlp.readDoc(text);
    let result: GraphData;

    if (mode === 'CONCEPT') {
      result = processConceptGraph(doc, text, options);
    } else {
      result = processCoOccurrenceGraph(doc, text, options);
    }

    const endTime = performance.now();
    console.log(`Processing complete in ${(endTime - startTime).toFixed(2)}ms`);

    self.postMessage({
      type: 'GRAPH_DATA_READY',
      payload: result,
      metadata: {
        processTime: endTime - startTime,
        nodeCount: result.nodes.length,
        linkCount: result.links.length
      }
    });
  }
};
