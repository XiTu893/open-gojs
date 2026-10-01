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
export declare function computePathPoints(geo: Geometry): PathPoint[];
/** 按折线总长的 fraction（0..1）插值出点与方向角。 */
export declare function interpolatePath(points: PathPoint[], fraction: number): PathPoint;
/** `interpolatePath` 的逆：求点在折线上所处的弧长比例（0..1）。 */
export declare function fractionAlongPath(points: PathPoint[], x: number, y: number): number;
