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

describe('minimal.html diagnosis', () => {

  it('trace minimal.html rendering pipeline', () => {
    const { diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:400px;height:400px"></div>
      </body></html>`
    );

    // Minimal.html uses string type 'Auto' in node template
    diagram.nodeTemplate =
      new go.Node('Auto')
        .add(
          new go.Shape('RoundedRectangle', { strokeWidth: 0, fill: 'white' })
            .bind('fill', 'color'),
          new go.TextBlock({ margin: 8, font: 'bold 14px sans-serif', stroke: '#333' })
            .bind('text')
        );

    // Default link template (not setting linkTemplate)
    // In official GoJS, default link template is:
    //   new go.Link()
    //     .add(
    //       new go.Shape(),            // the link path
    //       new go.Shape('Standard')   // the arrowhead
    //     );

    const nodeDataArray = [
      { key: 1, text: 'Alpha', color: 'lightblue' },
      { key: 2, text: 'Beta', color: 'orange' },
      { key: 3, text: 'Gamma', color: 'lightgreen' },
      { key: 4, text: 'Delta', color: 'pink' }
    ];
    const linkDataArray = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 2 },
      { from: 3, to: 4 },
      { from: 4, to: 1 }
    ];

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

    console.log('=== DIAGNOSIS: minimal.html ===\n');

    // Check if default link template was created
    console.log('--- Link Template ---');
    const lt = diagram.linkTemplate;
    console.log(`linkTemplate exists: ${!!lt}`);
    if (lt) {
      console.log(`linkTemplate className: ${lt.constructor.name}`);
      console.log(`linkTemplate type: ${(lt as any)._type}`);
      console.log(`linkTemplate elements: ${(lt as any)._elements?.length ?? 0}`);
      if (lt._elements) {
        for (let i = 0; i < lt._elements.length; i++) {
          const e = lt._elements[i];
          console.log(`  [${i}] ${e.constructor.name} figure=${(e as any)._figure} toArrow=${(e as any)._toArrow} fromArrow=${(e as any)._fromArrow} stroke=${(e as any)._stroke} fill=${(e as any)._fill}`);
        }
      }
    }

    console.log('\n--- Nodes ---');
    const nodesIt = diagram.nodes;
    while (nodesIt.next()) {
      const n = nodesIt.value;
      const loc = n.location;
      const pos = n.position;
      const mb = n.measuredBounds;
      const ab = n.actualBounds;
      const isGroup = n instanceof go.Group;
      console.log(`Node key=${n.data?.key} class=${n.constructor.name} isGroup=${isGroup} loc=(${loc.x.toFixed(1)},${loc.y.toFixed(1)}) pos=(${pos.x.toFixed(1)},${pos.y.toFixed(1)}) mb=(${mb.width.toFixed(1)},${mb.height.toFixed(1)}) ab=(${ab.x.toFixed(1)},${ab.y.toFixed(1)},${ab.width.toFixed(1)},${ab.height.toFixed(1)}) group=${n.data?.group ?? null} elements=${n._elements?.length ?? 0}`);

      // Print element details
      if (n._elements) {
        for (let i = 0; i < n._elements.length; i++) {
          const e = n._elements[i];
          const eab = e.actualBounds;
          console.log(`  [${i}] ${e.constructor.name} figure=${(e as any)._figure} text=${(e as any)._text} ab=(${eab.x.toFixed(1)},${eab.y.toFixed(1)},${eab.width.toFixed(1)},${eab.height.toFixed(1)})`);
        }
      }
    }

    console.log('\n--- Links ---');
    const linksIt = diagram.links;
    while (linksIt.next()) {
      const link = linksIt.value;
      const points = link.points;
      const arr = points.toArray();
      const from = link.fromNode;
      const to = link.toNode;
      const fromAb = from?.actualBounds;
      const toAb = to?.actualBounds;
      const selfLink = from === to;

      console.log(`Link from=${from?.data?.key} to=${to?.data?.key} selfLink=${selfLink} points=[${arr.map(p => `(${p.x.toFixed(1)},${p.y.toFixed(1)})`).join(' -> ')}]`);

      // Check link elements
      if (link._elements) {
        for (let i = 0; i < link._elements.length; i++) {
          const e = link._elements[i];
          console.log(`  [${i}] ${e.constructor.name} figure=${(e as any)._figure} toArrow=${(e as any)._toArrow} fromArrow=${(e as any)._fromArrow} isPanelMain=${e.isPanelMain} stroke=${(e as any)._stroke} fill=${(e as any)._fill} visible=${e.visible}`);
        }
      }

      // For official GoJS comparison: what should the points be?
      if (fromAb && toAb && !selfLink) {
        const fromCenter = { x: fromAb.x + fromAb.width / 2, y: fromAb.y + fromAb.height / 2 };
        const toCenter = { x: toAb.x + toAb.width / 2, y: toAb.y + toAb.height / 2 };
        console.log(`  fromCenter=(${fromCenter.x.toFixed(1)},${fromCenter.y.toFixed(1)}) toCenter=(${toCenter.x.toFixed(1)},${toCenter.y.toFixed(1)})`);
      }
    }

    // Official GoJS default link template check:
    // In GoJS, the default link template creates a Link with:
    //   - Shape (link path, strokeWidth=1, stroke='black')
    //   - Shape('Standard') (arrowhead, toArrow='standard')
    console.log('\n--- Official GoJS Default Link Template Behavior ---');
    console.log('Default link template should have:');
    console.log('  - Shape (link path): stroke="#000000" strokeWidth=1');
    console.log('  - Shape(Standard) (arrowhead): toArrow="standard" fill="black"');
    console.log('  - Arrow tip at link endpoint, pointing toward target node');
    console.log('  - Arrow geometry: triangle with tip at (0,0), base at (10,-5) to (10,5)');

    // Check self-link rendering
    console.log('\n--- Self-Link (2->2) Analysis ---');
    const selfLinkNode = diagram.findNodeForKey(2);
    if (selfLinkNode) {
      const nab = selfLinkNode.actualBounds;
      console.log(`Node 2 actualBounds: (${nab.x.toFixed(1)},${nab.y.toFixed(1)},${nab.width.toFixed(1)},${nab.height.toFixed(1)})`);
      console.log(`Expected self-link: loop going right from node, curving down and back`);
    }

    expect(true).toBe(true);
  });
});
