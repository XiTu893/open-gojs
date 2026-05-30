import { LinkingBaseTool } from './LinkingBaseTool';
import { GraphObject } from '../view/GraphObject';
import { Link } from '../view/Link';
export declare class RelinkingTool extends LinkingBaseTool {
    private _originalLink;
    private _originalFromPort;
    private _originalToPort;
    private _fromHandleArchetype;
    private _toHandleArchetype;
    constructor();
    private _createHandleArchetype;
    get originalLink(): Link | null;
    set originalLink(val: Link | null);
    get originalFromPort(): GraphObject | null;
    set originalFromPort(val: GraphObject | null);
    get originalToPort(): GraphObject | null;
    set originalToPort(val: GraphObject | null);
    get fromHandleArchetype(): GraphObject | null;
    set fromHandleArchetype(val: GraphObject | null);
    get toHandleArchetype(): GraphObject | null;
    set toHandleArchetype(val: GraphObject | null);
    canStart(): boolean;
    doActivate(): void;
    doMouseMove(): void;
    doMouseUp(): void;
    doDeactivate(): void;
    updateAdornments(part: any): void;
    private _makeRelinkAdornment;
}
