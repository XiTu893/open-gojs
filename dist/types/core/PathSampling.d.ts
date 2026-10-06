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
export declare function computePathPoints(geo: Geometry): PathPoint[];
/** 按折线总长的 fraction（0..1）插值出点与方向角。 */
export declare function interpolatePath(points: PathPoint[], fraction: number): PathPoint;
/** `interpolatePath` 的逆：求点在折线上所处的弧长比例（0..1）。 */
export declare function fractionAlongPath(points: PathPoint[], x: number, y: number): number;
