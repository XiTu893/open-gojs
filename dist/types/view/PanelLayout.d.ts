import { GraphObject } from './GraphObject';
import { Rect } from '../core/Rect';
/**
 * PanelLayout - 官方 go.d.ts:921309 的抽象基类。
 *
 * 官方 `Panel` / `Part` / `Node` / `Group` / `Adornment` 的构造签名都是
 * `constructor(type?: PanelLayout | string, init?)`：第一个参数既可以是内置面板类型名
 * （`'Auto'` / `'Table'` …），也可以是一个 **PanelLayout 实例**（自定义面板布局）。
 *
 * 本项目以前只支持字符串/EnumValue，落到 else 分支被当成 `init`，
 * 于是扩展 `PanelLayoutFlow.js` 里的 `class PanelLayoutFlow extends go.PanelLayout`
 * 直接抛 `Class extends value undefined is not a constructor`（实测 PanelLayoutFlow）。
 */
export declare class PanelLayout {
    static readonly className: string;
    private _name;
    get name(): string;
    set name(value: string);
    constructor(init?: Record<string, any>);
    /**
     * 官方：`measure(panel, width, height, elements, union, minw, minh): void`
     * 子类必须对每个元素调 `measureElement`，并把预期并集写进 `union`。
     */
    measure(_panel: any, _width: number, _height: number, _elements: GraphObject[], union: Rect, _minw: number, _minh: number): void;
    /** 官方 `PanelLayout.measureElement(obj, width, height, minw, minh)`：设 obj.measuredBounds */
    measureElement(obj: GraphObject, width: number, height: number, minw: number, minh: number): void;
    /** 官方：`arrange(panel, elements, union): void` */
    arrange(_panel: any, _elements: GraphObject[], _union: Rect): void;
    /** 官方 `PanelLayout.arrangeElement(obj, x, y, width, height, clipRect?)`：设 obj.actualBounds */
    arrangeElement(obj: GraphObject, x: number, y: number, width: number, height: number, clipRect?: Rect): void;
    /** 官方 `PanelLayout.remeasureObject(obj)`：改动元素属性前调用，避免上层重新测量 */
    remeasureObject(obj: GraphObject): void;
}
