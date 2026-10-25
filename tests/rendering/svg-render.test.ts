import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import * as go from '../../src/index';

function makeDoc() {
  const dom = new JSDOM(
    `<!DOCTYPE html><html><body><div id="myDiagramDiv" style="width:400px;height:300px"></div></body></html>`,
    { pretendToBeVisual: true }
  );
  const div = dom.window.document.getElementById('myDiagramDiv') as HTMLDivElement;
  // jsdom 的 clientWidth 恒为 0 → 手动提供尺寸，便于 CanvasRenderer 创建画布（makeImageData 测试用）
  Object.defineProperty(div, 'clientWidth', { configurable: true, get: () => 400 });
  Object.defineProperty(div, 'clientHeight', { configurable: true, get: () => 300 });
  const diagram = new go.Diagram(div);
  return { dom, div, diagram };
}

/** 测试专用：直接写入已排布的 bounds（jsdom 无布局，渲染器只读这些字段） */
function setBounds(obj: any, x: number, y: number, w: number, h: number): void {
  obj._actualBounds = new go.Rect(x, y, w, h);
  obj._measuredBounds = new go.Rect(x, y, w, h);
  obj._naturalBounds = new go.Rect(x, y, w, h);
}

const EXPORT_BOUNDS = new go.Rect(0, 0, 200, 120);

describe('SvgRenderer (export)', () => {
  it('exports shape and text', () => {
    const { diagram } = makeDoc();

    const node = new go.Node('Auto');
    const shape = new go.Shape('RoundedRectangle', { fill: 'lightblue', stroke: 'black', strokeWidth: 2 });
    node.add(shape);
    const tb = new go.TextBlock({ margin: 6 });
    (tb as any).text = 'Alpha';
    (tb as any)._metricsText = 'Alpha';
    (tb as any)._metricsArrText = ['Alpha'];
    (tb as any)._metricsArrSize = [34];
    (tb as any)._metricsFontHeight = 17;
    node.add(tb);
    diagram.add(node);

    setBounds(node, 20, 20, 100, 50);
    setBounds(shape, 0, 0, 100, 50);
    setBounds(tb, 20, 12, 60, 26);

    const svg = diagram.makeSvg({ background: '#ffffff', bounds: EXPORT_BOUNDS });
    expect(svg.tagName.toLowerCase()).toBe('svg');
    expect(svg.getAttribute('viewBox')).toBeTruthy();

    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
    const fills = Array.from(paths).map(p => p.getAttribute('fill'));
    expect(fills.some(f => f === 'lightblue')).toBe(true);

    expect(svg.textContent || '').toContain('Alpha');
    const bg = Array.from(svg.querySelectorAll('rect')).find(r => r.getAttribute('fill') === '#ffffff');
    expect(bg).toBeTruthy();
  });

  it('exports link main path and arrowhead matrix', () => {
    const { diagram } = makeDoc();

    const link = new go.Link();
    const main = new go.Shape({ stroke: '#333333', strokeWidth: 2 });
    const arrow = new go.Shape({ toArrow: 'Standard', fill: '#333333', strokeWidth: 0 });
    link.add(main);
    link.add(arrow);
    diagram.add(link);

    // 两点垂直连线
    (link as any).points = new go.List<go.Point>().addAll([
      new go.Point(80, 10), new go.Point(80, 90),
    ]);
    setBounds(link, 80, 10, 0.001, 80);
    setBounds(main, 0, 0, 2, 80);
    setBounds(arrow, 0, 70, 10, 10);
    (diagram as any)._documentBounds = new go.Rect(0, 0, 200, 120);

    const svg = diagram.makeSvg({ bounds: EXPORT_BOUNDS });
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBeGreaterThanOrEqual(2);

    const arrowGroup = Array.from(svg.querySelectorAll('g'))
      .find(g => (g.getAttribute('transform') || '').indexOf('matrix') >= 0);
    expect(arrowGroup).toBeTruthy();
  });

  it('exports linear gradient brush as defs/linearGradient', () => {
    const { diagram } = makeDoc();

    const node = new go.Node('Auto');
    const brush = new go.Brush('Linear', { 0: 'red', 1: 'blue' });
    const shape = new go.Shape('Rectangle', { fill: brush, stroke: 'black' });
    node.add(shape);
    diagram.add(node);
    setBounds(node, 20, 20, 80, 40);
    setBounds(shape, 0, 0, 80, 40);

    const svg = diagram.makeSvg({ bounds: EXPORT_BOUNDS });
    const grad = svg.querySelector('linearGradient');
    expect(grad).toBeTruthy();
    expect(grad!.querySelectorAll('stop').length).toBe(2);
    const fills = Array.from(svg.querySelectorAll('path')).map(p => p.getAttribute('fill') || '');
    expect(fills.some(f => f.indexOf('url(#') === 0)).toBe(true);
  });

  it('makeImageData returns a PNG data URL', () => {
    const { diagram } = makeDoc();
    const node = new go.Node('Auto');
    node.add(new go.Shape('Rectangle', { fill: 'gold', stroke: 'black', desiredSize: new go.Size(50, 30) }));
    diagram.add(node);
    const data = diagram.makeImageData();
    expect(data.indexOf('data:image/png')).toBe(0);
  });
});
