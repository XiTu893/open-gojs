/**
 * CommandHandler - handles keyboard and programmatic commands for a Diagram.
 * Provides canXxx() and doXxx() methods for each supported command.
 */
import { Point } from '../core/Point';
import { Map } from '../core/Map';
import { InputEvent } from '../diagram/InputEvent';
export declare class CommandHandler {
    static readonly className: string;
    private _diagram;
    private _isEnabled;
    private static _clipboard;
    /** 官方 `Diagram.Tb`：剪贴板内容对应的 model.dataFormat（paste 前要核对） */
    private static _clipboardFormat;
    get diagram(): any;
    set diagram(val: any);
    get isEnabled(): boolean;
    set isEnabled(val: boolean);
    canDeleteSelection(): boolean;
    deleteSelection(): void;
    canCopy(): boolean;
    copySelection(): void;
    canCut(): boolean;
    cutSelection(): void;
    canPaste(): boolean;
    pasteSelection(): void;
    canUndo(): boolean;
    undo(): void;
    canRedo(): boolean;
    redo(): void;
    canSelectAll(): boolean;
    selectAll(): void;
    canZoomToFit(): boolean;
    zoomToFit(): void;
    canZoomIn(): boolean;
    zoomIn(): void;
    canZoomOut(): boolean;
    zoomOut(): void;
    /**
     * 官方 `model.Dh()`：GraphLinksModel 支持组/链接结构（基类 Model 与 TreeModel 返回 false）。
     * canGroup/canUngroup 以此为门。model 实例没有 `_className` 字段（那是 GraphObject 家族的），
     * 走 constructor 上的 static className。
     */
    private _modelSupportsGroups;
    canGroupSelection(): boolean;
    groupSelection(): void;
    canUngroupSelection(part?: any): boolean;
    ungroupSelection(): void;
    /**
     * 官方 `canEditTextBlock(t=null)`：
     * `isReadOnly||isModelReadOnly||!allowTextEdit||!toolManager.findTool("TextEditing") → false`；
     * t 指定时须为 TextBlock 且其 Part.canEdit()；否则选中任一 Part canEdit 且
     * findInVisualTree 内存在 editable TextBlock。
     */
    canEditTextBlock(part?: any): boolean;
    canCollapseSubGraph(group?: any): boolean;
    collapseSubGraph(group?: any): void;
    canExpandSubGraph(group?: any): boolean;
    expandSubGraph(group?: any): void;
    canCollapseTree(node?: any): boolean;
    collapseTree(node?: any): void;
    canExpandTree(node?: any): boolean;
    expandTree(node?: any): void;
    canAlignSelection(): boolean;
    alignSelection(alignment: string): void;
    canRotate(): boolean;
    rotate(angle: number): void;
    canBringToFront(): boolean;
    bringToFront(): void;
    canSendToBack(): boolean;
    sendToBack(): void;
    canMoveSelection(): boolean;
    moveSelection(dx: number, dy: number): void;
    doKeyDown(): void;
    private _memberValidation;
    /** 官方 `CommandHandler.memberValidation`（默认 null） */
    get memberValidation(): ((group: any, part: any) => boolean) | null;
    set memberValidation(val: ((group: any, part: any) => boolean) | null);
    /**
     * 官方 `CommandHandler.isValidMember(group, part)`。
     * group 为 null 时跳过 group 侧校验（Node.isValidMember/GraphLinksModel.isValidLink 同源语义）。
     */
    isValidMember(group: any, part: any): boolean;
    private static _modifierNames;
    static getModifierNames(): Array<string>;
    static setModifierNames(names: Array<string>): void;
    private _copiesConnectedLinks;
    private _deletesConnectedLinks;
    private _copiesTree;
    private _deletesTree;
    private _copiesParentKey;
    private _copiesGroupKey;
    private _copiesClipboardData;
    private _storageLocation;
    private _archetypeGroupData;
    private _zoomFactor;
    private _isZoomToFitRestoreEnabled;
    private _defaultScale;
    get copiesConnectedLinks(): boolean;
    set copiesConnectedLinks(val: boolean);
    get deletesConnectedLinks(): boolean;
    set deletesConnectedLinks(val: boolean);
    get copiesTree(): boolean;
    set copiesTree(val: boolean);
    get deletesTree(): boolean;
    set deletesTree(val: boolean);
    get copiesParentKey(): boolean;
    set copiesParentKey(val: boolean);
    get copiesGroupKey(): boolean;
    set copiesGroupKey(val: boolean);
    get copiesClipboardData(): boolean;
    set copiesClipboardData(val: boolean);
    get storageLocation(): 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard';
    set storageLocation(val: 'memory' | 'sessionStorage' | 'localStorage' | 'systemClipboard');
    get archetypeGroupData(): any;
    set archetypeGroupData(val: any);
    get zoomFactor(): number;
    set zoomFactor(val: number);
    get isZoomToFitRestoreEnabled(): boolean;
    set isZoomToFitRestoreEnabled(val: boolean);
    get defaultScale(): number;
    set defaultScale(val: number);
    doStart(): void;
    doStop(): void;
    canCopySelection(): boolean;
    canCutSelection(): boolean;
    canPasteSelection(pos?: Point): boolean;
    pasteSelectionAsync(pos?: Point): void;
    /**
     * 计算给定 Part 集合中实际要移动/拷贝的集合。
     * 返回 Map<Part, {point}>。这里复用 Diagram 的连通/组内/树扩展能力（若存在），否则退化为原集合。
     */
    computeEffectiveCollection(parts: Iterable<any>, options?: any): Map<any, any>;
    copyToClipboard(coll: any): void;
    pasteFromClipboard(): any;
    canDecreaseZoom(factor?: number): boolean;
    decreaseZoom(factor?: number): void;
    canIncreaseZoom(factor?: number): boolean;
    increaseZoom(factor?: number): void;
    canResetZoom(newscale?: number): boolean;
    resetZoom(newscale?: number): void;
    /** 官方 `canScrollToPart(t=null)`：t 非 Part → false；无选中且无高亮 → false；否则看横纵滚动许可 */
    canScrollToPart(part?: any): boolean;
    private _scrollToPartPause;
    get scrollToPartPause(): number;
    set scrollToPartPause(val: number);
    scrollToPart(part?: any): void;
    editTextBlock(textblock?: any): void;
    canShowContextMenu(obj?: any): boolean;
    showContextMenu(obj?: any): void;
    canStopCommand(): boolean;
    stopCommand(): void;
    canDownloadSvg(options?: any): boolean;
    downloadSVG(options?: any): void;
    downloadSvg(options?: any): void;
    private _downloadData;
    addTopLevelParts(coll: any, check?: boolean): boolean;
    toString(): string;
    private _isFocusEnabled;
    private _focusBox;
    private _focus;
    private _focusChanged;
    private _liveElementId;
    private _isUsingAriaLive;
    private _isVirtualPointerEnabled;
    private _isVirtualPointerShown;
    private _virtualPointerBox;
    private _virtualPointerChanged;
    private _virtualPointerLocation;
    private _isVirtualPointerDown;
    private _virtualPointerShiftMove;
    private _virtualPointerControlMove;
    private _nextFocusFormula;
    get isFocusEnabled(): boolean;
    set isFocusEnabled(enabled: boolean);
    get focusBox(): any;
    set focusBox(adornment: any);
    get focus(): any;
    set focus(obj: any);
    get focusChanged(): ((oldobj: any, newobj: any, cmd: any) => void) | null;
    set focusChanged(value: ((oldobj: any, newobj: any, cmd: any) => void) | null);
    get liveElementId(): string;
    set liveElementId(val: string);
    get isUsingAriaLive(): boolean;
    set isUsingAriaLive(val: boolean);
    onFocusChanged(oldobj: any, newobj: any): void;
    private static _liveCounter;
    describe(oldobj: any, newobj: any): string;
    updateFocusBox(): void;
    findFirstFocus(): any;
    findNextFocus(dir: number): any;
    get nextFocusFormula(): string;
    set nextFocusFormula(val: string);
    get isVirtualPointerEnabled(): boolean;
    set isVirtualPointerEnabled(enabled: boolean);
    get isVirtualPointerShown(): boolean;
    set isVirtualPointerShown(value: boolean);
    get isVirtualPointerDown(): boolean;
    set isVirtualPointerDown(value: boolean);
    get virtualPointerLocation(): Point;
    set virtualPointerLocation(pt: Point);
    get virtualPointerBox(): any;
    set virtualPointerBox(part: any);
    get virtualPointerChanged(): ((box: any, cmd: any) => void) | null;
    set virtualPointerChanged(value: ((box: any, cmd: any) => void) | null);
    get virtualPointerShiftMove(): number;
    set virtualPointerShiftMove(value: number);
    get virtualPointerControlMove(): number;
    set virtualPointerControlMove(value: number);
    cancelVirtualPointer(): void;
    updateVirtualPointer(): void;
    doVirtualPointerEvent(e: InputEvent, act: boolean): void;
    protected onVirtualPointerEvent(e: InputEvent, act: boolean): void;
    doVirtualFocusKeyDown(): boolean;
    doVirtualFocusKeyUp(): boolean;
    doKeyUp(): void;
}
