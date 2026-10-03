import { Point } from '../core/Point';
/**
 * 官方 `LinkInfo`：端口 Knot 中一条 side-spot 连线的路由信息。
 * 字段名与 go-debug.js 官方源码一致（as/jt/ye/HS/Cg/ru/yc/KS）。
 */
export declare class LinkInfo {
    /** 所属 Link（官方 `as`） */
    as: any;
    /** 排序角（官方 `jt`，度，已按侧规范化） */
    jt: number;
    /** 侧码（官方 `ye`：1=上,2=左,4=右,8=下） */
    ye: number;
    /** 对端点（官方 `HS`，computeOtherPoint 结果快照） */
    HS: Point;
    /** 同侧正序索引（官方 `Cg`） */
    Cg: number;
    /** 同侧总数（官方 `ru`） */
    ru: number;
    /** 本端 knot 位置（官方 `yc`，即 side-spot 端点） */
    yc: Point;
    /** 本端 endSegmentLength（官方 `KS`） */
    KS: number;
    constructor(link: any, jt: number, ye: number);
}
/**
 * 官方 `Knot`：挂在端口（GraphObject）上的缓存，管理所有以该端口为 side-spot
 * 端点的连线的端点位置（yc）、方向（ye）、同侧排序（Cg/ru）与 endSegmentLength（KS）。
 * 官方存储于 `port.Vd`；本项目存于 `GraphObject._knot`。
 */
export declare class Knot {
    /** 所属 Part（Node），官方 `Ye` */
    private _part;
    /** 端口（GraphObject），官方 `Gs` */
    private _port;
    /** LinkInfo 数组，官方 `We` */
    private _infos;
    /** 构建重入保护，官方 `Mg` */
    private _building;
    constructor(part: any, port: any);
    /** 官方 `Knot.gg()`：清空缓存（失效） */
    gg(): void;
    /** 官方 `Knot.$F(link)`：取该连线在此端口的 LinkInfo（必要时先构建） */
    $F(link: any): LinkInfo | null;
    /** 官方 `Knot.P4(rect, spot, angle, orthogonal)`：side-spot 落到哪条边 */
    private P4;
    /** 端口 → 文档坐标下的 spot 点（官方 `GraphObject.getDocumentPoint(spot, result)` 等价） */
    private _docPoint;
    /** 官方 `Knot.M4()`：构建 LinkInfo 列表 */
    private M4;
    /** 官方 `Knot.T4(t, i)` 比较器（侧码 ye → 排序角 jt） */
    private T4;
    /** 官方 `Knot.C4()`：按 (ye, jt) 排序 */
    private C4;
    /** 官方 `Knot.N4(list)`：按端口 spreading 计算每条 LinkInfo 的端点位置 yc */
    private N4;
    /** 官方 `Knot.A4(list)`：计算每条 LinkInfo 的 endSegmentLength */
    private A4;
    /** 官方 `Knot.L4(t, i)` */
    private L4;
}
