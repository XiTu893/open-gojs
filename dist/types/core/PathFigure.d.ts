import { PathSegment } from './PathSegment';
import { List } from './List';
/**
 * PathFigure - 路径图形（起点 + 段集合）
 */
export declare class PathFigure {
    /** 起点 X */
    startX: number;
    /** 起点 Y */
    startY: number;
    /** 是否闭合 */
    isFilled: boolean;
    /** 是否描边 */
    isShadowed: boolean;
    /** 段集合 */
    private _segments;
    constructor(startX?: number, startY?: number, isFilled?: boolean);
    /** 获取段集合 */
    get segments(): List<PathSegment>;
    /** 添加段 */
    add(seg: PathSegment): this;
    /** 移除段 */
    remove(seg: PathSegment): boolean;
    /** 清空段 */
    clear(): this;
    copy(): PathFigure;
    equals(fig: PathFigure): boolean;
}
