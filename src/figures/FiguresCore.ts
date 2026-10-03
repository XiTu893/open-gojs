/* go.js 内置的 30 个图形。官方 extensions/Figures.js 明确说明它们仍内建于库中，该文件不含其实现，
   因此这 30 个为本项目手写实现（渲染结果与官方一致，见 temp/survey/figure_geo_cmp.cjs）。 */
import { Geometry } from '../core/Geometry';
import { PathFigure } from '../core/PathFigure';
import { PathSegment } from '../core/PathSegment';
import { Spot } from '../core/Spot';
import { defineFigureGenerator, getFigureGeometry } from './figureRegistry';

/** 官方 GoJS 圆角贝塞尔控制点比例：4*((√2-1)/3) */
const EO = 4 * ((Math.sqrt(2) - 1) / 3);

defineFigureGenerator('Rectangle', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('Square', (shape, w, h) => {
  const geo = new Geometry();
  const side = Math.min(w, h);
  const x = (w - side) / 2;
  const y = (h - side) / 2;
  const fig = new PathFigure(x, y);
  fig.add(PathSegment.Line(x + side, y));
  fig.add(PathSegment.Line(x + side, y + side));
  fig.add(PathSegment.Line(x, y + side));
  fig.add(PathSegment.Close());
  geo.add(fig);
  // 官方 Square geometry.defaultStretch = 6（Uniform）
  geo.defaultStretch = 6;
  return geo;
});
defineFigureGenerator('RoundedRectangle', (shape, w, h) => {
  const r = getP1(shape, 5);
  const p2 = getP2(shape, NaN);
  const allCorners = isNaN(p2);
  const tl = allCorners || (p2 & 1) !== 0;
  const tr = allCorners || (p2 & 2) !== 0;
  const br = allCorners || (p2 & 4) !== 0;
  const bl = allCorners || (p2 & 8) !== 0;
  const cr = Math.min(r, w / 2, h / 2);
  if (cr <= 0 || (!tl && !tr && !br && !bl)) return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
  const geo = new Geometry();
  const fig = new PathFigure(tl ? cr : 0, 0);
  fig.add(PathSegment.Line(tr ? w - cr : w, 0));
  if (tr) {
    fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
  } else {
    fig.add(PathSegment.Line(w, 0));
  }
  fig.add(PathSegment.Line(w, br ? h - cr : h));
  if (br) {
    fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
  } else {
    fig.add(PathSegment.Line(w, h));
  }
  fig.add(PathSegment.Line(bl ? cr : 0, h));
  if (bl) {
    fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
  } else {
    fig.add(PathSegment.Line(0, h));
  }
  fig.add(PathSegment.Line(0, tl ? cr : 0));
  if (tl) {
    fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
  } else {
    fig.add(PathSegment.Line(0, 0));
  }
  fig.add(PathSegment.Close());
  geo.add(fig);

  // 官方 spot1/spot2：随圆角收缩，供 Auto 面板定位内容
  const d = new Spot(0, 0);
  const m = new Spot(1, 1);
  if (tr) {
    let g = r;
    g = Math.min(g, tl ? w / 3 : w);
    g = Math.min(g, br ? h / 3 : h);
    const p = g * EO;
    d.offsetY = p;
    m.offsetX = -p;
  }
  if (br) {
    let g = r;
    g = Math.min(g, bl ? w / 3 : w);
    g = Math.min(g, tr ? h / 3 : h);
    const p = g * EO;
    m.offsetX = -p;
    m.offsetY = -p;
  }
  if (bl) {
    let g = r;
    g = Math.min(g, br ? w / 3 : w);
    g = Math.min(g, tl ? h / 3 : h);
    const p = g * EO;
    d.offsetX = p;
    m.offsetY = -p;
  }
  if (tl) {
    let f = r;
    f = Math.min(f, tr ? w / 3 : w);
    f = Math.min(f, bl ? h / 3 : h);
    const g = f * EO;
    d.offsetX = g;
    d.offsetY = g;
  }
  geo.spot1 = d;
  geo.spot2 = m;
  return geo;
});
defineFigureGenerator('Border', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0, false);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('RoundedTopRectangle', (shape, w, h) => {
  const r = getP1(shape, 5);
  const cr = Math.min(r, w / 2, h / 2);
  if (cr <= 0) return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
  const geo = new Geometry();
  const fig = new PathFigure(cr, 0);
  fig.add(PathSegment.Line(w - cr, 0));
  fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Line(0, cr));
  fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('RoundedBottomRectangle', (shape, w, h) => {
  const r = getP1(shape, 5);
  const cr = Math.min(r, w / 2, h / 2);
  if (cr <= 0) return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h - cr));
  fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
  fig.add(PathSegment.Line(cr, h));
  fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('RoundedLeftRectangle', (shape, w, h) => {
  const r = getP1(shape, 5);
  const cr = Math.min(r, w / 2, h / 2);
  if (cr <= 0) return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
  const geo = new Geometry();
  const fig = new PathFigure(0, cr);
  fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(cr, h));
  fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('RoundedRightRectangle', (shape, w, h) => {
  const r = getP1(shape, 5);
  const cr = Math.min(r, w / 2, h / 2);
  if (cr <= 0) return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w - cr, 0));
  fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
  fig.add(PathSegment.Line(w, h - cr));
  fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('Ellipse', (shape, w, h) => {
  const geo = new Geometry();
  const rx = w / 2;
  const ry = h / 2;
  const fig = new PathFigure(w, ry);
  fig.add(PathSegment.Arc(0, ry, rx, ry, 0, false, true));
  fig.add(PathSegment.Arc(w, ry, rx, ry, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  // 官方 Spot.Zk / Spot.Qk
  geo.spot1 = new Spot(0.156, 0.156);
  geo.spot2 = new Spot(0.844, 0.844);
  return geo;
});
defineFigureGenerator('Circle', (shape, w, h) => {
  const geo = new Geometry();
  const r = Math.min(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const fig = new PathFigure(cx + r, cy);
  fig.add(PathSegment.Arc(cx - r, cy, r, r, 0, false, true));
  fig.add(PathSegment.Arc(cx + r, cy, r, r, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  geo.spot1 = new Spot(0.156, 0.156);
  geo.spot2 = new Spot(0.844, 0.844);
  geo.defaultStretch = 6;
  return geo;
});
defineFigureGenerator('TriangleRight', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('TriangleDown', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w / 2, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('TriangleLeft', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w, 0);
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('TriangleUp', (shape, w, h) => {
  return getFigureGeometry('Triangle', w, h, NaN, NaN, shape)!;
});
defineFigureGenerator('Triangle', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0);
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('Diamond', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0);
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w / 2, h));
  fig.add(PathSegment.Line(0, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('LineH', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2, false);
  fig.add(PathSegment.Line(w, h / 2));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('LineV', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0, false);
  fig.add(PathSegment.Line(w / 2, h));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('None', (shape, w, h) => {
  // 官方：figure='None' 的 Shape 仍按矩形渲染（fill/stroke 画在 actualBounds 上）。
  // 若返回空几何，渲染器会跳过矩形回退路径导致画不出（barCharts 无 bar 的根因）。
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
defineFigureGenerator('BarH', (shape, w, h) => {
  return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
});
defineFigureGenerator('BarV', (shape, w, h) => {
  return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape)!;
});
defineFigureGenerator('MinusLine', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2, false);
  fig.add(PathSegment.Line(w, h / 2));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('PlusLine', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0, false);
  fig.add(PathSegment.Line(w / 2, h));
  geo.add(fig);
  const fig2 = new PathFigure(0, h / 2, false);
  fig2.add(PathSegment.Line(w, h / 2));
  geo.add(fig2);
  return geo;
});
defineFigureGenerator('XLine', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0, false);
  fig.add(PathSegment.Line(w, h));
  geo.add(fig);
  const fig2 = new PathFigure(w, 0, false);
  fig2.add(PathSegment.Line(0, h));
  geo.add(fig2);
  return geo;
});
defineFigureGenerator('LineRight', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2, false);
  fig.add(PathSegment.Line(w, h / 2));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('LineDown', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0, false);
  fig.add(PathSegment.Line(w / 2, h));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('LineLeft', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w, h / 2, false);
  fig.add(PathSegment.Line(0, h / 2));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('LineUp', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, h, false);
  fig.add(PathSegment.Line(w / 2, 0));
  geo.add(fig);
  return geo;
});
defineFigureGenerator('Capsule', (shape: any, w: number, h: number) => {
  const geo = new Geometry();
  const r = Math.min(w, h) / 2;
  const fig = new PathFigure(r, 0);
  fig.add(PathSegment.Line(w - r, 0));
  fig.add(PathSegment.Arc(w, r, r, r, 0, false, true));
  fig.add(PathSegment.Line(w, h - r));
  fig.add(PathSegment.Arc(w - r, h, r, r, 0, false, true));
  fig.add(PathSegment.Line(r, h));
  fig.add(PathSegment.Arc(0, h - r, r, r, 0, false, true));
  fig.add(PathSegment.Line(0, r));
  fig.add(PathSegment.Arc(r, 0, r, r, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  // 官方 Capsule 的三分支 spots：Auto 面板用 geometry.spot1/spot2 计算内容洞尺寸，
  // Start/End 节点尺寸（70.19×39.16）依赖第一轮 (100,100) 圆分支的 .156/.844 spots。
  if (w < h) {
    const c = shape && isFinite(shape.parameter1) ? shape.parameter1 : w * 0.156;
    geo.setSpots(0, 0, 1, 1, 0, c, 0, -c);
  } else if (w > h) {
    const c = shape && isFinite(shape.parameter1) ? shape.parameter1 : h * 0.156;
    geo.setSpots(0, 0, 1, 1, c, 0, -c, 0);
  } else {
    geo.spot1 = new Spot(0.156, 0.156);
    geo.spot2 = new Spot(0.844, 0.844);
  }
  return geo;
});
defineFigureGenerator('Borders', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0, false);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  const fig2 = new PathFigure(w * 0.05, h * 0.05, false);
  fig2.add(PathSegment.Line(w * 0.95, h * 0.05));
  fig2.add(PathSegment.Line(w * 0.95, h * 0.95));
  fig2.add(PathSegment.Line(w * 0.05, h * 0.95));
  fig2.add(PathSegment.Close());
  geo.add(fig2);
  return geo;
});
function getP1(shape: any, defaultVal: number): number {
  if (shape && shape.parameter1 !== undefined && !isNaN(shape.parameter1)) return shape.parameter1;
  return defaultVal;
}

function getP2(shape: any, defaultVal: number): number {
  if (shape && shape.parameter2 !== undefined && !isNaN(shape.parameter2)) return shape.parameter2;
  return defaultVal;
}
