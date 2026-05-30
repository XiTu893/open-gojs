import { Model, ObjectData } from './Model';
/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
export declare class GraphLinksModel extends Model {
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
    /** 添加链接数据 */
    addLinkData(data: ObjectData): void;
    /** 移除链接数据 */
    removeLinkData(data: ObjectData): boolean;
    /** 是否包含链接数据 */
    containsLinkData(data: ObjectData): boolean;
    /** 根据 key 查找链接数据 */
    findLinkDataForKey(key: any): ObjectData | undefined;
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
    toJson(): string;
    static fromJson(json: string | object): GraphLinksModel;
    private _rebuildLinkKeyMap;
    clear(): void;
    copy(): GraphLinksModel;
    cloneProtected(copy: Model): void;
}
