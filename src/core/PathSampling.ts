import type { Geometry } from './Geometry';

/**
 * 折线采样工具（内部，非官方公开 API）。
 *
 * 官方的 `Geometry.getPointAlongPath` / `getFractionForPoint` 建立在
 * `flattenedSegments` / `flattenedLengths` / `flattenedTotalLength` 之上，
 * 本项目直接复用 `Geometry.flattenedSegments` 缓存保证同源。
 *
 * `CanvasRenderer` 的 graduated 绘制与 `Panel.graduatedPointForValue` 共用这里的实现。
 */
export interface PathPoint {
  x: number;
  y: number;
  /** 到达该点的线段方向角（0..360） */
  angle: number;
  /** 到达该点的线段长度；新 figure 的首点为 0（避免跨 figure 幽灵线段计入弧长） */
  len: number;
}

/** 把 Geometry 拍平成一串折线点（每点带到达该点的线段方向角，0..360）。 */
export function computePathPoints(geo: Geometry): PathPoint[] {
  const points: PathPoint[] = [];
  // 用 Geometry 的扁平化缓存（与官方 flattenedSegments/Lengths 同源）：
  // 直接遍历 figures/segments 会把 AngleArc 当成一条直线段（表盘指针
  // 角度 318° vs 官方 229.5° 的根因），也不会对曲线采样。
  const segs = geo.flattenedSegments;
  const lens = geo.flattenedLengths;
  for (let f = 0; f < segs.length; f++) {
    const pts = segs[f];
    if (pts.length < 4) continue;
    const lengths = lens[f];
    for (let i = 0; i < lengths.length; i++) {
      const x0 = pts[i * 2];
      const y0 = pts[i * 2 + 1];
      const x1 = pts[i * 2 + 2];
      const y1 = pts[i * 2 + 3];
      if (i === 0) points.push({ x: x0, y: y0, angle: 0, len: 0 });
      let angle = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
      if (angle < 0) angle += 360;
      points.push({ x: x1, y: y1, angle, len: lengths[i] });
    }
  }
  return points;
}

/** 按折线总长的 fraction（0..1）插值出点与方向角。 */
export function interpolatePath(points: PathPoint[], fraction: number): PathPoint {
  if (points.length === 0) return { x: 0, y: 0, angle: 0, len: 0 };
  if (points.length === 1) return { x: points[0].x, y: points[0].y, angle: 0, len: 0 };

  let totalLen = 0;
  for (let i = 1; i < points.length; i++) totalLen += points[i].len;
  if (totalLen === 0) return { x: points[0].x, y: points[0].y, angle: 0, len: 0 };

  const targetLen = fraction * totalLen;
  let accum = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = points[i].len;
    if (segLen === 0) continue; // 跨 figure 断点
    if (accum + segLen >= targetLen || (i === points.length - 1 && accum < targetLen)) {
      const segFrac = (targetLen - accum) / segLen;
      const t = Math.max(0, Math.min(1, segFrac));
      const prev = points[i - 1];
      const cur = points[i];
      return {
        x: prev.x + (cur.x - prev.x) * t,
        y: prev.y + (cur.y - prev.y) * t,
        angle: cur.angle,
        len: segLen * t
      };
    }
    accum += segLen;
  }
  const last = points[points.length - 1];
  return { x: last.x, y: last.y, angle: last.angle, len: 0 };
}

/** `interpolatePath` 的逆：求点在折线上所处的弧长比例（0..1）。 */
export function fractionAlongPath(points: PathPoint[], x: number, y: number): number {
  if (points.length < 2) return 0;
  let totalLen = 0;
  for (let i = 1; i < points.length; i++) totalLen += points[i].len;
  if (totalLen === 0) return 0;

  // 取每个线段上「垂足」的投影长度；若垂足落在线段外则按最近端点算。
  let bestLen = 0;
  let bestDist = Infinity;
  let accum = 0;
  for (let i = 1; i < points.length; i++) {
    const segLen = points[i].len;
    const prev = points[i - 1];
    const cur = points[i];
    if (segLen > 0) {
      const dx = cur.x - prev.x;
      const dy = cur.y - prev.y;
      let t = ((x - prev.x) * dx + (y - prev.y) * dy) / (segLen * segLen);
      t = Math.max(0, Math.min(1, t));
      const px = prev.x + dx * t;
      const py = prev.y + dy * t;
      const dist = (px - x) * (px - x) + (py - y) * (py - y);
      if (dist < bestDist) {
        bestDist = dist;
        bestLen = accum + segLen * t;
      }
      accum += segLen;
    }
  }
  return bestLen / totalLen;
}
