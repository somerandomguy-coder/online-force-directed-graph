// src/renderer/canvas-renderer.ts
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  count: number;
  cluster?: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  weight: number;
  label?: string;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private simulation: d3.Simulation<Node, Link>;
  private nodes: Node[] = [];
  private links: Link[] = [];
  private quadtree: d3.Quadtree<Node> | null = null;
  private hoveredNode: Node | null = null;
  private hoveredNeighbors: Set<string> = new Set();
  private adjacencyMap: Map<string, Set<string>> = new Map();
  private transform: d3.ZoomTransform = d3.zoomIdentity;
  private onHoverChange: ((node: Node | null, neighbors: Node[]) => void) | null = null;
  private clusteringEnabled: boolean = false;
  private colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    this.simulation = d3.forceSimulation<Node, Link>()
      .force('link', d3.forceLink<Node, Link>().id(d => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide<Node>().radius(d => Math.sqrt(d.count || 0) * 2 + 5))
      .force('x', d3.forceX(this.width / 2).strength(0.1))
      .force('y', d3.forceY(this.height / 2).strength(0.1))
      .stop();

    this.setupInteractivity();
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  public updatePhysicsSettings(settings: { clusterPull: number, globalGravity: number }) {
    this.simulation.force('x', d3.forceX(this.width / 2).strength(settings.globalGravity));
    this.simulation.force('y', d3.forceY(this.height / 2).strength(settings.globalGravity));
    
    // Cluster Pull Force
    this.simulation.force('cluster', (alpha) => {
      const clusterCentroids = new Map<number, { x: number, y: number, count: number }>();
      
      this.nodes.forEach(node => {
        if (node.cluster !== undefined) {
          const centroid = clusterCentroids.get(node.cluster) || { x: 0, y: 0, count: 0 };
          centroid.x += (node.x || 0);
          centroid.y += (node.y || 0);
          centroid.count++;
          clusterCentroids.set(node.cluster, centroid);
        }
      });

      clusterCentroids.forEach((centroid, _cluster) => {
        centroid.x /= centroid.count;
        centroid.y /= centroid.count;
      });

      this.nodes.forEach(node => {
        if (node.cluster !== undefined) {
          const centroid = clusterCentroids.get(node.cluster)!;
          const strength = settings.clusterPull * 0.1;
          node.vx! += (centroid.x - (node.x || 0)) * strength * alpha;
          node.vy! += (centroid.y - (node.y || 0)) * strength * alpha;
        }
      });
    });

    this.simulation.alpha(0.3).restart();
  }

  private resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    this.simulation.force('center', d3.forceCenter(this.width / 2, this.height / 2));
    this.render();
  }

  public setData(data: GraphData) {
    this.nodes = data.nodes.map(n => ({ ...n }));
    this.links = data.links.map(l => ({ ...l }));

    // Build adjacency map for neighbor highlighting
    this.adjacencyMap.clear();
    this.links.forEach(link => {
      const source = typeof link.source === 'string' ? link.source : (link.source as Node).id;
      const target = typeof link.target === 'string' ? link.target : (link.target as Node).id;
      
      if (!this.adjacencyMap.has(source)) this.adjacencyMap.set(source, new Set());
      if (!this.adjacencyMap.has(target)) this.adjacencyMap.set(target, new Set());
      
      this.adjacencyMap.get(source)!.add(target);
      this.adjacencyMap.get(target)!.add(source);
    });

    this.simulation.nodes(this.nodes);
    (this.simulation.force('link') as d3.ForceLink<Node, Link>).links(this.links);
    
    this.simulation.alpha(1).restart();
    this.startLoop();
  }

  public setOnHoverChange(callback: (node: Node | null, neighbors: Node[]) => void) {
    this.onHoverChange = callback;
  }

  public setClusteringEnabled(enabled: boolean) {
    this.clusteringEnabled = enabled;
    this.render();
  }

  private startLoop() {
    const tick = () => {
      if (this.simulation.alpha() <= this.simulation.alphaMin()) {
        this.render(); // Final render
        return;
      }

      this.simulation.tick();
      this.render();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private render() {
    const { ctx, width, height, transform, nodes, links } = this;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);

    // Draw Links
    ctx.beginPath();
    ctx.strokeStyle = '#999';
    ctx.globalAlpha = 0.3;
    links.forEach(link => {
      const source = link.source as Node;
      const target = link.target as Node;
      if (source.x !== undefined && source.y !== undefined && target.x !== undefined && target.y !== undefined) {
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
      }
    });
    ctx.stroke();

    // Draw Link Labels (only if present)
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#666';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    links.forEach(link => {
      if (link.label) {
        const source = link.source as Node;
        const target = link.target as Node;
        if (source.x !== undefined && source.y !== undefined && target.x !== undefined && target.y !== undefined) {
          const mx = (source.x + target.x) / 2;
          const my = (source.y + target.y) / 2;
          ctx.fillText(link.label, mx, my);
        }
      }
    });

    // Draw Nodes
    ctx.globalAlpha = 1.0;
    nodes.forEach(node => {
      if (node.x === undefined || node.y === undefined) return;

      const radius = Math.sqrt(node.count) * 2 + 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      if (node === this.hoveredNode) {
        ctx.fillStyle = '#ff4444'; // Red for hovered
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (this.hoveredNeighbors.has(node.id)) {
        ctx.fillStyle = '#ffeb3b'; // Yellow for neighbors
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        if (this.clusteringEnabled && node.cluster !== undefined) {
          ctx.fillStyle = this.colorScale(node.cluster.toString());
        } else {
          ctx.fillStyle = '#4285f4'; // Blue for default
        }
      }
      
      ctx.fill();

      // Dynamic Node Labels
      const isHighlighted = node === this.hoveredNode || this.hoveredNeighbors.has(node.id);
      if (node.count > 2 || transform.k > 1.2 || isHighlighted) {
        // Calculate dynamic font size
        const baseFontSize = Math.sqrt(node.count) * 1.5 + 4;
        const fontSize = Math.max(10 / transform.k, Math.min(baseFontSize, radius * 0.8));
        
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const label = node.id;
        const textWidth = ctx.measureText(label).width;
        
        // Ensure it fits or downscale
        let finalFontSize = fontSize;
        if (textWidth > radius * 1.9) {
          finalFontSize = (radius * 1.9 / textWidth) * fontSize;
          ctx.font = `bold ${finalFontSize}px sans-serif`;
        }

        // Color for visibility
        if (node === this.hoveredNode) {
          ctx.fillStyle = '#fff';
        } else if (this.hoveredNeighbors.has(node.id)) {
          ctx.fillStyle = '#000'; // Black on yellow for contrast
        } else {
          ctx.fillStyle = '#fff';
        }
        
        ctx.fillText(label, node.x, node.y);
      }
    });

    ctx.restore();

    // Update quadtree for interaction
    this.quadtree = d3.quadtree<Node>()
      .x(d => d.x || 0)
      .y(d => d.y || 0)
      .addAll(nodes);
  }

  private setupInteractivity() {
    const canvas = d3.select(this.canvas);

    // Zoom
    const zoom = d3.zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        this.transform = event.transform;
        this.render();
      });

    canvas.call(zoom as any);

    // Hover
    canvas.on('mousemove', (event) => {
      const [mx, my] = d3.pointer(event);
      const [tx, ty] = this.transform.invert([mx, my]);
      
      const prevHovered = this.hoveredNode;
      
      // Find nearest node within reasonable search radius
      const candidate = this.quadtree?.find(tx, ty, 50) || null;
      
      if (candidate && candidate.x !== undefined && candidate.y !== undefined) {
        const dx = tx - candidate.x;
        const dy = ty - candidate.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = Math.sqrt(candidate.count) * 2 + 2;
        
        // Only hover if within visual radius
        this.hoveredNode = dist <= radius ? candidate : null;
      } else {
        this.hoveredNode = null;
      }
      
      if (prevHovered !== this.hoveredNode) {
        // Update neighbors
        this.hoveredNeighbors.clear();
        let neighborNodes: Node[] = [];

        if (this.hoveredNode) {
          const neighbors = this.adjacencyMap.get(this.hoveredNode.id);
          if (neighbors) {
            this.hoveredNeighbors = new Set(neighbors);
            neighborNodes = this.nodes.filter(n => neighbors.has(n.id));
          }
        }

        if (this.onHoverChange) {
          this.onHoverChange(this.hoveredNode, neighborNodes);
        }

        this.render();
      }
    });

    // Dragging
    const drag = d3.drag<HTMLCanvasElement, Node>()
      .subject((event): any => {
        const [tx, ty] = this.transform.invert([event.x, event.y]);
        const candidate = this.quadtree?.find(tx, ty, 50);
        if (candidate && candidate.x !== undefined && candidate.y !== undefined) {
          const dx = tx - candidate.x;
          const dy = ty - candidate.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const radius = Math.sqrt(candidate.count) * 2 + 2;
          return dist <= radius ? candidate : null;
        }
        return null;
      })
      .on('start', (event) => {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        this.startLoop();
      })
      .on('drag', (event) => {
        const [tx, ty] = this.transform.invert([event.x, event.y]);
        event.subject.fx = tx;
        event.subject.fy = ty;
      })
      .on('end', (event) => {
        if (!event.active) this.simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    canvas.call(drag as any);
  }
}
