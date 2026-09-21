import { describe, it, expect } from 'vitest';
import { officialGojs, openGojs, makeDom, getDiv } from './harness';

/**
 * Walk the visual tree of a Panel/GraphObject and return a structural summary.
 * Rendering-independent: reports class name, panel type, figure, text, element count.
 */
function describeGraphObjectTree(go: any, obj: any, depth = 0): any {
  if (!obj) return null;
  const out: any = {
    cls: obj.constructor ? obj.constructor.name : obj.className,
    panelType: obj.type !== undefined ? String(obj.type) : undefined,
    figure: obj.figure !== undefined ? String(obj.figure) : undefined,
    text: typeof obj.text === 'string' ? obj.text : undefined,
    toArrow: typeof obj.toArrow === 'string' ? obj.toArrow : undefined,
  };
  // Panel children
  let elements: any = null;
  if (obj.elements && obj.elements.iterator) {
    elements = obj.elements;
  } else if ((obj as any)._elements && (obj as any)._elements.length !== undefined) {
    elements = (obj as any)._elements;
  }
  if (elements) {
    const kids: any[] = [];
    if (elements.iterator) {
      const it = elements.iterator;
      while (it.next()) kids.push(describeGraphObjectTree(go, it.value, depth + 1));
    } else {
      for (const e of elements) kids.push(describeGraphObjectTree(go, e, depth + 1));
    }
    if (kids.length) out.children = kids;
  }
  return out;
}

/**
 * Replicates the model/template setup of examples/basic.html and returns a
 * rendering-independent structural summary of the resulting diagram.
 * (Avoids interactive bits that rely on alerts/DOM events.)
 */
function runBasicSample(go: any, div: any): any {
  const myDiagram = new go.Diagram(div, {
    'clickCreatingTool.archetypeNodeData': { text: 'Node', color: 'white' },
    'commandHandler.archetypeGroupData': { text: 'Group', isGroup: true, color: 'blue' },
    'undoManager.isEnabled': true,
  });

  myDiagram.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
    .add(
      new go.Shape('RoundedRectangle', {
        fill: 'white',
        portId: '',
        cursor: 'pointer',
        fromLinkable: true,
        fromLinkableSelfNode: true,
        fromLinkableDuplicates: true,
        toLinkable: true,
        toLinkableSelfNode: true,
        toLinkableDuplicates: true,
      }).bind('fill', 'color'),
      new go.TextBlock({
        font: 'bold 14px sans-serif',
        stroke: '#333',
        margin: 6,
        isMultiline: false,
        editable: true,
      }).bindTwoWay('text', 'text')
    );

  myDiagram.linkTemplate = new go.Link({ toShortLength: 3, relinkableFrom: true, relinkableTo: true })
    .add(
      new go.Shape({ strokeWidth: 2 }).bind('stroke', 'color'),
      new go.Shape({ toArrow: 'Standard', stroke: null }).bind('fill', 'color')
    );

  myDiagram.groupTemplate = new go.Group('Vertical', {
    selectionObjectName: 'PANEL',
    ungroupable: true,
  })
    .add(
      new go.TextBlock({
        font: 'bold 19px sans-serif',
        isMultiline: false,
        editable: true,
      })
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

  const nodeDataArray = [
    { key: 1, text: 'Alpha', color: 'lightblue' },
    { key: 2, text: 'Beta', color: 'orange' },
    { key: 3, text: 'Gamma', color: 'lightgreen', group: 5 },
    { key: 4, text: 'Delta', color: 'pink', group: 5 },
    { key: 5, text: 'Epsilon', color: 'green', isGroup: true },
  ];
  const linkDataArray = [
    { from: 1, to: 2, color: 'blue' },
    { from: 2, to: 2 },
    { from: 3, to: 4, color: 'green' },
    { from: 3, to: 1, color: 'purple' },
  ];
  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

  // Structural summary independent of pixel rendering.
  const nodes: Array<{ key: any; text: any; isGroup: any }> = [];
  const it = myDiagram.nodes;
  while (it.next()) {
    const n = it.value;
    nodes.push({ key: n.data && n.data.key, text: n.data && n.data.text, isGroup: n.isGroup });
  }
  const links: Array<{ from: any; to: any }> = [];
  const lit = myDiagram.links;
  while (lit.next()) {
    const l = lit.value;
    links.push({ from: l.data && l.data.from, to: l.data && l.data.to });
  }

  // Group membership: find node 5 group and its member nodes.
  let groupKey: any = null;
  let memberKeys: any[] = [];
  for (const n of nodes) {
    if (n.isGroup) {
      groupKey = n.key;
      const members = (n as any).memberParts;
      if (members && members.each) {
        const ks: any[] = [];
        members.each((p: any) => {
          if (p && p.data) ks.push(p.data.key);
        });
        memberKeys = ks;
      }
    }
  }

  return {
    nodeCount: nodes.length,
    linkCount: links.length,
    nodes,
    links,
    groupKey,
    memberKeys,
  };
}

describe('basic.html structural comparison (official vs open-gojs)', () => {
  it('produces identical node/link/group structure', () => {
    const offDom = makeDom();
    const openDom = makeDom();
    const offDiv = getDiv(offDom);
    const openDiv = getDiv(openDom);

    let off: any;
    let op: any;
    let offErr: string | undefined;
    let opErr: string | undefined;
    try {
      off = runBasicSample(officialGojs, offDiv);
    } catch (e: any) {
      offErr = String(e && e.message ? e.message : e);
    }
    try {
      op = runBasicSample(openGojs, openDiv);
    } catch (e: any) {
      opErr = String(e && e.message ? e.message : e);
    }
    try { offDiv.remove(); } catch {}
    try { openDiv.remove(); } catch {}

    console.log('official nodeCount:', off && off.nodeCount, 'linkCount:', off && off.linkCount);
    console.log('official groupKey:', off && off.groupKey, 'memberKeys:', off && off.memberKeys);
    console.log('open     nodeCount:', op && op.nodeCount, 'linkCount:', op && op.linkCount);
    console.log('open     groupKey:', op && op.groupKey, 'memberKeys:', op && op.memberKeys);
    if (offErr) console.log('official error:', offErr);
    if (opErr) console.log('open error:', opErr);

    if (!offErr && !opErr) {
      expect(op.nodeCount).toBe(off.nodeCount);
      expect(op.linkCount).toBe(off.linkCount);
      const offKeys = off.nodes.map((n: any) => n.key).sort();
      const opKeys = op.nodes.map((n: any) => n.key).sort();
      expect(opKeys).toEqual(offKeys);
      expect(op.groupKey).toBe(off.groupKey);
      expect(op.memberKeys.sort()).toEqual(off.memberKeys.sort());
    } else {
      // At least assert no error on either side if the other threw.
      if (offErr) expect(opErr).toBeTruthy();
      if (opErr) expect(offErr).toBeTruthy();
    }
  });

  it('produces matching template element trees', () => {
    const offDom = makeDom();
    const openDom = makeDom();
    const offDiv = getDiv(offDom);
    const openDiv = getDiv(openDom);

    function buildTemplates(go: any, div: any) {
      const d = new go.Diagram(div);
      d.nodeTemplate = new go.Node('Auto', { locationSpot: go.Spot.Center })
        .add(
          new go.Shape('RoundedRectangle', { fill: 'white' }).bind('fill', 'color'),
          new go.TextBlock({ font: 'bold 14px sans-serif', stroke: '#333', margin: 6 })
            .bindTwoWay('text', 'text')
        );
      d.linkTemplate = new go.Link({ toShortLength: 3 })
        .add(
          new go.Shape({ strokeWidth: 2 }).bind('stroke', 'color'),
          new go.Shape({ toArrow: 'Standard', stroke: null }).bind('fill', 'color')
        );
      d.groupTemplate = new go.Group('Vertical', { selectionObjectName: 'PANEL', ungroupable: true })
        .add(
          new go.TextBlock({ font: 'bold 19px sans-serif' })
            .bindTwoWay('text', 'text')
            .bind('stroke', 'color'),
          new go.Panel('Auto', { name: 'PANEL' }).add(
            new go.Shape('Rectangle', { fill: 'rgba(128,128,128,0.2)', stroke: 'gray', strokeWidth: 3 }),
            new go.Placeholder({ margin: 10, background: 'transparent' })
          )
        );
      return {
        node: describeGraphObjectTree(go, d.nodeTemplate),
        link: describeGraphObjectTree(go, d.linkTemplate),
        group: describeGraphObjectTree(go, d.groupTemplate),
      };
    }

    let off: any, op: any, offErr: string | undefined, opErr: string | undefined;
    try { off = buildTemplates(officialGojs, offDiv); } catch (e: any) { offErr = String(e && e.message ? e.message : e); }
    try { op = buildTemplates(openGojs, openDiv); } catch (e: any) { opErr = String(e && e.message ? e.message : e); }
    try { offDiv.remove(); } catch {}
    try { openDiv.remove(); } catch {}

    console.log('official node template:', JSON.stringify(off && off.node));
    console.log('open     node template:', JSON.stringify(op && op.node));
    console.log('official link template:', JSON.stringify(off && off.link));
    console.log('open     link template:', JSON.stringify(op && op.link));
    console.log('official group template:', JSON.stringify(off && off.group));
    console.log('open     group template:', JSON.stringify(op && op.group));
    if (offErr) console.log('official template error:', offErr);
    if (opErr) console.log('open template error:', opErr);

    if (!offErr && !opErr) {
      expect(op.node.cls).toBe('Node');
      expect(op.link.cls).toBe('Link');
      expect(op.group.cls).toBe('Group');
      // node template: Auto panel with Shape + TextBlock
      expect(op.node.panelType).toBe('Auto');
      expect(op.node.children.length).toBe(2);
      expect(op.node.children[0].cls).toBe('Shape');
      expect(op.node.children[0].figure).toBe('RoundedRectangle');
      expect(op.node.children[1].cls).toBe('TextBlock');
      // link template: Link panel with 2 shapes (2nd has Standard arrowhead)
      expect(op.link.children.length).toBe(2);
      expect(op.link.children[1].toArrow).toBe('Standard');
      // group template: Vertical group with TextBlock + PANEL Auto with Shape + Placeholder
      expect(op.group.panelType).toBe('Vertical');
      expect(op.group.children.length).toBe(2);
      expect(op.group.children[0].cls).toBe('TextBlock');
      const inner = op.group.children[1];
      expect(inner.cls).toBe('Panel');
      expect(inner.panelType).toBe('Auto');
      expect(inner.children.length).toBe(2);
      expect(inner.children[1].cls).toBe('Placeholder');
    } else {
      if (offErr) expect(opErr).toBeTruthy();
      if (opErr) expect(offErr).toBeTruthy();
    }
  });
});