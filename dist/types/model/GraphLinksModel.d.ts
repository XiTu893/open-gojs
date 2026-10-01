import { Model, ObjectData } from './Model';
import { List } from '../core/List';
/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
export declare class GraphLinksModel extends Model {
    static readonly className: string;
    /** 链接 from 属性名 */
    linkFromKeyProperty: string;
    /** 链接 to 属性名 */
    linkToKeyProperty: string;
    /** 链接 fromPort 属性名 */
    linkFromPortIdProperty: string;
    /** 链接 toPort 属性名 */
    linkToPortIdProperty: string;
    /** 链接分类属性名 */
    linkCategoryProperty: string;
    /** 链接点数据属性名 */
    linkKeyProperty: string;
    /** 是否自动创建缺失的节点 */
    createMissingNodeData: boolean;
    private _linkDataArray;
    private _linkKeyMap;
    private _nextLinkKey;
    constructor();
    constructor(init: Partial<GraphLinksModel> | ObjectData[], linkDataArray?: ObjectData[]);
    get linkDataArray(): ObjectData[];
    set linkDataArray(val: ObjectData[]);
    /**
     * 官方 `GraphLinksModel` 行为：link data 引用的节点 key 若不在 nodeDataArray 中，
     * 且设置了 archetypeNodeData，则复制 archetype 生成该 key 的节点数据并加入 nodeDataArray。
     */
    private _ensureArchetypeNodesForLinkData;
    /** 添加链接数据 */
    addLinkData(data: ObjectData): void;
    /** 移除链接数据 */
    removeLinkData(data: ObjectData): boolean;
    /** 是否包含链接数据 */
    containsLinkData(data: ObjectData): boolean;
    /** 根据 key 查找链接数据（官方 findLinkDataForKey 返回 null） */
    findLinkDataForKey(key: any): ObjectData | null;
    /** 获取链接的 from key */
    getFromKeyForLinkData(data: ObjectData): any;
    /** 设置链接的 from key */
    setFromKeyForLinkData(data: ObjectData, key: any): void;
    /** 获取链接的 to key */
    getToKeyForLinkData(data: ObjectData): any;
    /** 设置链接的 to key */
    setToKeyForLinkData(data: ObjectData, key: any): void;
    /** 获取链接的 fromPort */
    getFromPortIdForLinkData(data: ObjectData): string;
    /** 设置链接的 fromPort */
    setFromPortIdForLinkData(data: ObjectData, portId: string): void;
    /** 获取链接的 toPort */
    getToPortIdForLinkData(data: ObjectData): string;
    /** 设置链接的 toPort */
    setToPortIdForLinkData(data: ObjectData, portId: string): void;
    /** 获取链接的标签 key 数组 */
    getLabelKeysForLinkData(data: ObjectData): any[];
    /** 设置链接的标签 key 数组 */
    setLabelKeysForLinkData(data: ObjectData, keys: any[]): void;
    /** 获取链接分类 */
    getCategoryForLinkData(data: ObjectData): string;
    /** 设置链接分类 */
    setCategoryForLinkData(data: ObjectData, category: string): void;
    /** 获取链接 key */
    getLinkKeyForData(data: ObjectData): any;
    /** 设置链接 key */
    setLinkKeyForData(data: ObjectData, key: any): void;
    static readonly EmptyArray: readonly any[];
    private _archetypeNodeData;
    /** 官方 GraphLinksModel.archetypeNodeData */
    get archetypeNodeData(): ObjectData | null;
    set archetypeNodeData(value: ObjectData | null);
    get type(): string;
    /** 官方 GraphLinksModel.getKeyForLinkData */
    getKeyForLinkData(data: ObjectData): any;
    /** 官方 GraphLinksModel.setKeyForLinkData */
    setKeyForLinkData(data: ObjectData, key: any): void;
    /** 官方 GraphLinksModel.makeLinkDataKeyUnique */
    makeLinkDataKeyUnique(data: ObjectData): void;
    /** 官方 GraphLinksModel.addLabelKeyForLinkData */
    addLabelKeyForLinkData(linkdata: ObjectData, key: any): void;
    /** 官方 GraphLinksModel.removeLabelKeyForLinkData */
    removeLabelKeyForLinkData(linkdata: ObjectData, key: any): void;
    /** 官方 GraphLinksModel.addLinkDataCollection */
    addLinkDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 官方 GraphLinksModel.removeLinkDataCollection */
    removeLinkDataCollection(coll: ObjectData[] | List<ObjectData>): void;
    /** 官方 GraphLinksModel.mergeLinkDataArray */
    mergeLinkDataArray(arr: ObjectData[]): void;
    /** 官方 GraphLinksModel.copyLinkData */
    copyLinkData(data: ObjectData): ObjectData;
    /** 官方 GraphLinksModel.isGroupForData */
    isGroupForData(data: ObjectData): boolean;
    /** 官方 GraphLinksModel.getGroupForData */
    getGroupForData(data: ObjectData): any;
    /** 官方 GraphLinksModel.setGroupForData */
    setGroupForData(data: ObjectData, groupKey: any): void;
    /** 官方 GraphLinksModel.getLinkCategoryForData */
    getLinkCategoryForData(data: ObjectData): string;
    /** 官方 GraphLinksModel.setLinkCategoryForData */
    setLinkCategoryForData(data: ObjectData, cat: string): void;
    protected copyCategory(from: ObjectData, to: ObjectData): void;
    /** 官方 GraphLinksModel.zR：合并/复制链接数据时搬运各类属性 */
    private _copyLinkDataProperties;
    toJson(_classname?: string): string;
    static fromJson(json: string | object): GraphLinksModel;
    private _rebuildLinkKeyMap;
    clear(): void;
    copy(): GraphLinksModel;
    cloneProtected(copy: Model): void;
}
