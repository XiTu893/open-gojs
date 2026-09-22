import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import * as go from '../../src/index';

function setup() {
  const dom = new JSDOM(
    '<!DOCTYPE html><div id="d" style="width:800px;height:600px"></div>',
    { pretendToBeVisual: true }
  );
  const div = dom.window.document.getElementById('d') as HTMLDivElement;

  const d = new go.Diagram(div);
  d.groupTemplate = new go.Group('Vertical', { selectionObjectName: 'PANEL', ungroupable: true })
    .add(
      new go.TextBlock({ font: 'bold 19px sans-serif', isMultiline: false, editable: true })
        .bindTwoWay('text', 'text')
        .bind('stroke', 'color'),
      new go.Panel('Auto', { name: 'PANEL' }).add(
        new go.Shape('Rectangle', {
          fill: 'rgba(128,128,128,0.2)',
          stroke: 'gray',
          strokeWidth: 3,
          portId: '',
          cursor: 'pointer',
        }),
        new go.Placeholder({ margin: 10, background: 'transparent' })
      )
    );
  d.model = new go.GraphLinksModel(
    [
      { key: 1, text: 'Alpha' },
      { key: 2, text: 'Beta' },
      { key: 3, text: 'Gamma', group: 5 },
      { key: 4, text: 'Delta', group: 5 },
      { key: 5, text: 'Epsilon', isGroup: true },
    ],
    [{ from: 1, to: 2 }, { from: 2, to: 2 }, { from: 3, to: 4 }, { from: 3, to: 1 }]
  );
  (d as any)._updateGeometry();
  return { div, d };
}

describe('group border diagnose', () => {
  it('traces group, placeholder, members, and borders', () => {
    const { d } = setup();
    const gn = d.findNodeForKey(5) as any;
    const panel = gn.findObject('PANEL');
    const placeholder = panel && panel._elements.find((e: any) => e._isPlaceholder);
    const shape = panel && panel._elements.find((e: any) => !e._isPlaceholder);

    console.log('group ab:', JSON.stringify(gn.actualBounds));
    console.log('group location:', JSON.stringify(gn.location));
    const tit = (gn as any)._elements[0];
    console.log('Title[0] ab:', JSON.stringify(tit && tit.actualBounds), 'mb:', JSON.stringify(tit && tit.measuredBounds), 'cls:', tit && tit.constructor.name);
    console.log('PANEL ab:', JSON.stringify(panel.actualBounds));
    console.log('  Shape ab:', JSON.stringify(shape && shape.actualBounds), 'mb:', JSON.stringify(shape && shape.measuredBounds));
    console.log('  Placeholder ab:', JSON.stringify(placeholder && placeholder.actualBounds), 'mb:', JSON.stringify(placeholder && placeholder.measuredBounds));

    console.log('members:');
    const mit = gn.memberParts.iterator;
    while (mit.next()) {
      const m = mit.value;
      console.log('  ', m.data.key, 'loc:', JSON.stringify(m.location), 'ab:', JSON.stringify(m.actualBounds));
      const localX = m.actualBounds.x - gn.actualBounds.x;
      const localY = m.actualBounds.y - gn.actualBounds.y;
      console.log('    local to group:', localX, localY);
    }
  });

  it('measures node text block height vs actual glyph ink', () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div id="d" style="width:800px;height:600px"></div>',
      { pretendToBeVisual: true }
    );
    const div = dom.window.document.getElementById('d') as HTMLDivElement;
    const d = new go.Diagram(div);
    d.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
      .add(
        new go.Shape('RoundedRectangle', { fill: 'white', stroke: 'gray', strokeWidth: 2, portId: '', fromLinkable: true, toLinkable: true }),
        new go.TextBlock({ font: 'bold 14px sans-serif', stroke: '#333', margin: 6, isMultiline: false, editable: true, text: 'Alpha' })
      );
    d.model = new go.GraphLinksModel([{ key: 1, text: 'Alpha' }], []);
    (d as any)._updateGeometry();
    const n = d.findNodeForKey(1) as any;
    const tb = n._elements.find((e: any) => e.constructor.name === 'TextBlock');
    const ab = tb.actualBounds;
    console.log('Node TextBlock actualBounds h:', ab.height, 'w:', ab.width);
    console.log('Node TextBlock measuredBounds h:', tb.measuredBounds.height);
    console.log('Node TextBlock _lineCount:', tb.lineCount);

    const tctx = (go.TextBlock as any)._tempCanvas.getContext('2d');
    tctx.font = 'bold 14px sans-serif';
    const tm = tctx.measureText('M');
    console.log('tempCanvas measureText M: ascent', tm.actualBoundingBoxAscent, 'descent', tm.actualBoundingBoxDescent, 'width', tm.width);
    const th = (tb as any)._getLineHeight ? (tb as any)._getLineHeight(tctx, 14) : 'n/a';
    console.log('TextBlock._getLineHeight(14) =', th);
    console.log('14*1.2 =', 14 * 1.2, ' 14*1.1 =', 14 * 1.1);
  });
});