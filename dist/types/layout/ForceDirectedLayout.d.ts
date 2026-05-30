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
    copy(): ForceDirectedLayout;
    doLayout(coll: any): void;
    /**
     * Initialize vertex positions in a circle if they are all at the same location.
     */
    private _initializePositions;
}
