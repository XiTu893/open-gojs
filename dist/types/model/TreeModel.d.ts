import { Model, ObjectData } from './Model';
/**
 * TreeModel - 树模型
 * 通过 parentKey 属性定义层级关系，无需 linkDataArray
 */
export declare class TreeModel extends Model {
    nodeParentKeyProperty: string;
    constructor();
    constructor(init: Partial<TreeModel> | ObjectData[]);
    /** 获取节点的父节点 key */
    getParentKeyForNodeData(data: ObjectData): any;
    /** 设置节点的父节点 key */
    setParentKeyForNodeData(data: ObjectData, key: any): void;
    toJson(): string;
    static fromJson(json: string | object): TreeModel;
    copy(): TreeModel;
    cloneProtected(copy: Model): void;
}
