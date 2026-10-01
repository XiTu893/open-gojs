import { Part } from './Part';
import { GraphObject } from './GraphObject';
import type { Placeholder } from './Placeholder';
/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
export declare class Adornment extends Part {
    static readonly className: string;
    /** 被装饰的 GraphObject */
    private _adornedObject;
    /** 装饰类别 */
    private _adornmentCategory;
    constructor();
    constructor(type: any);
    constructor(type: any, init?: any);
    get adornedObject(): GraphObject | null;
    set adornedObject(val: GraphObject | null);
    get adornedPart(): Part | null;
    get adornedElement(): GraphObject | null;
    get category(): string;
    set category(val: string);
    /** 是否为占位装饰 */
    get isPlaceholder(): boolean;
    /**
     * 官方 `Adornment.placeholder`：本 Adornment 面板树中第一个 Placeholder。
     * 官方缓存在内部字段（`vt`），本项目按需递归查找。
     */
    get placeholder(): Placeholder | null;
    private static _findPlaceholder;
    hasPlaceholder(): boolean;
    copy(): Adornment;
}
