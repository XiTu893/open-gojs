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

describe('group layout diagnosis', () => {

  it('trace group measurement chain', () => {
    const { diagram } = createDiagram(
      `<!DOCTYPE html><html><body>
        <div id="myDiagramDiv" style="width:400px;height:400px"></div>
      </body></html>`
    );

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

    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
    (diagram as any)._updateGeometry();

    // Find group
    const nodesIt = diagram.nodes;
    let group: any = null;
    while (nodesIt.next()) {
      if (nodesIt.value instanceof go.Group) {
        group = nodesIt.value;
        break;
      }
    }
    expect(group).not.toBeNull();

    console.log('\n=== GROUP TEMPLATE STRUCTURE ===');
    console.log(`Group type: ${group._type}`);
    console.log(`Group elements count: ${group._elements.length}`);
    for (let i = 0; i < group._elements.length; i++) {
      const elem = group._elements[i];
      console.log(`  [${i}] className=${elem.constructor.name} type=${elem._type} name="${elem.name}" visible=${elem.visible}`);
      if (elem._elements) {
        for (let j = 0; j < elem._elements.length; j++) {
          const child = elem._elements[j];
          console.log(`    [${j}] className=${child.constructor.name} type=${child._type} isPlaceholder=${(child as any)._isPlaceholder} margin=${JSON.stringify(child.margin)}`);
        }
      }
    }

    console.log('\n=== GROUP MEASUREMENTS ===');
    const gLoc = group.location;
    const gMb = group.measuredBounds;
    const gAb = group.getDocumentBounds();
    console.log(`Group loc=(${gLoc.x},${gLoc.y}) mb=(${gMb.width},${gMb.height}) ab=(${gAb.x},${gAb.y},${gAb.width},${gAb.height})`);

    // Trace elements
    for (let i = 0; i < group._elements.length; i++) {
      const elem = group._elements[i];
      const mb = elem.measuredBounds;
      const ab = elem._actualBounds;
      console.log(`  elem[${i}] ${elem.constructor.name} mb=(${mb.width},${mb.height}) ab=(${ab.x},${ab.y},${ab.width},${ab.height})`);

      if (elem._elements) {
        for (let j = 0; j < elem._elements.length; j++) {
          const child = elem._elements[j];
          const cmb = child.measuredBounds;
          const cab = child._actualBounds;
          const cm = child.margin;
          console.log(`    child[${j}] ${child.constructor.name} mb=(${cmb.width},${cmb.height}) ab=(${cab.x},${cab.y},${cab.width},${cab.height}) margin=(${cm.left},${cm.top},${cm.right},${cm.bottom})`);

          if ((child as any)._isPlaceholder) {
            console.log(`    Placeholder padding=${(child as any)._padding}`);
            // Trace member bounds
            const gPos = group.location;
            const mIt = group.memberParts.iterator;
            while (mIt.next()) {
              const member = mIt.value;
              const mLoc = member.location;
              const mMb = member.measuredBounds;
              const mAb = member.getDocumentBounds();
              console.log(`      member key=${member.data?.key} loc=(${mLoc.x},${mLoc.y}) mb=(${mMb.width},${mMb.height}) ab=(${mAb.x},${mAb.y},${mAb.width},${mAb.height})`);
              console.log(`        localBounds=(${mAb.x - gPos.x},${mAb.y - gPos.y},${mMb.width},${mMb.height})`);
            }
          }
        }
      }
    }

    // Check Placeholder margin handling
    console.log('\n=== MARGIN CHECK ===');
    const placeholder = group._elements[1]?._elements[1];
    if (placeholder) {
      const m = placeholder.margin;
      console.log(`Placeholder margin: left=${m.left} top=${m.top} right=${m.right} bottom=${m.bottom}`);
      console.log(`Placeholder margin type: ${typeof m}`);
      console.log(`Placeholder margin constructor: ${m.constructor.name}`);
    }

    // Members
    console.log('\n=== MEMBER NODES ===');
    const mIt2 = group.memberParts.iterator;
    while (mIt2.next()) {
      const member = mIt2.value;
      console.log(`Member key=${member.data?.key} loc=(${member.location.x},${member.location.y}) mb=(${member.measuredBounds.width},${member.measuredBounds.height}) ab=(${member.getDocumentBounds().x},${member.getDocumentBounds().y},${member.getDocumentBounds().width},${member.getDocumentBounds().height})`);
    }
  });

});
