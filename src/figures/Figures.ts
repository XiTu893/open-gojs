import { Geometry } from '../core/Geometry';
import { PathFigure } from '../core/PathFigure';
import { PathSegment } from '../core/PathSegment';
import { Map } from '../core/Map';

export const figures: Map<string, (shape: any, w: number, h: number) => Geometry> = new Map();

function defineFigure(name: string, func: (shape: any, w: number, h: number) => Geometry): void {
  figures.add(name, func);
}

export function getFigureGeometry(name: string, w: number, h: number, p1: number = NaN, p2: number = NaN, shape?: any): Geometry | null {
  const func = figures.get(name);
  if (!func) return null;
  return func(shape || null, w, h);
}

function getP1(shape: any, defaultVal: number): number {
  if (shape && shape.parameter1 !== undefined && !isNaN(shape.parameter1)) return shape.parameter1;
  return defaultVal;
}

function getP2(shape: any, defaultVal: number): number {
  if (shape && shape.parameter2 !== undefined && !isNaN(shape.parameter2)) return shape.parameter2;
  return defaultVal;
}

defineFigure('Rectangle', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('RoundedRectangle', (shape, w, h) => {
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
    fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, false));
  } else {
    fig.add(PathSegment.Line(w, 0));
  }
  fig.add(PathSegment.Line(w, br ? h - cr : h));
  if (br) {
    fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, false));
  } else {
    fig.add(PathSegment.Line(w, h));
  }
  fig.add(PathSegment.Line(bl ? cr : 0, h));
  if (bl) {
    fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, false));
  } else {
    fig.add(PathSegment.Line(0, h));
  }
  fig.add(PathSegment.Line(0, tl ? cr : 0));
  if (tl) {
    fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, false));
  } else {
    fig.add(PathSegment.Line(0, 0));
  }
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Ellipse', (shape, w, h) => {
  const geo = new Geometry();
  const rx = w / 2;
  const ry = h / 2;
  const fig = new PathFigure(w, ry);
  fig.add(PathSegment.Arc(0, ry, rx, ry, 0, false, false));
  fig.add(PathSegment.Arc(w, ry, rx, ry, 0, false, false));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Circle', (shape, w, h) => {
  const geo = new Geometry();
  const r = Math.min(w, h) / 2;
  const cx = w / 2;
  const cy = h / 2;
  const fig = new PathFigure(cx + r, cy);
  fig.add(PathSegment.Arc(cx - r, cy, r, r, 0, false, false));
  fig.add(PathSegment.Arc(cx + r, cy, r, r, 0, false, false));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Triangle', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0);
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('TriangleUp', (shape, w, h) => {
  return getFigureGeometry('Triangle', w, h, NaN, NaN, shape)!;
});

defineFigure('TriangleDown', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w / 2, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('TriangleLeft', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w, 0);
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('TriangleRight', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Diamond', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0);
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w / 2, h));
  fig.add(PathSegment.Line(0, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Pentagon', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0);
  fig.add(PathSegment.Line(w, h * 0.4));
  fig.add(PathSegment.Line(w * 0.8, h));
  fig.add(PathSegment.Line(w * 0.2, h));
  fig.add(PathSegment.Line(0, h * 0.4));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Hexagon', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w * 0.25, 0);
  fig.add(PathSegment.Line(w * 0.75, 0));
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w * 0.75, h));
  fig.add(PathSegment.Line(w * 0.25, h));
  fig.add(PathSegment.Line(0, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Octagon', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w * 0.3, 0);
  fig.add(PathSegment.Line(w * 0.7, 0));
  fig.add(PathSegment.Line(w, h * 0.3));
  fig.add(PathSegment.Line(w, h * 0.7));
  fig.add(PathSegment.Line(w * 0.7, h));
  fig.add(PathSegment.Line(w * 0.3, h));
  fig.add(PathSegment.Line(0, h * 0.7));
  fig.add(PathSegment.Line(0, h * 0.3));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Star', (shape, w, h) => {
  const geo = new Geometry();
  const cx = w / 2;
  const cy = h / 2;
  const outerR = Math.min(w, h) / 2;
  const innerR = getP1(shape, outerR * 0.4);
  const points = 5;
  const fig = new PathFigure(cx, cy - outerR);
  for (let i = 0; i < points; i++) {
    const outerAngle = (Math.PI * 2 * i) / points - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / points;
    if (i > 0) {
      fig.add(PathSegment.Line(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle)));
    }
    fig.add(PathSegment.Line(cx + innerR * Math.cos(innerAngle), cy + innerR * Math.sin(innerAngle)));
  }
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('LineH', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2, false);
  fig.add(PathSegment.Line(w, h / 2));
  geo.add(fig);
  return geo;
});

defineFigure('LineV', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0, false);
  fig.add(PathSegment.Line(w / 2, h));
  geo.add(fig);
  return geo;
});

defineFigure('Arrow', (shape, w, h) => {
  const geo = new Geometry();
  const shaftHeight = getP1(shape, h * 0.5);
  const fig = new PathFigure(0, (h - shaftHeight) / 2);
  fig.add(PathSegment.Line(w * 0.6, (h - shaftHeight) / 2));
  fig.add(PathSegment.Line(w * 0.6, 0));
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w * 0.6, h));
  fig.add(PathSegment.Line(w * 0.6, (h + shaftHeight) / 2));
  fig.add(PathSegment.Line(0, (h + shaftHeight) / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Chevron', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w * 0.7, 0));
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w * 0.7, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Line(w * 0.3, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Cloud', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w * 0.5, h * 0.1);
  fig.add(PathSegment.CubicBezier(w * 0.9, h * 0.05, w * 0.75, 0, w * 0.9, h * 0.1));
  fig.add(PathSegment.CubicBezier(w * 1.05, h * 0.5, w * 1.1, h * 0.25, w * 1.0, h * 0.45));
  fig.add(PathSegment.CubicBezier(w * 0.85, h * 0.95, w * 1.05, h * 0.75, w * 0.85, h * 0.9));
  fig.add(PathSegment.CubicBezier(w * 0.15, h * 0.95, w * 0.5, h * 1.05, w * 0.15, h * 0.9));
  fig.add(PathSegment.CubicBezier(w * -0.05, h * 0.5, w * -0.1, h * 0.75, w * 0.0, h * 0.55));
  fig.add(PathSegment.CubicBezier(w * 0.15, h * 0.05, w * -0.1, h * 0.25, w * 0.1, h * 0.1));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Cylinder1', (shape, w, h) => {
  const geo = new Geometry();
  const r = getP1(shape, Math.min(w / 2, h / 8));
  const fig = new PathFigure(w, r);
  fig.add(PathSegment.Line(w, h - r));
  fig.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, false));
  fig.add(PathSegment.Line(0, r));
  fig.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
  fig.add(PathSegment.Close());
  geo.add(fig);
  const fig2 = new PathFigure(0, r);
  fig2.add(PathSegment.Arc(w, r, w / 2, r, 0, false, false));
  fig2.add(PathSegment.Arc(0, r, w / 2, r, 0, false, true));
  fig2.add(PathSegment.Close());
  geo.add(fig2);
  return geo;
});

defineFigure('Trapezoid', (shape, w, h) => {
  const geo = new Geometry();
  const indent = getP1(shape, w * 0.2);
  const fig = new PathFigure(indent, 0);
  fig.add(PathSegment.Line(w - indent, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Parallelogram', (shape, w, h) => {
  const geo = new Geometry();
  const indent = getP1(shape, w * 0.2);
  const fig = new PathFigure(indent, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w - indent, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Cross', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w * 0.33, 0);
  fig.add(PathSegment.Line(w * 0.67, 0));
  fig.add(PathSegment.Line(w * 0.67, h * 0.33));
  fig.add(PathSegment.Line(w, h * 0.33));
  fig.add(PathSegment.Line(w, h * 0.67));
  fig.add(PathSegment.Line(w * 0.67, h * 0.67));
  fig.add(PathSegment.Line(w * 0.67, h));
  fig.add(PathSegment.Line(w * 0.33, h));
  fig.add(PathSegment.Line(w * 0.33, h * 0.67));
  fig.add(PathSegment.Line(0, h * 0.67));
  fig.add(PathSegment.Line(0, h * 0.33));
  fig.add(PathSegment.Line(w * 0.33, h * 0.33));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('MinusLine', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2, false);
  fig.add(PathSegment.Line(w, h / 2));
  geo.add(fig);
  return geo;
});

defineFigure('PlusLine', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0, false);
  fig.add(PathSegment.Line(w / 2, h));
  geo.add(fig);
  const fig2 = new PathFigure(0, h / 2, false);
  fig2.add(PathSegment.Line(w, h / 2));
  geo.add(fig2);
  return geo;
});

defineFigure('XLine', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0, false);
  fig.add(PathSegment.Line(w, h));
  geo.add(fig);
  const fig2 = new PathFigure(w, 0, false);
  fig2.add(PathSegment.Line(0, h));
  geo.add(fig2);
  return geo;
});

defineFigure('Square', (shape, w, h) => {
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
  return geo;
});

defineFigure('Bar', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('HalfEllipse', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2);
  fig.add(PathSegment.Arc(w, h / 2, w / 2, h / 2, 0, false, false));
  fig.add(PathSegment.Line(0, h / 2));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Capsule', (shape, w, h) => {
  const geo = new Geometry();
  const r = Math.min(w, h) / 2;
  const fig = new PathFigure(r, 0);
  fig.add(PathSegment.Line(w - r, 0));
  fig.add(PathSegment.Arc(w, r, r, r, 0, false, false));
  fig.add(PathSegment.Line(w, h - r));
  fig.add(PathSegment.Arc(w - r, h, r, r, 0, false, false));
  fig.add(PathSegment.Line(r, h));
  fig.add(PathSegment.Arc(0, h - r, r, r, 0, false, false));
  fig.add(PathSegment.Line(0, r));
  fig.add(PathSegment.Arc(r, 0, r, r, 0, false, false));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('RightTriangle', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('File', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w * 0.7, 0));
  fig.add(PathSegment.Line(w, h * 0.3));
  fig.add(PathSegment.Line(w, h));
  fig.add(PathSegment.Line(0, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  const fig2 = new PathFigure(w * 0.7, 0, false);
  fig2.add(PathSegment.Line(w * 0.7, h * 0.3));
  fig2.add(PathSegment.Line(w, h * 0.3));
  geo.add(fig2);
  return geo;
});

defineFigure('Kite', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w / 2, 0);
  fig.add(PathSegment.Line(w, h * 0.4));
  fig.add(PathSegment.Line(w / 2, h));
  fig.add(PathSegment.Line(0, h * 0.4));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Document', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h * 0.85));
  fig.add(PathSegment.CubicBezier(w * 0.5, h * 0.65, w * 0.65, h, w * 0.5, h));
  fig.add(PathSegment.CubicBezier(w * 0.35, h, 0, h * 0.85, 0, h * 0.85));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('Shield', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, 0);
  fig.add(PathSegment.Line(w, 0));
  fig.add(PathSegment.Line(w, h * 0.5));
  fig.add(PathSegment.CubicBezier(w, h * 0.8, w * 0.5, h, w * 0.5, h));
  fig.add(PathSegment.CubicBezier(w * 0.5, h, 0, h * 0.8, 0, h * 0.5));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('DoubleArrow', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(0, h / 2);
  fig.add(PathSegment.Line(w * 0.25, 0));
  fig.add(PathSegment.Line(w * 0.5, h * 0.25));
  fig.add(PathSegment.Line(w * 0.75, 0));
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w * 0.75, h));
  fig.add(PathSegment.Line(w * 0.5, h * 0.75));
  fig.add(PathSegment.Line(w * 0.25, h));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});

defineFigure('ThinArrow', (shape, w, h) => {
  const geo = new Geometry();
  const fig = new PathFigure(w * 0.5, 0);
  fig.add(PathSegment.Line(w, h / 2));
  fig.add(PathSegment.Line(w * 0.5, h));
  fig.add(PathSegment.Line(w * 0.5, h * 0.65));
  fig.add(PathSegment.Line(0, h * 0.65));
  fig.add(PathSegment.Line(0, h * 0.35));
  fig.add(PathSegment.Line(w * 0.5, h * 0.35));
  fig.add(PathSegment.Close());
  geo.add(fig);
  return geo;
});
