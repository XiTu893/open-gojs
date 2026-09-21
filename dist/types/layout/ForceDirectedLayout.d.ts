import { Size } from '../core/Size';
import { Layout } from './Layout';
/**
 * ForceDirectedLayout - positions nodes using a force-directed (spring-electric) algorithm.
 * Nodes repel each other (electrical charge), edges attract connected nodes (springs),
 * and gravity pulls nodes toward the center.
 */
export declare class ForceDirectedLayout extends Layout {
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
    copy(): ForceDirectedLayout;
    doLayout(coll: any): void;
    /**
     * Initialize vertex positions in a circle if they are all at the same location.
     */
    private _initializePositions;
}
