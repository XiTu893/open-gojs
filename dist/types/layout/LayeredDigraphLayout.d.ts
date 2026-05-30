import { EnumValue } from '../core/EnumValues';
import { Layout } from './Layout';
/**
 * LayeredDigraphLayout - implements a Sugiyama-style layered digraph layout.
 * Produces a layered arrangement of nodes with minimized edge crossings.
 */
export declare class LayeredDigraphLayout extends Layout {
    private _direction;
    private _layerSpacing;
    private _columnSpacing;
    private _setsPortSpots;
    private _aggressiveOption;
    private _packOption;
    private _layeringOption;
    private _cycleRemoveOption;
    get direction(): EnumValue;
    set direction(val: EnumValue);
    get layerSpacing(): number;
    set layerSpacing(val: number);
    get columnSpacing(): number;
    set columnSpacing(val: number);
    get setsPortSpots(): boolean;
    set setsPortSpots(val: boolean);
    get aggressiveOption(): EnumValue;
    set aggressiveOption(val: EnumValue);
    get packOption(): EnumValue;
    set packOption(val: EnumValue);
    get layeringOption(): string;
    set layeringOption(val: string);
    get cycleRemoveOption(): string;
    set cycleRemoveOption(val: string);
    copy(): LayeredDigraphLayout;
    doLayout(coll: any): void;
    /**
     * Remove cycles by reversing back edges in a DFS traversal.
     */
    private _removeCycles;
    /**
     * Assign layers to vertexes using longest path from source.
     */
    private _assignLayers;
    /**
     * Reduce edge crossings using barycenter heuristic.
     */
    private _reduceCrossings;
    /**
     * Reorder a layer based on barycenter of neighbors.
     */
    private _barycenterOrder;
    /**
     * Position nodes within each layer.
     */
    private _positionNodes;
}
