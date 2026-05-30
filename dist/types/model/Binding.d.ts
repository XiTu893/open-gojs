import { EnumValue } from '../core/EnumValues';
export declare class Binding {
    static OneWay: EnumValue;
    static TwoWay: EnumValue;
    targetProperty: string;
    sourceProperty: string;
    conversion: ((value: any, targetObject: any, model: any) => any) | null;
    backConversion: ((value: any, sourceData: any, model: any) => any) | null;
    mode: EnumValue;
    sourceObject: string | null;
    name: string;
    constructor(targetProperty: string, sourceProperty?: string, conversion?: (value: any, targetObject: any, model: any) => any);
    get isTwoWay(): boolean;
    get isFromModel(): boolean;
    get isToData(): boolean;
    makeTwoWay(backConversion?: (value: any, sourceData: any, model: any) => any): Binding;
    ofModel(): Binding;
    ofObject(name?: string): Binding;
    copy(): Binding;
    getValueFromSource(data: any, targetObject: any, model: any): any;
    getValueFromTarget(targetValue: any, data: any, model: any): any;
    toString(): string;
}
