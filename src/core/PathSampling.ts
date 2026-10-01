import type { Geometry } from './Geometry';

/**
 * 折线采样工具（内部，非官方公开 API）。
 *
 * 官方的 `Geometry.getPointAlongPath` / `getFractionForPoint` 建立在
 * `flattenedSegments` / `flattenedLengths` / `flattenedTotalLength` 之上；
 * 本项目 Geometry 还没有那套扁平化缓存（阶段 5），因此这里用等价的
 * 「把所有 PathFigure 拍平成折线，再按弧长插值」的方式提供同样能力。
 *
 * `CanvasRenderer` 的 graduated 绘制与 `Panel.graduatedPointForValue` 共用这里的实现。
 */
export interface PathPoint {
  x: number;
  y: number;
  angle: number;
}

/** 把 Geometry 的所有 figure 拍平成一串折线点（每点带指向它的线段方向角）。 */
export function computePathPoints(geo: Geometry): PathPoint[] {
  const points: PathPoint[] = [];
  const it = geo.figures.iterator;
  while (it.next()) {
    const fig = it.value;
    let prevX = fig.startX;
    let prevY = fig.startY;
    points.push({ x: prevX, y: prevY, angle: 0 });

    const segIt = fig.segments.iterator;
    while (segIt.next()) {
      const seg = segIt.value;
      const segName = seg.type._name;
      if (segName === 'Close') continue;
      const endX = seg.endX;
      const endY = seg.endY;
      const angle = Math.atan2(endY - prevY, endX - prevX) * 180 / Math.PI;
      points.push({ x: endX, y: endY, angle: angle });
      prevX = endX;
      prevY = endY;
    }
  }
  return points;
}

/** 按折线总长的 fraction（0..1）插值出点与方向角。 */
export function interpolatePath(points: PathPoint[], fraction: number): PathPoint {
  if (points.length === 0) return { x: 0, y: 0, angle: 0 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y, angle: 0 };

  let totalLen = 0;
  const segLens: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segLens.push(len);
    totalLen += len;
  }
  if (totalLen === 0) return { x: points[0].x, y: points[0].y, angle: 0 };

  const targetLen = fraction * totalLen;
  let accum = 0;
  for (let i = 0; i < segLens.length; i++) {
    if (accum + segLens[i] >= targetLen || i === segLens.length - 1) {
      const segFrac = segLens[i] > 0 ? (targetLen - accum) / segLens[i] : 0;
      const clampedFrac = Math.max(0, Math.min(1, segFrac));
      const x = points[i].x + (points[i + 1].x - points[i].x) * clampedFrac;
      const y = points[i].y + (points[i + 1].y - points[i].y) * clampedFrac;
      const angle = points[i + 1].angle;
      return { x, y, angle };
    }
    accum += segLens[i];
  }
  const last = points[points.length - 1];
  return { x: last.x, y: last.y, angle: last.angle };
}

/** `interpolatePath` 的逆：求点在折线上所处的弧长比例（0..1）。 */
export function fractionAlongPath(points: PathPoint[], x: number, y: number): number {
  if (points.length < 2) return 0;
  let totalLen = 0;
  const segLens: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const len = Math.sqrt(dx * dx + dy * dy);
    segLens.push(len);
    totalLen += len;
  }
  if (totalLen === 0) return 0;

  // 取每个线段上「垂足」的投影长度；若垂足落在线段外则按最近端点算。
  let bestLen = 0;
  let bestDist = Infinity;
  let accum = 0;
  for (let i = 0; i < segLens.length; i++) {
    const ax = points[i].x;
    const ay = points[i].y;
    const bx = points[i + 1].x;
    const by = points[i + 1].y;
    const dx = bx - ax;
    const dy = by - ay;
    const segLen = segLens[i];
    let t = segLen > 0 ? ((x - ax) * dx + (y - ay) * dy) / (segLen * segLen) : 0;
    t = Math.max(0, Math.min(1, t));
    const px = ax + dx * t;
    const py = ay + dy * t;
    const dist = (px - x) * (px - x) + (py - y) * (py - y);
    if (dist < bestDist) {
      bestDist = dist;
      bestLen = accum + segLen * t;
    }
    accum += segLen;
  }
  return bestLen / totalLen;
}
