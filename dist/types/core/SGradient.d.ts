export declare class SGradient {
    private _type;
    private _color1;
    private _color2;
    private _angle;
    constructor(type: string, color1: string, color2: string, angle?: number);
    get type(): string;
    get color1(): string;
    get color2(): string;
    get angle(): number;
    toString(): string;
}
