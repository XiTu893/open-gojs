import { Model, ObjectData } from './Model';
/**
 * TreeModel - 树模型
 * 通过 parentKey 属性定义层级关系，无需 linkDataArray
 */
export declare class TreeModel extends Model {
    static readonly className: string;
    nodeParentKeyProperty: string;
    constructor();
    constructor(init: Partial<TreeModel> | ObjectData[]);
    /** 获取节点的父节点 key */
    getParentKeyForNodeData(data: ObjectData): any;
    /** 设置节点的父节点 key */
    setParentKeyForNodeData(data: ObjectData, key: any): void;
    private _parentLinkCategoryProperty;
    /** 官方 TreeModel.parentLinkCategoryProperty */
    get parentLinkCategoryProperty(): string;
    set parentLinkCategoryProperty(value: string);
    /** 官方 TreeModel.linkCategoryProperty（TreeModel 里是 parentLinkCategoryProperty 的别名） */
    get linkCategoryProperty(): string;
    set linkCategoryProperty(value: string);
    get type(): string;
    /** 官方 TreeModel.maybeEnsureLinkReference */
    maybeEnsureLinkReference(key: any): any;
    /** 官方 TreeModel.getParentLinkCategoryForNodeData */
    getParentLinkCategoryForNodeData(data: ObjectData): string;
    /** 官方 TreeModel.getLinkCategoryForData */
    getLinkCategoryForData(data: ObjectData): string;
    /** 官方 TreeModel.setParentLinkCategoryForNodeData */
    setParentLinkCategoryForNodeData(data: ObjectData, cat: string): void;
    /** 官方 TreeModel.setLinkCategoryForData */
    setLinkCategoryForData(data: ObjectData, cat: string): void;
    toString(level?: number): string;
    private static _stringifyData;
    toJson(_classname?: string): string;
    static fromJson(json: string | object): TreeModel;
    copy(): TreeModel;
    cloneProtected(copy: Model): void;
}
