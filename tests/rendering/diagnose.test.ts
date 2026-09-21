import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import * as go from '../../src/index';

function createDiagram(html: string) {
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  const div = dom.window.document.getElementById('myDiagramDiv') as HTMLDivElement;
  const diagram = new go.Diagram(div);
  return { dom, div, diagram };
}

describe('diagnose measuredBounds=(0,0)', () => {

  it('Shape with figure should have non-zero measuredBounds', () => {
    const shape = new go.Shape('RoundedRectangle');
    shape.fill = 'white';
    shape._measure(800, 600);
    const mb = shape.measuredBounds;
    console.log('Shape measuredBounds:', mb.width, mb.height);
    expect(mb.width).toBeGreaterThan(0);
    expect(mb.height).toBeGreaterThan(0);
  });

  it('TextBlock with text should have non-zero measuredBounds', () => {
    const tb = new go.TextBlock('Alpha', { margin: 6 });
    tb._measure(800, 600);
    const mb = tb.measuredBounds;
    console.log('TextBlock measuredBounds:', mb.width, mb.height);
    expect(mb.width).toBeGreaterThan(0);
    expect(mb.height).toBeGreaterThan(0);
  });

  it('Node created directly should have non-zero measuredBounds', () => {
    const node = new go.Node('Auto', { locationSpot: go.Spot.Center });
    const shape = new go.Shape('RoundedRectangle');
    shape.fill = 'white';
    const tb = new go.TextBlock('Alpha', { margin: 6 });
    node.add(shape);
    node.add(tb);

    node._measure(800, 600);
    const mb = node.measuredBounds;
    console.log('Direct Node measuredBounds:', mb.width, mb.height);
    console.log('  Shape measuredBounds:', shape.measuredBounds.width, shape.measuredBounds.height);
    console.log('  TextBlock measuredBounds:', tb.measuredBounds.width, tb.measuredBounds.height);
    expect(mb.width).toBeGreaterThan(0);
    expect(mb.height).toBeGreaterThan(0);
  });

  it('Node from copy() should have non-zero measuredBounds', () => {
    const template = new go.Node('Auto', { locationSpot: go.Spot.Center });
    const shape = new go.Shape('RoundedRectangle');
    shape.fill = 'white';
    const tb = new go.TextBlock('Alpha', { margin: 6 });
    template.add(shape);
    template.add(tb);

    const node = template.copy() as go.Node;
    console.log('Copied node className:', (node as any)._className);
    console.log('Copied node type:', (node as any)._type);
    console.log('Copied node elements count:', (node as any)._elements.length);

    node._measure(800, 600);
    const mb = node.measuredBounds;
    console.log('Copied Node measuredBounds:', mb.width, mb.height);
    expect(mb.width).toBeGreaterThan(0);
    expect(mb.height).toBeGreaterThan(0);
  });

  it('Node from Diagram template should have non-zero measuredBounds', () => {
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

    console.log('Template elements:', (diagram.nodeTemplate as any)._elements.length);

    diagram.model = new go.GraphLinksModel(
      [{ key: 1, text: 'Alpha', color: 'lightblue' }],
      []
    );

    const nodes: go.Node[] = [];
    const it = diagram.nodes;
    while (it.next()) nodes.push(it.value);

    expect(nodes.length).toBe(1);
    const node = nodes[0];

    console.log('Node className:', (node as any)._className);
    console.log('Node type:', (node as any)._type);
    console.log('Node elements count:', (node as any)._elements.length);
    console.log('Node panel:', (node as any)._panel);
    console.log('Node diagram:', (node as any)._diagram !== null);

    for (let i = 0; i < (node as any)._elements.length; i++) {
      const elem = (node as any)._elements[i];
      console.log(`  Element[${i}] className:`, elem.constructor.name, `visible:`, elem.visible);
    }

    node._measure(800, 600);
    const mb = node.measuredBounds;
    console.log('Diagram Node measuredBounds:', mb.width, mb.height);

    for (let i = 0; i < (node as any)._elements.length; i++) {
      const elem = (node as any)._elements[i];
      console.log(`  Element[${i}] measuredBounds:`, elem.measuredBounds.width, elem.measuredBounds.height);
    }

    expect(mb.width).toBeGreaterThan(0);
    expect(mb.height).toBeGreaterThan(0);
  });

  it('Trace _updateGeometry step by step', () => {
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

    const nodes: go.Node[] = [];
    const it = diagram.nodes;
    while (it.next()) nodes.push(it.value);

    expect(nodes.length).toBe(2);

    console.log('\n--- Before _updateGeometry ---');
    for (const n of nodes) {
      const loc = n.location;
      const mb = n.measuredBounds;
      const ab = n.getDocumentBounds();
      console.log(`Node ${(n as any).data?.key}: loc=(${loc.x},${loc.y}) mb=(${mb.width},${mb.height}) ab=(${ab.x},${ab.y},${ab.width},${ab.height})`);
    }

    // Manually call _updateGeometry like Diagram._renderLoop does
    (diagram as any)._updateGeometry();

    console.log('\n--- After _updateGeometry ---');
    for (const n of nodes) {
      const loc = n.location;
      const mb = n.measuredBounds;
      const ab = n.getDocumentBounds();
      console.log(`Node ${(n as any).data?.key}: loc=(${loc.x},${loc.y}) mb=(${mb.width},${mb.height}) ab=(${ab.x},${ab.y},${ab.width},${ab.height})`);

      // Check child elements
      for (let i = 0; i < (n as any)._elements.length; i++) {
        const elem = (n as any)._elements[i];
        const eab = elem.getDocumentBounds();
        console.log(`  elem[${i}] className=${elem.constructor.name} mb=(${elem.measuredBounds.width},${elem.measuredBounds.height}) ab=(${eab.x},${eab.y},${eab.width},${eab.height})`);
      }
    }
  });
});
