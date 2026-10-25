import { Node } from './Node';
import { Part } from './Part';
import { Point } from '../core/Point';
import { Set } from '../core/Set';
import { Iterator } from '../core/Iterable';
import type { Placeholder } from './Placeholder';
import { Layout } from '../layout/Layout';
export declare class Group extends Node {
    static readonly className: string;
    protected _handlesDragDrop: boolean;
    private _memberParts;
    protected _ungroupable: boolean;
    private _layout;
    private _ga;
    private _computesBoundsAfterDrag;
    private _computesBoundsIncludingLinks;
    private _computesBoundsIncludingLocation;
    private _handlesDragDropForMembers;
    private _avoidableMembers;
    private _wasSubGraphExpanded;
    private _memberAdded;
    private _memberRemoved;
    private _memberValidation;
    private _subGraphExpandedChanged;
    /** 官方 `Diagram.isCollapsingExpanding` 的重入保护（本项目 Diagram 尚无该标志，用静态位替代） */
    private static _isCollapsingExpanding;
    constructor(type?: any, init?: any);
    get handlesDragDrop(): boolean;
    set handlesDragDrop(val: boolean);
    get placeholder(): Placeholder | null;
    get memberParts(): Set<Part>;
    get ungroupable(): boolean;
    set ungroupable(val: boolean);
    /**
     * 官方 Group.computesBoundsAfterDrag：默认 false。
     * 为 true 时成员拖动后才计算组的边界（避免拖动过程中反复重算）。
     */
    get computesBoundsAfterDrag(): boolean;
    set computesBoundsAfterDrag(val: boolean);
    /** 官方 Group.computesBoundsIncludingLinks：默认 true，边界计算是否包含内部 Link。 */
    get computesBoundsIncludingLinks(): boolean;
    set computesBoundsIncludingLinks(val: boolean);
    /** 官方 Group.computesBoundsIncludingLocation：默认 false，是否把自身 location 计入边界。 */
    get computesBoundsIncludingLocation(): boolean;
    set computesBoundsIncludingLocation(val: boolean);
    get layout(): Layout | null;
    set layout(val: Layout | null);
    /** 官方 Group 的 Ga 标志：diagram 布局前递归组布局将其置位，diagram 布局收集后清除。 */
    get Ga(): boolean;
    set Ga(val: boolean);
    /** 官方 `Group.handlesDragDropForMembers`（默认 false） */
    get handlesDragDropForMembers(): boolean;
    set handlesDragDropForMembers(val: boolean);
    /** 官方 `Group.avoidableMembers`（默认 false，成员是否参与连线避让） */
    get avoidableMembers(): boolean;
    set avoidableMembers(val: boolean);
    /** 官方 `Group.memberAdded`（默认 null） */
    get memberAdded(): ((thisGroup: Group, newPart: Part) => void) | null;
    set memberAdded(val: ((thisGroup: Group, newPart: Part) => void) | null);
    /** 官方 `Group.memberRemoved`（默认 null） */
    get memberRemoved(): ((thisGroup: Group, oldPart: Part) => void) | null;
    set memberRemoved(val: ((thisGroup: Group, oldPart: Part) => void) | null);
    /** 官方 `Group.memberValidation`（默认 null，决定某 Part 能否成为本组成员） */
    get memberValidation(): ((thisGroup: Group | null, part: Part) => boolean) | null;
    set memberValidation(val: ((thisGroup: Group | null, part: Part) => boolean) | null);
    /** 官方 `Group.subGraphExpandedChanged`（默认 null） */
    get subGraphExpandedChanged(): ((thisGroup: Group) => void) | null;
    set subGraphExpandedChanged(val: ((thisGroup: Group) => void) | null);
    /** 官方 `Group.wasSubGraphExpanded`（默认 false，折叠前是否展开） */
    get wasSubGraphExpanded(): boolean;
    set wasSubGraphExpanded(val: boolean);
    /** 内部：memberAdded / memberRemoved 回调（官方由 `Group.WN` / `Group.vN` 调用） */
    _notifyMemberAdded(part: Part): void;
    /** 内部：见 `_notifyMemberAdded` */
    _notifyMemberRemoved(part: Part): void;
    /** 官方 `Group.canAddMembers(coll)` */
    canAddMembers(coll: any): boolean;
    /** 官方 `Group.canUngroup()` */
    canUngroup(): boolean;
    /**
     * 官方 `Group.findSubGraphParts()`：本组（含嵌套组）的全部成员 Node/Link 与标签节点，不含本组自身。
     */
    findSubGraphParts(): Set<Part>;
    /** 官方 `Group.findExternalLinksConnected()` */
    findExternalLinksConnected(): Iterator<any>;
    /** 官方 `Group.findExternalNodesConnected()` */
    findExternalNodesConnected(): Iterator<any>;
    /** 官方 `Group.collapseSubGraph()` */
    collapseSubGraph(): void;
    /** 官方 `Group.expandSubGraph()` */
    expandSubGraph(): void;
    /** 官方 `Group.eR` / `Group.sR`：隐藏/显示成员并递归处理嵌套组 */
    private _subGraphStep;
    addMembers(collection: any, check?: boolean): boolean;
    removeMembers(collection: any, check?: boolean): boolean;
    move(newLoc: Point, isLocation?: boolean): void;
    copy(): Group;
}
