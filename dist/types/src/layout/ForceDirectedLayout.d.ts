import { Size } from '../core/Size';
import { Layout } from './Layout';
import { LayoutNetwork } from './LayoutNetwork';
import { LayoutVertex } from './LayoutVertex';
/**
 * ForceDirectedLayout - positions nodes using a force-directed (spring-electric) algorithm.
 * Nodes repel each other (electrical charge), edges attract connected nodes (springs),
 * and gravity pulls nodes toward the center.
 */
export declare class ForceDirectedLayout extends Layout {
    static readonly className: string;
    /** 官方 `ForceDirectedLayout.constructor(init?)`：`t && Object.assign(this, t)` */
    constructor(init?: any);
    private _maxIterations;
    private _defaultSpringLength;
    private _defaultSpringStiffness;
    private _defaultElectricalCharge;
    private _defaultGravity;
    private _infinityDistance;
    private _epsilon;
    private _arrangementSpacing;
    private _arrangesToOrigin;
    private _defaultGravitationalMass;
    private _theta;
    private _setsPortSpots;
    private _springLength;
    private _springStiffness;
    private _randomNumberGenerator;
    private _electricalCharge;
    private _gravitationalMass;
    private _currentIteration;
    private _comments;
    private _maxPrelayoutIterations;
    private _epsilonDistance;
    private _moveLimit;
    private _defaultCommentSpringLength;
    private _defaultCommentElectricalCharge;
    private _prelayoutQuality;
    private _prelayoutSpread;
    get maxIterations(): number;
    set maxIterations(val: number);
    get defaultSpringLength(): number;
    set defaultSpringLength(val: number);
    get defaultSpringStiffness(): number;
    set defaultSpringStiffness(val: number);
    get defaultElectricalCharge(): number;
    set defaultElectricalCharge(val: number);
    get defaultGravity(): number;
    set defaultGravity(val: number);
    get infinityDistance(): number;
    set infinityDistance(val: number);
    get epsilon(): number;
    set epsilon(val: number);
    get arrangementSpacing(): Size;
    set arrangementSpacing(val: Size);
    get arrangesToOrigin(): boolean;
    set arrangesToOrigin(val: boolean);
    get defaultGravitationalMass(): number;
    set defaultGravitationalMass(val: number);
    get theta(): number;
    set theta(val: number);
    get setsPortSpots(): boolean;
    set setsPortSpots(val: boolean);
    get springLength(): number;
    set springLength(val: number);
    get springStiffness(): number;
    set springStiffness(val: number);
    get randomNumberGenerator(): (() => number) | null;
    set randomNumberGenerator(val: (() => number) | null);
    get electricalCharge(): number;
    set electricalCharge(val: number);
    get gravitationalMass(): number;
    set gravitationalMass(val: number);
    get currentIteration(): number;
    get comments(): boolean;
    set comments(val: boolean);
    get maxPrelayoutIterations(): number;
    set maxPrelayoutIterations(val: number);
    get epsilonDistance(): number;
    set epsilonDistance(val: number);
    get moveLimit(): number;
    set moveLimit(val: number);
    get defaultCommentSpringLength(): number;
    set defaultCommentSpringLength(val: number);
    get defaultCommentElectricalCharge(): number;
    set defaultCommentElectricalCharge(val: number);
    get prelayoutQuality(): number;
    set prelayoutQuality(val: number);
    get prelayoutSpread(): number;
    set prelayoutSpread(val: number);
    needsPrelayout(): boolean;
    doConnectedSubnetLayout(t: LayoutNetwork): void;
    computePairwiseDistances(t: LayoutNetwork): number[][];
    coarsenNetwork(t: LayoutNetwork): LayoutNetwork;
    addComments(v: LayoutVertex): void;
    moveVertex(v: LayoutVertex): number;
    shouldInteract(v1: LayoutVertex, v2: LayoutVertex): boolean;
    moveFixedVertex(v: LayoutVertex): void;
    commitNodes(): void;
    commitLinks(): void;
    electricalFieldX(x: number, y: number): number;
    electricalFieldY(x: number, y: number): number;
    gravitationalFieldX(x: number, y: number): number;
    gravitationalFieldY(x: number, y: number): number;
    isFixed(v: LayoutVertex): boolean;
    copy(): ForceDirectedLayout;
    doLayout(coll: any): void;
    /**
     * Initialize vertex positions in a circle if they are all at the same location.
     */
    private _initializePositions;
}
