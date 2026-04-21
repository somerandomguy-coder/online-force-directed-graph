// src/renderer/canvas-renderer.ts
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  count: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  weight: number;
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
  private transform: d3.ZoomTransform = d3.zoomIdentity;

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
      .stop();

    this.setupInteractivity();
    this.resize();
    window.addEventListener('resize', () => this.resize());
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

    this.simulation.nodes(this.nodes);
    (this.simulation.force('link') as d3.ForceLink<Node, Link>).links(this.links);
    
    this.simulation.alpha(1).restart();
    this.startLoop();
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

    // Draw Nodes
    ctx.globalAlpha = 1.0;
    nodes.forEach(node => {
      if (node.x === undefined || node.y === undefined) return;

      const radius = Math.sqrt(node.count) * 2 + 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
      
      if (node === this.hoveredNode) {
        ctx.fillStyle = '#ff4444';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#4285f4';
      }
      
      ctx.fill();

      // Labels for larger nodes or when zoomed in
      if (node.count > 5 || transform.k > 1.5 || node === this.hoveredNode) {
        ctx.fillStyle = '#333';
        ctx.font = `${Math.max(10 / transform.k, 12)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.id, node.x, node.y - radius - 2);
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
      this.hoveredNode = this.quadtree?.find(tx, ty, 20) || null;
      
      if (prevHovered !== this.hoveredNode) {
        this.render();
      }
    });

    // Dragging
    const drag = d3.drag<HTMLCanvasElement, Node>()
      .subject((event): any => {
        const [tx, ty] = this.transform.invert([event.x, event.y]);
        return this.quadtree?.find(tx, ty, 20);
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
