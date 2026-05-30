import { Tool } from './Tool';
import { GraphObject } from '../view/GraphObject';
export declare class LinkReshapingTool extends Tool {
    private _handle;
    private _adornedLink;
    private _handleIndex;
    protected _handleArchetype: GraphObject | null;
    constructor();
    private _createHandleArchetype;
    get handle(): any;
    set handle(val: any);
    get adornedLink(): any;
    set adornedLink(val: any);
    get handleArchetype(): GraphObject | null;
    set handleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    updateAdornments(part: any): void;
    private _makeReshapeAdornment;
}
