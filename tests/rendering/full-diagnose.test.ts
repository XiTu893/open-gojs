import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import * as go from '../../src/index';

function createDiagram(html: string) {
  const dom = new JSDOM(html, { pretendToBeVisual: true });
  const doc = dom.window.document;
  const div = doc.getElementById('myDiagramDiv') as HTMLDivElement;
  const diagram = new go.Diagram(div);
  return { dom, doc, div, diagram };
}

describe('full basic.html diagnosis', () => {

  it('trace complete pipeline: nodes, groups, links', () => {
    const { diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:400px;height:400px"></div>
      </body></html>`
    );

    // ---- Templates (same as basic.html) ----
    diagram.nodeTemplate =
      new go.Node('Auto', { locationSpot: go.Spot.Center })
        .add(
          new go.Shape('RoundedRectangle', { fill: 'white', portId: '' })
            .bind('fill', 'color'),
          new go.TextBlock({ font: 'bold 14px sans-serif', margin: 6 })
            .bindTwoWay('text', 'text')
        );

    diagram.linkTemplate =
      new go.Link({ toShortLength: 3 })
        .add(
          new go.Shape({ strokeWidth: 2 }).bind('stroke', 'color'),
          new go.Shape({ toArrow: 'Standard', stroke: null }).bind('fill', 'color')
        );

    diagram.groupTemplate =
      new go.Group('Vertical', {
        selectionObjectName: 'PANEL',
      })
        .add(
          new go.TextBlock({ font: 'bold 19px sans-serif' })
            .bindTwoWay('text', 'text')
            .bind('stroke', 'color'),
          new go.Panel('Auto', { name: 'PANEL' })
            .add(
              new go.Shape('Rectangle', {
                fill: 'rgba(128,128,128,0.2)',
                stroke: 'gray',
                strokeWidth: 3,
                portId: '',
              }),
              new go.Placeholder({ margin: 10 })
            )
        );

    // ---- Model ----
    const nodeDataArray = [
      { key: 1, text: 'Alpha', color: 'lightblue' },
      { key: 2, text: 'Beta', color: 'orange' },
      { key: 3, text: 'Gamma', color: 'lightgreen', group: 5 },
      { key: 4, text: 'Delta', color: 'pink', group: 5 },
      { key: 5, text: 'Epsilon', color: 'green', isGroup: true }
    ];
    const linkDataArray = [
      { from: 1, to: 2, color: 'blue' },
      { from: 2, to: 2 },
      { from: 3, to: 4, color: 'green' },
      { from: 3, to: 1, color: 'purple' }
    ];

    // Set model
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    // Manually run the full pipeline that _renderLoop would do
    (diagram as any)._updateGeometry();

    // ---- Collect all parts ----
    console.log('\n=== ALL PARTS ===');
    const allParts: any[] = [];
    for (const layer of (diagram as any)._layers) {
      const it = layer.parts;
      while (it.next()) {
        allParts.push(it.value);
      }
    }
    console.log(`Total parts: ${allParts.length}`);

    // ---- Print nodes ----
    console.log('\n=== NODES ===');
    const nodesIt = diagram.nodes;
    while (nodesIt.next()) {
      const n = nodesIt.value;
      const loc = n.location;
      const pos = n.position;
      const mb = n.measuredBounds;
      const ab = n.getDocumentBounds();
      const group = n.containingGroup;
      const isGroup = n instanceof go.Group;
      console.log(
        `Node key=${n.data?.key} class=${n.constructor.name} isGroup=${isGroup}`,
        `loc=(${loc.x},${loc.y})`,
        `pos=(${pos.x},${pos.y})`,
        `mb=(${mb.width},${mb.height})`,
        `ab=(${ab.x},${ab.y},${ab.width},${ab.height})`,
        `group=${group ? group.data?.key : 'null'}`,
        `elements=${(n as any)._elements?.length || 0}`
      );
    }

    // ---- Print links ----
    console.log('\n=== LINKS ===');
    const linksIt = diagram.links;
    while (linksIt.next()) {
      const link = linksIt.value;
      const from = link.fromNode;
      const to = link.toNode;
      const pts = link.points;
      const ptsArr: string[] = [];
      const it = pts;
      const ptsIt = it;
      // iterate points
      for (let i = 0; i < pts.count; i++) {
        const p = pts.get(i)!;
        ptsArr.push(`(${p.x},${p.y})`);
      }
      console.log(
        `Link from=${from?.data?.key} to=${to?.data?.key}`,
        `fromNodeAb=(${from?.getDocumentBounds().x},${from?.getDocumentBounds().y},${from?.getDocumentBounds().width},${from?.getDocumentBounds().height})`,
        `toNodeAb=(${to?.getDocumentBounds().x},${to?.getDocumentBounds().y},${to?.getDocumentBounds().width},${to?.getDocumentBounds().height})`,
        `points=[${ptsArr.join(' -> ')}]`,
        `elements=${(link as any)._elements?.length || 0}`
      );
    }

    // ---- Print group members ----
    console.log('\n=== GROUPS ===');
    const nodesIt2 = diagram.nodes;
    while (nodesIt2.next()) {
      const n = nodesIt2.value;
      if (n instanceof go.Group) {
        const g = n as go.Group;
        console.log(`Group key=${g.data?.key} members=${g.memberParts.count}`);
        const mIt = g.memberParts;
        const mIt2 = mIt.iterator;
        while (mIt2.next()) {
          const part = mIt2.value;
          console.log(`  member key=${part.data?.key} class=${part.constructor.name} loc=(${part.location.x},${part.location.y})`);
        }
      }
    }

    // ---- Print layer info ----
    console.log('\n=== LAYERS ===');
    for (const layer of (diagram as any)._layers) {
      const count = layer.parts.count;
      console.log(`Layer "${layer.name}" parts=${count} visible=${layer.visible} temp=${layer.isTemporary}`);
    }

    // ---- Verify ----
    // At least nodes should have non-zero bounds
    const nodesArr: go.Node[] = [];
    const nIt = diagram.nodes;
    while (nIt.next()) nodesArr.push(nIt.value);

    for (const n of nodesArr) {
      const mb = n.measuredBounds;
      expect(mb.width).toBeGreaterThan(0);
      expect(mb.height).toBeGreaterThan(0);
    }

    // Links should have points
    const linksArr: go.Link[] = [];
    const lIt = diagram.links;
    while (lIt.next()) linksArr.push(lIt.value);

    for (const link of linksArr) {
      expect(link.points.count).toBeGreaterThanOrEqual(2);
      const pts = link.points;
      for (let i = 0; i < pts.count; i++) {
        const p = pts.get(i)!;
        expect(isFinite(p.x)).toBe(true);
        expect(isFinite(p.y)).toBe(true);
      }
    }
  });

});
