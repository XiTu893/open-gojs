import { Part } from './Part';
import { GraphObject } from './GraphObject';
/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
export declare class Adornment extends Part {
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
    hasPlaceholder(): boolean;
    copy(): Adornment;
}
