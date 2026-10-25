import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import * as go from '../src/index';

/** 选择装饰生命周期回归：修「选择框残留」——
 *  1) Part.diagram 直读 _diagram（GraphObject.part 链对 Adornment 解析为 null →
 *     removeAdornment 跳过 diagram.remove → 装饰永久堆在 Adornment 层）
 *  2) 选择装饰必须带 category='Selection'（空 category 会以空键挂载，
 *     map 双键、同一装饰在层里 add 两次）
 *  3) selectCollection 不得在 addAdornment 之外再 layer.add（List 无去重）
 */
function makeDiagram() {
  const dom = new JSDOM(
    `<!DOCTYPE html><html><body>
      <div id="selDiv" style="width:800px;height:600px"></div>
    </body></html>`,
    { pretendToBeVisual: true }
  );
  const div = dom.window.document.getElementById('selDiv') as HTMLDivElement;
  const diagram = new go.Diagram(div);
  diagram.nodeTemplate = new go.Node('Auto')
    .add(new go.Shape('RoundedRectangle'), new go.TextBlock('n'));
  diagram.model = new go.GraphLinksModel(
    [{ key: 'A' }, { key: 'B' }],
    [{ from: 'A', to: 'B' }]
  );
  diagram.maybeUpdate();
  return diagram;
}

function layerCount(diagram: any): number {
  const L = diagram.findLayer('Adornment');
  return L ? L.partsCount : -1;
}

describe('selection adornment lifecycle', () => {
  it('setter select creates exactly one in-layer Selection adornment', () => {
    const d = makeDiagram();
    const a: any = (d as any).findNodeForKey('A');
    a.isSelected = true;
    const ad = a.getAdornment('Selection');
    expect(ad).toBeTruthy();
    expect(ad.category).toBe('Selection');
    expect(ad.diagram).toBe(d);
    expect(d.findLayer('Adornment').contains(ad)).toBe(true);
    expect(layerCount(d)).toBe(1);
    expect(a.getAdornment('')).toBe(null);
  });

  it('deselect via setter removes the adornment from layer and map', () => {
    const d = makeDiagram();
    const a: any = (d as any).findNodeForKey('A');
    a.isSelected = true;
    a.isSelected = false;
    expect(a.getAdornment('Selection')).toBe(null);
    expect(a.getAdornment('')).toBe(null);
    expect(layerCount(d)).toBe(0);
  });

  it('deselect via clearSelection removes adornments of all selected parts', () => {
    const d = makeDiagram();
    const a: any = (d as any).findNodeForKey('A');
    const b: any = (d as any).findNodeForKey('B');
    a.isSelected = true;
    b.isSelected = true;
    expect(layerCount(d)).toBe(2);
    d.clearSelection();
    expect(a.getAdornment('Selection')).toBe(null);
    expect(b.getAdornment('Selection')).toBe(null);
    expect(layerCount(d)).toBe(0);
  });

  it('repeated select/deselect cycles never leak into the Adornment layer', () => {
    const d = makeDiagram();
    const a: any = (d as any).findNodeForKey('A');
    for (let i = 0; i < 5; i++) {
      a.isSelected = true;
      expect(layerCount(d)).toBe(1);
      a.isSelected = false;
      expect(layerCount(d)).toBe(0);
    }
  });

  it('selectCollection adds one adornment per part and clearSelection removes them all', () => {
    const d = makeDiagram();
    const a: any = (d as any).findNodeForKey('A');
    const b: any = (d as any).findNodeForKey('B');
    const lst = new go.List<any>();
    lst.add(a);
    lst.add(b);
    d.selectCollection(lst);
    expect(d.selection.count).toBe(2);
    expect(layerCount(d)).toBe(2);
    expect(a.getAdornment('Selection')).toBeTruthy();
    expect(b.getAdornment('Selection')).toBeTruthy();
    d.clearSelection();
    expect(layerCount(d)).toBe(0);
  });

  it('diagram.select switches selection and adornments without residue', () => {
    const d = makeDiagram();
    const a: any = (d as any).findNodeForKey('A');
    const b: any = (d as any).findNodeForKey('B');
    d.select(a);
    expect(a.getAdornment('Selection')).toBeTruthy();
    expect(layerCount(d)).toBe(1);
    d.select(b);
    expect(a.getAdornment('Selection')).toBe(null);
    expect(b.getAdornment('Selection')).toBeTruthy();
    expect(layerCount(d)).toBe(1);
    d.select(null);
    expect(b.getAdornment('Selection')).toBe(null);
    expect(layerCount(d)).toBe(0);
  });
});
