export class ThemeBinding {

  /** The name of the binding. */
  name: string;

  /** The source property name. */
  sourceProperty: string;

  /** The target property name. */
  targetProperty: string;

  /** The converter function. */
  converter: (value: any) => any;

  /** The target object. */
  target: any;

  constructor(name: string, sourceProperty: string, targetProperty: string, converter?: (value: any) => any) {
    this.name = name;
    this.sourceProperty = sourceProperty;
    this.targetProperty = targetProperty;
    this.converter = converter ?? (() => undefined);
  }
}