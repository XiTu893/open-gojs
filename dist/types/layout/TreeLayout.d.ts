import { EnumValue } from '../core/EnumValues';
import { Layout } from './Layout';
/**
 * TreeLayout - arranges nodes in a tree structure.
 */
export declare class TreeLayout extends Layout {
    private _angle;
    private _layerSpacing;
    private _nodeSpacing;
    private _treeStyle;
    private _arrangement;
    private _layerStyle;
    private _compaction;
    private _sorting;
    private _path;
    private _alternateAngle;
    private _alternateLayerSpacing;
    private _alternateNodeSpacing;
    private _alternateAlignment;
    private _alternateCompaction;
    private _alternateSorting;
    get angle(): number;
    set angle(val: number);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get nodeSpacing(): number;
    set nodeSpacing(val: number);
    get treeStyle(): EnumValue;
    set treeStyle(val: EnumValue);
    get arrangement(): EnumValue;
    set arrangement(val: EnumValue);
    get layerStyle(): EnumValue;
    set layerStyle(val: EnumValue);
    get compaction(): EnumValue;
    set compaction(val: EnumValue);
    get sorting(): EnumValue;
    set sorting(val: EnumValue);
    get path(): EnumValue;
    set path(val: EnumValue);
    get alternateAngle(): number;
    set alternateAngle(val: number);
    get alternateLayerSpacing(): number;
    set alternateLayerSpacing(val: number);
    get alternateNodeSpacing(): number;
    set alternateNodeSpacing(val: number);
    get alternateAlignment(): EnumValue;
    set alternateAlignment(val: EnumValue);
    get alternateCompaction(): EnumValue;
    set alternateCompaction(val: EnumValue);
    get alternateSorting(): EnumValue;
    set alternateSorting(val: EnumValue);
    copy(): TreeLayout;
    doLayout(coll: any): void;
    private _sortChildren;
    private _assignLayers;
    private _layoutTree;
    private _computeSubtreeWidth;
    private _positionTree;
}
