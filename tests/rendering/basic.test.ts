import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import * as go from '../../src/index';

function createDiagram(html: string) {
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  const doc = dom.window.document;
  const div = doc.getElementById('myDiagramDiv') as HTMLDivElement;
  const diagram = new go.Diagram(div);
  return { dom, doc, div, diagram };
}

describe('basic.html rendering pipeline', () => {
  it('should create nodes from model data and position them', () => {
    const { dom, diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:800px;height:600px"></div>
      </body></html>`
    );

    diagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
      .add(
        new go.Shape('RoundedRectangle', { fill: 'white' }).bind('fill', 'color'),
        new go.TextBlock({ margin: 6 }).bindTwoWay('text', 'text')
      );

    const nodeDataArray = [
      { key: 1, text: 'Alpha', color: 'lightblue' },
      { key: 2, text: 'Beta', color: 'orange' },
      { key: 3, text: 'Gamma', color: 'lightgreen' },
      { key: 4, text: 'Delta', color: 'pink' },
    ];
    diagram.model = new go.GraphLinksModel(nodeDataArray, []);

    const nodes = diagram.nodes;
    const nodeArray: go.Node[] = [];
    const it = nodes;
    while (it.next()) {
      nodeArray.push(it.value);
    }

    console.log('Node count:', nodeArray.length);
    expect(nodeArray.length).toBe(4);

    for (const node of nodeArray) {
      const loc = node.location;
      const pos = node.position;
      const ab = node.getDocumentBounds();
      const mb = node.measuredBounds;
      console.log(
        `Node key=${node.data?.key}:`,
        `location=(${loc.x}, ${loc.y})`,
        `position=(${pos.x}, ${pos.y})`,
        `actualBounds=(${ab.x}, ${ab.y}, ${ab.width}, ${ab.height})`,
        `measuredBounds=(${mb.width}, ${mb.height})`
      );
    }
  });

  it('should have _updateGeometry set actualBounds for all parts', () => {
    const { diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:800px;height:600px"></div>
      </body></html>`
    );

    diagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
      .add(
        new go.Shape('RoundedRectangle', { fill: 'white' }).bind('fill', 'color'),
        new go.TextBlock({ margin: 6 }).bindTwoWay('text', 'text')
      );

    diagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: 'Alpha', color: 'lightblue' },
        { key: 2, text: 'Beta', color: 'orange' },
      ],
      []
    );

    (diagram as any)._updateGeometry();

    const nodes = diagram.nodes;
    const nodeArray: go.Node[] = [];
    const it = nodes;
    while (it.next()) {
      nodeArray.push(it.value);
    }

    expect(nodeArray.length).toBe(2);

    const positions = nodeArray.map(n => {
      const ab = n.getDocumentBounds();
      return { x: ab.x, y: ab.y, w: ab.width, h: ab.height };
    });

    console.log('Positions:', positions);

    for (const pos of positions) {
      expect(pos.w).toBeGreaterThan(0);
      expect(pos.h).toBeGreaterThan(0);
    }

    if (positions.length >= 2) {
      const p1 = positions[0];
      const p2 = positions[1];
      const samePos = Math.abs(p1.x - p2.x) < 1 && Math.abs(p1.y - p2.y) < 1;
      console.log('Two nodes at same position?', samePos);
    }
  });

  it('should verify Part.move() updates actualBounds', () => {
    const part = new go.Part();
    console.log('Before move:', {
      loc: `(${part.location.x}, ${part.location.y})`,
      pos: `(${part.position.x}, ${part.position.y})`,
      ab: `(${part.getDocumentBounds().x}, ${part.getDocumentBounds().y}, ${part.getDocumentBounds().width}, ${part.getDocumentBounds().height})`
    });

    part.move(new go.Point(100, 200));

    console.log('After move(100,200):', {
      loc: `(${part.location.x}, ${part.location.y})`,
      pos: `(${part.position.x}, ${part.position.y})`,
      ab: `(${part.getDocumentBounds().x}, ${part.getDocumentBounds().y}, ${part.getDocumentBounds().width}, ${part.getDocumentBounds().height})`
    });

    expect(part.location.x).toBe(100);
    expect(part.location.y).toBe(200);
    expect(part.position.x).toBe(100);
    expect(part.position.y).toBe(200);
    expect(part.getDocumentBounds().x).toBe(100);
    expect(part.getDocumentBounds().y).toBe(200);
  });

  it('should verify Panel._arrange sets correct actualBounds', () => {
    const panel = new go.Panel('Auto');
    panel.add(new go.Shape('Rectangle', { width: 100, height: 50 }));
    panel.add(new go.TextBlock('Hello', { margin: 4 }));

    panel._measure(800, 600);
    const mb = panel.measuredBounds;
    console.log('Panel measuredBounds:', { w: mb.width, h: mb.height });

    expect(mb.width).toBeGreaterThan(0);
    expect(mb.height).toBeGreaterThan(0);

    panel._arrange(new go.Rect(50, 60, mb.width, mb.height));
    const ab = panel.getDocumentBounds();
    console.log('Panel actualBounds:', { x: ab.x, y: ab.y, w: ab.width, h: ab.height });

    expect(ab.x).toBe(50);
    expect(ab.y).toBe(60);
    expect(ab.width).toBeGreaterThan(0);
    expect(ab.height).toBeGreaterThan(0);

    const elements = (panel as any)._elements as go.GraphObject[];
    for (const elem of elements) {
      const eab = elem.getDocumentBounds();
      console.log(`  Element actualBounds:`, { x: eab.x, y: eab.y, w: eab.width, h: eab.height });
      expect(eab.width).toBeGreaterThan(0);
      expect(eab.height).toBeGreaterThan(0);
    }
  });

  it('should verify Diagram rebuildParts creates parts in layers', () => {
    const { diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:800px;height:600px"></div>
      </body></html>`
    );

    diagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
      .add(
        new go.Shape('RoundedRectangle', { fill: 'white' }).bind('fill', 'color'),
        new go.TextBlock({ margin: 6 }).bindTwoWay('text', 'text')
      );

    diagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: 'Alpha', color: 'lightblue' },
        { key: 2, text: 'Beta', color: 'orange' },
      ],
      []
    );

    const layers = (diagram as any)._layers;
    console.log('Layer count:', layers.length);

    let totalParts = 0;
    for (const layer of layers) {
      const it = layer.parts;
      let count = 0;
      while (it.next()) {
        count++;
      }
      console.log(`  Layer "${layer.name}": ${count} parts, visible=${layer.visible}, isTemp=${layer.isTemporary}`);
      totalParts += count;
    }
    console.log('Total parts:', totalParts);

    const nodeCount = (() => {
      let c = 0;
      const it = diagram.nodes;
      while (it.next()) c++;
      return c;
    })();
    console.log('Node count:', nodeCount);

    expect(nodeCount).toBe(2);
  });

  it('should verify _updateGeometry runs and positions all parts', () => {
    const { diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:800px;height:600px"></div>
      </body></html>`
    );

    diagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
      .add(
        new go.Shape('RoundedRectangle', { fill: 'white' }).bind('fill', 'color'),
        new go.TextBlock({ margin: 6 }).bindTwoWay('text', 'text')
      );

    diagram.model = new go.GraphLinksModel(
      [
        { key: 1, text: 'Alpha', color: 'lightblue' },
        { key: 2, text: 'Beta', color: 'orange' },
        { key: 3, text: 'Gamma', color: 'lightgreen' },
      ],
      []
    );

    const nodes: go.Node[] = [];
    const it = diagram.nodes;
    while (it.next()) nodes.push(it.value);

    expect(nodes.length).toBe(3);

    console.log('\n=== After model set (before manual updateGeometry) ===');
    for (const n of nodes) {
      const loc = n.location;
      const pos = n.position;
      const ab = n.getDocumentBounds();
      const mb = n.measuredBounds;
      console.log(
        `  Node key=${(n as any).data?.key}:`,
        `loc=(${loc.x},${loc.y})`,
        `pos=(${pos.x},${pos.y})`,
        `ab=(${ab.x},${ab.y},${ab.width},${ab.height})`,
        `mb=(${mb.width},${mb.height})`
      );
    }

    (diagram as any)._updateGeometry();

    console.log('\n=== After _updateGeometry() ===');
    for (const n of nodes) {
      const loc = n.location;
      const pos = n.position;
      const ab = n.getDocumentBounds();
      const mb = n.measuredBounds;
      console.log(
        `  Node key=${(n as any).data?.key}:`,
        `loc=(${loc.x},${loc.y})`,
        `pos=(${pos.x},${pos.y})`,
        `ab=(${ab.x},${ab.y},${ab.width},${ab.height})`,
        `mb=(${mb.width},${mb.height})`
      );
    }

    const positions = nodes.map(n => {
      const ab = n.getDocumentBounds();
      return { x: ab.x, y: ab.y, w: ab.width, h: ab.height };
    });

    for (const pos of positions) {
      expect(pos.w).toBeGreaterThan(0);
      expect(pos.h).toBeGreaterThan(0);
      expect(pos.x).not.toBeNaN();
      expect(pos.y).not.toBeNaN();
    }
  });
});
