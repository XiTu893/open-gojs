export declare class PositionArray {
    private _positions;
    constructor(positions?: number[]);
    get count(): number;
    getPoint(i: number): {
        x: number;
        y: number;
    };
    setPoint(i: number, x: number, y: number): void;
    addPoint(x: number, y: number): void;
    insertPoint(i: number, x: number, y: number): void;
    removePoint(i: number): void;
    toArray(): number[];
    equals(other: PositionArray): boolean;
    clone(): PositionArray;
}
