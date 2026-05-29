/**
 * Polyfill - ES6+ runtime API polyfills for ES5 compatibility
 * This file provides polyfills for ES6+ APIs that are used in the codebase
 * but may not exist in ES5 environments.
 */

// Object.assign polyfill
if (typeof Object.assign !== 'function') {
  Object.assign = function (target: any, ...sources: any[]): any {
    if (target === null || target === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    const to = Object(target);
    for (let i = 0; i < sources.length; i++) {
      const source = sources[i];
      if (source !== null && source !== undefined) {
        for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            to[key] = source[key];
          }
        }
      }
    }
    return to;
  };
}

// Array.from polyfill
if (typeof Array.from !== 'function') {
  (Array as any).from = function (iterable: any, mapFn?: (value: any, index: number) => any): any[] {
    if (iterable === null || iterable === undefined) {
      throw new TypeError('Array.from requires an array-like object');
    }
    const items = Object(iterable);
    const len = items.length >>> 0;
    const result = new Array(len);
    for (let i = 0; i < len; i++) {
      if (i in items) {
        result[i] = mapFn ? mapFn(items[i], i) : items[i];
      }
    }
    return result;
  };
}

// Object.entries polyfill
if (typeof Object.entries !== 'function') {
  Object.entries = function (obj: any): [string, any][] {
    if (obj === null || obj === undefined) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    const entries: [string, any][] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        entries.push([key, obj[key]]);
      }
    }
    return entries;
  };
}

// String.prototype.startsWith polyfill
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (search: string, position?: number): boolean {
    const pos = position || 0;
    return this.indexOf(search, pos) === pos;
  };
}
