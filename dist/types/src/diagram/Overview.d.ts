import { Diagram } from './Diagram';
import { Rect } from '../core/Rect';
export declare class Overview {
    static readonly className: string;
    static _dbg: boolean;
    private _diagram;
    private _observedDiagram;
    private _box;
    private _isViewportSized;
    private _canvas;
    private _isDragging;
    private _dragStart;
    private _observedPositionAtDragStart;
    private _viewportChangedListener;
    private _observedModelChangedListener;
    private _observedDiagramChangedListener;
    private _observedLayoutListener;
    private _boundModel;
    /**
     * 官方 `Overview(div?, init?)`：第一参可为 div 或 init 对象；
     * 默认 box 为带 BOXSHAPE 的 Part（官方 Overview ctor 同款）。
     */
    constructor(divOrOptions?: string | HTMLDivElement | Record<string, any>, options?: Record<string, any>);
    /** 官方 Overview 为 Diagram 子类，div 可读（如 `overview.div.style`） */
    get div(): string | HTMLDivElement | null;
    /** 官方 Overview 为 Diagram 子类，add/remove 作用于其内部图纸 */
    add(part: any): any;
    remove(part: any): void;
    get diagram(): Diagram;
    get observedDiagram(): Diagram | null;
    /** 官方属性名就是 `Overview.observed` */
    get observed(): Diagram | null;
    set observed(val: Diagram | null);
    set observedDiagram(val: Diagram | null);
    get box(): any;
    set box(val: any);
    get isViewportSized(): boolean;
    set isViewportSized(val: boolean);
    update(): void;
    /**
     * 官方 Overview（Diagram 子类）直接渲染 observed 的部件；
     * 本项目让内部图纸共享 observed 的 model + 模板自建同位置部件。
     * 模板可能在 observed 设置之后才赋值，故每次 update 都同步。
     */
    private _syncInnerFromObserved;
    /** 抄回 observed 部件位置（内部部件由共享 model 重建，需与 observed 对齐） */
    private _copyObservedPositions;
    drawOverview(): void;
    drawBox(): void;
    computeBounds(): Rect;
    copy(): Overview;
    private _setupOverview;
    private _drawViewportBox;
    private _onMouseDown;
    private _onMouseMove;
    private _onMouseUp;
    private _addListeners;
    private _removeListeners;
}
