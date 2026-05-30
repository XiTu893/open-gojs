import { Tool } from './Tool';
import { GraphObject } from '../view/GraphObject';
import { Link } from '../view/Link';
/**
 * LinkingBaseTool - base class for LinkingTool and RelinkingTool.
 * Provides shared logic for finding valid ports, validating links,
 * and creating temporary link visuals.
 */
export declare class LinkingBaseTool extends Tool {
    private _portProperty;
    private _targetPort;
    private _isForwardsOnly;
    private _isBackwardsOnly;
    private _linkValidation;
    private _portValidation;
    private _temporaryLink;
    private _temporaryFromPort;
    private _temporaryToPort;
    constructor();
    get portProperty(): string;
    set portProperty(val: string);
    get targetPort(): GraphObject | null;
    set targetPort(val: GraphObject | null);
    get isForwardsOnly(): boolean;
    set isForwardsOnly(val: boolean);
    get isBackwardsOnly(): boolean;
    set isBackwardsOnly(val: boolean);
    get linkValidation(): ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null;
    set linkValidation(val: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject, link: Link | null) => boolean) | null);
    get portValidation(): ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null;
    set portValidation(val: ((fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject) => boolean) | null);
    get temporaryLink(): Link | null;
    set temporaryLink(val: Link | null);
    get temporaryFromPort(): GraphObject | null;
    set temporaryFromPort(val: GraphObject | null);
    get temporaryToPort(): GraphObject | null;
    set temporaryToPort(val: GraphObject | null);
    /** Find a target port at the current mouse point. */
    findTargetPort(): GraphObject | null;
    /** Check whether a link from fromPort to toPort is valid. */
    isValidLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): boolean;
    private _countLinksFromPort;
    private _countLinksToPort;
    private _hasDuplicateLink;
    /** Insert a new link into the model. Returns the new link or null. */
    insertLink(fromNode: any, fromPort: GraphObject, toNode: any, toPort: GraphObject): Link | null;
}
