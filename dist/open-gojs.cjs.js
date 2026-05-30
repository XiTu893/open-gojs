'use strict';

/**
 * Polyfill - ES6+ runtime API polyfills for ES5 compatibility
 * This file provides polyfills for ES6+ APIs that are used in the codebase
 * but may not exist in ES5 environments.
 */
// Object.assign polyfill
if (typeof Object.assign !== 'function') {
    Object.assign = function (target) {
        var sources = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            sources[_i - 1] = arguments[_i];
        }
        if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];
            if (source !== null && source !== undefined) {
                for (var key in source) {
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
    Array.from = function (iterable, mapFn) {
        if (iterable === null || iterable === undefined) {
            throw new TypeError('Array.from requires an array-like object');
        }
        var items = Object(iterable);
        var len = items.length >>> 0;
        var result = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in items) {
                result[i] = mapFn ? mapFn(items[i], i) : items[i];
            }
        }
        return result;
    };
}
// Object.entries polyfill
if (typeof Object.entries !== 'function') {
    Object.entries = function (obj) {
        if (obj === null || obj === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var entries = [];
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                entries.push([key, obj[key]]);
            }
        }
        return entries;
    };
}
// String.prototype.startsWith polyfill
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function (search, position) {
        var pos = position || 0;
        return this.indexOf(search, pos) === pos;
    };
}

/**
 * EnumValue - GoJS 风格的枚举值基类
 * 每个枚举值是唯一对象实例，通过名称标识
 */
var EnumValue = /** @class */ (function () {
    function EnumValue(name) {
        this._name = name;
    }
    EnumValue.prototype.toString = function () {
        return this._name;
    };
    return EnumValue;
}());
// ============ 面板类型 ============
var PanelAuto = new EnumValue('Auto');
var PanelVertical = new EnumValue('Vertical');
var PanelHorizontal = new EnumValue('Horizontal');
var PanelSpot = new EnumValue('Spot');
var PanelTable = new EnumValue('Table');
var PanelPosition = new EnumValue('Position');
var PanelGrid = new EnumValue('Grid');
var PanelViewbox = new EnumValue('Viewbox');
var PanelGraduated = new EnumValue('Graduated');
var PanelLink = new EnumValue('Link');
var PanelTableColumn = new EnumValue('TableColumn');
var PanelTableRow = new EnumValue('TableRow');
// ============ 拉伸方式 ============
var StretchDefault = new EnumValue('Default');
var StretchFill = new EnumValue('Fill');
var StretchNone = new EnumValue('None');
var StretchUniform = new EnumValue('Uniform');
var StretchUniformToFill = new EnumValue('UniformToFill');
var StretchHorizontal = new EnumValue('Horizontal');
var StretchVertical = new EnumValue('Vertical');
// ============ 翻转 ============
var FlipNone = new EnumValue('FlipNone');
var FlipHorizontal = new EnumValue('FlipHorizontal');
var FlipVertical = new EnumValue('FlipVertical');
var FlipBoth = new EnumValue('FlipBoth');
// ============ 链接路由 ============
var RoutingNormal = new EnumValue('Normal');
var RoutingOrthogonal = new EnumValue('Orthogonal');
var RoutingAvoidsNodes = new EnumValue('AvoidsNodes');
// ============ 链接曲线 ============
var CurveNone = new EnumValue('CurveNone');
var CurveBezier = new EnumValue('CurveBezier');
var CurveJumpOver = new EnumValue('CurveJumpOver');
var CurveJumpGap = new EnumValue('CurveJumpGap');
// ============ 文本换行 ============
var WrapFit = new EnumValue('WrapFit');
var WrapDesiredSize = new EnumValue('WrapDesiredSize');
var WrapNone = new EnumValue('WrapNone');
// ============ 文本溢出 ============
var OverflowClip = new EnumValue('OverflowClip');
var OverflowEllipsis = new EnumValue('OverflowEllipsis');
// ============ 图片拉伸 ============
var ImageStretchNone = new EnumValue('ImageStretchNone');
var ImageStretchFill = new EnumValue('ImageStretchFill');
var ImageStretchUniform = new EnumValue('ImageStretchUniform');
var ImageStretchUniformToFill = new EnumValue('ImageStretchUniformToFill');
// ============ 表格行/列尺寸策略 ============
var SizingNone = new EnumValue('SizingNone');
var SizingProp = new EnumValue('SizingProp');
var SizingAuto = new EnumValue('SizingAuto');
// ============ 树布局样式 ============
var TreeStyleLayered = new EnumValue('TreeStyleLayered');
var TreeStyleAlternating = new EnumValue('TreeStyleAlternating');
var TreeStyleLastParents = new EnumValue('TreeStyleLastParents');
var TreeStyleCompact = new EnumValue('TreeStyleCompact');
var TreeStyleRootOnly = new EnumValue('TreeStyleRootOnly');
// ============ 树布局路径 ============
var TreePathDefault = new EnumValue('TreePathDefault');
var TreePathDestination = new EnumValue('TreePathDestination');
var TreePathSource = new EnumValue('TreePathSource');
// ============ 树布局排列 ============
var TreeArrangementVertical = new EnumValue('TreeArrangementVertical');
var TreeArrangementHorizontal = new EnumValue('TreeArrangementHorizontal');
var TreeArrangementFixedRoots = new EnumValue('TreeArrangementFixedRoots');
// ============ 树布局层样式 ============
var TreeLayerStyleIndividual = new EnumValue('TreeLayerStyleIndividual');
var TreeLayerStyleUniform = new EnumValue('TreeLayerStyleUniform');
// ============ 树布局排序 ============
var TreeSortingForwards = new EnumValue('TreeSortingForwards');
var TreeSortingReverse = new EnumValue('TreeSortingReverse');
var TreeSortingAscending = new EnumValue('TreeSortingAscending');
var TreeSortingDescending = new EnumValue('TreeSortingDescending');
// ============ 树布局压缩 ============
var TreeCompactionBlock = new EnumValue('TreeCompactionBlock');
var TreeCompactionNone = new EnumValue('TreeCompactionNone');
// ============ 环形布局排列 ============
var CircularArrangementConstantDistance = new EnumValue('CircularArrangementConstantDistance');
var CircularArrangementConstantAngle = new EnumValue('CircularArrangementConstantAngle');
var CircularArrangementConstantRadius = new EnumValue('CircularArrangementConstantRadius');
var CircularArrangementPacked = new EnumValue('CircularArrangementPacked');
// ============ 环形布局方向 ============
var CircularDirectionClockwise = new EnumValue('CircularDirectionClockwise');
var CircularDirectionBidirectionalLeft = new EnumValue('CircularDirectionBidirectionalLeft');
var CircularDirectionBidirectionalRight = new EnumValue('CircularDirectionBidirectionalRight');
// ============ 分层有向图布局方向 ============
var LayeredDigraphDirectionDown = new EnumValue('LayeredDigraphDirectionDown');
var LayeredDigraphDirectionUp = new EnumValue('LayeredDigraphDirectionUp');
var LayeredDigraphDirectionLeft = new EnumValue('LayeredDigraphDirectionLeft');
var LayeredDigraphDirectionRight = new EnumValue('LayeredDigraphDirectionRight');
// ============ 分层有向图对齐 ============
var LayeredDigraphAlignTop = new EnumValue('LayeredDigraphAlignTop');
var LayeredDigraphAlignBottom = new EnumValue('LayeredDigraphAlignBottom');
var LayeredDigraphAlignCenter = new EnumValue('LayeredDigraphAlignCenter');
var LayeredDigraphAlignUpper = new EnumValue('LayeredDigraphAlignUpper');
var LayeredDigraphAlignLower = new EnumValue('LayeredDigraphAlignLower');
// ============ 分层有向图激进选项 ============
var LayeredDigraphAggressiveNone = new EnumValue('LayeredDigraphAggressiveNone');
var LayeredDigraphAggressiveHorizontal = new EnumValue('LayeredDigraphAggressiveHorizontal');
var LayeredDigraphAggressiveVertical = new EnumValue('LayeredDigraphAggressiveVertical');
var LayeredDigraphAggressiveAll = new EnumValue('LayeredDigraphAggressiveAll');
// ============ 分层有向图打包选项 ============
var LayeredDigraphPackNone = new EnumValue('LayeredDigraphPackNone');
var LayeredDigraphPackAll = new EnumValue('LayeredDigraphPackAll');
var LayeredDigraphPackExpand = new EnumValue('LayeredDigraphPackExpand');
var LayeredDigraphPackStraighten = new EnumValue('LayeredDigraphPackStraighten');
var LayeredDigraphPackMedian = new EnumValue('LayeredDigraphPackMedian');
// ============ 网格布局对齐 ============
var GridLayoutLocation = new EnumValue('GridLayoutLocation');
var GridLayoutCenter = new EnumValue('GridLayoutCenter');
// ============ 网格布局排列 ============
var GridArrangementLeftToRight = new EnumValue('GridArrangementLeftToRight');
var GridArrangementRightToLeft = new EnumValue('GridArrangementRightToLeft');
var GridArrangementTopToBottom = new EnumValue('GridArrangementTopToBottom');
var GridArrangementBottomToTop = new EnumValue('GridArrangementBottomToTop');
// ============ 网格布局换行 ============
var GridWrappingNone = new EnumValue('GridWrappingNone');
var GridWrappingFit = new EnumValue('GridWrappingFit');
// ============ 动画样式 ============
var AnimationDefault = new EnumValue('AnimationDefault');
var AnimationEaseInOut = new EnumValue('AnimationEaseInOut');
var AnimationEaseIn = new EnumValue('AnimationEaseIn');
var AnimationEaseOut = new EnumValue('AnimationEaseOut');
var AnimationLinear = new EnumValue('AnimationLinear');
var AnimationEaseOutBounce = new EnumValue('AnimationEaseOutBounce');
// ============ 自动缩放 ============
var AutoScaleNone = new EnumValue('AutoScaleNone');
var AutoScaleUniform = new EnumValue('AutoScaleUniform');
var AutoScaleUniformToFill = new EnumValue('AutoScaleUniformToFill');
// ============ 滚动模式 ============
var ScrollDocument = new EnumValue('ScrollDocument');
var ScrollInfinite = new EnumValue('ScrollInfinite');
// ============ 有效循环 ============
var CycleAll = new EnumValue('CycleAll');
var CycleNotDirected = new EnumValue('CycleNotDirected');
var CycleNotUndirected = new EnumValue('CycleNotUndirected');
var CycleDestinationTree = new EnumValue('CycleDestinationTree');
var CycleSourceTree = new EnumValue('CycleSourceTree');
// ============ 链接段方向 ============
var SegmentOrientationNone = new EnumValue('SegmentOrientationNone');
var SegmentOrientationAlong = new EnumValue('SegmentOrientationAlong');
var SegmentOrientationOpposite = new EnumValue('SegmentOrientationOpposite');
var SegmentOrientationParallel = new EnumValue('SegmentOrientationParallel');
var SegmentOrientationPerpendicular = new EnumValue('SegmentOrientationPerpendicular');
var SegmentOrientationOrthogonal = new EnumValue('SegmentOrientationOrthogonal');
// ============ 变更事件类型 ============
var ChangedEventProperty = new EnumValue('Property');
var ChangedEventInsert = new EnumValue('Insert');
var ChangedEventRemove = new EnumValue('Remove');
var ChangedEventTransaction = new EnumValue('Transaction');
// ============ 路径段类型 ============
var PathSegmentLine = new EnumValue('Line');
var PathSegmentQuadraticBezier = new EnumValue('QuadraticBezier');
var PathSegmentCubicBezier = new EnumValue('CubicBezier');
var PathSegmentArc = new EnumValue('Arc');
var PathSegmentMoveTo = new EnumValue('MoveTo');
var PathSegmentClose = new EnumValue('Close');
// ============ 画刷类型 ============
var BrushSolid = new EnumValue('Solid');
var BrushLinear = new EnumValue('Linear');
var BrushRadial = new EnumValue('Radial');
// ============ Viewbox 拉伸 ============
var ViewboxStretchNone = new EnumValue('ViewboxStretchNone');
var ViewboxStretchFill = new EnumValue('ViewboxStretchFill');
var ViewboxStretchUniform = new EnumValue('ViewboxStretchUniform');
var ViewboxStretchUniformToFill = new EnumValue('ViewboxStretchUniformToFill');
// ============ Graduated 面板属性 ============
var GraduatedPanNone = new EnumValue('GraduatedPanNone');
var GraduatedPanLeft = new EnumValue('GraduatedPanLeft');
var GraduatedPanCenter = new EnumValue('GraduatedPanCenter');
var GraduatedPanRight = new EnumValue('GraduatedPanRight');
// ============ GridSorting ============
var GridSortingForwards = new EnumValue('Forwards');
var GridSortingReverse = new EnumValue('Reverse');
var GridSortingAscending = new EnumValue('Ascending');
var GridSortingDescending = new EnumValue('Descending');
// ============ GridAlignment ============
var GridAlignmentLocation = new EnumValue('Location');
var GridAlignmentPosition = new EnumValue('Position');
// ============ CircularSorting ============
var CircularSortingForwards = new EnumValue('CircularSortingForwards');
var CircularSortingReverse = new EnumValue('CircularSortingReverse');
var CircularSortingAscending = new EnumValue('CircularSortingAscending');
var CircularSortingDescending = new EnumValue('CircularSortingDescending');
var CircularSortingOptimized = new EnumValue('CircularSortingOptimized');
// ============ TreeAlignment ============
var TreeAlignmentTopLeftBus = new EnumValue('TopLeftBus');
var TreeAlignmentBottomRightBus = new EnumValue('BottomRightBus');
var TreeAlignmentBus = new EnumValue('Bus');
var TreeAlignmentBusBranching = new EnumValue('BusBranching');
var TreeAlignmentCenterChildren = new EnumValue('CenterChildren');
var TreeAlignmentCenterSubtrees = new EnumValue('CenterSubtrees');
var TreeAlignmentStart = new EnumValue('Start');
var TreeAlignmentEnd = new EnumValue('End');
// ============ LayeredDigraphAggressive ============
var LayeredDigraphAggressiveLess = new EnumValue('Less');
var LayeredDigraphAggressiveMore = new EnumValue('More');
// ============ LayeredDigraphAlign ============
var LayeredDigraphAlignNone = new EnumValue('LayeredDigraphAlignNone');
// ============ LinkAdjusting ============
var LinkAdjustingEnd = new EnumValue('End');
var LinkAdjustingStretch = new EnumValue('Stretch');
// ============ Orientation ============
var OrientationNone = new EnumValue('OrientationNone');
var OrientationAlong = new EnumValue('Along');
var OrientationMinus90 = new EnumValue('Minus90');
var OrientationPlus90 = new EnumValue('Plus90');
var OrientationPlus180 = new EnumValue('Plus180');
// ============ GestureMode ============
var GestureModeNone = new EnumValue('GestureModeNone');
var GestureModeCancel = new EnumValue('Cancel');
var GestureModeZoom = new EnumValue('Zoom');
// ============ WheelMode ============
var WheelModeZoom = new EnumValue('Zoom');
// ============ TextEditingAccept ============
var TextEditingAcceptLostFocus = new EnumValue('LostFocus');
// ============ TextEditingStarting ============
var TextEditingStartingSingleClick = new EnumValue('SingleClick');
// ============ AnimationStyle ============
var AnimationStyleDefault = new EnumValue('AnimationStyleDefault');
var AnimationStyleAnimateLocations = new EnumValue('AnimateLocations');
var AnimationStyleNone = new EnumValue('AnimationStyleNone');
// ============ LayoutConditions ============
var LayoutConditionsStandard = new EnumValue('Standard');
var LayoutConditionsNodeSized = new EnumValue('NodeSized');
// ============ GeometryStretch ============
var GeometryStretchUniform = new EnumValue('Uniform');
var GeometryStretchNone = new EnumValue('GeometryStretchNone');
var GeometryStretchFill = new EnumValue('GeometryStretchFill');
var GeometryStretchUniformToFill = new EnumValue('GeometryStretchUniformToFill');
// ============ VerticalAlignment ============
var VerticalTop = new EnumValue('VerticalTop');
var VerticalCenter = new EnumValue('VerticalCenter');
var VerticalBottom = new EnumValue('VerticalBottom');
// ============ GeometryType ============
var GeometryTypeLine = new EnumValue('Line');
var GeometryTypePath = new EnumValue('Path');
// ============ CircularNodeDiameterFormula ============
var CircularNodeDiameterFormulaCircular = new EnumValue('Circular');
var CircularNodeDiameterFormulaPythagorean = new EnumValue('Pythagorean');
// ============ LayeredDigraphCycleRemove ============
var LayeredDigraphCycleRemoveDepthFirst = new EnumValue('DepthFirst');
var LayeredDigraphCycleRemoveGreedy = new EnumValue('Greedy');
// ============ LayeredDigraphInit ============
var LayeredDigraphInitDepthFirstIn = new EnumValue('DepthFirstIn');
var LayeredDigraphInitDepthFirstOut = new EnumValue('DepthFirstOut');
var LayeredDigraphInitNaive = new EnumValue('Naive');
// ============ LayeredDigraphLayering ============
var LayeredDigraphLayeringLongestPathSink = new EnumValue('LongestPathSink');
var LayeredDigraphLayeringLongestPathSource = new EnumValue('LongestPathSource');
var LayeredDigraphLayeringOptimalLinkLength = new EnumValue('OptimalLinkLength');
// ============ LinkingDirection ============
var LinkingDirectionForwardsOnly = new EnumValue('ForwardsOnly');
// ============ TriggerStart ============
var TriggerStartBundled = new EnumValue('Bundled');
// ============ TreeLayerStyle ============
var TreeLayerStyleSiblings = new EnumValue('Siblings');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * List - 有序列表集合
 */
var List = /** @class */ (function () {
    function List(iterable) {
        this._data = [];
        if (iterable) {
            if (Array.isArray(iterable)) {
                this._data = __spreadArray([], __read(iterable), false);
            }
            else if ('iterator' in iterable) {
                var it = iterable.iterator;
                while (it.next()) {
                    this._data.push(it.value);
                }
            }
        }
    }
    Object.defineProperty(List.prototype, "count", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "length", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "size", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "iterator", {
        get: function () {
            return new ListIterator(this._data);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "isEmpty", {
        /** 是否为空 */
        get: function () {
            return this._data.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "first", {
        /** 获取第一个元素 */
        get: function () {
            return this._data.length > 0 ? this._data[0] : undefined;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(List.prototype, "last", {
        /** 获取最后一个元素 */
        get: function () {
            return this._data.length > 0 ? this._data[this._data.length - 1] : undefined;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加元素到末尾 */
    List.prototype.add = function (item) {
        this._data.push(item);
        return this;
    };
    List.prototype.addAll = function (coll) {
        var e_1, _a;
        if (Array.isArray(coll)) {
            try {
                for (var coll_1 = __values(coll), coll_1_1 = coll_1.next(); !coll_1_1.done; coll_1_1 = coll_1.next()) {
                    var item = coll_1_1.value;
                    this._data.push(item);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (coll_1_1 && !coll_1_1.done && (_a = coll_1.return)) _a.call(coll_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else if ('iterator' in coll) {
            var it = coll.iterator;
            while (it.next()) {
                this._data.push(it.value);
            }
        }
        return this;
    };
    /** 在指定位置插入元素 */
    List.prototype.insert = function (index, item) {
        this._data.splice(index, 0, item);
        return this;
    };
    /** 移除指定元素 */
    List.prototype.remove = function (item) {
        var idx = this._data.indexOf(item);
        if (idx >= 0) {
            this._data.splice(idx, 1);
            return true;
        }
        return false;
    };
    /** 移除指定位置的元素 */
    List.prototype.removeAt = function (index) {
        if (index >= 0 && index < this._data.length) {
            return this._data.splice(index, 1)[0];
        }
        return undefined;
    };
    /** 移除第一个元素 */
    List.prototype.removeFirst = function () {
        return this._data.shift();
    };
    /** 移除最后一个元素 */
    List.prototype.removeLast = function () {
        return this._data.pop();
    };
    /** 清空列表 */
    List.prototype.clear = function () {
        this._data.length = 0;
        return this;
    };
    /** 是否包含指定元素 */
    List.prototype.contains = function (item) {
        return this._data.indexOf(item) >= 0;
    };
    /** 查找元素索引 */
    List.prototype.indexOf = function (item) {
        return this._data.indexOf(item);
    };
    /** 获取指定位置的元素 */
    List.prototype.get = function (index) {
        return this._data[index];
    };
    /** 设置指定位置的元素 */
    List.prototype.set = function (index, item) {
        this._data[index] = item;
        return this;
    };
    /** 转换为数组 */
    List.prototype.toArray = function () {
        return __spreadArray([], __read(this._data), false);
    };
    /** 遍历 */
    List.prototype.each = function (func) {
        for (var i = 0; i < this._data.length; i++) {
            func(this._data[i], i);
        }
        return this;
    };
    /** 映射 */
    List.prototype.map = function (func) {
        var result = new List();
        for (var i = 0; i < this._data.length; i++) {
            result.add(func(this._data[i], i));
        }
        return result;
    };
    /** 过滤 */
    List.prototype.filter = function (func) {
        var result = new List();
        for (var i = 0; i < this._data.length; i++) {
            if (func(this._data[i], i)) {
                result.add(this._data[i]);
            }
        }
        return result;
    };
    /** 排序 */
    List.prototype.sort = function (compare) {
        this._data.sort(compare);
        return this;
    };
    /** 反转 */
    List.prototype.reverse = function () {
        this._data.reverse();
        return this;
    };
    /** 复制 */
    List.prototype.copy = function () {
        return new List(this._data);
    };
    /** [Symbol.iterator] support - conditionally defined for ES6+ environments */
    List.prototype[Symbol.iterator] = function () {
        var index = 0;
        var data = this._data;
        return {
            next: function () {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                return { value: undefined, done: true };
            },
        };
    };
    return List;
}());
/**
 * ListIterator - List 的迭代器实现
 */
var ListIterator = /** @class */ (function () {
    function ListIterator(data) {
        this._index = -1;
        this._data = data;
    }
    Object.defineProperty(ListIterator.prototype, "value", {
        get: function () {
            if (this._index >= 0 && this._index < this._data.length) {
                return this._data[this._index];
            }
            throw new Error('Iterator is out of bounds');
        },
        enumerable: false,
        configurable: true
    });
    ListIterator.prototype.next = function () {
        this._index++;
        return this._index < this._data.length;
    };
    ListIterator.prototype.reset = function () {
        this._index = -1;
    };
    ListIterator.prototype.toArray = function () {
        return __spreadArray([], __read(this._data), false);
    };
    ListIterator.prototype.each = function (func) {
        for (var i = 0; i < this._data.length; i++) {
            func(this._data[i]);
        }
        return this;
    };
    return ListIterator;
}());

/**
 * Map - 键值映射集合
 */
var Map$1 = /** @class */ (function () {
    function Map(iterable) {
        var e_1, _a;
        this._keys = [];
        this._values = [];
        if (iterable) {
            if (iterable instanceof Map) {
                var it = iterable.iterator;
                while (it.next()) {
                    this._keys.push(it.key);
                    this._values.push(it.value);
                }
            }
            else if (Array.isArray(iterable)) {
                try {
                    for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                        var _b = __read(iterable_1_1.value, 2), k = _b[0], v = _b[1];
                        this.add(k, v);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        }
    }
    Object.defineProperty(Map.prototype, "count", {
        get: function () {
            return this._keys.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "size", {
        get: function () {
            return this._keys.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "iterator", {
        get: function () {
            return new MapIterator(this._keys, this._values);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "keys", {
        /** 获取所有键 */
        get: function () {
            return new MapKeyIterator(this._keys);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "values", {
        /** 获取所有值 */
        get: function () {
            return new MapValueIterator(this._values);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "isEmpty", {
        /** 是否为空 */
        get: function () {
            return this._keys.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加键值对 */
    Map.prototype.add = function (key, value) {
        var idx = this._indexOf(key);
        var oldValue = undefined;
        if (idx >= 0) {
            oldValue = this._values[idx];
            this._values[idx] = value;
        }
        else {
            this._keys.push(key);
            this._values.push(value);
        }
        return oldValue;
    };
    Map.prototype.set = function (key, value) {
        return this.add(key, value);
    };
    /** 获取值 */
    Map.prototype.get = function (key) {
        var idx = this._indexOf(key);
        return idx >= 0 ? this._values[idx] : undefined;
    };
    /** 获取值，带默认值 */
    Map.prototype.getValue = function (key, defaultValue) {
        var idx = this._indexOf(key);
        return idx >= 0 ? this._values[idx] : defaultValue;
    };
    /** 是否包含键 */
    Map.prototype.contains = function (key) {
        return this._indexOf(key) >= 0;
    };
    /** 是否包含键（同 contains） */
    Map.prototype.has = function (key) {
        return this.contains(key);
    };
    /** 移除键值对 */
    Map.prototype.remove = function (key) {
        var idx = this._indexOf(key);
        if (idx >= 0) {
            var oldValue = this._values[idx];
            this._keys.splice(idx, 1);
            this._values.splice(idx, 1);
            return oldValue;
        }
        return undefined;
    };
    /** 清空 */
    Map.prototype.clear = function () {
        this._keys.length = 0;
        this._values.length = 0;
        return this;
    };
    /** 转换为对象 */
    Map.prototype.toObject = function () {
        var obj = {};
        for (var i = 0; i < this._keys.length; i++) {
            var key = this._keys[i];
            if (typeof key === 'string' || typeof key === 'number') {
                obj[String(key)] = this._values[i];
            }
        }
        return obj;
    };
    Map.prototype.toArray = function () {
        var result = [];
        for (var i = 0; i < this._keys.length; i++) {
            result.push({ key: this._keys[i], value: this._values[i] });
        }
        return result;
    };
    /** 遍历 */
    Map.prototype.each = function (func) {
        for (var i = 0; i < this._keys.length; i++) {
            func(this._values[i], this._keys[i]);
        }
        return this;
    };
    /** 复制 */
    Map.prototype.copy = function () {
        var result = new Map();
        result._keys = __spreadArray([], __read(this._keys), false);
        result._values = __spreadArray([], __read(this._values), false);
        return result;
    };
    /** 获取第一个键值对 */
    Map.prototype.first = function () {
        if (this._keys.length === 0)
            return null;
        return { key: this._keys[0], value: this._values[0] };
    };
    /** 获取最后一个键值对 */
    Map.prototype.last = function () {
        if (this._keys.length === 0)
            return null;
        var idx = this._keys.length - 1;
        return { key: this._keys[idx], value: this._values[idx] };
    };
    /** 添加另一个 Map 的所有条目 */
    Map.prototype.addAll = function (map) {
        var it = map.iterator;
        while (it.next()) {
            this.add(it.key, it.value);
        }
        return this;
    };
    /** 查找键索引 */
    Map.prototype._indexOf = function (key) {
        for (var i = 0; i < this._keys.length; i++) {
            if (this._keys[i] === key)
                return i;
        }
        return -1;
    };
    return Map;
}());
/**
 * MapIterator - Map 的迭代器
 */
var MapIterator = /** @class */ (function () {
    function MapIterator(keys, values) {
        this._index = -1;
        this._keys = keys;
        this._values = values;
    }
    Object.defineProperty(MapIterator.prototype, "key", {
        get: function () {
            if (this._index >= 0 && this._index < this._keys.length) {
                return this._keys[this._index];
            }
            throw new Error('Iterator is out of bounds');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MapIterator.prototype, "value", {
        get: function () {
            if (this._index >= 0 && this._index < this._values.length) {
                return this._values[this._index];
            }
            throw new Error('Iterator is out of bounds');
        },
        enumerable: false,
        configurable: true
    });
    MapIterator.prototype.next = function () {
        this._index++;
        return this._index < this._keys.length;
    };
    MapIterator.prototype.reset = function () {
        this._index = -1;
    };
    MapIterator.prototype.toArray = function () {
        return __spreadArray([], __read(this._values), false);
    };
    MapIterator.prototype.each = function (func) {
        for (var i = 0; i < this._values.length; i++) {
            func(this._values[i]);
        }
        return this;
    };
    return MapIterator;
}());
var MapKeyIterator = /** @class */ (function () {
    function MapKeyIterator(keys) {
        this._index = -1;
        this._keys = keys;
    }
    Object.defineProperty(MapKeyIterator.prototype, "value", {
        get: function () {
            if (this._index >= 0 && this._index < this._keys.length) {
                return this._keys[this._index];
            }
            throw new Error('Iterator is out of bounds');
        },
        enumerable: false,
        configurable: true
    });
    MapKeyIterator.prototype.next = function () {
        this._index++;
        return this._index < this._keys.length;
    };
    MapKeyIterator.prototype.reset = function () {
        this._index = -1;
    };
    MapKeyIterator.prototype.toArray = function () {
        return __spreadArray([], __read(this._keys), false);
    };
    MapKeyIterator.prototype.each = function (func) {
        for (var i = 0; i < this._keys.length; i++) {
            func(this._keys[i]);
        }
        return this;
    };
    return MapKeyIterator;
}());
var MapValueIterator = /** @class */ (function () {
    function MapValueIterator(values) {
        this._index = -1;
        this._values = values;
    }
    Object.defineProperty(MapValueIterator.prototype, "value", {
        get: function () {
            if (this._index >= 0 && this._index < this._values.length) {
                return this._values[this._index];
            }
            throw new Error('Iterator is out of bounds');
        },
        enumerable: false,
        configurable: true
    });
    MapValueIterator.prototype.next = function () {
        this._index++;
        return this._index < this._values.length;
    };
    MapValueIterator.prototype.reset = function () {
        this._index = -1;
    };
    MapValueIterator.prototype.toArray = function () {
        return __spreadArray([], __read(this._values), false);
    };
    MapValueIterator.prototype.each = function (func) {
        for (var i = 0; i < this._values.length; i++) {
            func(this._values[i]);
        }
        return this;
    };
    return MapValueIterator;
}());

/**
 * Set - 无序集合
 */
var Set = /** @class */ (function () {
    function Set(iterable) {
        var e_1, _a;
        this._data = [];
        if (iterable) {
            if (Array.isArray(iterable)) {
                try {
                    for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
                        var item = iterable_1_1.value;
                        this.add(item);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else if ('iterator' in iterable) {
                var it = iterable.iterator;
                while (it.next()) {
                    this.add(it.value);
                }
            }
        }
    }
    Object.defineProperty(Set.prototype, "count", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set.prototype, "size", {
        get: function () {
            return this._data.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set.prototype, "iterator", {
        get: function () {
            return new SetIterator(this._data);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Set.prototype, "isEmpty", {
        get: function () {
            return this._data.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加元素 */
    Set.prototype.add = function (item) {
        if (!this.contains(item)) {
            this._data.push(item);
        }
        return this;
    };
    /** 移除元素 */
    Set.prototype.remove = function (item) {
        var idx = this._indexOf(item);
        if (idx >= 0) {
            this._data.splice(idx, 1);
            return true;
        }
        return false;
    };
    /** 删除元素（同 remove） */
    Set.prototype.delete = function (item) {
        return this.remove(item);
    };
    /** 是否包含元素 */
    Set.prototype.contains = function (item) {
        return this._indexOf(item) >= 0;
    };
    /** 是否包含元素（同 contains） */
    Set.prototype.has = function (item) {
        return this.contains(item);
    };
    /** 清空 */
    Set.prototype.clear = function () {
        this._data.length = 0;
        return this;
    };
    /** 转换为数组 */
    Set.prototype.toArray = function () {
        return __spreadArray([], __read(this._data), false);
    };
    /** 遍历 */
    Set.prototype.each = function (func) {
        for (var i = 0; i < this._data.length; i++) {
            func(this._data[i]);
        }
        return this;
    };
    /** 映射 */
    Set.prototype.map = function (func) {
        var result = new Set();
        for (var i = 0; i < this._data.length; i++) {
            result.add(func(this._data[i]));
        }
        return result;
    };
    /** 过滤 */
    Set.prototype.filter = function (func) {
        var result = new Set();
        for (var i = 0; i < this._data.length; i++) {
            if (func(this._data[i])) {
                result.add(this._data[i]);
            }
        }
        return result;
    };
    /** 并集 */
    Set.prototype.union = function (other) {
        var result = this.copy();
        var it = other.iterator;
        while (it.next()) {
            result.add(it.value);
        }
        return result;
    };
    /** 交集 */
    Set.prototype.intersect = function (other) {
        var result = new Set();
        var it = this.iterator;
        while (it.next()) {
            if (other.contains(it.value)) {
                result.add(it.value);
            }
        }
        return result;
    };
    /** 差集 */
    Set.prototype.subtract = function (other) {
        var result = new Set();
        var it = this.iterator;
        while (it.next()) {
            if (!other.contains(it.value)) {
                result.add(it.value);
            }
        }
        return result;
    };
    /** 复制 */
    Set.prototype.copy = function () {
        var result = new Set();
        result._data = __spreadArray([], __read(this._data), false);
        return result;
    };
    Set.prototype._indexOf = function (item) {
        for (var i = 0; i < this._data.length; i++) {
            if (this._data[i] === item)
                return i;
        }
        return -1;
    };
    return Set;
}());
/**
 * SetIterator
 */
var SetIterator = /** @class */ (function () {
    function SetIterator(data) {
        this._index = -1;
        this._data = data;
    }
    Object.defineProperty(SetIterator.prototype, "value", {
        get: function () {
            if (this._index >= 0 && this._index < this._data.length) {
                return this._data[this._index];
            }
            throw new Error('Iterator is out of bounds');
        },
        enumerable: false,
        configurable: true
    });
    SetIterator.prototype.next = function () {
        this._index++;
        return this._index < this._data.length;
    };
    SetIterator.prototype.reset = function () {
        this._index = -1;
    };
    SetIterator.prototype.toArray = function () {
        return __spreadArray([], __read(this._data), false);
    };
    SetIterator.prototype.each = function (func) {
        for (var i = 0; i < this._data.length; i++) {
            func(this._data[i]);
        }
        return this;
    };
    return SetIterator;
}());

/**
 * Point - 二维点
 */
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        /** 是否为只读 */
        this._isReadOnly = false;
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Point.prototype, "isReadOnly", {
        get: function () {
            return this._isReadOnly;
        },
        enumerable: false,
        configurable: true
    });
    /** 设置为只读 */
    Point.prototype.freeze = function () {
        this._isReadOnly = true;
        return this;
    };
    /** 设置坐标 */
    Point.prototype.set = function (x, y) {
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Point');
        this.x = x;
        this.y = y;
        return this;
    };
    /** 复制 */
    Point.prototype.copy = function () {
        return new Point(this.x, this.y);
    };
    /** 是否等于另一个点 */
    Point.prototype.equals = function (p) {
        return p instanceof Point && this.x === p.x && this.y === p.y;
    };
    /** 近似相等 */
    Point.prototype.approximatelyEquals = function (p, epsilon) {
        if (epsilon === void 0) { epsilon = 0.5; }
        return Math.abs(this.x - p.x) < epsilon && Math.abs(this.y - p.y) < epsilon;
    };
    /** 加法 */
    Point.prototype.add = function (p) {
        return new Point(this.x + p.x, this.y + p.y);
    };
    /** 减法 */
    Point.prototype.subtract = function (p) {
        return new Point(this.x - p.x, this.y - p.y);
    };
    /** 乘以标量 */
    Point.prototype.multiply = function (s) {
        return new Point(this.x * s, this.y * s);
    };
    /** 除以标量 */
    Point.prototype.divide = function (s) {
        return new Point(this.x / s, this.y / s);
    };
    Object.defineProperty(Point.prototype, "length", {
        /** 向量长度 */
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        enumerable: false,
        configurable: true
    });
    /** 距离另一个点 */
    Point.prototype.distanceTo = function (p) {
        var dx = this.x - p.x;
        var dy = this.y - p.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /** 方向角（弧度） */
    Point.prototype.direction = function () {
        return Math.atan2(this.y, this.x);
    };
    /** 到另一个点的方向角（弧度） */
    Point.prototype.directionTo = function (p) {
        return Math.atan2(p.y - this.y, p.x - this.x);
    };
    /** 归一化 */
    Point.prototype.normalize = function () {
        var len = this.length;
        if (len === 0)
            return new Point(0, 0);
        return new Point(this.x / len, this.y / len);
    };
    /** 旋转（弧度） */
    Point.prototype.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        return new Point(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    };
    /** 点积 */
    Point.prototype.dot = function (p) {
        return this.x * p.x + this.y * p.y;
    };
    /** 叉积 */
    Point.prototype.cross = function (p) {
        return this.x * p.y - this.y * p.x;
    };
    /** 线性插值 */
    Point.lerp = function (p1, p2, t) {
        return new Point(p1.x + (p2.x - p1.x) * t, p1.y + (p2.y - p1.y) * t);
    };
    /** 从字符串解析 "x y" */
    Point.parse = function (str) {
        var parts = str.trim().split(/\s+/);
        return new Point(parseFloat(parts[0]), parseFloat(parts[1]));
    };
    /** 转换为字符串 */
    Point.prototype.toString = function () {
        return "".concat(this.x, " ").concat(this.y);
    };
    Point.stringify = function (p) {
        return p.x + ' ' + p.y;
    };
    Point.stringifyFixed = function (digits) {
        return function (p) {
            return p.x.toFixed(digits) + ' ' + p.y.toFixed(digits);
        };
    };
    Point.isPoint = function (p) {
        return p instanceof Point;
    };
    /** 原点 */
    Point.Zero = Object.freeze(new Point(0, 0));
    return Point;
}());

/**
 * Size - 尺寸
 */
var Size = /** @class */ (function () {
    function Size(width, height) {
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this._isReadOnly = false;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Size.prototype, "isReadOnly", {
        get: function () {
            return this._isReadOnly;
        },
        enumerable: false,
        configurable: true
    });
    Size.prototype.freeze = function () {
        this._isReadOnly = true;
        return this;
    };
    Size.prototype.set = function (width, height) {
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Size');
        this.width = width;
        this.height = height;
        return this;
    };
    Size.prototype.copy = function () {
        return new Size(this.width, this.height);
    };
    Size.prototype.equals = function (s) {
        return s instanceof Size && this.width === s.width && this.height === s.height;
    };
    Size.prototype.approximatelyEquals = function (s, epsilon) {
        if (epsilon === void 0) { epsilon = 0.5; }
        return Math.abs(this.width - s.width) < epsilon && Math.abs(this.height - s.height) < epsilon;
    };
    Object.defineProperty(Size.prototype, "isEmpty", {
        /** 是否为空（宽或高为0） */
        get: function () {
            return this.width <= 0 || this.height <= 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Size.prototype, "isReal", {
        /** 是否有效（宽和高非负） */
        get: function () {
            return isFinite(this.width) && isFinite(this.height) && this.width >= 0 && this.height >= 0;
        },
        enumerable: false,
        configurable: true
    });
    /** 加法 */
    Size.prototype.add = function (s) {
        return new Size(this.width + s.width, this.height + s.height);
    };
    /** 减法 */
    Size.prototype.subtract = function (s) {
        return new Size(this.width - s.width, this.height - s.height);
    };
    /** 乘以标量 */
    Size.prototype.multiply = function (s) {
        return new Size(this.width * s, this.height * s);
    };
    /** 除以标量 */
    Size.prototype.divide = function (s) {
        return new Size(this.width / s, this.height / s);
    };
    /** 从字符串解析 "w h" */
    Size.parse = function (str) {
        var parts = str.trim().split(/\s+/);
        return new Size(parseFloat(parts[0]), parseFloat(parts[1]));
    };
    Size.prototype.toString = function () {
        return "".concat(this.width, " ").concat(this.height);
    };
    Size.stringify = function (s) {
        return s.width + ' ' + s.height;
    };
    Size.isSize = function (s) {
        return s instanceof Size;
    };
    Size.Zero = Object.freeze(new Size(0, 0));
    Size.NaN = Object.freeze(new Size(NaN, NaN));
    return Size;
}());

/**
 * Rect - 矩形
 */
var Rect = /** @class */ (function () {
    function Rect(xOrPoint, yOrSize, width, height) {
        this._isReadOnly = false;
        if (xOrPoint instanceof Point) {
            this.x = xOrPoint.x;
            this.y = xOrPoint.y;
            if (yOrSize instanceof Size) {
                this.width = yOrSize.width;
                this.height = yOrSize.height;
            }
            else {
                this.width = 0;
                this.height = 0;
            }
        }
        else {
            this.x = xOrPoint || 0;
            this.y = (typeof yOrSize === 'number' ? yOrSize : 0);
            this.width = width || 0;
            this.height = height || 0;
        }
    }
    Object.defineProperty(Rect.prototype, "isReadOnly", {
        get: function () {
            return this._isReadOnly;
        },
        enumerable: false,
        configurable: true
    });
    Rect.prototype.freeze = function () {
        this._isReadOnly = true;
        return this;
    };
    Rect.prototype.set = function (x, y, width, height) {
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Rect');
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        return this;
    };
    Rect.prototype.copy = function () {
        return new Rect(this.x, this.y, this.width, this.height);
    };
    Rect.prototype.equals = function (r) {
        return r instanceof Rect &&
            this.x === r.x && this.y === r.y &&
            this.width === r.width && this.height === r.height;
    };
    Rect.prototype.approximatelyEquals = function (r, epsilon) {
        if (epsilon === void 0) { epsilon = 0.5; }
        return Math.abs(this.x - r.x) < epsilon &&
            Math.abs(this.y - r.y) < epsilon &&
            Math.abs(this.width - r.width) < epsilon &&
            Math.abs(this.height - r.height) < epsilon;
    };
    Object.defineProperty(Rect.prototype, "left", {
        /** 左边 */
        get: function () {
            return this.x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "top", {
        /** 顶边 */
        get: function () {
            return this.y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        /** 右边 */
        get: function () {
            return this.x + this.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        /** 底边 */
        get: function () {
            return this.y + this.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "center", {
        /** 中心点 */
        get: function () {
            return new Point(this.x + this.width / 2, this.y + this.height / 2);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "position", {
        /** 左上角 */
        get: function () {
            return new Point(this.x, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "size", {
        /** 尺寸 */
        get: function () {
            return new Size(this.width, this.height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "isEmpty", {
        /** 是否为空 */
        get: function () {
            return this.width <= 0 || this.height <= 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "isReal", {
        /** 是否有效 */
        get: function () {
            return isFinite(this.x) && isFinite(this.y) &&
                isFinite(this.width) && isFinite(this.height);
        },
        enumerable: false,
        configurable: true
    });
    /** 是否包含点 */
    Rect.prototype.containsPoint = function (p) {
        return p.x >= this.x && p.x <= this.right &&
            p.y >= this.y && p.y <= this.bottom;
    };
    /** 是否包含矩形 */
    Rect.prototype.containsRect = function (r) {
        return r.x >= this.x && r.y >= this.y &&
            r.right <= this.right && r.bottom <= this.bottom;
    };
    /** 与另一个矩形相交 */
    Rect.prototype.intersect = function (r) {
        var x = Math.max(this.x, r.x);
        var y = Math.max(this.y, r.y);
        var right = Math.min(this.right, r.right);
        var bottom = Math.min(this.bottom, r.bottom);
        if (right < x || bottom < y) {
            return new Rect(x, y, 0, 0);
        }
        return new Rect(x, y, right - x, bottom - y);
    };
    /** 与另一个矩形合并 */
    Rect.prototype.union = function (r) {
        var x = Math.min(this.x, r.x);
        var y = Math.min(this.y, r.y);
        var right = Math.max(this.right, r.right);
        var bottom = Math.max(this.bottom, r.bottom);
        return new Rect(x, y, right - x, bottom - y);
    };
    /** 是否与另一个矩形相交 */
    Rect.prototype.intersects = function (r) {
        return !(r.x > this.right || r.right < this.x ||
            r.y > this.bottom || r.bottom < this.y);
    };
    Rect.prototype.inflate = function (dx, dy) {
        var dyy = dy !== undefined ? dy : dx;
        return new Rect(this.x - dx, this.y - dyy, this.width + dx * 2, this.height + dyy * 2);
    };
    /** 偏移 */
    Rect.prototype.offset = function (dx, dy) {
        return new Rect(this.x + dx, this.y + dy, this.width, this.height);
    };
    /** 设置位置 */
    Rect.prototype.setPosition = function (p) {
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Rect');
        this.x = p.x;
        this.y = p.y;
        return this;
    };
    /** 设置尺寸 */
    Rect.prototype.setSize = function (s) {
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Rect');
        this.width = s.width;
        this.height = s.height;
        return this;
    };
    /** 从字符串解析 "x y w h" */
    Rect.parse = function (str) {
        var parts = str.trim().split(/\s+/);
        return new Rect(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
    };
    Rect.prototype.toString = function () {
        return "".concat(this.x, " ").concat(this.y, " ").concat(this.width, " ").concat(this.height);
    };
    Rect.isRect = function (r) {
        return r instanceof Rect;
    };
    Rect.Zero = Object.freeze(new Rect(0, 0, 0, 0));
    Rect.NaN = Object.freeze(new Rect(NaN, NaN, NaN, NaN));
    return Rect;
}());

/**
 * Spot - 定位点
 * 用归一化坐标 (0-1) + 偏移量表示一个位置
 */
var Spot = /** @class */ (function () {
    function Spot(x, y, offsetX, offsetY) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        this._isReadOnly = false;
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    Object.defineProperty(Spot.prototype, "isReadOnly", {
        get: function () {
            return this._isReadOnly;
        },
        enumerable: false,
        configurable: true
    });
    Spot.prototype.freeze = function () {
        this._isReadOnly = true;
        return this;
    };
    Spot.prototype.set = function (x, y, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Spot');
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        return this;
    };
    Spot.prototype.copy = function () {
        return new Spot(this.x, this.y, this.offsetX, this.offsetY);
    };
    Spot.prototype.equals = function (s) {
        return s instanceof Spot &&
            this.x === s.x && this.y === s.y &&
            this.offsetX === s.offsetX && this.offsetY === s.offsetY;
    };
    Spot.prototype.approximatelyEquals = function (s, epsilon) {
        if (epsilon === void 0) { epsilon = 0.5; }
        return Math.abs(this.x - s.x) < epsilon &&
            Math.abs(this.y - s.y) < epsilon &&
            Math.abs(this.offsetX - s.offsetX) < epsilon &&
            Math.abs(this.offsetY - s.offsetY) < epsilon;
    };
    Object.defineProperty(Spot.prototype, "isDefault", {
        /** 是否为默认值 */
        get: function () {
            return this.x === 0 && this.y === 0 && this.offsetX === 0 && this.offsetY === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spot.prototype, "isNone", {
        /** 是否为无特殊位置 */
        get: function () {
            return isNaN(this.x) && isNaN(this.y);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Spot.prototype, "hasNoOffset", {
        /** 是否无偏移 */
        get: function () {
            return this.offsetX === 0 && this.offsetY === 0;
        },
        enumerable: false,
        configurable: true
    });
    /** 在给定矩形中的实际坐标 */
    Spot.prototype.positionInRect = function (r) {
        return {
            x: r.x + this.x * r.width + this.offsetX,
            y: r.y + this.y * r.height + this.offsetY,
        };
    };
    Spot.prototype.toString = function () {
        if (this.offsetX === 0 && this.offsetY === 0) {
            return "".concat(this.x, " ").concat(this.y);
        }
        return "".concat(this.x, " ").concat(this.y, " ").concat(this.offsetX, " ").concat(this.offsetY);
    };
    Spot.parse = function (str) {
        var parts = str.split(/\s+/);
        var x = parseFloat(parts[0]);
        var y = parseFloat(parts[1]);
        var ox = parts.length > 2 ? parseFloat(parts[2]) : 0;
        var oy = parts.length > 3 ? parseFloat(parts[3]) : 0;
        return new Spot(x, y, ox, oy);
    };
    Spot.stringify = function (s) {
        return s.x + ' ' + s.y + ' ' + s.offsetX + ' ' + s.offsetY;
    };
    Spot.isSpot = function (s) {
        return s instanceof Spot;
    };
    // ============ 预定义常量 ============
    Spot.TopLeft = Object.freeze(new Spot(0, 0));
    Spot.Top = Object.freeze(new Spot(0.5, 0));
    Spot.TopCenter = Object.freeze(new Spot(0.5, 0));
    Spot.TopRight = Object.freeze(new Spot(1, 0));
    Spot.Left = Object.freeze(new Spot(0, 0.5));
    Spot.CenterLeft = Object.freeze(new Spot(0, 0.5));
    Spot.Center = Object.freeze(new Spot(0.5, 0.5));
    Spot.CenterRight = Object.freeze(new Spot(1, 0.5));
    Spot.Right = Object.freeze(new Spot(1, 0.5));
    Spot.BottomLeft = Object.freeze(new Spot(0, 1));
    Spot.Bottom = Object.freeze(new Spot(0.5, 1));
    Spot.BottomCenter = Object.freeze(new Spot(0.5, 1));
    Spot.BottomRight = Object.freeze(new Spot(1, 1));
    Spot.Default = Object.freeze(new Spot(0, 0));
    Spot.None = Object.freeze(new Spot(NaN, NaN));
    Spot.TopSide = Object.freeze(new Spot(0.5, 0, 0, -1));
    Spot.BottomSide = Object.freeze(new Spot(0.5, 1, 0, 1));
    Spot.LeftSide = Object.freeze(new Spot(0, 0.5, -1, 0));
    Spot.RightSide = Object.freeze(new Spot(1, 0.5, 1, 0));
    Spot.TopLeftSides = Object.freeze(new Spot(0, 0, -1, -1));
    Spot.TopRightSides = Object.freeze(new Spot(1, 0, 1, -1));
    Spot.BottomLeftSides = Object.freeze(new Spot(0, 1, -1, 1));
    Spot.BottomRightSides = Object.freeze(new Spot(1, 1, 1, 1));
    Spot.LeftRightSides = Object.freeze(new Spot(0.5, 0.5, 0, 0));
    Spot.TopBottomSides = Object.freeze(new Spot(0.5, 0.5, 0, 0));
    Spot.AllSides = Object.freeze(new Spot(0.5, 0.5, 0, 0));
    return Spot;
}());

/**
 * Margin - 边距（上右下左）
 */
var Margin = /** @class */ (function () {
    function Margin(topBottom, right, bottom, left) {
        if (topBottom === void 0) { topBottom = 0; }
        this._isReadOnly = false;
        if (right === undefined) {
            this.top = topBottom;
            this.right = topBottom;
            this.bottom = topBottom;
            this.left = topBottom;
        }
        else {
            this.top = topBottom;
            this.right = right;
            this.bottom = bottom !== undefined ? bottom : topBottom;
            this.left = left !== undefined ? left : right;
        }
    }
    Object.defineProperty(Margin.prototype, "isReadOnly", {
        get: function () {
            return this._isReadOnly;
        },
        enumerable: false,
        configurable: true
    });
    Margin.prototype.freeze = function () {
        this._isReadOnly = true;
        return this;
    };
    Margin.prototype.set = function (top, right, bottom, left) {
        if (this._isReadOnly)
            throw new Error('Cannot modify readonly Margin');
        if (right === undefined) {
            this.top = top;
            this.right = top;
            this.bottom = top;
            this.left = top;
        }
        else {
            this.top = top;
            this.right = right;
            this.bottom = bottom !== undefined ? bottom : top;
            this.left = left !== undefined ? left : right;
        }
        return this;
    };
    Margin.prototype.copy = function () {
        return new Margin(this.top, this.right, this.bottom, this.left);
    };
    Margin.prototype.equals = function (m) {
        return m instanceof Margin &&
            this.top === m.top && this.right === m.right &&
            this.bottom === m.bottom && this.left === m.left;
    };
    Object.defineProperty(Margin.prototype, "isZero", {
        /** 是否所有边距都为0 */
        get: function () {
            return this.top === 0 && this.right === 0 && this.bottom === 0 && this.left === 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Margin.prototype, "horizontal", {
        /** 水平边距总和 */
        get: function () {
            return this.left + this.right;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Margin.prototype, "vertical", {
        /** 垂直边距总和 */
        get: function () {
            return this.top + this.bottom;
        },
        enumerable: false,
        configurable: true
    });
    /** 加法 */
    Margin.prototype.add = function (m) {
        return new Margin(this.top + m.top, this.right + m.right, this.bottom + m.bottom, this.left + m.left);
    };
    /** 减法 */
    Margin.prototype.subtract = function (m) {
        return new Margin(this.top - m.top, this.right - m.right, this.bottom - m.bottom, this.left - m.left);
    };
    /** 从字符串解析 "t r b l" 或 "all" */
    Margin.parse = function (str) {
        var parts = str.trim().split(/\s+/);
        if (parts.length === 1) {
            return new Margin(parseFloat(parts[0]));
        }
        else if (parts.length === 4) {
            return new Margin(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
        }
        throw new Error('Invalid Margin string: ' + str);
    };
    Margin.prototype.toString = function () {
        if (this.top === this.right && this.right === this.bottom && this.bottom === this.left) {
            return "".concat(this.top);
        }
        return "".concat(this.top, " ").concat(this.right, " ").concat(this.bottom, " ").concat(this.left);
    };
    Margin.isMargin = function (m) {
        return m instanceof Margin;
    };
    Margin.Zero = Object.freeze(new Margin(0));
    return Margin;
}());

/**
 * PathFigure - 路径图形（起点 + 段集合）
 */
var PathFigure = /** @class */ (function () {
    function PathFigure(startX, startY, isFilled) {
        if (startX === void 0) { startX = 0; }
        if (startY === void 0) { startY = 0; }
        if (isFilled === void 0) { isFilled = true; }
        this.startX = startX;
        this.startY = startY;
        this.isFilled = isFilled;
        this.isShadowed = false;
        this._segments = new List();
    }
    Object.defineProperty(PathFigure.prototype, "segments", {
        /** 获取段集合 */
        get: function () {
            return this._segments;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加段 */
    PathFigure.prototype.add = function (seg) {
        this._segments.add(seg);
        return this;
    };
    /** 移除段 */
    PathFigure.prototype.remove = function (seg) {
        return this._segments.remove(seg);
    };
    /** 清空段 */
    PathFigure.prototype.clear = function () {
        this._segments.clear();
        return this;
    };
    PathFigure.prototype.copy = function () {
        var fig = new PathFigure(this.startX, this.startY, this.isFilled);
        fig.isShadowed = this.isShadowed;
        var it = this._segments.iterator;
        while (it.next()) {
            fig.add(it.value.copy());
        }
        return fig;
    };
    PathFigure.prototype.equals = function (fig) {
        if (!(fig instanceof PathFigure))
            return false;
        if (this.startX !== fig.startX || this.startY !== fig.startY)
            return false;
        if (this._segments.count !== fig._segments.count)
            return false;
        var it1 = this._segments.iterator;
        var it2 = fig._segments.iterator;
        while (it1.next() && it2.next()) {
            if (!it1.value.equals(it2.value))
                return false;
        }
        return true;
    };
    return PathFigure;
}());

/**
 * PathSegment - 路径段
 */
var PathSegment = /** @class */ (function () {
    function PathSegment(type, endX, endY, x1, y1, x2, y2) {
        if (type === void 0) { type = PathSegmentLine; }
        if (endX === void 0) { endX = 0; }
        if (endY === void 0) { endY = 0; }
        if (x1 === void 0) { x1 = NaN; }
        if (y1 === void 0) { y1 = NaN; }
        if (x2 === void 0) { x2 = NaN; }
        if (y2 === void 0) { y2 = NaN; }
        this.type = type;
        this.endX = endX;
        this.endY = endY;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.isClosed = false;
        this.radiusX = 0;
        this.radiusY = 0;
        this.xAxisRotation = 0;
        this.largeArc = false;
        this.clockwise = false;
        this.isRelative = false;
    }
    PathSegment.prototype.copy = function () {
        var seg = new PathSegment(this.type, this.endX, this.endY, this.x1, this.y1, this.x2, this.y2);
        seg.isClosed = this.isClosed;
        seg.radiusX = this.radiusX;
        seg.radiusY = this.radiusY;
        seg.xAxisRotation = this.xAxisRotation;
        seg.largeArc = this.largeArc;
        seg.clockwise = this.clockwise;
        seg.isRelative = this.isRelative;
        return seg;
    };
    PathSegment.prototype.equals = function (seg) {
        return seg instanceof PathSegment &&
            this.type === seg.type &&
            this.endX === seg.endX && this.endY === seg.endY &&
            this.x1 === seg.x1 && this.y1 === seg.y1 &&
            this.x2 === seg.x2 && this.y2 === seg.y2;
    };
    /** 创建直线段 */
    PathSegment.Line = function (endX, endY) {
        return new PathSegment(PathSegmentLine, endX, endY);
    };
    /** 创建二次贝塞尔曲线段 */
    PathSegment.QuadraticBezier = function (endX, endY, x1, y1) {
        return new PathSegment(PathSegmentQuadraticBezier, endX, endY, x1, y1);
    };
    /** 创建三次贝塞尔曲线段 */
    PathSegment.CubicBezier = function (endX, endY, x1, y1, x2, y2) {
        return new PathSegment(PathSegmentCubicBezier, endX, endY, x1, y1, x2, y2);
    };
    /** 创建圆弧段 */
    PathSegment.Arc = function (endX, endY, radiusX, radiusY, xAxisRotation, largeArc, clockwise) {
        if (xAxisRotation === void 0) { xAxisRotation = 0; }
        if (largeArc === void 0) { largeArc = false; }
        if (clockwise === void 0) { clockwise = false; }
        var seg = new PathSegment(PathSegmentArc, endX, endY);
        seg.radiusX = radiusX;
        seg.radiusY = radiusY;
        seg.xAxisRotation = xAxisRotation;
        seg.largeArc = largeArc;
        seg.clockwise = clockwise;
        return seg;
    };
    /** 创建移动段 */
    PathSegment.MoveTo = function (x, y) {
        return new PathSegment(PathSegmentMoveTo, x, y);
    };
    PathSegment.prototype.close = function () {
        this.isClosed = true;
        return this;
    };
    /** 创建闭合段 */
    PathSegment.Close = function () {
        var seg = new PathSegment(PathSegmentClose);
        seg.isClosed = true;
        return seg;
    };
    return PathSegment;
}());

/**
 * Geometry - 几何路径定义
 */
var Geometry = /** @class */ (function () {
    function Geometry(figures) {
        var e_1, _a;
        /** 边界矩形 */
        this._bounds = null;
        /** 是否包含奇偶填充 */
        this.fillRule = 'evenodd';
        /** 图形名称（用于 figure 属性） */
        this.name = '';
        this._figures = new List();
        this._defaultFigure = new PathFigure();
        if (figures) {
            if (Array.isArray(figures)) {
                try {
                    for (var figures_1 = __values(figures), figures_1_1 = figures_1.next(); !figures_1_1.done; figures_1_1 = figures_1.next()) {
                        var fig = figures_1_1.value;
                        this.add(fig);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (figures_1_1 && !figures_1_1.done && (_a = figures_1.return)) _a.call(figures_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                this.add(figures);
            }
        }
    }
    Object.defineProperty(Geometry.prototype, "defaultFigure", {
        /** 获取默认图形 */
        get: function () {
            if (this._figures.count === 0) {
                this.add(this._defaultFigure);
            }
            return this._defaultFigure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Geometry.prototype, "figures", {
        /** 获取图形集合 */
        get: function () {
            return this._figures;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加图形 */
    Geometry.prototype.add = function (fig) {
        this._figures.add(fig);
        if (this._figures.count === 1) {
            this._defaultFigure = fig;
        }
        this._bounds = null;
        return this;
    };
    Geometry.prototype.set = function (props) {
        if (!props)
            return this;
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key in this) {
                this[key] = props[key];
            }
        }
        return this;
    };
    /** 移除图形 */
    Geometry.prototype.remove = function (fig) {
        var result = this._figures.remove(fig);
        this._bounds = null;
        return result;
    };
    /** 清空图形 */
    Geometry.prototype.clear = function () {
        this._figures.clear();
        this._bounds = null;
        return this;
    };
    Object.defineProperty(Geometry.prototype, "bounds", {
        /** 获取边界矩形 */
        get: function () {
            if (this._bounds === null) {
                this._bounds = this.computeBounds();
            }
            return this._bounds;
        },
        enumerable: false,
        configurable: true
    });
    /** 计算边界矩形 */
    Geometry.prototype.computeBounds = function () {
        var minX = Infinity, minY = Infinity;
        var maxX = -Infinity, maxY = -Infinity;
        var it = this._figures.iterator;
        while (it.next()) {
            var fig = it.value;
            // 起点
            minX = Math.min(minX, fig.startX);
            minY = Math.min(minY, fig.startY);
            maxX = Math.max(maxX, fig.startX);
            maxY = Math.max(maxY, fig.startY);
            // 段
            var segIt = fig.segments.iterator;
            while (segIt.next()) {
                var seg = segIt.value;
                if (seg.type._name === 'Close')
                    continue;
                minX = Math.min(minX, seg.endX);
                minY = Math.min(minY, seg.endY);
                maxX = Math.max(maxX, seg.endX);
                maxY = Math.max(maxY, seg.endY);
                if (!isNaN(seg.x1)) {
                    minX = Math.min(minX, seg.x1);
                    minY = Math.min(minY, seg.y1);
                    maxX = Math.max(maxX, seg.x1);
                    maxY = Math.max(maxY, seg.y1);
                }
                if (!isNaN(seg.x2)) {
                    minX = Math.min(minX, seg.x2);
                    minY = Math.min(minY, seg.y2);
                    maxX = Math.max(maxX, seg.x2);
                    maxY = Math.max(maxY, seg.y2);
                }
            }
        }
        if (!isFinite(minX)) {
            return new Rect(0, 0, 0, 0);
        }
        return new Rect(minX, minY, maxX - minX, maxY - minY);
    };
    Geometry.prototype.copy = function () {
        var geo = new Geometry();
        geo.fillRule = this.fillRule;
        geo.name = this.name;
        var it = this._figures.iterator;
        while (it.next()) {
            geo.add(it.value.copy());
        }
        return geo;
    };
    Geometry.prototype.equals = function (geo) {
        if (!(geo instanceof Geometry))
            return false;
        if (this._figures.count !== geo._figures.count)
            return false;
        var it1 = this._figures.iterator;
        var it2 = geo._figures.iterator;
        while (it1.next() && it2.next()) {
            if (!it1.value.equals(it2.value))
                return false;
        }
        return true;
    };
    /** 从 SVG 路径字符串解析 */
    Geometry.parse = function (str) {
        var e_2, _a, e_3, _b, e_4, _c, e_5, _d, e_6, _e;
        var geo = new Geometry();
        var fig = new PathFigure(0, 0);
        geo.add(fig);
        // 简化的 SVG 路径解析
        var commands = str.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g);
        if (!commands)
            return geo;
        var curX = 0, curY = 0;
        try {
            for (var commands_1 = __values(commands), commands_1_1 = commands_1.next(); !commands_1_1.done; commands_1_1 = commands_1.next()) {
                var cmd = commands_1_1.value;
                var type = cmd[0];
                var args = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter(function (n) { return !isNaN(n); });
                switch (type) {
                    case 'M':
                        curX = args[0];
                        curY = args[1];
                        fig.startX = curX;
                        fig.startY = curY;
                        for (var i = 2; i < args.length; i += 2) {
                            curX = args[i];
                            curY = args[i + 1];
                            fig.add(PathSegment.Line(curX, curY));
                        }
                        break;
                    case 'm':
                        curX += args[0];
                        curY += args[1];
                        fig.startX = curX;
                        fig.startY = curY;
                        for (var i = 2; i < args.length; i += 2) {
                            curX += args[i];
                            curY += args[i + 1];
                            fig.add(PathSegment.Line(curX, curY));
                        }
                        break;
                    case 'L':
                        for (var i = 0; i < args.length; i += 2) {
                            curX = args[i];
                            curY = args[i + 1];
                            fig.add(PathSegment.Line(curX, curY));
                        }
                        break;
                    case 'l':
                        for (var i = 0; i < args.length; i += 2) {
                            curX += args[i];
                            curY += args[i + 1];
                            fig.add(PathSegment.Line(curX, curY));
                        }
                        break;
                    case 'H':
                        try {
                            for (var args_1 = (e_3 = void 0, __values(args)), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                                var x = args_1_1.value;
                                curX = x;
                                fig.add(PathSegment.Line(curX, curY));
                            }
                        }
                        catch (e_3_1) { e_3 = { error: e_3_1 }; }
                        finally {
                            try {
                                if (args_1_1 && !args_1_1.done && (_b = args_1.return)) _b.call(args_1);
                            }
                            finally { if (e_3) throw e_3.error; }
                        }
                        break;
                    case 'h':
                        try {
                            for (var args_2 = (e_4 = void 0, __values(args)), args_2_1 = args_2.next(); !args_2_1.done; args_2_1 = args_2.next()) {
                                var dx = args_2_1.value;
                                curX += dx;
                                fig.add(PathSegment.Line(curX, curY));
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (args_2_1 && !args_2_1.done && (_c = args_2.return)) _c.call(args_2);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                        break;
                    case 'V':
                        try {
                            for (var args_3 = (e_5 = void 0, __values(args)), args_3_1 = args_3.next(); !args_3_1.done; args_3_1 = args_3.next()) {
                                var y = args_3_1.value;
                                curY = y;
                                fig.add(PathSegment.Line(curX, curY));
                            }
                        }
                        catch (e_5_1) { e_5 = { error: e_5_1 }; }
                        finally {
                            try {
                                if (args_3_1 && !args_3_1.done && (_d = args_3.return)) _d.call(args_3);
                            }
                            finally { if (e_5) throw e_5.error; }
                        }
                        break;
                    case 'v':
                        try {
                            for (var args_4 = (e_6 = void 0, __values(args)), args_4_1 = args_4.next(); !args_4_1.done; args_4_1 = args_4.next()) {
                                var dy = args_4_1.value;
                                curY += dy;
                                fig.add(PathSegment.Line(curX, curY));
                            }
                        }
                        catch (e_6_1) { e_6 = { error: e_6_1 }; }
                        finally {
                            try {
                                if (args_4_1 && !args_4_1.done && (_e = args_4.return)) _e.call(args_4);
                            }
                            finally { if (e_6) throw e_6.error; }
                        }
                        break;
                    case 'C':
                        for (var i = 0; i < args.length; i += 6) {
                            fig.add(PathSegment.CubicBezier(args[i + 4], args[i + 5], args[i], args[i + 1], args[i + 2], args[i + 3]));
                            curX = args[i + 4];
                            curY = args[i + 5];
                        }
                        break;
                    case 'c':
                        for (var i = 0; i < args.length; i += 6) {
                            fig.add(PathSegment.CubicBezier(curX + args[i + 4], curY + args[i + 5], curX + args[i], curY + args[i + 1], curX + args[i + 2], curY + args[i + 3]));
                            curX += args[i + 4];
                            curY += args[i + 5];
                        }
                        break;
                    case 'Q':
                        for (var i = 0; i < args.length; i += 4) {
                            fig.add(PathSegment.QuadraticBezier(args[i + 2], args[i + 3], args[i], args[i + 1]));
                            curX = args[i + 2];
                            curY = args[i + 3];
                        }
                        break;
                    case 'q':
                        for (var i = 0; i < args.length; i += 4) {
                            fig.add(PathSegment.QuadraticBezier(curX + args[i + 2], curY + args[i + 3], curX + args[i], curY + args[i + 1]));
                            curX += args[i + 2];
                            curY += args[i + 3];
                        }
                        break;
                    case 'A':
                        for (var i = 0; i < args.length; i += 7) {
                            fig.add(PathSegment.Arc(args[i + 5], args[i + 6], args[i], args[i + 1], args[i + 2], args[i + 3] !== 0, args[i + 4] !== 0));
                            curX = args[i + 5];
                            curY = args[i + 6];
                        }
                        break;
                    case 'Z':
                    case 'z':
                        fig.add(PathSegment.Close());
                        break;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (commands_1_1 && !commands_1_1.done && (_a = commands_1.return)) _a.call(commands_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return geo;
    };
    /** 从 GoJS 几何字符串格式解析 */
    Geometry.parseString = function (str, width, height) {
        if (!str || str.trim() === '')
            return new Geometry();
        var geo = new Geometry();
        var currentFig = null;
        var isFilled = true;
        var tokens = str.trim().split(/\s+/);
        var i = 0;
        while (i < tokens.length) {
            var cmd = tokens[i];
            if (cmd === 'F' || cmd === 'F1') {
                isFilled = cmd === 'F1';
                i++;
                if (i < tokens.length) {
                    var sx = parseFloat(tokens[i]);
                    i++;
                    var sy = parseFloat(tokens[i]);
                    i++;
                    currentFig = new PathFigure(sx, sy, isFilled);
                    geo.add(currentFig);
                }
                continue;
            }
            if (!currentFig) {
                currentFig = new PathFigure(0, 0, true);
                geo.add(currentFig);
            }
            switch (cmd) {
                case 'M': {
                    var x = parseFloat(tokens[i + 1]);
                    i += 2;
                    var y = parseFloat(tokens[i]);
                    i++;
                    break;
                }
                case 'L': {
                    var x = parseFloat(tokens[i + 1]);
                    i += 2;
                    var y = parseFloat(tokens[i]);
                    i++;
                    currentFig.add(PathSegment.Line(x, y));
                    break;
                }
                case 'Q': {
                    var x1 = parseFloat(tokens[i + 1]);
                    i += 2;
                    var y1 = parseFloat(tokens[i]);
                    i++;
                    var x = parseFloat(tokens[i]);
                    i++;
                    var y = parseFloat(tokens[i]);
                    i++;
                    currentFig.add(PathSegment.QuadraticBezier(x1, y1, x, y));
                    break;
                }
                case 'B': {
                    var x1 = parseFloat(tokens[i + 1]);
                    i += 2;
                    var y1 = parseFloat(tokens[i]);
                    i++;
                    var x2 = parseFloat(tokens[i]);
                    i++;
                    var y2 = parseFloat(tokens[i]);
                    i++;
                    var x = parseFloat(tokens[i]);
                    i++;
                    var y = parseFloat(tokens[i]);
                    i++;
                    currentFig.add(PathSegment.CubicBezier(x1, y1, x2, y2, x, y));
                    break;
                }
                case 'A': {
                    var x = parseFloat(tokens[i + 1]);
                    i += 2;
                    var y = parseFloat(tokens[i]);
                    i++;
                    var rx = parseFloat(tokens[i]);
                    i++;
                    var ry = parseFloat(tokens[i]);
                    i++;
                    var angle = parseFloat(tokens[i]);
                    i++;
                    var largeArc = tokens[i] === '1';
                    i++;
                    var sweep = tokens[i] === '1';
                    i++;
                    currentFig.add(PathSegment.Arc(x, y, rx, ry, angle, largeArc, sweep));
                    break;
                }
                case 'X':
                case 'Z': {
                    currentFig.add(PathSegment.Close());
                    i++;
                    break;
                }
                default: {
                    i++;
                    break;
                }
            }
        }
        return geo;
    };
    /** 转换为 SVG 路径字符串 */
    Geometry.prototype.toSvgString = function () {
        var result = '';
        var it = this._figures.iterator;
        while (it.next()) {
            var fig = it.value;
            result += "M ".concat(fig.startX, " ").concat(fig.startY, " ");
            var segIt = fig.segments.iterator;
            while (segIt.next()) {
                var seg = segIt.value;
                switch (seg.type._name) {
                    case 'Line':
                        result += "L ".concat(seg.endX, " ").concat(seg.endY, " ");
                        break;
                    case 'QuadraticBezier':
                        result += "Q ".concat(seg.x1, " ").concat(seg.y1, " ").concat(seg.endX, " ").concat(seg.endY, " ");
                        break;
                    case 'CubicBezier':
                        result += "C ".concat(seg.x1, " ").concat(seg.y1, " ").concat(seg.x2, " ").concat(seg.y2, " ").concat(seg.endX, " ").concat(seg.endY, " ");
                        break;
                    case 'Arc':
                        result += "A ".concat(seg.radiusX, " ").concat(seg.radiusY, " ").concat(seg.xAxisRotation, " ").concat(seg.largeArc ? 1 : 0, " ").concat(seg.clockwise ? 1 : 0, " ").concat(seg.endX, " ").concat(seg.endY, " ");
                        break;
                    case 'MoveTo':
                        result += "M ".concat(seg.endX, " ").concat(seg.endY, " ");
                        break;
                    case 'Close':
                        result += 'Z ';
                        break;
                }
            }
        }
        return result.trim();
    };
    /** 创建矩形几何 */
    Geometry.rectangle = function (width, height) {
        var geo = new Geometry();
        var fig = new PathFigure(0, 0);
        fig.add(PathSegment.Line(width, 0));
        fig.add(PathSegment.Line(width, height));
        fig.add(PathSegment.Line(0, height));
        fig.add(PathSegment.Close());
        geo.add(fig);
        return geo;
    };
    /** 创建圆角矩形几何 */
    Geometry.roundedRectangle = function (width, height, cornerRadius) {
        var r = Math.min(cornerRadius, width / 2, height / 2);
        var geo = new Geometry();
        var fig = new PathFigure(r, 0);
        fig.add(PathSegment.Line(width - r, 0));
        fig.add(PathSegment.Arc(width, r, r, r, 0, false, false));
        fig.add(PathSegment.Line(width, height - r));
        fig.add(PathSegment.Arc(width - r, height, r, r, 0, false, false));
        fig.add(PathSegment.Line(r, height));
        fig.add(PathSegment.Arc(0, height - r, r, r, 0, false, false));
        fig.add(PathSegment.Line(0, r));
        fig.add(PathSegment.Arc(r, 0, r, r, 0, false, false));
        fig.add(PathSegment.Close());
        geo.add(fig);
        return geo;
    };
    /** 创建椭圆几何 */
    Geometry.ellipse = function (width, height) {
        var rx = width / 2;
        var ry = height / 2;
        var geo = new Geometry();
        var fig = new PathFigure(width, ry);
        fig.add(PathSegment.Arc(0, ry, rx, ry, 0, false, false));
        fig.add(PathSegment.Arc(width, ry, rx, ry, 0, false, false));
        fig.add(PathSegment.Close());
        geo.add(fig);
        return geo;
    };
    /** 创建线段几何 */
    Geometry.line = function (x1, y1, x2, y2) {
        var geo = new Geometry();
        var fig = new PathFigure(x1, y1, false);
        fig.add(PathSegment.Line(x2, y2));
        geo.add(fig);
        return geo;
    };
    Geometry.triangle = function (width, height) {
        var geo = new Geometry();
        var fig = new PathFigure(width / 2, 0);
        fig.add(PathSegment.Line(width, height));
        fig.add(PathSegment.Line(0, height));
        fig.add(PathSegment.Close());
        geo.add(fig);
        return geo;
    };
    Geometry.diamond = function (width, height) {
        var geo = new Geometry();
        var fig = new PathFigure(width / 2, 0);
        fig.add(PathSegment.Line(width, height / 2));
        fig.add(PathSegment.Line(width / 2, height));
        fig.add(PathSegment.Line(0, height / 2));
        fig.add(PathSegment.Close());
        geo.add(fig);
        return geo;
    };
    Geometry.string = function (width, height, top, left, bottom, right) {
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        if (bottom === void 0) { bottom = 0; }
        if (right === void 0) { right = 0; }
        var geo = new Geometry();
        var fig = new PathFigure(left, top);
        fig.add(PathSegment.Line(width - right, top));
        fig.add(PathSegment.Line(width - right, height - bottom));
        fig.add(PathSegment.Line(left, height - bottom));
        fig.add(PathSegment.Close());
        geo.add(fig);
        return geo;
    };
    Geometry.isGeometry = function (obj) {
        return obj instanceof Geometry;
    };
    Geometry.stringify = function (geo) {
        if (!geo)
            return '';
        return geo.toString();
    };
    Geometry.prototype.close = function () {
        for (var i = 0; i < this._figures.count; i++) {
            var fig = this._figures.get(i);
            if (fig)
                fig.isFilled = true;
        }
        return this;
    };
    return Geometry;
}());

/**
 * Brush - 画刷
 * 支持 Solid（纯色）、Linear（线性渐变）、Radial（径向渐变）
 */
var Brush = /** @class */ (function () {
    function Brush(type) {
        if (typeof type === 'string') {
            this.type = BrushSolid;
            this.color = type;
        }
        else {
            this.type = type || BrushSolid;
            this.color = '';
        }
        this._stops = [];
        this.start = new Point(0, 0);
        this.end = new Point(1, 0);
        this.center = new Point(0.5, 0.5);
        this.focus = new Point(0.5, 0.5);
        this.radius = 0.5;
    }
    Object.defineProperty(Brush.prototype, "stops", {
        /** 获取色标列表 */
        get: function () {
            return this._stops;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加色标 */
    Brush.prototype.addColorStop = function (offset, color) {
        this._stops.push({ offset: offset, color: color });
        this._stops.sort(function (a, b) { return a.offset - b.offset; });
        return this;
    };
    Brush.prototype.set = function (props) {
        var e_1, _a;
        if (!props)
            return this;
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key === 'stops') {
                var stops = props[key];
                if (Array.isArray(stops)) {
                    try {
                        for (var stops_1 = (e_1 = void 0, __values(stops)), stops_1_1 = stops_1.next(); !stops_1_1.done; stops_1_1 = stops_1.next()) {
                            var s = stops_1_1.value;
                            if (typeof s === 'object' && s.offset !== undefined && s.color !== undefined) {
                                this.addColorStop(s.offset, s.color);
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (stops_1_1 && !stops_1_1.done && (_a = stops_1.return)) _a.call(stops_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
            }
            else if (typeof this[key] !== 'undefined' || key in this) {
                this[key] = props[key];
            }
        }
        return this;
    };
    /** 复制 */
    Brush.prototype.copy = function () {
        var b = new Brush(this.type);
        b.color = this.color;
        b.start = this.start.copy();
        b.end = this.end.copy();
        b.center = this.center.copy();
        b.focus = this.focus.copy();
        b.radius = this.radius;
        b._stops = this._stops.map(function (s) { return (__assign({}, s)); });
        return b;
    };
    /** 创建 Canvas 渐变对象 */
    Brush.prototype._createCanvasGradient = function (ctx, bounds) {
        var e_2, _a, e_3, _b;
        if (this.type === BrushSolid)
            return null;
        if (this.type === BrushLinear) {
            var x1 = bounds.x + this.start.x * bounds.width;
            var y1 = bounds.y + this.start.y * bounds.height;
            var x2 = bounds.x + this.end.x * bounds.width;
            var y2 = bounds.y + this.end.y * bounds.height;
            var grad = ctx.createLinearGradient(x1, y1, x2, y2);
            try {
                for (var _c = __values(this._stops), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var stop_1 = _d.value;
                    grad.addColorStop(stop_1.offset, stop_1.color);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return grad;
        }
        if (this.type === BrushRadial) {
            var cx = bounds.x + this.center.x * bounds.width;
            var cy = bounds.y + this.center.y * bounds.height;
            var fx = bounds.x + this.focus.x * bounds.width;
            var fy = bounds.y + this.focus.y * bounds.height;
            var r = this.radius * Math.max(bounds.width, bounds.height);
            var grad = ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
            try {
                for (var _e = __values(this._stops), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var stop_2 = _f.value;
                    grad.addColorStop(stop_2.offset, stop_2.color);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return grad;
        }
        return null;
    };
    Brush.prototype.equals = function (b) {
        if (!(b instanceof Brush))
            return false;
        if (this.type !== b.type)
            return false;
        if (this.type === BrushSolid)
            return this.color === b.color;
        if (this._stops.length !== b._stops.length)
            return false;
        for (var i = 0; i < this._stops.length; i++) {
            if (this._stops[i].offset !== b._stops[i].offset ||
                this._stops[i].color !== b._stops[i].color)
                return false;
        }
        return true;
    };
    /** 创建纯色画刷 */
    Brush.Solid = function (color) {
        var b = new Brush(BrushSolid);
        b.color = color;
        return b;
    };
    /** 创建线性渐变画刷 */
    Brush.Linear = function (startX, startY, endX, endY) {
        var b = new Brush(BrushLinear);
        b.start = new Point(startX, startY);
        b.end = new Point(endX, endY);
        return b;
    };
    /** 创建径向渐变画刷 */
    Brush.Radial = function (centerX, centerY, radius, focusX, focusY) {
        var b = new Brush(BrushRadial);
        b.center = new Point(centerX, centerY);
        b.radius = radius;
        if (focusX !== undefined && focusY !== undefined) {
            b.focus = new Point(focusX, focusY);
        }
        return b;
    };
    /** 判断是否为 Brush */
    Brush.isBrush = function (b) {
        return b instanceof Brush;
    };
    Brush.randomColor = function () {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    };
    Brush.darken = function (color, fraction) {
        return Brush.darkenBy(color, fraction || 0.2);
    };
    Brush.darkenBy = function (color, fraction) {
        var c = exports.Color.parse(color);
        if (!c)
            return color;
        var f = 1 - fraction;
        return exports.Color.toString(Math.round(c.r * f), Math.round(c.g * f), Math.round(c.b * f), c.a);
    };
    Brush.lighten = function (color, fraction) {
        return Brush.lightenBy(color, fraction || 0.2);
    };
    Brush.lightenBy = function (color, fraction) {
        var c = exports.Color.parse(color);
        if (!c)
            return color;
        return exports.Color.toString(Math.round(c.r + (255 - c.r) * fraction), Math.round(c.g + (255 - c.g) * fraction), Math.round(c.b + (255 - c.b) * fraction), c.a);
    };
    Brush.isDark = function (color) {
        var c = exports.Color.parse(color);
        if (!c)
            return false;
        return (c.r * 0.299 + c.g * 0.587 + c.b * 0.114) < 128;
    };
    return Brush;
}());
/**
 * 颜色工具函数
 */
exports.Color = void 0;
(function (Color) {
    /** 解析 CSS 颜色字符串为 RGBA */
    function parse(color) {
        if (!color || typeof color !== 'string')
            return null;
        color = color.trim().toLowerCase();
        // 命名颜色
        var named = NAMED_COLORS[color];
        if (named)
            return named;
        // #RGB, #RRGGBB, #RRGGBBAA
        if (color.charAt(0) === '#') {
            return parseHex(color);
        }
        // rgb/rgba
        var rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
        if (rgbaMatch) {
            return {
                r: parseInt(rgbaMatch[1]),
                g: parseInt(rgbaMatch[2]),
                b: parseInt(rgbaMatch[3]),
                a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
            };
        }
        return null;
    }
    Color.parse = parse;
    function parseHex(hex) {
        var h = hex.slice(1);
        if (h.length === 3) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        if (h.length === 4) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
        }
        if (h.length === 6 || h.length === 8) {
            return {
                r: parseInt(h.slice(0, 2), 16),
                g: parseInt(h.slice(2, 4), 16),
                b: parseInt(h.slice(4, 6), 16),
                a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
            };
        }
        return null;
    }
    /** RGBA 转字符串 */
    function toString(r, g, b, a) {
        if (a === void 0) { a = 1; }
        if (a < 1) {
            return "rgba(".concat(r, ",").concat(g, ",").concat(b, ",").concat(a, ")");
        }
        return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
    }
    Color.toString = toString;
})(exports.Color || (exports.Color = {}));
/** 常用命名颜色 */
var NAMED_COLORS = {
    transparent: { r: 0, g: 0, b: 0, a: 0 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    white: { r: 255, g: 255, b: 255, a: 1 },
    red: { r: 255, g: 0, b: 0, a: 1 },
    green: { r: 0, g: 128, b: 0, a: 1 },
    blue: { r: 0, g: 0, b: 255, a: 1 },
    yellow: { r: 255, g: 255, b: 0, a: 1 },
    cyan: { r: 0, g: 255, b: 255, a: 1 },
    magenta: { r: 255, g: 0, b: 255, a: 1 },
    orange: { r: 255, g: 165, b: 0, a: 1 },
    purple: { r: 128, g: 0, b: 128, a: 1 },
    gray: { r: 128, g: 128, b: 128, a: 1 },
    grey: { r: 128, g: 128, b: 128, a: 1 },
    pink: { r: 255, g: 192, b: 203, a: 1 },
    brown: { r: 165, g: 42, b: 42, a: 1 },
    lime: { r: 0, g: 255, b: 0, a: 1 },
    navy: { r: 0, g: 0, b: 128, a: 1 },
    olive: { r: 128, g: 128, b: 0, a: 1 },
    maroon: { r: 128, g: 0, b: 0, a: 1 },
    teal: { r: 0, g: 128, b: 128, a: 1 },
    aqua: { r: 0, g: 255, b: 255, a: 1 },
    silver: { r: 192, g: 192, b: 192, a: 1 },
    fuchsia: { r: 255, g: 0, b: 255, a: 1 },
};

/**
 * ChangedEvent - 变更事件
 * 记录模型或图表的属性/插入/删除变更
 */
var ChangedEvent = /** @class */ (function () {
    function ChangedEvent(change, object, propertyName, oldValue, newValue, index) {
        this.change = change || ChangedEventProperty;
        this.object = object || null;
        this.propertyName = propertyName || '';
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.index = index || 0;
        this.transactionName = '';
        this.isModelChange = false;
        this.model = null;
        this.parameter = null;
    }
    Object.defineProperty(ChangedEvent.prototype, "isPropertyChange", {
        /** 是否为属性变更 */
        get: function () {
            return this.change === ChangedEventProperty;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChangedEvent.prototype, "isInsertChange", {
        /** 是否为插入变更 */
        get: function () {
            return this.change === ChangedEventInsert;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChangedEvent.prototype, "isRemoveChange", {
        /** 是否为删除变更 */
        get: function () {
            return this.change === ChangedEventRemove;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChangedEvent.prototype, "isTransactionChange", {
        get: function () {
            return this.change === ChangedEventTransaction;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChangedEvent.prototype, "isTransactionFinished", {
        get: function () {
            return this.change === ChangedEventTransaction &&
                (this.propertyName === 'CommittedTransaction' ||
                    this.propertyName === 'RollbackTransaction' ||
                    this.propertyName === 'FinishedUndo' ||
                    this.propertyName === 'FinishedRedo');
        },
        enumerable: false,
        configurable: true
    });
    /** 复制 */
    ChangedEvent.prototype.copy = function () {
        var e = new ChangedEvent(this.change, this.object, this.propertyName, this.oldValue, this.newValue, this.index);
        e.transactionName = this.transactionName;
        e.isModelChange = this.isModelChange;
        return e;
    };
    /** 重置 */
    ChangedEvent.prototype.clear = function () {
        this.change = ChangedEventProperty;
        this.object = null;
        this.propertyName = '';
        this.oldValue = undefined;
        this.newValue = undefined;
        this.index = 0;
        this.transactionName = '';
        this.isModelChange = false;
    };
    ChangedEvent.prototype.toString = function () {
        return "ChangedEvent(".concat(this.change._name, ", ").concat(this.propertyName, ", ").concat(this.oldValue, ", ").concat(this.newValue, ")");
    };
    return ChangedEvent;
}());

/**
 * Transaction - 事务
 * 组合多个 ChangedEvent，支持嵌套
 */
var Transaction = /** @class */ (function () {
    function Transaction(name) {
        if (name === void 0) { name = ''; }
        this.name = name;
        this._changes = [];
        this._level = 0;
        this._nestedNames = [];
    }
    Object.defineProperty(Transaction.prototype, "changes", {
        get: function () {
            return this._changes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "nestedNames", {
        get: function () {
            return this._nestedNames;
        },
        enumerable: false,
        configurable: true
    });
    Transaction.prototype.addNestedName = function (name) {
        if (name)
            this._nestedNames.push(name);
    };
    /** 添加变更事件 */
    Transaction.prototype.addChange = function (change) {
        this._changes.push(change);
    };
    Transaction.prototype.begin = function () {
        this._level++;
    };
    Transaction.prototype.end = function () {
        this._level--;
    };
    Object.defineProperty(Transaction.prototype, "isComplete", {
        /** 是否已完成（无嵌套） */
        get: function () {
            return this._level <= 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Transaction.prototype, "count", {
        /** 变更数量 */
        get: function () {
            return this._changes.length;
        },
        enumerable: false,
        configurable: true
    });
    Transaction.prototype.clear = function () {
        this._changes.length = 0;
        this._level = 0;
        this._nestedNames.length = 0;
    };
    Transaction.prototype.copy = function () {
        var t = new Transaction(this.name);
        t._changes = this._changes.map(function (c) { return c.copy(); });
        t._level = this._level;
        t._nestedNames = this._nestedNames.slice();
        return t;
    };
    Transaction.prototype.toString = function () {
        return "Transaction(".concat(this.name, ", ").concat(this._changes.length, " changes)");
    };
    return Transaction;
}());

/**
 * UndoManager - 撤销管理器
 */
var UndoManager = /** @class */ (function () {
    function UndoManager() {
        this._undoStack = [];
        this._redoStack = [];
        this._currentTransaction = null;
        this._transactionLevel = 0;
        this._maxHistory = 0; // 0 = unlimited
        this._isEnabled = true;
        this._hasUndo = false;
        this._hasRedo = false;
        this._model = null;
        this._changes = [];
        this._stateChangedListeners = [];
        this._skipsUndoManager = false;
        this._handlesModelChanges = true;
    }
    Object.defineProperty(UndoManager.prototype, "isEnabled", {
        get: function () {
            return this._isEnabled;
        },
        set: function (val) {
            if (this._isEnabled !== val) {
                this._isEnabled = val;
                if (!val) {
                    this.clear();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (val) {
            this._model = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "transactionLevel", {
        get: function () {
            return this._transactionLevel;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "isInTransaction", {
        get: function () {
            return this._transactionLevel > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "hasUndo", {
        get: function () {
            return this._undoStack.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "hasRedo", {
        get: function () {
            return this._redoStack.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "canUndo", {
        get: function () {
            return this.isEnabled && this._undoStack.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "canRedo", {
        get: function () {
            return this.isEnabled && this._redoStack.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "transactionToUndo", {
        get: function () {
            return this._undoStack.length > 0 ? this._undoStack[this._undoStack.length - 1] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "transactionToRedo", {
        get: function () {
            return this._redoStack.length > 0 ? this._redoStack[this._redoStack.length - 1] : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "currentTransaction", {
        get: function () {
            return this._currentTransaction;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "undoStack", {
        get: function () {
            return this._undoStack;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "redoStack", {
        get: function () {
            return this._redoStack;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UndoManager.prototype, "maxHistory", {
        get: function () {
            return this._maxHistory;
        },
        set: function (val) {
            this._maxHistory = Math.max(0, val);
            this._trimHistory();
        },
        enumerable: false,
        configurable: true
    });
    UndoManager.prototype.startTransaction = function (name) {
        if (name === void 0) { name = ''; }
        if (!this._isEnabled)
            return false;
        this._transactionLevel++;
        if (this._transactionLevel === 1) {
            this._currentTransaction = new Transaction(name);
            this._changes = [];
            this._fireTransactionEvent('StartingTransaction', name);
            this._fireTransactionEvent('StartedTransaction', name);
        }
        else if (this._currentTransaction) {
            this._currentTransaction.begin();
            this._currentTransaction.addNestedName(name);
        }
        return true;
    };
    UndoManager.prototype.commitTransaction = function (name) {
        var e_1, _a;
        if (!this._isEnabled)
            return false;
        if (this._transactionLevel <= 0)
            return false;
        this._transactionLevel--;
        if (name !== undefined && this._currentTransaction) {
            this._currentTransaction.name = name;
        }
        if (this._transactionLevel === 0) {
            if (this._currentTransaction) {
                this._fireTransactionEvent('CommittingTransaction', this._currentTransaction.name);
                try {
                    for (var _b = __values(this._changes), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var change = _c.value;
                        this._currentTransaction.addChange(change);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                var committed = this._currentTransaction;
                if (this._currentTransaction.count > 0) {
                    this._undoStack.push(this._currentTransaction);
                    this._redoStack.length = 0;
                    this._trimHistory();
                }
                this._currentTransaction = null;
                this._changes = [];
                this._fireStateChanged();
                this._fireTransactionEvent('CommittedTransaction', committed.name, committed);
            }
        }
        else if (this._currentTransaction) {
            this._currentTransaction.end();
        }
        return true;
    };
    UndoManager.prototype.rollbackTransaction = function () {
        if (!this._isEnabled)
            return false;
        if (this._transactionLevel <= 0)
            return false;
        this._transactionLevel--;
        if (this._transactionLevel === 0) {
            var tname = this._currentTransaction ? this._currentTransaction.name : '';
            if (this._changes.length > 0) {
                for (var i = this._changes.length - 1; i >= 0; i--) {
                    this._undoChange(this._changes[i]);
                }
            }
            this._currentTransaction = null;
            this._changes = [];
            this._fireStateChanged();
            this._fireTransactionEvent('RollbackTransaction', tname);
        }
        else if (this._currentTransaction) {
            this._currentTransaction.end();
        }
        return true;
    };
    UndoManager.prototype.handleChanged = function (change) {
        if (!this._isEnabled)
            return;
        if (!this._handlesModelChanges)
            return;
        if (this._skipsUndoManager)
            return;
        if (this._transactionLevel > 0) {
            this._changes.push(change);
        }
    };
    Object.defineProperty(UndoManager.prototype, "handlesModelChanges", {
        get: function () { return this._handlesModelChanges; },
        set: function (val) { this._handlesModelChanges = val; },
        enumerable: false,
        configurable: true
    });
    UndoManager.prototype.undo = function () {
        if (!this._isEnabled || !this.hasUndo)
            return false;
        var transaction = this._undoStack.pop();
        this._redoStack.push(transaction);
        this._skipsUndoManager = true;
        var changes = transaction.changes;
        for (var i = changes.length - 1; i >= 0; i--) {
            this._undoChange(changes[i]);
        }
        this._skipsUndoManager = false;
        this._fireStateChanged();
        this._fireTransactionEvent('FinishedUndo', transaction.name, transaction);
        return true;
    };
    UndoManager.prototype.redo = function () {
        var e_2, _a;
        if (!this._isEnabled || !this.hasRedo)
            return false;
        var transaction = this._redoStack.pop();
        this._undoStack.push(transaction);
        this._skipsUndoManager = true;
        var changes = transaction.changes;
        try {
            for (var changes_1 = __values(changes), changes_1_1 = changes_1.next(); !changes_1_1.done; changes_1_1 = changes_1.next()) {
                var change = changes_1_1.value;
                this._redoChange(change);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (changes_1_1 && !changes_1_1.done && (_a = changes_1.return)) _a.call(changes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this._skipsUndoManager = false;
        this._fireStateChanged();
        this._fireTransactionEvent('FinishedRedo', transaction.name, transaction);
        return true;
    };
    /** 清空历史 */
    UndoManager.prototype.clear = function () {
        this._undoStack.length = 0;
        this._redoStack.length = 0;
        this._currentTransaction = null;
        this._transactionLevel = 0;
        this._changes = [];
        this._fireStateChanged();
    };
    UndoManager.prototype._undoChange = function (change) {
        if (change.isPropertyChange) {
            if (change.object && change.propertyName) {
                if (this._model && typeof this._model.setDataProperty === 'function') {
                    this._model.setDataProperty(change.object, change.propertyName, change.oldValue);
                }
                else {
                    change.object[change.propertyName] = change.oldValue;
                }
            }
        }
        else if (change.isInsertChange) {
            if (change.object && change.propertyName) {
                var arr = change.object[change.propertyName];
                if (Array.isArray(arr)) {
                    var data = arr[change.index];
                    arr.splice(change.index, 1);
                    if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
                        var key = this._model.getKeyForNodeData(data);
                        if (key !== undefined)
                            this._model._keyMap.remove(key);
                        this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'nodeDataArray', data, null, change.index);
                    }
                    else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
                        this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'linkDataArray', data, null, change.index);
                    }
                }
            }
        }
        else if (change.isRemoveChange) {
            if (change.object && change.propertyName) {
                var arr = change.object[change.propertyName];
                if (Array.isArray(arr)) {
                    var data = change.oldValue;
                    arr.splice(change.index, 0, data);
                    if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
                        var key = this._model.getKeyForNodeData(data);
                        if (key !== undefined)
                            this._model._keyMap.add(key, data);
                        this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'nodeDataArray', null, data, change.index);
                    }
                    else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
                        this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'linkDataArray', null, data, change.index);
                    }
                }
            }
        }
    };
    UndoManager.prototype._redoChange = function (change) {
        if (change.isPropertyChange) {
            if (change.object && change.propertyName) {
                if (this._model && typeof this._model.setDataProperty === 'function') {
                    this._model.setDataProperty(change.object, change.propertyName, change.newValue);
                }
                else {
                    change.object[change.propertyName] = change.newValue;
                }
            }
        }
        else if (change.isInsertChange) {
            if (change.object && change.propertyName) {
                var arr = change.object[change.propertyName];
                if (Array.isArray(arr)) {
                    var data = change.newValue;
                    arr.splice(change.index, 0, data);
                    if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
                        var key = this._model.getKeyForNodeData(data);
                        if (key !== undefined)
                            this._model._keyMap.add(key, data);
                        this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'nodeDataArray', null, data, change.index);
                    }
                    else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
                        this._model.raiseChangedEvent(ChangedEventInsert, this._model, 'linkDataArray', null, data, change.index);
                    }
                }
            }
        }
        else if (change.isRemoveChange) {
            if (change.object && change.propertyName) {
                var arr = change.object[change.propertyName];
                if (Array.isArray(arr)) {
                    var data = arr[change.index];
                    arr.splice(change.index, 1);
                    if (this._model && change.object === this._model && change.propertyName === 'nodeDataArray') {
                        var key = this._model.getKeyForNodeData(data);
                        if (key !== undefined)
                            this._model._keyMap.remove(key);
                        this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'nodeDataArray', data, null, change.index);
                    }
                    else if (this._model && change.object === this._model && change.propertyName === 'linkDataArray') {
                        this._model.raiseChangedEvent(ChangedEventRemove, this._model, 'linkDataArray', data, null, change.index);
                    }
                }
            }
        }
    };
    /** 修剪历史记录 */
    UndoManager.prototype._trimHistory = function () {
        if (this._maxHistory > 0) {
            while (this._undoStack.length > this._maxHistory) {
                this._undoStack.shift();
            }
        }
    };
    /** 添加状态变更监听器 */
    UndoManager.prototype.addStateChangedListener = function (listener) {
        this._stateChangedListeners.push(listener);
    };
    /** 移除状态变更监听器 */
    UndoManager.prototype.removeStateChangedListener = function (listener) {
        var idx = this._stateChangedListeners.indexOf(listener);
        if (idx >= 0) {
            this._stateChangedListeners.splice(idx, 1);
        }
    };
    UndoManager.prototype._fireStateChanged = function () {
        var e_3, _a;
        try {
            for (var _b = __values(this._stateChangedListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(this);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    UndoManager.prototype._fireTransactionEvent = function (propertyName, tname, transObj) {
        if (this._model && typeof this._model.raiseTransactionEvent === 'function') {
            this._model.raiseTransactionEvent(propertyName, tname, transObj);
        }
    };
    return UndoManager;
}());

var BindingMode = /** @class */ (function (_super) {
    __extends(BindingMode, _super);
    function BindingMode(name) {
        return _super.call(this, name) || this;
    }
    return BindingMode;
}(EnumValue));
var Binding = /** @class */ (function () {
    function Binding(targetProperty, sourceProperty, conversion) {
        this.name = '';
        this.targetProperty = targetProperty;
        this.sourceProperty = sourceProperty || targetProperty;
        this.conversion = conversion || null;
        this.backConversion = null;
        this.mode = Binding.OneWay;
        this.sourceObject = null;
    }
    Object.defineProperty(Binding.prototype, "isTwoWay", {
        get: function () {
            return this.mode === Binding.TwoWay;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "isFromModel", {
        get: function () {
            return this.sourceObject === 'model';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Binding.prototype, "isToData", {
        get: function () {
            return !this.isFromModel && this.sourceObject === null;
        },
        enumerable: false,
        configurable: true
    });
    Binding.prototype.makeTwoWay = function (backConversion) {
        this.mode = Binding.TwoWay;
        this.backConversion = backConversion || null;
        return this;
    };
    Binding.prototype.ofModel = function () {
        this.sourceObject = 'model';
        return this;
    };
    Binding.prototype.ofObject = function (name) {
        this.sourceObject = name !== undefined ? name : '';
        return this;
    };
    Binding.prototype.copy = function () {
        var b = new Binding(this.targetProperty, this.sourceProperty, this.conversion || undefined);
        b.mode = this.mode;
        b.backConversion = this.backConversion;
        b.sourceObject = this.sourceObject;
        b.name = this.name;
        return b;
    };
    Binding.prototype.getValueFromSource = function (data, targetObject, model) {
        var value;
        if (this.isFromModel) {
            value = model ? model.modelData[this.sourceProperty] : undefined;
        }
        else if (this.sourceObject !== null) {
            value = undefined;
        }
        else {
            value = data ? data[this.sourceProperty] : undefined;
        }
        if (this.conversion) {
            value = this.conversion(value, targetObject, model);
        }
        return value;
    };
    Binding.prototype.getValueFromTarget = function (targetValue, data, model) {
        if (this.backConversion) {
            return this.backConversion(targetValue, data, model);
        }
        return targetValue;
    };
    Binding.prototype.toString = function () {
        var str = "Binding(".concat(this.targetProperty, ", ").concat(this.sourceProperty);
        if (this.mode === Binding.TwoWay)
            str += ', TwoWay';
        if (this.sourceObject === 'model')
            str += ', ofModel';
        else if (this.sourceObject !== null)
            str += ", ofObject(".concat(this.sourceObject, ")");
        if (this.name)
            str += ", name=".concat(this.name);
        str += ')';
        return str;
    };
    Binding.OneWay = new BindingMode('OneWay');
    Binding.TwoWay = new BindingMode('TwoWay');
    return Binding;
}());

/**
 * Model - 基础模型
 * 管理 nodeDataArray，支持数据绑定、事务和撤销/重做
 */
var Model = /** @class */ (function () {
    function Model(init) {
        /** 数据格式名称 */
        this.dataFormat = 'gojs';
        /** 模型名称 */
        this.name = '';
        /** 节点 key 属性名 */
        this.nodeKeyProperty = 'key';
        /** 节点分类属性名 */
        this.nodeCategoryProperty = 'category';
        /** 是否只读 */
        this.isReadOnly = false;
        /** 复制时是否深拷贝数组中的对象 */
        this.copiesArrayObjects = true;
        /** 复制时是否深拷贝数组 */
        this.copiesArrays = false;
        /** 复制时是否保留 key */
        this.copiesKey = true;
        /** 点坐标小数位数 */
        this.pointsDigits = 2;
        /** 是否跳过撤销管理器 */
        this.skipsUndoManager = false;
        /** 自定义 key 生成函数 */
        this.makeUniqueKeyFunction = null;
        /** 自定义节点数据复制函数 */
        this.copyNodeDataFunction = null;
        /** 节点是否为分组的属性名 */
        this.nodeIsGroupProperty = 'isGroup';
        /** 节点所属分组 key 的属性名 */
        this.nodeGroupKeyProperty = 'group';
        /** 链接标签 key 数组的属性名 */
        this.linkLabelKeysProperty = '';
        /** 自定义链接 key 生成函数 */
        this.makeUniqueLinkKeyFunction = null;
        /** 自定义链接数据复制函数 */
        this.copyLinkDataFunction = null;
        this._nodeDataArray = [];
        this._changedListeners = [];
        this._nextKey = 1;
        this._nodeDataArray = Array.isArray(init) ? init : [];
        this._undoManager = new UndoManager();
        this._undoManager.model = this;
        this._keyMap = new Map$1();
        this.modelData = {};
        if (init && !Array.isArray(init)) {
            this.set(init);
        }
        this._rebuildKeyMap();
    }
    Object.defineProperty(Model.prototype, "nodeDataArray", {
        // ============ 节点数据管理 ============
        get: function () {
            return this._nodeDataArray;
        },
        set: function (val) {
            this._nodeDataArray = val || [];
            this._rebuildKeyMap();
        },
        enumerable: false,
        configurable: true
    });
    /** 添加节点数据 */
    Model.prototype.addNodeData = function (data) {
        if (!data)
            throw new Error('Cannot add null node data');
        if (this.isReadOnly)
            throw new Error('Model is read-only');
        this.ensureUniqueKey(data);
        this._nodeDataArray.push(data);
        this._keyMap.add(this.getKeyForNodeData(data), data);
        this.raiseChangedEvent(ChangedEventInsert, this, 'nodeDataArray', null, data, this._nodeDataArray.length - 1);
    };
    /** 添加节点数据集合 */
    Model.prototype.addNodeDataCollection = function (coll) {
        var e_1, _a;
        var items = Array.isArray(coll) ? coll : coll.toArray();
        try {
            for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var data = items_1_1.value;
                this.addNodeData(data);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /** 移除节点数据 */
    Model.prototype.removeNodeData = function (data) {
        if (!data)
            return false;
        if (this.isReadOnly)
            throw new Error('Model is read-only');
        var idx = this._nodeDataArray.indexOf(data);
        if (idx < 0)
            return false;
        this._nodeDataArray.splice(idx, 1);
        this._keyMap.remove(this.getKeyForNodeData(data));
        this.raiseChangedEvent(ChangedEventRemove, this, 'nodeDataArray', data, null, idx);
        return true;
    };
    /** 移除节点数据集合 */
    Model.prototype.removeNodeDataCollection = function (coll) {
        var e_2, _a;
        var items = Array.isArray(coll) ? coll : coll.toArray();
        try {
            for (var items_2 = __values(items), items_2_1 = items_2.next(); !items_2_1.done; items_2_1 = items_2.next()) {
                var data = items_2_1.value;
                this.removeNodeData(data);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (items_2_1 && !items_2_1.done && (_a = items_2.return)) _a.call(items_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    /** 是否包含节点数据 */
    Model.prototype.containsNodeData = function (data) {
        return this._nodeDataArray.indexOf(data) >= 0;
    };
    /** 根据 key 查找节点数据 */
    Model.prototype.findNodeDataForKey = function (key) {
        return this._keyMap.get(key);
    };
    /** 获取节点的 key */
    Model.prototype.getKeyForNodeData = function (data) {
        if (!data)
            return undefined;
        var prop = this.nodeKeyProperty;
        if (typeof prop === 'function') {
            return prop(data);
        }
        return data[prop];
    };
    /** 设置节点的 key */
    Model.prototype.setKeyForNodeData = function (data, key) {
        if (!data)
            return;
        var oldKey = this.getKeyForNodeData(data);
        if (oldKey === key)
            return;
        this._keyMap.remove(oldKey);
        var prop = this.nodeKeyProperty;
        if (typeof prop === 'string') {
            this.setDataProperty(data, prop, key);
        }
        this._keyMap.add(key, data);
    };
    /** 获取节点的分类 */
    Model.prototype.getCategoryForNodeData = function (data) {
        if (!data)
            return '';
        var prop = this.nodeCategoryProperty;
        if (typeof prop === 'function') {
            return prop(data) || '';
        }
        return data[prop] || '';
    };
    /** 设置节点的分类 */
    Model.prototype.setCategoryForNodeData = function (data, category) {
        if (!data)
            return;
        var prop = this.nodeCategoryProperty;
        if (typeof prop === 'string') {
            this.setDataProperty(data, prop, category);
        }
    };
    /** 判断节点是否为分组 */
    Model.prototype.isGroupForNodeData = function (data) {
        if (!data)
            return false;
        var prop = this.nodeIsGroupProperty;
        if (typeof prop === 'function') {
            return prop(data);
        }
        return !!data[prop];
    };
    /** 设置节点是否为分组 */
    Model.prototype.setIsGroupForNodeData = function (data, flag) {
        if (!data)
            return;
        var prop = this.nodeIsGroupProperty;
        if (typeof prop === 'string') {
            this.setDataProperty(data, prop, flag);
        }
    };
    /** 获取节点的分组 key */
    Model.prototype.getGroupKeyForNodeData = function (data) {
        if (!data)
            return undefined;
        var prop = this.nodeGroupKeyProperty;
        if (typeof prop === 'function') {
            return prop(data);
        }
        return data[prop];
    };
    /** 设置节点的分组 key */
    Model.prototype.setGroupKeyForNodeData = function (data, key) {
        if (!data)
            return;
        var prop = this.nodeGroupKeyProperty;
        if (typeof prop === 'string') {
            this.setDataProperty(data, prop, key);
        }
    };
    /** 获取 modelData 中的属性 */
    Model.prototype.getModelData = function (key) {
        return this.modelData[key];
    };
    /** 设置 modelData 中的属性（支持撤销） */
    Model.prototype.setModelData = function (key, value) {
        if (this.isReadOnly)
            throw new Error('Model is read-only');
        var old = this.modelData[key];
        if (old === value)
            return;
        this.modelData[key] = value;
        this.raiseChangedEvent(ChangedEventProperty, this, 'modelData.' + key, old, value);
    };
    /** 设置数据属性（支持撤销） */
    Model.prototype.setDataProperty = function (data, propname, value) {
        if (!data)
            return;
        if (this.isReadOnly)
            throw new Error('Model is read-only');
        var old = data[propname];
        if (old === value)
            return;
        data[propname] = value;
        this.raiseChangedEvent(ChangedEventProperty, data, propname, old, value);
        this.updateTargetBindings(propname);
    };
    /** 向数组添加项 */
    Model.prototype.addArrayItem = function (arr, item) {
        if (!arr)
            return;
        arr.push(item);
        this.raiseChangedEvent(ChangedEventInsert, arr, '', null, item, arr.length - 1);
    };
    /** 在数组指定位置插入项 */
    Model.prototype.insertArrayItem = function (arr, index, item) {
        if (!arr)
            return;
        arr.splice(index, 0, item);
        this.raiseChangedEvent(ChangedEventInsert, arr, '', null, item, index);
    };
    /** 移除数组项 */
    Model.prototype.removeArrayItem = function (arr, index) {
        if (!arr)
            return;
        if (index === undefined) {
            index = arr.length - 1;
        }
        var old = arr[index];
        arr.splice(index, 1);
        this.raiseChangedEvent(ChangedEventRemove, arr, '', old, null, index);
    };
    /** 确保 key 唯一 */
    Model.prototype.ensureUniqueKey = function (data) {
        if (this.makeUniqueKeyFunction) {
            this.makeUniqueKeyFunction(this, data);
            return;
        }
        var key = this.getKeyForNodeData(data);
        if (key === undefined || this._keyMap.contains(key)) {
            var newKey = this._nextKey++;
            while (this._keyMap.contains(newKey)) {
                newKey = this._nextKey++;
            }
            var prop = this.nodeKeyProperty;
            if (typeof prop === 'string') {
                data[prop] = newKey;
            }
        }
    };
    /** 复制节点数据 */
    Model.prototype.copyNodeData = function (data) {
        if (this.copyNodeDataFunction) {
            return this.copyNodeDataFunction(data, this);
        }
        return this.cloneDeep(data);
    };
    /** 深度克隆 */
    Model.prototype.cloneDeep = function (obj) {
        var e_3, _a;
        var _this = this;
        if (obj === null || typeof obj !== 'object')
            return obj;
        if (obj instanceof Date)
            return new Date(obj.getTime());
        if (Array.isArray(obj)) {
            return obj.map(function (item) {
                if (_this.copiesArrayObjects && typeof item === 'object' && item !== null) {
                    return _this.cloneDeep(item);
                }
                return item;
            });
        }
        var copy = {};
        try {
            for (var _b = __values(Object.keys(obj)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                var val = obj[key];
                if (Array.isArray(val)) {
                    if (this.copiesArrays) {
                        val = this.cloneDeep(val);
                    }
                }
                else if (typeof val === 'object' && val !== null) {
                    val = this.cloneDeep(val);
                }
                copy[key] = val;
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return copy;
    };
    Object.defineProperty(Model.prototype, "undoManager", {
        // ============ 事务管理 ============
        get: function () {
            return this._undoManager;
        },
        enumerable: false,
        configurable: true
    });
    Model.prototype.startTransaction = function (tname) {
        if (tname === void 0) { tname = ''; }
        return this._undoManager.startTransaction(tname);
    };
    Model.prototype.commitTransaction = function (tname) {
        if (tname === void 0) { tname = ''; }
        return this._undoManager.commitTransaction(tname);
    };
    Model.prototype.rollbackTransaction = function () {
        return this._undoManager.rollbackTransaction();
    };
    /** 在事务中执行函数 */
    Model.prototype.commit = function (func, tname) {
        if (tname === void 0) { tname = 'commit'; }
        this.startTransaction(tname);
        var result;
        try {
            result = func();
        }
        catch (e) {
            this.rollbackTransaction();
            throw e;
        }
        this.commitTransaction(tname);
        return result;
    };
    // ============ 变更事件 ============
    Model.prototype.addChangedListener = function (listener) {
        this._changedListeners.push(listener);
    };
    Model.prototype.removeChangedListener = function (listener) {
        var idx = this._changedListeners.indexOf(listener);
        if (idx >= 0)
            this._changedListeners.splice(idx, 1);
    };
    Model.prototype.raiseChangedEvent = function (change, object, propertyName, oldValue, newValue, index) {
        var e_4, _a;
        var e = new ChangedEvent(change, object, propertyName, oldValue, newValue, index);
        e.isModelChange = true;
        if (!e.isTransactionChange && !this.skipsUndoManager) {
            this._undoManager.handleChanged(e);
        }
        try {
            for (var _b = __values(this._changedListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(e);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return e;
    };
    Model.prototype.raiseTransactionEvent = function (propertyName, tname, transObj) {
        var e_5, _a;
        var e = new ChangedEvent(ChangedEventTransaction, this, propertyName, tname, transObj);
        e.isModelChange = true;
        e.transactionName = tname;
        try {
            for (var _b = __values(this._changedListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(e);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return e;
    };
    /** 更新目标绑定 */
    Model.prototype.updateTargetBindings = function (propname) {
        // 由 Diagram 实现
    };
    // ============ 序列化 ============
    /** 序列化为 JSON */
    Model.prototype.toJson = function () {
        var data = {
            class: 'Model',
            nodeDataArray: this._nodeDataArray,
        };
        if (Object.keys(this.modelData).length > 0) {
            data.modelData = this.modelData;
        }
        return JSON.stringify(data, null, 2);
    };
    /** 从 JSON 反序列化 */
    Model.fromJson = function (json) {
        var data = typeof json === 'string' ? JSON.parse(json) : json;
        var cls = data.class || 'Model';
        var model;
        if (cls === 'GraphLinksModel') {
            var GLM = require('./GraphLinksModel').GraphLinksModel;
            model = new GLM();
            if (data.linkDataArray) {
                model.linkDataArray = data.linkDataArray;
            }
            if (data.linkFromPortIdProperty !== undefined) {
                model.linkFromPortIdProperty = data.linkFromPortIdProperty;
            }
            if (data.linkToPortIdProperty !== undefined) {
                model.linkToPortIdProperty = data.linkToPortIdProperty;
            }
            if (data.linkLabelKeysProperty !== undefined) {
                model.linkLabelKeysProperty = data.linkLabelKeysProperty;
            }
        }
        else if (cls === 'TreeModel') {
            var TM = require('./TreeModel').TreeModel;
            model = new TM();
        }
        else {
            model = new Model();
        }
        if (data.nodeDataArray) {
            model.nodeDataArray = data.nodeDataArray;
        }
        if (data.modelData) {
            model.modelData = data.modelData;
        }
        if (data.nodeKeyProperty !== undefined) {
            model.nodeKeyProperty = data.nodeKeyProperty;
        }
        if (data.nodeCategoryProperty !== undefined) {
            model.nodeCategoryProperty = data.nodeCategoryProperty;
        }
        return model;
    };
    Model.fromJSON = function (json) {
        return Model.fromJson(json);
    };
    // ============ 辅助方法 ============
    /** 重建 key 映射 */
    Model.prototype._rebuildKeyMap = function () {
        var e_6, _a;
        this._keyMap.clear();
        try {
            for (var _b = __values(this._nodeDataArray), _c = _b.next(); !_c.done; _c = _b.next()) {
                var data = _c.value;
                var key = this.getKeyForNodeData(data);
                if (key !== undefined) {
                    this._keyMap.add(key, data);
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        // 更新 nextKey
        var maxKey = 0;
        var it = this._keyMap.keys;
        while (it.next()) {
            if (typeof it.value === 'number' && it.value >= maxKey) {
                maxKey = it.value + 1;
            }
        }
        this._nextKey = maxKey || 1;
    };
    /** 清空 */
    Model.prototype.clear = function () {
        this._nodeDataArray.length = 0;
        this._keyMap.clear();
        this._nextKey = 1;
    };
    /** 复制模型 */
    Model.prototype.copy = function () {
        var _this = this;
        var m = new Model();
        this.cloneProtected(m);
        m._nodeDataArray = this._nodeDataArray.map(function (d) { return _this.cloneDeep(d); });
        m._rebuildKeyMap();
        return m;
    };
    /** 模板方法：复制属性到新模型 */
    Model.prototype.cloneProtected = function (copy) {
        copy.nodeKeyProperty = this.nodeKeyProperty;
        copy.nodeCategoryProperty = this.nodeCategoryProperty;
        copy.nodeIsGroupProperty = this.nodeIsGroupProperty;
        copy.nodeGroupKeyProperty = this.nodeGroupKeyProperty;
        copy.linkLabelKeysProperty = this.linkLabelKeysProperty;
        copy.isReadOnly = this.isReadOnly;
        copy.dataFormat = this.dataFormat;
        copy.name = this.name;
        copy.copiesArrayObjects = this.copiesArrayObjects;
        copy.copiesArrays = this.copiesArrays;
        copy.copiesKey = this.copiesKey;
        copy.pointsDigits = this.pointsDigits;
        copy.modelData = this.cloneDeep(this.modelData);
        copy.makeUniqueKeyFunction = this.makeUniqueKeyFunction;
        copy.copyNodeDataFunction = this.copyNodeDataFunction;
        copy.makeUniqueLinkKeyFunction = this.makeUniqueLinkKeyFunction;
        copy.copyLinkDataFunction = this.copyLinkDataFunction;
    };
    /** 批量设置属性 */
    Model.prototype.set = function (props) {
        for (var key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                if (this[key] !== undefined) {
                    this[key] = props[key];
                }
            }
        }
        return this;
    };
    return Model;
}());

/**
 * GraphLinksModel - 图连接模型
 * 额外管理 linkDataArray，支持任意拓扑
 */
var GraphLinksModel = /** @class */ (function (_super) {
    __extends(GraphLinksModel, _super);
    function GraphLinksModel(init, linkDataArray) {
        var _this = _super.call(this, Array.isArray(init) ? init : []) || this;
        /** 链接 from 属性名 */
        _this.linkFromKeyProperty = 'from';
        /** 链接 to 属性名 */
        _this.linkToKeyProperty = 'to';
        /** 链接 fromPort 属性名 */
        _this.linkFromPortIdProperty = 'fromPort';
        /** 链接 toPort 属性名 */
        _this.linkToPortIdProperty = 'toPort';
        /** 链接分类属性名 */
        _this.linkCategoryProperty = 'category';
        /** 链接点数据属性名 */
        _this.linkKeyProperty = '';
        /** 是否自动创建缺失的节点 */
        _this.createMissingNodeData = false;
        _this._linkDataArray = [];
        _this._linkKeyMap = new Map$1();
        _this._nextLinkKey = -1;
        if (init && !Array.isArray(init)) {
            _this.set(init);
        }
        _this._linkDataArray = linkDataArray || [];
        _this._rebuildLinkKeyMap();
        return _this;
    }
    Object.defineProperty(GraphLinksModel.prototype, "linkDataArray", {
        // ============ 链接数据管理 ============
        get: function () {
            return this._linkDataArray;
        },
        set: function (val) {
            this._linkDataArray = val || [];
            this._rebuildLinkKeyMap();
        },
        enumerable: false,
        configurable: true
    });
    /** 添加链接数据 */
    GraphLinksModel.prototype.addLinkData = function (data) {
        if (!data)
            throw new Error('Cannot add null link data');
        if (this.isReadOnly)
            throw new Error('Model is read-only');
        this._linkDataArray.push(data);
        if (this.linkKeyProperty) {
            var key = this.getLinkKeyForData(data);
            if (key !== undefined) {
                this._linkKeyMap.add(key, data);
            }
        }
        this.raiseChangedEvent(ChangedEventInsert, this, 'linkDataArray', null, data, this._linkDataArray.length - 1);
    };
    /** 移除链接数据 */
    GraphLinksModel.prototype.removeLinkData = function (data) {
        if (!data)
            return false;
        if (this.isReadOnly)
            throw new Error('Model is read-only');
        var idx = this._linkDataArray.indexOf(data);
        if (idx < 0)
            return false;
        this._linkDataArray.splice(idx, 1);
        if (this.linkKeyProperty) {
            var key = this.getLinkKeyForData(data);
            if (key !== undefined) {
                this._linkKeyMap.remove(key);
            }
        }
        this.raiseChangedEvent(ChangedEventRemove, this, 'linkDataArray', data, null, idx);
        return true;
    };
    /** 是否包含链接数据 */
    GraphLinksModel.prototype.containsLinkData = function (data) {
        return this._linkDataArray.indexOf(data) >= 0;
    };
    /** 根据 key 查找链接数据 */
    GraphLinksModel.prototype.findLinkDataForKey = function (key) {
        return this._linkKeyMap.get(key);
    };
    /** 获取链接的 from key */
    GraphLinksModel.prototype.getFromKeyForLinkData = function (data) {
        if (!data)
            return undefined;
        return data[this.linkFromKeyProperty];
    };
    /** 设置链接的 from key */
    GraphLinksModel.prototype.setFromKeyForLinkData = function (data, key) {
        if (!data)
            return;
        this.setDataProperty(data, this.linkFromKeyProperty, key);
    };
    /** 获取链接的 to key */
    GraphLinksModel.prototype.getToKeyForLinkData = function (data) {
        if (!data)
            return undefined;
        return data[this.linkToKeyProperty];
    };
    /** 设置链接的 to key */
    GraphLinksModel.prototype.setToKeyForLinkData = function (data, key) {
        if (!data)
            return;
        this.setDataProperty(data, this.linkToKeyProperty, key);
    };
    /** 获取链接的 fromPort */
    GraphLinksModel.prototype.getFromPortIdForLinkData = function (data) {
        if (!data)
            return '';
        return data[this.linkFromPortIdProperty] || '';
    };
    /** 设置链接的 fromPort */
    GraphLinksModel.prototype.setFromPortIdForLinkData = function (data, portId) {
        if (!data)
            return;
        this.setDataProperty(data, this.linkFromPortIdProperty, portId);
    };
    /** 获取链接的 toPort */
    GraphLinksModel.prototype.getToPortIdForLinkData = function (data) {
        if (!data)
            return '';
        return data[this.linkToPortIdProperty] || '';
    };
    /** 设置链接的 toPort */
    GraphLinksModel.prototype.setToPortIdForLinkData = function (data, portId) {
        if (!data)
            return;
        this.setDataProperty(data, this.linkToPortIdProperty, portId);
    };
    /** 获取链接的标签 key 数组 */
    GraphLinksModel.prototype.getLabelKeysForLinkData = function (data) {
        if (!data || !this.linkLabelKeysProperty)
            return [];
        return data[this.linkLabelKeysProperty] || [];
    };
    /** 设置链接的标签 key 数组 */
    GraphLinksModel.prototype.setLabelKeysForLinkData = function (data, keys) {
        if (!data || !this.linkLabelKeysProperty)
            return;
        this.setDataProperty(data, this.linkLabelKeysProperty, keys);
    };
    /** 获取链接分类 */
    GraphLinksModel.prototype.getCategoryForLinkData = function (data) {
        if (!data)
            return '';
        return data[this.linkCategoryProperty] || '';
    };
    /** 设置链接分类 */
    GraphLinksModel.prototype.setCategoryForLinkData = function (data, category) {
        if (!data)
            return;
        this.setDataProperty(data, this.linkCategoryProperty, category);
    };
    /** 获取链接 key */
    GraphLinksModel.prototype.getLinkKeyForData = function (data) {
        if (!data || !this.linkKeyProperty)
            return undefined;
        return data[this.linkKeyProperty];
    };
    /** 设置链接 key */
    GraphLinksModel.prototype.setLinkKeyForData = function (data, key) {
        if (!data || !this.linkKeyProperty)
            return;
        this.setDataProperty(data, this.linkKeyProperty, key);
    };
    // ============ 序列化 ============
    GraphLinksModel.prototype.toJson = function () {
        var data = {
            class: 'GraphLinksModel',
            nodeDataArray: this.nodeDataArray,
            linkDataArray: this._linkDataArray,
        };
        if (Object.keys(this.modelData).length > 0) {
            data.modelData = this.modelData;
        }
        return JSON.stringify(data, null, 2);
    };
    GraphLinksModel.fromJson = function (json) {
        var data = typeof json === 'string' ? JSON.parse(json) : json;
        var model = new GraphLinksModel();
        if (data.nodeDataArray) {
            model.nodeDataArray = data.nodeDataArray;
        }
        if (data.linkDataArray) {
            model.linkDataArray = data.linkDataArray;
        }
        if (data.modelData) {
            model.modelData = data.modelData;
        }
        return model;
    };
    // ============ 辅助方法 ============
    GraphLinksModel.prototype._rebuildLinkKeyMap = function () {
        var e_1, _a;
        this._linkKeyMap.clear();
        if (!this.linkKeyProperty)
            return;
        try {
            for (var _b = __values(this._linkDataArray), _c = _b.next(); !_c.done; _c = _b.next()) {
                var data = _c.value;
                var key = this.getLinkKeyForData(data);
                if (key !== undefined) {
                    this._linkKeyMap.add(key, data);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    GraphLinksModel.prototype.clear = function () {
        _super.prototype.clear.call(this);
        this._linkDataArray.length = 0;
        this._linkKeyMap.clear();
    };
    GraphLinksModel.prototype.copy = function () {
        var _this = this;
        var m = new GraphLinksModel();
        this.cloneProtected(m);
        m.nodeDataArray = this.nodeDataArray.map(function (d) { return _this.cloneDeep(d); });
        m.linkDataArray = this._linkDataArray.map(function (d) { return _this.cloneDeep(d); });
        return m;
    };
    GraphLinksModel.prototype.cloneProtected = function (copy) {
        _super.prototype.cloneProtected.call(this, copy);
        var m = copy;
        m.linkFromKeyProperty = this.linkFromKeyProperty;
        m.linkToKeyProperty = this.linkToKeyProperty;
        m.linkFromPortIdProperty = this.linkFromPortIdProperty;
        m.linkToPortIdProperty = this.linkToPortIdProperty;
        m.linkCategoryProperty = this.linkCategoryProperty;
        m.linkKeyProperty = this.linkKeyProperty;
        m.createMissingNodeData = this.createMissingNodeData;
    };
    return GraphLinksModel;
}(Model));

/**
 * TreeModel - 树模型
 * 通过 parentKey 属性定义层级关系，无需 linkDataArray
 */
var TreeModel = /** @class */ (function (_super) {
    __extends(TreeModel, _super);
    function TreeModel(init) {
        var _this = _super.call(this, Array.isArray(init) ? init : []) || this;
        _this.nodeParentKeyProperty = 'parent';
        if (init && !Array.isArray(init)) {
            _this.set(init);
        }
        return _this;
    }
    /** 获取节点的父节点 key */
    TreeModel.prototype.getParentKeyForNodeData = function (data) {
        if (!data)
            return undefined;
        var prop = this.nodeParentKeyProperty;
        if (typeof prop === 'function') {
            return prop(data);
        }
        return data[prop];
    };
    /** 设置节点的父节点 key */
    TreeModel.prototype.setParentKeyForNodeData = function (data, key) {
        if (!data)
            return;
        var prop = this.nodeParentKeyProperty;
        if (typeof prop === 'string') {
            this.setDataProperty(data, prop, key);
        }
    };
    // ============ 序列化 ============
    TreeModel.prototype.toJson = function () {
        var data = {
            class: 'TreeModel',
            nodeDataArray: this.nodeDataArray,
        };
        if (Object.keys(this.modelData).length > 0) {
            data.modelData = this.modelData;
        }
        return JSON.stringify(data, null, 2);
    };
    TreeModel.fromJson = function (json) {
        var data = typeof json === 'string' ? JSON.parse(json) : json;
        var model = new TreeModel();
        if (data.nodeDataArray) {
            model.nodeDataArray = data.nodeDataArray;
        }
        if (data.modelData) {
            model.modelData = data.modelData;
        }
        return model;
    };
    TreeModel.prototype.copy = function () {
        var _this = this;
        var m = new TreeModel();
        this.cloneProtected(m);
        m.nodeDataArray = this.nodeDataArray.map(function (d) { return _this.cloneDeep(d); });
        return m;
    };
    TreeModel.prototype.cloneProtected = function (copy) {
        _super.prototype.cloneProtected.call(this, copy);
        var m = copy;
        m.nodeParentKeyProperty = this.nodeParentKeyProperty;
    };
    return TreeModel;
}(Model));

/**
 * RowColumnDefinition - defines the sizing and appearance of a row or column in a Table panel.
 */
var RowColumnDefinition = /** @class */ (function () {
    function RowColumnDefinition() {
        this._row = NaN;
        this._column = NaN;
        this._height = NaN;
        this._width = NaN;
        this._minimum = 0;
        this._maximum = Infinity;
        this._sizing = SizingNone;
        this._separatorStroke = null;
        this._separatorStrokeWidth = 1;
        this._separatorDashArray = null;
        this._background = null;
        this._coversSeparators = false;
    }
    RowColumnDefinition.prototype.set = function (props) {
        if (!props)
            return this;
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key in this) {
                this[key] = props[key];
            }
        }
        return this;
    };
    Object.defineProperty(RowColumnDefinition.prototype, "row", {
        get: function () { return this._row; },
        set: function (val) {
            if (this._row === val)
                return;
            this._row = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "column", {
        get: function () { return this._column; },
        set: function (val) {
            if (this._column === val)
                return;
            this._column = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "height", {
        get: function () { return this._height; },
        set: function (val) {
            if (this._height === val)
                return;
            this._height = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "width", {
        get: function () { return this._width; },
        set: function (val) {
            if (this._width === val)
                return;
            this._width = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "minimum", {
        get: function () { return this._minimum; },
        set: function (val) {
            if (this._minimum === val)
                return;
            this._minimum = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "maximum", {
        get: function () { return this._maximum; },
        set: function (val) {
            if (this._maximum === val)
                return;
            this._maximum = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "sizing", {
        get: function () { return this._sizing; },
        set: function (val) {
            if (this._sizing === val)
                return;
            this._sizing = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "separatorStroke", {
        get: function () { return this._separatorStroke; },
        set: function (val) {
            this._separatorStroke = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "separatorStrokeWidth", {
        get: function () { return this._separatorStrokeWidth; },
        set: function (val) {
            if (this._separatorStrokeWidth === val)
                return;
            this._separatorStrokeWidth = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "separatorDashArray", {
        get: function () { return this._separatorDashArray; },
        set: function (val) {
            this._separatorDashArray = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "background", {
        get: function () { return this._background; },
        set: function (val) {
            this._background = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RowColumnDefinition.prototype, "coversSeparators", {
        get: function () { return this._coversSeparators; },
        set: function (val) {
            if (this._coversSeparators === val)
                return;
            this._coversSeparators = val;
        },
        enumerable: false,
        configurable: true
    });
    RowColumnDefinition.prototype.copy = function () {
        var def = new RowColumnDefinition();
        def._row = this._row;
        def._column = this._column;
        def._height = this._height;
        def._width = this._width;
        def._minimum = this._minimum;
        def._maximum = this._maximum;
        def._sizing = this._sizing;
        def._separatorStroke = this._separatorStroke;
        def._separatorStrokeWidth = this._separatorStrokeWidth;
        def._separatorDashArray = this._separatorDashArray ? __spreadArray([], __read(this._separatorDashArray), false) : null;
        def._background = this._background;
        def._coversSeparators = this._coversSeparators;
        return def;
    };
    return RowColumnDefinition;
}());

/**
 * GraphObject - base class for ALL visual objects in the GoJS diagramming library.
 * This includes shapes, text blocks, pictures, panels, and parts.
 */
var GraphObject = /** @class */ (function () {
    function GraphObject() {
        // ============ Protected fields ============
        this._panel = null;
        this._part = null;
        this._actualBounds = new Rect();
        this._measuredBounds = new Rect();
        this._naturalBounds = new Rect();
        this._bindings = [];
        this._isInDocument = false;
        this._isPlaceholder = false;
        this._className = 'GraphObject';
        // ============ Private property storage ============
        this._desiredSize = Size.NaN.copy();
        this._minSize = new Size(0, 0);
        this._maxSize = new Size(Infinity, Infinity);
        this._margin = Margin.Zero.copy();
        this._alignment = Spot.Default.copy();
        this._alignmentFocus = Spot.Default.copy();
        this._angle = 0;
        this._opacity = 1;
        this._visible = true;
        this._stretch = StretchDefault;
        this._cursor = '';
        this._name = '';
        this._column = 0;
        this._columnSpan = 1;
        this._row = 0;
        this._rowSpan = 1;
        this._scale = 1;
        this._interval = 1;
        this._flip = FlipNone;
        this._shadowVisible = null;
        this._background = '';
        this._pickable = true;
        this._isActionable = false;
        this._isPanelMain = false;
        this._portId = '';
        this._contextMenu = null;
        this._toolTip = null;
        this._fromLinkable = false;
        this._toLinkable = false;
        this._fromLinkableDuplicates = false;
        this._toLinkableDuplicates = false;
        this._fromLinkableSelfNode = false;
        this._toLinkableSelfNode = false;
        this._fromMaxLinks = Infinity;
        this._toMaxLinks = Infinity;
        this._fromSpot = Spot.Default.copy();
        this._toSpot = Spot.Default.copy();
        this._fromEndSegmentLength = 10;
        this._toEndSegmentLength = 10;
        this._fromShortLength = 0;
        this._toShortLength = 0;
        this._segmentIndex = NaN;
        this._segmentFraction = 0;
        this._segmentOffset = new Point(NaN, NaN);
        this._segmentOrientation = SegmentOrientationNone;
        this._position = new Point(NaN, NaN);
        // ============ Event handlers ============
        this._click = null;
        this._doubleClick = null;
        this._contextClick = null;
        this._mouseEnter = null;
        this._mouseLeave = null;
        this._mouseOver = null;
        this._mouseHover = null;
        this._mouseHold = null;
        this._mouseDragEnter = null;
        this._mouseDragLeave = null;
        this._mouseDrop = null;
        this._actionDown = null;
        this._actionMove = null;
        this._actionUp = null;
        this._actionCancel = null;
        this._enabledChanged = null;
        // Base constructor - subclasses extend
    }
    Object.defineProperty(GraphObject.prototype, "width", {
        // ============ Properties with change notification ============
        /** Convenience property for desiredSize.width */
        get: function () { return this._desiredSize.width; },
        set: function (val) {
            if (this._desiredSize.width === val)
                return;
            this._desiredSize = new Size(val, this._desiredSize.height);
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "height", {
        /** Convenience property for desiredSize.height */
        get: function () { return this._desiredSize.height; },
        set: function (val) {
            if (this._desiredSize.height === val)
                return;
            this._desiredSize = new Size(this._desiredSize.width, val);
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "desiredSize", {
        get: function () { return this._desiredSize; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
            if (this._desiredSize.equals(s))
                return;
            this._desiredSize = s;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "minSize", {
        get: function () { return this._minSize; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.Zero.copy());
            if (this._minSize.equals(s))
                return;
            this._minSize = s;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "maxSize", {
        get: function () { return this._maxSize; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
            if (this._maxSize.equals(s))
                return;
            this._maxSize = s;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "margin", {
        get: function () { return this._margin; },
        set: function (val) {
            var m = typeof val === 'number' ? new Margin(val) : val;
            var c = m && typeof m.copy === 'function' ? m.copy() : (m ? new Margin(m.top || 0, m.right || 0, m.bottom || 0, m.left || 0) : Margin.Zero.copy());
            if (this._margin.equals(c))
                return;
            this._margin = c;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "alignment", {
        get: function () { return this._alignment; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
            if (this._alignment.equals(s))
                return;
            this._alignment = s;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "alignmentFocus", {
        get: function () { return this._alignmentFocus; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
            if (this._alignmentFocus.equals(s))
                return;
            this._alignmentFocus = s;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "angle", {
        get: function () { return this._angle; },
        set: function (val) {
            if (this._angle === val)
                return;
            this._angle = val;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "opacity", {
        get: function () { return this._opacity; },
        set: function (val) {
            if (this._opacity === val)
                return;
            this._opacity = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "visible", {
        get: function () { return this._visible; },
        set: function (val) {
            if (this._visible === val)
                return;
            this._visible = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "stretch", {
        get: function () { return this._stretch; },
        set: function (val) {
            if (this._stretch === val)
                return;
            this._stretch = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "cursor", {
        get: function () { return this._cursor; },
        set: function (val) {
            this._cursor = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "name", {
        get: function () { return this._name; },
        set: function (val) {
            this._name = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "position", {
        get: function () { return this._position; },
        set: function (val) {
            var p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
            if (this._position.equals(p))
                return;
            this._position = p;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "column", {
        get: function () { return this._column; },
        set: function (val) {
            if (this._column === val)
                return;
            this._column = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "columnSpan", {
        get: function () { return this._columnSpan; },
        set: function (val) {
            if (this._columnSpan === val)
                return;
            this._columnSpan = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "row", {
        get: function () { return this._row; },
        set: function (val) {
            if (this._row === val)
                return;
            this._row = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "rowSpan", {
        get: function () { return this._rowSpan; },
        set: function (val) {
            if (this._rowSpan === val)
                return;
            this._rowSpan = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "interval", {
        get: function () { return this._interval; },
        set: function (val) { this._interval = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "scale", {
        get: function () { return this._scale; },
        set: function (val) {
            if (this._scale === val)
                return;
            this._scale = val;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "flip", {
        get: function () { return this._flip; },
        set: function (val) {
            if (this._flip === val)
                return;
            this._flip = val;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "shadowVisible", {
        get: function () { return this._shadowVisible; },
        set: function (val) {
            if (this._shadowVisible === val)
                return;
            this._shadowVisible = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "background", {
        get: function () { return this._background; },
        set: function (val) {
            this._background = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "pickable", {
        get: function () { return this._pickable; },
        set: function (val) {
            this._pickable = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "isActionable", {
        get: function () { return this._isActionable; },
        set: function (val) {
            this._isActionable = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "isPanelMain", {
        get: function () { return this._isPanelMain; },
        set: function (val) {
            this._isPanelMain = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "portId", {
        get: function () { return this._portId; },
        set: function (val) {
            this._portId = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "contextMenu", {
        get: function () { return this._contextMenu; },
        set: function (val) { this._contextMenu = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toolTip", {
        get: function () { return this._toolTip; },
        set: function (val) { this._toolTip = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromLinkable", {
        get: function () { return this._fromLinkable; },
        set: function (val) {
            this._fromLinkable = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toLinkable", {
        get: function () { return this._toLinkable; },
        set: function (val) {
            this._toLinkable = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromLinkableDuplicates", {
        get: function () { return this._fromLinkableDuplicates; },
        set: function (val) {
            this._fromLinkableDuplicates = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toLinkableDuplicates", {
        get: function () { return this._toLinkableDuplicates; },
        set: function (val) {
            this._toLinkableDuplicates = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromLinkableSelfNode", {
        get: function () { return this._fromLinkableSelfNode; },
        set: function (val) {
            this._fromLinkableSelfNode = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toLinkableSelfNode", {
        get: function () { return this._toLinkableSelfNode; },
        set: function (val) {
            this._toLinkableSelfNode = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromMaxLinks", {
        get: function () { return this._fromMaxLinks; },
        set: function (val) {
            this._fromMaxLinks = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toMaxLinks", {
        get: function () { return this._toMaxLinks; },
        set: function (val) {
            this._toMaxLinks = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromSpot", {
        get: function () { return this._fromSpot; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
            if (this._fromSpot.equals(s))
                return;
            this._fromSpot = s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toSpot", {
        get: function () { return this._toSpot; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
            if (this._toSpot.equals(s))
                return;
            this._toSpot = s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromEndSegmentLength", {
        get: function () { return this._fromEndSegmentLength; },
        set: function (val) {
            this._fromEndSegmentLength = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toEndSegmentLength", {
        get: function () { return this._toEndSegmentLength; },
        set: function (val) {
            this._toEndSegmentLength = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "fromShortLength", {
        get: function () { return this._fromShortLength; },
        set: function (val) {
            this._fromShortLength = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "toShortLength", {
        get: function () { return this._toShortLength; },
        set: function (val) {
            this._toShortLength = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "segmentIndex", {
        get: function () { return this._segmentIndex; },
        set: function (val) {
            if (this._segmentIndex === val)
                return;
            this._segmentIndex = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "segmentFraction", {
        get: function () { return this._segmentFraction; },
        set: function (val) {
            if (this._segmentFraction === val)
                return;
            this._segmentFraction = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "segmentOffset", {
        get: function () { return this._segmentOffset; },
        set: function (val) {
            var p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
            if (this._segmentOffset.equals(p))
                return;
            this._segmentOffset = p;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "segmentOrientation", {
        get: function () { return this._segmentOrientation; },
        set: function (val) {
            if (this._segmentOrientation === val)
                return;
            this._segmentOrientation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "actualBounds", {
        // ============ Read-only computed properties ============
        get: function () { return this._actualBounds; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "measuredBounds", {
        get: function () { return this._measuredBounds; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "naturalBounds", {
        get: function () { return this._naturalBounds; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "panel", {
        get: function () { return this._panel; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "part", {
        get: function () { return this._part; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "diagram", {
        get: function () {
            var p = this._part;
            return p ? p._diagram : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "layer", {
        get: function () {
            var p = this._part;
            return p ? p.layer : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "click", {
        // ============ Event handler properties ============
        get: function () { return this._click; },
        set: function (val) { this._click = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "doubleClick", {
        get: function () { return this._doubleClick; },
        set: function (val) { this._doubleClick = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "contextClick", {
        get: function () { return this._contextClick; },
        set: function (val) { this._contextClick = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseEnter", {
        get: function () { return this._mouseEnter; },
        set: function (val) { this._mouseEnter = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseLeave", {
        get: function () { return this._mouseLeave; },
        set: function (val) { this._mouseLeave = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseOver", {
        get: function () { return this._mouseOver; },
        set: function (val) { this._mouseOver = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseHover", {
        get: function () { return this._mouseHover; },
        set: function (val) { this._mouseHover = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseHold", {
        get: function () { return this._mouseHold; },
        set: function (val) { this._mouseHold = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseDragEnter", {
        get: function () { return this._mouseDragEnter; },
        set: function (val) { this._mouseDragEnter = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseDragLeave", {
        get: function () { return this._mouseDragLeave; },
        set: function (val) { this._mouseDragLeave = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "mouseDrop", {
        get: function () { return this._mouseDrop; },
        set: function (val) { this._mouseDrop = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "actionDown", {
        get: function () { return this._actionDown; },
        set: function (val) { this._actionDown = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "actionMove", {
        get: function () { return this._actionMove; },
        set: function (val) { this._actionMove = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "actionUp", {
        get: function () { return this._actionUp; },
        set: function (val) { this._actionUp = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "actionCancel", {
        get: function () { return this._actionCancel; },
        set: function (val) { this._actionCancel = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GraphObject.prototype, "enabledChanged", {
        get: function () { return this._enabledChanged; },
        set: function (val) { this._enabledChanged = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Public methods ============
    /** Add a data binding to this object */
    GraphObject.prototype.bind = function (bindingOrTargetProp, sourceProperty, conversion) {
        if (typeof bindingOrTargetProp === 'string') {
            // Shorthand: .bind("fill", "color") or .bind("text")
            this._bindings.push(new Binding(bindingOrTargetProp, sourceProperty, conversion));
        }
        else {
            this._bindings.push(bindingOrTargetProp);
        }
        return this;
    };
    GraphObject.prototype.bindObject = function (targetProperty, sourceProperty, conversion, backConversion, sourceObject) {
        var binding = new Binding(targetProperty, sourceProperty, conversion || undefined);
        binding.sourceObject = sourceObject !== undefined ? sourceObject : '';
        if (backConversion) {
            binding.makeTwoWay(backConversion);
        }
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.bindTwoWay = function (targetProperty, sourceProperty, backConversion, conversion) {
        var binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion || undefined);
        binding.makeTwoWay(backConversion || undefined);
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.theme = function (targetProperty, sourceProperty, conversion) {
        var binding = new Binding(targetProperty, sourceProperty, conversion);
        binding.sourceObject = '';
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.themeData = function (targetProperty, sourceProperty, conversion) {
        var binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
        binding.sourceObject = 'model';
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.themeModel = function (targetProperty, sourceProperty, conversion) {
        var binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
        binding.sourceObject = 'theme';
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.themeObject = function (targetProperty, sourceProperty, conversion, objectname) {
        var binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
        binding.sourceObject = objectname || '';
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.bindModel = function (targetProperty, sourceProperty, conversion) {
        var binding = new Binding(targetProperty, sourceProperty || targetProperty, conversion);
        binding.sourceObject = 'model';
        this._bindings.push(binding);
        return this;
    };
    GraphObject.prototype.setProperties = function (props) {
        return this.set(props);
    };
    /** Batch set properties */
    GraphObject.prototype.set = function (props) {
        if (!props)
            return this;
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.charAt(0) === '_')
                continue;
            if (key.indexOf('.') >= 0) {
                var parts = key.split('.');
                var target = this;
                for (var j = 0; j < parts.length - 1; j++) {
                    target = target[parts[j]];
                    if (!target)
                        break;
                }
                if (target) {
                    target[parts[parts.length - 1]] = props[key];
                }
            }
            else if (key in this) {
                this[key] = props[key];
            }
        }
        return this;
    };
    /** Virtual copy - creates a shallow copy of this GraphObject */
    GraphObject.prototype.copy = function () {
        var copy = new GraphObject();
        this._copyPropertiesTo(copy);
        return copy;
    };
    /** Apply a function to this object and return it */
    GraphObject.prototype.apply = function (func) {
        func(this);
        return this;
    };
    /** Find the nearest panel that has data bound to it */
    GraphObject.prototype.findBindingPanel = function () {
        var panel = this._panel;
        while (panel !== null) {
            if (panel.data !== null && panel.data !== undefined) {
                return panel;
            }
            panel = panel._panel;
        }
        return null;
    };
    GraphObject.prototype.attach = function (props) {
        if (!props)
            return this;
        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key.indexOf('.') >= 0) {
                var parts = key.split('.');
                var target = this;
                for (var j = 0; j < parts.length - 1; j++) {
                    target = target[parts[j]];
                    if (!target)
                        break;
                }
                if (target) {
                    target[parts[parts.length - 1]] = props[key];
                }
            }
            else {
                this[key] = props[key];
            }
        }
        return this;
    };
    /** Get the total angle of this object in document coordinates */
    GraphObject.prototype.getDocumentAngle = function () {
        var angle = this._angle;
        var panel = this._panel;
        while (panel !== null) {
            angle += panel._angle || 0;
            panel = panel._panel;
        }
        return angle;
    };
    /** Get the bounding rectangle of this object in document coordinates */
    GraphObject.prototype.getDocumentBounds = function () {
        var bounds = this._actualBounds.copy();
        var panel = this._panel;
        var obj = this;
        while (panel !== null) {
            var panelBounds = panel._actualBounds;
            var margin = obj._margin;
            bounds.x += panelBounds.x + margin.left;
            bounds.y += panelBounds.y + margin.top;
            obj = panel;
            panel = panel._panel;
        }
        return bounds;
    };
    /** Convert a local point to document coordinates */
    GraphObject.prototype.getDocumentPoint = function (local) {
        var bounds = this.getDocumentBounds();
        return new Point(bounds.x + local.x, bounds.y + local.y);
    };
    /** Get the total scale of this object in document coordinates */
    GraphObject.prototype.getDocumentScale = function () {
        var scale = this._scale;
        var panel = this._panel;
        while (panel !== null) {
            scale *= panel._scale || 1;
            panel = panel._panel;
        }
        return scale;
    };
    /** Convert a document point to local coordinates */
    GraphObject.prototype.getLocalPoint = function (p) {
        var bounds = this.getDocumentBounds();
        return new Point(p.x - bounds.x, p.y - bounds.y);
    };
    /** Check if this object is contained by the given panel */
    GraphObject.prototype.isContainedBy = function (panel) {
        var p = this._panel;
        while (p !== null) {
            if (p === panel)
                return true;
            p = p._panel;
        }
        return false;
    };
    /** Check if this object is effectively enabled */
    GraphObject.prototype.isEnabledObject = function () {
        if (!this._pickable)
            return false;
        var obj = this;
        while (obj !== null) {
            if (!obj._visible)
                return false;
            obj = obj._panel;
        }
        return true;
    };
    /** Check if this object is effectively visible */
    GraphObject.prototype.isVisibleObject = function () {
        var obj = this;
        while (obj !== null) {
            if (!obj._visible)
                return false;
            obj = obj._panel;
        }
        return true;
    };
    /** Trigger a property change notification */
    GraphObject.prototype.trigger = function (propname, value) {
        var panel = this._panel;
        if (panel && typeof panel._handleObjectPropertyChanged === 'function') {
            panel._handleObjectPropertyChanged(this, propname, value);
        }
        var part = this._part;
        if (part && typeof part._handleObjectPropertyChanged === 'function') {
            part._handleObjectPropertyChanged(this, propname, value);
        }
    };
    // ============ Internal methods ============
    /** Invalidate the measurement of this object and its ancestors */
    GraphObject.prototype._invalidateMeasure = function () {
        var panel = this._panel;
        if (panel && typeof panel._invalidateMeasure === 'function') {
            panel._invalidateMeasure();
        }
    };
    /** Invalidate the arrangement of this object and its ancestors */
    GraphObject.prototype._invalidateArrange = function () {
        var panel = this._panel;
        if (panel && typeof panel._invalidateArrange === 'function') {
            panel._invalidateArrange();
        }
    };
    /** Measure this object within the given constraints */
    GraphObject.prototype._measure = function (widthConstraint, heightConstraint) {
        // Base implementation - subclasses override
        this._measuredBounds = new Rect(0, 0, widthConstraint, heightConstraint);
        this._applySizeConstraints();
    };
    /** Apply minSize/maxSize/desiredSize constraints to measured bounds */
    GraphObject.prototype._applySizeConstraints = function () {
        var mb = this._measuredBounds;
        var w = mb.width;
        var h = mb.height;
        // Apply desiredSize if set (overrides natural size)
        if (!this._desiredSize.isReal) ;
        else {
            if (!isNaN(this._desiredSize.width))
                w = this._desiredSize.width;
            if (!isNaN(this._desiredSize.height))
                h = this._desiredSize.height;
        }
        // Apply minSize
        if (!isNaN(this._minSize.width) && w < this._minSize.width)
            w = this._minSize.width;
        if (!isNaN(this._minSize.height) && h < this._minSize.height)
            h = this._minSize.height;
        // Apply maxSize
        if (!isNaN(this._maxSize.width) && w > this._maxSize.width)
            w = this._maxSize.width;
        if (!isNaN(this._maxSize.height) && h > this._maxSize.height)
            h = this._maxSize.height;
        this._measuredBounds = new Rect(0, 0, w, h);
    };
    /** Arrange this object within the given bounds */
    GraphObject.prototype._arrange = function (bounds) {
        // Base implementation - subclasses override
        this._actualBounds = bounds.copy();
    };
    // ============ Protected helpers ============
    /** Copy all properties to another GraphObject (used by copy()) */
    GraphObject.prototype._copyPropertiesTo = function (copy) {
        copy._desiredSize = this._desiredSize.copy();
        copy._minSize = this._minSize.copy();
        copy._maxSize = this._maxSize.copy();
        copy._margin = this._margin.copy();
        copy._alignment = this._alignment.copy();
        copy._alignmentFocus = this._alignmentFocus.copy();
        copy._angle = this._angle;
        copy._opacity = this._opacity;
        copy._visible = this._visible;
        copy._stretch = this._stretch;
        copy._cursor = this._cursor;
        copy._name = this._name;
        copy._position = this._position.copy();
        copy._column = this._column;
        copy._columnSpan = this._columnSpan;
        copy._row = this._row;
        copy._rowSpan = this._rowSpan;
        copy._scale = this._scale;
        copy._flip = this._flip;
        copy._shadowVisible = this._shadowVisible;
        copy._background = this._background;
        copy._pickable = this._pickable;
        copy._isActionable = this._isActionable;
        copy._isPanelMain = this._isPanelMain;
        copy._portId = this._portId;
        copy._contextMenu = this._contextMenu;
        copy._toolTip = this._toolTip;
        copy._fromLinkable = this._fromLinkable;
        copy._toLinkable = this._toLinkable;
        copy._fromLinkableDuplicates = this._fromLinkableDuplicates;
        copy._toLinkableDuplicates = this._toLinkableDuplicates;
        copy._fromLinkableSelfNode = this._fromLinkableSelfNode;
        copy._toLinkableSelfNode = this._toLinkableSelfNode;
        copy._fromMaxLinks = this._fromMaxLinks;
        copy._toMaxLinks = this._toMaxLinks;
        copy._fromSpot = this._fromSpot.copy();
        copy._toSpot = this._toSpot.copy();
        copy._fromEndSegmentLength = this._fromEndSegmentLength;
        copy._toEndSegmentLength = this._toEndSegmentLength;
        copy._fromShortLength = this._fromShortLength;
        copy._toShortLength = this._toShortLength;
        copy._segmentIndex = this._segmentIndex;
        copy._segmentFraction = this._segmentFraction;
        copy._segmentOffset = this._segmentOffset.copy();
        copy._segmentOrientation = this._segmentOrientation;
        // Copy bindings
        copy._bindings = this._bindings.map(function (b) { return b.copy(); });
        // Copy event handlers
        copy._click = this._click;
        copy._doubleClick = this._doubleClick;
        copy._contextClick = this._contextClick;
        copy._mouseEnter = this._mouseEnter;
        copy._mouseLeave = this._mouseLeave;
        copy._mouseOver = this._mouseOver;
        copy._mouseHover = this._mouseHover;
        copy._mouseHold = this._mouseHold;
        copy._mouseDragEnter = this._mouseDragEnter;
        copy._mouseDragLeave = this._mouseDragLeave;
        copy._mouseDrop = this._mouseDrop;
        copy._actionDown = this._actionDown;
        copy._actionMove = this._actionMove;
        copy._actionUp = this._actionUp;
        copy._actionCancel = this._actionCancel;
        copy._enabledChanged = this._enabledChanged;
    };
    GraphObject.defineBuilder = function (name, func) {
        GraphObject._classRegistry[name] = func;
    };
    GraphObject.takeBuilderArgument = function (obj, arg, def) {
        return arg !== undefined ? arg : def;
    };
    GraphObject.make = function (type) {
        var e_1, _a, e_2, _b;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var panelTypeMap = {
            'Auto': PanelAuto,
            'Vertical': PanelVertical,
            'Horizontal': PanelHorizontal,
            'Spot': PanelSpot,
            'Table': PanelTable,
            'Position': PanelPosition,
            'Link': PanelLink,
            'Viewbox': PanelViewbox,
            'Graduated': PanelGraduated,
            'Grid': PanelGrid,
            'TableRow': PanelTableRow,
            'TableColumn': PanelTableColumn,
        };
        var reg = GraphObject._classRegistry;
        var obj;
        var isPanelLike = false;
        if (typeof type === 'string') {
            switch (type) {
                case 'Auto':
                case 'Vertical':
                case 'Horizontal':
                case 'Spot':
                case 'Table':
                case 'Position':
                case 'Viewbox':
                case 'Graduated':
                case 'Grid':
                case 'TableRow':
                case 'TableColumn':
                    obj = new reg['Panel'](panelTypeMap[type]);
                    isPanelLike = true;
                    break;
                case 'Node':
                    obj = new reg['Node'](PanelAuto);
                    isPanelLike = true;
                    break;
                case 'Link':
                    obj = new reg['Link']();
                    isPanelLike = true;
                    break;
                case 'Shape':
                    obj = new reg['Shape']();
                    break;
                case 'TextBlock':
                    obj = new reg['TextBlock']();
                    break;
                case 'Picture':
                    obj = new reg['Picture']();
                    break;
                case 'Panel':
                    obj = new reg['Panel'](PanelAuto);
                    isPanelLike = true;
                    break;
                case 'Group':
                    obj = new reg['Group']();
                    isPanelLike = true;
                    break;
                case 'Placeholder':
                    obj = new reg['Placeholder']();
                    break;
                case 'Adornment':
                    obj = new reg['Adornment'](PanelAuto);
                    isPanelLike = true;
                    break;
                case 'Brush':
                    obj = new Brush();
                    break;
                case 'Geometry':
                    obj = new Geometry();
                    break;
                case 'RowColumnDefinition':
                    obj = new RowColumnDefinition();
                    break;
                default: {
                    var builderFunc = reg[type];
                    if (typeof builderFunc === 'function') {
                        obj = builderFunc(args);
                        isPanelLike = obj && typeof obj.add === 'function';
                    }
                    else {
                        throw new Error('GraphObject.make: unknown type string: ' + type);
                    }
                    break;
                }
            }
        }
        else if (typeof type === 'function') {
            if (type === Brush) {
                obj = new Brush();
            }
            else if (type === Geometry) {
                obj = new Geometry();
            }
            else if (type === RowColumnDefinition) {
                obj = new RowColumnDefinition();
            }
            else {
                obj = new type();
                isPanelLike = typeof obj.add === 'function';
            }
        }
        else if (type instanceof EnumValue) {
            if (reg['Panel']) {
                obj = new reg['Panel'](type);
                isPanelLike = true;
            }
            else {
                throw new Error('GraphObject.make: Panel class not registered');
            }
        }
        else {
            throw new Error('GraphObject.make: first argument must be a string or a constructor function');
        }
        try {
            for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                var arg = args_1_1.value;
                if (arg === null || arg === undefined)
                    continue;
                if (Array.isArray(arg)) {
                    try {
                        for (var arg_1 = (e_2 = void 0, __values(arg)), arg_1_1 = arg_1.next(); !arg_1_1.done; arg_1_1 = arg_1.next()) {
                            var item = arg_1_1.value;
                            if (item instanceof GraphObject && typeof obj.add === 'function') {
                                obj.add(item);
                            }
                            else if (item instanceof RowColumnDefinition && typeof obj.addRowDefinition === 'function') {
                                obj.addRowDefinition(item.row !== undefined ? item.row : undefined, item.height !== undefined ? item.height : undefined);
                            }
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (arg_1_1 && !arg_1_1.done && (_b = arg_1.return)) _b.call(arg_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                else if (arg instanceof RowColumnDefinition) {
                    if (typeof obj.addRowDefinition === 'function') {
                        obj.addRowDefinition(arg.row !== undefined ? arg.row : undefined, arg.height !== undefined ? arg.height : undefined);
                    }
                }
                else if (typeof arg === 'string') {
                    if (obj instanceof Brush) {
                        if (arg === 'Linear')
                            obj.type = BrushLinear;
                        else if (arg === 'Radial')
                            obj.type = BrushRadial;
                        else if (arg === 'Solid')
                            obj.type = BrushSolid;
                        else {
                            obj.type = BrushSolid;
                            obj.color = arg;
                        }
                    }
                    else if (obj instanceof Geometry) {
                        var parsed = Geometry.parse(arg);
                        if (parsed) {
                            obj.figures.clear();
                            var it = parsed.figures.iterator;
                            while (it.next()) {
                                obj.add(it.value);
                            }
                            obj._bounds = null;
                        }
                    }
                    else if (isPanelLike && panelTypeMap[arg] !== undefined) {
                        obj.type = panelTypeMap[arg];
                    }
                    else if (obj._className === 'TextBlock') {
                        obj.text = arg;
                    }
                    else if (obj._className === 'Shape') {
                        obj.figure = arg;
                    }
                    else if (obj._className === 'Picture') {
                        obj.source = arg;
                    }
                    else {
                        obj.name = arg;
                    }
                }
                else if (arg instanceof Binding) {
                    if (typeof obj.bind === 'function') {
                        obj.bind(arg);
                    }
                }
                else if (arg instanceof GraphObject) {
                    if (typeof obj.add === 'function') {
                        obj.add(arg);
                    }
                }
                else if (typeof arg === 'function') {
                    arg(obj);
                }
                else if (typeof arg === 'number') {
                    if (obj instanceof Brush) {
                        var idx = args.indexOf(arg);
                        var nextArg = idx >= 0 && idx + 1 < args.length ? args[idx + 1] : '';
                        if (typeof nextArg === 'string')
                            obj.addColorStop(arg, nextArg);
                    }
                }
                else if (arg !== null && typeof arg === 'object' && !(arg instanceof EnumValue)) {
                    if (typeof obj.set === 'function') {
                        obj.set(arg);
                    }
                    else {
                        var keys = Object.keys(arg);
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i];
                            if (key in obj) {
                                obj[key] = arg[key];
                            }
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return obj;
    };
    // ============ Static constants ============
    GraphObject.Default = StretchDefault;
    GraphObject.Fill = StretchFill;
    GraphObject.Horizontal = StretchHorizontal;
    GraphObject.Vertical = StretchVertical;
    GraphObject.None = StretchNone;
    GraphObject.Uniform = StretchUniform;
    GraphObject.UniformToFill = StretchUniformToFill;
    // ============ Static methods ============
    /** Factory method for creating GraphObjects - stub */
    GraphObject._classRegistry = {};
    GraphObject.build = GraphObject.make;
    return GraphObject;
}());

var figures = new Map$1();
function defineFigure(name, func) {
    figures.add(name, func);
}
function getFigureGeometry(name, w, h, p1, p2, shape) {
    var func = figures.get(name);
    if (!func)
        return null;
    return func(shape || null, w, h);
}
function getP1(shape, defaultVal) {
    if (shape && shape.parameter1 !== undefined && !isNaN(shape.parameter1))
        return shape.parameter1;
    return defaultVal;
}
function getP2(shape, defaultVal) {
    if (shape && shape.parameter2 !== undefined && !isNaN(shape.parameter2))
        return shape.parameter2;
    return defaultVal;
}
defineFigure('Rectangle', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('RoundedRectangle', function (shape, w, h) {
    var r = getP1(shape, 5);
    var p2 = getP2(shape, NaN);
    var allCorners = isNaN(p2);
    var tl = allCorners || (p2 & 1) !== 0;
    var tr = allCorners || (p2 & 2) !== 0;
    var br = allCorners || (p2 & 4) !== 0;
    var bl = allCorners || (p2 & 8) !== 0;
    var cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0 || (!tl && !tr && !br && !bl))
        return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
    var geo = new Geometry();
    var fig = new PathFigure(tl ? cr : 0, 0);
    fig.add(PathSegment.Line(tr ? w - cr : w, 0));
    if (tr) {
        fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
    }
    else {
        fig.add(PathSegment.Line(w, 0));
    }
    fig.add(PathSegment.Line(w, br ? h - cr : h));
    if (br) {
        fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
    }
    else {
        fig.add(PathSegment.Line(w, h));
    }
    fig.add(PathSegment.Line(bl ? cr : 0, h));
    if (bl) {
        fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
    }
    else {
        fig.add(PathSegment.Line(0, h));
    }
    fig.add(PathSegment.Line(0, tl ? cr : 0));
    if (tl) {
        fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
    }
    else {
        fig.add(PathSegment.Line(0, 0));
    }
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Ellipse', function (shape, w, h) {
    var geo = new Geometry();
    var rx = w / 2;
    var ry = h / 2;
    var fig = new PathFigure(w, ry);
    fig.add(PathSegment.Arc(0, ry, rx, ry, 0, false, true));
    fig.add(PathSegment.Arc(w, ry, rx, ry, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Circle', function (shape, w, h) {
    var geo = new Geometry();
    var r = Math.min(w, h) / 2;
    var cx = w / 2;
    var cy = h / 2;
    var fig = new PathFigure(cx + r, cy);
    fig.add(PathSegment.Arc(cx - r, cy, r, r, 0, false, true));
    fig.add(PathSegment.Arc(cx + r, cy, r, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Triangle', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0);
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('TriangleUp', function (shape, w, h) {
    return getFigureGeometry('Triangle', w, h, NaN, NaN, shape);
});
defineFigure('TriangleDown', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w / 2, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('TriangleLeft', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w, 0);
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('TriangleRight', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Diamond', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0);
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w / 2, h));
    fig.add(PathSegment.Line(0, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Pentagon', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0);
    fig.add(PathSegment.Line(w, h * 0.4));
    fig.add(PathSegment.Line(w * 0.8, h));
    fig.add(PathSegment.Line(w * 0.2, h));
    fig.add(PathSegment.Line(0, h * 0.4));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Hexagon', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.25, 0);
    fig.add(PathSegment.Line(w * 0.75, 0));
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w * 0.75, h));
    fig.add(PathSegment.Line(w * 0.25, h));
    fig.add(PathSegment.Line(0, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Octagon', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.3, 0);
    fig.add(PathSegment.Line(w * 0.7, 0));
    fig.add(PathSegment.Line(w, h * 0.3));
    fig.add(PathSegment.Line(w, h * 0.7));
    fig.add(PathSegment.Line(w * 0.7, h));
    fig.add(PathSegment.Line(w * 0.3, h));
    fig.add(PathSegment.Line(0, h * 0.7));
    fig.add(PathSegment.Line(0, h * 0.3));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Star', function (shape, w, h) {
    var geo = new Geometry();
    var cx = w / 2;
    var cy = h / 2;
    var outerR = Math.min(w, h) / 2;
    var innerR = getP1(shape, outerR * 0.4);
    var points = 5;
    var fig = new PathFigure(cx, cy - outerR);
    for (var i = 0; i < points; i++) {
        var outerAngle = (Math.PI * 2 * i) / points - Math.PI / 2;
        var innerAngle = outerAngle + Math.PI / points;
        if (i > 0) {
            fig.add(PathSegment.Line(cx + outerR * Math.cos(outerAngle), cy + outerR * Math.sin(outerAngle)));
        }
        fig.add(PathSegment.Line(cx + innerR * Math.cos(innerAngle), cy + innerR * Math.sin(innerAngle)));
    }
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('LineH', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, h / 2, false);
    fig.add(PathSegment.Line(w, h / 2));
    geo.add(fig);
    return geo;
});
defineFigure('LineV', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0, false);
    fig.add(PathSegment.Line(w / 2, h));
    geo.add(fig);
    return geo;
});
defineFigure('Arrow', function (shape, w, h) {
    var geo = new Geometry();
    var shaftHeight = getP1(shape, h * 0.5);
    var fig = new PathFigure(0, (h - shaftHeight) / 2);
    fig.add(PathSegment.Line(w * 0.6, (h - shaftHeight) / 2));
    fig.add(PathSegment.Line(w * 0.6, 0));
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w * 0.6, h));
    fig.add(PathSegment.Line(w * 0.6, (h + shaftHeight) / 2));
    fig.add(PathSegment.Line(0, (h + shaftHeight) / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Chevron', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w * 0.7, 0));
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w * 0.7, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Line(w * 0.3, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Cloud', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.5, h * 0.1);
    fig.add(PathSegment.CubicBezier(w * 0.9, h * 0.05, w * 0.75, 0, w * 0.9, h * 0.1));
    fig.add(PathSegment.CubicBezier(w * 1.05, h * 0.5, w * 1.1, h * 0.25, w * 1.0, h * 0.45));
    fig.add(PathSegment.CubicBezier(w * 0.85, h * 0.95, w * 1.05, h * 0.75, w * 0.85, h * 0.9));
    fig.add(PathSegment.CubicBezier(w * 0.15, h * 0.95, w * 0.5, h * 1.05, w * 0.15, h * 0.9));
    fig.add(PathSegment.CubicBezier(w * -0.05, h * 0.5, w * -0.1, h * 0.75, w * 0.0, h * 0.55));
    fig.add(PathSegment.CubicBezier(w * 0.15, h * 0.05, w * -0.1, h * 0.25, w * 0.1, h * 0.1));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Cylinder1', function (shape, w, h) {
    var geo = new Geometry();
    var r = getP1(shape, Math.min(w / 2, h / 8));
    var fig = new PathFigure(w, r);
    fig.add(PathSegment.Line(w, h - r));
    fig.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Line(0, r));
    fig.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(0, r);
    fig2.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Arc(0, r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    return geo;
});
defineFigure('Cylinder2', function (shape, w, h) {
    var r = getP1(shape, Math.min(w / 2, h / 8));
    var geo = new Geometry();
    var fig = new PathFigure(w, r);
    fig.add(PathSegment.Line(w, h - r));
    fig.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Line(0, r));
    fig.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Cylinder3', function (shape, w, h) {
    var r = getP1(shape, Math.min(w / 2, h / 8));
    var geo = new Geometry();
    var fig = new PathFigure(w, r);
    fig.add(PathSegment.Line(w, h - r));
    fig.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Arc(w, h - r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Line(w, r));
    fig.add(PathSegment.Arc(0, r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(0, r);
    fig2.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Arc(0, r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    return geo;
});
defineFigure('Cylinder4', function (shape, w, h) {
    var r = getP1(shape, Math.min(w / 2, h / 8));
    var geo = new Geometry();
    var fig = new PathFigure(w, r);
    fig.add(PathSegment.Arc(0, r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Line(0, h - r));
    fig.add(PathSegment.Arc(w, h - r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(0, h - r);
    fig2.add(PathSegment.Arc(w, h - r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    return geo;
});
defineFigure('Database', function (shape, w, h) {
    var r = getP1(shape, Math.min(w / 2, h / 8));
    var geo = new Geometry();
    var fig = new PathFigure(w, r);
    fig.add(PathSegment.Line(w, h - r));
    fig.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Line(0, r));
    fig.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(0, r);
    fig2.add(PathSegment.Arc(w, r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Arc(0, r, w / 2, r, 0, false, true));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    var fig3 = new PathFigure(0, h - r);
    fig3.add(PathSegment.Arc(w, h - r, w / 2, r, 0, false, true));
    fig3.add(PathSegment.Arc(0, h - r, w / 2, r, 0, false, true));
    fig3.add(PathSegment.Close());
    geo.add(fig3);
    return geo;
});
defineFigure('Note', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w * 0.8, 0));
    fig.add(PathSegment.Line(w, h * 0.15));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(w * 0.8, 0, false);
    fig2.add(PathSegment.Line(w * 0.8, h * 0.15));
    fig2.add(PathSegment.Line(w, h * 0.15));
    geo.add(fig2);
    return geo;
});
defineFigure('Terminator', function (shape, w, h) {
    var r = getP1(shape, h / 2);
    var cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0)
        return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
    var geo = new Geometry();
    var fig = new PathFigure(cr, 0);
    fig.add(PathSegment.Line(w - cr, 0));
    fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(w, h - cr));
    fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(cr, h));
    fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(0, cr));
    fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Process', function (shape, w, h) {
    var indent = getP1(shape, w * 0.1);
    var geo = new Geometry();
    var fig = new PathFigure(indent, 0);
    fig.add(PathSegment.Line(w - indent, 0));
    fig.add(PathSegment.Line(w - indent, h));
    fig.add(PathSegment.Line(indent, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Procedure', function (shape, w, h) {
    var indent = getP1(shape, w * 0.1);
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(indent, 0, false);
    fig2.add(PathSegment.Line(indent, h));
    geo.add(fig2);
    var fig3 = new PathFigure(w - indent, 0, false);
    fig3.add(PathSegment.Line(w - indent, h));
    geo.add(fig3);
    return geo;
});
defineFigure('PredefinedProcess', function (shape, w, h) {
    var indent = getP1(shape, w * 0.1);
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(indent, 0, false);
    fig2.add(PathSegment.Line(indent, h));
    geo.add(fig2);
    var fig3 = new PathFigure(w - indent, 0, false);
    fig3.add(PathSegment.Line(w - indent, h));
    geo.add(fig3);
    return geo;
});
defineFigure('InternalStorage', function (shape, w, h) {
    var indent = getP1(shape, w * 0.1);
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(indent, 0, false);
    fig2.add(PathSegment.Line(indent, h));
    geo.add(fig2);
    var fig3 = new PathFigure(0, indent, false);
    fig3.add(PathSegment.Line(w, indent));
    geo.add(fig3);
    return geo;
});
defineFigure('ManualInput', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w, 0);
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Line(w * 0.2, 0));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('ManualOperation', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w * 0.8, h));
    fig.add(PathSegment.Line(w * 0.2, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Preparation', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.15, 0);
    fig.add(PathSegment.Line(w * 0.85, 0));
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w * 0.85, h));
    fig.add(PathSegment.Line(w * 0.15, h));
    fig.add(PathSegment.Line(0, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Delay', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w * 0.7, 0));
    fig.add(PathSegment.CubicBezier(w, h / 2, w, 0, w, h / 2));
    fig.add(PathSegment.CubicBezier(w * 0.7, h, w, h, w * 0.7, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Display', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.2, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w * 0.8, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('OffPageLink', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h * 0.7));
    fig.add(PathSegment.Line(w / 2, h));
    fig.add(PathSegment.Line(0, h * 0.7));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Card', function (shape, w, h) {
    var indent = getP1(shape, w * 0.1);
    var geo = new Geometry();
    var fig = new PathFigure(indent, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Line(0, indent));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Annotation', function (shape, w, h) {
    var indent = getP1(shape, w * 0.1);
    var geo = new Geometry();
    var fig = new PathFigure(0, 0, false);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    geo.add(fig);
    var fig2 = new PathFigure(indent, 0, false);
    fig2.add(PathSegment.Line(indent, h));
    geo.add(fig2);
    return geo;
});
defineFigure('DataStorage', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.2, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.CubicBezier(w * 0.8, h / 2, w, h / 2, w * 0.8, h / 2));
    fig.add(PathSegment.CubicBezier(w, h, w * 0.8, h, w, h));
    fig.add(PathSegment.Line(w * 0.2, h));
    fig.add(PathSegment.CubicBezier(0, h / 2, w * 0.2, h / 2, 0, h / 2));
    fig.add(PathSegment.CubicBezier(w * 0.2, 0, 0, h / 2, w * 0.2, 0));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('ThickCross', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.25, 0);
    fig.add(PathSegment.Line(w * 0.75, 0));
    fig.add(PathSegment.Line(w * 0.75, h * 0.25));
    fig.add(PathSegment.Line(w, h * 0.25));
    fig.add(PathSegment.Line(w, h * 0.75));
    fig.add(PathSegment.Line(w * 0.75, h * 0.75));
    fig.add(PathSegment.Line(w * 0.75, h));
    fig.add(PathSegment.Line(w * 0.25, h));
    fig.add(PathSegment.Line(w * 0.25, h * 0.75));
    fig.add(PathSegment.Line(0, h * 0.75));
    fig.add(PathSegment.Line(0, h * 0.25));
    fig.add(PathSegment.Line(w * 0.25, h * 0.25));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('ThinX', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0, false);
    fig.add(PathSegment.Line(w, h));
    geo.add(fig);
    var fig2 = new PathFigure(w, 0, false);
    fig2.add(PathSegment.Line(0, h));
    geo.add(fig2);
    return geo;
});
defineFigure('ThickX', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.2, 0);
    fig.add(PathSegment.Line(w, h * 0.8));
    fig.add(PathSegment.Line(w * 0.8, h));
    fig.add(PathSegment.Line(0, h * 0.2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(w * 0.8, 0);
    fig2.add(PathSegment.Line(w, h * 0.2));
    fig2.add(PathSegment.Line(w * 0.2, h));
    fig2.add(PathSegment.Line(0, h * 0.8));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    return geo;
});
defineFigure('FramedRectangle', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(w * 0.1, h * 0.1, false);
    fig2.add(PathSegment.Line(w * 0.9, h * 0.1));
    fig2.add(PathSegment.Line(w * 0.9, h * 0.9));
    fig2.add(PathSegment.Line(w * 0.1, h * 0.9));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    return geo;
});
defineFigure('End', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0);
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w / 2, h));
    fig.add(PathSegment.Line(0, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Trapezoid', function (shape, w, h) {
    var geo = new Geometry();
    var indent = getP1(shape, w * 0.2);
    var fig = new PathFigure(indent, 0);
    fig.add(PathSegment.Line(w - indent, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Parallelogram', function (shape, w, h) {
    var geo = new Geometry();
    var indent = getP1(shape, w * 0.2);
    var fig = new PathFigure(indent, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w - indent, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Cross', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.33, 0);
    fig.add(PathSegment.Line(w * 0.67, 0));
    fig.add(PathSegment.Line(w * 0.67, h * 0.33));
    fig.add(PathSegment.Line(w, h * 0.33));
    fig.add(PathSegment.Line(w, h * 0.67));
    fig.add(PathSegment.Line(w * 0.67, h * 0.67));
    fig.add(PathSegment.Line(w * 0.67, h));
    fig.add(PathSegment.Line(w * 0.33, h));
    fig.add(PathSegment.Line(w * 0.33, h * 0.67));
    fig.add(PathSegment.Line(0, h * 0.67));
    fig.add(PathSegment.Line(0, h * 0.33));
    fig.add(PathSegment.Line(w * 0.33, h * 0.33));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('MinusLine', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, h / 2, false);
    fig.add(PathSegment.Line(w, h / 2));
    geo.add(fig);
    return geo;
});
defineFigure('PlusLine', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0, false);
    fig.add(PathSegment.Line(w / 2, h));
    geo.add(fig);
    var fig2 = new PathFigure(0, h / 2, false);
    fig2.add(PathSegment.Line(w, h / 2));
    geo.add(fig2);
    return geo;
});
defineFigure('XLine', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0, false);
    fig.add(PathSegment.Line(w, h));
    geo.add(fig);
    var fig2 = new PathFigure(w, 0, false);
    fig2.add(PathSegment.Line(0, h));
    geo.add(fig2);
    return geo;
});
defineFigure('Square', function (shape, w, h) {
    var geo = new Geometry();
    var side = Math.min(w, h);
    var x = (w - side) / 2;
    var y = (h - side) / 2;
    var fig = new PathFigure(x, y);
    fig.add(PathSegment.Line(x + side, y));
    fig.add(PathSegment.Line(x + side, y + side));
    fig.add(PathSegment.Line(x, y + side));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Bar', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('HalfEllipse', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, h / 2);
    fig.add(PathSegment.Arc(w, h / 2, w / 2, h / 2, 0, false, true));
    fig.add(PathSegment.Line(0, h / 2));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Capsule', function (shape, w, h) {
    var geo = new Geometry();
    var r = Math.min(w, h) / 2;
    var fig = new PathFigure(r, 0);
    fig.add(PathSegment.Line(w - r, 0));
    fig.add(PathSegment.Arc(w, r, r, r, 0, false, true));
    fig.add(PathSegment.Line(w, h - r));
    fig.add(PathSegment.Arc(w - r, h, r, r, 0, false, true));
    fig.add(PathSegment.Line(r, h));
    fig.add(PathSegment.Arc(0, h - r, r, r, 0, false, true));
    fig.add(PathSegment.Line(0, r));
    fig.add(PathSegment.Arc(r, 0, r, r, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('RightTriangle', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('File', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w * 0.7, 0));
    fig.add(PathSegment.Line(w, h * 0.3));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(w * 0.7, 0, false);
    fig2.add(PathSegment.Line(w * 0.7, h * 0.3));
    fig2.add(PathSegment.Line(w, h * 0.3));
    geo.add(fig2);
    return geo;
});
defineFigure('Kite', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0);
    fig.add(PathSegment.Line(w, h * 0.4));
    fig.add(PathSegment.Line(w / 2, h));
    fig.add(PathSegment.Line(0, h * 0.4));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Document', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h * 0.85));
    fig.add(PathSegment.CubicBezier(w * 0.5, h * 0.65, w * 0.65, h, w * 0.5, h));
    fig.add(PathSegment.CubicBezier(w * 0.35, h, 0, h * 0.85, 0, h * 0.85));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Shield', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h * 0.5));
    fig.add(PathSegment.CubicBezier(w, h * 0.8, w * 0.5, h, w * 0.5, h));
    fig.add(PathSegment.CubicBezier(w * 0.5, h, 0, h * 0.8, 0, h * 0.5));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('DoubleArrow', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, h / 2);
    fig.add(PathSegment.Line(w * 0.25, 0));
    fig.add(PathSegment.Line(w * 0.5, h * 0.25));
    fig.add(PathSegment.Line(w * 0.75, 0));
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w * 0.75, h));
    fig.add(PathSegment.Line(w * 0.5, h * 0.75));
    fig.add(PathSegment.Line(w * 0.25, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('ThinArrow', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w * 0.5, 0);
    fig.add(PathSegment.Line(w, h / 2));
    fig.add(PathSegment.Line(w * 0.5, h));
    fig.add(PathSegment.Line(w * 0.5, h * 0.65));
    fig.add(PathSegment.Line(0, h * 0.65));
    fig.add(PathSegment.Line(0, h * 0.35));
    fig.add(PathSegment.Line(w * 0.5, h * 0.35));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('RoundedTopRectangle', function (shape, w, h) {
    var r = getP1(shape, 5);
    var cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0)
        return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
    var geo = new Geometry();
    var fig = new PathFigure(cr, 0);
    fig.add(PathSegment.Line(w - cr, 0));
    fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Line(0, cr));
    fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('RoundedBottomRectangle', function (shape, w, h) {
    var r = getP1(shape, 5);
    var cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0)
        return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h - cr));
    fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(cr, h));
    fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('RoundedLeftRectangle', function (shape, w, h) {
    var r = getP1(shape, 5);
    var cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0)
        return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
    var geo = new Geometry();
    var fig = new PathFigure(0, cr);
    fig.add(PathSegment.Arc(cr, 0, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(cr, h));
    fig.add(PathSegment.Arc(0, h - cr, cr, cr, 0, false, true));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('RoundedRightRectangle', function (shape, w, h) {
    var r = getP1(shape, 5);
    var cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0)
        return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
    var geo = new Geometry();
    var fig = new PathFigure(0, 0);
    fig.add(PathSegment.Line(w - cr, 0));
    fig.add(PathSegment.Arc(w, cr, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(w, h - cr));
    fig.add(PathSegment.Arc(w - cr, h, cr, cr, 0, false, true));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('Border', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0, false);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    return geo;
});
defineFigure('BarH', function (shape, w, h) {
    return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
});
defineFigure('BarV', function (shape, w, h) {
    return getFigureGeometry('Rectangle', w, h, NaN, NaN, shape);
});
defineFigure('LineRight', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, h / 2, false);
    fig.add(PathSegment.Line(w, h / 2));
    geo.add(fig);
    return geo;
});
defineFigure('LineDown', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, 0, false);
    fig.add(PathSegment.Line(w / 2, h));
    geo.add(fig);
    return geo;
});
defineFigure('LineLeft', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w, h / 2, false);
    fig.add(PathSegment.Line(0, h / 2));
    geo.add(fig);
    return geo;
});
defineFigure('LineUp', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(w / 2, h, false);
    fig.add(PathSegment.Line(w / 2, 0));
    geo.add(fig);
    return geo;
});
defineFigure('None', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0, false);
    geo.add(fig);
    return geo;
});
defineFigure('Borders', function (shape, w, h) {
    var geo = new Geometry();
    var fig = new PathFigure(0, 0, false);
    fig.add(PathSegment.Line(w, 0));
    fig.add(PathSegment.Line(w, h));
    fig.add(PathSegment.Line(0, h));
    fig.add(PathSegment.Close());
    geo.add(fig);
    var fig2 = new PathFigure(w * 0.05, h * 0.05, false);
    fig2.add(PathSegment.Line(w * 0.95, h * 0.05));
    fig2.add(PathSegment.Line(w * 0.95, h * 0.95));
    fig2.add(PathSegment.Line(w * 0.05, h * 0.95));
    fig2.add(PathSegment.Close());
    geo.add(fig2);
    return geo;
});

/**
 * Shape - 几何图形
 * 表示一个几何形状，支持预定义图形和自定义几何路径
 */
var Shape = /** @class */ (function (_super) {
    __extends(Shape, _super);
    function Shape(figOrGeo, init) {
        var _this = _super.call(this) || this;
        // ============ Shape-specific properties ============
        _this._fill = '';
        _this._stroke = 'black';
        _this._strokeWidth = 1;
        _this._strokeDashArray = null;
        _this._strokeDashOffset = 0;
        _this._strokeCap = 'butt';
        _this._strokeJoin = 'miter';
        _this._figure = '';
        _this._geometry = null;
        _this._geometryString = '';
        _this._parameter1 = NaN;
        _this._parameter2 = NaN;
        _this._toArrow = '';
        _this._fromArrow = '';
        _this._geometryStretch = GeometryStretchUniform;
        _this._fillRule = 'nonzero';
        _this._spot1 = null;
        _this._spot2 = null;
        _this._className = 'Shape';
        if (typeof figOrGeo === 'string') {
            _this._figure = figOrGeo;
        }
        else if (figOrGeo instanceof Geometry) {
            _this._geometry = figOrGeo;
        }
        else if (figOrGeo && typeof figOrGeo === 'object') {
            _this.set(figOrGeo);
        }
        if (init) {
            _this.set(init);
        }
        return _this;
    }
    Object.defineProperty(Shape.prototype, "fill", {
        // ============ Shape properties ============
        get: function () { return this._fill; },
        set: function (val) { this._fill = val !== null && val !== void 0 ? val : ''; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "stroke", {
        get: function () { return this._stroke; },
        set: function (val) { this._stroke = val !== null && val !== void 0 ? val : ''; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeWidth", {
        get: function () { return this._strokeWidth; },
        set: function (val) { this._strokeWidth = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeDashArray", {
        get: function () { return this._strokeDashArray; },
        set: function (val) { this._strokeDashArray = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeDashOffset", {
        get: function () { return this._strokeDashOffset; },
        set: function (val) { this._strokeDashOffset = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeCap", {
        get: function () { return this._strokeCap; },
        set: function (val) { this._strokeCap = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "strokeJoin", {
        get: function () { return this._strokeJoin; },
        set: function (val) { this._strokeJoin = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "geometryStretch", {
        get: function () { return this._geometryStretch; },
        set: function (val) {
            if (this._geometryStretch !== val) {
                this._geometryStretch = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "fillRule", {
        get: function () { return this._fillRule; },
        set: function (val) { this._fillRule = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "figure", {
        get: function () { return this._figure; },
        set: function (val) {
            if (this._figure !== val) {
                this._figure = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "geometry", {
        get: function () { return this._geometry; },
        set: function (val) {
            if (this._geometry !== val) {
                this._geometry = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "geometryString", {
        get: function () { return this._geometryString; },
        set: function (val) {
            if (this._geometryString !== val) {
                this._geometryString = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "parameter1", {
        get: function () { return this._parameter1; },
        set: function (val) {
            if (this._parameter1 !== val) {
                this._parameter1 = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "parameter2", {
        get: function () { return this._parameter2; },
        set: function (val) {
            if (this._parameter2 !== val) {
                this._parameter2 = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "spot1", {
        get: function () { return this._spot1 || Spot.Default; },
        set: function (val) {
            this._spot1 = val && typeof val.copy === 'function' ? val.copy() : val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "spot2", {
        get: function () { return this._spot2 || Spot.Default; },
        set: function (val) {
            this._spot2 = val && typeof val.copy === 'function' ? val.copy() : val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "toArrow", {
        get: function () { return this._toArrow; },
        set: function (val) {
            if (this._toArrow !== val) {
                this._toArrow = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "fromArrow", {
        get: function () { return this._fromArrow; },
        set: function (val) {
            if (this._fromArrow !== val) {
                this._fromArrow = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** 获取几何路径（从图形名称或自定义几何） */
    Shape.prototype._getGeometry = function () {
        if (this._geometry !== null) {
            return this._geometry;
        }
        if (this._geometryString) {
            return Geometry.parse(this._geometryString);
        }
        if (this._toArrow) {
            return Shape._getArrowheadGeometry(this._toArrow);
        }
        if (this._fromArrow) {
            return Shape._getArrowheadGeometry(this._fromArrow);
        }
        if (this._figure) {
            return this._getFigureGeometry(this._figure);
        }
        return null;
    };
    Shape.prototype._getFigureGeometry = function (figureName) {
        var w = isNaN(this.width) ? 100 : this.width;
        var h = isNaN(this.height) ? 100 : this.height;
        var geo = getFigureGeometry(figureName, w, h, this._parameter1, this._parameter2, this);
        if (geo)
            return geo;
        switch (figureName.toLowerCase()) {
            case 'rectangle':
                return Geometry.rectangle(w, h);
            case 'roundedrectangle': {
                var cornerRadius = isNaN(this._parameter1) ? 5 : this._parameter1;
                return Geometry.roundedRectangle(w, h, cornerRadius);
            }
            case 'ellipse':
                return Geometry.ellipse(w, h);
            case 'circle': {
                var d = Math.min(w, h);
                return Geometry.ellipse(d, d);
            }
            case 'line':
                return Geometry.line(0, 0, w, h);
            default:
                return Geometry.rectangle(w, h);
        }
    };
    /** 测量对象尺寸 */
    Shape.prototype._measure = function (widthConstraint, heightConstraint) {
        var geo = this._getGeometry();
        if (geo) {
            var bounds = geo.bounds;
            var w = isNaN(this.width) ? bounds.width : this.width;
            var h = isNaN(this.height) ? bounds.height : this.height;
            this._naturalBounds = new Rect(0, 0, w, h);
        }
        else {
            var w = isNaN(this.width) ? 0 : this.width;
            var h = isNaN(this.height) ? 0 : this.height;
            this._naturalBounds = new Rect(0, 0, w, h);
        }
        var measuredWidth = Math.min(this._naturalBounds.width, widthConstraint);
        var measuredHeight = Math.min(this._naturalBounds.height, heightConstraint);
        this._measuredBounds = new Rect(0, 0, measuredWidth, measuredHeight);
        this._applySizeConstraints();
    };
    /** 绘制图形 */
    Shape.prototype._draw = function (ctx) {
        var geo = this._getGeometry();
        if (!geo)
            return;
        ctx.save();
        // 填充
        if (this._fill) {
            if (Brush.isBrush(this._fill)) {
                var grad = this._fill._createCanvasGradient(ctx, this._actualBounds);
                if (grad)
                    ctx.fillStyle = grad;
            }
            else {
                ctx.fillStyle = this._fill;
            }
            this._drawGeometry(ctx, geo);
            ctx.fill(this._fillRule);
        }
        if (this._stroke && this._strokeWidth > 0) {
            if (Brush.isBrush(this._stroke)) {
                var grad = this._stroke._createCanvasGradient(ctx, this._actualBounds);
                if (grad)
                    ctx.strokeStyle = grad;
            }
            else {
                ctx.strokeStyle = this._stroke;
            }
            ctx.lineWidth = this._strokeWidth;
            ctx.lineCap = this._strokeCap;
            ctx.lineJoin = this._strokeJoin;
            if (this._strokeDashArray) {
                ctx.setLineDash(this._strokeDashArray);
            }
            ctx.lineDashOffset = this._strokeDashOffset;
            this._drawGeometry(ctx, geo);
            ctx.stroke();
        }
        ctx.restore();
    };
    /** 在 canvas 上绘制几何路径 */
    Shape.prototype._drawGeometry = function (ctx, geo) {
        ctx.beginPath();
        var it = geo.figures.iterator;
        while (it.next()) {
            var fig = it.value;
            var curX = fig.startX;
            var curY = fig.startY;
            ctx.moveTo(fig.startX, fig.startY);
            var segIt = fig.segments.iterator;
            while (segIt.next()) {
                var seg = segIt.value;
                switch (seg.type._name) {
                    case 'Line':
                        ctx.lineTo(seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'QuadraticBezier':
                        ctx.quadraticCurveTo(seg.x1, seg.y1, seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'CubicBezier':
                        ctx.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'Arc':
                        this._drawArcSegment(ctx, curX, curY, seg);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'MoveTo':
                        ctx.moveTo(seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'Close':
                        ctx.closePath();
                        curX = fig.startX;
                        curY = fig.startY;
                        break;
                }
            }
        }
    };
    /** Draw an arc segment from current point to endpoint using SVG arc parameters */
    Shape.prototype._drawArcSegment = function (ctx, curX, curY, seg) {
        var rx = seg.radiusX;
        var ry = seg.radiusY;
        var endX = seg.endX;
        var endY = seg.endY;
        if (rx <= 0 || ry <= 0) {
            ctx.lineTo(endX, endY);
            return;
        }
        // Use canvas ellipse() to draw the arc
        // We need to compute the center of the ellipse from the SVG arc parameters
        // Using the SVG arc endpoint parameterization algorithm
        var rotation = (seg.xAxisRotation || 0) * Math.PI / 180;
        var largeArc = !!seg.largeArc;
        var sweep = !!seg.clockwise;
        var cos = Math.cos(rotation);
        var sin = Math.sin(rotation);
        // Step 1: Compute (x1', y1') - transformed midpoint
        var dx = (curX - endX) / 2;
        var dy = (curY - endY) / 2;
        var x1p = cos * dx + sin * dy;
        var y1p = -sin * dx + cos * dy;
        // Step 2: Compute (cx', cy') - transformed center
        var x1p2 = x1p * x1p;
        var y1p2 = y1p * y1p;
        var rx2 = rx * rx;
        var ry2 = ry * ry;
        // Check if radii are large enough; if not, scale them
        var lambda = x1p2 / rx2 + y1p2 / ry2;
        var rxScaled = rx;
        var ryScaled = ry;
        if (lambda > 1) {
            var sqrtLambda = Math.sqrt(lambda);
            rxScaled = rx * sqrtLambda;
            ryScaled = ry * sqrtLambda;
        }
        var rxScaled2 = rxScaled * rxScaled;
        var ryScaled2 = ryScaled * ryScaled;
        var num = rxScaled2 * ryScaled2 - rxScaled2 * y1p2 - ryScaled2 * x1p2;
        var den = rxScaled2 * y1p2 + ryScaled2 * x1p2;
        var sq = Math.max(0, num / den);
        sq = Math.sqrt(sq);
        if (largeArc === sweep)
            sq = -sq;
        var cxp = sq * rxScaled * y1p / ryScaled;
        var cyp = -sq * ryScaled * x1p / rxScaled;
        // Step 3: Compute (cx, cy) - actual center
        var cx = cos * cxp - sin * cyp + (curX + endX) / 2;
        var cy = sin * cxp + cos * cyp + (curY + endY) / 2;
        // Step 4: Compute start and end angles
        var ux = (x1p - cxp) / rxScaled;
        var uy = (y1p - cyp) / ryScaled;
        var vx = (-x1p - cxp) / rxScaled;
        var vy = (-y1p - cyp) / ryScaled;
        var startAngle = Math.atan2(uy, ux);
        var endAngle = Math.atan2(vy, vx);
        // Adjust for sweep direction
        var sweepAngle = endAngle - startAngle;
        if (sweep && sweepAngle < 0) {
            sweepAngle += 2 * Math.PI;
        }
        else if (!sweep && sweepAngle > 0) {
            sweepAngle -= 2 * Math.PI;
        }
        // Use ellipse() if available (modern browsers)
        if (typeof ctx.ellipse === 'function') {
            ctx.ellipse(cx, cy, rxScaled, ryScaled, rotation, startAngle, startAngle + sweepAngle, !sweep);
        }
        else {
            // Fallback: approximate arc with line segments
            var steps = Math.max(8, Math.ceil(Math.abs(sweepAngle) * 8 / Math.PI));
            for (var i = 1; i <= steps; i++) {
                var t = i / steps;
                var angle = startAngle + t * sweepAngle;
                var px = cx + rxScaled * Math.cos(angle) * Math.cos(rotation) - ryScaled * Math.sin(angle) * Math.sin(rotation);
                var py = cy + rxScaled * Math.cos(angle) * Math.sin(rotation) + ryScaled * Math.sin(angle) * Math.cos(rotation);
                ctx.lineTo(px, py);
            }
        }
    };
    /** 复制 */
    Shape.prototype.copy = function () {
        var shape = new Shape();
        this._copyPropertiesTo(shape);
        shape._fill = Brush.isBrush(this._fill) ? this._fill.copy() : this._fill;
        shape._stroke = Brush.isBrush(this._stroke) ? this._stroke.copy() : this._stroke;
        shape._strokeWidth = this._strokeWidth;
        shape._strokeDashArray = this._strokeDashArray ? __spreadArray([], __read(this._strokeDashArray), false) : null;
        shape._strokeDashOffset = this._strokeDashOffset;
        shape._strokeCap = this._strokeCap;
        shape._strokeJoin = this._strokeJoin;
        shape._figure = this._figure;
        shape._geometry = this._geometry ? this._geometry.copy() : null;
        shape._geometryString = this._geometryString;
        shape._parameter1 = this._parameter1;
        shape._parameter2 = this._parameter2;
        shape._toArrow = this._toArrow;
        shape._fromArrow = this._fromArrow;
        shape._geometryStretch = this._geometryStretch;
        shape._fillRule = this._fillRule;
        return shape;
    };
    Shape.defineFigureGenerator = function (name, func) {
        figures.add(name, func);
    };
    Shape.getFigureGenerators = function () {
        return figures;
    };
    Shape.getArrowheadGeometries = function () {
        if (!Shape._arrowheadGeometries) {
            Shape._arrowheadGeometries = Shape._createArrowheadGeometries();
        }
        return Shape._arrowheadGeometries;
    };
    Shape.defineArrowheadGenerator = function (name, func) {
        if (!Shape._arrowheadGeometries) {
            Shape._arrowheadGeometries = Shape._createArrowheadGeometries();
        }
        Shape._arrowheadGeometries[name] = func(null, 10, 10);
    };
    Shape._getArrowheadGeometry = function (name) {
        var geos = Shape.getArrowheadGeometries();
        return geos[name] || geos['Standard'] || null;
    };
    Shape._createArrowheadGeometries = function () {
        var geos = {};
        var makeGeo = function (figs) {
            var e_1, _a;
            var geo = new Geometry();
            try {
                for (var figs_1 = __values(figs), figs_1_1 = figs_1.next(); !figs_1_1.done; figs_1_1 = figs_1.next()) {
                    var fig_1 = figs_1_1.value;
                    geo.add(fig_1);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (figs_1_1 && !figs_1_1.done && (_a = figs_1.return)) _a.call(figs_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return geo;
        };
        var fig = function (sx, sy, segs) {
            var e_2, _a;
            var f = new PathFigure(sx, sy, true);
            try {
                for (var segs_1 = __values(segs), segs_1_1 = segs_1.next(); !segs_1_1.done; segs_1_1 = segs_1.next()) {
                    var s = segs_1_1.value;
                    f.add(s);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (segs_1_1 && !segs_1_1.done && (_a = segs_1.return)) _a.call(segs_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return f;
        };
        var line = function (x, y) { return PathSegment.Line(x, y); };
        var close = function () { return PathSegment.Close(); };
        geos['Standard'] = makeGeo([fig(0, 0, [line(10, 5), line(0, 10), close()])]);
        geos['Triangle'] = makeGeo([fig(0, 0, [line(10, 5), line(0, 10), close()])]);
        geos['Backward'] = makeGeo([fig(10, 0, [line(0, 5), line(10, 10), close()])]);
        geos['OpenTriangle'] = makeGeo([fig(0, 0, [line(10, 5), line(0, 10)])]);
        geos['BackwardOpenTriangle'] = makeGeo([fig(10, 0, [line(0, 5), line(10, 10)])]);
        geos['Circle'] = makeGeo([fig(5, 0, [PathSegment.Arc(10, 5, 5, 5)])]);
        geos['BackwardCircle'] = makeGeo([fig(5, 0, [PathSegment.Arc(10, 5, 5, 5)])]);
        geos['Diamond'] = makeGeo([fig(0, 5, [line(5, 0), line(10, 5), line(5, 10), close()])]);
        geos['BackwardDiamond'] = makeGeo([fig(10, 5, [line(5, 0), line(0, 5), line(5, 10), close()])]);
        geos['Chevron'] = makeGeo([fig(0, 0, [line(10, 5), line(0, 10)])]);
        geos['BackwardChevron'] = makeGeo([fig(10, 0, [line(0, 5), line(10, 10)])]);
        geos['DoubleTriangle'] = makeGeo([
            fig(0, 0, [line(5, 5), line(0, 10), close()]),
            fig(5, 0, [line(10, 5), line(5, 10), close()])
        ]);
        geos['DoubleChevron'] = makeGeo([fig(0, 0, [line(5, 5), line(0, 10)]), fig(5, 0, [line(10, 5), line(5, 10)])]);
        geos['HalfTriangle'] = makeGeo([fig(0, 5, [line(10, 5), line(0, 10), close()])]);
        geos['BackwardHalfTriangle'] = makeGeo([fig(10, 5, [line(0, 5), line(10, 10), close()])]);
        geos['StretchedDiamond'] = makeGeo([fig(0, 5, [line(5, 0), line(10, 5), line(5, 10), close()])]);
        geos['ThinTriangle'] = makeGeo([fig(0, 3, [line(10, 5), line(0, 7), close()])]);
        geos['BackwardThinTriangle'] = makeGeo([fig(10, 3, [line(0, 5), line(10, 7), close()])]);
        geos['Line'] = makeGeo([fig(0, 5, [line(10, 5)])]);
        geos['None'] = new Geometry();
        return geos;
    };
    Shape.GeometryStretchUniform = GeometryStretchUniform;
    Shape.GeometryStretchNone = GeometryStretchNone;
    Shape.GeometryStretchFill = GeometryStretchFill;
    Shape.GeometryStretchUniformToFill = GeometryStretchUniformToFill;
    Shape._arrowheadGeometries = null;
    return Shape;
}(GraphObject));
GraphObject.defineBuilder('Shape', Shape);

var TextBlock = /** @class */ (function (_super) {
    __extends(TextBlock, _super);
    function TextBlock(text, init) {
        var _this = _super.call(this) || this;
        _this._text = '';
        _this._font = '10px sans-serif';
        _this._stroke = 'black';
        _this._textAlign = 'start';
        _this._isMultiline = true;
        _this._editable = false;
        _this._wrap = WrapFit;
        _this._overflow = OverflowClip;
        _this._lineCount = 1;
        _this._spacingAbove = 0;
        _this._spacingBelow = 0;
        _this._isUnderline = false;
        _this._isStrikethrough = false;
        _this._verticalAlignment = VerticalCenter;
        _this._className = 'TextBlock';
        if (typeof text === 'string') {
            _this._text = text;
            if (init) {
                _this.set(init);
            }
        }
        else if (text && typeof text === 'object') {
            _this.set(text);
        }
        return _this;
    }
    Object.defineProperty(TextBlock.prototype, "text", {
        get: function () { return this._text; },
        set: function (val) {
            if (this._text !== val) {
                this._text = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "font", {
        get: function () { return this._font; },
        set: function (val) {
            if (this._font !== val) {
                this._font = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "stroke", {
        get: function () { return this._stroke; },
        set: function (val) {
            if (this._stroke !== val) {
                this._stroke = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "textAlign", {
        get: function () { return this._textAlign; },
        set: function (val) {
            if (this._textAlign !== val) {
                this._textAlign = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "isMultiline", {
        get: function () { return this._isMultiline; },
        set: function (val) {
            if (this._isMultiline !== val) {
                this._isMultiline = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "editable", {
        get: function () { return this._editable; },
        set: function (val) { this._editable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "wrap", {
        get: function () { return this._wrap; },
        set: function (val) {
            if (this._wrap !== val) {
                this._wrap = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "overflow", {
        get: function () { return this._overflow; },
        set: function (val) {
            if (this._overflow !== val) {
                this._overflow = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "lineCount", {
        get: function () { return this._lineCount; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "spacingAbove", {
        get: function () { return this._spacingAbove; },
        set: function (val) {
            if (this._spacingAbove !== val) {
                this._spacingAbove = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "spacingBelow", {
        get: function () { return this._spacingBelow; },
        set: function (val) {
            if (this._spacingBelow !== val) {
                this._spacingBelow = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "isUnderline", {
        get: function () { return this._isUnderline; },
        set: function (val) {
            if (this._isUnderline !== val) {
                this._isUnderline = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "isStrikethrough", {
        get: function () { return this._isStrikethrough; },
        set: function (val) {
            if (this._isStrikethrough !== val) {
                this._isStrikethrough = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "verticalAlignment", {
        get: function () { return this._verticalAlignment; },
        set: function (val) {
            if (this._verticalAlignment !== val) {
                this._verticalAlignment = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextBlock.prototype, "naturalSize", {
        get: function () {
            return new Size(this._naturalBounds.width, this._naturalBounds.height);
        },
        enumerable: false,
        configurable: true
    });
    TextBlock.prototype.measure = function (width, height) {
        this._measure(width, height);
    };
    TextBlock.prototype._measure = function (widthConstraint, heightConstraint) {
        if (!this._text) {
            this._naturalBounds = new Rect(0, 0, 0, 0);
            this._measuredBounds = new Rect(0, 0, 0, 0);
            this._lineCount = 0;
            return;
        }
        var canvas = TextBlock._tempCanvas;
        var ctx = canvas.getContext('2d');
        var measured = this._measureText(ctx, widthConstraint);
        this._lineCount = measured.lineCount;
        this._naturalBounds = new Rect(0, 0, measured.width, measured.height);
        var measuredWidth = Math.min(measured.width, widthConstraint);
        var measuredHeight = Math.min(measured.height, heightConstraint);
        this._measuredBounds = new Rect(0, 0, measuredWidth, measuredHeight);
        this._applySizeConstraints();
    };
    TextBlock.prototype._measureText = function (ctx, widthConstraint) {
        var e_1, _a;
        ctx.font = this._font;
        if (!this._isMultiline || this._wrap === WrapNone) {
            var metrics = ctx.measureText(this._text);
            var fontSize_1 = TextBlock._getFontSize(this._font);
            return {
                width: metrics.width,
                height: fontSize_1 + this._spacingAbove + this._spacingBelow,
                lineCount: 1,
            };
        }
        var wrapWidth = widthConstraint;
        if (this._wrap === WrapDesiredSize) {
            var dw = this.desiredSize;
            if (dw && dw.width > 0 && isFinite(dw.width)) {
                wrapWidth = dw.width;
            }
            else {
                var metrics = ctx.measureText(this._text);
                var fontSize_2 = TextBlock._getFontSize(this._font);
                return {
                    width: metrics.width,
                    height: fontSize_2 + this._spacingAbove + this._spacingBelow,
                    lineCount: 1,
                };
            }
        }
        var lines = this._wrapText(ctx, this._text, wrapWidth);
        var fontSize = TextBlock._getFontSize(this._font);
        var lineHeight = fontSize * 1.2;
        var totalHeight = lines.length * lineHeight + this._spacingAbove + this._spacingBelow;
        var maxWidth = 0;
        try {
            for (var lines_1 = __values(lines), lines_1_1 = lines_1.next(); !lines_1_1.done; lines_1_1 = lines_1.next()) {
                var line = lines_1_1.value;
                var m = ctx.measureText(line);
                if (m.width > maxWidth)
                    maxWidth = m.width;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (lines_1_1 && !lines_1_1.done && (_a = lines_1.return)) _a.call(lines_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return {
            width: maxWidth,
            height: totalHeight,
            lineCount: lines.length,
        };
    };
    TextBlock.prototype._wrapText = function (ctx, text, maxWidth) {
        var e_2, _a, e_3, _b;
        var lines = [];
        var paragraphs = text.split('\n');
        try {
            for (var paragraphs_1 = __values(paragraphs), paragraphs_1_1 = paragraphs_1.next(); !paragraphs_1_1.done; paragraphs_1_1 = paragraphs_1.next()) {
                var paragraph = paragraphs_1_1.value;
                if (paragraph === '') {
                    lines.push('');
                    continue;
                }
                var words = paragraph.split(/(\s+)/);
                var currentLine = '';
                try {
                    for (var words_1 = (e_3 = void 0, __values(words)), words_1_1 = words_1.next(); !words_1_1.done; words_1_1 = words_1.next()) {
                        var word = words_1_1.value;
                        var testLine = currentLine + word;
                        var metrics = ctx.measureText(testLine);
                        if (metrics.width > maxWidth && currentLine !== '') {
                            lines.push(currentLine.replace(/\s+$/, ''));
                            currentLine = word;
                        }
                        else {
                            currentLine = testLine;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (words_1_1 && !words_1_1.done && (_b = words_1.return)) _b.call(words_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                if (currentLine) {
                    lines.push(currentLine.replace(/\s+$/, ''));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (paragraphs_1_1 && !paragraphs_1_1.done && (_a = paragraphs_1.return)) _a.call(paragraphs_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return lines.length > 0 ? lines : [''];
    };
    TextBlock._getFontSize = function (font) {
        var match = font.match(/(\d+(?:\.\d+)?)px/);
        if (match) {
            return parseFloat(match[1]);
        }
        return 10;
    };
    TextBlock.prototype._draw = function (ctx) {
        if (!this._text)
            return;
        ctx.save();
        ctx.font = this._font;
        ctx.textAlign = this._textAlign;
        ctx.textBaseline = 'top';
        if (this._stroke) {
            if (Brush.isBrush(this._stroke)) {
                var brush = this._stroke;
                var grad = brush._createCanvasGradient(ctx, this._actualBounds);
                if (grad)
                    ctx.fillStyle = grad;
            }
            else {
                ctx.fillStyle = this._stroke;
            }
        }
        var fontSize = TextBlock._getFontSize(this._font);
        var lineHeight = fontSize * 1.2;
        if (this._overflow === OverflowClip) {
            ctx.beginPath();
            ctx.rect(this._actualBounds.x, this._actualBounds.y, this._actualBounds.width, this._actualBounds.height);
            ctx.clip();
        }
        var yOffset = this._spacingAbove;
        if (!this._isMultiline || this._wrap === WrapNone) {
            var drawText = this._text;
            if (this._overflow === OverflowEllipsis) {
                var metrics = ctx.measureText(this._text);
                if (metrics.width > this._actualBounds.width) {
                    while (drawText.length > 0 && ctx.measureText(drawText + '...').width > this._actualBounds.width) {
                        drawText = drawText.slice(0, -1);
                    }
                    drawText += '...';
                }
            }
            ctx.fillText(drawText, 0, yOffset);
            if (this._isUnderline || this._isStrikethrough) {
                var tw = ctx.measureText(drawText).width;
                var lx = 0;
                if (this._textAlign === 'center')
                    lx = (this._actualBounds.width - tw) / 2;
                else if (this._textAlign === 'right' || this._textAlign === 'end')
                    lx = this._actualBounds.width - tw;
                var lineY = yOffset + fontSize * 0.85;
                ctx.beginPath();
                if (this._isUnderline) {
                    ctx.moveTo(lx, lineY);
                    ctx.lineTo(lx + tw, lineY);
                }
                if (this._isStrikethrough) {
                    var strikeY = yOffset + fontSize * 0.45;
                    ctx.moveTo(lx, strikeY);
                    ctx.lineTo(lx + tw, strikeY);
                }
                ctx.strokeStyle = typeof this._stroke === 'string' ? this._stroke : 'black';
                ctx.lineWidth = Math.max(1, fontSize / 12);
                ctx.stroke();
            }
        }
        else {
            var lines = this._wrapText(ctx, this._text, this._actualBounds.width || Infinity);
            for (var i = 0; i < lines.length; i++) {
                var drawText = lines[i];
                if (this._overflow === OverflowEllipsis && i === lines.length - 1) {
                    var metrics = ctx.measureText(drawText);
                    if (metrics.width > this._actualBounds.width) {
                        while (drawText.length > 0 && ctx.measureText(drawText + '...').width > this._actualBounds.width) {
                            drawText = drawText.slice(0, -1);
                        }
                        drawText += '...';
                    }
                }
                var lineY = yOffset + i * lineHeight;
                ctx.fillText(drawText, 0, lineY);
                if (this._isUnderline || this._isStrikethrough) {
                    var tw = ctx.measureText(drawText).width;
                    var lx = 0;
                    if (this._textAlign === 'center')
                        lx = (this._actualBounds.width - tw) / 2;
                    else if (this._textAlign === 'right' || this._textAlign === 'end')
                        lx = this._actualBounds.width - tw;
                    ctx.beginPath();
                    if (this._isUnderline) {
                        var ulY = lineY + fontSize * 0.85;
                        ctx.moveTo(lx, ulY);
                        ctx.lineTo(lx + tw, ulY);
                    }
                    if (this._isStrikethrough) {
                        var stY = lineY + fontSize * 0.45;
                        ctx.moveTo(lx, stY);
                        ctx.lineTo(lx + tw, stY);
                    }
                    ctx.strokeStyle = typeof this._stroke === 'string' ? this._stroke : 'black';
                    ctx.lineWidth = Math.max(1, fontSize / 12);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    };
    TextBlock.prototype.copy = function () {
        var tb = new TextBlock();
        this._copyPropertiesTo(tb);
        tb._text = this._text;
        tb._font = this._font;
        tb._stroke = Brush.isBrush(this._stroke) ? this._stroke.copy() : this._stroke;
        tb._textAlign = this._textAlign;
        tb._isMultiline = this._isMultiline;
        tb._editable = this._editable;
        tb._wrap = this._wrap;
        tb._overflow = this._overflow;
        tb._spacingAbove = this._spacingAbove;
        tb._spacingBelow = this._spacingBelow;
        tb._isUnderline = this._isUnderline;
        tb._isStrikethrough = this._isStrikethrough;
        tb._verticalAlignment = this._verticalAlignment;
        return tb;
    };
    TextBlock.WrapFit = WrapFit;
    TextBlock.WrapDesiredSize = WrapDesiredSize;
    TextBlock.WrapNone = WrapNone;
    TextBlock.OverflowClip = OverflowClip;
    TextBlock.OverflowEllipsis = OverflowEllipsis;
    TextBlock.VerticalTop = VerticalTop;
    TextBlock.VerticalCenter = VerticalCenter;
    TextBlock.VerticalBottom = VerticalBottom;
    TextBlock._tempCanvas = typeof document !== 'undefined'
        ? document.createElement('canvas')
        : null;
    return TextBlock;
}(GraphObject));
GraphObject.defineBuilder('TextBlock', TextBlock);

var Picture = /** @class */ (function (_super) {
    __extends(Picture, _super);
    function Picture(source, init) {
        var _this = _super.call(this) || this;
        _this._source = '';
        _this._image = null;
        _this._loadedImage = null;
        _this._imageStretch = ImageStretchUniform;
        _this._imageAlignment = 'center';
        _this._sourceRect = null;
        _this._errorFunction = null;
        _this._crossOrigin = null;
        _this._className = 'Picture';
        if (typeof source === 'string') {
            _this._source = source;
            if (init)
                _this.set(init);
        }
        else if (source && typeof source === 'object') {
            _this.set(source);
        }
        return _this;
    }
    Object.defineProperty(Picture.prototype, "source", {
        get: function () { return this._source; },
        set: function (val) {
            if (this._source !== val) {
                this._source = val;
                this._loadImage();
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "element", {
        get: function () { return this._loadedImage || this._image; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "image", {
        get: function () { return this._image; },
        set: function (val) {
            if (this._image !== val) {
                this._image = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "imageStretch", {
        get: function () { return this._imageStretch; },
        set: function (val) {
            if (this._imageStretch !== val) {
                this._imageStretch = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "imageAlignment", {
        get: function () { return this._imageAlignment; },
        set: function (val) { this._imageAlignment = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "sourceRect", {
        get: function () { return this._sourceRect; },
        set: function (val) {
            if (this._sourceRect !== val) {
                this._sourceRect = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "errorFunction", {
        get: function () { return this._errorFunction; },
        set: function (val) { this._errorFunction = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Picture.prototype, "crossOrigin", {
        get: function () { return this._crossOrigin; },
        set: function (val) { this._crossOrigin = val; },
        enumerable: false,
        configurable: true
    });
    Picture.prototype._loadImage = function () {
        var _this = this;
        if (!this._source) {
            this._image = null;
            this._loadedImage = null;
            return;
        }
        this._loadedImage = null;
        var img = new Image();
        if (this._crossOrigin) {
            img.crossOrigin = this._crossOrigin;
        }
        img.src = this._source;
        img.onload = function () {
            _this._loadedImage = img;
            _this._invalidateMeasure();
            var d = _this.diagram;
            if (d && typeof d.requestUpdate === 'function') {
                d.requestUpdate();
            }
        };
        img.onerror = function (e) {
            _this._image = null;
            _this._loadedImage = null;
            if (_this._errorFunction) {
                _this._errorFunction(_this, e instanceof Event ? e : new Event(String(e)));
            }
        };
        this._image = img;
    };
    Picture.prototype._measure = function (widthConstraint, heightConstraint) {
        var img = this._loadedImage || this._image;
        if (img && img.complete && img.naturalWidth > 0) {
            var w = isNaN(this.width) ? img.naturalWidth : this.width;
            var h = isNaN(this.height) ? img.naturalHeight : this.height;
            this._naturalBounds = new Rect(0, 0, w, h);
        }
        else {
            var w = isNaN(this.width) ? 0 : this.width;
            var h = isNaN(this.height) ? 0 : this.height;
            this._naturalBounds = new Rect(0, 0, w, h);
        }
        var measuredWidth = Math.min(this._naturalBounds.width, widthConstraint);
        var measuredHeight = Math.min(this._naturalBounds.height, heightConstraint);
        this._measuredBounds = new Rect(0, 0, measuredWidth, measuredHeight);
        this._applySizeConstraints();
    };
    Picture.prototype.copy = function () {
        var pic = new Picture();
        this._copyPropertiesTo(pic);
        pic._source = this._source;
        pic._image = this._image;
        pic._loadedImage = this._loadedImage;
        pic._imageStretch = this._imageStretch;
        pic._imageAlignment = this._imageAlignment;
        pic._sourceRect = this._sourceRect;
        pic._errorFunction = this._errorFunction;
        pic._crossOrigin = this._crossOrigin;
        return pic;
    };
    Picture.None = ImageStretchNone;
    Picture.Fill = ImageStretchFill;
    Picture.Uniform = ImageStretchUniform;
    Picture.UniformToFill = ImageStretchUniformToFill;
    return Picture;
}(GraphObject));
GraphObject.defineBuilder('Picture', Picture);

/**
 * Panel - container that arranges child GraphObjects according to its type.
 */
var Panel = /** @class */ (function (_super) {
    __extends(Panel, _super);
    function Panel(type, init) {
        var _this = _super.call(this) || this;
        // ============ Internal storage ============
        _this._elements = [];
        _this._rowDefinitions = [];
        _this._columnDefinitions = [];
        // ============ Private property storage ============
        _this._type = PanelAuto;
        _this._data = null;
        _this._padding = Margin.Zero.copy();
        _this._defaultAlignment = Spot.Default.copy();
        _this._defaultStretch = StretchDefault;
        _this._defaultColumnSeparatorStroke = '';
        _this._defaultColumnSeparatorStrokeWidth = 1;
        _this._defaultRowSeparatorStroke = '';
        _this._defaultRowSeparatorStrokeWidth = 1;
        _this._defaultSeparatorPadding = Margin.Zero.copy();
        _this._columnSizing = SizingNone;
        _this._rowSizing = SizingNone;
        _this._isClipping = false;
        _this._isEnabled = true;
        _this._alignmentFocusName = '';
        _this._itemArray = null;
        _this._itemTemplate = null;
        _this._itemTemplateMap = new Map$1();
        _this._itemCategoryProperty = 'category';
        _this._itemIndex = -1;
        _this._leftIndex = 0;
        _this._topIndex = 0;
        _this._gridCellSize = new Size(10, 10);
        _this._gridOrigin = new Point(0, 0);
        _this._graduatedMin = 0;
        _this._graduatedMax = 100;
        _this._graduatedTickUnit = 1;
        _this._graduatedTickBase = 0;
        _this._graduatedStart = 0;
        _this._graduatedEnd = 1;
        _this._viewboxStretch = StretchUniform;
        _this._viewboxScaleX = 1;
        _this._viewboxScaleY = 1;
        _this._className = 'Panel';
        if (type !== undefined) {
            _this._type = type;
        }
        if (init) {
            _this.set(init);
        }
        return _this;
    }
    Object.defineProperty(Panel.prototype, "type", {
        // ============ Properties ============
        get: function () { return this._type; },
        set: function (val) {
            if (this._type === val)
                return;
            this._type = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "data", {
        get: function () { return this._data; },
        set: function (val) {
            if (this._data === val)
                return;
            this._data = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "padding", {
        get: function () { return this._padding; },
        set: function (val) {
            var m = typeof val === 'number' ? new Margin(val) : val;
            if (this._padding.equals(m))
                return;
            this._padding = m.copy();
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultAlignment", {
        get: function () { return this._defaultAlignment; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
            if (this._defaultAlignment.equals(s))
                return;
            this._defaultAlignment = s;
            this._invalidateArrange();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultStretch", {
        get: function () { return this._defaultStretch; },
        set: function (val) {
            if (this._defaultStretch === val)
                return;
            this._defaultStretch = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultColumnSeparatorStroke", {
        get: function () { return this._defaultColumnSeparatorStroke; },
        set: function (val) {
            this._defaultColumnSeparatorStroke = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultColumnSeparatorStrokeWidth", {
        get: function () { return this._defaultColumnSeparatorStrokeWidth; },
        set: function (val) {
            if (this._defaultColumnSeparatorStrokeWidth === val)
                return;
            this._defaultColumnSeparatorStrokeWidth = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultRowSeparatorStroke", {
        get: function () { return this._defaultRowSeparatorStroke; },
        set: function (val) {
            this._defaultRowSeparatorStroke = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultRowSeparatorStrokeWidth", {
        get: function () { return this._defaultRowSeparatorStrokeWidth; },
        set: function (val) {
            if (this._defaultRowSeparatorStrokeWidth === val)
                return;
            this._defaultRowSeparatorStrokeWidth = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "defaultSeparatorPadding", {
        get: function () { return this._defaultSeparatorPadding; },
        set: function (val) {
            var m = typeof val === 'number' ? new Margin(val) : val;
            if (this._defaultSeparatorPadding.equals(m))
                return;
            this._defaultSeparatorPadding = m.copy();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "columnSizing", {
        get: function () { return this._columnSizing; },
        set: function (val) {
            if (this._columnSizing === val)
                return;
            this._columnSizing = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "rowSizing", {
        get: function () { return this._rowSizing; },
        set: function (val) {
            if (this._rowSizing === val)
                return;
            this._rowSizing = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "isClipping", {
        get: function () { return this._isClipping; },
        set: function (val) {
            if (this._isClipping === val)
                return;
            this._isClipping = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "isEnabled", {
        get: function () { return this._isEnabled; },
        set: function (val) {
            if (this._isEnabled === val)
                return;
            this._isEnabled = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "alignmentFocusName", {
        get: function () { return this._alignmentFocusName; },
        set: function (val) {
            if (this._alignmentFocusName === val)
                return;
            this._alignmentFocusName = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "itemArray", {
        get: function () { return this._itemArray; },
        set: function (val) {
            if (this._itemArray === val)
                return;
            this._itemArray = val;
            this.rebuildItemElements();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "itemTemplate", {
        get: function () { return this._itemTemplate; },
        set: function (val) {
            if (this._itemTemplate === val)
                return;
            this._itemTemplate = val;
            this.rebuildItemElements();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "itemTemplateMap", {
        get: function () { return this._itemTemplateMap; },
        set: function (val) {
            this._itemTemplateMap = val;
            this.rebuildItemElements();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "itemCategoryProperty", {
        get: function () { return this._itemCategoryProperty; },
        set: function (val) {
            if (this._itemCategoryProperty === val)
                return;
            this._itemCategoryProperty = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "itemIndex", {
        get: function () { return this._itemIndex; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "columnCount", {
        get: function () {
            var e_1, _a;
            var maxCol = 0;
            try {
                for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var elem = _c.value;
                    var col = elem.column + elem.columnSpan;
                    if (col > maxCol)
                        maxCol = col;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return maxCol;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "rowCount", {
        get: function () {
            var e_2, _a;
            var maxRow = 0;
            try {
                for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var elem = _c.value;
                    var row = elem.row + elem.rowSpan;
                    if (row > maxRow)
                        maxRow = row;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return maxRow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "leftIndex", {
        get: function () { return this._leftIndex; },
        set: function (val) {
            if (this._leftIndex === val)
                return;
            this._leftIndex = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "topIndex", {
        get: function () { return this._topIndex; },
        set: function (val) {
            if (this._topIndex === val)
                return;
            this._topIndex = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "gridCellSize", {
        get: function () { return this._gridCellSize; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Size(val.width || 0, val.height || 0) : Size.NaN.copy());
            if (this._gridCellSize.equals(s))
                return;
            this._gridCellSize = s;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "gridOrigin", {
        get: function () { return this._gridOrigin; },
        set: function (val) {
            var p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
            if (this._gridOrigin.equals(p))
                return;
            this._gridOrigin = p;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "graduatedMin", {
        get: function () { return this._graduatedMin; },
        set: function (val) {
            if (this._graduatedMin === val)
                return;
            this._graduatedMin = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "graduatedMax", {
        get: function () { return this._graduatedMax; },
        set: function (val) {
            if (this._graduatedMax === val)
                return;
            this._graduatedMax = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "graduatedTickUnit", {
        get: function () { return this._graduatedTickUnit; },
        set: function (val) {
            if (this._graduatedTickUnit === val)
                return;
            this._graduatedTickUnit = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "graduatedTickBase", {
        get: function () { return this._graduatedTickBase; },
        set: function (val) {
            if (this._graduatedTickBase === val)
                return;
            this._graduatedTickBase = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "graduatedStart", {
        get: function () { return this._graduatedStart; },
        set: function (val) {
            if (this._graduatedStart === val)
                return;
            this._graduatedStart = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "graduatedEnd", {
        get: function () { return this._graduatedEnd; },
        set: function (val) {
            if (this._graduatedEnd === val)
                return;
            this._graduatedEnd = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "viewboxStretch", {
        get: function () { return this._viewboxStretch; },
        set: function (val) {
            if (this._viewboxStretch === val)
                return;
            this._viewboxStretch = val;
            this._invalidateMeasure();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "elements", {
        // ============ Readonly computed properties ============
        get: function () {
            return new List(this._elements).iterator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Panel.prototype, "elementCount", {
        get: function () {
            return this._elements.length;
        },
        enumerable: false,
        configurable: true
    });
    // ============ Public methods ============
    Panel.prototype.add = function (element) {
        if (!(element instanceof GraphObject)) {
            throw new Error('Panel.add: argument must be a GraphObject');
        }
        element._panel = this;
        this._elements.push(element);
        this._invalidateMeasure();
        // Propagate _part to child elements
        this._propagatePart(element);
        return this;
    };
    /** Propagate the _part reference to a child element and its descendants */
    Panel.prototype._propagatePart = function (element) {
        // Find the top-level Part
        var part = this;
        while (part._panel && !(part.isTopLevel)) {
            part = part._panel;
        }
        if (part && part.isTopLevel) {
            this._setPartRecursive(element, part);
        }
    };
    /** Recursively set _part on an element and its children */
    Panel.prototype._setPartRecursive = function (element, part) {
        var e_3, _a;
        element._part = part;
        if (element instanceof Panel) {
            try {
                for (var _b = __values(element._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    this._setPartRecursive(child, part);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
    };
    Panel.prototype.remove = function (element) {
        var idx = this._elements.indexOf(element);
        if (idx >= 0) {
            element._panel = null;
            this._elements.splice(idx, 1);
            this._invalidateMeasure();
        }
        return this;
    };
    Panel.prototype.removeAt = function (index) {
        if (index >= 0 && index < this._elements.length) {
            this._elements[index]._panel = null;
            this._elements.splice(index, 1);
            this._invalidateMeasure();
        }
        return this;
    };
    Panel.prototype.insertAt = function (index, element) {
        if (!(element instanceof GraphObject)) {
            throw new Error('Panel.insertAt: argument must be a GraphObject');
        }
        element._panel = this;
        this._elements.splice(index, 0, element);
        this._invalidateMeasure();
        return this;
    };
    Panel.prototype.elt = function (index) {
        return this._elements[index];
    };
    Panel.prototype.findObject = function (name) {
        var e_4, _a;
        if (this.name === name)
            return this;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (elem.name === name)
                    return elem;
                if (elem instanceof Panel) {
                    var found = elem.findObject(name);
                    if (found !== null)
                        return found;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return null;
    };
    Panel.prototype.findMainElement = function () {
        var e_5, _a;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (elem.isPanelMain)
                    return elem;
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return null;
    };
    Panel.prototype.findItemPanelForData = function (data) {
        var e_6, _a;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (elem instanceof Panel && elem.data === data) {
                    return elem;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return null;
    };
    Panel.prototype.getColumnDefinition = function (index) {
        this._ensureColumnDefinition(index);
        return this._columnDefinitions[index];
    };
    Panel.prototype.addColumnDefinition = function (index, width) {
        var idx = index !== undefined ? index : this._columnDefinitions.length;
        this._ensureColumnDefinition(idx);
        var def = this._columnDefinitions[idx];
        if (width !== undefined) {
            def.width = width;
        }
        this._invalidateMeasure();
        return def;
    };
    Panel.prototype.getRowDefinition = function (index) {
        this._ensureRowDefinition(index);
        return this._rowDefinitions[index];
    };
    Panel.prototype.addRowDefinition = function (index, height) {
        var idx = index !== undefined ? index : this._rowDefinitions.length;
        this._ensureRowDefinition(idx);
        var def = this._rowDefinitions[idx];
        if (height !== undefined) {
            def.height = height;
        }
        this._invalidateMeasure();
        return def;
    };
    Panel.prototype.removeColumnDefinition = function (index, count) {
        if (count === void 0) { count = 1; }
        if (index >= 0 && index < this._columnDefinitions.length) {
            this._columnDefinitions.splice(index, count);
            this._invalidateMeasure();
        }
        return this;
    };
    Panel.prototype.removeRowDefinition = function (index, count) {
        if (count === void 0) { count = 1; }
        if (index >= 0 && index < this._rowDefinitions.length) {
            this._rowDefinitions.splice(index, count);
            this._invalidateMeasure();
        }
        return this;
    };
    Panel.prototype.rebuildItemElements = function () {
        // Remove existing item-generated elements
        // Elements that were generated from itemArray have _itemIndex >= 0
        for (var i = this._elements.length - 1; i >= 0; i--) {
            var elem = this._elements[i];
            if (elem instanceof Panel && elem._itemIndex >= 0) {
                elem._panel = null;
                this._elements.splice(i, 1);
            }
        }
        // Rebuild from itemArray
        var arr = this._itemArray;
        if (!arr)
            return;
        for (var i = 0; i < arr.length; i++) {
            var itemData = arr[i];
            var template = this._findItemTemplate(itemData);
            if (template) {
                var copy = template.copy();
                copy._data = itemData;
                copy._itemIndex = i;
                copy.updateTargetBindings();
                copy._panel = this;
                this._elements.push(copy);
            }
        }
        this._invalidateMeasure();
    };
    Panel.prototype.updateTargetBindings = function (propname) {
        var e_7, _a, e_8, _b;
        try {
            for (var _c = __values(this._elements), _d = _c.next(); !_d.done; _d = _c.next()) {
                var elem = _d.value;
                if (elem instanceof Panel) {
                    elem.updateTargetBindings(propname);
                }
                var bindings = elem._bindings;
                if (bindings && bindings.length > 0) {
                    var data = this._data;
                    if (data) {
                        try {
                            for (var bindings_1 = (e_8 = void 0, __values(bindings)), bindings_1_1 = bindings_1.next(); !bindings_1_1.done; bindings_1_1 = bindings_1.next()) {
                                var binding = bindings_1_1.value;
                                if (propname === undefined || propname === binding.sourceProperty) {
                                    var val = binding.getValueFromSource(data, elem, null);
                                    elem[binding.targetProperty] = val;
                                }
                            }
                        }
                        catch (e_8_1) { e_8 = { error: e_8_1 }; }
                        finally {
                            try {
                                if (bindings_1_1 && !bindings_1_1.done && (_b = bindings_1.return)) _b.call(bindings_1);
                            }
                            finally { if (e_8) throw e_8.error; }
                        }
                    }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    Panel.prototype.copy = function () {
        var copy = new Panel(this._type);
        this._copyPropertiesTo(copy);
        this._copyPanelPropertiesTo(copy);
        return copy;
    };
    /** Copy Panel-specific properties to another Panel */
    Panel.prototype._copyPanelPropertiesTo = function (copy) {
        var e_9, _a, e_10, _b, e_11, _c;
        copy._data = this._data;
        copy._padding = this._padding.copy();
        copy._defaultAlignment = this._defaultAlignment.copy();
        copy._defaultStretch = this._defaultStretch;
        copy._defaultColumnSeparatorStroke = this._defaultColumnSeparatorStroke;
        copy._defaultColumnSeparatorStrokeWidth = this._defaultColumnSeparatorStrokeWidth;
        copy._defaultRowSeparatorStroke = this._defaultRowSeparatorStroke;
        copy._defaultRowSeparatorStrokeWidth = this._defaultRowSeparatorStrokeWidth;
        copy._defaultSeparatorPadding = this._defaultSeparatorPadding.copy();
        copy._columnSizing = this._columnSizing;
        copy._rowSizing = this._rowSizing;
        copy._isClipping = this._isClipping;
        copy._isEnabled = this._isEnabled;
        copy._alignmentFocusName = this._alignmentFocusName;
        copy._itemArray = this._itemArray;
        copy._itemTemplate = this._itemTemplate;
        copy._itemTemplateMap = this._itemTemplateMap.copy();
        copy._itemCategoryProperty = this._itemCategoryProperty;
        copy._leftIndex = this._leftIndex;
        copy._topIndex = this._topIndex;
        copy._gridCellSize = this._gridCellSize.copy();
        copy._gridOrigin = this._gridOrigin.copy();
        copy._graduatedMin = this._graduatedMin;
        copy._graduatedMax = this._graduatedMax;
        copy._graduatedTickUnit = this._graduatedTickUnit;
        copy._graduatedTickBase = this._graduatedTickBase;
        copy._graduatedStart = this._graduatedStart;
        copy._graduatedEnd = this._graduatedEnd;
        copy._viewboxStretch = this._viewboxStretch;
        copy._viewboxScaleX = this._viewboxScaleX;
        copy._viewboxScaleY = this._viewboxScaleY;
        try {
            // Copy elements
            for (var _d = __values(this._elements), _e = _d.next(); !_e.done; _e = _d.next()) {
                var elem = _e.value;
                var elemCopy = elem.copy();
                elemCopy._panel = copy;
                copy._elements.push(elemCopy);
                if (this._part && this.isTopLevel) {
                    copy._setPartRecursive(elemCopy, this._part);
                }
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_9) throw e_9.error; }
        }
        try {
            // Copy row/column definitions
            for (var _f = __values(this._rowDefinitions), _g = _f.next(); !_g.done; _g = _f.next()) {
                var def = _g.value;
                copy._rowDefinitions.push(def.copy());
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_10) throw e_10.error; }
        }
        try {
            for (var _h = __values(this._columnDefinitions), _j = _h.next(); !_j.done; _j = _h.next()) {
                var def = _j.value;
                copy._columnDefinitions.push(def.copy());
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_11) throw e_11.error; }
        }
    };
    // ============ Override _measure and _arrange ============
    Panel.prototype._measure = function (widthConstraint, heightConstraint) {
        var e_12, _a;
        var pad = this._padding;
        var availW = Math.max(0, widthConstraint - pad.left - pad.right);
        var availH = Math.max(0, heightConstraint - pad.top - pad.bottom);
        var measuredW = 0;
        var measuredH = 0;
        if (this._type === PanelAuto) {
            this._measureAuto(availW, availH);
            return;
        }
        else if (this._type === PanelVertical) {
            this._measureVertical(availW, availH);
            return;
        }
        else if (this._type === PanelHorizontal) {
            this._measureHorizontal(availW, availH);
            return;
        }
        else if (this._type === PanelSpot) {
            this._measureSpot(availW, availH);
            return;
        }
        else if (this._type === PanelTable) {
            this._measureTable(availW, availH);
            return;
        }
        else if (this._type === PanelPosition) {
            this._measurePosition(availW, availH);
            return;
        }
        else if (this._type === PanelLink) {
            this._measureLink(widthConstraint, heightConstraint);
            return;
        }
        else if (this._type === PanelViewbox) {
            this._measureViewbox(availW, availH);
            return;
        }
        else if (this._type === PanelGraduated) {
            this._measureGraduated(availW, availH);
            return;
        }
        else if (this._type === PanelGrid) {
            this._measuredBounds = new Rect(0, 0, 0, 0);
            return;
        }
        try {
            // Default fallback: measure all elements
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                elem._measure(availW, availH);
                var mb = elem.measuredBounds;
                var m = elem.margin;
                measuredW = Math.max(measuredW, mb.width + m.left + m.right);
                measuredH = Math.max(measuredH, mb.height + m.top + m.bottom);
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_12) throw e_12.error; }
        }
        this._measuredBounds = new Rect(0, 0, Math.min(measuredW + pad.left + pad.right, widthConstraint), Math.min(measuredH + pad.top + pad.bottom, heightConstraint));
    };
    Panel.prototype._arrange = function (bounds) {
        var e_13, _a;
        this._actualBounds = bounds.copy();
        if (this._type === PanelLink) {
            this._arrangeLink(bounds);
            return;
        }
        var pad = this._padding;
        // Children are arranged relative to this panel's origin (0,0)
        var innerX = pad.left;
        var innerY = pad.top;
        var innerW = Math.max(0, bounds.width - pad.left - pad.right);
        var innerH = Math.max(0, bounds.height - pad.top - pad.bottom);
        if (this._type === PanelAuto) {
            this._arrangeAuto(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelVertical) {
            this._arrangeVertical(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelHorizontal) {
            this._arrangeHorizontal(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelSpot) {
            this._arrangeSpot(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelTable) {
            this._arrangeTable(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelPosition) {
            this._arrangePosition(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelViewbox) {
            this._arrangeViewbox(innerX, innerY, innerW, innerH);
        }
        else if (this._type === PanelGraduated) {
            this._arrangeGraduated(innerX, innerY, innerW, innerH);
        }
        else {
            try {
                // Default: arrange all elements to fill
                for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var elem = _c.value;
                    if (!elem.visible)
                        continue;
                    elem._arrange(new Rect(innerX, innerY, innerW, innerH));
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_13) throw e_13.error; }
            }
        }
    };
    // ============ PanelAuto measure/arrange ============
    /**
     * Find the main element and separate others.
     * The main element is the first visible element with isPanelMain=true,
     * or the first visible element if none has isPanelMain.
     */
    Panel.prototype._findMainAndOthers = function () {
        var e_14, _a;
        var main = null;
        var others = [];
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                if (main === null || elem.isPanelMain) {
                    if (main !== null && !main.isPanelMain)
                        others.push(main);
                    main = elem;
                }
                else {
                    others.push(elem);
                }
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
        return { main: main, others: others };
    };
    Panel.prototype._measureAuto = function (availW, availH) {
        var e_15, _a;
        var pad = this._padding;
        var _b = this._findMainAndOthers(), main = _b.main, others = _b.others;
        // Step 1: Measure all non-main elements first (they determine the content size)
        var contentW = 0;
        var contentH = 0;
        try {
            for (var others_1 = __values(others), others_1_1 = others_1.next(); !others_1_1.done; others_1_1 = others_1.next()) {
                var elem = others_1_1.value;
                elem._measure(availW, availH);
                var mb = elem.measuredBounds;
                var m = elem.margin;
                contentW = Math.max(contentW, mb.width + m.left + m.right);
                contentH = Math.max(contentH, mb.height + m.top + m.bottom);
            }
        }
        catch (e_15_1) { e_15 = { error: e_15_1 }; }
        finally {
            try {
                if (others_1_1 && !others_1_1.done && (_a = others_1.return)) _a.call(others_1);
            }
            finally { if (e_15) throw e_15.error; }
        }
        // Step 2: Measure the main element, sized to fit around the content
        if (main !== null) {
            var m = main.margin;
            var mainAvailW = Math.min(availW, contentW + m.left + m.right);
            var mainAvailH = Math.min(availH, contentH + m.top + m.bottom);
            main._measure(mainAvailW, mainAvailH);
            // The main element should be at least as large as the content area
            var mb = main.measuredBounds;
            var mainW = Math.max(mb.width + m.left + m.right, contentW + m.left + m.right);
            var mainH = Math.max(mb.height + m.top + m.bottom, contentH + m.top + m.bottom);
            this._measuredBounds = new Rect(0, 0, mainW + pad.left + pad.right, mainH + pad.top + pad.bottom);
        }
        else if (others.length > 0) {
            this._measuredBounds = new Rect(0, 0, contentW + pad.left + pad.right, contentH + pad.top + pad.bottom);
        }
        else {
            this._measuredBounds = new Rect(0, 0, pad.left + pad.right, pad.top + pad.bottom);
        }
    };
    Panel.prototype._arrangeAuto = function (innerX, innerY, innerW, innerH) {
        var e_16, _a;
        var _b = this._findMainAndOthers(), main = _b.main, others = _b.others;
        if (main !== null) {
            // Arrange the main element to fill the entire panel area
            var m = main.margin;
            main._arrange(new Rect(innerX + m.left, innerY + m.top, innerW - m.left - m.right, innerH - m.top - m.bottom));
        }
        try {
            // Position other elements by alignment within the panel area (default: centered)
            for (var others_2 = __values(others), others_2_1 = others_2.next(); !others_2_1.done; others_2_1 = others_2.next()) {
                var elem = others_2_1.value;
                var mb = elem.measuredBounds;
                var alignment = this._resolveAlignment(elem);
                var pos = alignment.positionInRect(new Rect(innerX, innerY, innerW, innerH));
                var focus_1 = this._resolveAlignmentFocus(elem);
                var focusPos = focus_1.positionInRect(new Rect(0, 0, mb.width, mb.height));
                elem._arrange(new Rect(pos.x - focusPos.x, pos.y - focusPos.y, mb.width, mb.height));
            }
        }
        catch (e_16_1) { e_16 = { error: e_16_1 }; }
        finally {
            try {
                if (others_2_1 && !others_2_1.done && (_a = others_2.return)) _a.call(others_2);
            }
            finally { if (e_16) throw e_16.error; }
        }
    };
    // ============ PanelVertical measure/arrange ============
    Panel.prototype._measureVertical = function (availW, availH) {
        var e_17, _a;
        var pad = this._padding;
        var totalH = 0;
        var maxW = 0;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                elem._measure(availW, availH - totalH);
                var mb = elem.measuredBounds;
                var m = elem.margin;
                totalH += mb.height + m.top + m.bottom;
                maxW = Math.max(maxW, mb.width + m.left + m.right);
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_17) throw e_17.error; }
        }
        this._measuredBounds = new Rect(0, 0, maxW + pad.left + pad.right, totalH + pad.top + pad.bottom);
    };
    Panel.prototype._arrangeVertical = function (innerX, innerY, innerW, innerH) {
        var e_18, _a;
        var y = innerY;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                var m = elem.margin;
                var mb = elem.measuredBounds;
                var elemW = this._resolveStretchWidth(elem, innerW - m.left - m.right, mb.width);
                var alignment = this._resolveAlignment(elem);
                var xPos = alignment.positionInRect(new Rect(innerX, 0, innerW, 0));
                elem._arrange(new Rect(innerX + m.left + (alignment.x * (innerW - m.left - m.right - elemW)), y + m.top, elemW, mb.height));
                y += mb.height + m.top + m.bottom;
            }
        }
        catch (e_18_1) { e_18 = { error: e_18_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_18) throw e_18.error; }
        }
    };
    // ============ PanelHorizontal measure/arrange ============
    Panel.prototype._measureHorizontal = function (availW, availH) {
        var e_19, _a;
        var pad = this._padding;
        var totalW = 0;
        var maxH = 0;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                elem._measure(availW - totalW, availH);
                var mb = elem.measuredBounds;
                var m = elem.margin;
                totalW += mb.width + m.left + m.right;
                maxH = Math.max(maxH, mb.height + m.top + m.bottom);
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_19) throw e_19.error; }
        }
        this._measuredBounds = new Rect(0, 0, totalW + pad.left + pad.right, maxH + pad.top + pad.bottom);
    };
    Panel.prototype._arrangeHorizontal = function (innerX, innerY, innerW, innerH) {
        var e_20, _a;
        var x = innerX;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                var m = elem.margin;
                var mb = elem.measuredBounds;
                var elemH = this._resolveStretchHeight(elem, innerH - m.top - m.bottom, mb.height);
                var alignment = this._resolveAlignment(elem);
                elem._arrange(new Rect(x + m.left, innerY + m.top + (alignment.y * (innerH - m.top - m.bottom - elemH)), mb.width, elemH));
                x += mb.width + m.left + m.right;
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_20) throw e_20.error; }
        }
    };
    // ============ PanelSpot measure/arrange ============
    Panel.prototype._measureSpot = function (availW, availH) {
        var e_21, _a;
        var pad = this._padding;
        var _b = this._findMainAndOthers(), main = _b.main, others = _b.others;
        var measuredW = 0;
        var measuredH = 0;
        if (main !== null) {
            main._measure(availW, availH);
            var mb = main.measuredBounds;
            var m = main.margin;
            measuredW = mb.width + m.left + m.right;
            measuredH = mb.height + m.top + m.bottom;
        }
        try {
            for (var others_3 = __values(others), others_3_1 = others_3.next(); !others_3_1.done; others_3_1 = others_3.next()) {
                var elem = others_3_1.value;
                elem._measure(availW, availH);
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (others_3_1 && !others_3_1.done && (_a = others_3.return)) _a.call(others_3);
            }
            finally { if (e_21) throw e_21.error; }
        }
        this._measuredBounds = new Rect(0, 0, measuredW + pad.left + pad.right, measuredH + pad.top + pad.bottom);
    };
    Panel.prototype._arrangeSpot = function (innerX, innerY, innerW, innerH) {
        var e_22, _a;
        var _b = this._findMainAndOthers(), main = _b.main, others = _b.others;
        if (main !== null) {
            var m = main.margin;
            main._arrange(new Rect(innerX + m.left, innerY + m.top, innerW - m.left - m.right, innerH - m.top - m.bottom));
        }
        try {
            for (var others_4 = __values(others), others_4_1 = others_4.next(); !others_4_1.done; others_4_1 = others_4.next()) {
                var elem = others_4_1.value;
                var mb = elem.measuredBounds;
                var alignment = this._resolveAlignment(elem);
                var pos = alignment.positionInRect(new Rect(innerX, innerY, innerW, innerH));
                var focus_2 = this._resolveAlignmentFocus(elem);
                var focusPos = focus_2.positionInRect(new Rect(0, 0, mb.width, mb.height));
                elem._arrange(new Rect(pos.x - focusPos.x, pos.y - focusPos.y, mb.width, mb.height));
            }
        }
        catch (e_22_1) { e_22 = { error: e_22_1 }; }
        finally {
            try {
                if (others_4_1 && !others_4_1.done && (_a = others_4.return)) _a.call(others_4);
            }
            finally { if (e_22) throw e_22.error; }
        }
    };
    // ============ PanelTable measure/arrange (simplified) ============
    Panel.prototype._measureTable = function (availW, availH) {
        var e_23, _a, e_24, _b, e_25, _c;
        var pad = this._padding;
        // Determine column widths and row heights
        var colWidths = this._computeColumnWidths(availW);
        var rowHeights = this._computeRowHeights(availH);
        try {
            // Measure each element with its cell constraints
            for (var _d = __values(this._elements), _e = _d.next(); !_e.done; _e = _d.next()) {
                var elem = _e.value;
                if (!elem.visible)
                    continue;
                var col = elem.column;
                var row = elem.row;
                var colSpan = elem.columnSpan;
                var rowSpan = elem.rowSpan;
                var cellW = 0;
                for (var c = col; c < col + colSpan && c < colWidths.length; c++) {
                    cellW += colWidths[c];
                }
                var cellH = 0;
                for (var r = row; r < row + rowSpan && r < rowHeights.length; r++) {
                    cellH += rowHeights[r];
                }
                elem._measure(cellW, cellH);
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_23) throw e_23.error; }
        }
        var totalW = 0;
        try {
            for (var colWidths_1 = __values(colWidths), colWidths_1_1 = colWidths_1.next(); !colWidths_1_1.done; colWidths_1_1 = colWidths_1.next()) {
                var w = colWidths_1_1.value;
                totalW += w;
            }
        }
        catch (e_24_1) { e_24 = { error: e_24_1 }; }
        finally {
            try {
                if (colWidths_1_1 && !colWidths_1_1.done && (_b = colWidths_1.return)) _b.call(colWidths_1);
            }
            finally { if (e_24) throw e_24.error; }
        }
        var totalH = 0;
        try {
            for (var rowHeights_1 = __values(rowHeights), rowHeights_1_1 = rowHeights_1.next(); !rowHeights_1_1.done; rowHeights_1_1 = rowHeights_1.next()) {
                var h = rowHeights_1_1.value;
                totalH += h;
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (rowHeights_1_1 && !rowHeights_1_1.done && (_c = rowHeights_1.return)) _c.call(rowHeights_1);
            }
            finally { if (e_25) throw e_25.error; }
        }
        this._measuredBounds = new Rect(0, 0, totalW + pad.left + pad.right, totalH + pad.top + pad.bottom);
    };
    Panel.prototype._arrangeTable = function (innerX, innerY, innerW, innerH) {
        var e_26, _a, e_27, _b, e_28, _c;
        var colWidths = this._computeColumnWidths(innerW);
        var rowHeights = this._computeRowHeights(innerH);
        this._lastColWidths = colWidths;
        this._lastRowHeights = rowHeights;
        // Compute column x positions
        var colX = [];
        var cx = innerX;
        try {
            for (var colWidths_2 = __values(colWidths), colWidths_2_1 = colWidths_2.next(); !colWidths_2_1.done; colWidths_2_1 = colWidths_2.next()) {
                var w = colWidths_2_1.value;
                colX.push(cx);
                cx += w;
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (colWidths_2_1 && !colWidths_2_1.done && (_a = colWidths_2.return)) _a.call(colWidths_2);
            }
            finally { if (e_26) throw e_26.error; }
        }
        // Compute row y positions
        var rowY = [];
        var ry = innerY;
        try {
            for (var rowHeights_2 = __values(rowHeights), rowHeights_2_1 = rowHeights_2.next(); !rowHeights_2_1.done; rowHeights_2_1 = rowHeights_2.next()) {
                var h = rowHeights_2_1.value;
                rowY.push(ry);
                ry += h;
            }
        }
        catch (e_27_1) { e_27 = { error: e_27_1 }; }
        finally {
            try {
                if (rowHeights_2_1 && !rowHeights_2_1.done && (_b = rowHeights_2.return)) _b.call(rowHeights_2);
            }
            finally { if (e_27) throw e_27.error; }
        }
        try {
            for (var _d = __values(this._elements), _e = _d.next(); !_e.done; _e = _d.next()) {
                var elem = _e.value;
                if (!elem.visible)
                    continue;
                var col = elem.column;
                var row = elem.row;
                var colSpan = elem.columnSpan;
                var rowSpan = elem.rowSpan;
                var cellX = col < colX.length ? colX[col] : innerX;
                var cellY = row < rowY.length ? rowY[row] : innerY;
                var cellW = 0;
                for (var c = col; c < col + colSpan && c < colWidths.length; c++) {
                    cellW += colWidths[c];
                }
                var cellH = 0;
                for (var r = row; r < row + rowSpan && r < rowHeights.length; r++) {
                    cellH += rowHeights[r];
                }
                var m = elem.margin;
                var mb = elem.measuredBounds;
                var alignment = this._resolveAlignment(elem);
                var focus_3 = this._resolveAlignmentFocus(elem);
                var availW = cellW - m.left - m.right;
                var availH = cellH - m.top - m.bottom;
                var elemW = this._resolveStretchWidth(elem, availW, mb.width);
                var elemH = this._resolveStretchHeight(elem, availH, mb.height);
                var pos = alignment.positionInRect(new Rect(cellX + m.left, cellY + m.top, availW, availH));
                var focusPos = focus_3.positionInRect(new Rect(0, 0, elemW, elemH));
                elem._arrange(new Rect(pos.x - focusPos.x, pos.y - focusPos.y, elemW, elemH));
            }
        }
        catch (e_28_1) { e_28 = { error: e_28_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_c = _d.return)) _c.call(_d);
            }
            finally { if (e_28) throw e_28.error; }
        }
    };
    // ============ PanelPosition measure/arrange ============
    Panel.prototype._measurePosition = function (availW, availH) {
        var e_29, _a;
        var pad = this._padding;
        var maxW = 0;
        var maxH = 0;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                elem._measure(availW, availH);
                var mb = elem.measuredBounds;
                var m = elem.margin;
                // Position panels use the element's position (x, y) for placement
                // The measured size is the union of all positioned elements
                var posX = isNaN(elem.position.x) ? 0 : elem.position.x;
                var posY = isNaN(elem.position.y) ? 0 : elem.position.y;
                var elemRight = posX + mb.width + m.left + m.right;
                var elemBottom = posY + mb.height + m.top + m.bottom;
                maxW = Math.max(maxW, elemRight);
                maxH = Math.max(maxH, elemBottom);
            }
        }
        catch (e_29_1) { e_29 = { error: e_29_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_29) throw e_29.error; }
        }
        this._measuredBounds = new Rect(0, 0, maxW + pad.left + pad.right, maxH + pad.top + pad.bottom);
    };
    Panel.prototype._arrangePosition = function (innerX, innerY, innerW, innerH) {
        var e_30, _a;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                var mb = elem.measuredBounds;
                var m = elem.margin;
                var posX = isNaN(elem.position.x) ? 0 : elem.position.x;
                var posY = isNaN(elem.position.y) ? 0 : elem.position.y;
                elem._arrange(new Rect(innerX + posX + m.left, innerY + posY + m.top, mb.width, mb.height));
            }
        }
        catch (e_30_1) { e_30 = { error: e_30_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_30) throw e_30.error; }
        }
    };
    // ============ PanelViewbox measure/arrange ============
    Panel.prototype._measureViewbox = function (availW, availH) {
        var pad = this._padding;
        var child = this._elements.find(function (e) { return e.visible; }) || null;
        if (child) {
            child._measure(Infinity, Infinity);
            var mb = child.measuredBounds;
            var m = child.margin;
            var w = Math.min(availW, mb.width + m.left + m.right);
            var h = Math.min(availH, mb.height + m.top + m.bottom);
            this._measuredBounds = new Rect(0, 0, w + pad.left + pad.right, h + pad.top + pad.bottom);
        }
        else {
            this._measuredBounds = new Rect(0, 0, pad.left + pad.right, pad.top + pad.bottom);
        }
    };
    Panel.prototype._arrangeViewbox = function (innerX, innerY, width, height) {
        var child = this._elements.find(function (e) { return e.visible; }) || null;
        if (!child) {
            this._viewboxScaleX = 1;
            this._viewboxScaleY = 1;
            return;
        }
        var mb = child.measuredBounds;
        var m = child.margin;
        var childW = mb.width;
        var childH = mb.height;
        var availW = Math.max(0, width - m.left - m.right);
        var availH = Math.max(0, height - m.top - m.bottom);
        var scaleX = 1;
        var scaleY = 1;
        if (childW > 0 && childH > 0 && (availW > 0 || availH > 0)) {
            var stretch = this._viewboxStretch;
            if (stretch === StretchFill) {
                scaleX = availW / childW;
                scaleY = availH / childH;
            }
            else if (stretch === StretchUniformToFill) {
                var scale = Math.max(availW / childW, availH / childH);
                scaleX = scale;
                scaleY = scale;
            }
            else if (stretch === StretchUniform) {
                var scale = Math.min(availW / childW, availH / childH);
                scaleX = scale;
                scaleY = scale;
            }
        }
        this._viewboxScaleX = scaleX;
        this._viewboxScaleY = scaleY;
        var scaledW = childW * scaleX;
        var scaledH = childH * scaleY;
        var offsetX = (width - scaledW) / 2;
        var offsetY = (height - scaledH) / 2;
        child._arrange(new Rect(innerX + offsetX, innerY + offsetY, childW, childH));
    };
    // ============ PanelGraduated measure/arrange ============
    Panel.prototype._measureGraduated = function (availW, availH) {
        var e_31, _a;
        var pad = this._padding;
        var _b = this._findMainAndOthers(), main = _b.main, others = _b.others;
        var measuredW = 0;
        var measuredH = 0;
        if (main !== null) {
            main._measure(availW, availH);
            var mb = main.measuredBounds;
            var m = main.margin;
            measuredW = mb.width + m.left + m.right;
            measuredH = mb.height + m.top + m.bottom;
        }
        try {
            for (var others_5 = __values(others), others_5_1 = others_5.next(); !others_5_1.done; others_5_1 = others_5.next()) {
                var elem = others_5_1.value;
                elem._measure(availW, availH);
            }
        }
        catch (e_31_1) { e_31 = { error: e_31_1 }; }
        finally {
            try {
                if (others_5_1 && !others_5_1.done && (_a = others_5.return)) _a.call(others_5);
            }
            finally { if (e_31) throw e_31.error; }
        }
        this._measuredBounds = new Rect(0, 0, measuredW + pad.left + pad.right, measuredH + pad.top + pad.bottom);
    };
    Panel.prototype._arrangeGraduated = function (innerX, innerY, innerW, innerH) {
        var e_32, _a;
        var _b = this._findMainAndOthers(), main = _b.main, others = _b.others;
        if (main !== null) {
            var m = main.margin;
            main._arrange(new Rect(innerX + m.left, innerY + m.top, innerW - m.left - m.right, innerH - m.top - m.bottom));
        }
        try {
            for (var others_6 = __values(others), others_6_1 = others_6.next(); !others_6_1.done; others_6_1 = others_6.next()) {
                var elem = others_6_1.value;
                var mb = elem.measuredBounds;
                var alignment = this._resolveAlignment(elem);
                var pos = alignment.positionInRect(new Rect(innerX, innerY, innerW, innerH));
                var focus_4 = this._resolveAlignmentFocus(elem);
                var focusPos = focus_4.positionInRect(new Rect(0, 0, mb.width, mb.height));
                elem._arrange(new Rect(pos.x - focusPos.x, pos.y - focusPos.y, mb.width, mb.height));
            }
        }
        catch (e_32_1) { e_32 = { error: e_32_1 }; }
        finally {
            try {
                if (others_6_1 && !others_6_1.done && (_a = others_6.return)) _a.call(others_6);
            }
            finally { if (e_32) throw e_32.error; }
        }
    };
    // ============ PanelLink measure/arrange ============
    Panel.prototype._measureLink = function (widthConstraint, heightConstraint) {
        var e_33, _a;
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                elem._measure(Infinity, Infinity);
            }
        }
        catch (e_33_1) { e_33 = { error: e_33_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_33) throw e_33.error; }
        }
        var link = this;
        var points = link.points;
        if (points && points.count >= 2) {
            var minX = Infinity;
            var minY = Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            var it = points.iterator;
            while (it.next()) {
                var p = it.value;
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            }
            this._measuredBounds = new Rect(0, 0, maxX - minX, maxY - minY);
        }
        else {
            this._measuredBounds = new Rect(0, 0, 1, 1);
        }
    };
    Panel.prototype._arrangeLink = function (bounds) {
        var e_34, _a, e_35, _b, e_36, _c, e_37, _d, e_38, _e;
        var link = this;
        var points = link.points;
        if (!points || points.count < 2) {
            try {
                for (var _f = __values(this._elements), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var elem = _g.value;
                    if (!elem.visible)
                        continue;
                    var mb = elem.measuredBounds;
                    elem._arrange(new Rect(0, 0, mb.width, mb.height));
                }
            }
            catch (e_34_1) { e_34 = { error: e_34_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
                }
                finally { if (e_34) throw e_34.error; }
            }
            return;
        }
        var pts = points.toArray();
        var minX = Infinity;
        var minY = Infinity;
        try {
            for (var pts_1 = __values(pts), pts_1_1 = pts_1.next(); !pts_1_1.done; pts_1_1 = pts_1.next()) {
                var p = pts_1_1.value;
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
            }
        }
        catch (e_35_1) { e_35 = { error: e_35_1 }; }
        finally {
            try {
                if (pts_1_1 && !pts_1_1.done && (_b = pts_1.return)) _b.call(pts_1);
            }
            finally { if (e_35) throw e_35.error; }
        }
        var segLengths = [];
        var totalLength = 0;
        for (var i = 0; i < pts.length - 1; i++) {
            var len = pts[i].distanceTo(pts[i + 1]);
            segLengths.push(len);
            totalLength += len;
        }
        var mainElement = null;
        var foundPanelMain = false;
        try {
            for (var _h = __values(this._elements), _j = _h.next(); !_j.done; _j = _h.next()) {
                var elem = _j.value;
                if (!elem.visible)
                    continue;
                if (elem.isPanelMain) {
                    mainElement = elem;
                    foundPanelMain = true;
                    break;
                }
            }
        }
        catch (e_36_1) { e_36 = { error: e_36_1 }; }
        finally {
            try {
                if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
            }
            finally { if (e_36) throw e_36.error; }
        }
        if (!foundPanelMain) {
            try {
                for (var _k = __values(this._elements), _l = _k.next(); !_l.done; _l = _k.next()) {
                    var elem = _l.value;
                    if (!elem.visible)
                        continue;
                    if ('fill' in elem && 'stroke' in elem) {
                        mainElement = elem;
                        break;
                    }
                }
            }
            catch (e_37_1) { e_37 = { error: e_37_1 }; }
            finally {
                try {
                    if (_l && !_l.done && (_d = _k.return)) _d.call(_k);
                }
                finally { if (e_37) throw e_37.error; }
            }
        }
        try {
            for (var _m = __values(this._elements), _o = _m.next(); !_o.done; _o = _m.next()) {
                var elem = _o.value;
                if (!elem.visible)
                    continue;
                if (elem === mainElement) {
                    elem._arrange(new Rect(0, 0, bounds.width, bounds.height));
                    continue;
                }
                var mb = elem.measuredBounds;
                var segIndex = elem.segmentIndex;
                var segFraction = elem.segmentFraction;
                var segOffset = elem.segmentOffset;
                var segOrientation = elem.segmentOrientation;
                var basePos = void 0;
                var segAngle = void 0;
                if (isNaN(segIndex)) {
                    if (totalLength > 0) {
                        var targetDist = segFraction * totalLength;
                        basePos = this._getPointAtDistance(pts, segLengths, targetDist);
                        segAngle = this._getAngleAtDistance(pts, segLengths, targetDist);
                    }
                    else {
                        basePos = pts[0].copy();
                        segAngle = 0;
                    }
                }
                else {
                    var idx = segIndex < 0 ? pts.length - 1 + segIndex : segIndex;
                    var clampedIdx = Math.max(0, Math.min(idx, pts.length - 2));
                    var startPt = pts[clampedIdx];
                    var endPt = pts[clampedIdx + 1];
                    basePos = Point.lerp(startPt, endPt, segFraction);
                    segAngle = startPt.directionTo(endPt);
                }
                basePos = new Point(basePos.x - minX, basePos.y - minY);
                var offsetX = isNaN(segOffset.x) ? 0 : segOffset.x;
                var offsetY = isNaN(segOffset.y) ? 0 : segOffset.y;
                basePos = new Point(basePos.x + offsetX, basePos.y + offsetY);
                var rotationAngle = 0;
                if (segOrientation === SegmentOrientationAlong || segOrientation === SegmentOrientationParallel) {
                    rotationAngle = segAngle * 180 / Math.PI;
                }
                else if (segOrientation === SegmentOrientationOpposite) {
                    rotationAngle = segAngle * 180 / Math.PI + 180;
                }
                else if (segOrientation === SegmentOrientationPerpendicular) {
                    rotationAngle = segAngle * 180 / Math.PI + 90;
                }
                else if (segOrientation === SegmentOrientationOrthogonal) {
                    rotationAngle = Math.round(segAngle * 180 / Math.PI / 90) * 90;
                }
                elem._arrange(new Rect(basePos.x - mb.width / 2, basePos.y - mb.height / 2, mb.width, mb.height));
                if (rotationAngle !== 0) {
                    elem.angle = rotationAngle;
                }
            }
        }
        catch (e_38_1) { e_38 = { error: e_38_1 }; }
        finally {
            try {
                if (_o && !_o.done && (_e = _m.return)) _e.call(_m);
            }
            finally { if (e_38) throw e_38.error; }
        }
    };
    Panel.prototype._getPointAtDistance = function (pts, segLengths, distance) {
        var accumulated = 0;
        for (var i = 0; i < segLengths.length; i++) {
            if (accumulated + segLengths[i] >= distance) {
                var remaining = distance - accumulated;
                var fraction = segLengths[i] > 0 ? remaining / segLengths[i] : 0;
                return Point.lerp(pts[i], pts[i + 1], fraction);
            }
            accumulated += segLengths[i];
        }
        return pts[pts.length - 1].copy();
    };
    Panel.prototype._getAngleAtDistance = function (pts, segLengths, distance) {
        var accumulated = 0;
        for (var i = 0; i < segLengths.length; i++) {
            if (accumulated + segLengths[i] >= distance) {
                return pts[i].directionTo(pts[i + 1]);
            }
            accumulated += segLengths[i];
        }
        if (pts.length >= 2) {
            return pts[pts.length - 2].directionTo(pts[pts.length - 1]);
        }
        return 0;
    };
    // ============ Internal helpers ============
    Panel.prototype._resolveAlignment = function (elem) {
        var a = elem.alignment;
        if (!a.isDefault)
            return a;
        // Auto and Spot panels default to centering non-main elements
        if (this._type === PanelAuto || this._type === PanelSpot) {
            return new Spot(0.5, 0.5);
        }
        return this._defaultAlignment;
    };
    Panel.prototype._resolveAlignmentFocus = function (elem) {
        var af = elem.alignmentFocus;
        if (!af.isDefault)
            return af;
        if (this._alignmentFocusName) {
            var named = this.findObject(this._alignmentFocusName);
            if (named)
                return named.alignmentFocus;
        }
        // Auto and Spot panels default to centering the element's focus
        if (this._type === PanelAuto || this._type === PanelSpot) {
            return new Spot(0.5, 0.5);
        }
        return Spot.Default.copy();
    };
    Panel.prototype._resolveStretchWidth = function (elem, available, measured) {
        var stretch = elem.stretch !== StretchDefault ? elem.stretch : this._defaultStretch;
        if (stretch === StretchFill || stretch === StretchHorizontal)
            return available;
        if (stretch === StretchUniform) {
            if (measured <= 0)
                return measured;
            var scale = Math.min(available / measured, this._resolveUniformScale(elem, available, measured));
            return measured * scale;
        }
        return measured;
    };
    Panel.prototype._resolveStretchHeight = function (elem, available, measured) {
        var stretch = elem.stretch !== StretchDefault ? elem.stretch : this._defaultStretch;
        if (stretch === StretchFill || stretch === StretchVertical)
            return available;
        if (stretch === StretchUniform) {
            if (measured <= 0)
                return measured;
            var scale = Math.min(available / measured, this._resolveUniformScale(elem, available, measured));
            return measured * scale;
        }
        return measured;
    };
    /** Compute the uniform scale factor for an element */
    Panel.prototype._resolveUniformScale = function (elem, availW, availH) {
        var mb = elem.measuredBounds;
        if (mb.width <= 0 || mb.height <= 0)
            return 1;
        return Math.min(availW / mb.width, availH / mb.height);
    };
    Panel.prototype._ensureColumnDefinition = function (index) {
        while (this._columnDefinitions.length <= index) {
            this._columnDefinitions.push(new RowColumnDefinition());
        }
    };
    Panel.prototype._ensureRowDefinition = function (index) {
        while (this._rowDefinitions.length <= index) {
            this._rowDefinitions.push(new RowColumnDefinition());
        }
    };
    Panel.prototype._computeColumnWidths = function (availW) {
        var e_39, _a;
        var colCount = Math.max(this.columnCount, this._columnDefinitions.length);
        if (colCount === 0)
            return [];
        var widths = new Array(colCount).fill(0);
        var defined = new Array(colCount).fill(false);
        for (var i = 0; i < colCount; i++) {
            var def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
            if (def && !isNaN(def.width) && def.width > 0) {
                widths[i] = def.width;
                defined[i] = true;
            }
        }
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                var col = elem.column;
                var colSpan = elem.columnSpan;
                if (colSpan > 1)
                    continue;
                if (!defined[col]) {
                    elem._measure(Infinity, Infinity);
                    var mb = elem.measuredBounds;
                    var m = elem.margin;
                    var needed = mb.width + m.left + m.right;
                    if (needed > widths[col]) {
                        widths[col] = needed;
                    }
                }
            }
        }
        catch (e_39_1) { e_39 = { error: e_39_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_39) throw e_39.error; }
        }
        for (var i = 0; i < colCount; i++) {
            var def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
            if (def) {
                widths[i] = Math.max(def.minimum, Math.min(def.maximum, widths[i]));
            }
        }
        var totalDefined = 0;
        var undefinedCount = 0;
        for (var i = 0; i < colCount; i++) {
            if (defined[i]) {
                totalDefined += widths[i];
            }
            else {
                undefinedCount++;
            }
        }
        var remaining = Math.max(0, availW - totalDefined);
        if (undefinedCount > 0 && remaining > 0) {
            var autoCount = 0;
            var propTotal = 0;
            for (var i = 0; i < colCount; i++) {
                if (defined[i])
                    continue;
                var def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
                if (def && def.sizing === SizingProp) {
                    propTotal += (widths[i] > 0 ? widths[i] : 1);
                }
                else {
                    autoCount++;
                }
            }
            var autoRemaining = Math.max(0, remaining - propTotal);
            for (var i = 0; i < colCount; i++) {
                if (defined[i])
                    continue;
                var def = i < this._columnDefinitions.length ? this._columnDefinitions[i] : null;
                if (def && def.sizing === SizingProp) {
                    var ratio = propTotal > 0 ? (widths[i] > 0 ? widths[i] : 1) / propTotal : 1 / colCount;
                    widths[i] = remaining * ratio;
                }
                else if (def && def.sizing === SizingAuto) ;
                else if (autoCount > 0) {
                    widths[i] = Math.max(widths[i], autoRemaining / autoCount);
                }
            }
        }
        return widths;
    };
    Panel.prototype._computeRowHeights = function (availH) {
        var e_40, _a;
        var rowCount = Math.max(this.rowCount, this._rowDefinitions.length);
        if (rowCount === 0)
            return [];
        var heights = new Array(rowCount).fill(0);
        var defined = new Array(rowCount).fill(false);
        for (var i = 0; i < rowCount; i++) {
            var def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
            if (def && !isNaN(def.height) && def.height > 0) {
                heights[i] = def.height;
                defined[i] = true;
            }
        }
        try {
            for (var _b = __values(this._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                if (!elem.visible)
                    continue;
                var row = elem.row;
                var rowSpan = elem.rowSpan;
                if (rowSpan > 1)
                    continue;
                if (!defined[row]) {
                    elem._measure(Infinity, Infinity);
                    var mb = elem.measuredBounds;
                    var m = elem.margin;
                    var needed = mb.height + m.top + m.bottom;
                    if (needed > heights[row]) {
                        heights[row] = needed;
                    }
                }
            }
        }
        catch (e_40_1) { e_40 = { error: e_40_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_40) throw e_40.error; }
        }
        for (var i = 0; i < rowCount; i++) {
            var def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
            if (def) {
                heights[i] = Math.max(def.minimum, Math.min(def.maximum, heights[i]));
            }
        }
        var totalDefined = 0;
        var undefinedCount = 0;
        for (var i = 0; i < rowCount; i++) {
            if (defined[i]) {
                totalDefined += heights[i];
            }
            else {
                undefinedCount++;
            }
        }
        var remaining = Math.max(0, availH - totalDefined);
        if (undefinedCount > 0 && remaining > 0) {
            var autoCount = 0;
            var propTotal = 0;
            for (var i = 0; i < rowCount; i++) {
                if (defined[i])
                    continue;
                var def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
                if (def && def.sizing === SizingProp) {
                    propTotal += (heights[i] > 0 ? heights[i] : 1);
                }
                else {
                    autoCount++;
                }
            }
            var autoRemaining = Math.max(0, remaining - propTotal);
            for (var i = 0; i < rowCount; i++) {
                if (defined[i])
                    continue;
                var def = i < this._rowDefinitions.length ? this._rowDefinitions[i] : null;
                if (def && def.sizing === SizingProp) {
                    var ratio = propTotal > 0 ? (heights[i] > 0 ? heights[i] : 1) / propTotal : 1 / rowCount;
                    heights[i] = remaining * ratio;
                }
                else if (def && def.sizing === SizingAuto) ;
                else if (autoCount > 0) {
                    heights[i] = Math.max(heights[i], autoRemaining / autoCount);
                }
            }
        }
        return heights;
    };
    Panel.prototype._findItemTemplate = function (data) {
        if (!data)
            return this._itemTemplate;
        var category;
        if (typeof this._itemCategoryProperty === 'function') {
            category = this._itemCategoryProperty(data);
        }
        else if (typeof this._itemCategoryProperty === 'string') {
            category = data[this._itemCategoryProperty];
        }
        if (category && this._itemTemplateMap.has(category)) {
            return this._itemTemplateMap.get(category);
        }
        return this._itemTemplate;
    };
    Panel.prototype._handleObjectPropertyChanged = function (obj, propname, value) {
        var panel = this._panel;
        if (panel && typeof panel._handleObjectPropertyChanged === 'function') {
            panel._handleObjectPropertyChanged(obj, propname, value);
        }
        var part = this._part;
        if (part && part.isTopLevel) {
            var diagram = part._diagram;
            if (diagram && typeof diagram._handlePartPropertyChanged === 'function') {
                diagram._handlePartPropertyChanged(part, obj, propname, value);
            }
        }
    };
    // ============ Static constants ============
    Panel.Auto = PanelAuto;
    Panel.Vertical = PanelVertical;
    Panel.Horizontal = PanelHorizontal;
    Panel.Spot = PanelSpot;
    Panel.Table = PanelTable;
    Panel.Position = PanelPosition;
    Panel.Grid = PanelGrid;
    Panel.Viewbox = PanelViewbox;
    Panel.Graduated = PanelGraduated;
    Panel.Link = PanelLink;
    Panel.TableColumn = PanelTableColumn;
    Panel.TableRow = PanelTableRow;
    return Panel;
}(GraphObject));
GraphObject.defineBuilder('Panel', Panel);

/**
 * Part - base class for top-level visual elements (Node, Link, Adornment).
 * Extends Panel with location, selection, shadow, and adornment support.
 */
var Part = /** @class */ (function (_super) {
    __extends(Part, _super);
    function Part(type) {
        var _this = _super.call(this, type) || this;
        // ============ Private property storage ============
        _this._diagram = null;
        _this._location = new Point(NaN, NaN);
        _this._locationSpot = Spot.TopLeft.copy();
        _this._locationObjectName = '';
        _this._movable = true;
        _this._copyable = true;
        _this._deletable = true;
        _this._selectable = true;
        _this._isSelected = false;
        _this._isHighlighted = false;
        _this._isLayoutPositioned = true;
        _this._isInDocumentBounds = true;
        _this._isShadowed = false;
        _this._shadowOffset = new Point(5, 5);
        _this._shadowColor = 'rgba(0,0,0,0.3)';
        _this._shadowBlur = 5;
        _this._layerName = '';
        _this._zOrder = 0;
        _this._canStart = true;
        _this._dragComputation = null;
        _this._selectionAdorned = true;
        _this._selectionAdornmentTemplate = null;
        _this._adornments = new Map$1();
        _this._category = '';
        _this._itemIndex = -1;
        _this._containingGroup = null;
        _this._className = 'Part';
        return _this;
    }
    Object.defineProperty(Part.prototype, "visible", {
        get: function () { return this._visible; },
        set: function (val) {
            if (this._visible === val)
                return;
            this._visible = val;
            this._invalidateMeasure();
            if (this._diagram && this._isLayoutPositioned) {
                var layout = this._diagram.layout;
                if (layout && layout.isOngoing) {
                    layout.invalidateLayout();
                }
                if (this._containingGroup && this._containingGroup.layout && this._containingGroup.layout.isOngoing) {
                    this._containingGroup.layout.invalidateLayout();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "location", {
        // ============ Properties ============
        get: function () { return this._location; },
        set: function (val) {
            var p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : new Point(NaN, NaN));
            if (this._location.equals(p))
                return;
            this._location = p;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "locationSpot", {
        get: function () { return this._locationSpot; },
        set: function (val) {
            var s = val && typeof val.copy === 'function' ? val.copy() : (val ? new Spot(val.x || 0, val.y || 0, val.offsetX || 0, val.offsetY || 0) : Spot.Default.copy());
            if (this._locationSpot.equals(s))
                return;
            this._locationSpot = s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "locationObjectName", {
        get: function () { return this._locationObjectName; },
        set: function (val) { this._locationObjectName = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "movable", {
        get: function () { return this._movable; },
        set: function (val) { this._movable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "copyable", {
        get: function () { return this._copyable; },
        set: function (val) { this._copyable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "deletable", {
        get: function () { return this._deletable; },
        set: function (val) { this._deletable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "selectable", {
        get: function () { return this._selectable; },
        set: function (val) { this._selectable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "selectionAdorned", {
        get: function () { return this._selectionAdorned; },
        set: function (val) { this._selectionAdorned = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "selectionAdornmentTemplate", {
        get: function () { return this._selectionAdornmentTemplate; },
        set: function (val) { this._selectionAdornmentTemplate = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isSelected", {
        get: function () { return this._isSelected; },
        set: function (val) {
            if (this._isSelected === val)
                return;
            this._isSelected = val;
            if (val && this._selectionAdorned) {
                var ad = this._createSelectionAdornment();
                this.addAdornment('Selection', ad);
                if (this._diagram) {
                    var adornmentLayer = this._diagram.findLayer('Adornment');
                    if (adornmentLayer) {
                        adornmentLayer.add(ad);
                    }
                    this._diagram.selection.add(this);
                }
            }
            else {
                var ad = this.getAdornment('Selection');
                if (ad) {
                    if (this._diagram) {
                        var adornmentLayer = this._diagram.findLayer('Adornment');
                        if (adornmentLayer) {
                            adornmentLayer.remove(ad);
                        }
                    }
                    this.removeAdornment('Selection');
                }
                if (this._diagram) {
                    this._diagram.selection.remove(this);
                }
            }
            if (this._diagram && this._diagram._toolManager) {
                this._diagram._toolManager.updateAdornments(this);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isHighlighted", {
        get: function () { return this._isHighlighted; },
        set: function (val) { this._isHighlighted = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isLayoutPositioned", {
        get: function () { return this._isLayoutPositioned; },
        set: function (val) { this._isLayoutPositioned = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isInDocumentBounds", {
        get: function () { return this._isInDocumentBounds; },
        set: function (val) { this._isInDocumentBounds = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isShadowed", {
        get: function () { return this._isShadowed; },
        set: function (val) { this._isShadowed = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "shadowOffset", {
        get: function () { return this._shadowOffset; },
        set: function (val) {
            var p = val && typeof val.copy === 'function' ? val.copy() : (val ? new Point(val.x || 0, val.y || 0) : Point.Zero.copy());
            if (this._shadowOffset.equals(p))
                return;
            this._shadowOffset = p;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "shadowColor", {
        get: function () { return this._shadowColor; },
        set: function (val) { this._shadowColor = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "shadowBlur", {
        get: function () { return this._shadowBlur; },
        set: function (val) { this._shadowBlur = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "layerName", {
        get: function () { return this._layerName; },
        set: function (val) { this._layerName = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "zOrder", {
        get: function () { return this._zOrder; },
        set: function (val) { this._zOrder = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "canStart", {
        get: function () { return this._canStart; },
        set: function (val) { this._canStart = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "dragComputation", {
        get: function () {
            return this._dragComputation;
        },
        set: function (val) {
            this._dragComputation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "adornments", {
        get: function () { return this._adornments; },
        set: function (val) { this._adornments = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "category", {
        get: function () { return this._category; },
        set: function (val) { this._category = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "itemIndex", {
        get: function () { return this._itemIndex; },
        set: function (val) { this._itemIndex = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isTopLevel", {
        // ============ Readonly properties ============
        get: function () { return this._containingGroup === null; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "isVirtual", {
        get: function () { return false; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "containingGroup", {
        get: function () { return this._containingGroup; },
        set: function (val) {
            if (this._containingGroup === val)
                return;
            var old = this._containingGroup;
            if (old && typeof old._memberParts !== 'undefined') {
                old._memberParts.remove(this);
                if (old.layout && old.layout.isOngoing) {
                    old.layout.invalidateLayout();
                }
            }
            this._containingGroup = val;
            if (val && typeof val._memberParts !== 'undefined') {
                val._memberParts.add(this);
                if (val.layout && val.layout.isOngoing) {
                    val.layout.invalidateLayout();
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Part.prototype, "adornmentStream", {
        get: function () { return this._adornments.values; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Find a named GraphObject within this Part */
    Part.prototype.findObject = function (name) {
        return typeof _super.prototype.findObject === 'function' ? _super.prototype.findObject.call(this, name) : null;
    };
    /** Find the main element of this Part */
    Part.prototype.findMainElement = function () {
        // Stub - depends on Panel implementation
        return null;
    };
    /** Ensure the bounds of this Part are computed */
    Part.prototype.ensureBounds = function () {
        // Stub - depends on layout/measurement system
    };
    /** Get the bounding rectangle in document coordinates */
    Part.prototype.getDocumentBounds = function () {
        var bounds = this._actualBounds.copy();
        var loc = this._location;
        if (!isNaN(loc.x) && !isNaN(loc.y)) {
            bounds.x = loc.x;
            bounds.y = loc.y;
        }
        return bounds;
    };
    /** Move this Part to a new location */
    Part.prototype.move = function (newLoc) {
        this._location = newLoc.copy();
    };
    /** Add an adornment for the given category */
    Part.prototype.addAdornment = function (category, ad) {
        this._adornments.set(category, ad);
    };
    /** Remove the adornment for the given category */
    Part.prototype.removeAdornment = function (category) {
        this._adornments.remove(category);
    };
    /** Get the adornment for the given category */
    Part.prototype.getAdornment = function (category) {
        var _a;
        return (_a = this._adornments.get(category)) !== null && _a !== void 0 ? _a : null;
    };
    /** Remove all adornments */
    Part.prototype.clearAdornments = function () {
        this._adornments.clear();
    };
    Part.prototype._createSelectionAdornment = function () {
        if (this._selectionAdornmentTemplate) {
            var ad = this._selectionAdornmentTemplate.copy();
            ad.adornedObject = this;
            var bounds_1 = this.getDocumentBounds();
            ad._actualBounds = bounds_1.copy();
            ad._measuredBounds = new Rect(0, 0, bounds_1.width, bounds_1.height);
            ad._naturalBounds = new Rect(0, 0, bounds_1.width, bounds_1.height);
            return ad;
        }
        var AdornmentCtor = GraphObject._classRegistry['Adornment'];
        var adornment = new AdornmentCtor(PanelAuto);
        var shape = new Shape();
        shape.fill = '';
        shape.stroke = 'dodgerblue';
        shape.strokeWidth = 2;
        shape.strokeDashArray = [4, 2];
        shape.isPanelMain = true;
        shape.stretch = StretchFill;
        adornment.add(shape);
        adornment.adornedObject = this;
        var bounds = this.getDocumentBounds();
        adornment._actualBounds = bounds.copy();
        adornment._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
        adornment._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        shape._actualBounds = new Rect(0, 0, bounds.width, bounds.height);
        shape._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
        shape._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        return adornment;
    };
    Part.prototype.copy = function () {
        var copy = new Part();
        this._copyPropertiesTo(copy);
        this._copyPanelPropertiesTo(copy);
        this._copyPartPropertiesTo(copy);
        return copy;
    };
    /** Copy Part-specific properties to another Part */
    Part.prototype._copyPartPropertiesTo = function (copy) {
        copy._location = this._location.copy();
        copy._locationSpot = this._locationSpot.copy();
        copy._locationObjectName = this._locationObjectName;
        copy._movable = this._movable;
        copy._copyable = this._copyable;
        copy._deletable = this._deletable;
        copy._selectable = this._selectable;
        copy._isSelected = this._isSelected;
        copy._isHighlighted = this._isHighlighted;
        copy._isLayoutPositioned = this._isLayoutPositioned;
        copy._isInDocumentBounds = this._isInDocumentBounds;
        copy._isShadowed = this._isShadowed;
        copy._shadowOffset = this._shadowOffset.copy();
        copy._shadowColor = this._shadowColor;
        copy._shadowBlur = this._shadowBlur;
        copy._layerName = this._layerName;
        copy._zOrder = this._zOrder;
        copy._canStart = this._canStart;
        copy._dragComputation = this._dragComputation;
        copy._category = this._category;
    };
    /** Update target bindings for a given property, or all if no property name given */
    Part.prototype.updateTargetBindings = function (propname) {
        // Stub - depends on Binding/Diagram system
    };
    return Part;
}(Panel));
GraphObject.defineBuilder('Part', Part);

/**
 * Link - a Part that represents a connection between two Nodes.
 */
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link(type, init) {
        var _this = _super.call(this, type || PanelLink) || this;
        // ============ Private property storage ============
        _this._fromNode = null;
        _this._toNode = null;
        _this._fromPortId = '';
        _this._toPortId = '';
        // fromSpot and toSpot are inherited from GraphObject
        _this._routing = RoutingNormal;
        _this._curve = CurveNone;
        _this._corner = 0;
        _this._curviness = NaN;
        _this._points = new List();
        _this._resegmentable = false;
        _this._adjusting = StretchDefault;
        _this._relinkableFrom = false;
        _this._relinkableTo = false;
        _this._reshapable = false;
        _this._jumpOver = 8;
        _this._jumpGap = 8;
        _this._className = 'Link';
        if (init) {
            _this.set(init);
        }
        return _this;
    }
    Object.defineProperty(Link.prototype, "fromNode", {
        // ============ Properties ============
        get: function () { return this._fromNode; },
        set: function (val) { this._fromNode = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "toNode", {
        get: function () { return this._toNode; },
        set: function (val) { this._toNode = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "fromPortId", {
        get: function () { return this._fromPortId; },
        set: function (val) { this._fromPortId = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "toPortId", {
        get: function () { return this._toPortId; },
        set: function (val) { this._toPortId = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "routing", {
        // fromSpot and toSpot are inherited from GraphObject
        get: function () { return this._routing; },
        set: function (val) { this._routing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "curve", {
        get: function () { return this._curve; },
        set: function (val) { this._curve = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "corner", {
        get: function () { return this._corner; },
        set: function (val) { this._corner = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "curviness", {
        get: function () { return this._curviness; },
        set: function (val) { this._curviness = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "jumpOver", {
        get: function () { return this._jumpOver; },
        set: function (val) { this._jumpOver = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "jumpGap", {
        get: function () { return this._jumpGap; },
        set: function (val) { this._jumpGap = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "points", {
        get: function () { return this._points; },
        set: function (val) { this._points = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "resegmentable", {
        get: function () { return this._resegmentable; },
        set: function (val) { this._resegmentable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "adjusting", {
        get: function () { return this._adjusting; },
        set: function (val) { this._adjusting = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "relinkableFrom", {
        get: function () { return this._relinkableFrom; },
        set: function (val) { this._relinkableFrom = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "relinkableTo", {
        get: function () { return this._relinkableTo; },
        set: function (val) { this._relinkableTo = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "reshapable", {
        get: function () { return this._reshapable; },
        set: function (val) { this._reshapable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Link.prototype, "isOrthogonal", {
        // ============ Readonly computed properties ============
        /** Whether this link uses orthogonal routing */
        get: function () {
            return this._routing === RoutingOrthogonal || this._routing === RoutingAvoidsNodes;
        },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Get the link connection point on the from port */
    Link.prototype.getLinkPointFromPort = function (port, spot) {
        var bounds = port.getDocumentBounds();
        if (spot.isNone) {
            return bounds.center;
        }
        return new Point(spot.positionInRect(bounds).x, spot.positionInRect(bounds).y);
    };
    /** Get the link connection point on the to port */
    Link.prototype.getLinkPointToPort = function (port, spot) {
        var bounds = port.getDocumentBounds();
        if (spot.isNone) {
            return bounds.center;
        }
        return new Point(spot.positionInRect(bounds).x, spot.positionInRect(bounds).y);
    };
    /** Compute the route points for this link */
    Link.prototype.computePoints = function () {
        var from = this._fromNode;
        var to = this._toNode;
        if (!from || !to)
            return false;
        var fromPort = from.findPortWithName ? from.findPortWithName(this._fromPortId) || from : from;
        var toPort = to.findPortWithName ? to.findPortWithName(this._toPortId) || to : to;
        var fromBounds = fromPort.getDocumentBounds();
        var toBounds = toPort.getDocumentBounds();
        var fromCenter = fromBounds.center;
        var toCenter = toBounds.center;
        var fromSpot = this._resolveFromSpot(fromPort);
        var toSpot = this._resolveToSpot(toPort);
        var fromPoint;
        var toPoint;
        if (fromSpot.isNone) {
            fromPoint = this._getEdgeIntersection(fromBounds, fromCenter, toCenter);
        }
        else {
            var fp = fromSpot.positionInRect(fromBounds);
            fromPoint = new Point(fp.x, fp.y);
        }
        if (toSpot.isNone) {
            toPoint = this._getEdgeIntersection(toBounds, toCenter, fromCenter);
        }
        else {
            var tp = toSpot.positionInRect(toBounds);
            toPoint = new Point(tp.x, tp.y);
        }
        this._points.clear();
        this._points.add(fromPoint);
        if (this._routing === RoutingOrthogonal) {
            var fromSegLen = fromPort.fromEndSegmentLength || 10;
            var toSegLen = toPort.toEndSegmentLength || 10;
            var fromDir = this._getPortDirection(fromPort, fromSpot, fromPoint, fromCenter);
            var toDir = this._getPortDirection(toPort, toSpot, toPoint, toCenter);
            var fromEnd = this._offsetPoint(fromPoint, fromDir, fromSegLen);
            var toEnd = this._offsetPoint(toPoint, toDir, toSegLen);
            if (fromDir === toDir) {
                var perpDir = this._perpendicularDir(fromDir);
                var midDist = this._distAlongDir(fromEnd, toEnd, perpDir);
                var mid1 = this._offsetPoint(fromEnd, perpDir, midDist / 2);
                var mid2 = this._offsetPoint(toEnd, perpDir, midDist / 2);
                this._points.add(fromEnd);
                this._points.add(mid1);
                this._points.add(mid2);
                this._points.add(toEnd);
            }
            else if (this._isOppositeDir(fromDir, toDir)) {
                var perpDir = this._perpendicularDir(fromDir);
                var midDist = this._distAlongDir(fromEnd, toEnd, perpDir);
                var midAlong = this._distAlongDir(fromEnd, toEnd, fromDir);
                if ((midAlong > 0 && fromDir === 'right') || (midAlong > 0 && fromDir === 'down') ||
                    (midAlong < 0 && fromDir === 'left') || (midAlong < 0 && fromDir === 'up')) {
                    var mid1 = this._offsetPoint(fromEnd, fromDir, midAlong / 2);
                    var mid2 = this._offsetPoint(toEnd, toDir, -midAlong / 2);
                    this._points.add(fromEnd);
                    this._points.add(mid1);
                    this._points.add(mid2);
                    this._points.add(toEnd);
                }
                else {
                    var perpMid = this._distAlongDir(fromEnd, toEnd, perpDir) / 2;
                    var mid1 = this._offsetPoint(fromEnd, perpDir, perpMid);
                    var mid2 = this._offsetPoint(toEnd, perpDir, perpMid);
                    this._points.add(fromEnd);
                    this._points.add(mid1);
                    this._points.add(mid2);
                    this._points.add(toEnd);
                }
            }
            else {
                var canTurn = this._canReachWithCorner(fromEnd, fromDir, toEnd, toDir);
                if (canTurn) {
                    var corner = this._cornerPoint(fromEnd, fromDir, toEnd, toDir);
                    this._points.add(fromEnd);
                    this._points.add(corner);
                    this._points.add(toEnd);
                }
                else {
                    var perpDir = this._perpendicularDir(fromDir);
                    var mid1 = this._offsetPoint(fromEnd, perpDir, this._distAlongDir(fromEnd, toEnd, perpDir));
                    this._points.add(fromEnd);
                    this._points.add(mid1);
                    this._points.add(toEnd);
                }
            }
        }
        this._points.add(toPoint);
        return true;
    };
    /** Resolve the effective fromSpot for this link */
    Link.prototype._resolveFromSpot = function (port) {
        var fromSpot = this.fromSpot;
        if (!fromSpot.isDefault)
            return fromSpot;
        if (port && port.fromSpot) {
            var portSpot = port.fromSpot;
            if (!portSpot.isDefault)
                return portSpot;
        }
        if (this._fromNode) {
            var nodeSpot = this._fromNode.fromSpot;
            if (nodeSpot && !nodeSpot.isDefault)
                return nodeSpot;
        }
        return new Spot(NaN, NaN);
    };
    Link.prototype._resolveToSpot = function (port) {
        var toSpot = this.toSpot;
        if (!toSpot.isDefault)
            return toSpot;
        if (port && port.toSpot) {
            var portSpot = port.toSpot;
            if (!portSpot.isDefault)
                return portSpot;
        }
        if (this._toNode) {
            var nodeSpot = this._toNode.toSpot;
            if (nodeSpot && !nodeSpot.isDefault)
                return nodeSpot;
        }
        return new Spot(NaN, NaN);
    };
    Link.prototype._getPortDirection = function (port, spot, portPoint, center) {
        if (spot && !spot.isNone && !spot.isDefault) {
            if (spot.x <= 0.01)
                return 'left';
            if (spot.x >= 0.99)
                return 'right';
            if (spot.y <= 0.01)
                return 'up';
            if (spot.y >= 0.99)
                return 'down';
        }
        var bounds = port.getDocumentBounds();
        var cx = bounds.x + bounds.width / 2;
        var cy = bounds.y + bounds.height / 2;
        var dx = portPoint.x - cx;
        var dy = portPoint.y - cy;
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        }
        return dy > 0 ? 'down' : 'up';
    };
    Link.prototype._offsetPoint = function (pt, dir, dist) {
        switch (dir) {
            case 'right': return new Point(pt.x + dist, pt.y);
            case 'left': return new Point(pt.x - dist, pt.y);
            case 'down': return new Point(pt.x, pt.y + dist);
            case 'up': return new Point(pt.x, pt.y - dist);
            default: return pt;
        }
    };
    Link.prototype._perpendicularDir = function (dir) {
        switch (dir) {
            case 'right':
            case 'left': return 'down';
            case 'down':
            case 'up': return 'right';
            default: return 'right';
        }
    };
    Link.prototype._isOppositeDir = function (dir1, dir2) {
        return (dir1 === 'right' && dir2 === 'left') || (dir1 === 'left' && dir2 === 'right') ||
            (dir1 === 'down' && dir2 === 'up') || (dir1 === 'up' && dir2 === 'down');
    };
    Link.prototype._distAlongDir = function (from, to, dir) {
        switch (dir) {
            case 'right': return to.x - from.x;
            case 'left': return from.x - to.x;
            case 'down': return to.y - from.y;
            case 'up': return from.y - to.y;
            default: return 0;
        }
    };
    Link.prototype._canReachWithCorner = function (from, fromDir, to, toDir) {
        if ((fromDir === 'right' || fromDir === 'left') && (toDir === 'up' || toDir === 'down')) {
            return true;
        }
        if ((fromDir === 'up' || fromDir === 'down') && (toDir === 'right' || toDir === 'left')) {
            return true;
        }
        return false;
    };
    Link.prototype._cornerPoint = function (from, fromDir, to, toDir) {
        if (fromDir === 'right' || fromDir === 'left') {
            return new Point(from.x, to.y);
        }
        return new Point(to.x, from.y);
    };
    /** Get the intersection of a line from center to target with the rectangle edge */
    Link.prototype._getEdgeIntersection = function (rect, center, target) {
        var dx = target.x - center.x;
        var dy = target.y - center.y;
        if (dx === 0 && dy === 0)
            return center;
        var t = Infinity;
        // Check intersection with each edge
        if (dx !== 0) {
            var tx = (dx > 0 ? rect.right : rect.x) - center.x;
            var t1 = tx / dx;
            var y1 = center.y + t1 * dy;
            if (y1 >= rect.y && y1 <= rect.bottom && t1 > 0 && t1 < t) {
                t = t1;
            }
        }
        if (dy !== 0) {
            var ty = (dy > 0 ? rect.bottom : rect.y) - center.y;
            var t2 = ty / dy;
            var x2 = center.x + t2 * dx;
            if (x2 >= rect.x && x2 <= rect.right && t2 > 0 && t2 < t) {
                t = t2;
            }
        }
        if (t === Infinity)
            return center;
        return new Point(center.x + t * dx, center.y + t * dy);
    };
    Object.defineProperty(Link.prototype, "midPoint", {
        get: function () {
            var pts = this._points;
            var count = pts.count;
            if (count === 0)
                return new Point(NaN, NaN);
            if (count === 1)
                return pts.get(0).copy();
            var midIndex = (count - 1) / 2;
            var i = Math.floor(midIndex);
            var frac = midIndex - i;
            var p1 = pts.get(i);
            var p2 = pts.get(i + 1);
            if (!p1 || !p2)
                return p1 ? p1.copy() : new Point(NaN, NaN);
            return new Point(p1.x + (p2.x - p1.x) * frac, p1.y + (p2.y - p1.y) * frac);
        },
        enumerable: false,
        configurable: true
    });
    Link.prototype.findClosestSegment = function (p) {
        var pts = this._points;
        var count = pts.count;
        if (count < 2)
            return -1;
        var bestDist = Infinity;
        var bestIdx = 0;
        for (var i = 0; i < count - 1; i++) {
            var a = pts.get(i);
            var b = pts.get(i + 1);
            var dx = b.x - a.x;
            var dy = b.y - a.y;
            var lenSq = dx * dx + dy * dy;
            var t = lenSq > 0 ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq : 0;
            t = Math.max(0, Math.min(1, t));
            var cx = a.x + t * dx;
            var cy = a.y + t * dy;
            var distSq = (p.x - cx) * (p.x - cx) + (p.y - cy) * (p.y - cy);
            if (distSq < bestDist) {
                bestDist = distSq;
                bestIdx = i;
            }
        }
        return bestIdx;
    };
    Link.prototype.copy = function () {
        var c = new Link(this._type);
        this._copyPropertiesTo(c);
        this._copyPanelPropertiesTo(c);
        this._copyPartPropertiesTo(c);
        // Copy Link-specific properties
        c._routing = this._routing;
        c._curve = this._curve;
        c._corner = this._corner;
        c._curviness = this._curviness;
        c._resegmentable = this._resegmentable;
        c._adjusting = this._adjusting;
        c._relinkableFrom = this._relinkableFrom;
        c._relinkableTo = this._relinkableTo;
        c._reshapable = this._reshapable;
        return c;
    };
    return Link;
}(Part));
GraphObject.defineBuilder('Link', Link);

/**
 * Node - a Part that can be connected by Links.
 * Represents a vertex in the graph structure.
 */
var Node = /** @class */ (function (_super) {
    __extends(Node, _super);
    function Node(type, init) {
        var _this = _super.call(this, typeof type === 'string' ? Node._resolvePanelType(type) : type) || this;
        // ============ Private property storage ============
        _this._isTreeExpanded = true;
        _this._wasTreeExpanded = true;
        _this._isSubGraphExpanded = true;
        _this._treeExpandedDirection = TreeStyleLayered;
        _this._className = 'Node';
        if (init) {
            _this.set(init);
        }
        return _this;
    }
    Node._resolvePanelType = function (type) {
        var map = {
            'Auto': PanelAuto,
            'Vertical': PanelVertical,
            'Horizontal': PanelHorizontal,
            'Spot': PanelSpot,
            'Table': PanelTable,
            'Position': PanelPosition,
            'Grid': PanelGrid,
            'Link': PanelLink,
        };
        return map[type] || PanelAuto;
    };
    Object.defineProperty(Node.prototype, "isTreeExpanded", {
        // ============ Properties ============
        get: function () { return this._isTreeExpanded; },
        set: function (val) { this._isTreeExpanded = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "wasTreeExpanded", {
        get: function () { return this._wasTreeExpanded; },
        set: function (val) { this._wasTreeExpanded = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isSubGraphExpanded", {
        /** For compatibility with Group */
        get: function () { return this._isSubGraphExpanded; },
        set: function (val) {
            if (this._isSubGraphExpanded === val)
                return;
            this._isSubGraphExpanded = val;
            if (this._className === 'Group' && this.memberParts) {
                var members = this.memberParts;
                var it = members.iterator;
                while (it.next()) {
                    var part = it.value;
                    if (val) {
                        if (part._wasVisible !== false) {
                            part.visible = true;
                        }
                    }
                    else {
                        part._wasVisible = part.visible;
                        part.visible = false;
                    }
                }
                if (this.layout) {
                    this.layout.invalidateLayout();
                }
            }
            var diagram = this._diagram;
            if (diagram) {
                if (typeof diagram._updateBindingsForPart === 'function') {
                    diagram._updateBindingsForPart(this, 'isSubGraphExpanded');
                }
                if (typeof diagram._handlePartPropertyChanged === 'function') {
                    diagram._handlePartPropertyChanged(this, this, 'isSubGraphExpanded', val);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "treeExpandedDirection", {
        get: function () { return this._treeExpandedDirection; },
        set: function (val) { this._treeExpandedDirection = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "isTreeLeaf", {
        get: function () {
            var children = this.findTreeChildrenNodes();
            return children.count === 0;
        },
        enumerable: false,
        configurable: true
    });
    // ============ Link/Node connection methods (stubs) ============
    /** Find all links connected to this node */
    Node.prototype.findLinksConnected = function () {
        var e_1, _a;
        var result = new List();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        try {
            for (var _b = __values(diagram._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link && (part.fromNode === this || part.toNode === this)) {
                        result.add(part);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return result;
    };
    Node.prototype.findLinksInto = function () {
        var e_2, _a;
        var result = new List();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        try {
            for (var _b = __values(diagram._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link && part.toNode === this) {
                        result.add(part);
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return result;
    };
    Node.prototype.findLinksOutOf = function () {
        var e_3, _a;
        var result = new List();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        try {
            for (var _b = __values(diagram._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link && part.fromNode === this) {
                        result.add(part);
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return result;
    };
    Node.prototype.findNodesConnected = function () {
        var e_4, _a;
        var result = new List();
        var seen = new Set();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        try {
            for (var _b = __values(diagram._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link) {
                        var other = null;
                        if (part.fromNode === this)
                            other = part.toNode;
                        else if (part.toNode === this)
                            other = part.fromNode;
                        if (other && !seen.has(other)) {
                            seen.add(other);
                            result.add(other);
                        }
                    }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    Node.prototype.findNodesInto = function () {
        var e_5, _a;
        var result = new List();
        var seen = new Set();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        try {
            for (var _b = __values(diagram._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link && part.toNode === this) {
                        var fromNode = part.fromNode;
                        if (fromNode && !seen.has(fromNode)) {
                            seen.add(fromNode);
                            result.add(fromNode);
                        }
                    }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return result;
    };
    Node.prototype.findNodesOutOf = function () {
        var e_6, _a;
        var result = new List();
        var seen = new Set();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        try {
            for (var _b = __values(diagram._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link && part.fromNode === this) {
                        var toNode = part.toNode;
                        if (toNode && !seen.has(toNode)) {
                            seen.add(toNode);
                            result.add(toNode);
                        }
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        return result;
    };
    /** Find a port element by name */
    Node.prototype.findPortWithName = function (name) {
        if (name === '' || name === undefined || name === null)
            return this;
        var findInPanel = function (obj) {
            var e_7, _a;
            if (obj instanceof Panel) {
                try {
                    for (var _b = __values(obj._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        if (child.portId === name)
                            return child;
                        if (child instanceof Panel) {
                            var found = findInPanel(child);
                            if (found)
                                return found;
                        }
                    }
                }
                catch (e_7_1) { e_7 = { error: e_7_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_7) throw e_7.error; }
                }
            }
            return null;
        };
        return findInPanel(this);
    };
    Node.prototype.isInTreeOf = function (node) {
        var current = this;
        while (current) {
            if (current === node)
                return true;
            current = current.findTreeParentNode();
        }
        return false;
    };
    Node.prototype.findTreeParentNode = function () {
        var diagram = this._diagram;
        if (!diagram)
            return null;
        var model = diagram.model;
        if (!model || !this.data)
            return null;
        if (model instanceof TreeModel) {
            var parentKey = model.getParentKeyForNodeData(this.data);
            if (parentKey !== undefined && parentKey !== null) {
                return diagram.findNodeForKey(parentKey);
            }
            return null;
        }
        if (model instanceof GraphLinksModel) {
            var linksInto = this.findLinksInto();
            var it = linksInto.iterator;
            while (it.next()) {
                var link = it.value;
                if (link.fromNode)
                    return link.fromNode;
            }
            return null;
        }
        return null;
    };
    Node.prototype.findTreeChildrenNodes = function () {
        var e_8, _a;
        var result = new List();
        var diagram = this._diagram;
        if (!diagram)
            return result;
        var model = diagram.model;
        if (!model || !this.data)
            return result;
        var key = model.getKeyForNodeData(this.data);
        if (key === undefined)
            return result;
        if (model instanceof TreeModel) {
            try {
                for (var _b = __values(model.nodeDataArray), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var nodeData = _c.value;
                    var parentKey = model.getParentKeyForNodeData(nodeData);
                    if (parentKey === key) {
                        var childKey = model.getKeyForNodeData(nodeData);
                        if (childKey !== undefined) {
                            var childNode = diagram.findNodeForKey(childKey);
                            if (childNode)
                                result.add(childNode);
                        }
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
            return result;
        }
        if (model instanceof GraphLinksModel) {
            var linksOutOf = this.findLinksOutOf();
            var seen = new Set();
            var it = linksOutOf.iterator;
            while (it.next()) {
                var link = it.value;
                if (link.toNode && !seen.has(link.toNode)) {
                    seen.add(link.toNode);
                    result.add(link.toNode);
                }
            }
            return result;
        }
        return result;
    };
    Node.prototype.findTreeParentLink = function () {
        var linksInto = this.findLinksInto();
        var it = linksInto.iterator;
        if (it.next())
            return it.value;
        return null;
    };
    Node.prototype.findLevel = function () {
        var levelCache = new Map();
        var computeLevel = function (n) {
            var data = n.data;
            if (!data)
                return 0;
            var key = n._diagram ? n._diagram.model.getKeyForNodeData(data) : undefined;
            if (key !== undefined && levelCache.has(key))
                return levelCache.get(key);
            var parent = n.findTreeParentNode();
            var level = parent ? computeLevel(parent) + 1 : 0;
            if (key !== undefined)
                levelCache.set(key, level);
            return level;
        };
        return computeLevel(this);
    };
    Node.prototype.findCommonParent = function (node) {
        var ancestors = new Set();
        var current = this;
        while (current) {
            ancestors.add(current);
            current = current.findTreeParentNode();
        }
        current = node;
        while (current) {
            if (ancestors.has(current))
                return current;
            current = current.findTreeParentNode();
        }
        return null;
    };
    // ============ Methods ============
    /** Create a copy of this Node */
    Node.prototype.copy = function () {
        var c = new Node(this._type);
        this._copyPropertiesTo(c);
        this._copyPanelPropertiesTo(c);
        this._copyPartPropertiesTo(c);
        // Copy Node-specific properties
        c._isTreeExpanded = this._isTreeExpanded;
        c._wasTreeExpanded = this._wasTreeExpanded;
        c._isSubGraphExpanded = this._isSubGraphExpanded;
        c._treeExpandedDirection = this._treeExpandedDirection;
        return c;
    };
    return Node;
}(Part));
GraphObject.defineBuilder('Node', Node);

var Group = /** @class */ (function (_super) {
    __extends(Group, _super);
    function Group(type, init) {
        var _this = _super.call(this, type) || this;
        _this._handlesDragDrop = false;
        _this._memberParts = new Set();
        _this._ungroupable = false;
        _this._layout = null;
        _this._className = 'Group';
        if (init) {
            _this.set(init);
        }
        return _this;
    }
    Object.defineProperty(Group.prototype, "handlesDragDrop", {
        get: function () { return this._handlesDragDrop; },
        set: function (val) { this._handlesDragDrop = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "placeholder", {
        get: function () {
            var findPlaceholder = function (obj) {
                var e_1, _a;
                if ('_placeholderBounds' in obj && obj.constructor.name === 'Placeholder')
                    return obj;
                if ('_elements' in obj) {
                    try {
                        for (var _b = __values(obj._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var child = _c.value;
                            var found = findPlaceholder(child);
                            if (found)
                                return found;
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                return null;
            };
            return findPlaceholder(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "memberParts", {
        get: function () { return this._memberParts; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "ungroupable", {
        get: function () { return this._ungroupable; },
        set: function (val) { this._ungroupable = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "layout", {
        get: function () { return this._layout; },
        set: function (val) {
            this._layout = val;
            if (val) {
                val._group = this;
            }
        },
        enumerable: false,
        configurable: true
    });
    Group.prototype.addMembers = function (collection, check) {
        var it = collection.iterator;
        while (it.next()) {
            var part = it.value;
            if (part === this)
                continue;
            if (part.containingGroup === this)
                continue;
            part.containingGroup = this;
            this._memberParts.add(part);
        }
        return true;
    };
    Group.prototype.removeMembers = function (collection, check) {
        var it = collection.iterator;
        while (it.next()) {
            var part = it.value;
            if (part.containingGroup === this) {
                part.containingGroup = null;
            }
            this._memberParts.remove(part);
        }
        return true;
    };
    Group.prototype.move = function (newLoc) {
        var oldLoc = this.location;
        _super.prototype.move.call(this, newLoc);
        var dx = newLoc.x - oldLoc.x;
        var dy = newLoc.y - oldLoc.y;
        if (dx !== 0 || dy !== 0) {
            var it = this._memberParts.iterator;
            while (it.next()) {
                var part = it.value;
                var partLoc = part.location;
                part.move(new Point(partLoc.x + dx, partLoc.y + dy));
            }
        }
    };
    Group.prototype.copy = function () {
        var c = new Group(this._type);
        this._copyPropertiesTo(c);
        this._copyPanelPropertiesTo(c);
        this._copyPartPropertiesTo(c);
        c._isTreeExpanded = this._isTreeExpanded;
        c._wasTreeExpanded = this._wasTreeExpanded;
        c._isSubGraphExpanded = this._isSubGraphExpanded;
        c._treeExpandedDirection = this._treeExpandedDirection;
        c._handlesDragDrop = this._handlesDragDrop;
        c._ungroupable = this._ungroupable;
        return c;
    };
    return Group;
}(Node));
GraphObject.defineBuilder('Group', Group);

/**
 * Adornment - 装饰
 * 用于选择手柄、工具提示、上下文菜单等
 */
var Adornment = /** @class */ (function (_super) {
    __extends(Adornment, _super);
    function Adornment(type, init) {
        var _this = _super.call(this) || this;
        /** 被装饰的 GraphObject */
        _this._adornedObject = null;
        /** 装饰类别 */
        _this._adornmentCategory = '';
        _this._className = 'Adornment';
        if (type !== undefined) {
            _this._type = type;
        }
        if (init) {
            _this.set(init);
        }
        return _this;
    }
    Object.defineProperty(Adornment.prototype, "adornedObject", {
        get: function () {
            return this._adornedObject;
        },
        set: function (val) {
            this._adornedObject = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Adornment.prototype, "adornedPart", {
        get: function () {
            if (!this._adornedObject)
                return null;
            if (this._adornedObject instanceof Part)
                return this._adornedObject;
            return this._adornedObject.part;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Adornment.prototype, "adornedElement", {
        get: function () {
            return this._adornedObject;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Adornment.prototype, "category", {
        get: function () {
            return this._adornmentCategory;
        },
        set: function (val) {
            this._adornmentCategory = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Adornment.prototype, "isPlaceholder", {
        /** 是否为占位装饰 */
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Adornment.prototype.hasPlaceholder = function () {
        var checkForPlaceholder = function (obj) {
            var e_1, _a;
            if (obj._isPlaceholder)
                return true;
            if (obj._elements) {
                try {
                    for (var _b = __values(obj._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        if (checkForPlaceholder(child))
                            return true;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return false;
        };
        return checkForPlaceholder(this);
    };
    Adornment.prototype.copy = function () {
        var a = new Adornment();
        this._copyPropertiesTo(a);
        this._copyPanelPropertiesTo(a);
        this._copyPartPropertiesTo(a);
        a._adornmentCategory = this._adornmentCategory;
        return a;
    };
    return Adornment;
}(Part));
GraphObject.defineBuilder('Adornment', Adornment);

var Placeholder = /** @class */ (function (_super) {
    __extends(Placeholder, _super);
    function Placeholder() {
        var _this = _super.call(this) || this;
        _this._padding = 0;
        _this._className = 'Placeholder';
        _this._isPlaceholder = true;
        return _this;
    }
    Object.defineProperty(Placeholder.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        set: function (val) {
            if (this._padding !== val) {
                this._padding = val;
                this._invalidateMeasure();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Placeholder.prototype, "_placeholderBounds", {
        get: function () {
            return this._actualBounds;
        },
        enumerable: false,
        configurable: true
    });
    Placeholder.prototype._measure = function (availW, availH) {
        var group = this._findGroup();
        if (group) {
            var bounds = new Rect();
            var groupPos = group.position;
            var it = group.memberParts.iterator;
            while (it.next()) {
                var part = it.value;
                if (!part.visible)
                    continue;
                var partBounds = part.getDocumentBounds();
                var localBounds = new Rect(partBounds.x - groupPos.x, partBounds.y - groupPos.y, partBounds.width, partBounds.height);
                bounds = bounds.union(localBounds);
            }
            var pad = this._padding;
            this._measuredBounds = new Rect(0, 0, bounds.width + pad * 2, bounds.height + pad * 2);
            this._naturalBounds = this._measuredBounds.copy();
        }
        else {
            this._measuredBounds = new Rect(0, 0, 0, 0);
            this._naturalBounds = this._measuredBounds.copy();
        }
        this._applySizeConstraints();
    };
    Placeholder.prototype._arrange = function (bounds) {
        this._actualBounds = bounds.copy();
    };
    Placeholder.prototype._findGroup = function () {
        var p = this._panel;
        while (p) {
            if (p._memberParts !== undefined)
                return p;
            p = p._panel;
        }
        return null;
    };
    Placeholder.prototype.copy = function () {
        var p = new Placeholder();
        this._copyPropertiesTo(p);
        p._padding = this._padding;
        return p;
    };
    return Placeholder;
}(GraphObject));
GraphObject.defineBuilder('Placeholder', Placeholder);

/**
 * Layer - 图层
 * 控制绘制顺序和可见性
 */
var Layer = /** @class */ (function () {
    function Layer() {
        this.name = '';
        this.opacity = 1;
        this.visible = true;
        this.isTemporary = false;
        this.zIndex = 0;
        this._diagram = null;
        this._parts = new List();
    }
    Object.defineProperty(Layer.prototype, "diagram", {
        get: function () {
            return this._diagram;
        },
        set: function (val) {
            this._diagram = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "parts", {
        get: function () {
            return this._parts.iterator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layer.prototype, "partsCount", {
        get: function () {
            return this._parts.count;
        },
        enumerable: false,
        configurable: true
    });
    /** 添加 Part */
    Layer.prototype.add = function (part) {
        this._parts.add(part);
    };
    /** 移除 Part */
    Layer.prototype.remove = function (part) {
        return this._parts.remove(part);
    };
    /** 清空 */
    Layer.prototype.clear = function () {
        this._parts.clear();
    };
    /** 是否包含 Part */
    Layer.prototype.contains = function (part) {
        return this._parts.contains(part);
    };
    return Layer;
}());

/**
 * CanvasRenderer - Canvas 2D rendering engine for the Open-GoJS diagramming library.
 * Draws GraphObject hierarchies onto an HTML5 Canvas.
 */
var CanvasRenderer = /** @class */ (function () {
    // ============ Initialization ============
    function CanvasRenderer(div) {
        this.canvas = null;
        this.ctx = null;
        this.diagram = null;
        this.viewportBounds = new Rect();
        this.scale = 1;
        this.position = Point.Zero.copy();
        this._needsRender = true;
        if (div) {
            this.init(div);
        }
    }
    /** Create canvas, get context, set up size */
    CanvasRenderer.prototype.init = function (div) {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        div.appendChild(this.canvas);
        var ctx = this.canvas.getContext('2d');
        if (!ctx) {
            throw new Error('CanvasRenderer: could not acquire 2D rendering context');
        }
        this.ctx = ctx;
        this.resize(div.clientWidth, div.clientHeight);
    };
    /** Resize canvas to match the given dimensions */
    CanvasRenderer.prototype.resize = function (width, height) {
        if (!this.canvas)
            return;
        var dpr = window.devicePixelRatio || 1;
        this.canvas.width = Math.floor(width * dpr);
        this.canvas.height = Math.floor(height * dpr);
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this._updateViewportBounds();
        this._needsRender = true;
    };
    // ============ Main render loop ============
    /** Main render entry: clear, apply viewport transform, render each layer */
    CanvasRenderer.prototype.render = function (layers) {
        var e_1, _a;
        var ctx = this.ctx;
        if (!ctx || !this.canvas)
            return;
        // If no layers provided, get them from the diagram
        var renderLayers = layers || (this.diagram ? this.diagram._layers : []);
        // Sync viewport position and scale from diagram
        if (this.diagram) {
            this.position = this.diagram.position;
            this.scale = this.diagram.scale;
        }
        var dpr = window.devicePixelRatio || 1;
        // Clear entire canvas
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Apply viewport transform: translate by -position, scale by scale
        ctx.setTransform(dpr * this.scale, 0, 0, dpr * this.scale, -this.position.x * dpr * this.scale, -this.position.y * dpr * this.scale);
        try {
            // Render each visible layer in order
            for (var renderLayers_1 = __values(renderLayers), renderLayers_1_1 = renderLayers_1.next(); !renderLayers_1_1.done; renderLayers_1_1 = renderLayers_1.next()) {
                var layer = renderLayers_1_1.value;
                if (layer.visible) {
                    this.renderLayer(layer);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (renderLayers_1_1 && !renderLayers_1_1.done && (_a = renderLayers_1.return)) _a.call(renderLayers_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._renderDragSelectBox();
        this._needsRender = false;
    };
    CanvasRenderer.prototype._renderTableSeparators = function (panel, panelX, panelY) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var rowDefs = panel._rowDefinitions || [];
        var colDefs = panel._columnDefinitions || [];
        if (rowDefs.length === 0 && colDefs.length === 0)
            return;
        var defaultRowSep = panel.defaultRowSeparatorStroke;
        var defaultColSep = panel.defaultColumnSeparatorStroke;
        var defaultRowSepWidth = panel.defaultRowSeparatorStrokeWidth || 1;
        var defaultColSepWidth = panel.defaultColumnSeparatorStrokeWidth || 1;
        var bounds = panel.actualBounds;
        if (!bounds || bounds.width <= 0 || bounds.height <= 0)
            return;
        var colWidths = panel._lastColWidths;
        var rowHeights = panel._lastRowHeights;
        if (!colWidths || !rowHeights)
            return;
        ctx.save();
        var y = panelY;
        for (var i = 0; i < rowHeights.length; i++) {
            y += rowHeights[i];
            var def = i < rowDefs.length ? rowDefs[i] : null;
            var stroke = (def && def.separatorStroke !== undefined) ? def.separatorStroke : defaultRowSep;
            var strokeWidth = (def && def.separatorStrokeWidth !== undefined) ? def.separatorStrokeWidth : defaultRowSepWidth;
            var dashArray = (def && def.separatorDashArray) ? def.separatorDashArray : null;
            if (stroke && y < panelY + bounds.height) {
                ctx.strokeStyle = stroke;
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(dashArray || []);
                ctx.beginPath();
                ctx.moveTo(panelX, y);
                ctx.lineTo(panelX + bounds.width, y);
                ctx.stroke();
            }
        }
        var x = panelX;
        for (var i = 0; i < colWidths.length; i++) {
            x += colWidths[i];
            var def = i < colDefs.length ? colDefs[i] : null;
            var stroke = (def && def.separatorStroke !== undefined) ? def.separatorStroke : defaultColSep;
            var strokeWidth = (def && def.separatorStrokeWidth !== undefined) ? def.separatorStrokeWidth : defaultColSepWidth;
            var dashArray = (def && def.separatorDashArray) ? def.separatorDashArray : null;
            if (stroke && x < panelX + bounds.width) {
                ctx.strokeStyle = stroke;
                ctx.lineWidth = strokeWidth;
                ctx.setLineDash(dashArray || []);
                ctx.beginPath();
                ctx.moveTo(x, panelY);
                ctx.lineTo(x, panelY + bounds.height);
                ctx.stroke();
            }
        }
        ctx.setLineDash([]);
        ctx.restore();
    };
    CanvasRenderer.prototype._renderDragSelectBox = function () {
        var ctx = this.ctx;
        if (!ctx || !this.diagram)
            return;
        var toolManager = this.diagram._toolManager;
        if (!toolManager)
            return;
        var currentTool = toolManager._currentTool;
        if (!currentTool || !currentTool._box)
            return;
        var box = currentTool._box;
        if (!box || box.isEmpty)
            return;
        ctx.save();
        ctx.fillStyle = 'rgba(30, 144, 255, 0.15)';
        ctx.strokeStyle = 'dodgerblue';
        ctx.lineWidth = 1 / this.scale;
        ctx.fillRect(box.x, box.y, box.width, box.height);
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.restore();
    };
    /** Render all parts in a layer */
    CanvasRenderer.prototype.renderLayer = function (layer) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        ctx.save();
        // Apply layer opacity
        if (layer.opacity < 1) {
            ctx.globalAlpha = layer.opacity;
        }
        var it = layer.parts;
        while (it.next()) {
            var part = it.value;
            if (part && part.visible) {
                this.renderPart(part);
            }
        }
        ctx.restore();
    };
    CanvasRenderer.prototype.renderPart = function (part) {
        var e_2, _a;
        var ctx = this.ctx;
        if (!ctx)
            return;
        ctx.save();
        if (part instanceof Adornment) {
            var adornedPart = part.adornedPart;
            if (adornedPart) {
                var bounds = adornedPart.getDocumentBounds();
                part._actualBounds = bounds.copy();
                part._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
                part._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
                var elements = part._elements;
                try {
                    for (var elements_1 = __values(elements), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                        var elem = elements_1_1.value;
                        elem._actualBounds = new Rect(0, 0, bounds.width, bounds.height);
                        elem._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
                        elem._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (elements_1_1 && !elements_1_1.done && (_a = elements_1.return)) _a.call(elements_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        this._applyTransform(part);
        if (part.opacity < 1) {
            ctx.globalAlpha *= part.opacity;
        }
        if (part._isShadowed) {
            ctx.shadowOffsetX = part._shadowOffset.x;
            ctx.shadowOffsetY = part._shadowOffset.y;
            ctx.shadowColor = part._shadowColor || 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = part._shadowBlur || 5;
        }
        if (part instanceof Link) {
            this.renderLink(part);
        }
        else {
            this.renderPanel(part, 0, 0);
        }
        ctx.restore();
    };
    /** Render a Link - draw the link path and its children */
    CanvasRenderer.prototype.renderLink = function (link) {
        var e_3, _a, e_4, _b;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var points = link.points;
        if (!points || points.count < 2)
            return;
        // Draw each child element of the link panel
        var elements = link._elements;
        // In Link panels, the first Shape is automatically the main shape
        // (unless another Shape has isPanelMain=true)
        var hasExplicitMain = false;
        try {
            for (var elements_2 = __values(elements), elements_2_1 = elements_2.next(); !elements_2_1.done; elements_2_1 = elements_2.next()) {
                var elem = elements_2_1.value;
                if (elem instanceof Shape && elem.isPanelMain) {
                    hasExplicitMain = true;
                    break;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (elements_2_1 && !elements_2_1.done && (_a = elements_2.return)) _a.call(elements_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var firstShape = true;
        try {
            for (var elements_3 = __values(elements), elements_3_1 = elements_3.next(); !elements_3_1.done; elements_3_1 = elements_3.next()) {
                var elem = elements_3_1.value;
                if (!elem.visible)
                    continue;
                if (elem instanceof Shape) {
                    var shape = elem;
                    var isMain = shape.isPanelMain || (!hasExplicitMain && firstShape);
                    firstShape = false;
                    if (isMain) {
                        // This is the main link path shape
                        this._renderLinkPath(shape, link);
                    }
                    else if (shape._toArrow || shape._fromArrow) {
                        // This is an arrowhead
                        this._renderArrow(shape, link);
                    }
                    else {
                        // Other shapes on the link
                        this.renderGraphObject(elem, 0, 0);
                    }
                }
                else if (elem instanceof TextBlock) {
                    // Render label at midpoint
                    this._renderLinkLabel(elem, link);
                }
                else {
                    this.renderGraphObject(elem, 0, 0);
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (elements_3_1 && !elements_3_1.done && (_b = elements_3.return)) _b.call(elements_3);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    /** Render the main link path */
    CanvasRenderer.prototype._renderLinkPath = function (shape, link) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var points = link.points;
        if (!points || points.count < 2)
            return;
        ctx.save();
        var arr = points.toArray();
        var curve = link._curve;
        if (curve === CurveJumpOver || curve === CurveJumpGap) {
            var crossings = this._findCrossings(link);
            if (curve === CurveJumpOver) {
                this._drawPathWithJumpOver(ctx, arr, crossings, link._jumpOver || 8);
            }
            else {
                this._drawPathWithJumpGap(ctx, arr, crossings, link._jumpGap || 8);
            }
        }
        else if (curve === CurveBezier) {
            ctx.beginPath();
            ctx.moveTo(arr[0].x, arr[0].y);
            if (arr.length === 2) {
                var curviness = link._curviness;
                if (curviness && isFinite(curviness) && curviness !== 0) {
                    var dx = arr[1].x - arr[0].x;
                    var dy = arr[1].y - arr[0].y;
                    var len = Math.sqrt(dx * dx + dy * dy);
                    var nx = len > 0 ? -dy / len : 0;
                    var ny = len > 0 ? dx / len : 1;
                    var cx = (arr[0].x + arr[1].x) / 2 + nx * curviness;
                    var cy = (arr[0].y + arr[1].y) / 2 + ny * curviness;
                    ctx.quadraticCurveTo(cx, cy, arr[1].x, arr[1].y);
                }
                else {
                    ctx.lineTo(arr[1].x, arr[1].y);
                }
            }
            else if (arr.length === 3) {
                ctx.quadraticCurveTo(arr[1].x, arr[1].y, arr[2].x, arr[2].y);
            }
            else if (arr.length >= 4) {
                for (var i = 1; i < arr.length - 2; i += 3) {
                    ctx.bezierCurveTo(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, arr[i + 2].x, arr[i + 2].y);
                }
                var remaining = (arr.length - 1) % 3;
                if (remaining === 1) {
                    ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
                }
                else if (remaining === 2) {
                    ctx.quadraticCurveTo(arr[arr.length - 2].x, arr[arr.length - 2].y, arr[arr.length - 1].x, arr[arr.length - 1].y);
                }
            }
        }
        else {
            var corner = link._corner || 0;
            var isOrthogonal = link._routing === RoutingOrthogonal;
            ctx.beginPath();
            ctx.moveTo(arr[0].x, arr[0].y);
            if (isOrthogonal && corner > 0 && arr.length > 2) {
                this._drawOrthogonalPathWithCorners(ctx, arr, corner);
            }
            else {
                for (var i = 1; i < arr.length; i++) {
                    ctx.lineTo(arr[i].x, arr[i].y);
                }
            }
        }
        if (shape.stroke && shape.strokeWidth > 0) {
            ctx.strokeStyle = this._applyBrush(ctx, shape.stroke, link.getDocumentBounds());
            ctx.lineWidth = shape.strokeWidth;
            if (shape.strokeDashArray) {
                ctx.setLineDash(shape.strokeDashArray);
            }
            ctx.stroke();
        }
        ctx.restore();
    };
    CanvasRenderer.prototype._drawOrthogonalPathWithCorners = function (ctx, arr, corner) {
        for (var i = 1; i < arr.length - 1; i++) {
            var prev = arr[i - 1];
            var curr = arr[i];
            var next = arr[i + 1];
            var dx1 = curr.x - prev.x;
            var dy1 = curr.y - prev.y;
            var dx2 = next.x - curr.x;
            var dy2 = next.y - curr.y;
            var len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            var len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            var r = Math.min(corner, len1 / 2, len2 / 2);
            if (r <= 0) {
                ctx.lineTo(curr.x, curr.y);
                continue;
            }
            var ux1 = dx1 / len1;
            var uy1 = dy1 / len1;
            var ux2 = dx2 / len2;
            var uy2 = dy2 / len2;
            var beforeX = curr.x - ux1 * r;
            var beforeY = curr.y - uy1 * r;
            var afterX = curr.x + ux2 * r;
            var afterY = curr.y + uy2 * r;
            ctx.lineTo(beforeX, beforeY);
            ctx.arcTo(curr.x, curr.y, afterX, afterY, r);
        }
        ctx.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
    };
    CanvasRenderer.prototype._findCrossings = function (link) {
        var e_5, _a;
        var diagram = this._diagram;
        if (!diagram)
            return [];
        var myPoints = link.points.toArray();
        if (myPoints.length < 2)
            return [];
        var crossings = [];
        var layers = diagram._layers;
        if (!layers)
            return [];
        try {
            for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                var layer = layers_1_1.value;
                if (layer.isTemporary)
                    continue;
                var it = layer.parts;
                while (it.next()) {
                    var other = it.value;
                    if (other === link)
                        continue;
                    if (!(other instanceof Link) && other._className !== 'Link')
                        continue;
                    if (!other.visible)
                        continue;
                    var otherPoints = other.points.toArray();
                    if (otherPoints.length < 2)
                        continue;
                    for (var i = 0; i < myPoints.length - 1; i++) {
                        var a1 = myPoints[i];
                        var a2 = myPoints[i + 1];
                        for (var j = 0; j < otherPoints.length - 1; j++) {
                            var b1 = otherPoints[j];
                            var b2 = otherPoints[j + 1];
                            var pt = this._segmentIntersection(a1, a2, b1, b2);
                            if (pt) {
                                var dist = Math.sqrt(Math.pow((pt.x - myPoints[0].x), 2) + Math.pow((pt.y - myPoints[0].y), 2));
                                crossings.push(dist);
                            }
                        }
                    }
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        crossings.sort(function (a, b) { return a - b; });
        return crossings;
    };
    CanvasRenderer.prototype._segmentIntersection = function (p1, p2, p3, p4) {
        var dx1 = p2.x - p1.x;
        var dy1 = p2.y - p1.y;
        var dx2 = p4.x - p3.x;
        var dy2 = p4.y - p3.y;
        var denom = dx1 * dy2 - dy1 * dx2;
        if (Math.abs(denom) < 1e-10)
            return null;
        var t = ((p3.x - p1.x) * dy2 - (p3.y - p1.y) * dx2) / denom;
        var u = ((p3.x - p1.x) * dy1 - (p3.y - p1.y) * dx1) / denom;
        if (t > 0.001 && t < 0.999 && u > 0.001 && u < 0.999) {
            return new Point(p1.x + t * dx1, p1.y + t * dy1);
        }
        return null;
    };
    CanvasRenderer.prototype._drawPathWithJumpOver = function (ctx, arr, crossings, jumpSize) {
        var e_6, _a;
        ctx.beginPath();
        ctx.moveTo(arr[0].x, arr[0].y);
        if (crossings.length === 0) {
            for (var i = 1; i < arr.length; i++) {
                ctx.lineTo(arr[i].x, arr[i].y);
            }
            return;
        }
        var cumDist = 0;
        var halfJump = jumpSize / 2;
        for (var i = 1; i < arr.length; i++) {
            var prev = arr[i - 1];
            var curr = arr[i];
            var segDx = curr.x - prev.x;
            var segDy = curr.y - prev.y;
            var segLen = Math.sqrt(segDx * segDx + segDy * segDy);
            if (segLen === 0)
                continue;
            var ux = segDx / segLen;
            var uy = segDy / segLen;
            var segStart = cumDist;
            var segEnd = cumDist + segLen;
            var pos = segStart;
            try {
                for (var crossings_1 = (e_6 = void 0, __values(crossings)), crossings_1_1 = crossings_1.next(); !crossings_1_1.done; crossings_1_1 = crossings_1.next()) {
                    var crossDist = crossings_1_1.value;
                    if (crossDist <= segStart + halfJump || crossDist >= segEnd - halfJump)
                        continue;
                    var beforeDist = crossDist - segStart - halfJump;
                    if (beforeDist > 0.01) {
                        var t1 = (pos - segStart) / segLen;
                        var t2 = (crossDist - halfJump - segStart) / segLen;
                        ctx.lineTo(prev.x + segDx * t2, prev.y + segDy * t2);
                    }
                    var cx = prev.x + (crossDist - segStart) / segLen * segDx;
                    var cy = prev.y + (crossDist - segStart) / segLen * segDy;
                    var startJumpX = cx - ux * halfJump;
                    var startJumpY = cy - uy * halfJump;
                    var endJumpX = cx + ux * halfJump;
                    var endJumpY = cy + uy * halfJump;
                    var perpX = -uy;
                    var perpY = ux;
                    var radius = halfJump;
                    ctx.arc(cx + perpX * 0, cy + perpY * 0, radius, Math.atan2(-perpX, -perpY) + Math.PI, Math.atan2(-perpX, -perpY), false);
                    pos = crossDist + halfJump;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (crossings_1_1 && !crossings_1_1.done && (_a = crossings_1.return)) _a.call(crossings_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
            if (pos < segEnd - 0.01) {
                ctx.lineTo(curr.x, curr.y);
            }
            cumDist = segEnd;
        }
    };
    CanvasRenderer.prototype._drawPathWithJumpGap = function (ctx, arr, crossings, gapSize) {
        var e_7, _a;
        ctx.beginPath();
        ctx.moveTo(arr[0].x, arr[0].y);
        if (crossings.length === 0) {
            for (var i = 1; i < arr.length; i++) {
                ctx.lineTo(arr[i].x, arr[i].y);
            }
            return;
        }
        var cumDist = 0;
        var halfGap = gapSize / 2;
        for (var i = 1; i < arr.length; i++) {
            var prev = arr[i - 1];
            var curr = arr[i];
            var segDx = curr.x - prev.x;
            var segDy = curr.y - prev.y;
            var segLen = Math.sqrt(segDx * segDx + segDy * segDy);
            if (segLen === 0)
                continue;
            var segStart = cumDist;
            var segEnd = cumDist + segLen;
            var pos = segStart;
            try {
                for (var crossings_2 = (e_7 = void 0, __values(crossings)), crossings_2_1 = crossings_2.next(); !crossings_2_1.done; crossings_2_1 = crossings_2.next()) {
                    var crossDist = crossings_2_1.value;
                    if (crossDist <= segStart + halfGap || crossDist >= segEnd - halfGap)
                        continue;
                    var tGapStart = (crossDist - halfGap - segStart) / segLen;
                    ctx.lineTo(prev.x + segDx * tGapStart, prev.y + segDy * tGapStart);
                    var tGapEnd = (crossDist + halfGap - segStart) / segLen;
                    ctx.moveTo(prev.x + segDx * tGapEnd, prev.y + segDy * tGapEnd);
                    pos = crossDist + halfGap;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (crossings_2_1 && !crossings_2_1.done && (_a = crossings_2.return)) _a.call(crossings_2);
                }
                finally { if (e_7) throw e_7.error; }
            }
            if (pos < segEnd - 0.01) {
                ctx.lineTo(curr.x, curr.y);
            }
            cumDist = segEnd;
        }
    };
    /** Render an arrowhead at the end of a link */
    CanvasRenderer.prototype._renderArrow = function (shape, link) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var points = link.points;
        if (!points || points.count < 2)
            return;
        var arr = points.toArray();
        var isToArrow = !!shape._toArrow;
        var arrowType = isToArrow ? shape._toArrow : shape._fromArrow;
        if (arrowType === 'None')
            return;
        var tipX, tipY, dirX, dirY;
        if (isToArrow) {
            var tip = arr[arr.length - 1];
            var prev = arr[arr.length - 2];
            tipX = tip.x;
            tipY = tip.y;
            dirX = prev.x - tip.x;
            dirY = prev.y - tip.y;
        }
        else {
            var tip = arr[0];
            var next = arr[1];
            tipX = tip.x;
            tipY = tip.y;
            dirX = next.x - tip.x;
            dirY = next.y - tip.y;
        }
        var len = Math.sqrt(dirX * dirX + dirY * dirY);
        if (len === 0)
            return;
        dirX /= len;
        dirY /= len;
        var arrowW = shape.width || 10;
        var arrowH = shape.height || 10;
        var geo = Shape._getArrowheadGeometry(arrowType || 'Standard');
        if (!geo)
            return;
        ctx.save();
        ctx.translate(tipX, tipY);
        var angle = Math.atan2(dirY, dirX);
        ctx.rotate(angle);
        var stroke = shape._stroke;
        var fill = shape._fill;
        var strokeWidth = shape._strokeWidth || 1;
        this._drawGeometryPath(ctx, geo, arrowW, arrowH);
        if (fill) {
            ctx.fillStyle = typeof fill === 'string' ? fill : 'black';
            ctx.fill();
        }
        if (stroke) {
            ctx.strokeStyle = typeof stroke === 'string' ? stroke : 'black';
            ctx.lineWidth = strokeWidth;
            ctx.stroke();
        }
        if (!fill && !stroke) {
            ctx.fillStyle = 'black';
            ctx.fill();
        }
        ctx.restore();
    };
    CanvasRenderer.prototype._renderLinkLabel = function (tb, link) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var ab = tb.actualBounds;
        if (ab.width === 0 && ab.height === 0)
            return;
        var segIdx = tb.segmentIndex;
        var segFrac = tb.segmentFraction;
        var segOff = tb.segmentOffset;
        var segOrient = tb.segmentOrientation;
        var points = link.points;
        if (!points || points.count < 2)
            return;
        var arr = points.toArray();
        var labelX = 0, labelY = 0, angle = 0;
        var si = (segIdx !== undefined && segIdx !== null && !isNaN(segIdx)) ? segIdx : -1;
        var sf = (segFrac !== undefined && segFrac !== null && !isNaN(segFrac)) ? segFrac : 0.5;
        if (si >= 0 && si < arr.length - 1) {
            var a = arr[si];
            var b = arr[si + 1];
            labelX = a.x + (b.x - a.x) * sf;
            labelY = a.y + (b.y - a.y) * sf;
            angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
        }
        else {
            var totalLen = 0;
            var segLens = [];
            for (var i = 0; i < arr.length - 1; i++) {
                var dx = arr[i + 1].x - arr[i].x;
                var dy = arr[i + 1].y - arr[i].y;
                var len = Math.sqrt(dx * dx + dy * dy);
                segLens.push(len);
                totalLen += len;
            }
            var targetDist = totalLen * sf;
            var cumDist = 0;
            for (var i = 0; i < segLens.length; i++) {
                if (cumDist + segLens[i] >= targetDist) {
                    var t = segLens[i] > 0 ? (targetDist - cumDist) / segLens[i] : 0;
                    labelX = arr[i].x + (arr[i + 1].x - arr[i].x) * t;
                    labelY = arr[i].y + (arr[i + 1].y - arr[i].y) * t;
                    angle = Math.atan2(arr[i + 1].y - arr[i].y, arr[i + 1].x - arr[i].x) * 180 / Math.PI;
                    break;
                }
                cumDist += segLens[i];
            }
            if (totalLen === 0) {
                labelX = arr[0].x;
                labelY = arr[0].y;
            }
        }
        var offX = (segOff && typeof segOff.x === 'number' && isFinite(segOff.x)) ? segOff.x : 0;
        var offY = (segOff && typeof segOff.y === 'number' && isFinite(segOff.y)) ? segOff.y : 0;
        labelX += offX;
        labelY += offY;
        var mb = tb.measuredBounds;
        var af = tb.alignmentFocus;
        var alignOffX = af ? af.offsetX - af.x * mb.width : 0;
        var alignOffY = af ? af.offsetY - af.y * mb.height : 0;
        tb._arrange(new Rect(labelX - mb.width / 2 + alignOffX, labelY - mb.height / 2 + alignOffY, mb.width, mb.height));
        ctx.save();
        if (segOrient !== undefined && segOrient !== null && segOrient !== 0) {
            ctx.translate(labelX, labelY);
            ctx.rotate(angle * Math.PI / 180);
            ctx.translate(-labelX, -labelY);
        }
        this.renderTextBlock(tb, 0, 0);
        ctx.restore();
    };
    /** Render any GraphObject by dispatching to the appropriate handler */
    CanvasRenderer.prototype.renderGraphObject = function (obj, offsetX, offsetY) {
        if (!obj.visible)
            return;
        var ctx = this.ctx;
        if (!ctx)
            return;
        // Apply opacity
        if (obj.opacity < 1) {
            ctx.save();
            ctx.globalAlpha *= obj.opacity;
        }
        // Apply angle and scale
        var ab = obj.actualBounds;
        var cx = offsetX + ab.x + ab.width / 2;
        var cy = offsetY + ab.y + ab.height / 2;
        if (obj.angle !== 0 || obj.scale !== 1) {
            ctx.save();
            ctx.translate(cx, cy);
            if (obj.angle !== 0) {
                ctx.rotate(obj.angle * Math.PI / 180);
            }
            if (obj.scale !== 1) {
                ctx.scale(obj.scale, obj.scale);
            }
            ctx.translate(-cx, -cy);
        }
        // Dispatch by type
        if (obj instanceof Shape) {
            this.renderShape(obj, offsetX, offsetY);
        }
        else if (obj instanceof TextBlock) {
            this.renderTextBlock(obj, offsetX, offsetY);
        }
        else if (obj instanceof Picture) {
            this.renderPicture(obj, offsetX, offsetY);
        }
        else if (obj instanceof Panel) {
            this.renderPanel(obj, offsetX, offsetY);
        }
        else ;
        // Restore angle/scale transform
        if (obj.angle !== 0 || obj.scale !== 1) {
            ctx.restore();
        }
        // Restore opacity
        if (obj.opacity < 1) {
            ctx.restore();
        }
    };
    /** Render a Panel and its children */
    CanvasRenderer.prototype.renderPanel = function (panel, offsetX, offsetY) {
        var e_8, _a, e_9, _b, e_10, _c, e_11, _d, e_12, _e, e_13, _f, e_14, _g, e_15, _h, e_16, _j;
        if (!panel.visible)
            return;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var ab = panel.actualBounds;
        var panelX = offsetX + ab.x;
        var panelY = offsetY + ab.y;
        var panelW = ab.width;
        var panelH = ab.height;
        // Render panel background
        if (panel.background) {
            ctx.save();
            ctx.fillStyle = this._applyBrush(ctx, panel.background, new Rect(panelX, panelY, panelW, panelH));
            ctx.fillRect(panelX, panelY, panelW, panelH);
            ctx.restore();
        }
        // Apply clipping if isClipping is true
        if (panel.isClipping) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(panelX, panelY, panelW, panelH);
            ctx.clip();
        }
        var panelType = panel.type;
        // Render grid background for Grid panels
        if (panelType === PanelGrid) {
            this.renderGrid(panel);
        }
        // Render children based on panel type
        if (panelType === PanelAuto) {
            // Auto: render main element first (fills panel), then others on top
            var main = null;
            var others = [];
            var elements = panel._elements;
            try {
                for (var elements_4 = __values(elements), elements_4_1 = elements_4.next(); !elements_4_1.done; elements_4_1 = elements_4.next()) {
                    var elem = elements_4_1.value;
                    if (!elem.visible)
                        continue;
                    if (main === null || elem.isPanelMain) {
                        if (main !== null && !main.isPanelMain)
                            others.push(main);
                        main = elem;
                    }
                    else {
                        others.push(elem);
                    }
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (elements_4_1 && !elements_4_1.done && (_a = elements_4.return)) _a.call(elements_4);
                }
                finally { if (e_8) throw e_8.error; }
            }
            if (main !== null) {
                this.renderGraphObject(main, panelX, panelY);
            }
            try {
                for (var others_1 = __values(others), others_1_1 = others_1.next(); !others_1_1.done; others_1_1 = others_1.next()) {
                    var elem = others_1_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (others_1_1 && !others_1_1.done && (_b = others_1.return)) _b.call(others_1);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        else if (panelType === PanelVertical || panelType === PanelHorizontal) {
            // Vertical/Horizontal: render children in order
            var elements = panel._elements;
            try {
                for (var elements_5 = __values(elements), elements_5_1 = elements_5.next(); !elements_5_1.done; elements_5_1 = elements_5.next()) {
                    var elem = elements_5_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (elements_5_1 && !elements_5_1.done && (_c = elements_5.return)) _c.call(elements_5);
                }
                finally { if (e_10) throw e_10.error; }
            }
        }
        else if (panelType === PanelSpot) {
            // Spot: render children with their alignment positions
            // First element is main, others are positioned by alignment
            var main = null;
            var others = [];
            var elements = panel._elements;
            try {
                for (var elements_6 = __values(elements), elements_6_1 = elements_6.next(); !elements_6_1.done; elements_6_1 = elements_6.next()) {
                    var elem = elements_6_1.value;
                    if (!elem.visible)
                        continue;
                    if (main === null) {
                        main = elem;
                    }
                    else {
                        others.push(elem);
                    }
                }
            }
            catch (e_11_1) { e_11 = { error: e_11_1 }; }
            finally {
                try {
                    if (elements_6_1 && !elements_6_1.done && (_d = elements_6.return)) _d.call(elements_6);
                }
                finally { if (e_11) throw e_11.error; }
            }
            if (main !== null) {
                this.renderGraphObject(main, panelX, panelY);
            }
            try {
                for (var others_2 = __values(others), others_2_1 = others_2.next(); !others_2_1.done; others_2_1 = others_2.next()) {
                    var elem = others_2_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (others_2_1 && !others_2_1.done && (_e = others_2.return)) _e.call(others_2);
                }
                finally { if (e_12) throw e_12.error; }
            }
        }
        else if (panelType === PanelTable) {
            var elements = panel._elements;
            try {
                for (var elements_7 = __values(elements), elements_7_1 = elements_7.next(); !elements_7_1.done; elements_7_1 = elements_7.next()) {
                    var elem = elements_7_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_13_1) { e_13 = { error: e_13_1 }; }
            finally {
                try {
                    if (elements_7_1 && !elements_7_1.done && (_f = elements_7.return)) _f.call(elements_7);
                }
                finally { if (e_13) throw e_13.error; }
            }
            this._renderTableSeparators(panel, panelX, panelY);
        }
        else if (panelType === PanelPosition) {
            var elements = panel._elements;
            try {
                for (var elements_8 = __values(elements), elements_8_1 = elements_8.next(); !elements_8_1.done; elements_8_1 = elements_8.next()) {
                    var elem = elements_8_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_14_1) { e_14 = { error: e_14_1 }; }
            finally {
                try {
                    if (elements_8_1 && !elements_8_1.done && (_g = elements_8.return)) _g.call(elements_8);
                }
                finally { if (e_14) throw e_14.error; }
            }
        }
        else if (panelType === PanelViewbox) {
            this._renderViewbox(panel, panelX, panelY, panelW, panelH);
        }
        else if (panelType === PanelGraduated) {
            this._renderGraduated(panel, panelX, panelY, panelW, panelH);
        }
        else if (panelType === PanelLink) {
            // Link: render children (the link shape and label)
            var elements = panel._elements;
            try {
                for (var elements_9 = __values(elements), elements_9_1 = elements_9.next(); !elements_9_1.done; elements_9_1 = elements_9.next()) {
                    var elem = elements_9_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (elements_9_1 && !elements_9_1.done && (_h = elements_9.return)) _h.call(elements_9);
                }
                finally { if (e_15) throw e_15.error; }
            }
        }
        else {
            // Default: render all children
            var elements = panel._elements;
            try {
                for (var elements_10 = __values(elements), elements_10_1 = elements_10.next(); !elements_10_1.done; elements_10_1 = elements_10.next()) {
                    var elem = elements_10_1.value;
                    this.renderGraphObject(elem, panelX, panelY);
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (elements_10_1 && !elements_10_1.done && (_j = elements_10.return)) _j.call(elements_10);
                }
                finally { if (e_16) throw e_16.error; }
            }
        }
        // Restore clipping
        if (panel.isClipping) {
            ctx.restore();
        }
    };
    /** Render a Shape */
    CanvasRenderer.prototype.renderShape = function (shape, offsetX, offsetY) {
        if (!shape.visible)
            return;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var ab = shape.actualBounds;
        var shapeX = offsetX + ab.x;
        var shapeY = offsetY + ab.y;
        var shapeW = ab.width;
        var shapeH = ab.height;
        // Get geometry
        var geo = shape._getGeometry();
        if (!geo) {
            // No geometry: just fill/stroke a rectangle if fill or stroke is set
            if (shape.fill) {
                ctx.save();
                ctx.fillStyle = this._applyBrush(ctx, shape.fill, new Rect(shapeX, shapeY, shapeW, shapeH));
                ctx.fillRect(shapeX, shapeY, shapeW, shapeH);
                ctx.restore();
            }
            if (shape.stroke && shape.strokeWidth > 0) {
                ctx.save();
                ctx.strokeStyle = this._applyBrush(ctx, shape.stroke, new Rect(shapeX, shapeY, shapeW, shapeH));
                ctx.lineWidth = shape.strokeWidth;
                if (shape.strokeDashArray) {
                    ctx.setLineDash(shape.strokeDashArray);
                }
                ctx.strokeRect(shapeX, shapeY, shapeW, shapeH);
                ctx.restore();
            }
            return;
        }
        // Scale geometry to fit the shape's actual bounds
        var geoBounds = geo.bounds;
        var scaleX = geoBounds.width > 0 ? shapeW / geoBounds.width : 1;
        var scaleY = geoBounds.height > 0 ? shapeH / geoBounds.height : 1;
        ctx.save();
        // Translate to shape position and scale geometry to fit
        ctx.translate(shapeX, shapeY);
        if (scaleX !== 1 || scaleY !== 1) {
            ctx.scale(scaleX, scaleY);
        }
        // Fill
        if (shape.fill) {
            ctx.fillStyle = this._applyBrush(ctx, shape.fill, new Rect(0, 0, geoBounds.width, geoBounds.height));
            this._drawGeometry(ctx, geo);
            ctx.fill();
        }
        // Stroke
        if (shape.stroke && shape.strokeWidth > 0) {
            ctx.strokeStyle = this._applyBrush(ctx, shape.stroke, new Rect(0, 0, geoBounds.width, geoBounds.height));
            ctx.lineWidth = shape.strokeWidth / Math.max(scaleX, scaleY);
            ctx.lineCap = shape.strokeCap;
            ctx.lineJoin = shape.strokeJoin;
            if (shape.strokeDashArray) {
                ctx.setLineDash(shape.strokeDashArray);
            }
            this._drawGeometry(ctx, geo);
            ctx.stroke();
        }
        ctx.restore();
    };
    /** Render a TextBlock */
    CanvasRenderer.prototype.renderTextBlock = function (tb, offsetX, offsetY) {
        if (!tb.visible || !tb.text)
            return;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var ab = tb.actualBounds;
        var tbX = offsetX + ab.x;
        var tbY = offsetY + ab.y;
        var tbW = ab.width;
        var tbH = ab.height;
        ctx.save();
        ctx.font = tb.font;
        ctx.textAlign = tb.textAlign;
        ctx.textBaseline = 'top';
        // Set text color
        if (tb.stroke) {
            ctx.fillStyle = this._applyBrush(ctx, tb.stroke, new Rect(tbX, tbY, tbW, tbH));
        }
        else {
            ctx.fillStyle = 'black';
        }
        // Apply clipping for text overflow
        if (tbW > 0 && tbH > 0) {
            ctx.beginPath();
            ctx.rect(tbX, tbY, tbW, tbH);
            ctx.clip();
        }
        var fontSize = this._getFontSize(tb.font);
        var lineHeight = fontSize * 1.2;
        if (!tb.isMultiline || tb._wrap === StretchNone) {
            // Single line
            ctx.fillText(tb.text, tbX, tbY);
        }
        else {
            // Multiline: split by \n and wrap
            var lines = this._wrapText(ctx, tb.text, tbW > 0 ? tbW : Infinity);
            for (var i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], tbX, tbY + i * lineHeight);
            }
        }
        ctx.restore();
    };
    /** Render a Picture (stub - image loading not yet implemented) */
    CanvasRenderer.prototype.renderPicture = function (pic, offsetX, offsetY) {
        if (!pic.visible)
            return;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var ab = pic.actualBounds;
        var picX = offsetX + ab.x;
        var picY = offsetY + ab.y;
        var picW = ab.width;
        var picH = ab.height;
        var loadedImage = pic._loadedImage;
        if (loadedImage && loadedImage.complete && loadedImage.naturalWidth > 0) {
            var imgW = loadedImage.naturalWidth;
            var imgH = loadedImage.naturalHeight;
            var stretch = pic.imageStretch;
            ctx.save();
            if (stretch === ImageStretchNone) {
                ctx.drawImage(loadedImage, picX, picY, imgW, imgH);
            }
            else if (stretch === ImageStretchFill) {
                ctx.drawImage(loadedImage, picX, picY, picW, picH);
            }
            else if (stretch === ImageStretchUniform) {
                var scaleX = picW / imgW;
                var scaleY = picH / imgH;
                var scale = Math.min(scaleX, scaleY);
                var drawW = imgW * scale;
                var drawH = imgH * scale;
                var drawX = picX + (picW - drawW) / 2;
                var drawY = picY + (picH - drawH) / 2;
                ctx.drawImage(loadedImage, drawX, drawY, drawW, drawH);
            }
            else if (stretch === ImageStretchUniformToFill) {
                var scaleX = picW / imgW;
                var scaleY = picH / imgH;
                var scale = Math.max(scaleX, scaleY);
                var drawW = imgW * scale;
                var drawH = imgH * scale;
                var drawX = picX + (picW - drawW) / 2;
                var drawY = picY + (picH - drawH) / 2;
                ctx.beginPath();
                ctx.rect(picX, picY, picW, picH);
                ctx.clip();
                ctx.drawImage(loadedImage, drawX, drawY, drawW, drawH);
            }
            ctx.restore();
        }
        else {
            ctx.save();
            ctx.strokeStyle = '#ccc';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(picX, picY, picW, picH);
            ctx.beginPath();
            ctx.moveTo(picX, picY);
            ctx.lineTo(picX + picW, picY + picH);
            ctx.moveTo(picX + picW, picY);
            ctx.lineTo(picX, picY + picH);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.restore();
        }
    };
    CanvasRenderer.prototype.renderGrid = function (panel) {
        var e_17, _a;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var ab = panel.actualBounds;
        var cellSize = panel._gridCellSize;
        var gridOrigin = panel._gridOrigin;
        if (!cellSize || cellSize.width <= 0 || cellSize.height <= 0)
            return;
        var part = panel.part;
        if (!part)
            return;
        var docBounds = part.getDocumentBounds();
        var startX = docBounds.x + gridOrigin.x;
        var startY = docBounds.y + gridOrigin.y;
        var diagram = this.diagram;
        var vb = diagram ? diagram.viewportBounds : ab;
        var clipX = vb.x;
        var clipY = vb.y;
        var clipX2 = vb.x + vb.width;
        var clipY2 = vb.y + vb.height;
        var elements = panel._elements;
        if (elements.length === 0) {
            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 0.5;
            for (var x = Math.floor((clipX - startX) / cellSize.width) * cellSize.width + startX; x <= clipX2; x += cellSize.width) {
                ctx.beginPath();
                ctx.moveTo(x, clipY);
                ctx.lineTo(x, clipY2);
                ctx.stroke();
            }
            for (var y = Math.floor((clipY - startY) / cellSize.height) * cellSize.height + startY; y <= clipY2; y += cellSize.height) {
                ctx.beginPath();
                ctx.moveTo(clipX, y);
                ctx.lineTo(clipX2, y);
                ctx.stroke();
            }
            ctx.restore();
            return;
        }
        ctx.save();
        try {
            for (var elements_11 = __values(elements), elements_11_1 = elements_11.next(); !elements_11_1.done; elements_11_1 = elements_11.next()) {
                var elem = elements_11_1.value;
                if (!elem.visible)
                    continue;
                var shape = elem;
                var figure = shape._figure || shape.figure || '';
                var interval = shape._interval || 1;
                var stroke = shape._stroke || shape.stroke || 'rgba(0,0,0,0.1)';
                var strokeWidth = shape._strokeWidth || shape.strokeWidth || 0.5;
                if (stroke === 'transparent' || stroke === 'rgba(0,0,0,0)')
                    continue;
                ctx.strokeStyle = stroke;
                ctx.lineWidth = strokeWidth;
                if (figure === 'LineH' || figure === 'BarH') {
                    var step = cellSize.height * interval;
                    if (step <= 0)
                        continue;
                    var height = shape._height || shape.height || 0;
                    for (var y = Math.floor((clipY - startY) / step) * step + startY; y <= clipY2; y += step) {
                        ctx.beginPath();
                        ctx.moveTo(clipX, y);
                        ctx.lineTo(clipX2, y);
                        ctx.stroke();
                        if (height > 0 && shape._fill) {
                            ctx.fillStyle = shape._fill;
                            ctx.fillRect(clipX, y, clipX2 - clipX, Math.min(height, step));
                        }
                    }
                }
                else if (figure === 'LineV' || figure === 'BarV') {
                    var step = cellSize.width * interval;
                    if (step <= 0)
                        continue;
                    var width = shape._width || shape.width || 0;
                    for (var x = Math.floor((clipX - startX) / step) * step + startX; x <= clipX2; x += step) {
                        ctx.beginPath();
                        ctx.moveTo(x, clipY);
                        ctx.lineTo(x, clipY2);
                        ctx.stroke();
                        if (width > 0 && shape._fill) {
                            ctx.fillStyle = shape._fill;
                            ctx.fillRect(x, clipY, Math.min(width, step), clipY2 - clipY);
                        }
                    }
                }
            }
        }
        catch (e_17_1) { e_17 = { error: e_17_1 }; }
        finally {
            try {
                if (elements_11_1 && !elements_11_1.done && (_a = elements_11.return)) _a.call(elements_11);
            }
            finally { if (e_17) throw e_17.error; }
        }
        ctx.restore();
    };
    /** Render a Viewbox panel - scales its child to fit while maintaining aspect ratio */
    CanvasRenderer.prototype._renderViewbox = function (panel, panelX, panelY, panelW, panelH) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var elements = panel._elements;
        var child = elements.find(function (e) { return e.visible; });
        if (!child)
            return;
        var scaleX = panel._viewboxScaleX;
        var scaleY = panel._viewboxScaleY;
        ctx.save();
        ctx.beginPath();
        ctx.rect(panelX, panelY, panelW, panelH);
        ctx.clip();
        var ab = child.actualBounds;
        var childRenderX = panelX + ab.x;
        var childRenderY = panelY + ab.y;
        ctx.translate(childRenderX, childRenderY);
        ctx.scale(scaleX, scaleY);
        var mb = child.measuredBounds;
        var origBounds = child.actualBounds.copy();
        child._actualBounds = new Rect(0, 0, mb.width, mb.height);
        this.renderGraphObject(child, 0, 0);
        child._actualBounds = origBounds;
        ctx.restore();
    };
    CanvasRenderer.prototype._renderGraduated = function (panel, panelX, panelY, panelW, panelH) {
        var e_18, _a;
        var ctx = this.ctx;
        if (!ctx)
            return;
        var elements = panel._elements;
        var mainElement = this._findGraduatedMain(elements);
        if (!mainElement)
            return;
        this.renderGraphObject(mainElement, panelX, panelY);
        var gradMin = panel._graduatedMin;
        var gradMax = panel._graduatedMax;
        var tickUnit = panel._graduatedTickUnit;
        var tickBase = panel._graduatedTickBase;
        var gradStart = panel._graduatedStart;
        var gradEnd = panel._graduatedEnd;
        panel._padding;
        var range = gradMax - gradMin;
        if (range <= 0 || tickUnit <= 0)
            return;
        var effectiveStart = gradStart;
        var effectiveEnd = gradEnd;
        var mainAb = mainElement.actualBounds;
        var mainX = panelX + mainAb.x;
        var mainY = panelY + mainAb.y;
        var mainW = mainAb.width;
        var mainH = mainAb.height;
        var geo = this._getShapeGeometry(mainElement);
        var pathPoints = geo ? this._computePathPoints(geo, mainW, mainH) : null;
        var templates = elements.filter(function (e) { return e !== mainElement && e.visible; });
        for (var val = gradMin; val <= gradMax + tickUnit * 0.001; val += tickUnit) {
            var fraction = (val - gradMin) / range;
            if (fraction < -1e-3 || fraction > 1.001)
                continue;
            var px = void 0, py = void 0, angle = void 0;
            if (pathPoints && pathPoints.length >= 2) {
                var pathFraction = effectiveStart + fraction * (effectiveEnd - effectiveStart);
                var pt = this._interpolatePath(pathPoints, pathFraction);
                px = mainX + pt.x;
                py = mainY + pt.y;
                angle = pt.angle;
            }
            else {
                var pathFraction = effectiveStart + fraction * (effectiveEnd - effectiveStart);
                px = mainX + pathFraction * mainW;
                py = mainY + mainH / 2;
                angle = 0;
            }
            try {
                for (var templates_1 = (e_18 = void 0, __values(templates)), templates_1_1 = templates_1.next(); !templates_1_1.done; templates_1_1 = templates_1.next()) {
                    var tmpl = templates_1_1.value;
                    var interval = tmpl._interval || 1;
                    var tickIndex = Math.round((val - gradMin) / tickUnit);
                    if (tickIndex % interval !== 0)
                        continue;
                    var focus_1 = tmpl._alignmentFocus || Spot.Default;
                    var mb = tmpl.measuredBounds;
                    var focusX = focus_1.x * mb.width + (focus_1.offsetX || 0);
                    var focusY = focus_1.y * mb.height + (focus_1.offsetY || 0);
                    var segOffset = tmpl._segmentOffset;
                    var offX = 0, offY = 0;
                    if (segOffset && !isNaN(segOffset.x))
                        offX = segOffset.x;
                    if (segOffset && !isNaN(segOffset.y))
                        offY = segOffset.y;
                    var drawX = px - focusX + offX;
                    var drawY = py - focusY + offY;
                    if (tmpl instanceof Shape) {
                        this._renderGraduatedShape(tmpl, drawX, drawY, mb.width, mb.height, angle);
                    }
                    else if (tmpl instanceof TextBlock) {
                        this._renderGraduatedText(tmpl, val, tickBase, drawX, drawY, mb.width, mb.height, angle);
                    }
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (templates_1_1 && !templates_1_1.done && (_a = templates_1.return)) _a.call(templates_1);
                }
                finally { if (e_18) throw e_18.error; }
            }
        }
    };
    CanvasRenderer.prototype._renderGraduatedShape = function (shape, x, y, w, h, angle) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var geo = this._getShapeGeometry(shape);
        if (!geo)
            return;
        ctx.save();
        ctx.translate(x, y);
        var stroke = shape._stroke;
        if (stroke) {
            ctx.strokeStyle = typeof stroke === 'string' ? stroke : 'black';
        }
        var strokeWidth = shape._strokeWidth;
        if (strokeWidth !== undefined) {
            ctx.lineWidth = strokeWidth;
        }
        this._drawGeometryPath(ctx, geo, w, h);
        ctx.stroke();
        ctx.restore();
    };
    CanvasRenderer.prototype._renderGraduatedText = function (textBlock, val, tickBase, x, y, w, h, angle) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        var text = String(Math.round(val + tickBase));
        var font = textBlock._font || '10px sans-serif';
        var stroke = textBlock._stroke || 'black';
        ctx.save();
        ctx.translate(x, y);
        ctx.font = font;
        ctx.fillStyle = typeof stroke === 'string' ? stroke : 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, w / 2, h / 2);
        ctx.restore();
    };
    CanvasRenderer.prototype._getShapeGeometry = function (elem) {
        if (!(elem instanceof Shape))
            return null;
        var shape = elem;
        var geo = shape._geometry;
        if (geo)
            return geo;
        var figName = shape._figure;
        if (figName) {
            var w = shape.desiredSize.width > 0 ? shape.desiredSize.width : shape.measuredBounds.width;
            var h = shape.desiredSize.height > 0 ? shape.desiredSize.height : shape.measuredBounds.height;
            return getFigureGeometry(figName, w, h) || null;
        }
        var geoStr = shape._geometryString;
        if (geoStr) {
            return Geometry.parse(geoStr);
        }
        return null;
    };
    CanvasRenderer.prototype._computePathPoints = function (geo, width, height) {
        var points = [];
        var it = geo.figures.iterator;
        while (it.next()) {
            var fig = it.value;
            var prevX = fig.startX;
            var prevY = fig.startY;
            points.push({ x: prevX, y: prevY, angle: 0 });
            var segIt = fig.segments.iterator;
            while (segIt.next()) {
                var seg = segIt.value;
                var segName = seg.type._name;
                if (segName === 'Close')
                    continue;
                var endX = seg.endX;
                var endY = seg.endY;
                var angle = Math.atan2(endY - prevY, endX - prevX) * 180 / Math.PI;
                points.push({ x: endX, y: endY, angle: angle });
                prevX = endX;
                prevY = endY;
            }
        }
        return points;
    };
    CanvasRenderer.prototype._interpolatePath = function (points, fraction) {
        if (points.length === 0)
            return { x: 0, y: 0, angle: 0 };
        if (points.length === 1)
            return { x: points[0].x, y: points[0].y, angle: 0 };
        var totalLen = 0;
        var segLens = [];
        for (var i = 1; i < points.length; i++) {
            var dx = points[i].x - points[i - 1].x;
            var dy = points[i].y - points[i - 1].y;
            var len = Math.sqrt(dx * dx + dy * dy);
            segLens.push(len);
            totalLen += len;
        }
        if (totalLen === 0)
            return { x: points[0].x, y: points[0].y, angle: 0 };
        var targetLen = fraction * totalLen;
        var accum = 0;
        for (var i = 0; i < segLens.length; i++) {
            if (accum + segLens[i] >= targetLen || i === segLens.length - 1) {
                var segFrac = segLens[i] > 0 ? (targetLen - accum) / segLens[i] : 0;
                var clampedFrac = Math.max(0, Math.min(1, segFrac));
                var x = points[i].x + (points[i + 1].x - points[i].x) * clampedFrac;
                var y = points[i].y + (points[i + 1].y - points[i].y) * clampedFrac;
                var angle = points[i + 1].angle;
                return { x: x, y: y, angle: angle };
            }
            accum += segLens[i];
        }
        return { x: points[points.length - 1].x, y: points[points.length - 1].y, angle: points[points.length - 1].angle };
    };
    CanvasRenderer.prototype._drawGeometryPath = function (ctx, geo, w, h) {
        var it = geo.figures.iterator;
        ctx.beginPath();
        while (it.next()) {
            var fig = it.value;
            ctx.moveTo(fig.startX, fig.startY);
            var segIt = fig.segments.iterator;
            while (segIt.next()) {
                var seg = segIt.value;
                var segName = seg.type._name;
                if (segName === 'Line') {
                    ctx.lineTo(seg.endX, seg.endY);
                }
                else if (segName === 'MoveTo') {
                    ctx.moveTo(seg.endX, seg.endY);
                }
                else if (segName === 'Close') {
                    ctx.closePath();
                }
                else if (segName === 'QuadraticBezier' && !isNaN(seg.x1)) {
                    ctx.quadraticCurveTo(seg.x1, seg.y1, seg.endX, seg.endY);
                }
                else if (segName === 'CubicBezier' && !isNaN(seg.x1) && !isNaN(seg.x2)) {
                    ctx.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY);
                }
                else {
                    ctx.lineTo(seg.endX, seg.endY);
                }
            }
        }
    };
    CanvasRenderer.prototype._findGraduatedMain = function (elements) {
        var e_19, _a, e_20, _b;
        try {
            for (var elements_12 = __values(elements), elements_12_1 = elements_12.next(); !elements_12_1.done; elements_12_1 = elements_12.next()) {
                var elem = elements_12_1.value;
                if (elem.visible && elem.isPanelMain)
                    return elem;
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (elements_12_1 && !elements_12_1.done && (_a = elements_12.return)) _a.call(elements_12);
            }
            finally { if (e_19) throw e_19.error; }
        }
        try {
            for (var elements_13 = __values(elements), elements_13_1 = elements_13.next(); !elements_13_1.done; elements_13_1 = elements_13.next()) {
                var elem = elements_13_1.value;
                if (elem.visible)
                    return elem;
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (elements_13_1 && !elements_13_1.done && (_b = elements_13.return)) _b.call(elements_13);
            }
            finally { if (e_20) throw e_20.error; }
        }
        return null;
    };
    // ============ Internal methods ============
    /** Apply position, scale, angle transforms for a Part */
    CanvasRenderer.prototype._applyTransform = function (part) {
        var ctx = this.ctx;
        if (!ctx)
            return;
        // The part's actualBounds already includes its location position,
        // so we don't need to translate by location again.
        // Only apply angle and scale transforms.
        var angle = part._angle;
        if (angle && angle !== 0) {
            var ab = part.actualBounds;
            var cx = ab.x + ab.width / 2;
            var cy = ab.y + ab.height / 2;
            ctx.translate(cx, cy);
            ctx.rotate(angle * Math.PI / 180);
            ctx.translate(-cx, -cy);
        }
        var partScale = part._scale;
        if (partScale && partScale !== 1) {
            var ab = part.actualBounds;
            var cx = ab.x + ab.width / 2;
            var cy = ab.y + ab.height / 2;
            ctx.translate(cx, cy);
            ctx.scale(partScale, partScale);
            ctx.translate(-cx, -cy);
        }
    };
    /** Restore canvas state after part transform */
    CanvasRenderer.prototype._restoreTransform = function () {
        var ctx = this.ctx;
        if (!ctx)
            return;
        ctx.restore();
    };
    /** Trace a geometry path on the canvas context */
    CanvasRenderer.prototype._drawGeometry = function (ctx, geo) {
        ctx.beginPath();
        var it = geo.figures.iterator;
        while (it.next()) {
            var fig = it.value;
            var curX = fig.startX;
            var curY = fig.startY;
            ctx.moveTo(fig.startX, fig.startY);
            var segIt = fig.segments.iterator;
            while (segIt.next()) {
                var seg = segIt.value;
                switch (seg.type._name) {
                    case 'Line':
                        ctx.lineTo(seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'QuadraticBezier':
                        ctx.quadraticCurveTo(seg.x1, seg.y1, seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'CubicBezier':
                        ctx.bezierCurveTo(seg.x1, seg.y1, seg.x2, seg.y2, seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'Arc':
                        this._drawArcSegment(ctx, curX, curY, seg);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'MoveTo':
                        ctx.moveTo(seg.endX, seg.endY);
                        curX = seg.endX;
                        curY = seg.endY;
                        break;
                    case 'Close':
                        ctx.closePath();
                        curX = fig.startX;
                        curY = fig.startY;
                        break;
                }
            }
        }
    };
    /** Draw an arc segment from current point using SVG arc parameterization */
    CanvasRenderer.prototype._drawArcSegment = function (ctx, curX, curY, seg) {
        var rx = seg.radiusX;
        var ry = seg.radiusY;
        var endX = seg.endX;
        var endY = seg.endY;
        if (rx <= 0 || ry <= 0) {
            ctx.lineTo(endX, endY);
            return;
        }
        var rotation = (seg.xAxisRotation || 0) * Math.PI / 180;
        var largeArc = !!seg.largeArc;
        var sweep = !!seg.clockwise;
        var cosR = Math.cos(rotation);
        var sinR = Math.sin(rotation);
        var dx = (curX - endX) / 2;
        var dy = (curY - endY) / 2;
        var x1p = cosR * dx + sinR * dy;
        var y1p = -sinR * dx + cosR * dy;
        var x1p2 = x1p * x1p;
        var y1p2 = y1p * y1p;
        var rx2 = rx * rx;
        var ry2 = ry * ry;
        var lambda = x1p2 / rx2 + y1p2 / ry2;
        var rxS = rx;
        var ryS = ry;
        if (lambda > 1) {
            var sqrtL = Math.sqrt(lambda);
            rxS = rx * sqrtL;
            ryS = ry * sqrtL;
        }
        var rxS2 = rxS * rxS;
        var ryS2 = ryS * ryS;
        var num = rxS2 * ryS2 - rxS2 * y1p2 - ryS2 * x1p2;
        var den = rxS2 * y1p2 + ryS2 * x1p2;
        var sq = Math.max(0, num / den);
        sq = Math.sqrt(sq);
        if (largeArc === sweep)
            sq = -sq;
        var cxp = sq * rxS * y1p / ryS;
        var cyp = -sq * ryS * x1p / rxS;
        var cx = cosR * cxp - sinR * cyp + (curX + endX) / 2;
        var cy = sinR * cxp + cosR * cyp + (curY + endY) / 2;
        var ux = (x1p - cxp) / rxS;
        var uy = (y1p - cyp) / ryS;
        var vx = (-x1p - cxp) / rxS;
        var vy = (-y1p - cyp) / ryS;
        var startAngle = Math.atan2(uy, ux);
        var endAngle = Math.atan2(vy, vx);
        var sweepAngle = endAngle - startAngle;
        if (sweep && sweepAngle < 0) {
            sweepAngle += 2 * Math.PI;
        }
        else if (!sweep && sweepAngle > 0) {
            sweepAngle -= 2 * Math.PI;
        }
        if (typeof ctx.ellipse === 'function') {
            ctx.ellipse(cx, cy, rxS, ryS, rotation, startAngle, startAngle + sweepAngle, !sweep);
        }
        else {
            var steps = Math.max(8, Math.ceil(Math.abs(sweepAngle) * 8 / Math.PI));
            for (var i = 1; i <= steps; i++) {
                var t = i / steps;
                var angle = startAngle + t * sweepAngle;
                var px = cx + rxS * Math.cos(angle) * cosR - ryS * Math.sin(angle) * sinR;
                var py = cy + rxS * Math.cos(angle) * sinR + ryS * Math.sin(angle) * cosR;
                ctx.lineTo(px, py);
            }
        }
    };
    /** Resolve a BrushLike to a fill style string or CanvasGradient */
    CanvasRenderer.prototype._applyBrush = function (ctx, brush, bounds) {
        var e_21, _a, e_22, _b;
        if (!brush) {
            return 'transparent';
        }
        if (typeof brush === 'string') {
            return brush;
        }
        if (Brush.isBrush(brush)) {
            if (brush.type === BrushSolid) {
                return brush.color || 'black';
            }
            if (brush.type === BrushLinear) {
                var x1 = bounds.x + brush.start.x * bounds.width;
                var y1 = bounds.y + brush.start.y * bounds.height;
                var x2 = bounds.x + brush.end.x * bounds.width;
                var y2 = bounds.y + brush.end.y * bounds.height;
                var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                try {
                    for (var _c = __values(brush.stops), _d = _c.next(); !_d.done; _d = _c.next()) {
                        var stop_1 = _d.value;
                        gradient.addColorStop(stop_1.offset, stop_1.color);
                    }
                }
                catch (e_21_1) { e_21 = { error: e_21_1 }; }
                finally {
                    try {
                        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                    }
                    finally { if (e_21) throw e_21.error; }
                }
                return gradient;
            }
            if (brush.type === BrushRadial) {
                var cx = bounds.x + brush.center.x * bounds.width;
                var cy = bounds.y + brush.center.y * bounds.height;
                var r = brush.radius * Math.max(bounds.width, bounds.height);
                var fx = bounds.x + brush.focus.x * bounds.width;
                var fy = bounds.y + brush.focus.y * bounds.height;
                var gradient = ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
                try {
                    for (var _e = __values(brush.stops), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var stop_2 = _f.value;
                        gradient.addColorStop(stop_2.offset, stop_2.color);
                    }
                }
                catch (e_22_1) { e_22 = { error: e_22_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_22) throw e_22.error; }
                }
                return gradient;
            }
        }
        return 'black';
    };
    // ============ Text helpers ============
    /** Extract font size from a CSS font string */
    CanvasRenderer.prototype._getFontSize = function (font) {
        var match = font.match(/(\d+(?:\.\d+)?)px/);
        if (match) {
            return parseFloat(match[1]);
        }
        return 10;
    };
    /** Wrap text into lines respecting maxWidth */
    CanvasRenderer.prototype._wrapText = function (ctx, text, maxWidth) {
        var e_23, _a, e_24, _b;
        var lines = [];
        var paragraphs = text.split('\n');
        try {
            for (var paragraphs_1 = __values(paragraphs), paragraphs_1_1 = paragraphs_1.next(); !paragraphs_1_1.done; paragraphs_1_1 = paragraphs_1.next()) {
                var paragraph = paragraphs_1_1.value;
                if (paragraph === '') {
                    lines.push('');
                    continue;
                }
                var words = paragraph.split(/(\s+)/);
                var currentLine = '';
                try {
                    for (var words_1 = (e_24 = void 0, __values(words)), words_1_1 = words_1.next(); !words_1_1.done; words_1_1 = words_1.next()) {
                        var word = words_1_1.value;
                        var testLine = currentLine + word;
                        var metrics = ctx.measureText(testLine);
                        if (metrics.width > maxWidth && currentLine !== '') {
                            lines.push(currentLine.replace(/\s+$/, ''));
                            currentLine = word;
                        }
                        else {
                            currentLine = testLine;
                        }
                    }
                }
                catch (e_24_1) { e_24 = { error: e_24_1 }; }
                finally {
                    try {
                        if (words_1_1 && !words_1_1.done && (_b = words_1.return)) _b.call(words_1);
                    }
                    finally { if (e_24) throw e_24.error; }
                }
                if (currentLine) {
                    lines.push(currentLine.replace(/\s+$/, ''));
                }
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (paragraphs_1_1 && !paragraphs_1_1.done && (_a = paragraphs_1.return)) _a.call(paragraphs_1);
            }
            finally { if (e_23) throw e_23.error; }
        }
        return lines.length > 0 ? lines : [''];
    };
    // ============ Viewport helpers ============
    /** Update viewportBounds from current canvas size, scale, and position */
    CanvasRenderer.prototype._updateViewportBounds = function () {
        if (!this.canvas)
            return;
        var dpr = window.devicePixelRatio || 1;
        var viewWidth = this.canvas.width / dpr / this.scale;
        var viewHeight = this.canvas.height / dpr / this.scale;
        this.viewportBounds = new Rect(this.position.x, this.position.y, viewWidth, viewHeight);
    };
    /** Convert a point from document coordinates to view (canvas pixel) coordinates */
    CanvasRenderer.prototype.documentToView = function (p) {
        return new Point((p.x - this.position.x) * this.scale, (p.y - this.position.y) * this.scale);
    };
    /** Convert a point from view (canvas pixel) coordinates to document coordinates */
    CanvasRenderer.prototype.viewToDocument = function (p) {
        return new Point(p.x / this.scale + this.position.x, p.y / this.scale + this.position.y);
    };
    /** Check if a rectangle in document coordinates is within the viewport */
    CanvasRenderer.prototype.isInViewport = function (r) {
        return this.viewportBounds.intersects(r);
    };
    return CanvasRenderer;
}());

/**
 * Tool - base class for all interactive tools in the diagram.
 * Provides virtual methods for mouse/keyboard/touch event handling,
 * transaction management, and standard interaction patterns.
 */
var Tool = /** @class */ (function () {
    function Tool() {
        this._diagram = null;
        this._isActive = false;
        this._isEnabled = true;
        this._name = '';
        this._transactionResult = null;
    }
    Object.defineProperty(Tool.prototype, "diagram", {
        // ============ Properties ============
        get: function () { return this._diagram; },
        set: function (val) { this._diagram = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tool.prototype, "isActive", {
        get: function () { return this._isActive; },
        set: function (val) { this._isActive = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tool.prototype, "isEnabled", {
        get: function () { return this._isEnabled; },
        set: function (val) { this._isEnabled = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tool.prototype, "name", {
        get: function () { return this._name; },
        set: function (val) { this._name = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tool.prototype, "transactionResult", {
        get: function () { return this._transactionResult; },
        set: function (val) { this._transactionResult = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Virtual Methods ============
    /** Whether this tool can start operating at the current input event. */
    Tool.prototype.canStart = function () {
        return false;
    };
    /** Called when this tool becomes the current tool. */
    Tool.prototype.doActivate = function () { };
    /** Cancel the tool's operation. */
    Tool.prototype.doCancel = function () {
        this.doDeactivate();
    };
    /** Called when this tool is no longer the current tool. */
    Tool.prototype.doDeactivate = function () {
        this._isActive = false;
    };
    /** Handle key-down events. */
    Tool.prototype.doKeyDown = function () { };
    /** Handle key-up events. */
    Tool.prototype.doKeyUp = function () { };
    /** Handle mouse-down events. */
    Tool.prototype.doMouseDown = function () { };
    /** Handle mouse-move events. */
    Tool.prototype.doMouseMove = function () { };
    /** Handle mouse-up events. */
    Tool.prototype.doMouseUp = function () { };
    /** Handle mouse-wheel events. */
    Tool.prototype.doMouseWheel = function () { };
    /** Called when this tool first starts. */
    Tool.prototype.doStart = function () { };
    /** Called when this tool stops. */
    Tool.prototype.doStop = function () { };
    /** Wait after a period of inactivity (e.g. for hover). */
    Tool.prototype.doWaitAfter = function () { };
    /** Whether multi-touch gestures can start this tool. */
    Tool.prototype.canStartMultiTouch = function () {
        return false;
    };
    /** Cancel any pending wait-after timer. */
    Tool.prototype.cancelWaitAfter = function () { };
    /** Find a tool handle at the given document point. */
    Tool.prototype.findToolHandleAt = function (p) {
        var diagram = this._diagram;
        if (!diagram)
            return null;
        var adornmentLayer = diagram.findLayer('Adornment');
        if (!adornmentLayer)
            return null;
        var toolName = this._name;
        var partsIt = adornmentLayer.parts;
        var partsArray = partsIt.toArray();
        for (var i = partsArray.length - 1; i >= 0; i--) {
            var ad = partsArray[i];
            if (!ad.visible)
                continue;
            var cat = ad.category;
            if (cat && cat !== toolName)
                continue;
            var adornedPart = ad.adornedPart;
            if (!adornedPart)
                continue;
            var adornedBounds = adornedPart.getDocumentBounds();
            var localX = p.x - adornedBounds.x;
            var localY = p.y - adornedBounds.y;
            var found = this._findHandleInPanel(ad, localX, localY);
            if (found)
                return found;
        }
        return null;
    };
    Tool.prototype._findHandleInPanel = function (panel, x, y) {
        var elements = panel._elements;
        if (!elements)
            return null;
        for (var i = elements.length - 1; i >= 0; i--) {
            var elem = elements[i];
            if (!elem.visible)
                continue;
            var bounds = elem.actualBounds;
            if (bounds.containsPoint(new Point(x, y))) {
                if (elem._elements && elem._elements.length > 0) {
                    var inner = this._findHandleInPanel(elem, x - bounds.x, y - bounds.y);
                    if (inner)
                        return inner;
                }
                return elem;
            }
        }
        return null;
    };
    /** Whether the distance between two points exceeds the drag threshold. */
    Tool.prototype.isBeyondDragSize = function (first, second) {
        var dx = Math.abs(first.x - second.x);
        var dy = Math.abs(first.y - second.y);
        return dx > 2 || dy > 2;
    };
    /** Standard mouse click behavior: select and raise click event. */
    Tool.prototype.standardMouseClick = function () { };
    /** Standard mouse select behavior: select parts on click. */
    Tool.prototype.standardMouseSelect = function () { };
    /** Standard mouse wheel behavior: zoom in/out. */
    Tool.prototype.standardMouseWheel = function () { };
    /** Standard pinch zoom start for multi-touch. */
    Tool.prototype.standardPinchZoomStart = function () { };
    /** Standard pinch zoom move for multi-touch. */
    Tool.prototype.standardPinchZoomMove = function () { };
    /** Standard wait-after behavior: schedule a timer. */
    Tool.prototype.standardWaitAfter = function (delay) { };
    // ============ Transaction Methods ============
    /** Start a new transaction. */
    Tool.prototype.startTransaction = function (tname) {
        if (this._diagram) {
            return this._diagram.startTransaction(tname || this._name);
        }
        return false;
    };
    /** Stop this tool and remove it from the ToolManager. */
    Tool.prototype.stopTool = function () {
        this.doStop();
        if (this._diagram) {
            var tm = this._diagram.toolManager;
            if (tm) {
                tm.currentTool = tm.defaultTool;
            }
        }
    };
    /** Stop the current transaction. */
    Tool.prototype.stopTransaction = function () {
        if (this._diagram) {
            var result = this._transactionResult;
            if (result !== null) {
                return this._diagram.commitTransaction(this._name);
            }
            else {
                return this._diagram.rollbackTransaction();
            }
        }
        return false;
    };
    /** Update adornments for relevant parts. */
    Tool.prototype.updateAdornments = function (part) { };
    return Tool;
}());

/**
 * InputEvent - 输入事件
 * 封装鼠标/键盘/触摸事件信息
 */
var InputEvent = /** @class */ (function () {
    function InputEvent() {
        this.eventType = '';
        this.documentPoint = { x: 0, y: 0 };
        this.viewPoint = { x: 0, y: 0 };
        this.alt = false;
        this.control = false;
        this.shift = false;
        this.meta = false;
        this.button = 0;
        this.key = '';
        this.handled = false;
        this.nativeEvent = null;
        this.timestamp = 0;
        this.isContextMenu = false;
        this.clickCount = 1;
        this.delta = 0;
    }
    Object.defineProperty(InputEvent.prototype, "leftButton", {
        get: function () { return this.button === 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputEvent.prototype, "middleButton", {
        get: function () { return this.button === 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InputEvent.prototype, "rightButton", {
        get: function () { return this.button === 2; },
        enumerable: false,
        configurable: true
    });
    /** 从鼠标事件初始化 */
    InputEvent.fromMouseEvent = function (e, diagram) {
        var ie = new InputEvent();
        ie.nativeEvent = e;
        ie.alt = e.altKey;
        ie.control = e.ctrlKey;
        ie.shift = e.shiftKey;
        ie.meta = e.metaKey;
        ie.button = e.button;
        ie.timestamp = e.timeStamp;
        ie.clickCount = e.detail || 1;
        ie.viewPoint = { x: e.offsetX, y: e.offsetY };
        // 文档坐标需要通过 diagram 转换
        if (diagram) {
            var dp = diagram.transformViewToDoc({ x: e.offsetX, y: e.offsetY });
            ie.documentPoint = { x: dp.x, y: dp.y };
        }
        return ie;
    };
    /** 从键盘事件初始化 */
    InputEvent.fromKeyboardEvent = function (e) {
        var ie = new InputEvent();
        ie.nativeEvent = e;
        ie.alt = e.altKey;
        ie.control = e.ctrlKey;
        ie.shift = e.shiftKey;
        ie.meta = e.metaKey;
        ie.key = e.key;
        ie.timestamp = e.timeStamp;
        return ie;
    };
    InputEvent.prototype.copy = function () {
        var ie = new InputEvent();
        ie.eventType = this.eventType;
        ie.documentPoint = __assign({}, this.documentPoint);
        ie.viewPoint = __assign({}, this.viewPoint);
        ie.alt = this.alt;
        ie.control = this.control;
        ie.shift = this.shift;
        ie.meta = this.meta;
        ie.button = this.button;
        ie.key = this.key;
        ie.handled = this.handled;
        ie.timestamp = this.timestamp;
        ie.isContextMenu = this.isContextMenu;
        ie.clickCount = this.clickCount;
        ie.delta = this.delta;
        return ie;
    };
    return InputEvent;
}());

var ClickSelectingTool = /** @class */ (function (_super) {
    __extends(ClickSelectingTool, _super);
    function ClickSelectingTool() {
        var _this = _super.call(this) || this;
        _this._lastClickTime = 0;
        _this._lastClickObj = null;
        _this.name = 'ClickSelecting';
        return _this;
    }
    ClickSelectingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowSelect)
            return false;
        return true;
    };
    ClickSelectingTool.prototype.doMouseUp = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var now = Date.now();
        var docPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(docPoint);
        var part = diagram.findPartAt(docPoint, true);
        var isDoubleClick = obj && obj === this._lastClickObj && (now - this._lastClickTime) < 500;
        if (lastInput.rightButton) {
            this._handleContextClick(diagram, obj, part, lastInput);
        }
        else if (isDoubleClick) {
            this._handleDoubleClick(diagram, obj, part, lastInput);
        }
        else {
            this._handleSingleClick(diagram, obj, part, lastInput);
        }
        this._lastClickTime = now;
        this._lastClickObj = obj;
        this.stopTool();
    };
    ClickSelectingTool.prototype._handleSingleClick = function (diagram, obj, part, lastInput) {
        this.standardMouseSelect();
        if (obj && obj.click) {
            obj.click(lastInput, obj);
        }
        if (part) {
            diagram.raiseDiagramEvent('ObjectSingleClicked', part);
        }
        else {
            diagram.raiseDiagramEvent('BackgroundSingleClicked', diagram);
        }
    };
    ClickSelectingTool.prototype._handleDoubleClick = function (diagram, obj, part, lastInput) {
        if (obj && obj.doubleClick) {
            obj.doubleClick(lastInput, obj);
        }
        if (part) {
            diagram.raiseDiagramEvent('ObjectDoubleClicked', part);
        }
        else {
            diagram.raiseDiagramEvent('BackgroundDoubleClicked', diagram);
        }
        this._lastClickTime = 0;
        this._lastClickObj = null;
    };
    ClickSelectingTool.prototype._handleContextClick = function (diagram, obj, part, lastInput) {
        if (obj && obj.contextClick) {
            obj.contextClick(lastInput, obj);
        }
        if (part) {
            diagram.raiseDiagramEvent('ObjectContextClicked', part);
        }
        else {
            diagram.raiseDiagramEvent('BackgroundContextClicked', diagram);
        }
    };
    ClickSelectingTool.prototype.standardMouseSelect = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var docPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var part = diagram.findPartAt(docPoint, true);
        if (part) {
            if (lastInput.control || lastInput.meta) {
                if (part.isSelected) {
                    diagram.selection.remove(part);
                    part.isSelected = false;
                }
                else {
                    part.isSelected = true;
                    diagram.selection.add(part);
                }
            }
            else {
                if (!part.isSelected) {
                    diagram.clearSelection();
                    part.isSelected = true;
                    diagram.selection.add(part);
                }
            }
        }
        else {
            diagram.clearSelection();
        }
        diagram.raiseDiagramEvent('ChangedSelection', diagram.selection);
        diagram.requestUpdate();
    };
    return ClickSelectingTool;
}(Tool));

var DraggingTool = /** @class */ (function (_super) {
    __extends(DraggingTool, _super);
    function DraggingTool() {
        var _this = _super.call(this) || this;
        _this._isCopy = false;
        _this._isCopyEnabled = true;
        _this._startPoint = null;
        _this._draggedParts = null;
        _this._copiedParts = null;
        _this.name = 'Dragging';
        return _this;
    }
    Object.defineProperty(DraggingTool.prototype, "isCopy", {
        get: function () { return this._isCopy; },
        set: function (val) { this._isCopy = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DraggingTool.prototype, "isCopyEnabled", {
        get: function () { return this._isCopyEnabled; },
        set: function (val) { this._isCopyEnabled = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DraggingTool.prototype, "copiedParts", {
        get: function () { return this._copiedParts; },
        set: function (val) { this._copiedParts = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DraggingTool.prototype, "draggedParts", {
        get: function () { return this._draggedParts; },
        set: function (val) { this._draggedParts = val; },
        enumerable: false,
        configurable: true
    });
    DraggingTool.prototype.mayCopy = function () {
        var diagram = this.diagram;
        if (!diagram)
            return false;
        if (!this._isCopyEnabled)
            return false;
        if (!diagram.allowCopy)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        return lastInput.control || lastInput.meta;
    };
    DraggingTool.prototype.mayMove = function () {
        var diagram = this.diagram;
        if (!diagram)
            return false;
        if (!diagram.allowMove)
            return false;
        return true;
    };
    DraggingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowMove && !diagram.allowCopy)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var part = diagram.findPartAt(new Point(lastInput.documentPoint.x, lastInput.documentPoint.y), true);
        if (!part)
            return false;
        if (!part.movable && !part.copyable)
            return false;
        return true;
    };
    DraggingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this._draggedParts = new Map$1();
        var selection = diagram.selection;
        if (selection) {
            var selectedSet = new Set();
            var it0 = selection.iterator;
            while (it0.next()) {
                selectedSet.add(it0.value);
            }
            var it = selection.iterator;
            while (it.next()) {
                var part = it.value;
                if (!part.movable && !part.copyable)
                    continue;
                var cg = part.containingGroup;
                var skip = false;
                while (cg) {
                    if (selectedSet.contains(cg)) {
                        skip = true;
                        break;
                    }
                    cg = cg.containingGroup;
                }
                if (skip)
                    continue;
                this._draggedParts.add(part, part.location.copy());
            }
        }
        this._isCopy = false;
        this._copiedParts = null;
        this.startTransaction(this.name);
    };
    DraggingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive || !this._startPoint)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var wasCopy = this._isCopy;
        this._isCopy = this.mayCopy();
        if (this._isCopy && !wasCopy) {
            this._copyParts();
        }
        else if (!this._isCopy && wasCopy) {
            this._removeCopiedParts();
        }
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        if (this._isCopy && this._copiedParts) {
            var it = this._copiedParts.iterator;
            while (it.next()) {
                var part = it.key;
                var origLoc = it.value;
                var dx = point.x - this._startPoint.x;
                var dy = point.y - this._startPoint.y;
                part.move(new Point(origLoc.x + dx, origLoc.y + dy));
            }
        }
        else if (this._draggedParts) {
            var it = this._draggedParts.iterator;
            while (it.next()) {
                var part = it.key;
                var origLoc = it.value;
                var dx = point.x - this._startPoint.x;
                var dy = point.y - this._startPoint.y;
                var newLoc = this.computeMove(part, new Point(origLoc.x + dx, origLoc.y + dy));
                part.move(newLoc);
            }
        }
        diagram.requestUpdate();
    };
    DraggingTool.prototype.doMouseUp = function () {
        if (!this.isActive)
            return;
        if (this._isCopy && this._copiedParts) {
            this._copiedParts = null;
        }
        this.transactionResult = this._isCopy ? 'Copy' : this.name;
        this.stopTool();
        var diagram = this.diagram;
        if (diagram) {
            diagram.raiseDiagramEvent(this._isCopy ? 'SelectionCopied' : 'SelectionMoved');
        }
    };
    DraggingTool.prototype.doDeactivate = function () {
        this._startPoint = null;
        this._draggedParts = null;
        this._copiedParts = null;
        this._isCopy = false;
        _super.prototype.doDeactivate.call(this);
    };
    DraggingTool.prototype.doCancel = function () {
        if (this._copiedParts) {
            var diagram = this.diagram;
            if (diagram) {
                var it = this._copiedParts.iterator;
                while (it.next()) {
                    diagram.remove(it.key);
                }
            }
            this._copiedParts = null;
        }
        if (this._draggedParts) {
            var it = this._draggedParts.iterator;
            while (it.next()) {
                it.key.location = it.value.copy();
            }
        }
        this._isCopy = false;
        _super.prototype.doCancel.call(this);
    };
    DraggingTool.prototype.computeMove = function (part, newLoc) {
        if (part.dragComputation) {
            return part.dragComputation(part, newLoc, newLoc);
        }
        return newLoc;
    };
    DraggingTool.prototype._copyParts = function () {
        var diagram = this.diagram;
        if (!diagram || !this._draggedParts)
            return;
        this._copiedParts = new Map$1();
        var copiedList = new List();
        var it = this._draggedParts.iterator;
        while (it.next()) {
            var part = it.key;
            if (!part.copyable)
                continue;
            if (part.data) {
                var model = diagram.model;
                var dataCopy = model.cloneDeep(part.data);
                model.addNodeData(dataCopy);
                var newPart = diagram.findNodeForKey(model.getKeyForNodeData(dataCopy));
                if (newPart) {
                    newPart.location = part.location.copy();
                    this._copiedParts.add(newPart, part.location.copy());
                    copiedList.add(newPart);
                }
            }
            else {
                var copy = part.copy();
                copy.location = part.location.copy();
                diagram.add(copy);
                this._copiedParts.add(copy, part.location.copy());
                copiedList.add(copy);
            }
        }
        diagram.selectCollection(copiedList);
    };
    DraggingTool.prototype._removeCopiedParts = function () {
        var diagram = this.diagram;
        if (!diagram || !this._copiedParts)
            return;
        var it = this._copiedParts.iterator;
        while (it.next()) {
            diagram.remove(it.key);
        }
        this._copiedParts = null;
    };
    return DraggingTool;
}(Tool));

/**
 * DragSelectingTool - box (rubber-band) selection tool.
 * Allows the user to draw a rectangle to select multiple parts.
 */
var DragSelectingTool = /** @class */ (function (_super) {
    __extends(DragSelectingTool, _super);
    function DragSelectingTool() {
        var _this = _super.call(this) || this;
        _this._box = null;
        _this._startPoint = null;
        _this.name = 'DragSelecting';
        return _this;
    }
    Object.defineProperty(DragSelectingTool.prototype, "box", {
        // ============ Properties ============
        get: function () { return this._box; },
        set: function (val) { this._box = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Can start if the user clicks in the background (no part). */
    DragSelectingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowSelect)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        // Only start if clicking on the background
        var part = diagram.findPartAt(new Point(lastInput.documentPoint.x, lastInput.documentPoint.y), true);
        return part === null;
    };
    /** Activate and start the box selection. */
    DragSelectingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this._box = new Rect(this._startPoint.x, this._startPoint.y, 0, 0);
        this.startTransaction(this.name);
    };
    /** Update the selection box on mouse move. */
    DragSelectingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput || !this._startPoint)
            return;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var x = Math.min(this._startPoint.x, point.x);
        var y = Math.min(this._startPoint.y, point.y);
        var w = Math.abs(point.x - this._startPoint.x);
        var h = Math.abs(point.y - this._startPoint.y);
        this._box = new Rect(x, y, w, h);
        diagram.requestUpdate();
    };
    /** Finalize the selection on mouse up. */
    DragSelectingTool.prototype.doMouseUp = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        if (this._box && !this._box.isEmpty) {
            this.selectInRect(this._box);
        }
        this.transactionResult = this.name;
        this.stopTransaction();
        this.stopTool();
    };
    /** Clean up on deactivate. */
    DragSelectingTool.prototype.doDeactivate = function () {
        this._box = null;
        this._startPoint = null;
        _super.prototype.doDeactivate.call(this);
    };
    /** Select all parts within the given rectangle. */
    DragSelectingTool.prototype.selectInRect = function (r) {
        var e_1, _a;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var selection = diagram.selection;
        if (!selection)
            return;
        var lastInput = diagram.lastInput;
        var toggle = lastInput && (lastInput.control || lastInput.shift);
        if (!toggle) {
            diagram.clearSelection();
        }
        // Iterate over all parts and select those within the rect
        var layers = diagram._layers;
        if (layers) {
            try {
                for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                    var layer = layers_1_1.value;
                    if (layer.isTemporary)
                        continue;
                    var partsIt = layer.parts;
                    while (partsIt.next()) {
                        var part = partsIt.value;
                        if (!part.selectable || !part.visible)
                            continue;
                        var bounds = part.getDocumentBounds();
                        if (r.intersects(bounds)) {
                            part.isSelected = true;
                            selection.add(part);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    return DragSelectingTool;
}(Tool));

/**
 * LinkingBaseTool - base class for LinkingTool and RelinkingTool.
 * Provides shared logic for finding valid ports, validating links,
 * and creating temporary link visuals.
 */
var LinkingBaseTool = /** @class */ (function (_super) {
    __extends(LinkingBaseTool, _super);
    function LinkingBaseTool() {
        var _this = _super.call(this) || this;
        _this._portProperty = 'portId';
        _this._targetPort = null;
        _this._isForwardsOnly = false;
        _this._isBackwardsOnly = false;
        _this._linkValidation = null;
        _this._portValidation = null;
        _this._temporaryLink = null;
        _this._temporaryFromPort = null;
        _this._temporaryToPort = null;
        var tempLink = new Link();
        var tempShape = new Shape();
        tempShape.stroke = 'gray';
        tempLink.add(tempShape);
        _this._temporaryLink = tempLink;
        return _this;
    }
    Object.defineProperty(LinkingBaseTool.prototype, "portProperty", {
        // ============ Properties ============
        get: function () { return this._portProperty; },
        set: function (val) { this._portProperty = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "targetPort", {
        get: function () { return this._targetPort; },
        set: function (val) { this._targetPort = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "isForwardsOnly", {
        get: function () { return this._isForwardsOnly; },
        set: function (val) { this._isForwardsOnly = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "isBackwardsOnly", {
        get: function () { return this._isBackwardsOnly; },
        set: function (val) { this._isBackwardsOnly = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "linkValidation", {
        get: function () {
            return this._linkValidation;
        },
        set: function (val) {
            this._linkValidation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "portValidation", {
        get: function () {
            return this._portValidation;
        },
        set: function (val) {
            this._portValidation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "temporaryLink", {
        get: function () { return this._temporaryLink; },
        set: function (val) { this._temporaryLink = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "temporaryFromPort", {
        get: function () { return this._temporaryFromPort; },
        set: function (val) { this._temporaryFromPort = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkingBaseTool.prototype, "temporaryToPort", {
        get: function () { return this._temporaryToPort; },
        set: function (val) { this._temporaryToPort = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Find a target port at the current mouse point. */
    LinkingBaseTool.prototype.findTargetPort = function () {
        var diagram = this.diagram;
        if (!diagram)
            return null;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return null;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        if (obj) {
            if (obj.portId !== undefined && obj.portId !== null) {
                return obj;
            }
        }
        var node = diagram.findNodeAt(point);
        if (node)
            return node;
        return null;
    };
    /** Check whether a link from fromPort to toPort is valid. */
    LinkingBaseTool.prototype.isValidLink = function (fromNode, fromPort, toNode, toPort) {
        if (!fromNode || !toNode)
            return false;
        if (fromNode === toNode) {
            if (!fromPort.fromLinkableSelfNode || !toPort.toLinkableSelfNode)
                return false;
        }
        if (this._isForwardsOnly && fromNode === toNode)
            return false;
        if (this._isBackwardsOnly && fromNode === toNode)
            return false;
        if (!fromPort.fromLinkable || !toPort.toLinkable)
            return false;
        if (fromPort.fromMaxLinks > 0) {
            var existingCount = this._countLinksFromPort(fromPort);
            if (existingCount >= fromPort.fromMaxLinks)
                return false;
        }
        if (toPort.toMaxLinks > 0) {
            var existingCount = this._countLinksToPort(toPort);
            if (existingCount >= toPort.toMaxLinks)
                return false;
        }
        if (!fromPort.fromLinkableDuplicates || !toPort.toLinkableDuplicates) {
            if (this._hasDuplicateLink(fromPort, toPort))
                return false;
        }
        if (this._portValidation) {
            if (!this._portValidation(fromNode, fromPort, toNode, toPort))
                return false;
        }
        if (this._linkValidation) {
            if (!this._linkValidation(fromNode, fromPort, toNode, toPort, null))
                return false;
        }
        return true;
    };
    LinkingBaseTool.prototype._countLinksFromPort = function (port) {
        var part = port.part;
        if (!part || !part.diagram)
            return 0;
        var count = 0;
        var links = part.diagram.links;
        while (links.next()) {
            var link = links.value;
            if (link.fromPort === port)
                count++;
        }
        return count;
    };
    LinkingBaseTool.prototype._countLinksToPort = function (port) {
        var part = port.part;
        if (!part || !part.diagram)
            return 0;
        var count = 0;
        var links = part.diagram.links;
        while (links.next()) {
            var link = links.value;
            if (link.toPort === port)
                count++;
        }
        return count;
    };
    LinkingBaseTool.prototype._hasDuplicateLink = function (fromPort, toPort) {
        var part = fromPort.part;
        if (!part || !part.diagram)
            return false;
        var links = part.diagram.links;
        while (links.next()) {
            var link = links.value;
            if (link.fromPort === fromPort && link.toPort === toPort)
                return true;
        }
        return false;
    };
    /** Insert a new link into the model. Returns the new link or null. */
    LinkingBaseTool.prototype.insertLink = function (fromNode, fromPort, toNode, toPort) {
        // Stub - requires model integration
        return null;
    };
    return LinkingBaseTool;
}(Tool));

/**
 * LinkingTool - creates new links by dragging from a port.
 * The user drags from an outgoing port to an incoming port to create a new link.
 */
var LinkingTool = /** @class */ (function (_super) {
    __extends(LinkingTool, _super);
    function LinkingTool() {
        var _this = _super.call(this) || this;
        _this._originalFromPort = null;
        _this.name = 'Linking';
        return _this;
    }
    /** Can start if the user clicks on a fromLinkable port. */
    LinkingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowLink)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        if (!obj)
            return false;
        // Check if the object is a fromLinkable port
        if (obj.fromLinkable)
            return true;
        return false;
    };
    /** Activate the linking tool. */
    LinkingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        if (obj) {
            this._originalFromPort = obj;
            this.temporaryFromPort = obj;
        }
        var tempLink = this.temporaryLink;
        if (tempLink) {
            var fromPort = this.temporaryFromPort;
            if (fromPort) {
                var fromNode = fromPort.part;
                if (fromNode) {
                    tempLink.fromNode = fromNode;
                    var fromPortId = fromPort.portId;
                    if (fromPortId !== undefined)
                        tempLink.fromPortId = fromPortId;
                }
                var fromBounds = fromPort.getDocumentBounds();
                var fromPoint = new Point(fromBounds.x + fromBounds.width / 2, fromBounds.y + fromBounds.height / 2);
                tempLink.points = new List();
                tempLink.points.add(fromPoint);
                tempLink.points.add(point);
            }
            var toolLayer = diagram.findLayer('Tool');
            if (toolLayer)
                toolLayer.add(tempLink);
        }
        this.startTransaction(this.name);
    };
    /** Update the temporary link on mouse move. */
    LinkingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        this.targetPort = this.findTargetPort();
        var tempLink = this.temporaryLink;
        if (tempLink) {
            var lastInput = diagram.lastInput;
            if (lastInput) {
                var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
                var points = tempLink.points;
                if (points && points.count >= 2) {
                    points.set(points.count - 1, point);
                    tempLink.points = points;
                }
            }
            if (this.targetPort) {
                var toNode = this.targetPort.part;
                if (toNode) {
                    tempLink.toNode = toNode;
                    var toPortId = this.targetPort.portId;
                    if (toPortId !== undefined)
                        tempLink.toPortId = toPortId;
                }
            }
            else {
                tempLink.toNode = null;
            }
        }
        diagram.requestUpdate();
    };
    /** Complete the link on mouse up. */
    LinkingTool.prototype.doMouseUp = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        var targetPort = this.targetPort;
        if (targetPort && this.temporaryFromPort) {
            var fromNode = this.temporaryFromPort.part;
            var toNode = targetPort.part;
            if (this.isValidLink(fromNode, this.temporaryFromPort, toNode, targetPort)) {
                this.insertLink(fromNode, this.temporaryFromPort, toNode, targetPort);
                this.transactionResult = this.name;
            }
        }
        this.stopTransaction();
        this.stopTool();
    };
    /** Clean up on deactivate. */
    LinkingTool.prototype.doDeactivate = function () {
        var diagram = this.diagram;
        var tempLink = this.temporaryLink;
        if (tempLink && diagram) {
            var toolLayer = diagram.findLayer('Tool');
            if (toolLayer)
                toolLayer.remove(tempLink);
            tempLink.fromNode = null;
            tempLink.toNode = null;
        }
        this._originalFromPort = null;
        this.temporaryFromPort = null;
        this.temporaryToPort = null;
        this.targetPort = null;
        _super.prototype.doDeactivate.call(this);
    };
    /** Insert a new link into the model. */
    LinkingTool.prototype.insertLink = function (fromNode, fromPort, toNode, toPort) {
        var diagram = this.diagram;
        if (!diagram)
            return null;
        var model = diagram.model;
        if (!model)
            return null;
        // Create link data and add to model
        if (typeof model.addLinkData === 'function') {
            var linkData = {};
            var fromKey = model.getKeyForNodeData(fromNode.data);
            var toKey = model.getKeyForNodeData(toNode.data);
            if (fromKey !== undefined)
                linkData[model.linkFromKeyProperty || 'from'] = fromKey;
            if (toKey !== undefined)
                linkData[model.linkToKeyProperty || 'to'] = toKey;
            model.addLinkData(linkData);
            var newLink = diagram.findLinkForData(linkData);
            if (newLink) {
                diagram.raiseDiagramEvent('LinkDrawn', newLink);
            }
        }
        return null;
    };
    return LinkingTool;
}(LinkingBaseTool));

var RelinkingTool = /** @class */ (function (_super) {
    __extends(RelinkingTool, _super);
    function RelinkingTool() {
        var _this = _super.call(this) || this;
        _this._originalLink = null;
        _this._originalFromPort = null;
        _this._originalToPort = null;
        _this._fromHandleArchetype = null;
        _this._toHandleArchetype = null;
        _this.name = 'Relinking';
        _this._fromHandleArchetype = _this._createHandleArchetype();
        _this._toHandleArchetype = _this._createHandleArchetype();
        return _this;
    }
    RelinkingTool.prototype._createHandleArchetype = function () {
        var handle = new Shape();
        handle.figure = 'Diamond';
        handle.fill = 'dodgerblue';
        handle.stroke = 'white';
        handle.desiredSize = new Size(8, 8);
        handle.cursor = 'pointer';
        return handle;
    };
    Object.defineProperty(RelinkingTool.prototype, "originalLink", {
        get: function () { return this._originalLink; },
        set: function (val) { this._originalLink = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelinkingTool.prototype, "originalFromPort", {
        get: function () { return this._originalFromPort; },
        set: function (val) { this._originalFromPort = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelinkingTool.prototype, "originalToPort", {
        get: function () { return this._originalToPort; },
        set: function (val) { this._originalToPort = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelinkingTool.prototype, "fromHandleArchetype", {
        get: function () { return this._fromHandleArchetype; },
        set: function (val) { this._fromHandleArchetype = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RelinkingTool.prototype, "toHandleArchetype", {
        get: function () { return this._toHandleArchetype; },
        set: function (val) { this._toHandleArchetype = val; },
        enumerable: false,
        configurable: true
    });
    RelinkingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowRelink)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var handle = this.findToolHandleAt(point);
        if (handle)
            return true;
        return false;
    };
    RelinkingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var handle = this.findToolHandleAt(point);
        if (handle) {
            var adornment = handle.panel;
            if (adornment) {
                var adornedPart = adornment.adornedPart;
                if (adornedPart instanceof Link) {
                    this._originalLink = adornedPart;
                    this._originalFromPort = adornedPart.fromNode ? adornedPart.fromNode.findPortWithName(adornedPart.fromPortId) : null;
                    this._originalToPort = adornedPart.toNode ? adornedPart.toNode.findPortWithName(adornedPart.toPortId) : null;
                }
            }
        }
        this.startTransaction(this.name);
    };
    RelinkingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        this.targetPort = this.findTargetPort();
    };
    RelinkingTool.prototype.doMouseUp = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        var targetPort = this.targetPort;
        if (targetPort && this._originalLink) {
            var toNode = targetPort.part;
            if (this.isValidLink(this._originalLink.fromNode, this._originalFromPort, toNode, targetPort)) {
                this._originalLink.toNode = toNode;
                this.transactionResult = this.name;
                diagram.raiseDiagramEvent('LinkRelinked', this._originalLink);
            }
        }
        this.stopTransaction();
        this.stopTool();
    };
    RelinkingTool.prototype.doDeactivate = function () {
        this._originalLink = null;
        this._originalFromPort = null;
        this._originalToPort = null;
        this.targetPort = null;
        this.temporaryLink = null;
        _super.prototype.doDeactivate.call(this);
    };
    RelinkingTool.prototype.updateAdornments = function (part) {
        if (!part)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var category = 'Relinking';
        var existingAd = part.getAdornment(category);
        if (!(part instanceof Link) || !part.isSelected || !diagram.allowRelink) {
            if (existingAd) {
                part.removeAdornment(category);
                var adLayer_1 = diagram.findLayer('Adornment');
                if (adLayer_1)
                    adLayer_1.remove(existingAd);
            }
            return;
        }
        var link = part;
        if (!link.fromNode && !link.toNode)
            return;
        var adornment = this._makeRelinkAdornment(link);
        part.addAdornment(category, adornment);
        var adLayer = diagram.findLayer('Adornment');
        if (adLayer) {
            if (existingAd)
                adLayer.remove(existingAd);
            adLayer.add(adornment);
        }
    };
    RelinkingTool.prototype._makeRelinkAdornment = function (link) {
        var adornment = new Adornment();
        adornment.category = 'Relinking';
        adornment.adornedObject = link;
        var bounds = link.getDocumentBounds();
        var points = link.points;
        if (points && points.count >= 2) {
            var fromPt = points.get(0);
            var toPt = points.get(points.count - 1);
            if (fromPt && this._fromHandleArchetype) {
                var fromHandle = this._fromHandleArchetype.copy();
                fromHandle.cursor = 'pointer';
                fromHandle._isFromHandle = true;
                fromHandle.alignment = new Spot(bounds.width > 0 ? (fromPt.x - bounds.x) / bounds.width : 0, bounds.height > 0 ? (fromPt.y - bounds.y) / bounds.height : 0);
                fromHandle.alignmentFocus = new Spot(0.5, 0.5);
                adornment.add(fromHandle);
            }
            if (toPt && this._toHandleArchetype) {
                var toHandle = this._toHandleArchetype.copy();
                toHandle.cursor = 'pointer';
                toHandle._isToHandle = true;
                toHandle.alignment = new Spot(bounds.width > 0 ? (toPt.x - bounds.x) / bounds.width : 1, bounds.height > 0 ? (toPt.y - bounds.y) / bounds.height : 1);
                toHandle.alignmentFocus = new Spot(0.5, 0.5);
                adornment.add(toHandle);
            }
        }
        adornment._actualBounds = bounds.copy();
        adornment._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
        adornment._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        return adornment;
    };
    return RelinkingTool;
}(LinkingBaseTool));

var LinkReshapingTool = /** @class */ (function (_super) {
    __extends(LinkReshapingTool, _super);
    function LinkReshapingTool() {
        var _this = _super.call(this) || this;
        _this._handle = null;
        _this._adornedLink = null;
        _this._handleIndex = -1;
        _this._handleArchetype = null;
        _this.name = 'LinkReshaping';
        _this._handleArchetype = _this._createHandleArchetype();
        return _this;
    }
    LinkReshapingTool.prototype._createHandleArchetype = function () {
        var handle = new Shape();
        handle.figure = 'Diamond';
        handle.fill = 'dodgerblue';
        handle.stroke = 'white';
        handle.desiredSize = new Size(7, 7);
        handle.cursor = 'crosshair';
        return handle;
    };
    Object.defineProperty(LinkReshapingTool.prototype, "handle", {
        get: function () { return this._handle; },
        set: function (val) { this._handle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkReshapingTool.prototype, "adornedLink", {
        get: function () { return this._adornedLink; },
        set: function (val) { this._adornedLink = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LinkReshapingTool.prototype, "handleArchetype", {
        get: function () { return this._handleArchetype; },
        set: function (val) { this._handleArchetype = val; },
        enumerable: false,
        configurable: true
    });
    LinkReshapingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowReshape)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var handle = this.findToolHandleAt(point);
        return handle !== null;
    };
    LinkReshapingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this._handle = this.findToolHandleAt(point);
        if (this._handle) {
            var adornment = this._handle.panel;
            if (adornment) {
                this._adornedLink = adornment.adornedPart;
            }
            this._handleIndex = this._handle._handleIndex || 0;
        }
        this.startTransaction(this.name);
    };
    LinkReshapingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput || !this._adornedLink)
            return;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var points = this._adornedLink.points;
        if (points && this._handleIndex >= 0 && this._handleIndex < points.count) {
            points.set(this._handleIndex, point);
            this._adornedLink.points = points;
        }
        diagram.requestUpdate();
    };
    LinkReshapingTool.prototype.doMouseUp = function () {
        if (!this.isActive)
            return;
        this.transactionResult = this.name;
        this.stopTool();
        var diagram = this.diagram;
        if (diagram && this._adornedLink) {
            diagram.raiseDiagramEvent('LinkReshaped', this._adornedLink);
        }
    };
    LinkReshapingTool.prototype.doDeactivate = function () {
        this._handle = null;
        this._adornedLink = null;
        this._handleIndex = -1;
        _super.prototype.doDeactivate.call(this);
    };
    LinkReshapingTool.prototype.updateAdornments = function (part) {
        if (!part)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var category = 'LinkReshaping';
        var existingAd = part.getAdornment(category);
        if (!(part instanceof Link) || !part.isSelected || !diagram.allowReshape) {
            if (existingAd) {
                part.removeAdornment(category);
                var adLayer_1 = diagram.findLayer('Adornment');
                if (adLayer_1)
                    adLayer_1.remove(existingAd);
            }
            return;
        }
        var link = part;
        var points = link.points;
        if (!points || points.count < 2)
            return;
        var adornment = this._makeReshapeAdornment(link);
        part.addAdornment(category, adornment);
        var adLayer = diagram.findLayer('Adornment');
        if (adLayer) {
            if (existingAd)
                adLayer.remove(existingAd);
            adLayer.add(adornment);
        }
    };
    LinkReshapingTool.prototype._makeReshapeAdornment = function (link) {
        var adornment = new Adornment();
        adornment.category = 'LinkReshaping';
        adornment.adornedObject = link;
        var points = link.points;
        for (var i = 0; i < points.count; i++) {
            if (i === 0 || i === points.count - 1)
                continue;
            var pt = points.get(i);
            if (!pt)
                continue;
            var handle = this._handleArchetype ? this._handleArchetype.copy() : this._createHandleArchetype().copy();
            handle._handleIndex = i;
            handle.cursor = 'crosshair';
            var bounds_1 = link.getDocumentBounds();
            handle._desiredBounds = new Rect(pt.x - bounds_1.x - 3.5, pt.y - bounds_1.y - 3.5, 7, 7);
            handle.alignment = new Spot((pt.x - bounds_1.x) / bounds_1.width, (pt.y - bounds_1.y) / bounds_1.height);
            handle.alignmentFocus = new Spot(0.5, 0.5);
            adornment.add(handle);
        }
        var bounds = link.getDocumentBounds();
        adornment._actualBounds = bounds.copy();
        adornment._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
        adornment._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        return adornment;
    };
    return LinkReshapingTool;
}(Tool));

var ResizingTool = /** @class */ (function (_super) {
    __extends(ResizingTool, _super);
    function ResizingTool() {
        var _this = _super.call(this) || this;
        _this._handle = null;
        _this._adornedElement = null;
        _this._minSize = new Size(0, 0);
        _this._maxSize = new Size(Infinity, Infinity);
        _this._originalBounds = null;
        _this._resizeObjectName = '';
        _this._handleArchetype = null;
        _this.name = 'Resizing';
        _this._handleArchetype = _this._createHandleArchetype();
        return _this;
    }
    ResizingTool.prototype._createHandleArchetype = function () {
        var handle = new Shape();
        handle.figure = 'Rectangle';
        handle.fill = 'dodgerblue';
        handle.stroke = 'white';
        handle.desiredSize = new Size(7, 7);
        handle.cursor = 'move';
        return handle;
    };
    Object.defineProperty(ResizingTool.prototype, "handle", {
        get: function () { return this._handle; },
        set: function (val) { this._handle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResizingTool.prototype, "adornedElement", {
        get: function () { return this._adornedElement; },
        set: function (val) { this._adornedElement = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResizingTool.prototype, "minSize", {
        get: function () { return this._minSize; },
        set: function (val) { this._minSize = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResizingTool.prototype, "maxSize", {
        get: function () { return this._maxSize; },
        set: function (val) { this._maxSize = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResizingTool.prototype, "handleArchetype", {
        get: function () { return this._handleArchetype; },
        set: function (val) { this._handleArchetype = val; },
        enumerable: false,
        configurable: true
    });
    ResizingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowResize)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var handle = this.findToolHandleAt(point);
        return handle !== null;
    };
    ResizingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this._handle = this.findToolHandleAt(point);
        if (this._handle) {
            var adornment = this._handle.panel;
            if (adornment) {
                this._adornedElement = adornment.adornedObject;
                if (this._adornedElement) {
                    this._originalBounds = this._adornedElement.getDocumentBounds().copy();
                }
            }
        }
        this.startTransaction(this.name);
    };
    ResizingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive || !this._adornedElement)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var newSize = this.computeResize(this._adornedElement, point);
        this._adornedElement.desiredSize = newSize;
        diagram.requestUpdate();
    };
    ResizingTool.prototype.doMouseUp = function () {
        if (!this.isActive)
            return;
        this.transactionResult = this.name;
        this.stopTool();
        var diagram = this.diagram;
        if (diagram && this._adornedElement) {
            diagram.raiseDiagramEvent('PartResized', this._adornedElement.part);
        }
    };
    ResizingTool.prototype.doDeactivate = function () {
        this._handle = null;
        this._adornedElement = null;
        this._originalBounds = null;
        _super.prototype.doDeactivate.call(this);
    };
    ResizingTool.prototype.computeResize = function (element, newPoint) {
        var currentSize = element.desiredSize;
        var w = currentSize.width;
        var h = currentSize.height;
        if (this._originalBounds) {
            var dx = newPoint.x - this._originalBounds.x;
            var dy = newPoint.y - this._originalBounds.y;
            w = Math.abs(dx);
            h = Math.abs(dy);
        }
        w = Math.max(this._minSize.width, Math.min(this._maxSize.width, w));
        h = Math.max(this._minSize.height, Math.min(this._maxSize.height, h));
        return new Size(w, h);
    };
    ResizingTool.prototype.updateAdornments = function (part) {
        if (!part)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var category = 'Resizing';
        var existingAd = part.getAdornment(category);
        if (!part.isSelected || !diagram.allowResize) {
            if (existingAd) {
                part.removeAdornment(category);
                var adLayer_1 = diagram.findLayer('Adornment');
                if (adLayer_1)
                    adLayer_1.remove(existingAd);
            }
            return;
        }
        var adornedObj = this._resizeObjectName
            ? part.findObject(this._resizeObjectName)
            : part;
        if (!adornedObj)
            return;
        var bounds = adornedObj.getDocumentBounds();
        if (bounds.width <= 0 || bounds.height <= 0)
            return;
        var adornment = this._makeResizeAdornment(adornedObj, bounds);
        part.addAdornment(category, adornment);
        var adLayer = diagram.findLayer('Adornment');
        if (adLayer) {
            if (existingAd)
                adLayer.remove(existingAd);
            adLayer.add(adornment);
        }
    };
    ResizingTool.prototype._makeResizeAdornment = function (adornedObj, bounds) {
        var adornment = new Adornment();
        adornment.category = 'Resizing';
        adornment.adornedObject = adornedObj;
        var spotPanel = new Panel();
        spotPanel._type = PanelAuto;
        var bg = new Shape();
        bg.figure = 'Rectangle';
        bg.fill = 'transparent';
        bg.stroke = 'dodgerblue';
        bg.strokeWidth = 1;
        bg.strokeDashArray = [3, 3];
        bg.isPanelMain = true;
        bg.stretch = StretchFill;
        spotPanel.add(bg);
        var positions = [
            { align: 'TopLeft', cursor: 'nw-resize' },
            { align: 'Top', cursor: 'n-resize' },
            { align: 'TopRight', cursor: 'ne-resize' },
            { align: 'Right', cursor: 'e-resize' },
            { align: 'BottomRight', cursor: 'se-resize' },
            { align: 'Bottom', cursor: 's-resize' },
            { align: 'BottomLeft', cursor: 'sw-resize' },
            { align: 'Left', cursor: 'w-resize' },
        ];
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
            var handle = this._handleArchetype ? this._handleArchetype.copy() : this._createHandleArchetype().copy();
            handle.cursor = pos.cursor;
            handle._alignmentIndex = i;
            handle._alignmentName = pos.align;
            var alignMap = {
                'TopLeft': { x: 0, y: 0 },
                'Top': { x: 0.5, y: 0 },
                'TopRight': { x: 1, y: 0 },
                'Right': { x: 1, y: 0.5 },
                'BottomRight': { x: 1, y: 1 },
                'Bottom': { x: 0.5, y: 1 },
                'BottomLeft': { x: 0, y: 1 },
                'Left': { x: 0, y: 0.5 },
            };
            var alignPos = alignMap[pos.align];
            if (alignPos) {
                handle.alignment = new Spot(alignPos.x, alignPos.y);
                handle.alignmentFocus = new Spot(0.5, 0.5);
            }
            spotPanel.add(handle);
        }
        adornment.add(spotPanel);
        adornment._actualBounds = bounds.copy();
        adornment._measuredBounds = new Rect(0, 0, bounds.width, bounds.height);
        adornment._naturalBounds = new Rect(0, 0, bounds.width, bounds.height);
        return adornment;
    };
    return ResizingTool;
}(Tool));

var RotatingTool = /** @class */ (function (_super) {
    __extends(RotatingTool, _super);
    function RotatingTool() {
        var _this = _super.call(this) || this;
        _this._handle = null;
        _this._adornedElement = null;
        _this._angle = 0;
        _this._originalAngle = 0;
        _this._handleArchetype = null;
        _this.name = 'Rotating';
        _this._handleArchetype = _this._createHandleArchetype();
        return _this;
    }
    RotatingTool.prototype._createHandleArchetype = function () {
        var handle = new Shape();
        handle.figure = 'Ellipse';
        handle.fill = 'dodgerblue';
        handle.stroke = 'white';
        handle.desiredSize = new Size(10, 10);
        handle.cursor = 'pointer';
        return handle;
    };
    Object.defineProperty(RotatingTool.prototype, "handle", {
        get: function () { return this._handle; },
        set: function (val) { this._handle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RotatingTool.prototype, "adornedElement", {
        get: function () { return this._adornedElement; },
        set: function (val) { this._adornedElement = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RotatingTool.prototype, "angle", {
        get: function () { return this._angle; },
        set: function (val) { this._angle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RotatingTool.prototype, "handleArchetype", {
        get: function () { return this._handleArchetype; },
        set: function (val) { this._handleArchetype = val; },
        enumerable: false,
        configurable: true
    });
    RotatingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowRotate)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var handle = this.findToolHandleAt(point);
        return handle !== null;
    };
    RotatingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this._handle = this.findToolHandleAt(point);
        if (this._handle) {
            var adornment = this._handle.panel;
            if (adornment) {
                this._adornedElement = adornment.adornedObject;
                this._originalAngle = this._adornedElement ? this._adornedElement.angle || 0 : 0;
            }
        }
        this.startTransaction(this.name);
    };
    RotatingTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive || !this._adornedElement)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var newAngle = this.computeRotate(this._adornedElement, new Point(lastInput.documentPoint.x, lastInput.documentPoint.y));
        this._adornedElement.angle = newAngle;
        this._angle = newAngle;
        diagram.requestUpdate();
    };
    RotatingTool.prototype.doMouseUp = function () {
        if (!this.isActive)
            return;
        this.transactionResult = this.name;
        this.stopTool();
        var diagram = this.diagram;
        if (diagram && this._adornedElement) {
            diagram.raiseDiagramEvent('PartRotated', this._adornedElement.part);
        }
    };
    RotatingTool.prototype.doDeactivate = function () {
        this._handle = null;
        this._adornedElement = null;
        _super.prototype.doDeactivate.call(this);
    };
    RotatingTool.prototype.computeRotate = function (element, newPoint) {
        var bounds = element.getDocumentBounds();
        var center = bounds.center;
        var dx = newPoint.x - center.x;
        var dy = newPoint.y - center.y;
        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        angle = Math.round(angle);
        return angle;
    };
    RotatingTool.prototype.updateAdornments = function (part) {
        if (!part)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var category = 'Rotating';
        var existingAd = part.getAdornment(category);
        if (!part.isSelected || !diagram.allowRotate) {
            if (existingAd) {
                part.removeAdornment(category);
                var adLayer_1 = diagram.findLayer('Adornment');
                if (adLayer_1)
                    adLayer_1.remove(existingAd);
            }
            return;
        }
        var bounds = part.getDocumentBounds();
        if (bounds.width <= 0 || bounds.height <= 0)
            return;
        var adornment = this._makeRotateAdornment(part, bounds);
        part.addAdornment(category, adornment);
        var adLayer = diagram.findLayer('Adornment');
        if (adLayer) {
            if (existingAd)
                adLayer.remove(existingAd);
            adLayer.add(adornment);
        }
    };
    RotatingTool.prototype._makeRotateAdornment = function (adornedObj, bounds) {
        var adornment = new Adornment();
        adornment.category = 'Rotating';
        adornment.adornedObject = adornedObj;
        var vPanel = new Panel();
        vPanel._type = PanelVertical;
        var handle = this._handleArchetype ? this._handleArchetype.copy() : this._createHandleArchetype().copy();
        handle.cursor = 'pointer';
        handle.alignment = Spot.TopCenter;
        handle.alignmentFocus = Spot.Center;
        vPanel.add(handle);
        var line = new Shape();
        line.figure = 'Rectangle';
        line.fill = 'dodgerblue';
        line.stroke = 'dodgerblue';
        line.strokeWidth = 1;
        line.width = 1;
        line.height = 20;
        vPanel.add(line);
        adornment.add(vPanel);
        adornment._actualBounds = bounds.copy();
        adornment._measuredBounds = new Rect(0, 0, bounds.width, bounds.height + 30);
        adornment._naturalBounds = new Rect(0, 0, bounds.width, bounds.height + 30);
        return adornment;
    };
    return RotatingTool;
}(Tool));

var TextEditingTool = /** @class */ (function (_super) {
    __extends(TextEditingTool, _super);
    function TextEditingTool() {
        var _this = _super.call(this) || this;
        _this._textBlock = null;
        _this._defaultText = '';
        _this._currentText = '';
        _this._textBox = null;
        _this.name = 'TextEditing';
        return _this;
    }
    Object.defineProperty(TextEditingTool.prototype, "textBlock", {
        get: function () { return this._textBlock; },
        set: function (val) { this._textBlock = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextEditingTool.prototype, "defaultText", {
        get: function () { return this._defaultText; },
        set: function (val) { this._defaultText = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextEditingTool.prototype, "currentText", {
        get: function () { return this._currentText; },
        set: function (val) { this._currentText = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextEditingTool.prototype, "textBox", {
        get: function () { return this._textBox; },
        set: function (val) { this._textBox = val; },
        enumerable: false,
        configurable: true
    });
    TextEditingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowTextEdit)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        if (!lastInput.leftButton)
            return false;
        if (lastInput.clickCount < 2)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        if (obj instanceof TextBlock && obj.editable) {
            return true;
        }
        return false;
    };
    TextEditingTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        if (!(obj instanceof TextBlock))
            return;
        this._textBlock = obj;
        this._defaultText = obj.text;
        this._currentText = obj.text;
        var docBounds = obj.getDocumentBounds();
        var viewPt = diagram.transformDocToView(new Point(docBounds.x, docBounds.y));
        var scale = diagram.scale || 1;
        var viewW = docBounds.width * scale;
        var viewH = docBounds.height * scale;
        var div = diagram.div;
        if (!div)
            return;
        var el;
        if (obj.isMultiline) {
            el = document.createElement('textarea');
        }
        else {
            el = document.createElement('input');
            el.type = 'text';
        }
        el.value = obj.text;
        el.style.position = 'absolute';
        el.style.left = viewPt.x + 'px';
        el.style.top = viewPt.y + 'px';
        el.style.width = Math.max(viewW, 50) + 'px';
        el.style.height = Math.max(viewH, 20) + 'px';
        el.style.font = obj.font;
        el.style.textAlign = obj.textAlign;
        el.style.zIndex = '10000';
        el.style.border = '1px solid #4a90d9';
        el.style.outline = 'none';
        el.style.padding = '0px';
        el.style.margin = '0px';
        el.style.resize = 'none';
        el.style.overflow = 'hidden';
        el.style.boxSizing = 'border-box';
        el.style.backgroundColor = 'white';
        var stroke = obj.stroke;
        if (typeof stroke === 'string') {
            el.style.color = stroke;
        }
        else if (Brush.isBrush(stroke)) {
            el.style.color = 'black';
        }
        if (obj.isMultiline) {
            el.style.lineHeight = '1.2';
            el.style.whiteSpace = 'pre-wrap';
            el.style.wordWrap = 'break-word';
        }
        div.appendChild(el);
        this._textBox = el;
        el.focus();
        el.select();
        this.startTransaction(this.name);
    };
    TextEditingTool.prototype.doKeyDown = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var key = lastInput.key;
        if (key === 'Escape') {
            this.cancelText();
            lastInput.handled = true;
            return;
        }
        if (key === 'Tab') {
            this.acceptText();
            lastInput.handled = true;
            return;
        }
        if (key === 'Enter') {
            if (this._textBlock && this._textBlock.isMultiline && !lastInput.shift) {
                return;
            }
            this.acceptText();
            lastInput.handled = true;
            return;
        }
    };
    TextEditingTool.prototype.doDeactivate = function () {
        this._removeElement();
        this._textBlock = null;
        _super.prototype.doDeactivate.call(this);
    };
    TextEditingTool.prototype.acceptText = function () {
        if (this._textBox && this._textBlock) {
            this._currentText = this._textBox.value;
            var diagram = this.diagram;
            if (diagram) {
                var part = this._textBlock.part;
                if (part && part.data) {
                    var bindings = this._textBlock._bindings || [];
                    var textBinding = bindings.find(function (b) { return b.targetProperty === 'text'; });
                    if (textBinding) {
                        diagram.model.setDataProperty(part.data, textBinding.sourceProperty || 'text', this._currentText);
                    }
                    else {
                        this._textBlock.text = this._currentText;
                    }
                }
                else {
                    this._textBlock.text = this._currentText;
                }
                diagram.raiseDiagramEvent('TextEdited', this._textBlock, this._defaultText, this._currentText);
            }
            this.transactionResult = this.name;
        }
        this._removeElement();
        this.stopTransaction();
        this.stopTool();
    };
    TextEditingTool.prototype.cancelText = function () {
        if (this._textBlock) {
            this._textBlock.text = this._defaultText;
        }
        this._removeElement();
        this.stopTool();
    };
    TextEditingTool.prototype._removeElement = function () {
        if (this._textBox) {
            var parent_1 = this._textBox.parentNode;
            if (parent_1) {
                parent_1.removeChild(this._textBox);
            }
            this._textBox = null;
        }
    };
    return TextEditingTool;
}(Tool));

/**
 * PanningTool - pans the viewport by dragging.
 * The user drags to scroll the diagram viewport.
 */
var PanningTool = /** @class */ (function (_super) {
    __extends(PanningTool, _super);
    function PanningTool() {
        var _this = _super.call(this) || this;
        _this._originalPosition = null;
        _this._startPoint = null;
        _this.name = 'Panning';
        return _this;
    }
    /** Can start if the user clicks on the background with no part. */
    PanningTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        // Check if the diagram allows scrolling
        if (!diagram.allowHorizontalScroll && !diagram.allowVerticalScroll)
            return false;
        return true;
    };
    /** Activate the panning tool. */
    PanningTool.prototype.doActivate = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        this._startPoint = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this._originalPosition = diagram.position.copy();
    };
    /** Pan the viewport on mouse move. */
    PanningTool.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isActive || !this._startPoint || !this._originalPosition)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var delta = point.subtract(this._startPoint);
        var newX = this._originalPosition.x - delta.x;
        var newY = this._originalPosition.y - delta.y;
        if (!diagram.allowHorizontalScroll)
            newX = this._originalPosition.x;
        if (!diagram.allowVerticalScroll)
            newY = this._originalPosition.y;
        diagram.position = new Point(newX, newY);
    };
    /** Clean up on deactivate. */
    PanningTool.prototype.doDeactivate = function () {
        this._originalPosition = null;
        this._startPoint = null;
        _super.prototype.doDeactivate.call(this);
    };
    return PanningTool;
}(Tool));

/**
 * ContextMenuTool - shows context menus on right-click.
 * Displays the context menu for the object under the mouse.
 */
var ContextMenuTool = /** @class */ (function (_super) {
    __extends(ContextMenuTool, _super);
    function ContextMenuTool() {
        var _this = _super.call(this) || this;
        _this._currentContextMenu = null;
        _this._mouseDownPoint = null;
        _this.name = 'ContextMenu';
        return _this;
    }
    Object.defineProperty(ContextMenuTool.prototype, "currentContextMenu", {
        // ============ Properties ============
        get: function () { return this._currentContextMenu; },
        set: function (val) { this._currentContextMenu = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Can start if the user right-clicks. */
    ContextMenuTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        return lastInput.isContextMenu || lastInput.button === 2;
    };
    /** Show the context menu on mouse up (right-click). */
    ContextMenuTool.prototype.doMouseUp = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        // Look for contextMenu on the part or object
        var menu = null;
        if (obj) {
            var part = obj.part;
            if (part && part.contextMenu) {
                menu = part.contextMenu;
            }
        }
        // Look for diagram-level context menu
        if (!menu && diagram.contextMenu) {
            menu = diagram.contextMenu;
        }
        if (menu) {
            this.showContextMenu(menu, point);
        }
        this.stopTool();
    };
    /** Show the context menu at the given position. */
    ContextMenuTool.prototype.showContextMenu = function (menu, point) {
        this._currentContextMenu = menu;
        if (menu instanceof Adornment) {
            menu.location = point;
            var diagram = this.diagram;
            if (diagram) {
                diagram.add(menu);
            }
        }
        // If menu has a showFunction (HTMLInfo), call it
        if (menu && typeof menu.showFunction === 'function') {
            menu.showFunction(menu, this, point);
        }
    };
    /** Hide the current context menu. */
    ContextMenuTool.prototype.hideContextMenu = function () {
        if (this._currentContextMenu) {
            var diagram = this.diagram;
            if (diagram) {
                diagram.remove(this._currentContextMenu);
            }
            this._currentContextMenu = null;
        }
    };
    return ContextMenuTool;
}(Tool));

/**
 * ClickCreatingTool - creates a new node on click in the background.
 * Used for quick node creation by clicking on empty diagram space.
 */
var ClickCreatingTool = /** @class */ (function (_super) {
    __extends(ClickCreatingTool, _super);
    function ClickCreatingTool() {
        var _this = _super.call(this) || this;
        _this._archetypePartData = null;
        _this._isDoubleClick = false;
        _this.name = 'ClickCreating';
        return _this;
    }
    Object.defineProperty(ClickCreatingTool.prototype, "archetypePartData", {
        // ============ Properties ============
        get: function () { return this._archetypePartData; },
        set: function (val) { this._archetypePartData = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClickCreatingTool.prototype, "isDoubleClick", {
        get: function () { return this._isDoubleClick; },
        set: function (val) { this._isDoubleClick = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Can start if the user clicks in the background and archetype data is set. */
    ClickCreatingTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        if (!diagram.allowInsert)
            return false;
        if (!this._archetypePartData)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        // Only start if clicking on the background
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var part = diagram.findPartAt(point, true);
        return part === null;
    };
    /** Create the part on mouse up. */
    ClickCreatingTool.prototype.doMouseUp = function () {
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        this.insertPart(point);
        this.stopTool();
    };
    /** Insert a new part at the given location. */
    ClickCreatingTool.prototype.insertPart = function (loc) {
        var diagram = this.diagram;
        if (!diagram || !this._archetypePartData)
            return null;
        this.startTransaction(this.name);
        var model = diagram.model;
        if (model) {
            var data = {};
            for (var key in this._archetypePartData) {
                if (Object.prototype.hasOwnProperty.call(this._archetypePartData, key)) {
                    data[key] = this._archetypePartData[key];
                }
            }
            data.loc = loc.x + ' ' + loc.y;
            model.addNodeData(data);
        }
        this.transactionResult = this.name;
        this.stopTransaction();
        return null;
    };
    return ClickCreatingTool;
}(Tool));

/**
 * ActionTool - handles isActionable objects.
 * Dispatches mouse events to GraphObjects that have isActionable set to true.
 */
var ActionTool = /** @class */ (function (_super) {
    __extends(ActionTool, _super);
    function ActionTool() {
        var _this = _super.call(this) || this;
        _this._actionableObject = null;
        _this.name = 'Action';
        return _this;
    }
    Object.defineProperty(ActionTool.prototype, "actionableObject", {
        // ============ Properties ============
        get: function () { return this._actionableObject; },
        set: function (val) { this._actionableObject = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Can start if the user clicks on an isActionable object. */
    ActionTool.prototype.canStart = function () {
        var diagram = this.diagram;
        if (!diagram || !this.isEnabled)
            return false;
        var lastInput = diagram.lastInput;
        if (!lastInput)
            return false;
        var point = new Point(lastInput.documentPoint.x, lastInput.documentPoint.y);
        var obj = diagram.findObjectAt(point);
        if (obj && obj.isActionable) {
            this._actionableObject = obj;
            return true;
        }
        return false;
    };
    /** Dispatch mouse-down to the actionable object. */
    ActionTool.prototype.doMouseDown = function () {
        if (!this._actionableObject)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        this._isActive = true;
        var lastInput = diagram.lastInput;
        if (this._actionableObject.actionDown) {
            this._actionableObject.actionDown(lastInput, this._actionableObject);
        }
    };
    /** Dispatch mouse-move to the actionable object. */
    ActionTool.prototype.doMouseMove = function () {
        if (!this._actionableObject)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (this._actionableObject.actionMove) {
            this._actionableObject.actionMove(lastInput, this._actionableObject);
        }
    };
    /** Dispatch mouse-up to the actionable object. */
    ActionTool.prototype.doMouseUp = function () {
        if (!this._actionableObject)
            return;
        var diagram = this.diagram;
        if (!diagram)
            return;
        var lastInput = diagram.lastInput;
        if (this._actionableObject.actionUp) {
            this._actionableObject.actionUp(lastInput, this._actionableObject);
        }
        this._actionableObject = null;
        this.stopTool();
    };
    return ActionTool;
}(Tool));

/**
 * ToolManager - manages tool dispatch and event routing.
 * Holds lists of mouse-down, mouse-move, and mouse-up tools,
 * and dispatches events to the appropriate tool.
 */
var ToolManager = /** @class */ (function (_super) {
    __extends(ToolManager, _super);
    function ToolManager() {
        var _this = _super.call(this) || this;
        _this._mouseDownTools = [];
        _this._mouseMoveTools = [];
        _this._mouseUpTools = [];
        _this._mouseHoverTools = [];
        _this._currentTool = null;
        _this._hoverDelay = 0;
        _this._holdDelay = 0;
        _this._lastInput = new InputEvent();
        _this._previousInput = new InputEvent();
        _this._mouseDownPoint = null;
        _this.name = 'ToolManager';
        // Create default tool instances
        var clickSelectingTool = new ClickSelectingTool();
        var draggingTool = new DraggingTool();
        var dragSelectingTool = new DragSelectingTool();
        var linkingTool = new LinkingTool();
        var relinkingTool = new RelinkingTool();
        var linkReshapingTool = new LinkReshapingTool();
        var resizingTool = new ResizingTool();
        var rotatingTool = new RotatingTool();
        new TextEditingTool();
        var panningTool = new PanningTool();
        var contextMenuTool = new ContextMenuTool();
        var clickCreatingTool = new ClickCreatingTool();
        var actionTool = new ActionTool();
        // Default tool is ClickSelectingTool
        _this._defaultTool = clickSelectingTool;
        _this._currentTool = _this._defaultTool;
        // Mouse-down tools (checked in order on mouse-down)
        _this._mouseDownTools = [
            actionTool,
            relinkingTool,
            linkReshapingTool,
            resizingTool,
            rotatingTool,
            linkingTool,
            draggingTool,
            dragSelectingTool,
            panningTool,
            contextMenuTool,
        ];
        // Mouse-move tools (checked in order on mouse-move)
        _this._mouseMoveTools = [
            draggingTool,
            dragSelectingTool,
            linkingTool,
            relinkingTool,
            linkReshapingTool,
            resizingTool,
            rotatingTool,
            panningTool,
        ];
        // Mouse-up tools (checked in order on mouse-up)
        _this._mouseUpTools = [
            clickSelectingTool,
            clickCreatingTool,
            contextMenuTool,
        ];
        // Mouse-hover tools
        _this._mouseHoverTools = [];
        return _this;
    }
    Object.defineProperty(ToolManager.prototype, "mouseDownTools", {
        // ============ Properties ============
        get: function () { return this._mouseDownTools; },
        set: function (val) { this._mouseDownTools = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "mouseMoveTools", {
        get: function () { return this._mouseMoveTools; },
        set: function (val) { this._mouseMoveTools = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "mouseUpTools", {
        get: function () { return this._mouseUpTools; },
        set: function (val) { this._mouseUpTools = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "mouseHoverTools", {
        get: function () { return this._mouseHoverTools; },
        set: function (val) { this._mouseHoverTools = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "currentTool", {
        get: function () { return this._currentTool; },
        set: function (val) {
            if (this._currentTool && this._currentTool.isActive) {
                this._currentTool.doDeactivate();
            }
            this._currentTool = val;
            if (val) {
                val.diagram = this.diagram;
                val.doStart();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "defaultTool", {
        get: function () { return this._defaultTool; },
        set: function (val) {
            this._defaultTool = val;
            if (val) {
                val.diagram = this.diagram;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "clickSelectingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof ClickSelectingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "draggingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof DraggingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "dragSelectingTool", {
        get: function () {
            return this._mouseMoveTools.find(function (t) { return t instanceof DragSelectingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "linkingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof LinkingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "relinkingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof RelinkingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "linkReshapingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof LinkReshapingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "resizingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof ResizingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "rotatingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof RotatingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "textEditingTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof TextEditingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "panningTool", {
        get: function () {
            return this._mouseMoveTools.find(function (t) { return t instanceof PanningTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "contextMenuTool", {
        get: function () {
            return this._mouseUpTools.find(function (t) { return t instanceof ContextMenuTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "clickCreatingTool", {
        get: function () {
            return this._mouseUpTools.find(function (t) { return t instanceof ClickCreatingTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "actionTool", {
        get: function () {
            return this._mouseDownTools.find(function (t) { return t instanceof ActionTool; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "hoverDelay", {
        get: function () { return this._hoverDelay; },
        set: function (val) { this._hoverDelay = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "holdDelay", {
        get: function () { return this._holdDelay; },
        set: function (val) { this._holdDelay = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "lastInput", {
        get: function () { return this._lastInput; },
        set: function (val) { this._lastInput = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "previousInput", {
        get: function () { return this._previousInput; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ToolManager.prototype, "diagram", {
        // ============ Override Diagram setter ============
        set: function (val) {
            var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
            this._diagram = val;
            try {
                // Propagate diagram to all managed tools
                for (var _e = __values(this._mouseDownTools), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var tool = _f.value;
                    tool.diagram = val;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            try {
                for (var _g = __values(this._mouseMoveTools), _h = _g.next(); !_h.done; _h = _g.next()) {
                    var tool = _h.value;
                    tool.diagram = val;
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
                }
                finally { if (e_2) throw e_2.error; }
            }
            try {
                for (var _j = __values(this._mouseUpTools), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var tool = _k.value;
                    tool.diagram = val;
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                }
                finally { if (e_3) throw e_3.error; }
            }
            try {
                for (var _l = __values(this._mouseHoverTools), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var tool = _m.value;
                    tool.diagram = val;
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (this._defaultTool) {
                this._defaultTool.diagram = val;
            }
            if (this._currentTool) {
                this._currentTool.diagram = val;
            }
        },
        enumerable: false,
        configurable: true
    });
    // ============ Event Dispatch Methods ============
    /** Dispatch mouse-down event to the appropriate tool. */
    ToolManager.prototype.doMouseDown = function () {
        var e_5, _a;
        var diagram = this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        // Save the previous input
        this._previousInput = this._lastInput.copy();
        // Store the mouse-down point
        this._mouseDownPoint = new Point(this._lastInput.documentPoint.x, this._lastInput.documentPoint.y);
        // If there is a current active tool, let it handle the event
        if (this._currentTool && this._currentTool.isActive) {
            this._currentTool.doMouseDown();
            return;
        }
        try {
            // Try each mouse-down tool in order
            for (var _b = __values(this._mouseDownTools), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tool = _c.value;
                if (!tool.isEnabled)
                    continue;
                if (tool.canStart()) {
                    this.currentTool = tool;
                    tool.doActivate();
                    tool.doMouseDown();
                    return;
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        // No tool could start - use default tool
        this.currentTool = this._defaultTool;
        if (this._currentTool) {
            this._currentTool.doMouseDown();
        }
    };
    /** Dispatch mouse-move event to the current tool. */
    ToolManager.prototype.doMouseMove = function () {
        var diagram = this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        this._previousInput = this._lastInput.copy();
        if (this._currentTool) {
            this._currentTool.doMouseMove();
        }
    };
    /** Dispatch mouse-up event to the current tool. */
    ToolManager.prototype.doMouseUp = function () {
        var e_6, _a;
        var diagram = this.diagram;
        if (!diagram || !diagram.isEnabled)
            return;
        this._previousInput = this._lastInput.copy();
        // If there is a current active tool, let it handle the event
        if (this._currentTool && this._currentTool.isActive) {
            this._currentTool.doMouseUp();
            return;
        }
        try {
            // Try each mouse-up tool in order
            for (var _b = __values(this._mouseUpTools), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tool = _c.value;
                if (!tool.isEnabled)
                    continue;
                if (tool.canStart()) {
                    this.currentTool = tool;
                    tool.doActivate();
                    tool.doMouseUp();
                    return;
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
        // No tool could start - use default tool
        this.currentTool = this._defaultTool;
        if (this._currentTool) {
            this._currentTool.doMouseUp();
        }
    };
    /** Dispatch key-down event to the current tool. */
    ToolManager.prototype.doKeyDown = function () {
        if (this._currentTool) {
            this._currentTool.doKeyDown();
        }
    };
    /** Dispatch key-up event to the current tool. */
    ToolManager.prototype.doKeyUp = function () {
        if (this._currentTool) {
            this._currentTool.doKeyUp();
        }
    };
    /** Dispatch mouse-wheel event to the current tool. */
    ToolManager.prototype.doMouseWheel = function () {
        if (this._currentTool) {
            this._currentTool.doMouseWheel();
        }
        else {
            this.standardMouseWheel();
        }
    };
    /** Update adornments for all relevant parts. */
    ToolManager.prototype.updateAdornments = function (part) {
        var e_7, _a;
        try {
            // Propagate to all tools that manage adornments
            for (var _b = __values(this._mouseDownTools), _c = _b.next(); !_c.done; _c = _b.next()) {
                var tool = _c.value;
                tool.updateAdornments(part);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    /** Standard mouse wheel: zoom in/out centered on mouse position. */
    ToolManager.prototype.standardMouseWheel = function () {
        var diagram = this.diagram;
        if (!diagram || !diagram.allowZoom)
            return;
        var e = this._lastInput;
        if (!e || !e.nativeEvent)
            return;
        var wheelEvent = e.nativeEvent;
        var delta = wheelEvent.deltaMode === 1 ? wheelEvent.deltaY * 40 : wheelEvent.deltaY;
        if (wheelEvent.ctrlKey || Math.abs(delta) < 40) {
            var oldScale = diagram.scale;
            var factor = delta > 0 ? 0.9 : 1.1;
            var newScale = oldScale * factor;
            newScale = Math.max(diagram.minScale, Math.min(diagram.maxScale, newScale));
            var viewPoint = new Point(e.viewPoint.x, e.viewPoint.y);
            var padding = diagram.padding;
            var mouseDocX = (viewPoint.x - padding.left) / oldScale + diagram.position.x;
            var mouseDocY = (viewPoint.y - padding.top) / oldScale + diagram.position.y;
            diagram.scale = newScale;
            diagram.position = new Point(mouseDocX - (viewPoint.x - padding.left) / newScale, mouseDocY - (viewPoint.y - padding.top) / newScale);
        }
        else {
            var scrollX_1 = wheelEvent.shiftKey ? delta : 0;
            var scrollY_1 = wheelEvent.shiftKey ? 0 : delta;
            if (diagram.allowHorizontalScroll || diagram.allowVerticalScroll) {
                var pos = diagram.position;
                diagram.position = new Point(pos.x + scrollX_1 / diagram.scale, pos.y + scrollY_1 / diagram.scale);
            }
        }
    };
    return ToolManager;
}(Tool));

var CommandHandler = /** @class */ (function () {
    function CommandHandler() {
        this._diagram = null;
        this._isEnabled = true;
    }
    Object.defineProperty(CommandHandler.prototype, "diagram", {
        // ============ Properties ============
        get: function () {
            return this._diagram;
        },
        set: function (val) {
            this._diagram = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CommandHandler.prototype, "isEnabled", {
        get: function () {
            return this._isEnabled;
        },
        set: function (val) {
            this._isEnabled = val;
        },
        enumerable: false,
        configurable: true
    });
    // ============ Delete ============
    CommandHandler.prototype.canDeleteSelection = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        if (!this._diagram.allowDelete)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.deleteSelection = function () {
        var e_1, _a, e_2, _b, e_3, _c;
        if (!this.canDeleteSelection())
            return;
        this._diagram.startTransaction('delete selection');
        var selection = this._diagram.selection;
        var parts = [];
        var it = selection.iterator;
        while (it.next()) {
            parts.push(it.value);
        }
        var linksToRemove = [];
        var nodesToRemove = [];
        try {
            for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                var part = parts_1_1.value;
                if (!part.data)
                    continue;
                if (part._className === 'Link') {
                    linksToRemove.push(part.data);
                }
                else {
                    nodesToRemove.push(part.data);
                    var connectedLinks = this._diagram.findLinksConnected(part);
                    if (connectedLinks) {
                        var lit = connectedLinks.iterator;
                        while (lit.next()) {
                            var link = lit.value;
                            if (link.data && linksToRemove.indexOf(link.data) < 0) {
                                linksToRemove.push(link.data);
                            }
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var model = this._diagram.model;
        var isGraphLinks = typeof model.removeLinkData === 'function';
        try {
            for (var linksToRemove_1 = __values(linksToRemove), linksToRemove_1_1 = linksToRemove_1.next(); !linksToRemove_1_1.done; linksToRemove_1_1 = linksToRemove_1.next()) {
                var linkData = linksToRemove_1_1.value;
                if (isGraphLinks) {
                    model.removeLinkData(linkData);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (linksToRemove_1_1 && !linksToRemove_1_1.done && (_b = linksToRemove_1.return)) _b.call(linksToRemove_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        try {
            for (var nodesToRemove_1 = __values(nodesToRemove), nodesToRemove_1_1 = nodesToRemove_1.next(); !nodesToRemove_1_1.done; nodesToRemove_1_1 = nodesToRemove_1.next()) {
                var nodeData = nodesToRemove_1_1.value;
                model.removeNodeData(nodeData);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (nodesToRemove_1_1 && !nodesToRemove_1_1.done && (_c = nodesToRemove_1.return)) _c.call(nodesToRemove_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this._diagram.commitTransaction('delete selection');
        this._diagram.raiseDiagramEvent('SelectionDeleted');
    };
    CommandHandler.prototype.canCopy = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (!this._diagram.allowCopy)
            return false;
        if (!this._diagram.allowClipboard)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.copySelection = function () {
        if (!this.canCopy())
            return;
        CommandHandler._clipboard = [];
        var selection = this._diagram.selection;
        var it = selection.iterator;
        while (it.next()) {
            var part = it.value;
            if (part.data) {
                var dataCopy = JSON.parse(JSON.stringify(part.data));
                var isLink = part._className === 'Link';
                CommandHandler._clipboard.push({ data: dataCopy, isLink: isLink });
            }
        }
        this._diagram.raiseDiagramEvent('ClipboardChanged');
    };
    // ============ Cut ============
    CommandHandler.prototype.canCut = function () {
        return this.canCopy() && this.canDeleteSelection();
    };
    CommandHandler.prototype.cutSelection = function () {
        if (!this.canCut())
            return;
        this.copySelection();
        this.deleteSelection();
    };
    // ============ Paste ============
    CommandHandler.prototype.canPaste = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (!this._diagram.allowInsert)
            return false;
        if (!this._diagram.allowClipboard)
            return false;
        return true;
    };
    CommandHandler.prototype.pasteSelection = function () {
        var e_4, _a, e_5, _b;
        if (!this.canPaste())
            return;
        if (CommandHandler._clipboard.length === 0)
            return;
        this._diagram.startTransaction('paste');
        var model = this._diagram.model;
        var offset = 20;
        var keyMap = new Map();
        try {
            for (var _c = __values(CommandHandler._clipboard), _d = _c.next(); !_d.done; _d = _c.next()) {
                var item = _d.value;
                if (item.isLink)
                    continue;
                var newData = JSON.parse(JSON.stringify(item.data));
                var oldKey = model.getKeyForNodeData(newData);
                if (newData.key !== undefined) {
                    newData.key = model.makeKey ? model.makeKey() : model.makeUniqueKeyString ? model.makeUniqueKeyString() : newData.key + '_copy';
                }
                if (newData.loc !== undefined) {
                    var parts = String(newData.loc).split(' ');
                    var x = parseFloat(parts[0]) || 0;
                    var y = parseFloat(parts[1]) || 0;
                    newData.loc = (x + offset) + ' ' + (y + offset);
                }
                model.addNodeData(newData);
                if (oldKey !== undefined) {
                    keyMap.set(oldKey, model.getKeyForNodeData(newData));
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
        var isGraphLinks = model.nodeDataArray !== undefined && typeof model.addLinkData === 'function';
        if (isGraphLinks) {
            try {
                for (var _e = __values(CommandHandler._clipboard), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var item = _f.value;
                    if (!item.isLink)
                        continue;
                    var newData = JSON.parse(JSON.stringify(item.data));
                    var glm = model;
                    var fromProp = glm.linkFromKeyProperty || 'from';
                    var toProp = glm.linkToKeyProperty || 'to';
                    var oldFrom = newData[fromProp];
                    var oldTo = newData[toProp];
                    if (keyMap.has(oldFrom))
                        newData[fromProp] = keyMap.get(oldFrom);
                    if (keyMap.has(oldTo))
                        newData[toProp] = keyMap.get(oldTo);
                    if (newData.loc !== undefined) {
                        var parts = String(newData.loc).split(' ');
                        var x = parseFloat(parts[0]) || 0;
                        var y = parseFloat(parts[1]) || 0;
                        newData.loc = (x + offset) + ' ' + (y + offset);
                    }
                    glm.addLinkData(newData);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        this._diagram.commitTransaction('paste');
    };
    // ============ Undo ============
    CommandHandler.prototype.canUndo = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        var undoManager = this._diagram.undoManager;
        if (!undoManager)
            return false;
        return undoManager.canUndo;
    };
    CommandHandler.prototype.undo = function () {
        if (!this.canUndo())
            return;
        this._diagram.undoManager.undo();
    };
    // ============ Redo ============
    CommandHandler.prototype.canRedo = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        var undoManager = this._diagram.undoManager;
        if (!undoManager)
            return false;
        return undoManager.canRedo;
    };
    CommandHandler.prototype.redo = function () {
        if (!this.canRedo())
            return;
        this._diagram.undoManager.redo();
    };
    // ============ Select All ============
    CommandHandler.prototype.canSelectAll = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (!this._diagram.allowSelect)
            return false;
        return true;
    };
    CommandHandler.prototype.selectAll = function () {
        var e_6, _a;
        if (!this.canSelectAll())
            return;
        var parts = [];
        var layers = this._diagram._layers;
        try {
            for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                var layer = layers_1_1.value;
                if (layer.isTemporary)
                    continue;
                var it = layer.parts;
                while (it.next()) {
                    var part = it.value;
                    if (part.selectable) {
                        parts.push(part);
                    }
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        this._diagram.selectCollection({
            iterator: {
                _items: parts,
                _idx: 0,
                next: function () { if (this._idx < this._items.length) {
                    this.value = this._items[this._idx++];
                    return true;
                } return false; },
                value: null
            }
        });
    };
    // ============ Zoom To Fit ============
    CommandHandler.prototype.canZoomToFit = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (!this._diagram.allowZoom)
            return false;
        return true;
    };
    CommandHandler.prototype.zoomToFit = function () {
        if (!this.canZoomToFit())
            return;
        var db = this._diagram.documentBounds;
        var vs = this._diagram.viewSize;
        if (db.width === 0 || db.height === 0 || vs.width === 0 || vs.height === 0)
            return;
        var scale = Math.min(vs.width / db.width, vs.height / db.height);
        this._diagram.scale = scale;
        this._diagram.position = db.position;
    };
    // ============ Zoom In ============
    CommandHandler.prototype.canZoomIn = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (!this._diagram.allowZoom)
            return false;
        return true;
    };
    CommandHandler.prototype.zoomIn = function () {
        if (!this.canZoomIn())
            return;
        this._diagram.scale = this._diagram.scale * 1.1;
    };
    // ============ Zoom Out ============
    CommandHandler.prototype.canZoomOut = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (!this._diagram.allowZoom)
            return false;
        return true;
    };
    CommandHandler.prototype.zoomOut = function () {
        if (!this.canZoomOut())
            return;
        this._diagram.scale = this._diagram.scale / 1.1;
    };
    // ============ Group ============
    CommandHandler.prototype.canGroupSelection = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        if (!this._diagram.allowGroup)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.groupSelection = function () {
        if (!this.canGroupSelection())
            return;
        // Stub: group selected parts
    };
    // ============ Ungroup ============
    CommandHandler.prototype.canUngroupSelection = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        if (!this._diagram.allowUngroup)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.ungroupSelection = function () {
        if (!this.canUngroupSelection())
            return;
        // Stub: ungroup selected groups
    };
    // ============ Collapse SubGraph ============
    CommandHandler.prototype.canCollapseSubGraph = function (group) {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        return true;
    };
    CommandHandler.prototype.collapseSubGraph = function (group) {
        if (!this.canCollapseSubGraph(group))
            return;
        var diagram = this._diagram;
        if (!diagram)
            return;
        diagram.startTransaction('collapseSubGraph');
        if (group && typeof group.isSubGraphExpanded !== 'undefined') {
            group.isSubGraphExpanded = false;
        }
        else {
            diagram.selection.each(function (part) {
                if (part.isSubGraphExpanded !== undefined) {
                    part.isSubGraphExpanded = false;
                }
            });
        }
        diagram.commitTransaction('collapseSubGraph');
    };
    // ============ Expand SubGraph ============
    CommandHandler.prototype.canExpandSubGraph = function (group) {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        return true;
    };
    CommandHandler.prototype.expandSubGraph = function (group) {
        if (!this.canExpandSubGraph(group))
            return;
        var diagram = this._diagram;
        if (!diagram)
            return;
        diagram.startTransaction('expandSubGraph');
        if (group && typeof group.isSubGraphExpanded !== 'undefined') {
            group.isSubGraphExpanded = true;
        }
        else {
            diagram.selection.each(function (part) {
                if (part.isSubGraphExpanded !== undefined) {
                    part.isSubGraphExpanded = true;
                }
            });
        }
        diagram.commitTransaction('expandSubGraph');
    };
    // ============ Collapse Tree ============
    CommandHandler.prototype.canCollapseTree = function (node) {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        return true;
    };
    CommandHandler.prototype.collapseTree = function (node) {
        if (!this.canCollapseTree(node))
            return;
        var diagram = this._diagram;
        if (!diagram)
            return;
        diagram.startTransaction('collapseTree');
        if (node && typeof node.isTreeExpanded !== 'undefined') {
            node.isTreeExpanded = false;
        }
        else {
            diagram.selection.each(function (part) {
                if (part.isTreeExpanded !== undefined) {
                    part.isTreeExpanded = false;
                }
            });
        }
        diagram.commitTransaction('collapseTree');
    };
    // ============ Expand Tree ============
    CommandHandler.prototype.canExpandTree = function (node) {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        return true;
    };
    CommandHandler.prototype.expandTree = function (node) {
        if (!this.canExpandTree(node))
            return;
        var diagram = this._diagram;
        if (!diagram)
            return;
        diagram.startTransaction('expandTree');
        if (node && typeof node.isTreeExpanded !== 'undefined') {
            node.isTreeExpanded = true;
        }
        else {
            diagram.selection.each(function (part) {
                if (part.isTreeExpanded !== undefined) {
                    part.isTreeExpanded = true;
                }
            });
        }
        diagram.commitTransaction('expandTree');
    };
    // ============ Align ============
    CommandHandler.prototype.canAlignSelection = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.alignSelection = function (alignment) {
        if (!this.canAlignSelection())
            return;
        // Stub: align selected parts
    };
    // ============ Rotate ============
    CommandHandler.prototype.canRotate = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        if (!this._diagram.allowRotate)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.rotate = function (angle) {
        if (!this.canRotate())
            return;
        // Stub: rotate selected parts by angle
    };
    // ============ Bring To Front ============
    CommandHandler.prototype.canBringToFront = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.bringToFront = function () {
        if (!this.canBringToFront())
            return;
        // Stub: bring selected parts to front
    };
    // ============ Send To Back ============
    CommandHandler.prototype.canSendToBack = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.sendToBack = function () {
        if (!this.canSendToBack())
            return;
        // Stub: send selected parts to back
    };
    CommandHandler.prototype.canMoveSelection = function () {
        if (!this._isEnabled)
            return false;
        if (!this._diagram)
            return false;
        if (this._diagram.isReadOnly)
            return false;
        if (!this._diagram.allowMove)
            return false;
        return this._diagram.selection.count > 0;
    };
    CommandHandler.prototype.moveSelection = function (dx, dy) {
        if (!this.canMoveSelection())
            return;
        this._diagram.startTransaction('move selection');
        var sel = this._diagram.selection;
        var it = sel.iterator;
        while (it.next()) {
            var part = it.value;
            if (part._className === 'Node' || part._className === 'Group') {
                var pos = part.position;
                if (pos) {
                    part.move(new Point(pos.x + dx, pos.y + dy));
                }
            }
        }
        this._diagram.commitTransaction('move selection');
    };
    // ============ Keyboard Handling ============
    CommandHandler.prototype.doKeyDown = function () {
        if (!this._isEnabled || !this._diagram)
            return;
        var e = this._diagram.lastInput;
        if (!e)
            return;
        var key = e.key;
        var control = e.control || e.meta;
        var shift = e.shift;
        if (control && key === 'z' && !shift) {
            if (this.canUndo())
                this.undo();
        }
        else if (control && key === 'z' && shift) {
            if (this.canRedo())
                this.redo();
        }
        else if (control && key === 'y') {
            if (this.canRedo())
                this.redo();
        }
        else if (control && key === 'a') {
            if (this.canSelectAll())
                this.selectAll();
        }
        else if (control && key === 'c') {
            if (this.canCopy())
                this.copySelection();
        }
        else if (control && key === 'x') {
            if (this.canCut())
                this.cutSelection();
        }
        else if (control && key === 'v') {
            if (this.canPaste())
                this.pasteSelection();
        }
        else if (key === 'Delete' || key === 'Backspace') {
            if (this.canDeleteSelection())
                this.deleteSelection();
        }
        else if (key === '+' || key === '=') {
            if (control && this.canZoomIn())
                this.zoomIn();
        }
        else if (key === '-' || key === '_') {
            if (control && this.canZoomOut())
                this.zoomOut();
        }
        else if (key === '0') {
            if (control && this.canZoomToFit())
                this.zoomToFit();
        }
        else if (control && key === 'g') {
            if (shift) {
                if (this.canUngroupSelection())
                    this.ungroupSelection();
            }
            else {
                if (this.canGroupSelection())
                    this.groupSelection();
            }
        }
        else if (key === 'ArrowLeft') {
            if (this.canMoveSelection())
                this.moveSelection(shift ? -10 : -1, 0);
        }
        else if (key === 'ArrowRight') {
            if (this.canMoveSelection())
                this.moveSelection(shift ? 10 : 1, 0);
        }
        else if (key === 'ArrowUp') {
            if (this.canMoveSelection())
                this.moveSelection(0, shift ? -10 : -1);
        }
        else if (key === 'ArrowDown') {
            if (this.canMoveSelection())
                this.moveSelection(0, shift ? 10 : 1);
        }
    };
    CommandHandler._clipboard = [];
    return CommandHandler;
}());

var Animation = /** @class */ (function () {
    function Animation() {
        this._isRunning = false;
        this._duration = 200;
        this._easing = Animation.EaseInOut;
        this._reversible = false;
        this._state = exports.AnimationState.Inactive;
        this._animations = [];
        this._startTime = 0;
        this._manager = null;
        this._finished = null;
    }
    Animation.EaseLinear = function (t) {
        return t;
    };
    Animation.EaseInOut = function (t) {
        if (t < 0.5) {
            return 2 * t * t;
        }
        return -1 + (4 - 2 * t) * t;
    };
    Animation.EaseIn = function (t) {
        return t * t;
    };
    Animation.EaseOut = function (t) {
        return t * (2 - t);
    };
    Object.defineProperty(Animation.prototype, "isRunning", {
        get: function () {
            return this._isRunning;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        set: function (val) {
            this._duration = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "easing", {
        get: function () {
            return this._easing;
        },
        set: function (val) {
            this._easing = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "reversible", {
        get: function () {
            return this._reversible;
        },
        set: function (val) {
            this._reversible = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "manager", {
        get: function () {
            return this._manager;
        },
        set: function (val) {
            this._manager = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Animation.prototype, "finished", {
        get: function () {
            return this._finished;
        },
        set: function (val) {
            this._finished = val;
        },
        enumerable: false,
        configurable: true
    });
    Animation.prototype.add = function (targetOrConfig, property, fromValue, toValue) {
        if (typeof targetOrConfig === 'object' && property !== undefined) {
            this._animations.push({
                target: targetOrConfig,
                property: property,
                from: fromValue,
                to: toValue
            });
        }
        else {
            this._animations.push(targetOrConfig);
        }
    };
    Animation.prototype.start = function () {
        if (this._isRunning)
            return;
        this._isRunning = true;
        this._state = exports.AnimationState.Running;
        this._startTime = performance.now();
        if (this._manager && typeof this._manager.registerAnimation === 'function') {
            this._manager.registerAnimation(this);
        }
    };
    Animation.prototype.stop = function () {
        if (!this._isRunning)
            return;
        this._isRunning = false;
        this._state = exports.AnimationState.Stopped;
    };
    Animation.prototype.finish = function () {
        var e_1, _a;
        if (!this._isRunning)
            return;
        try {
            for (var _b = __values(this._animations), _c = _b.next(); !_c.done; _c = _b.next()) {
                var config = _c.value;
                if (config.target && config.property) {
                    this._setPropertyValue(config, config.to);
                }
                if (config.onFinish) {
                    config.onFinish();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._isRunning = false;
        this._state = exports.AnimationState.Finished;
        if (this._finished) {
            this._finished();
        }
    };
    Animation.prototype.restart = function () {
        var e_2, _a;
        this.stop();
        try {
            for (var _b = __values(this._animations), _c = _b.next(); !_c.done; _c = _b.next()) {
                var config = _c.value;
                if (config.target && config.property) {
                    this._setPropertyValue(config, config.from);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.start();
    };
    Animation.prototype.update = function (now) {
        var e_3, _a, e_4, _b;
        if (!this._isRunning)
            return;
        var elapsed = now - this._startTime;
        var progress = Math.min(elapsed / this._duration, 1);
        var easedProgress = this._easing(progress);
        try {
            for (var _c = __values(this._animations), _d = _c.next(); !_d.done; _d = _c.next()) {
                var config = _d.value;
                if (config.target && config.property) {
                    this._interpolate(config, easedProgress);
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_3) throw e_3.error; }
        }
        if (progress >= 1) {
            this._isRunning = false;
            this._state = exports.AnimationState.Finished;
            try {
                for (var _e = __values(this._animations), _f = _e.next(); !_f.done; _f = _e.next()) {
                    var config = _f.value;
                    if (config.onFinish) {
                        config.onFinish();
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                }
                finally { if (e_4) throw e_4.error; }
            }
            if (this._finished) {
                this._finished();
            }
        }
    };
    Animation.prototype._interpolate = function (config, t) {
        var from = config.from;
        var to = config.to;
        if (from instanceof Point && to instanceof Point) {
            var current = new Point(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t);
            config.target[config.property] = current;
        }
        else if (from instanceof Rect && to instanceof Rect) {
            var current = new Rect(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, from.width + (to.width - from.width) * t, from.height + (to.height - from.height) * t);
            config.target[config.property] = current;
        }
        else if (typeof from === 'number' && typeof to === 'number') {
            var current = from + (to - from) * t;
            config.target[config.property] = current;
        }
        else {
            if (t >= 1) {
                config.target[config.property] = to;
            }
        }
    };
    Animation.prototype._setPropertyValue = function (config, value) {
        if (value instanceof Point) {
            config.target[config.property] = value.copy();
        }
        else if (value instanceof Rect) {
            config.target[config.property] = value.copy();
        }
        else {
            config.target[config.property] = value;
        }
    };
    return Animation;
}());
exports.AnimationState = void 0;
(function (AnimationState) {
    AnimationState["Inactive"] = "Inactive";
    AnimationState["Running"] = "Running";
    AnimationState["Stopped"] = "Stopped";
    AnimationState["Finished"] = "Finished";
})(exports.AnimationState || (exports.AnimationState = {}));

var AnimationManager = /** @class */ (function () {
    function AnimationManager() {
        this._diagram = null;
        this._isEnabled = true;
        this._duration = 200;
        this._isAnimating = false;
        this._isInitial = true;
        this._isTicking = false;
        this._activeAnimations = [];
        this._frameId = 0;
        this._defaultAnimation = null;
    }
    Object.defineProperty(AnimationManager.prototype, "diagram", {
        get: function () {
            return this._diagram;
        },
        set: function (val) {
            this._diagram = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationManager.prototype, "isEnabled", {
        get: function () {
            return this._isEnabled;
        },
        set: function (val) {
            this._isEnabled = val;
            if (!val) {
                this.stopAnimation();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationManager.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        set: function (val) {
            this._duration = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationManager.prototype, "isAnimating", {
        get: function () {
            return this._isAnimating;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationManager.prototype, "isInitial", {
        get: function () {
            return this._isInitial;
        },
        set: function (val) {
            this._isInitial = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationManager.prototype, "isTicking", {
        get: function () {
            return this._isTicking;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationManager.prototype, "defaultAnimation", {
        get: function () {
            if (!this._defaultAnimation) {
                this._defaultAnimation = this._createDefaultAnimation();
            }
            return this._defaultAnimation;
        },
        enumerable: false,
        configurable: true
    });
    AnimationManager.prototype._createDefaultAnimation = function () {
        var anim = new Animation();
        anim.duration = this._duration;
        anim.manager = this;
        return anim;
    };
    AnimationManager.prototype.startAnimation = function (anim) {
        if (!this._isEnabled)
            return;
        if (anim) {
            this.registerAnimation(anim);
        }
        if (this._isAnimating)
            return;
        this._isAnimating = true;
        this._isInitial = false;
        this._startTicking();
    };
    AnimationManager.prototype.stopAnimation = function () {
        var e_1, _a;
        if (!this._isAnimating)
            return;
        this._isAnimating = false;
        try {
            for (var _b = __values(this._activeAnimations), _c = _b.next(); !_c.done; _c = _b.next()) {
                var anim = _c.value;
                anim.stop();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this._activeAnimations = [];
        this._stopTicking();
    };
    AnimationManager.prototype.registerAnimation = function (anim) {
        if (this._activeAnimations.indexOf(anim) < 0) {
            this._activeAnimations.push(anim);
        }
        anim.manager = this;
        if (!this._isAnimating && this._isEnabled) {
            this._isAnimating = true;
            this._isInitial = false;
            this._startTicking();
        }
    };
    AnimationManager.prototype.defineAnimationEffect = function (name, effect) {
        AnimationManager._effects[name] = effect;
    };
    AnimationManager.getEffect = function (name) {
        return AnimationManager._effects[name];
    };
    AnimationManager.prototype.updateAnimation = function () {
        var e_2, _a;
        if (!this._isAnimating)
            return;
        var now = performance.now();
        try {
            for (var _b = __values(this._activeAnimations), _c = _b.next(); !_c.done; _c = _b.next()) {
                var anim = _c.value;
                if (anim.isRunning) {
                    anim.update(now);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this._activeAnimations = this._activeAnimations.filter(function (a) { return a.isRunning; });
        if (this._activeAnimations.length === 0) {
            this._isAnimating = false;
            this._stopTicking();
        }
        if (this._diagram && typeof this._diagram.requestUpdate === 'function') {
            this._diagram.requestUpdate();
        }
    };
    AnimationManager.prototype._startTicking = function () {
        if (this._isTicking)
            return;
        this._isTicking = true;
        this._tick();
    };
    AnimationManager.prototype._stopTicking = function () {
        this._isTicking = false;
        if (this._frameId) {
            cancelAnimationFrame(this._frameId);
            this._frameId = 0;
        }
    };
    AnimationManager.prototype._tick = function () {
        var _this = this;
        if (!this._isTicking)
            return;
        this.updateAnimation();
        if (this._isTicking) {
            this._frameId = requestAnimationFrame(function () { return _this._tick(); });
        }
    };
    AnimationManager._effects = {};
    return AnimationManager;
}());

var ThemeManager = /** @class */ (function () {
    function ThemeManager() {
        this._diagram = null;
        this._themes = {};
        this._currentTheme = 'light';
    }
    Object.defineProperty(ThemeManager.prototype, "diagram", {
        get: function () { return this._diagram; },
        set: function (val) { this._diagram = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ThemeManager.prototype, "currentTheme", {
        get: function () { return this._currentTheme; },
        set: function (val) {
            this._currentTheme = val;
            this._applyTheme(val);
        },
        enumerable: false,
        configurable: true
    });
    ThemeManager.prototype.set = function (themeName, themeData) {
        this._themes[themeName] = themeData;
    };
    ThemeManager.prototype._applyTheme = function (themeName) {
        var theme = this._themes[themeName];
        if (!theme || !this._diagram)
            return;
    };
    ThemeManager.prototype.findColor = function (colorName, themeName) {
        var name = themeName || this._currentTheme;
        var theme = this._themes[name];
        if (!theme || !theme.colors)
            return '';
        return theme.colors[colorName] || '';
    };
    return ThemeManager;
}());

var Diagram = /** @class */ (function () {
    function Diagram(divId, options) {
        var _this = this;
        this._div = null;
        this._model = new Model();
        this._modelChangeListener = null;
        this._position = Point.Zero.copy();
        this._scale = 1;
        this._minScale = 0;
        this._maxScale = Infinity;
        this._padding = new Margin(0);
        this._allowSelect = true;
        this._allowMove = true;
        this._allowCopy = true;
        this._allowDelete = true;
        this._allowGroup = true;
        this._allowUngroup = true;
        this._allowLink = true;
        this._allowRelink = true;
        this._allowTextEdit = true;
        this._allowDragOut = true;
        this._allowDrop = true;
        this._allowClipboard = true;
        this._allowInsert = true;
        this._allowHorizontalScroll = true;
        this._allowVerticalScroll = true;
        this._allowZoom = true;
        this._allowReshape = true;
        this._allowResize = true;
        this._allowRotate = true;
        this._allowUndo = true;
        this._isReadOnly = false;
        this._isEnabled = true;
        this._nodeTemplateMap = new Map$1();
        this._linkTemplateMap = new Map$1();
        this._groupTemplate = null;
        this._groupTemplateMap = new Map$1();
        this._selection = new Set();
        this._maxSelectionCount = Infinity;
        this._layout = null;
        this._isInitial = true;
        this._layoutInvalid = false;
        this._contextMenu = null;
        this._layers = [];
        this._parts = new Map$1();
        this._nodeKeyMap = new Map$1();
        this._changedListeners = [];
        this._diagramListeners = new Map$1();
        this._needsRender = false;
        this._animationFrameId = 0;
        this._resizeObserver = null;
        this._lastDivWidth = 0;
        this._lastDivHeight = 0;
        this._lastInput = new InputEvent();
        this._currentTool = null;
        this._initialContentAlignment = null;
        this._initialAutoScale = null;
        this._initialPosition = null;
        this._initialScale = NaN;
        this._contentAlignment = Spot.Default;
        this._autoScale = null;
        this._hasPerformedInitialLayout = false;
        var div = null;
        if (typeof divId === 'string') {
            var el = document.getElementById(divId);
            if (el instanceof HTMLDivElement) {
                div = el;
            }
        }
        else {
            div = divId;
        }
        this._div = div;
        this._toolManager = new ToolManager();
        this._commandHandler = new CommandHandler();
        this._animationManager = new AnimationManager();
        this._themeManager = new ThemeManager();
        if (div) {
            div.style.position = 'relative';
            div.style.overflow = 'hidden';
            div.setAttribute('tabindex', '0');
            div._goDiagram = this;
            this._renderer = new CanvasRenderer(div);
            this._renderer.diagram = this;
            this._setupResizeObserver();
            this._setupMouseEvents();
            this._setupKeyboardEvents();
        }
        else {
            this._renderer = null;
        }
        this._toolManager.diagram = this;
        this._commandHandler.diagram = this;
        this._animationManager.diagram = this;
        this._themeManager.diagram = this;
        this._createDefaultLayers();
        this._nodeTemplate = this._createDefaultNodeTemplate();
        this._linkTemplate = this._createDefaultLinkTemplate();
        this._modelChangeListener = function (e) { return _this._onModelChanged(e); };
        this._model.addChangedListener(this._modelChangeListener);
        if (options) {
            this.set(options);
        }
    }
    Object.defineProperty(Diagram.prototype, "div", {
        // ============ Core Properties ============
        get: function () {
            return this._div;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "model", {
        get: function () {
            return this._model;
        },
        set: function (val) {
            if (this._model === val)
                return;
            if (this._modelChangeListener) {
                this._model.removeChangedListener(this._modelChangeListener);
            }
            this._model = val;
            if (this._modelChangeListener) {
                this._model.addChangedListener(this._modelChangeListener);
            }
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "renderer", {
        get: function () {
            return this._renderer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "toolManager", {
        get: function () {
            return this._toolManager;
        },
        set: function (val) {
            if (this._toolManager) {
                this._toolManager.diagram = null;
            }
            this._toolManager = val;
            if (val) {
                val.diagram = this;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "commandHandler", {
        get: function () {
            return this._commandHandler;
        },
        set: function (val) {
            if (this._commandHandler) {
                this._commandHandler.diagram = null;
            }
            this._commandHandler = val;
            if (val) {
                val.diagram = this;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "animationManager", {
        get: function () {
            return this._animationManager;
        },
        set: function (val) {
            if (this._animationManager) {
                this._animationManager.diagram = null;
            }
            this._animationManager = val;
            if (val) {
                val.diagram = this;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "themeManager", {
        get: function () {
            return this._themeManager;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "undoManager", {
        get: function () {
            return this._model.undoManager;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "lastInput", {
        get: function () {
            return this._toolManager.lastInput;
        },
        set: function (val) {
            this._toolManager.lastInput = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "currentTool", {
        get: function () {
            return this._toolManager.currentTool;
        },
        set: function (val) {
            this._toolManager.currentTool = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "defaultTool", {
        get: function () {
            return this._toolManager.defaultTool;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "position", {
        // ============ Viewport Properties ============
        get: function () {
            return this._position;
        },
        set: function (val) {
            if (this._position.equals(val))
                return;
            this._position = val.copy();
            this._raiseDiagramEvent('ViewportChanged');
            this.requestUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "scale", {
        get: function () {
            return this._scale;
        },
        set: function (val) {
            val = Math.max(this._minScale, Math.min(this._maxScale, val));
            if (this._scale === val)
                return;
            this._scale = val;
            this._raiseDiagramEvent('ViewportChanged');
            this.requestUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "viewportBounds", {
        get: function () {
            var vs = this.viewSize;
            return new Rect(this._position.x, this._position.y, vs.width / this._scale, vs.height / this._scale);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "documentBounds", {
        get: function () {
            var e_1, _a;
            var bounds = new Rect();
            var layers = this._layers;
            try {
                for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                    var layer = layers_1_1.value;
                    if (layer.isTemporary)
                        continue;
                    var partsIt = layer.parts;
                    while (partsIt.next()) {
                        var part = partsIt.value;
                        if (!part.visible)
                            continue;
                        if (!part.isInDocumentBounds)
                            continue;
                        var partBounds = part.getDocumentBounds();
                        bounds = bounds.union(partBounds);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (bounds.isReal) {
                bounds = new Rect(bounds.x - this._padding.left, bounds.y - this._padding.top, bounds.width + this._padding.left + this._padding.right, bounds.height + this._padding.top + this._padding.bottom);
            }
            return bounds;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "viewSize", {
        get: function () {
            if (this._div) {
                return new Size(this._div.clientWidth, this._div.clientHeight);
            }
            return new Size(0, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        set: function (val) {
            var m = typeof val === 'number' ? new Margin(val) : val;
            if (this._padding.equals(m))
                return;
            this._padding = m.copy();
            this.requestUpdate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "minScale", {
        get: function () { return this._minScale; },
        set: function (val) { this._minScale = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "maxScale", {
        get: function () { return this._maxScale; },
        set: function (val) { this._maxScale = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowSelect", {
        // ============ Permission Properties ============
        get: function () { return this._allowSelect; },
        set: function (val) { this._allowSelect = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowMove", {
        get: function () { return this._allowMove; },
        set: function (val) { this._allowMove = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowCopy", {
        get: function () { return this._allowCopy; },
        set: function (val) { this._allowCopy = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowDelete", {
        get: function () { return this._allowDelete; },
        set: function (val) { this._allowDelete = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowGroup", {
        get: function () { return this._allowGroup; },
        set: function (val) { this._allowGroup = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowUngroup", {
        get: function () { return this._allowUngroup; },
        set: function (val) { this._allowUngroup = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowLink", {
        get: function () { return this._allowLink; },
        set: function (val) { this._allowLink = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowRelink", {
        get: function () { return this._allowRelink; },
        set: function (val) { this._allowRelink = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowTextEdit", {
        get: function () { return this._allowTextEdit; },
        set: function (val) { this._allowTextEdit = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowDragOut", {
        get: function () { return this._allowDragOut; },
        set: function (val) { this._allowDragOut = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowDrop", {
        get: function () { return this._allowDrop; },
        set: function (val) { this._allowDrop = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowClipboard", {
        get: function () { return this._allowClipboard; },
        set: function (val) { this._allowClipboard = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowInsert", {
        get: function () { return this._allowInsert; },
        set: function (val) { this._allowInsert = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowHorizontalScroll", {
        get: function () { return this._allowHorizontalScroll; },
        set: function (val) { this._allowHorizontalScroll = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowVerticalScroll", {
        get: function () { return this._allowVerticalScroll; },
        set: function (val) { this._allowVerticalScroll = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowZoom", {
        get: function () { return this._allowZoom; },
        set: function (val) { this._allowZoom = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowReshape", {
        get: function () { return this._allowReshape; },
        set: function (val) { this._allowReshape = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowResize", {
        get: function () { return this._allowResize; },
        set: function (val) { this._allowResize = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowRotate", {
        get: function () { return this._allowRotate; },
        set: function (val) { this._allowRotate = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "allowUndo", {
        get: function () { return this._allowUndo; },
        set: function (val) { this._allowUndo = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "isReadOnly", {
        get: function () { return this._isReadOnly; },
        set: function (val) { this._isReadOnly = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "isEnabled", {
        get: function () { return this._isEnabled; },
        set: function (val) { this._isEnabled = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "nodeTemplate", {
        // ============ Template Properties ============
        get: function () {
            return this._nodeTemplate;
        },
        set: function (val) {
            this._nodeTemplate = val;
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "nodeTemplateMap", {
        get: function () {
            return this._nodeTemplateMap;
        },
        set: function (val) {
            this._nodeTemplateMap = val;
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "linkTemplate", {
        get: function () {
            return this._linkTemplate;
        },
        set: function (val) {
            this._linkTemplate = val;
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "linkTemplateMap", {
        get: function () {
            return this._linkTemplateMap;
        },
        set: function (val) {
            this._linkTemplateMap = val;
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "groupTemplate", {
        get: function () {
            return this._groupTemplate;
        },
        set: function (val) {
            this._groupTemplate = val;
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "groupTemplateMap", {
        get: function () {
            return this._groupTemplateMap;
        },
        set: function (val) {
            this._groupTemplateMap = val;
            this.rebuildParts();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "parts", {
        // ============ Collection Properties ============
        get: function () {
            var result = new List();
            var it = this._parts.values;
            while (it.next()) {
                result.add(it.value);
            }
            return result.iterator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "nodes", {
        get: function () {
            var result = new List();
            var it = this._parts.values;
            while (it.next()) {
                var part = it.value;
                if (part instanceof Node)
                    result.add(part);
            }
            return result.iterator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "links", {
        get: function () {
            var result = new List();
            var it = this._parts.values;
            while (it.next()) {
                var part = it.value;
                if (part instanceof Link)
                    result.add(part);
            }
            return result.iterator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "selection", {
        // ============ Selection Properties ============
        get: function () {
            return this._selection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "maxSelectionCount", {
        get: function () {
            return this._maxSelectionCount;
        },
        set: function (val) {
            this._maxSelectionCount = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "contextMenu", {
        get: function () { return this._contextMenu; },
        set: function (val) { this._contextMenu = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "layout", {
        // ============ Layout Properties ============
        get: function () {
            return this._layout;
        },
        set: function (val) {
            if (this._layout === val)
                return;
            if (this._layout) {
                this._layout._diagram = null;
            }
            this._layout = val;
            if (val) {
                val._diagram = this;
                this._layoutInvalid = true;
                this.requestUpdate();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "isInitial", {
        get: function () {
            return this._isInitial;
        },
        set: function (val) {
            this._isInitial = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "initialContentAlignment", {
        get: function () { return this._initialContentAlignment; },
        set: function (val) { this._initialContentAlignment = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "initialAutoScale", {
        get: function () { return this._initialAutoScale; },
        set: function (val) { this._initialAutoScale = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "initialPosition", {
        get: function () { return this._initialPosition; },
        set: function (val) { this._initialPosition = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "initialScale", {
        get: function () { return this._initialScale; },
        set: function (val) { this._initialScale = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "contentAlignment", {
        get: function () { return this._contentAlignment; },
        set: function (val) { this._contentAlignment = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "autoScale", {
        get: function () { return this._autoScale; },
        set: function (val) { this._autoScale = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Diagram.prototype, "layers", {
        // ============ Layer Management ============
        get: function () {
            return new List(this._layers).iterator;
        },
        enumerable: false,
        configurable: true
    });
    Diagram.prototype.addLayer = function (layer) {
        layer.diagram = this;
        this._layers.push(layer);
        this.requestUpdate();
    };
    Diagram.prototype.removeLayer = function (layer) {
        var idx = this._layers.indexOf(layer);
        if (idx >= 0) {
            this._layers.splice(idx, 1);
            layer.diagram = null;
            this.requestUpdate();
        }
    };
    Diagram.prototype.findLayer = function (name) {
        var e_2, _a;
        try {
            for (var _b = __values(this._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.name === name)
                    return layer;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
    };
    // ============ Part Management ============
    Diagram.prototype.add = function (part) {
        var e_3, _a;
        var layerName = part.layerName || '';
        var layer = this.findLayer(layerName);
        if (!layer) {
            try {
                for (var _b = __values(this._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var l = _c.value;
                    if (!l.isTemporary && l.name !== 'Background') {
                        layer = l;
                        break;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        if (!layer && this._layers.length > 0) {
            layer = this._layers[0];
        }
        if (layer) {
            layer.add(part);
        }
        part._diagram = this;
        this.requestUpdate();
    };
    Diagram.prototype.remove = function (part) {
        var e_4, _a;
        try {
            for (var _b = __values(this._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.contains(part)) {
                    layer.remove(part);
                    part._diagram = null;
                    if (part.isSelected) {
                        this._selection.remove(part);
                    }
                    this.requestUpdate();
                    return;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    Diagram.prototype.findNodeForKey = function (key) {
        return this._nodeKeyMap.get(key) || null;
    };
    Diagram.prototype.findLinkForData = function (data) {
        var part = this._parts.get(data);
        if (part instanceof Link)
            return part;
        return null;
    };
    Diagram.prototype.findPartForKey = function (key) {
        var node = this._nodeKeyMap.get(key);
        if (node)
            return node;
        if (this._model instanceof GraphLinksModel) {
            var linkData = this._model.findLinkDataForKey(key);
            if (linkData) {
                var part = this._parts.get(linkData);
                if (part)
                    return part;
            }
        }
        return null;
    };
    Diagram.prototype.findNodesByExample = function (data) {
        var result = new List();
        if (!data)
            return result;
        var keys = Object.keys(data);
        var it = this._parts.values;
        while (it.next()) {
            var part = it.value;
            if (!(part instanceof Node))
                continue;
            var d = part.data;
            if (!d)
                continue;
            var match = true;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (d[key] !== data[key]) {
                    match = false;
                    break;
                }
            }
            if (match)
                result.add(part);
        }
        return result;
    };
    Diagram.prototype.findLinksByExample = function (data) {
        var result = new List();
        if (!data)
            return result;
        var keys = Object.keys(data);
        var it = this._parts.values;
        while (it.next()) {
            var part = it.value;
            if (!(part instanceof Link))
                continue;
            var d = part.data;
            if (!d)
                continue;
            var match = true;
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (d[key] !== data[key]) {
                    match = false;
                    break;
                }
            }
            if (match)
                result.add(part);
        }
        return result;
    };
    Diagram.prototype.findPartAt = function (point, selectableOnly) {
        if (selectableOnly === void 0) { selectableOnly = false; }
        for (var i = this._layers.length - 1; i >= 0; i--) {
            var layer = this._layers[i];
            if (!layer.visible)
                continue;
            if (layer.isTemporary)
                continue;
            var partsIt = layer.parts;
            var partsArray = partsIt.toArray();
            for (var j = partsArray.length - 1; j >= 0; j--) {
                var part = partsArray[j];
                if (!part.visible)
                    continue;
                if (selectableOnly && !part.selectable)
                    continue;
                var bounds = part.getDocumentBounds();
                if (bounds.containsPoint(point)) {
                    return part;
                }
            }
        }
        return null;
    };
    Diagram.prototype.findObjectAt = function (point) {
        var part = this.findPartAt(point);
        if (part) {
            var loc = part.location;
            var localPoint = new Point(point.x - loc.x, point.y - loc.y);
            return this._findObjectInPanel(part, localPoint);
        }
        return null;
    };
    Diagram.prototype.findNodeAt = function (point) {
        var part = this.findPartAt(point);
        if (part instanceof Node)
            return part;
        return null;
    };
    // ============ Selection Methods ============
    Diagram.prototype.select = function (part) {
        this.clearSelection();
        if (this._allowSelect && part.selectable) {
            part.isSelected = true;
            this._selection.add(part);
        }
    };
    Diagram.prototype.clearSelection = function () {
        var e_5, _a;
        var hadSelection = this._selection.count > 0;
        var it = this._selection.iterator;
        var parts = [];
        while (it.next()) {
            var part = it.value;
            part._isSelected = false;
            parts.push(part);
        }
        this._selection.clear();
        try {
            for (var parts_1 = __values(parts), parts_1_1 = parts_1.next(); !parts_1_1.done; parts_1_1 = parts_1.next()) {
                var part = parts_1_1.value;
                var ad = part.getAdornment('Selection');
                if (ad) {
                    var adornmentLayer = this.findLayer('Adornment');
                    if (adornmentLayer)
                        adornmentLayer.remove(ad);
                    part.removeAdornment('Selection');
                }
                if (this._toolManager) {
                    this._toolManager.updateAdornments(part);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (parts_1_1 && !parts_1_1.done && (_a = parts_1.return)) _a.call(parts_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        if (hadSelection) {
            this.raiseDiagramEvent('ChangedSelection', this._selection);
        }
    };
    Diagram.prototype.selectCollection = function (parts) {
        this.clearSelection();
        if (!this._allowSelect)
            return;
        var it = parts.iterator;
        while (it.next()) {
            var part = it.value;
            if (part.selectable && this._selection.count < this._maxSelectionCount) {
                part._isSelected = true;
                this._selection.add(part);
                if (part.selectionAdorned) {
                    var ad = part._createSelectionAdornment();
                    part.addAdornment('Selection', ad);
                    var adornmentLayer = this.findLayer('Adornment');
                    if (adornmentLayer)
                        adornmentLayer.add(ad);
                }
                if (this._toolManager) {
                    this._toolManager.updateAdornments(part);
                }
            }
        }
        if (this._selection.count > 0) {
            this.raiseDiagramEvent('ChangedSelection', this._selection);
        }
    };
    // ============ Transaction Methods ============
    Diagram.prototype.startTransaction = function (tname) {
        if (tname === void 0) { tname = ''; }
        return this._model.startTransaction(tname);
    };
    Diagram.prototype.commitTransaction = function (tname) {
        if (tname === void 0) { tname = ''; }
        return this._model.commitTransaction(tname);
    };
    Diagram.prototype.rollbackTransaction = function () {
        return this._model.rollbackTransaction();
    };
    Diagram.prototype.commit = function (func, tname) {
        if (tname === void 0) { tname = 'commit'; }
        return this._model.commit(func, tname);
    };
    // ============ Event Methods ============
    Diagram.prototype.addDiagramListener = function (name, listener) {
        var listeners = this._diagramListeners.get(name);
        if (!listeners) {
            listeners = [];
            this._diagramListeners.set(name, listeners);
        }
        listeners.push(listener);
    };
    Diagram.prototype.removeDiagramListener = function (name, listener) {
        var listeners = this._diagramListeners.get(name);
        if (listeners) {
            var idx = listeners.indexOf(listener);
            if (idx >= 0)
                listeners.splice(idx, 1);
        }
    };
    Diagram.prototype.addChangedListener = function (listener) {
        this._changedListeners.push(listener);
    };
    Diagram.prototype.removeChangedListener = function (listener) {
        var idx = this._changedListeners.indexOf(listener);
        if (idx >= 0)
            this._changedListeners.splice(idx, 1);
    };
    // ============ Coordinate Conversion ============
    Diagram.prototype.transformDocToView = function (p) {
        return new Point((p.x - this._position.x) * this._scale + this._padding.left, (p.y - this._position.y) * this._scale + this._padding.top);
    };
    Diagram.prototype.transformViewToDoc = function (p) {
        return new Point((p.x - this._padding.left) / this._scale + this._position.x, (p.y - this._padding.top) / this._scale + this._position.y);
    };
    // ============ Update Methods ============
    Diagram.prototype.requestUpdate = function (invalidate) {
        var _this = this;
        if (!this._needsRender) {
            this._needsRender = true;
            this._animationFrameId = requestAnimationFrame(function () { return _this._renderLoop(); });
        }
    };
    Diagram.prototype.layoutDiagram = function (invalidate) {
        if (invalidate === void 0) { invalidate = true; }
        if (invalidate) {
            this._layoutInvalid = true;
        }
        this._performLayout();
        this.requestUpdate(invalidate);
    };
    Diagram.prototype.updateAllTargetBindings = function (propname) {
        var it = this._parts.values;
        while (it.next()) {
            var part = it.value;
            if (part instanceof Part) {
                this._updateBindingsForPart(part, propname);
            }
        }
        this.requestUpdate();
    };
    Diagram.prototype.zoomToFit = function () {
        var db = this.documentBounds;
        var vs = this.viewSize;
        if (db.width <= 0 || db.height <= 0 || vs.width <= 0 || vs.height <= 0)
            return;
        var scaleX = vs.width / db.width;
        var scaleY = vs.height / db.height;
        var newScale = Math.min(scaleX, scaleY);
        this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
        this._position = new Point(db.x, db.y);
        this._raiseDiagramEvent('ViewportChanged');
        this.requestUpdate();
    };
    Diagram.prototype.centerRect = function (r) {
        var vs = this.viewSize;
        var docW = vs.width / this._scale;
        var docH = vs.height / this._scale;
        this._position = new Point(r.x + r.width / 2 - docW / 2, r.y + r.height / 2 - docH / 2);
        this.requestUpdate();
    };
    Diagram.prototype.scrollToRect = function (r) {
        var vb = this.viewportBounds;
        var newX = this._position.x;
        var newY = this._position.y;
        if (r.x < vb.x)
            newX = r.x;
        else if (r.right > vb.right)
            newX = r.right - vb.width;
        if (r.y < vb.y)
            newY = r.y;
        else if (r.bottom > vb.bottom)
            newY = r.bottom - vb.height;
        this._position = new Point(newX, newY);
        this.requestUpdate();
    };
    Diagram.prototype.alignDocument = function (docSpot, viewSpot) {
        var db = this.documentBounds;
        var vs = this.viewSize;
        var docPoint = docSpot.positionInRect(db);
        var viewPoint = viewSpot.positionInRect(new Rect(0, 0, vs.width, vs.height));
        vs.width / this._scale;
        vs.height / this._scale;
        this._position = new Point(docPoint.x - viewPoint.x / this._scale, docPoint.y - viewPoint.y / this._scale);
        this.requestUpdate();
    };
    // ============ Rebuild Parts ============
    Diagram.prototype.rebuildParts = function () {
        var e_6, _a, e_7, _b, e_8, _c, e_9, _d;
        this._clearAllParts();
        var model = this._model;
        if (!model)
            return;
        try {
            for (var _e = __values(model.nodeDataArray), _f = _e.next(); !_f.done; _f = _e.next()) {
                var nodeData = _f.value;
                this._addNodeForData(nodeData);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
            }
            finally { if (e_6) throw e_6.error; }
        }
        try {
            for (var _g = __values(model.nodeDataArray), _h = _g.next(); !_h.done; _h = _g.next()) {
                var nodeData = _h.value;
                var groupKey = model.getGroupKeyForNodeData(nodeData);
                if (groupKey !== undefined && groupKey !== null) {
                    var node = this._nodeKeyMap.get(nodeData.key);
                    var groupNode = this._nodeKeyMap.get(groupKey);
                    if (node && groupNode && groupNode._memberParts !== undefined) {
                        node.containingGroup = groupNode;
                    }
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
            }
            finally { if (e_7) throw e_7.error; }
        }
        if (model instanceof GraphLinksModel) {
            var glm = model;
            try {
                for (var _j = __values(glm.linkDataArray), _k = _j.next(); !_k.done; _k = _j.next()) {
                    var linkData = _k.value;
                    this._addLinkForData(linkData);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        else if (model instanceof TreeModel) {
            var tm = model;
            try {
                for (var _l = __values(model.nodeDataArray), _m = _l.next(); !_m.done; _m = _l.next()) {
                    var nodeData = _m.value;
                    var parentKey = tm.getParentKeyForNodeData(nodeData);
                    if (parentKey !== undefined && parentKey !== null) {
                        this._addLinkForTreeData(nodeData, parentKey);
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
                }
                finally { if (e_9) throw e_9.error; }
            }
        }
        if (this._isInitial && this._layout) {
            this._layoutInvalid = true;
        }
        this.requestUpdate();
    };
    Diagram.fromDiv = function (id) {
        var div = document.getElementById(id);
        if (div && div._goDiagram) {
            return div._goDiagram;
        }
        return null;
    };
    // ============ Batch set ============
    Diagram.prototype.set = function (props) {
        for (var key in props) {
            if (key === 'model' || key === 'div')
                continue;
            if (key.indexOf('.') >= 0) {
                var parts = key.split('.');
                var target = this;
                for (var j = 0; j < parts.length - 1; j++) {
                    target = target[parts[j]];
                    if (!target)
                        break;
                }
                if (target) {
                    target[parts[parts.length - 1]] = props[key];
                }
            }
            else if (this[key] !== undefined) {
                this[key] = props[key];
            }
        }
        return this;
    };
    Diagram.prototype.focus = function () {
        if (this._div) {
            this._div.focus();
        }
    };
    // ============ Internal Methods ============
    Diagram.prototype._createDefaultLayers = function () {
        var e_10, _a;
        var names = ['Background', 'Grid', '', 'Foreground', 'Adornment', 'Tool'];
        try {
            for (var names_1 = __values(names), names_1_1 = names_1.next(); !names_1_1.done; names_1_1 = names_1.next()) {
                var name_1 = names_1_1.value;
                var layer = new Layer();
                layer.name = name_1;
                layer.diagram = this;
                if (name_1 === 'Adornment' || name_1 === 'Tool') {
                    layer.isTemporary = true;
                }
                this._layers.push(layer);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (names_1_1 && !names_1_1.done && (_a = names_1.return)) _a.call(names_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
        this._createDefaultGrid();
    };
    Diagram.prototype._createDefaultGrid = function () {
        var gridPanel = new Panel(PanelGrid);
        gridPanel._gridCellSize = new Size(50, 50);
        var lineH = new Shape();
        lineH.figure = 'LineH';
        lineH.stroke = 'lightgray';
        lineH.strokeWidth = 0.5;
        gridPanel.add(lineH);
        var lineV = new Shape();
        lineV.figure = 'LineV';
        lineV.stroke = 'lightgray';
        lineV.strokeWidth = 0.5;
        gridPanel.add(lineV);
        var gridPart = new Part();
        gridPart.add(gridPanel);
        gridPart.isInDocumentBounds = false;
        gridPart.layerName = 'Grid';
        gridPart.visible = false;
        var gridLayer = this.findLayer('Grid');
        if (gridLayer) {
            gridLayer.add(gridPart);
        }
        this._gridPart = gridPart;
    };
    Object.defineProperty(Diagram.prototype, "grid", {
        get: function () {
            var gridLayer = this.findLayer('Grid');
            if (!gridLayer)
                return null;
            var it = gridLayer.parts;
            while (it.next()) {
                var part = it.value;
                var panel = part._elements && part._elements.length > 0 ? part._elements[0] : null;
                if (panel && panel._type === PanelGrid) {
                    return panel;
                }
            }
            return null;
        },
        set: function (val) {
            var gridLayer = this.findLayer('Grid');
            if (!gridLayer)
                return;
            gridLayer.clear();
            if (val) {
                var gridPart = new Part();
                gridPart.add(val);
                gridPart.isInDocumentBounds = false;
                gridPart.layerName = 'Grid';
                gridLayer.add(gridPart);
            }
        },
        enumerable: false,
        configurable: true
    });
    Diagram.prototype._createDefaultNodeTemplate = function () {
        var node = new Node(PanelAuto);
        var shape = new Shape();
        shape.figure = 'Rectangle';
        shape.fill = 'red';
        shape.stroke = 'black';
        shape.width = 40;
        shape.height = 40;
        node.add(shape);
        return node;
    };
    Diagram.prototype._createDefaultLinkTemplate = function () {
        var link = new Link();
        var shape = new Shape();
        shape.stroke = 'black';
        shape.isPanelMain = true;
        link.add(shape);
        return link;
    };
    Diagram.prototype._clearAllParts = function () {
        var e_11, _a;
        try {
            for (var _b = __values(this._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                layer.clear();
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_11) throw e_11.error; }
        }
        this._parts.clear();
        this._nodeKeyMap.clear();
        this._selection.clear();
    };
    Diagram.prototype._addNodeForData = function (data) {
        if (!data)
            return null;
        var category = this._model.getCategoryForNodeData(data);
        var isGroup = this._model.isGroupForNodeData(data);
        var template = null;
        if (isGroup) {
            if (category && this._groupTemplateMap.has(category)) {
                template = this._groupTemplateMap.get(category);
            }
            else if (this._groupTemplate) {
                template = this._groupTemplate;
            }
            else if (this._nodeTemplateMap.has(category || '')) {
                template = this._nodeTemplateMap.get(category || '');
            }
            else {
                template = this._nodeTemplate;
            }
        }
        else {
            if (category && this._nodeTemplateMap.has(category)) {
                template = this._nodeTemplateMap.get(category);
            }
            else {
                template = this._nodeTemplate;
            }
        }
        var node = template.copy();
        node.data = data;
        var locX = data['loc'] !== undefined ? parseFloat(String(data['loc']).split(' ')[0]) : NaN;
        var locY = data['loc'] !== undefined ? parseFloat(String(data['loc']).split(' ')[1]) : NaN;
        if (!isNaN(locX) && !isNaN(locY)) {
            node.location = new Point(locX, locY);
        }
        var key = this._model.getKeyForNodeData(data);
        if (key !== undefined) {
            this._nodeKeyMap.set(key, node);
        }
        this._parts.set(data, node);
        this.add(node);
        this._propagatePartToChildren(node);
        this._applyBindings(node, data);
        return node;
    };
    Diagram.prototype._propagatePartToChildren = function (part) {
        var setPart = function (obj) {
            var e_12, _a;
            obj._part = part;
            if (obj instanceof Panel) {
                try {
                    for (var _b = __values(obj._elements), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var child = _c.value;
                        setPart(child);
                    }
                }
                catch (e_12_1) { e_12 = { error: e_12_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_12) throw e_12.error; }
                }
            }
        };
        setPart(part);
    };
    Diagram.prototype._addLinkForData = function (data) {
        if (!data)
            return null;
        var model = this._model;
        var category = model.getCategoryForLinkData(data);
        var template = null;
        if (category && this._linkTemplateMap.has(category)) {
            template = this._linkTemplateMap.get(category);
        }
        else {
            template = this._linkTemplate;
        }
        var link = template.copy();
        link.data = data;
        var fromKey = model.getFromKeyForLinkData(data);
        var toKey = model.getToKeyForLinkData(data);
        if (fromKey !== undefined) {
            link.fromNode = this._nodeKeyMap.get(fromKey) || null;
        }
        if (toKey !== undefined) {
            link.toNode = this._nodeKeyMap.get(toKey) || null;
        }
        this._parts.set(data, link);
        this.add(link);
        this._applyBindings(link, data);
        return link;
    };
    Diagram.prototype._addLinkForTreeData = function (childData, parentKey) {
        var parentNode = this._nodeKeyMap.get(parentKey);
        var childKey = this._model.getKeyForNodeData(childData);
        var childNode = childKey !== undefined ? this._nodeKeyMap.get(childKey) : null;
        if (!parentNode || !childNode)
            return null;
        var category = this._model.getCategoryForNodeData(childData);
        var template = null;
        if (category && this._linkTemplateMap.has(category)) {
            template = this._linkTemplateMap.get(category);
        }
        else {
            template = this._linkTemplate;
        }
        var link = template.copy();
        link.data = childData;
        link.fromNode = parentNode;
        link.toNode = childNode;
        this._parts.set(childData, link);
        this.add(link);
        this._applyBindings(link, childData);
        return link;
    };
    Diagram.prototype._removeNodeForData = function (data) {
        var part = this._parts.get(data);
        if (part) {
            if (part instanceof Node) {
                this._removeLinksForNode(part);
            }
            var key = this._model.getKeyForNodeData(data);
            if (key !== undefined) {
                this._nodeKeyMap.remove(key);
            }
            this._parts.remove(data);
            this.remove(part);
        }
    };
    Diagram.prototype._removeLinksForNode = function (node) {
        var e_13, _a, e_14, _b;
        var linksToRemove = [];
        try {
            for (var _c = __values(this._layers), _d = _c.next(); !_d.done; _d = _c.next()) {
                var layer = _d.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link) {
                        if (part.fromNode === node || part.toNode === node) {
                            linksToRemove.push(part);
                        }
                    }
                }
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_13) throw e_13.error; }
        }
        try {
            for (var linksToRemove_1 = __values(linksToRemove), linksToRemove_1_1 = linksToRemove_1.next(); !linksToRemove_1_1.done; linksToRemove_1_1 = linksToRemove_1.next()) {
                var link = linksToRemove_1_1.value;
                var data = link.data;
                if (data) {
                    this._parts.remove(data);
                }
                this.remove(link);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (linksToRemove_1_1 && !linksToRemove_1_1.done && (_b = linksToRemove_1.return)) _b.call(linksToRemove_1);
            }
            finally { if (e_14) throw e_14.error; }
        }
    };
    Diagram.prototype._removeLinkForData = function (data) {
        var part = this._parts.get(data);
        if (part) {
            this._parts.remove(data);
            this.remove(part);
        }
    };
    Diagram.prototype._resolveBindingValue = function (binding, obj, data, part) {
        if (binding.isFromModel) {
            var val = this._model ? this._model.modelData[binding.sourceProperty] : undefined;
            if (binding.conversion)
                val = binding.conversion(val, obj, this._model);
            return val;
        }
        else if (binding.sourceObject !== null) {
            var sourceName = binding.sourceObject;
            var sourceObj = null;
            if (sourceName === '') {
                sourceObj = part;
            }
            else {
                sourceObj = part.findObject(sourceName);
            }
            var val = void 0;
            if (sourceObj) {
                val = sourceObj[binding.sourceProperty];
            }
            else {
                val = undefined;
            }
            if (binding.conversion)
                val = binding.conversion(val, obj, this._model);
            return val;
        }
        else {
            return binding.getValueFromSource(data, obj, this._model);
        }
    };
    Diagram.prototype._applyBindings = function (part, data) {
        this._applyBindingsToObject(part, data, part);
    };
    Diagram.prototype._applyBindingsToObject = function (obj, data, part) {
        var e_15, _a, e_16, _b;
        var bindings = obj._bindings;
        if (bindings && bindings.length > 0) {
            try {
                for (var bindings_1 = __values(bindings), bindings_1_1 = bindings_1.next(); !bindings_1_1.done; bindings_1_1 = bindings_1.next()) {
                    var binding = bindings_1_1.value;
                    var val = this._resolveBindingValue(binding, obj, data, part);
                    obj[binding.targetProperty] = val;
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (bindings_1_1 && !bindings_1_1.done && (_a = bindings_1.return)) _a.call(bindings_1);
                }
                finally { if (e_15) throw e_15.error; }
            }
        }
        if (obj instanceof Panel) {
            var elements = obj._elements;
            try {
                for (var elements_1 = __values(elements), elements_1_1 = elements_1.next(); !elements_1_1.done; elements_1_1 = elements_1.next()) {
                    var child = elements_1_1.value;
                    this._applyBindingsToObject(child, data, part);
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (elements_1_1 && !elements_1_1.done && (_b = elements_1.return)) _b.call(elements_1);
                }
                finally { if (e_16) throw e_16.error; }
            }
        }
    };
    Diagram.prototype._updateBindingsForPart = function (part, propname) {
        var data = part.data;
        if (!data)
            return;
        this._updateBindingsForObject(part, data, propname, part);
    };
    Diagram.prototype._updateBindingsForObject = function (obj, data, propname, part) {
        var e_17, _a, e_18, _b;
        var bindings = obj._bindings;
        if (bindings && bindings.length > 0) {
            try {
                for (var bindings_2 = __values(bindings), bindings_2_1 = bindings_2.next(); !bindings_2_1.done; bindings_2_1 = bindings_2.next()) {
                    var binding = bindings_2_1.value;
                    if (binding.sourceObject !== null || propname === undefined || propname === binding.sourceProperty) {
                        var val = this._resolveBindingValue(binding, obj, data, part);
                        obj[binding.targetProperty] = val;
                    }
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (bindings_2_1 && !bindings_2_1.done && (_a = bindings_2.return)) _a.call(bindings_2);
                }
                finally { if (e_17) throw e_17.error; }
            }
        }
        if (obj instanceof Panel) {
            var elements = obj._elements;
            try {
                for (var elements_2 = __values(elements), elements_2_1 = elements_2.next(); !elements_2_1.done; elements_2_1 = elements_2.next()) {
                    var child = elements_2_1.value;
                    this._updateBindingsForObject(child, data, propname, part);
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (elements_2_1 && !elements_2_1.done && (_b = elements_2.return)) _b.call(elements_2);
                }
                finally { if (e_18) throw e_18.error; }
            }
        }
    };
    Diagram.prototype._handlePartPropertyChanged = function (part, obj, propname, value) {
        var e_19, _a;
        var data = part.data;
        if (!data)
            return;
        var bindings = obj._bindings;
        if (!bindings || bindings.length === 0)
            return;
        try {
            for (var bindings_3 = __values(bindings), bindings_3_1 = bindings_3.next(); !bindings_3_1.done; bindings_3_1 = bindings_3.next()) {
                var binding = bindings_3_1.value;
                if (binding.isTwoWay && binding.targetProperty === propname) {
                    var targetValue = value !== undefined ? value : obj[binding.targetProperty];
                    var sourceValue = binding.getValueFromTarget(targetValue, data, this._model);
                    if (binding.isFromModel) {
                        this._model.setModelData(binding.sourceProperty, sourceValue);
                    }
                    else if (binding.sourceObject === null) {
                        this._model.setDataProperty(data, binding.sourceProperty, sourceValue);
                    }
                    else if (binding.sourceObject !== null) {
                        var sourceObj = null;
                        if (binding.sourceObject === '') {
                            sourceObj = part;
                        }
                        else {
                            sourceObj = part.findObject(binding.sourceObject);
                        }
                        if (sourceObj) {
                            sourceObj[binding.sourceProperty] = sourceValue;
                        }
                    }
                }
            }
        }
        catch (e_19_1) { e_19 = { error: e_19_1 }; }
        finally {
            try {
                if (bindings_3_1 && !bindings_3_1.done && (_a = bindings_3.return)) _a.call(bindings_3);
            }
            finally { if (e_19) throw e_19.error; }
        }
    };
    Diagram.prototype._onModelChanged = function (e) {
        if (e.isTransactionChange) {
            this._raiseChangedEvent(e);
            return;
        }
        if (e.isModelChange) {
            var needsLayout = false;
            if (e.isInsertChange && e.propertyName === 'nodeDataArray') {
                var data = e.newValue;
                if (data) {
                    var node = this._addNodeForData(data);
                    if (node) {
                        var groupKey = this._model.getGroupKeyForNodeData(data);
                        if (groupKey !== undefined && groupKey !== null) {
                            var groupNode = this._nodeKeyMap.get(groupKey);
                            if (groupNode && groupNode._memberParts !== undefined) {
                                node.containingGroup = groupNode;
                            }
                        }
                    }
                    needsLayout = true;
                }
            }
            else if (e.isRemoveChange && e.propertyName === 'nodeDataArray') {
                var data = e.oldValue;
                if (data) {
                    this._removeNodeForData(data);
                    needsLayout = true;
                }
            }
            else if (e.isInsertChange && e.propertyName === 'linkDataArray') {
                var data = e.newValue;
                if (data) {
                    this._addLinkForData(data);
                    needsLayout = true;
                }
            }
            else if (e.isRemoveChange && e.propertyName === 'linkDataArray') {
                var data = e.oldValue;
                if (data) {
                    this._removeLinkForData(data);
                    needsLayout = true;
                }
            }
            else if (e.isPropertyChange) {
                var data = e.object;
                if (data && data instanceof Model) {
                    this.updateAllTargetBindings();
                }
                else if (data) {
                    var part = this._parts.get(data);
                    if (part) {
                        this._updateBindingsForPart(part, e.propertyName);
                        if (e.propertyName === this._model.nodeKeyProperty && part instanceof Node) {
                            this._nodeKeyMap.remove(e.oldValue);
                            this._nodeKeyMap.set(e.newValue, part);
                        }
                        if (e.propertyName === this._model.nodeGroupKeyProperty && part instanceof Node) {
                            var newGroupKey = e.newValue;
                            if (newGroupKey !== undefined && newGroupKey !== null) {
                                var groupNode = this._nodeKeyMap.get(newGroupKey);
                                if (groupNode && groupNode._memberParts !== undefined) {
                                    part.containingGroup = groupNode;
                                }
                            }
                            else {
                                part.containingGroup = null;
                            }
                            needsLayout = true;
                        }
                        if (part instanceof Link && this._model instanceof GraphLinksModel) {
                            var glm = this._model;
                            if (e.propertyName === glm.linkFromKeyProperty) {
                                part.fromNode = this._nodeKeyMap.get(e.newValue) || null;
                                needsLayout = true;
                            }
                            else if (e.propertyName === glm.linkToKeyProperty) {
                                part.toNode = this._nodeKeyMap.get(e.newValue) || null;
                                needsLayout = true;
                            }
                        }
                        if (this._model instanceof TreeModel) {
                            var tm = this._model;
                            if (e.propertyName === tm.nodeParentKeyProperty && part instanceof Node) {
                                this._rebuildTreeLinks();
                                needsLayout = true;
                            }
                        }
                        this.requestUpdate();
                    }
                }
            }
            if (needsLayout && this._layout && this._layout.isOngoing) {
                this._layout.invalidateLayout();
            }
        }
        this._raiseChangedEvent(e);
    };
    Diagram.prototype._rebuildTreeLinks = function () {
        var e_20, _a, e_21, _b, e_22, _c;
        var linksToRemove = [];
        try {
            for (var _d = __values(this._layers), _e = _d.next(); !_e.done; _e = _d.next()) {
                var layer = _e.value;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part instanceof Link && part.data && !(this._model instanceof GraphLinksModel)) {
                        linksToRemove.push(part);
                    }
                }
            }
        }
        catch (e_20_1) { e_20 = { error: e_20_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_20) throw e_20.error; }
        }
        try {
            for (var linksToRemove_2 = __values(linksToRemove), linksToRemove_2_1 = linksToRemove_2.next(); !linksToRemove_2_1.done; linksToRemove_2_1 = linksToRemove_2.next()) {
                var link = linksToRemove_2_1.value;
                var data = link.data;
                if (data) {
                    this._parts.remove(data);
                }
                this.remove(link);
            }
        }
        catch (e_21_1) { e_21 = { error: e_21_1 }; }
        finally {
            try {
                if (linksToRemove_2_1 && !linksToRemove_2_1.done && (_b = linksToRemove_2.return)) _b.call(linksToRemove_2);
            }
            finally { if (e_21) throw e_21.error; }
        }
        if (this._model instanceof TreeModel) {
            var tm = this._model;
            try {
                for (var _f = __values(this._model.nodeDataArray), _g = _f.next(); !_g.done; _g = _f.next()) {
                    var nodeData = _g.value;
                    var parentKey = tm.getParentKeyForNodeData(nodeData);
                    if (parentKey !== undefined && parentKey !== null) {
                        if (!this._parts.has(nodeData)) {
                            this._addLinkForTreeData(nodeData, parentKey);
                        }
                    }
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_g && !_g.done && (_c = _f.return)) _c.call(_f);
                }
                finally { if (e_22) throw e_22.error; }
            }
        }
    };
    Diagram.prototype._raiseChangedEvent = function (e) {
        var e_23, _a;
        try {
            for (var _b = __values(this._changedListeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(e);
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_23) throw e_23.error; }
        }
    };
    Diagram.prototype._raiseDiagramEvent = function (name) {
        var e_24, _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this._diagramListeners.get(name);
        if (listeners) {
            try {
                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                    var listener = listeners_1_1.value;
                    listener.apply(void 0, __spreadArray([], __read(args), false));
                }
            }
            catch (e_24_1) { e_24 = { error: e_24_1 }; }
            finally {
                try {
                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                }
                finally { if (e_24) throw e_24.error; }
            }
        }
    };
    Diagram.prototype.raiseDiagramEvent = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this._raiseDiagramEvent.apply(this, __spreadArray([name], __read(args), false));
    };
    Diagram.prototype._findObjectInPanel = function (panel, localPoint) {
        var elements = panel._elements;
        for (var i = elements.length - 1; i >= 0; i--) {
            var elem = elements[i];
            if (!elem.visible)
                continue;
            var bounds = elem.actualBounds;
            if (bounds.containsPoint(localPoint)) {
                if (elem instanceof Panel) {
                    var innerPoint = new Point(localPoint.x - bounds.x, localPoint.y - bounds.y);
                    var found = this._findObjectInPanel(elem, innerPoint);
                    if (found)
                        return found;
                }
                return elem;
            }
        }
        return null;
    };
    Diagram.prototype._renderLoop = function () {
        this._needsRender = false;
        this._animationFrameId = 0;
        this._checkResize();
        if (this._layoutInvalid) {
            this._layoutInvalid = false;
            this._performLayout();
        }
        this._updateGeometry();
        if (this._renderer) {
            this._renderer.render();
        }
        if (this._animationManager.isAnimating) {
            this.requestUpdate();
        }
    };
    Diagram.prototype._performLayout = function () {
        var e_25, _a;
        if (this._layout && typeof this._layout.doLayout === 'function') {
            if (this._layout.diagram !== this) {
                this._layout.diagram = this;
            }
            if (this._layout.isInitial || !this._layout.isValidLayout) {
                this._layout.doLayout(this);
            }
        }
        try {
            for (var _b = __values(this._layers), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                if (layer.isTemporary)
                    continue;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (part._className === 'Group' && part.layout) {
                        var groupLayout = part.layout;
                        if (groupLayout.isInitial || !groupLayout.isValidLayout) {
                            groupLayout.diagram = this;
                            groupLayout.doLayout(part);
                        }
                    }
                }
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_25) throw e_25.error; }
        }
        this._raiseDiagramEvent('LayoutCompleted');
        if (!this._hasPerformedInitialLayout) {
            this._hasPerformedInitialLayout = true;
            this._applyInitialViewport();
            this._raiseDiagramEvent('InitialLayoutCompleted');
        }
        this._applyAutoScale();
        this._applyContentAlignment();
    };
    Diagram.prototype._applyInitialViewport = function () {
        if (this._initialAutoScale === AutoScaleUniform) {
            this.zoomToFit();
        }
        else if (this._initialAutoScale === AutoScaleUniformToFill) {
            var db = this.documentBounds;
            var vs = this.viewSize;
            if (db.width > 0 && db.height > 0 && vs.width > 0 && vs.height > 0) {
                var newScale = Math.max(vs.width / db.width, vs.height / db.height);
                this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
                this._position = new Point(db.x, db.y);
            }
        }
        else if (!isNaN(this._initialScale)) {
            this._scale = Math.max(this._minScale, Math.min(this._maxScale, this._initialScale));
        }
        if (this._initialPosition) {
            this._position = this._initialPosition.copy();
        }
        else if (this._initialContentAlignment) {
            this.alignDocument(this._initialContentAlignment, Spot.Center);
        }
    };
    Diagram.prototype._applyAutoScale = function () {
        if (this._autoScale === AutoScaleUniform) {
            this.zoomToFit();
        }
        else if (this._autoScale === AutoScaleUniformToFill) {
            var db = this.documentBounds;
            var vs = this.viewSize;
            if (db.width > 0 && db.height > 0 && vs.width > 0 && vs.height > 0) {
                var newScale = Math.max(vs.width / db.width, vs.height / db.height);
                this._scale = Math.max(this._minScale, Math.min(this._maxScale, newScale));
                this._position = new Point(db.x, db.y);
            }
        }
    };
    Diagram.prototype._applyContentAlignment = function () {
        if (!this._contentAlignment || this._contentAlignment === Spot.Default)
            return;
        var db = this.documentBounds;
        var vs = this.viewSize;
        if (db.width <= 0 || db.height <= 0)
            return;
        var docW = vs.width / this._scale;
        var docH = vs.height / this._scale;
        if (db.width >= docW && db.height >= docH)
            return;
        this.alignDocument(this._contentAlignment, this._contentAlignment);
    };
    Diagram.prototype._updateGeometry = function () {
        var e_26, _a, e_27, _b, e_28, _c;
        var viewSize = this.viewSize;
        var availW = viewSize.width > 0 ? viewSize.width : 800;
        viewSize.height > 0 ? viewSize.height : 600;
        var partsToLayout = [];
        try {
            for (var _d = __values(this._layers), _e = _d.next(); !_e.done; _e = _d.next()) {
                var layer = _e.value;
                if (!layer.visible)
                    continue;
                var partsIt = layer.parts;
                while (partsIt.next()) {
                    var part = partsIt.value;
                    if (!part.visible)
                        continue;
                    part._measure(Infinity, Infinity);
                    partsToLayout.push(part);
                }
            }
        }
        catch (e_26_1) { e_26 = { error: e_26_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_26) throw e_26.error; }
        }
        if (!this._layout) {
            var autoX = 50;
            var autoY = 50;
            var spacing = 20;
            var rowMaxHeight = 0;
            var maxWidth = availW - 100;
            try {
                for (var partsToLayout_1 = __values(partsToLayout), partsToLayout_1_1 = partsToLayout_1.next(); !partsToLayout_1_1.done; partsToLayout_1_1 = partsToLayout_1.next()) {
                    var part = partsToLayout_1_1.value;
                    if (part instanceof Link)
                        continue;
                    var loc = part.location;
                    if (isNaN(loc.x) || isNaN(loc.y)) {
                        var mb = part.measuredBounds;
                        if (autoX + mb.width > maxWidth && autoX > 50) {
                            autoX = 50;
                            autoY += rowMaxHeight + spacing;
                            rowMaxHeight = 0;
                        }
                        part.location = new Point(autoX, autoY);
                        autoX += mb.width + spacing;
                        rowMaxHeight = Math.max(rowMaxHeight, mb.height);
                    }
                }
            }
            catch (e_27_1) { e_27 = { error: e_27_1 }; }
            finally {
                try {
                    if (partsToLayout_1_1 && !partsToLayout_1_1.done && (_b = partsToLayout_1.return)) _b.call(partsToLayout_1);
                }
                finally { if (e_27) throw e_27.error; }
            }
        }
        try {
            for (var partsToLayout_2 = __values(partsToLayout), partsToLayout_2_1 = partsToLayout_2.next(); !partsToLayout_2_1.done; partsToLayout_2_1 = partsToLayout_2.next()) {
                var part = partsToLayout_2_1.value;
                var loc = part.location;
                var x = isNaN(loc.x) ? 0 : loc.x;
                var y = isNaN(loc.y) ? 0 : loc.y;
                var mb = part.measuredBounds;
                part._arrange(new Rect(x, y, mb.width, mb.height));
                if (part instanceof Link) {
                    part.computePoints();
                }
            }
        }
        catch (e_28_1) { e_28 = { error: e_28_1 }; }
        finally {
            try {
                if (partsToLayout_2_1 && !partsToLayout_2_1.done && (_c = partsToLayout_2.return)) _c.call(partsToLayout_2);
            }
            finally { if (e_28) throw e_28.error; }
        }
    };
    Diagram.prototype._setupResizeObserver = function () {
        var _this = this;
        if (!this._div || typeof ResizeObserver === 'undefined')
            return;
        this._lastDivWidth = this._div.clientWidth;
        this._lastDivHeight = this._div.clientHeight;
        this._resizeObserver = new ResizeObserver(function () {
            _this._checkResize();
        });
        this._resizeObserver.observe(this._div);
    };
    Diagram.prototype._checkResize = function () {
        if (!this._div)
            return;
        var w = this._div.clientWidth;
        var h = this._div.clientHeight;
        if (w !== this._lastDivWidth || h !== this._lastDivHeight) {
            this._lastDivWidth = w;
            this._lastDivHeight = h;
            if (this._renderer) {
                this._renderer.resize(w, h);
            }
            this.requestUpdate();
        }
    };
    Diagram.prototype._setupMouseEvents = function () {
        var _this = this;
        if (!this._div)
            return;
        var canvas = this._renderer ? this._renderer.canvas : null;
        var target = canvas || this._div;
        target.addEventListener('mousedown', function (e) {
            if (e.button !== 0 && e.button !== 2)
                return;
            _this.focus();
            var inputEvent = InputEvent.fromMouseEvent(e, _this);
            inputEvent.eventType = 'mousedown';
            _this._toolManager.lastInput = inputEvent;
            _this._toolManager.doMouseDown();
            if (e.button === 2) {
                inputEvent.isContextMenu = true;
            }
            var onMove = function (ev) {
                var moveEvent = InputEvent.fromMouseEvent(ev, _this);
                moveEvent.eventType = 'mousemove';
                _this._toolManager.lastInput = moveEvent;
                _this._toolManager.doMouseMove();
            };
            var onUp = function (ev) {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
                var upEvent = InputEvent.fromMouseEvent(ev, _this);
                upEvent.eventType = 'mouseup';
                _this._toolManager.lastInput = upEvent;
                _this._toolManager.doMouseUp();
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
        target.addEventListener('wheel', function (e) {
            e.preventDefault();
            var inputEvent = InputEvent.fromMouseEvent(e, _this);
            inputEvent.eventType = 'wheel';
            _this._toolManager.lastInput = inputEvent;
            _this._toolManager.doMouseWheel();
        }, { passive: false });
        target.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
        target.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                var touch = e.touches[0];
                var rect = target.getBoundingClientRect();
                var viewPoint = new Point(touch.clientX - rect.left, touch.clientY - rect.top);
                var docPoint = _this.transformViewToDoc(viewPoint);
                var inputEvent = new InputEvent();
                inputEvent.eventType = 'mousedown';
                inputEvent.viewPoint = { x: viewPoint.x, y: viewPoint.y };
                inputEvent.documentPoint = { x: docPoint.x, y: docPoint.y };
                inputEvent.button = 0;
                inputEvent.timestamp = Date.now();
                inputEvent.nativeEvent = e;
                _this._toolManager.lastInput = inputEvent;
                _this._toolManager.doMouseDown();
            }
        }, { passive: true });
        target.addEventListener('touchmove', function (e) {
            if (e.touches.length === 1) {
                var touch = e.touches[0];
                var rect = target.getBoundingClientRect();
                var viewPoint = new Point(touch.clientX - rect.left, touch.clientY - rect.top);
                var docPoint = _this.transformViewToDoc(viewPoint);
                var inputEvent = new InputEvent();
                inputEvent.eventType = 'mousemove';
                inputEvent.viewPoint = { x: viewPoint.x, y: viewPoint.y };
                inputEvent.documentPoint = { x: docPoint.x, y: docPoint.y };
                inputEvent.timestamp = Date.now();
                inputEvent.nativeEvent = e;
                _this._toolManager.lastInput = inputEvent;
                _this._toolManager.doMouseMove();
            }
            e.preventDefault();
        }, { passive: false });
        target.addEventListener('touchend', function (e) {
            var inputEvent = new InputEvent();
            inputEvent.eventType = 'mouseup';
            inputEvent.timestamp = Date.now();
            inputEvent.nativeEvent = e;
            _this._toolManager.lastInput = inputEvent;
            _this._toolManager.doMouseUp();
        }, { passive: true });
    };
    Diagram.prototype._setupKeyboardEvents = function () {
        var _this = this;
        if (!this._div)
            return;
        this._div.addEventListener('keydown', function (e) {
            var inputEvent = InputEvent.fromKeyboardEvent(e);
            inputEvent.eventType = 'keydown';
            _this._toolManager.lastInput = inputEvent;
            _this._toolManager.doKeyDown();
            if (_this._commandHandler) {
                _this._commandHandler.doKeyDown();
            }
            if (inputEvent.handled) {
                e.preventDefault();
            }
        });
        this._div.addEventListener('keyup', function (e) {
            var inputEvent = InputEvent.fromKeyboardEvent(e);
            inputEvent.eventType = 'keyup';
            _this._toolManager.lastInput = inputEvent;
            _this._toolManager.doKeyUp();
        });
    };
    // ============ Factory Method ============
    Diagram.GraphObject = {
        make: function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return GraphObject.make.apply(GraphObject, __spreadArray([type], __read(args), false));
        }
    };
    return Diagram;
}());

/**
 * Overview - shows a zoomed-out view of another diagram.
 * Renders a scaled-down version of the observed diagram and shows a rectangle
 * representing the current viewport.
 */
var Overview = /** @class */ (function () {
    function Overview(divId) {
        this._observedDiagram = null;
        this._box = null;
        this._isViewportSized = false;
        this._diagram = new Diagram(divId);
        this._setupOverview();
    }
    Object.defineProperty(Overview.prototype, "diagram", {
        // ============ Properties ============
        /** The Diagram shown by this Overview. */
        get: function () {
            return this._diagram;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Overview.prototype, "observedDiagram", {
        /** The diagram being observed by this Overview. */
        get: function () {
            return this._observedDiagram;
        },
        set: function (val) {
            if (this._observedDiagram === val)
                return;
            this._observedDiagram = val;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Overview.prototype, "box", {
        /** The viewport box Adornment that indicates the current viewport of the observed diagram. */
        get: function () {
            return this._box;
        },
        set: function (val) {
            this._box = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Overview.prototype, "isViewportSized", {
        /** Whether the Overview sizes itself to match the observed diagram's viewport. */
        get: function () {
            return this._isViewportSized;
        },
        set: function (val) {
            if (this._isViewportSized === val)
                return;
            this._isViewportSized = val;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /** Redraw the overview. */
    Overview.prototype.update = function () {
        this.drawOverview();
        this.drawBox();
    };
    /** Render the observed diagram in miniature. */
    Overview.prototype.drawOverview = function () {
        if (!this._observedDiagram)
            return;
        // Scale the overview to fit the observed diagram's document bounds
        var docBounds = this._observedDiagram.documentBounds;
        if (docBounds.isEmpty)
            return;
        var viewSize = this._diagram.viewSize;
        if (viewSize.isEmpty)
            return;
        var scale = Math.min(viewSize.width / docBounds.width, viewSize.height / docBounds.height);
        this._diagram.scale = scale;
        this._diagram.position = new Point(docBounds.x, docBounds.y);
        this._diagram.requestUpdate();
    };
    /** Draw the viewport indicator box. */
    Overview.prototype.drawBox = function () {
        if (!this._observedDiagram)
            return;
        var vpBounds = this._observedDiagram.viewportBounds;
        if (vpBounds.isEmpty)
            return;
        // The box represents the viewport rectangle in overview coordinates
        // Stub: actual box drawing would create/update an Adornment on the overview diagram
        if (this._box) {
            this._box.position = new Point(vpBounds.x, vpBounds.y);
            this._box.width = vpBounds.width;
            this._box.height = vpBounds.height;
        }
    };
    /** Compute the bounds of all parts in the observed diagram. */
    Overview.prototype.computeBounds = function () {
        if (!this._observedDiagram)
            return new Rect();
        return this._observedDiagram.documentBounds;
    };
    /** Create a copy of this Overview. */
    Overview.prototype.copy = function () {
        var overview = new Overview(this._diagram.div || '');
        overview.observedDiagram = this._observedDiagram;
        overview.isViewportSized = this._isViewportSized;
        return overview;
    };
    // ============ Internal Methods ============
    /** Set up the overview diagram with appropriate settings. */
    Overview.prototype._setupOverview = function () {
        this._diagram.isReadOnly = true;
        this._diagram.allowSelect = false;
        this._diagram.allowMove = false;
        this._diagram.allowCopy = false;
        this._diagram.allowDelete = false;
        this._diagram.allowZoom = false;
        this._diagram.allowHorizontalScroll = false;
        this._diagram.allowVerticalScroll = false;
    };
    return Overview;
}());

var Palette = /** @class */ (function (_super) {
    __extends(Palette, _super);
    function Palette(divId) {
        var _this = _super.call(this, divId) || this;
        _this._autoScale = AutoScaleUniform;
        _this._setupPalette();
        return _this;
    }
    Object.defineProperty(Palette.prototype, "isReadOnly", {
        get: function () {
            return true;
        },
        set: function (_val) {
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Palette.prototype, "allowSelect", {
        get: function () {
            return this._allowSelect;
        },
        set: function (val) {
            this._allowSelect = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Palette.prototype, "allowDragOut", {
        get: function () {
            return this._allowDragOut;
        },
        set: function (val) {
            this._allowDragOut = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Palette.prototype, "allowMove", {
        get: function () {
            return false;
        },
        set: function (_val) {
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Palette.prototype, "allowDelete", {
        get: function () {
            return false;
        },
        set: function (_val) {
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Palette.prototype, "allowCopy", {
        get: function () {
            return false;
        },
        set: function (_val) {
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Palette.prototype, "autoScale", {
        get: function () {
            return this._autoScale || AutoScaleUniform;
        },
        set: function (val) {
            this._autoScale = val;
        },
        enumerable: false,
        configurable: true
    });
    Palette.prototype.copy = function () {
        var palette = new Palette(this.div || '');
        palette._autoScale = this._autoScale;
        palette.allowSelect = this.allowSelect;
        palette.allowDragOut = this.allowDragOut;
        return palette;
    };
    Palette.prototype._setupPalette = function () {
        this._allowSelect = true;
        this._allowDragOut = true;
        this._allowMove = false;
        this._allowCopy = false;
        this._allowDelete = false;
        this._isReadOnly = true;
    };
    return Palette;
}(Diagram));

/**
 * DiagramEvent - 图表事件
 */
var DiagramEvent = /** @class */ (function () {
    function DiagramEvent(name, diagram, subject, parameter) {
        this.name = name;
        this.diagram = diagram || null;
        this.subject = subject || null;
        this.parameter = parameter || null;
    }
    return DiagramEvent;
}());

function initBuilders() {
    var GO = GraphObject;
    GO.defineBuilder('Button', function (args) {
        var buttonFillNormal = '#f5f5f5';
        var buttonStrokeNormal = '#737373';
        var buttonFillOver = '#d4d4d4';
        var buttonStrokeOver = '#737373';
        var buttonFillDisabled = '#a3a3a3';
        var paddingHorizontal = 2.76142374915397;
        var paddingVertical = 2.761423749153969;
        var button = new Panel(PanelAuto, {
            isActionable: true,
            cursor: 'pointer',
        });
        button.attach({
            '_buttonFillNormal': undefined,
            '_buttonStrokeNormal': undefined,
            '_buttonFillOver': buttonFillOver,
            '_buttonStrokeOver': buttonStrokeOver,
            '_buttonFillDisabled': buttonFillDisabled,
        });
        button.add(new Shape('RoundedRectangle', {
            name: 'ButtonBorder',
            spot1: new Spot(0, 0, paddingHorizontal, paddingVertical),
            spot2: new Spot(1, 1, -paddingHorizontal, -paddingVertical),
            parameter1: 2,
            fill: buttonFillNormal,
            stroke: buttonStrokeNormal,
        }));
        button.mouseEnter = function (e, btn) {
            if (!btn.isEnabledObject || !btn.isEnabledObject())
                return;
            if (!(btn instanceof Panel))
                return;
            var shape = btn.findObject('ButtonBorder');
            if (shape instanceof Shape) {
                if (btn['_buttonFillNormal'] === undefined)
                    btn['_buttonFillNormal'] = shape.fill;
                shape.fill = btn['_buttonFillOver'];
                if (btn['_buttonStrokeNormal'] === undefined)
                    btn['_buttonStrokeNormal'] = shape.stroke;
                shape.stroke = btn['_buttonStrokeOver'];
            }
        };
        button.mouseLeave = function (e, btn) {
            if (!(btn instanceof Panel))
                return;
            var shape = btn.findObject('ButtonBorder');
            if (shape instanceof Shape) {
                if (btn['_buttonFillNormal'] !== undefined)
                    shape.fill = btn['_buttonFillNormal'];
                if (btn['_buttonStrokeNormal'] !== undefined)
                    shape.stroke = btn['_buttonStrokeNormal'];
            }
        };
        return button;
    });
    GO.defineBuilder('TreeExpanderButton', function (args) {
        var button = GO.build('Button');
        button.attach({
            '_treeExpandedFigure': 'MinusLine',
            '_treeCollapsedFigure': 'PlusLine',
            visible: false,
        });
        var icon = new Shape('MinusLine', {
            name: 'ButtonIcon',
            stroke: '#0a0a0a',
            strokeWidth: 2,
            desiredSize: new Size(8, 8),
        });
        icon.bindObject('figure', 'isTreeExpanded', function (exp, shape) {
            var but = shape.panel;
            return exp ? but['_treeExpandedFigure'] : but['_treeCollapsedFigure'];
        });
        button.add(icon);
        button.bindObject('visible', 'isTreeLeaf', function (leaf) { return !leaf; });
        button.click = function (e, btn) {
            var node = btn.part;
            if (node instanceof Adornment)
                node = node.adornedPart;
            if (!(node instanceof Node))
                return;
            var diagram = node.diagram;
            if (!diagram)
                return;
            var cmd = diagram.commandHandler;
            if (node.isTreeExpanded) {
                if (!cmd.canCollapseTree(node))
                    return;
            }
            else {
                if (!cmd.canExpandTree(node))
                    return;
            }
            e.handled = true;
            if (node.isTreeExpanded) {
                cmd.collapseTree(node);
            }
            else {
                cmd.expandTree(node);
            }
        };
        return button;
    });
    GO.defineBuilder('SubGraphExpanderButton', function (args) {
        var button = GO.build('Button');
        button.attach({
            '_subGraphExpandedFigure': 'MinusLine',
            '_subGraphCollapsedFigure': 'PlusLine',
        });
        var icon = new Shape('MinusLine', {
            name: 'ButtonIcon',
            stroke: '#0a0a0a',
            strokeWidth: 2,
            desiredSize: new Size(8, 8),
        });
        icon.bindObject('figure', 'isSubGraphExpanded', function (exp, shape) {
            var but = shape.panel;
            return exp ? but['_subGraphExpandedFigure'] : but['_subGraphCollapsedFigure'];
        });
        button.add(icon);
        button.click = function (e, btn) {
            var group = btn.part;
            if (group instanceof Adornment)
                group = group.adornedPart;
            if (!(group instanceof Group))
                return;
            var diagram = group.diagram;
            if (!diagram)
                return;
            var cmd = diagram.commandHandler;
            if (group.isSubGraphExpanded) {
                if (!cmd.canCollapseSubGraph(group))
                    return;
            }
            else {
                if (!cmd.canExpandSubGraph(group))
                    return;
            }
            e.handled = true;
            if (group.isSubGraphExpanded) {
                cmd.collapseSubGraph(group);
            }
            else {
                cmd.expandSubGraph(group);
            }
        };
        return button;
    });
    GO.defineBuilder('PanelExpanderButton', function (args) {
        var eltname = GO.takeBuilderArgument(args, 'COLLAPSIBLE');
        var button = GO.build('Button');
        button.attach({
            '_buttonExpandedFigure': 'M0 0 M0 6 L4 2 8 6 M8 8',
            '_buttonCollapsedFigure': 'M0 0 M0 2 L4 6 8 2 M8 8',
            'ButtonBorder.fill': 'rgba(0, 0, 0, 0)',
            '_buttonFillNormal': 'rgba(0, 0, 0, 0)',
            'ButtonBorder.stroke': null,
            '_buttonStrokeNormal': null,
            '_buttonFillOver': 'rgba(0, 0, 0, .2)',
            '_buttonStrokeOver': null,
        });
        var icon = new Shape({ name: 'ButtonIcon', strokeWidth: 2 });
        icon.bindObject('geometryString', 'visible', function (vis) {
            return vis ? button['_buttonExpandedFigure'] : button['_buttonCollapsedFigure'];
        }, undefined, eltname);
        button.add(icon);
        var border = button.findObject('ButtonBorder');
        if (border instanceof Shape) {
            border.stroke = null;
            border.fill = 'rgba(0, 0, 0, 0)';
        }
        button.click = function (e, btn) {
            if (!(btn instanceof Panel))
                return;
            var diagram = btn.diagram;
            if (!diagram)
                return;
            if (diagram.isReadOnly)
                return;
            var elt = btn.findBindingPanel();
            if (elt === null)
                elt = btn.part;
            if (elt !== null) {
                var pan = elt.findObject(eltname);
                if (pan !== null) {
                    e.handled = true;
                    diagram.startTransaction('Collapse/Expand Panel');
                    pan.visible = !pan.visible;
                    diagram.commitTransaction('Collapse/Expand Panel');
                }
            }
        };
        return button;
    });
    GO.defineBuilder('ToolTip', function (args) {
        return new Adornment(PanelAuto, {
            isShadowed: true,
            shadowColor: 'rgba(0, 0, 0, .4)',
            shadowOffset: new Point(0, 2),
        }).add(new Shape('RoundedRectangle', {
            name: 'Border',
            parameter1: 1,
            fill: '#f5f5f5',
            strokeWidth: 0,
            spot1: new Spot(0, 0, 4, 6),
            spot2: new Spot(1, 1, -4, -4),
        }));
    });
    GO.defineBuilder('ContextMenu', function (args) {
        var menu = new Adornment(PanelVertical, {
            background: '#f5f5f5',
            isShadowed: true,
            shadowColor: 'rgba(0, 0, 0, .4)',
            shadowOffset: new Point(0, 2),
        });
        menu.bindObject('background', '', function (ad) {
            var part = ad.adornedPart;
            if (part !== null && ad.hasPlaceholder())
                return null;
            return '#f5f5f5';
        });
        return menu;
    });
    GO.defineBuilder('ContextMenuButton', function (args) {
        var button = GO.build('Button');
        button.stretch = StretchHorizontal;
        var border = button.findObject('ButtonBorder');
        if (border instanceof Shape) {
            border.figure = 'Rectangle';
            border.strokeWidth = 0;
            border.spot1 = new Spot(0, 0, 4, 6);
            border.spot2 = new Spot(1, 1, -4, -4);
        }
        return button;
    });
}
initBuilders();

/**
 * HTMLInfo - provides custom HTML-based editing or display for tools.
 * Used by TextEditingTool and ContextMenuTool to integrate HTML elements.
 */
var HTMLInfo = /** @class */ (function () {
    function HTMLInfo() {
        this._element = null;
        this._showFunction = null;
        this._hideFunction = null;
        this._valueFunction = null;
    }
    Object.defineProperty(HTMLInfo.prototype, "element", {
        // ============ Properties ============
        get: function () { return this._element; },
        set: function (val) { this._element = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLInfo.prototype, "showFunction", {
        get: function () {
            return this._showFunction;
        },
        set: function (val) {
            this._showFunction = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLInfo.prototype, "hideFunction", {
        get: function () {
            return this._hideFunction;
        },
        set: function (val) {
            this._hideFunction = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HTMLInfo.prototype, "valueFunction", {
        get: function () {
            return this._valueFunction;
        },
        set: function (val) {
            this._valueFunction = val;
        },
        enumerable: false,
        configurable: true
    });
    return HTMLInfo;
}());

/**
 * LayoutVertex - represents a node in the layout network.
 */
var LayoutVertex = /** @class */ (function () {
    function LayoutVertex() {
        /** The network this vertex belongs to */
        this.network = null;
        /** X position of the vertex center */
        this.x = 0;
        /** Y position of the vertex center */
        this.y = 0;
        /** Bounding rectangle of the vertex */
        this.bounds = new Rect(0, 0, 0, 0);
        /** Focus X offset (0-1 relative to width) for connection points */
        this.focusX = 0.5;
        /** Focus Y offset (0-1 relative to height) for connection points */
        this.focusY = 0.5;
        /** The Part associated with this vertex, if any */
        this.part = null;
        /** Edges where this vertex is the source */
        this.sourceEdges = new List();
        /** Edges where this vertex is the destination */
        this.destinationEdges = new List();
        /** The Node associated with this vertex, if any */
        this.node = null;
        /** Whether this vertex is artificial (not associated with a real part) */
        this._isArtificial = false;
        /** Internal index for algorithms */
        this._index = -1;
    }
    Object.defineProperty(LayoutVertex.prototype, "width", {
        /** Width of the vertex */
        get: function () {
            return this.bounds.width;
        },
        set: function (val) {
            this.bounds.width = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayoutVertex.prototype, "height", {
        /** Height of the vertex */
        get: function () {
            return this.bounds.height;
        },
        set: function (val) {
            this.bounds.height = val;
        },
        enumerable: false,
        configurable: true
    });
    /** Add an edge where this vertex is the destination */
    LayoutVertex.prototype.addDestinationEdge = function (edge) {
        this.destinationEdges.add(edge);
    };
    /** Add an edge where this vertex is the source */
    LayoutVertex.prototype.addSourceEdge = function (edge) {
        this.sourceEdges.add(edge);
    };
    /** Delete an edge from both source and destination lists */
    LayoutVertex.prototype.deleteEdge = function (edge) {
        this.sourceEdges.remove(edge);
        this.destinationEdges.remove(edge);
    };
    Object.defineProperty(LayoutVertex.prototype, "center", {
        /** Get the center point of this vertex */
        get: function () {
            return {
                x: this.x + this.width * this.focusX,
                y: this.y + this.height * this.focusY
            };
        },
        enumerable: false,
        configurable: true
    });
    LayoutVertex.smartComparer = function (a, b) {
        var na = a.data ? String(a.data.key) : '';
        var nb = b.data ? String(b.data.key) : '';
        var naNum = parseFloat(na);
        var nbNum = parseFloat(nb);
        if (!isNaN(naNum) && !isNaN(nbNum))
            return naNum - nbNum;
        return na < nb ? -1 : na > nb ? 1 : 0;
    };
    return LayoutVertex;
}());

/**
 * LayoutEdge - represents a link in the layout network.
 */
var LayoutEdge = /** @class */ (function () {
    function LayoutEdge() {
        /** The network this edge belongs to */
        this.network = null;
        /** The source vertex of this edge */
        this.fromVertex = null;
        /** The destination vertex of this edge */
        this.toVertex = null;
        /** The Link associated with this edge, if any */
        this.link = null;
        /** The preferred length of this edge */
        this.length = NaN;
        /** The weight of this edge for layout calculations */
        this.weight = 1;
    }
    /** Get the other vertex given one vertex of this edge */
    LayoutEdge.prototype.getOtherVertex = function (vertex) {
        if (vertex === this.fromVertex)
            return this.toVertex;
        if (vertex === this.toVertex)
            return this.fromVertex;
        return null;
    };
    return LayoutEdge;
}());

/**
 * LayoutNetwork - the graph structure used by layouts.
 * Contains vertexes (nodes) and edges (links) for layout computation.
 */
var LayoutNetwork = /** @class */ (function () {
    function LayoutNetwork() {
        /** The layout that owns this network */
        this.layout = null;
        /** All vertexes in this network */
        this.vertexes = new List();
        /** All edges in this network */
        this.edges = new List();
        /** Map from Link to LayoutEdge */
        this.linkToLayoutEdge = new Map$1();
        /** Map from Node to LayoutVertex */
        this.nodeToLayoutVertex = new Map$1();
    }
    /** Add a vertex to this network */
    LayoutNetwork.prototype.addVertex = function (vertex) {
        vertex.network = this;
        this.vertexes.add(vertex);
        return vertex;
    };
    /** Add an edge to this network */
    LayoutNetwork.prototype.addEdge = function (edge) {
        edge.network = this;
        this.edges.add(edge);
        if (edge.fromVertex) {
            edge.fromVertex.addSourceEdge(edge);
        }
        if (edge.toVertex) {
            edge.toVertex.addDestinationEdge(edge);
        }
        return edge;
    };
    /** Add a link to the network, creating an edge between the from/to vertexes */
    LayoutNetwork.prototype.addLink = function (link) {
        var fromNode = link.fromNode;
        var toNode = link.toNode;
        if (!fromNode || !toNode)
            return null;
        var fromVertex = this.findVertex(fromNode);
        if (!fromVertex) {
            fromVertex = this.addNode(fromNode);
        }
        var toVertex = this.findVertex(toNode);
        if (!toVertex) {
            toVertex = this.addNode(toNode);
        }
        var edge = this.linkVertexes(fromVertex, toVertex);
        edge.link = link;
        this.linkToLayoutEdge.set(link, edge);
        return edge;
    };
    /** Add a node to the network, creating a vertex */
    LayoutNetwork.prototype.addNode = function (node) {
        var vertex = this.findVertex(node);
        if (vertex)
            return vertex;
        vertex = new LayoutVertex();
        vertex.network = this;
        vertex.node = node;
        vertex.part = node;
        // Get bounds from the node
        var bounds = node.getDocumentBounds();
        vertex.bounds = bounds.copy();
        vertex.x = bounds.x;
        vertex.y = bounds.y;
        this.vertexes.add(vertex);
        this.nodeToLayoutVertex.set(node, vertex);
        return vertex;
    };
    /** Delete all artificial vertexes from the network */
    LayoutNetwork.prototype.deleteArtificialVertexes = function () {
        var e_1, _a, e_2, _b;
        var toRemove = [];
        var it = this.vertexes.iterator;
        while (it.next()) {
            var v = it.value;
            if (v._isArtificial) {
                toRemove.push(v);
            }
        }
        try {
            for (var toRemove_1 = __values(toRemove), toRemove_1_1 = toRemove_1.next(); !toRemove_1_1.done; toRemove_1_1 = toRemove_1.next()) {
                var v = toRemove_1_1.value;
                // Remove all edges connected to this vertex
                var edgesToRemove = [];
                var srcIt = v.sourceEdges.iterator;
                while (srcIt.next()) {
                    edgesToRemove.push(srcIt.value);
                }
                var dstIt = v.destinationEdges.iterator;
                while (dstIt.next()) {
                    edgesToRemove.push(dstIt.value);
                }
                try {
                    for (var edgesToRemove_1 = (e_2 = void 0, __values(edgesToRemove)), edgesToRemove_1_1 = edgesToRemove_1.next(); !edgesToRemove_1_1.done; edgesToRemove_1_1 = edgesToRemove_1.next()) {
                        var e = edgesToRemove_1_1.value;
                        this.deleteEdge(e);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (edgesToRemove_1_1 && !edgesToRemove_1_1.done && (_b = edgesToRemove_1.return)) _b.call(edgesToRemove_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                this.vertexes.remove(v);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (toRemove_1_1 && !toRemove_1_1.done && (_a = toRemove_1.return)) _a.call(toRemove_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /** Delete self-loop edges (where fromVertex === toVertex) */
    LayoutNetwork.prototype.deleteSelfEdges = function () {
        var e_3, _a;
        var toRemove = [];
        var it = this.edges.iterator;
        while (it.next()) {
            var e = it.value;
            if (e.fromVertex === e.toVertex) {
                toRemove.push(e);
            }
        }
        try {
            for (var toRemove_2 = __values(toRemove), toRemove_2_1 = toRemove_2.next(); !toRemove_2_1.done; toRemove_2_1 = toRemove_2.next()) {
                var e = toRemove_2_1.value;
                this.deleteEdge(e);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (toRemove_2_1 && !toRemove_2_1.done && (_a = toRemove_2.return)) _a.call(toRemove_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
    };
    /** Find the vertex associated with a node */
    LayoutNetwork.prototype.findVertex = function (node) {
        return this.nodeToLayoutVertex.get(node) || null;
    };
    /** Find the edge associated with a link */
    LayoutNetwork.prototype.findEdge = function (link) {
        return this.linkToLayoutEdge.get(link) || null;
    };
    /** Create an edge connecting two vertexes */
    LayoutNetwork.prototype.linkVertexes = function (fromVertex, toVertex) {
        var edge = new LayoutEdge();
        edge.network = this;
        edge.fromVertex = fromVertex;
        edge.toVertex = toVertex;
        fromVertex.addSourceEdge(edge);
        toVertex.addDestinationEdge(edge);
        this.edges.add(edge);
        return edge;
    };
    /** Delete an edge from the network */
    LayoutNetwork.prototype.deleteEdge = function (edge) {
        if (edge.fromVertex) {
            edge.fromVertex.sourceEdges.remove(edge);
        }
        if (edge.toVertex) {
            edge.toVertex.destinationEdges.remove(edge);
        }
        this.edges.remove(edge);
        if (edge.link) {
            this.linkToLayoutEdge.remove(edge.link);
        }
    };
    /** Split this network into sub-networks of connected components */
    LayoutNetwork.prototype.splitIntoSubNetworks = function () {
        var result = new List();
        if (this.vertexes.count === 0)
            return result;
        var visited = new Set();
        var it = this.vertexes.iterator;
        while (it.next()) {
            var startVertex = it.value;
            if (visited.has(startVertex))
                continue;
            // BFS to find all connected vertexes
            var component = new LayoutNetwork();
            component.layout = this.layout;
            var queue = [startVertex];
            visited.add(startVertex);
            while (queue.length > 0) {
                var v = queue.shift();
                component.addVertex(v);
                // Traverse source edges
                var srcIt = v.sourceEdges.iterator;
                while (srcIt.next()) {
                    var e = srcIt.value;
                    if (e.toVertex && !visited.has(e.toVertex)) {
                        visited.add(e.toVertex);
                        queue.push(e.toVertex);
                    }
                    component.addEdge(e);
                }
                // Traverse destination edges
                var dstIt = v.destinationEdges.iterator;
                while (dstIt.next()) {
                    var e = dstIt.value;
                    if (e.fromVertex && !visited.has(e.fromVertex)) {
                        visited.add(e.fromVertex);
                        queue.push(e.fromVertex);
                    }
                    if (!component.edges.contains(e)) {
                        component.addEdge(e);
                    }
                }
            }
            result.add(component);
        }
        return result;
    };
    return LayoutNetwork;
}());

/**
 * Layout - base class for all layout algorithms.
 * Subclasses must override doLayout() to implement specific layout algorithms.
 */
var Layout = /** @class */ (function () {
    function Layout() {
        // ============ Protected property storage ============
        this._arrangementOrigin = new Point(0, 0);
        this._isInitial = true;
        this._isOngoing = true;
        this._isRealtime = true;
        this._isRouting = true;
        this._isValidLayout = true;
        this._isViewportSized = false;
        this._boundsComputation = null;
        this._network = null;
        this._diagram = null;
        this._group = null;
    }
    Object.defineProperty(Layout.prototype, "arrangementOrigin", {
        // ============ Properties ============
        get: function () { return this._arrangementOrigin; },
        set: function (val) { this._arrangementOrigin = val.copy(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isInitial", {
        get: function () { return this._isInitial; },
        set: function (val) { this._isInitial = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isOngoing", {
        get: function () { return this._isOngoing; },
        set: function (val) { this._isOngoing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isRealtime", {
        get: function () { return this._isRealtime; },
        set: function (val) { this._isRealtime = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isRouting", {
        get: function () { return this._isRouting; },
        set: function (val) { this._isRouting = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isValidLayout", {
        get: function () { return this._isValidLayout; },
        set: function (val) { this._isValidLayout = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "isViewportSized", {
        get: function () { return this._isViewportSized; },
        set: function (val) { this._isViewportSized = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "boundsComputation", {
        get: function () {
            return this._boundsComputation;
        },
        set: function (val) {
            this._boundsComputation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "network", {
        get: function () { return this._network; },
        set: function (val) { this._network = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "diagram", {
        get: function () { return this._diagram; },
        set: function (val) { this._diagram = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Layout.prototype, "group", {
        get: function () { return this._group; },
        set: function (val) { this._group = val; },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    /**
     * Perform the layout on the given collection of parts.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    Layout.prototype.doLayout = function (coll) {
        // Base implementation - subclasses override
        var parts = this.collectParts(coll);
        if (parts.count === 0)
            return;
        this.isValidLayout = true;
    };
    /**
     * Collect all Parts that should be laid out from the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    Layout.prototype.collectParts = function (coll) {
        var e_1, _a, e_2, _b;
        var parts = new List();
        if (!coll)
            return parts;
        // If it's a Diagram, collect all nodes and links
        if (coll._layers) {
            var diagram = coll;
            try {
                for (var _c = __values(diagram._layers), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var layer = _d.value;
                    if (layer.isTemporary)
                        continue;
                    var partsIt = layer.parts;
                    while (partsIt.next()) {
                        var part = partsIt.value;
                        if (part.isLayoutPositioned && part.visible) {
                            parts.add(part);
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this._diagram = diagram;
            return parts;
        }
        // If it has an iterator (Iterable<Part>)
        if (typeof coll.iterator === 'function' || (coll.iterator && typeof coll.iterator.next === 'function')) {
            var it = coll.iterator;
            while (it.next()) {
                var part = it.value;
                if (part instanceof Part && part.isLayoutPositioned && part.visible) {
                    parts.add(part);
                }
            }
            return parts;
        }
        // If it's an array
        if (Array.isArray(coll)) {
            try {
                for (var coll_1 = __values(coll), coll_1_1 = coll_1.next(); !coll_1_1.done; coll_1_1 = coll_1.next()) {
                    var part = coll_1_1.value;
                    if (part instanceof Part && part.isLayoutPositioned && part.visible) {
                        parts.add(part);
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (coll_1_1 && !coll_1_1.done && (_b = coll_1.return)) _b.call(coll_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return parts;
        }
        return parts;
    };
    /**
     * Commit the layout by moving parts to their computed positions.
     * Called after the layout algorithm has computed positions.
     */
    Layout.prototype.commitLayout = function () {
        if (!this._network)
            return;
        var it = this._network.vertexes.iterator;
        while (it.next()) {
            var vertex = it.value;
            if (vertex.node && !vertex._isArtificial) {
                var node = vertex.node;
                node.move(new Point(vertex.x, vertex.y));
            }
        }
        var eit = this._network.edges.iterator;
        while (eit.next()) {
            var edge = eit.value;
            if (edge.link) {
                edge.link.computePoints();
            }
        }
    };
    /**
     * Create a copy of this layout.
     */
    Layout.prototype.copy = function () {
        var copy = new Layout();
        copy._arrangementOrigin = this._arrangementOrigin.copy();
        copy._isInitial = this._isInitial;
        copy._isOngoing = this._isOngoing;
        copy._isRealtime = this._isRealtime;
        copy._isRouting = this._isRouting;
        copy._isValidLayout = this._isValidLayout;
        copy._isViewportSized = this._isViewportSized;
        copy._boundsComputation = this._boundsComputation;
        return copy;
    };
    /**
     * Create a new LayoutNetwork for this layout.
     */
    Layout.prototype.createNetwork = function () {
        var net = new LayoutNetwork();
        net.layout = this;
        return net;
    };
    /**
     * Get the layout bounds of a part.
     * @param part - The part to get bounds for
     */
    Layout.prototype.getLayoutBounds = function (part) {
        var bounds = part.getDocumentBounds();
        if (this._boundsComputation) {
            return this._boundsComputation(this, part, bounds);
        }
        return bounds;
    };
    /**
     * Return the initial origin point for the layout.
     */
    Layout.prototype.initialOrigin = function () {
        return this._arrangementOrigin.copy();
    };
    /**
     * Invalidate this layout, causing it to be re-performed.
     */
    Layout.prototype.invalidateLayout = function () {
        this._isValidLayout = false;
        if (this._diagram) {
            this._diagram._layoutInvalid = true;
            this._diagram.requestUpdate();
        }
        if (this._group) {
            this._group._layoutInvalid = true;
            if (this._group.diagram) {
                this._group.diagram.requestUpdate();
            }
        }
    };
    /**
     * Build a LayoutNetwork from the parts in the given collection.
     * @param coll - A Diagram, Iterable<Part>, or array of Parts
     */
    Layout.prototype.makeNetwork = function (coll) {
        var net = this.createNetwork();
        var parts = this.collectParts(coll);
        // Add all nodes as vertexes
        var it = parts.iterator;
        while (it.next()) {
            var part = it.value;
            if (part instanceof Node) {
                var vertex = net.addNode(part);
                var bounds = this.getLayoutBounds(part);
                vertex.bounds = bounds.copy();
                vertex.x = bounds.x;
                vertex.y = bounds.y;
            }
        }
        // Add all links as edges
        var linkIt = parts.iterator;
        while (linkIt.next()) {
            var part = linkIt.value;
            if (part instanceof Link) {
                net.addLink(part);
            }
        }
        this._network = net;
        return net;
    };
    /**
     * Update the positions of parts after the layout has been computed.
     */
    Layout.prototype.updateParts = function () {
        this.commitLayout();
    };
    return Layout;
}());

/**
 * GridLayout - arranges parts in a grid pattern.
 */
var GridLayout = /** @class */ (function (_super) {
    __extends(GridLayout, _super);
    function GridLayout() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._wrappingWidth = NaN;
        _this._cellSize = new Size(10, 10);
        _this._spacing = new Size(10, 10);
        _this._alignment = GridLayoutLocation;
        _this._arrangement = GridArrangementLeftToRight;
        _this._sorting = TreeSortingForwards;
        return _this;
    }
    Object.defineProperty(GridLayout.prototype, "wrappingWidth", {
        get: function () { return this._wrappingWidth; },
        set: function (val) { this._wrappingWidth = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridLayout.prototype, "cellSize", {
        get: function () { return this._cellSize; },
        set: function (val) { this._cellSize = val.copy(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridLayout.prototype, "spacing", {
        get: function () { return this._spacing; },
        set: function (val) { this._spacing = val.copy(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridLayout.prototype, "alignment", {
        get: function () { return this._alignment; },
        set: function (val) { this._alignment = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridLayout.prototype, "arrangement", {
        get: function () { return this._arrangement; },
        set: function (val) { this._arrangement = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GridLayout.prototype, "sorting", {
        get: function () { return this._sorting; },
        set: function (val) { this._sorting = val; },
        enumerable: false,
        configurable: true
    });
    GridLayout.prototype.copy = function () {
        var copy = new GridLayout();
        copy._arrangementOrigin = this._arrangementOrigin.copy();
        copy._wrappingWidth = this._wrappingWidth;
        copy._cellSize = this._cellSize.copy();
        copy._spacing = this._spacing.copy();
        copy._alignment = this._alignment;
        copy._arrangement = this._arrangement;
        copy._sorting = this._sorting;
        return copy;
    };
    GridLayout.prototype.doLayout = function (coll) {
        var parts = this.collectParts(coll);
        if (parts.count === 0)
            return;
        // Separate nodes and links
        var nodes = [];
        var it = parts.iterator;
        while (it.next()) {
            var part = it.value;
            if (part instanceof Node) {
                nodes.push(part);
            }
        }
        if (nodes.length === 0)
            return;
        // Sort nodes based on sorting option
        this._sortNodes(nodes);
        // Determine grid dimensions
        var isHorizontal = (this._arrangement === GridArrangementLeftToRight ||
            this._arrangement === GridArrangementRightToLeft);
        // Calculate wrapping
        var cols;
        if (!isNaN(this._wrappingWidth) && this._wrappingWidth > 0) {
            var cellW = this._cellSize.width + this._spacing.width;
            cols = Math.max(1, Math.floor((this._wrappingWidth - this._spacing.width) / cellW));
        }
        else {
            cols = Math.ceil(Math.sqrt(nodes.length));
        }
        var rows = Math.ceil(nodes.length / cols);
        // Position each node
        var origin = this.arrangementOrigin;
        for (var i = 0; i < nodes.length; i++) {
            var row = void 0, col = void 0;
            if (isHorizontal) {
                // Fill rows first (left-to-right or right-to-left)
                row = Math.floor(i / cols);
                col = i % cols;
                if (this._arrangement === GridArrangementRightToLeft) {
                    col = cols - 1 - col;
                }
            }
            else {
                // Fill columns first (top-to-bottom or bottom-to-top)
                col = Math.floor(i / rows);
                row = i % rows;
                if (this._arrangement === GridArrangementBottomToTop) {
                    row = rows - 1 - row;
                }
            }
            var bounds = this.getLayoutBounds(nodes[i]);
            var cellWidth = Math.max(this._cellSize.width, bounds.width);
            var cellHeight = Math.max(this._cellSize.height, bounds.height);
            var x = origin.x + col * (cellWidth + this._spacing.width);
            var y = origin.y + row * (cellHeight + this._spacing.height);
            // Apply alignment
            if (this._alignment === GridLayoutCenter) {
                x += (cellWidth - bounds.width) / 2;
                y += (cellHeight - bounds.height) / 2;
            }
            nodes[i].move(new Point(x, y));
        }
        this.isValidLayout = true;
    };
    GridLayout.prototype._sortNodes = function (nodes) {
        switch (this._sorting) {
            case TreeSortingReverse:
                nodes.reverse();
                break;
            case TreeSortingAscending:
                nodes.sort(function (a, b) {
                    var ak = a.data ? String(a.data.key) : '';
                    var bk = b.data ? String(b.data.key) : '';
                    return ak.localeCompare(bk);
                });
                break;
            case TreeSortingDescending:
                nodes.sort(function (a, b) {
                    var ak = a.data ? String(a.data.key) : '';
                    var bk = b.data ? String(b.data.key) : '';
                    return bk.localeCompare(ak);
                });
                break;
        }
    };
    GridLayout.smartComparer = function (a, b) {
        var na = (a && a.data && a.data.name) || '';
        var nb = (b && b.data && b.data.name) || '';
        return na < nb ? -1 : na > nb ? 1 : 0;
    };
    GridLayout.Location = GridLayoutLocation;
    GridLayout.Center = GridLayoutCenter;
    GridLayout.Forwards = GridSortingForwards;
    GridLayout.Reverse = GridSortingReverse;
    GridLayout.Ascending = GridSortingAscending;
    GridLayout.Descending = GridSortingDescending;
    GridLayout.Position = GridAlignmentPosition;
    return GridLayout;
}(Layout));

/**
 * TreeLayout - arranges nodes in a tree structure.
 */
var TreeLayout = /** @class */ (function (_super) {
    __extends(TreeLayout, _super);
    function TreeLayout() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._angle = 0;
        _this._layerSpacing = 50;
        _this._nodeSpacing = 20;
        _this._treeStyle = TreeStyleLayered;
        _this._arrangement = TreeArrangementVertical;
        _this._layerStyle = TreeLayerStyleIndividual;
        _this._compaction = TreeCompactionBlock;
        _this._sorting = TreeSortingForwards;
        _this._path = TreePathDefault;
        _this._alternateAngle = 90;
        _this._alternateLayerSpacing = NaN;
        _this._alternateNodeSpacing = NaN;
        _this._alternateAlignment = TreeStyleLayered;
        _this._alternateCompaction = TreeCompactionBlock;
        _this._alternateSorting = TreeSortingForwards;
        return _this;
    }
    Object.defineProperty(TreeLayout.prototype, "angle", {
        get: function () { return this._angle; },
        set: function (val) { this._angle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "layerSpacing", {
        get: function () { return this._layerSpacing; },
        set: function (val) { this._layerSpacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "nodeSpacing", {
        get: function () { return this._nodeSpacing; },
        set: function (val) { this._nodeSpacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "treeStyle", {
        get: function () { return this._treeStyle; },
        set: function (val) { this._treeStyle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "arrangement", {
        get: function () { return this._arrangement; },
        set: function (val) { this._arrangement = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "layerStyle", {
        get: function () { return this._layerStyle; },
        set: function (val) { this._layerStyle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "compaction", {
        get: function () { return this._compaction; },
        set: function (val) { this._compaction = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "sorting", {
        get: function () { return this._sorting; },
        set: function (val) { this._sorting = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "path", {
        get: function () { return this._path; },
        set: function (val) { this._path = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "alternateAngle", {
        get: function () { return this._alternateAngle; },
        set: function (val) { this._alternateAngle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "alternateLayerSpacing", {
        get: function () { return this._alternateLayerSpacing; },
        set: function (val) { this._alternateLayerSpacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "alternateNodeSpacing", {
        get: function () { return this._alternateNodeSpacing; },
        set: function (val) { this._alternateNodeSpacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "alternateAlignment", {
        get: function () { return this._alternateAlignment; },
        set: function (val) { this._alternateAlignment = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "alternateCompaction", {
        get: function () { return this._alternateCompaction; },
        set: function (val) { this._alternateCompaction = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TreeLayout.prototype, "alternateSorting", {
        get: function () { return this._alternateSorting; },
        set: function (val) { this._alternateSorting = val; },
        enumerable: false,
        configurable: true
    });
    TreeLayout.prototype.copy = function () {
        var copy = new TreeLayout();
        copy._arrangementOrigin = this._arrangementOrigin.copy();
        copy._angle = this._angle;
        copy._layerSpacing = this._layerSpacing;
        copy._nodeSpacing = this._nodeSpacing;
        copy._treeStyle = this._treeStyle;
        copy._arrangement = this._arrangement;
        copy._layerStyle = this._layerStyle;
        copy._compaction = this._compaction;
        copy._sorting = this._sorting;
        copy._path = this._path;
        copy._alternateAngle = this._alternateAngle;
        copy._alternateLayerSpacing = this._alternateLayerSpacing;
        copy._alternateNodeSpacing = this._alternateNodeSpacing;
        copy._alternateAlignment = this._alternateAlignment;
        copy._alternateCompaction = this._alternateCompaction;
        copy._alternateSorting = this._alternateSorting;
        return copy;
    };
    TreeLayout.prototype.doLayout = function (coll) {
        var e_1, _a, e_2, _b, e_3, _c, e_4, _d, e_5, _e, e_6, _f;
        var parts = this.collectParts(coll);
        if (parts.count === 0)
            return;
        // Build network
        var net = this.makeNetwork(coll);
        if (net.vertexes.count === 0)
            return;
        // Build tree structure from links
        var nodeToInfo = new Map$1();
        var vertexToInfo = new Map$1();
        // Create TreeNodeInfo for each vertex
        var vit = net.vertexes.iterator;
        while (vit.next()) {
            var vertex = vit.value;
            if (vertex.node) {
                var info = {
                    vertex: vertex,
                    children: [],
                    parent: null,
                    layer: 0,
                    relativePosition: 0
                };
                nodeToInfo.set(vertex.node, info);
                vertexToInfo.set(vertex, info);
            }
        }
        // Build parent-child relationships from edges
        var eit = net.edges.iterator;
        while (eit.next()) {
            var edge = eit.value;
            if (!edge.fromVertex || !edge.toVertex)
                continue;
            var parentInfo = vertexToInfo.get(edge.fromVertex);
            var childInfo = vertexToInfo.get(edge.toVertex);
            if (parentInfo && childInfo) {
                // Determine direction based on path
                if (this._path === TreePathSource) {
                    // Parent is fromVertex
                    parentInfo.children.push(childInfo);
                    childInfo.parent = parentInfo;
                }
                else if (this._path === TreePathDestination) {
                    // Parent is toVertex
                    childInfo.children.push(parentInfo);
                    parentInfo.parent = childInfo;
                }
                else {
                    // Default: from is parent, to is child
                    parentInfo.children.push(childInfo);
                    childInfo.parent = parentInfo;
                }
            }
        }
        // Sort children based on sorting option
        var allInfos = [];
        nodeToInfo.each(function (info) { allInfos.push(info); });
        try {
            for (var allInfos_1 = __values(allInfos), allInfos_1_1 = allInfos_1.next(); !allInfos_1_1.done; allInfos_1_1 = allInfos_1.next()) {
                var info = allInfos_1_1.value;
                this._sortChildren(info.children);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (allInfos_1_1 && !allInfos_1_1.done && (_a = allInfos_1.return)) _a.call(allInfos_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Find roots (nodes with no parent)
        var roots = [];
        try {
            for (var allInfos_2 = __values(allInfos), allInfos_2_1 = allInfos_2.next(); !allInfos_2_1.done; allInfos_2_1 = allInfos_2.next()) {
                var info = allInfos_2_1.value;
                if (info.parent === null) {
                    roots.push(info);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (allInfos_2_1 && !allInfos_2_1.done && (_b = allInfos_2.return)) _b.call(allInfos_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // If no roots found (cyclic graph), pick the first vertex as root
        if (roots.length === 0 && allInfos.length > 0) {
            roots.push(allInfos[0]);
        }
        try {
            // Assign layers (depth) to each node
            for (var roots_1 = __values(roots), roots_1_1 = roots_1.next(); !roots_1_1.done; roots_1_1 = roots_1.next()) {
                var root = roots_1_1.value;
                this._assignLayers(root, 0);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (roots_1_1 && !roots_1_1.done && (_c = roots_1.return)) _c.call(roots_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        // Position nodes
        var origin = this.arrangementOrigin;
        var isVertical = (this._angle === 0 || this._angle === 180);
        var isReversed = (this._angle === 180 || this._angle === 270);
        try {
            for (var roots_2 = __values(roots), roots_2_1 = roots_2.next(); !roots_2_1.done; roots_2_1 = roots_2.next()) {
                var root = roots_2_1.value;
                this._layoutTree(root, isVertical, isReversed);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (roots_2_1 && !roots_2_1.done && (_d = roots_2.return)) _d.call(roots_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        // Offset all positions to the arrangement origin
        // Find the minimum position
        var minX = Infinity, minY = Infinity;
        try {
            for (var allInfos_3 = __values(allInfos), allInfos_3_1 = allInfos_3.next(); !allInfos_3_1.done; allInfos_3_1 = allInfos_3.next()) {
                var info = allInfos_3_1.value;
                minX = Math.min(minX, info.vertex.x);
                minY = Math.min(minY, info.vertex.y);
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (allInfos_3_1 && !allInfos_3_1.done && (_e = allInfos_3.return)) _e.call(allInfos_3);
            }
            finally { if (e_5) throw e_5.error; }
        }
        try {
            // Move all nodes relative to origin
            for (var allInfos_4 = __values(allInfos), allInfos_4_1 = allInfos_4.next(); !allInfos_4_1.done; allInfos_4_1 = allInfos_4.next()) {
                var info = allInfos_4_1.value;
                var v = info.vertex;
                var x = origin.x + (v.x - minX);
                var y = origin.y + (v.y - minY);
                if (v.node) {
                    v.node.move(new Point(x, y));
                }
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (allInfos_4_1 && !allInfos_4_1.done && (_f = allInfos_4.return)) _f.call(allInfos_4);
            }
            finally { if (e_6) throw e_6.error; }
        }
        this.isValidLayout = true;
    };
    TreeLayout.prototype._sortChildren = function (children) {
        switch (this._sorting) {
            case TreeSortingAscending:
                children.sort(function (a, b) {
                    var _a, _b, _c, _d;
                    var ak = a.vertex.node ? String((_b = (_a = a.vertex.node.data) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : '') : '';
                    var bk = b.vertex.node ? String((_d = (_c = b.vertex.node.data) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : '') : '';
                    return ak.localeCompare(bk);
                });
                break;
            case TreeSortingDescending:
                children.sort(function (a, b) {
                    var _a, _b, _c, _d;
                    var ak = a.vertex.node ? String((_b = (_a = a.vertex.node.data) === null || _a === void 0 ? void 0 : _a.key) !== null && _b !== void 0 ? _b : '') : '';
                    var bk = b.vertex.node ? String((_d = (_c = b.vertex.node.data) === null || _c === void 0 ? void 0 : _c.key) !== null && _d !== void 0 ? _d : '') : '';
                    return bk.localeCompare(ak);
                });
                break;
            case TreeSortingReverse:
                children.reverse();
                break;
        }
    };
    TreeLayout.prototype._assignLayers = function (node, layer) {
        var e_7, _a;
        node.layer = layer;
        try {
            for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                this._assignLayers(child, layer + 1);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_7) throw e_7.error; }
        }
    };
    TreeLayout.prototype._layoutTree = function (root, isVertical, isReversed) {
        // Compute subtree widths
        this._computeSubtreeWidth(root, isVertical);
        // Position the tree
        this._positionTree(root, 0, 0, isVertical, isReversed);
    };
    TreeLayout.prototype._computeSubtreeWidth = function (node, isVertical) {
        var e_8, _a;
        if (node.children.length === 0) {
            // Leaf node width is its own size
            var size = isVertical ? node.vertex.width : node.vertex.height;
            return size;
        }
        var totalWidth = 0;
        try {
            for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var childWidth = this._computeSubtreeWidth(child, isVertical);
                totalWidth += childWidth;
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_8) throw e_8.error; }
        }
        // Add spacing between children
        totalWidth += (node.children.length - 1) * this._nodeSpacing;
        var ownSize = isVertical ? node.vertex.width : node.vertex.height;
        return Math.max(totalWidth, ownSize);
    };
    TreeLayout.prototype._positionTree = function (node, offsetX, offsetY, isVertical, isReversed) {
        var e_9, _a;
        // Position this node
        var subtreeWidth = this._computeSubtreeWidth(node, isVertical);
        if (isVertical) {
            // Vertical tree: layers go top-to-bottom, children spread horizontally
            var layerOffset = isReversed ? -node.layer * this._layerSpacing : node.layer * this._layerSpacing;
            node.vertex.x = offsetX + subtreeWidth / 2 - node.vertex.width / 2;
            node.vertex.y = offsetY + layerOffset;
        }
        else {
            // Horizontal tree: layers go left-to-right, children spread vertically
            var layerOffset = isReversed ? -node.layer * this._layerSpacing : node.layer * this._layerSpacing;
            node.vertex.x = offsetX + layerOffset;
            node.vertex.y = offsetY + subtreeWidth / 2 - node.vertex.height / 2;
        }
        // Position children
        var childOffset = 0;
        try {
            for (var _b = __values(node.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var childSubtreeWidth = this._computeSubtreeWidth(child, isVertical);
                if (isVertical) {
                    this._positionTree(child, offsetX + childOffset, offsetY, isVertical, isReversed);
                }
                else {
                    this._positionTree(child, offsetX, offsetY + childOffset, isVertical, isReversed);
                }
                childOffset += childSubtreeWidth + this._nodeSpacing;
            }
        }
        catch (e_9_1) { e_9 = { error: e_9_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_9) throw e_9.error; }
        }
    };
    return TreeLayout;
}(Layout));

/**
 * ForceDirectedLayout - positions nodes using a force-directed (spring-electric) algorithm.
 * Nodes repel each other (electrical charge), edges attract connected nodes (springs),
 * and gravity pulls nodes toward the center.
 */
var ForceDirectedLayout = /** @class */ (function (_super) {
    __extends(ForceDirectedLayout, _super);
    function ForceDirectedLayout() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._maxIterations = 300;
        _this._defaultSpringLength = 50;
        _this._defaultSpringStiffness = 0.05;
        _this._defaultElectricalCharge = 150;
        _this._defaultGravity = 0.1;
        _this._infinityDistance = 1000;
        _this._epsilon = 0.01;
        return _this;
    }
    Object.defineProperty(ForceDirectedLayout.prototype, "maxIterations", {
        get: function () { return this._maxIterations; },
        set: function (val) { this._maxIterations = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForceDirectedLayout.prototype, "defaultSpringLength", {
        get: function () { return this._defaultSpringLength; },
        set: function (val) { this._defaultSpringLength = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForceDirectedLayout.prototype, "defaultSpringStiffness", {
        get: function () { return this._defaultSpringStiffness; },
        set: function (val) { this._defaultSpringStiffness = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForceDirectedLayout.prototype, "defaultElectricalCharge", {
        get: function () { return this._defaultElectricalCharge; },
        set: function (val) { this._defaultElectricalCharge = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForceDirectedLayout.prototype, "defaultGravity", {
        get: function () { return this._defaultGravity; },
        set: function (val) { this._defaultGravity = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForceDirectedLayout.prototype, "infinityDistance", {
        get: function () { return this._infinityDistance; },
        set: function (val) { this._infinityDistance = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ForceDirectedLayout.prototype, "epsilon", {
        get: function () { return this._epsilon; },
        set: function (val) { this._epsilon = val; },
        enumerable: false,
        configurable: true
    });
    ForceDirectedLayout.prototype.copy = function () {
        var copy = new ForceDirectedLayout();
        copy._arrangementOrigin = this._arrangementOrigin.copy();
        copy._maxIterations = this._maxIterations;
        copy._defaultSpringLength = this._defaultSpringLength;
        copy._defaultSpringStiffness = this._defaultSpringStiffness;
        copy._defaultElectricalCharge = this._defaultElectricalCharge;
        copy._defaultGravity = this._defaultGravity;
        copy._infinityDistance = this._infinityDistance;
        copy._epsilon = this._epsilon;
        return copy;
    };
    ForceDirectedLayout.prototype.doLayout = function (coll) {
        var e_1, _a, e_2, _b;
        var parts = this.collectParts(coll);
        if (parts.count === 0)
            return;
        // Build network
        var net = this.makeNetwork(coll);
        if (net.vertexes.count === 0)
            return;
        var vertexes = [];
        var vit = net.vertexes.iterator;
        while (vit.next()) {
            vertexes.push(vit.value);
        }
        if (vertexes.length === 0)
            return;
        // Initialize positions if they are all at the same location
        this._initializePositions(vertexes, net);
        // Force-directed iteration
        var origin = this.arrangementOrigin;
        // Velocity storage for each vertex
        var vx = new Float64Array(vertexes.length);
        var vy = new Float64Array(vertexes.length);
        var dt = 1.0;
        var damping = 0.9;
        for (var iter = 0; iter < this._maxIterations; iter++) {
            // Compute forces
            var fx = new Float64Array(vertexes.length);
            var fy = new Float64Array(vertexes.length);
            // 1. Electrical repulsion between all pairs of nodes
            for (var i = 0; i < vertexes.length; i++) {
                for (var j = i + 1; j < vertexes.length; j++) {
                    var vi = vertexes[i];
                    var vj = vertexes[j];
                    var ci = vi.center;
                    var cj = vj.center;
                    var dx = cj.x - ci.x;
                    var dy = cj.y - ci.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < this._epsilon)
                        dist = this._epsilon;
                    if (dist > this._infinityDistance)
                        continue;
                    // Coulomb's law: F = k * q1 * q2 / r^2
                    var force = this._defaultElectricalCharge * this._defaultElectricalCharge / (dist * dist);
                    var fxComp = force * dx / dist;
                    var fyComp = force * dy / dist;
                    fx[i] -= fxComp;
                    fy[i] -= fyComp;
                    fx[j] += fxComp;
                    fy[j] += fyComp;
                }
            }
            // 2. Spring attraction along edges
            var eit = net.edges.iterator;
            while (eit.next()) {
                var edge = eit.value;
                if (!edge.fromVertex || !edge.toVertex)
                    continue;
                var i = vertexes.indexOf(edge.fromVertex);
                var j = vertexes.indexOf(edge.toVertex);
                if (i < 0 || j < 0)
                    continue;
                var ci = edge.fromVertex.center;
                var cj = edge.toVertex.center;
                var dx = cj.x - ci.x;
                var dy = cj.y - ci.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this._epsilon)
                    dist = this._epsilon;
                // Hooke's law: F = -k * (dist - restLength)
                var springLength = isNaN(edge.length) ? this._defaultSpringLength : edge.length;
                var force = this._defaultSpringStiffness * (dist - springLength);
                var fxComp = force * dx / dist;
                var fyComp = force * dy / dist;
                fx[i] += fxComp;
                fy[i] += fyComp;
                fx[j] -= fxComp;
                fy[j] -= fyComp;
            }
            // 3. Gravity toward center
            var centerX = 0, centerY = 0;
            for (var i = 0; i < vertexes.length; i++) {
                var c = vertexes[i].center;
                centerX += c.x;
                centerY += c.y;
            }
            centerX /= vertexes.length;
            centerY /= vertexes.length;
            for (var i = 0; i < vertexes.length; i++) {
                var c = vertexes[i].center;
                var dx = centerX - c.x;
                var dy = centerY - c.y;
                fx[i] += dx * this._defaultGravity;
                fy[i] += dy * this._defaultGravity;
            }
            // Update positions with velocity
            var totalMovement = 0;
            for (var i = 0; i < vertexes.length; i++) {
                vx[i] = (vx[i] + fx[i] * dt) * damping;
                vy[i] = (vy[i] + fy[i] * dt) * damping;
                var v = vertexes[i];
                v.x += vx[i] * dt;
                v.y += vy[i] * dt;
                totalMovement += Math.abs(vx[i]) + Math.abs(vy[i]);
            }
            // Early termination if layout has stabilized
            if (totalMovement < this._epsilon * vertexes.length)
                break;
        }
        // Normalize positions to origin
        var minX = Infinity, minY = Infinity;
        try {
            for (var vertexes_1 = __values(vertexes), vertexes_1_1 = vertexes_1.next(); !vertexes_1_1.done; vertexes_1_1 = vertexes_1.next()) {
                var v = vertexes_1_1.value;
                minX = Math.min(minX, v.x);
                minY = Math.min(minY, v.y);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (vertexes_1_1 && !vertexes_1_1.done && (_a = vertexes_1.return)) _a.call(vertexes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            // Commit positions
            for (var vertexes_2 = __values(vertexes), vertexes_2_1 = vertexes_2.next(); !vertexes_2_1.done; vertexes_2_1 = vertexes_2.next()) {
                var v = vertexes_2_1.value;
                if (v.node && !v._isArtificial) {
                    var x = origin.x + (v.x - minX);
                    var y = origin.y + (v.y - minY);
                    v.node.move(new Point(x, y));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (vertexes_2_1 && !vertexes_2_1.done && (_b = vertexes_2.return)) _b.call(vertexes_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.isValidLayout = true;
    };
    /**
     * Initialize vertex positions in a circle if they are all at the same location.
     */
    ForceDirectedLayout.prototype._initializePositions = function (vertexes, net) {
        // Check if all vertexes are at the same position
        var allSame = true;
        var first = vertexes[0];
        for (var i = 1; i < vertexes.length; i++) {
            if (vertexes[i].x !== first.x || vertexes[i].y !== first.y) {
                allSame = false;
                break;
            }
        }
        if (!allSame)
            return;
        // Place vertexes in a circle
        var radius = this._defaultSpringLength * Math.sqrt(vertexes.length);
        for (var i = 0; i < vertexes.length; i++) {
            var angle = (2 * Math.PI * i) / vertexes.length;
            vertexes[i].x = radius * Math.cos(angle);
            vertexes[i].y = radius * Math.sin(angle);
        }
    };
    return ForceDirectedLayout;
}(Layout));

/** Helper: create an array of N empty arrays (ES5-compatible replacement for Array.from) */
function createArrayOfArrays(length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push([]);
    }
    return result;
}
/**
 * LayeredDigraphLayout - implements a Sugiyama-style layered digraph layout.
 * Produces a layered arrangement of nodes with minimized edge crossings.
 */
var LayeredDigraphLayout = /** @class */ (function (_super) {
    __extends(LayeredDigraphLayout, _super);
    function LayeredDigraphLayout() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._direction = LayeredDigraphDirectionDown;
        _this._layerSpacing = 50;
        _this._columnSpacing = 30;
        _this._setsPortSpots = true;
        _this._aggressiveOption = LayeredDigraphAggressiveNone;
        _this._packOption = LayeredDigraphPackAll;
        _this._layeringOption = 'longestpathsource';
        _this._cycleRemoveOption = 'depthfirst';
        return _this;
    }
    Object.defineProperty(LayeredDigraphLayout.prototype, "direction", {
        get: function () { return this._direction; },
        set: function (val) { this._direction = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "layerSpacing", {
        get: function () { return this._layerSpacing; },
        set: function (val) { this._layerSpacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "columnSpacing", {
        get: function () { return this._columnSpacing; },
        set: function (val) { this._columnSpacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "setsPortSpots", {
        get: function () { return this._setsPortSpots; },
        set: function (val) { this._setsPortSpots = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "aggressiveOption", {
        get: function () { return this._aggressiveOption; },
        set: function (val) { this._aggressiveOption = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "packOption", {
        get: function () { return this._packOption; },
        set: function (val) { this._packOption = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "layeringOption", {
        get: function () { return this._layeringOption; },
        set: function (val) { this._layeringOption = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LayeredDigraphLayout.prototype, "cycleRemoveOption", {
        get: function () { return this._cycleRemoveOption; },
        set: function (val) { this._cycleRemoveOption = val; },
        enumerable: false,
        configurable: true
    });
    LayeredDigraphLayout.prototype.copy = function () {
        var copy = new LayeredDigraphLayout();
        copy._arrangementOrigin = this._arrangementOrigin.copy();
        copy._direction = this._direction;
        copy._layerSpacing = this._layerSpacing;
        copy._columnSpacing = this._columnSpacing;
        copy._setsPortSpots = this._setsPortSpots;
        copy._aggressiveOption = this._aggressiveOption;
        copy._packOption = this._packOption;
        copy._layeringOption = this._layeringOption;
        copy._cycleRemoveOption = this._cycleRemoveOption;
        return copy;
    };
    LayeredDigraphLayout.prototype.doLayout = function (coll) {
        var e_1, _a, e_2, _b;
        var parts = this.collectParts(coll);
        if (parts.count === 0)
            return;
        // Build network
        var net = this.makeNetwork(coll);
        if (net.vertexes.count === 0)
            return;
        var vertexes = [];
        var vit = net.vertexes.iterator;
        while (vit.next()) {
            vertexes.push(vit.value);
        }
        var edges = [];
        var eit = net.edges.iterator;
        while (eit.next()) {
            edges.push(eit.value);
        }
        if (vertexes.length === 0)
            return;
        // Assign indices
        for (var i = 0; i < vertexes.length; i++) {
            vertexes[i]._index = i;
        }
        // Step 1: Remove cycles using DFS
        var reversedEdges = this._removeCycles(vertexes, edges).reversedEdges;
        // Step 2: Assign layers
        var layers = this._assignLayers(vertexes, edges);
        // Step 3: Order nodes within layers (crossing reduction)
        this._reduceCrossings(layers, edges);
        // Step 4: Position nodes
        this._positionNodes(layers);
        try {
            // Restore reversed edges
            for (var reversedEdges_1 = __values(reversedEdges), reversedEdges_1_1 = reversedEdges_1.next(); !reversedEdges_1_1.done; reversedEdges_1_1 = reversedEdges_1.next()) {
                var edge = reversedEdges_1_1.value;
                var temp = edge.fromVertex;
                edge.fromVertex = edge.toVertex;
                edge.toVertex = temp;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (reversedEdges_1_1 && !reversedEdges_1_1.done && (_a = reversedEdges_1.return)) _a.call(reversedEdges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // Commit positions
        var origin = this.arrangementOrigin;
        var isVertical = (this._direction === LayeredDigraphDirectionDown || this._direction === LayeredDigraphDirectionUp);
        var isReversed = (this._direction === LayeredDigraphDirectionUp || this._direction === LayeredDigraphDirectionLeft);
        try {
            for (var vertexes_1 = __values(vertexes), vertexes_1_1 = vertexes_1.next(); !vertexes_1_1.done; vertexes_1_1 = vertexes_1.next()) {
                var v = vertexes_1_1.value;
                if (v.node && !v._isArtificial) {
                    var x = void 0, y = void 0;
                    if (isVertical) {
                        x = origin.x + v.x;
                        y = isReversed ? origin.y - v.y : origin.y + v.y;
                    }
                    else {
                        y = origin.y + v.x;
                        x = isReversed ? origin.x - v.y : origin.x + v.y;
                    }
                    v.node.move(new Point(x, y));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (vertexes_1_1 && !vertexes_1_1.done && (_b = vertexes_1.return)) _b.call(vertexes_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.isValidLayout = true;
    };
    /**
     * Remove cycles by reversing back edges in a DFS traversal.
     */
    LayeredDigraphLayout.prototype._removeCycles = function (vertexes, edges) {
        var e_3, _a;
        var reversedEdges = [];
        var visited = new Uint8Array(vertexes.length); // 0=white, 1=gray, 2=black
        var adjList = createArrayOfArrays(vertexes.length);
        try {
            for (var edges_1 = __values(edges), edges_1_1 = edges_1.next(); !edges_1_1.done; edges_1_1 = edges_1.next()) {
                var edge = edges_1_1.value;
                if (edge.fromVertex && edge.toVertex) {
                    adjList[edge.fromVertex._index].push(edges.indexOf(edge));
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) _a.call(edges_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        var dfs = function (vIdx) {
            var e_4, _a;
            visited[vIdx] = 1; // gray (in progress)
            try {
                for (var _b = __values(adjList[vIdx]), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var edgeIdx = _c.value;
                    var edge = edges[edgeIdx];
                    if (!edge.toVertex)
                        continue;
                    var toIdx = edge.toVertex._index;
                    if (visited[toIdx] === 1) {
                        // Back edge - reverse it
                        var temp = edge.fromVertex;
                        edge.fromVertex = edge.toVertex;
                        edge.toVertex = temp;
                        reversedEdges.push(edge);
                    }
                    else if (visited[toIdx] === 0) {
                        dfs(toIdx);
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            visited[vIdx] = 2; // black (done)
        };
        for (var i = 0; i < vertexes.length; i++) {
            if (visited[i] === 0) {
                dfs(i);
            }
        }
        return { reversedEdges: reversedEdges };
    };
    /**
     * Assign layers to vertexes using longest path from source.
     */
    LayeredDigraphLayout.prototype._assignLayers = function (vertexes, edges) {
        var e_5, _a, e_6, _b;
        var inDegree = new Int32Array(vertexes.length);
        var adjList = createArrayOfArrays(vertexes.length);
        try {
            for (var edges_2 = __values(edges), edges_2_1 = edges_2.next(); !edges_2_1.done; edges_2_1 = edges_2.next()) {
                var edge = edges_2_1.value;
                if (edge.fromVertex && edge.toVertex) {
                    inDegree[edge.toVertex._index]++;
                    adjList[edge.fromVertex._index].push(edge.toVertex._index);
                }
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (edges_2_1 && !edges_2_1.done && (_a = edges_2.return)) _a.call(edges_2);
            }
            finally { if (e_5) throw e_5.error; }
        }
        // Compute layer using longest path from sources
        var layer = new Int32Array(vertexes.length).fill(-1);
        var queue = [];
        // Find sources (in-degree 0)
        for (var i = 0; i < vertexes.length; i++) {
            if (inDegree[i] === 0) {
                layer[i] = 0;
                queue.push(i);
            }
        }
        while (queue.length > 0) {
            var v = queue.shift();
            try {
                for (var _c = (e_6 = void 0, __values(adjList[v])), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var toIdx = _d.value;
                    layer[toIdx] = Math.max(layer[toIdx], layer[v] + 1);
                    inDegree[toIdx]--;
                    if (inDegree[toIdx] === 0) {
                        queue.push(toIdx);
                    }
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        // Handle any remaining unassigned (from cycles that weren't fully broken)
        for (var i = 0; i < vertexes.length; i++) {
            if (layer[i] === -1)
                layer[i] = 0;
        }
        // Build layers
        var maxLayer = 0;
        for (var i = 0; i < vertexes.length; i++) {
            if (layer[i] > maxLayer)
                maxLayer = layer[i];
        }
        var layers = createArrayOfArrays(maxLayer + 1);
        for (var i = 0; i < vertexes.length; i++) {
            layers[layer[i]].push(vertexes[i]);
        }
        return layers;
    };
    /**
     * Reduce edge crossings using barycenter heuristic.
     */
    LayeredDigraphLayout.prototype._reduceCrossings = function (layers, edges) {
        var e_7, _a;
        // Build adjacency info
        var vertexIndex = new Map$1();
        try {
            for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                var layer = layers_1_1.value;
                for (var i = 0; i < layer.length; i++) {
                    vertexIndex.set(layer[i], i);
                }
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        // Multiple passes of barycenter ordering
        for (var pass = 0; pass < 4; pass++) {
            // Forward pass (top to bottom)
            for (var l = 1; l < layers.length; l++) {
                this._barycenterOrder(layers[l], layers[l - 1], edges, true);
            }
            // Backward pass (bottom to top)
            for (var l = layers.length - 2; l >= 0; l--) {
                this._barycenterOrder(layers[l], layers[l + 1], edges, false);
            }
        }
    };
    /**
     * Reorder a layer based on barycenter of neighbors.
     */
    LayeredDigraphLayout.prototype._barycenterOrder = function (layer, neighborLayer, edges, isDownward) {
        var e_8, _a, e_9, _b;
        var neighborPos = new Map$1();
        for (var i = 0; i < neighborLayer.length; i++) {
            neighborPos.set(neighborLayer[i], i);
        }
        // Compute barycenter for each vertex in the layer
        var barycenters = new Map$1();
        try {
            for (var layer_1 = __values(layer), layer_1_1 = layer_1.next(); !layer_1_1.done; layer_1_1 = layer_1.next()) {
                var v = layer_1_1.value;
                var sum = 0;
                var count = 0;
                try {
                    for (var edges_3 = (e_9 = void 0, __values(edges)), edges_3_1 = edges_3.next(); !edges_3_1.done; edges_3_1 = edges_3.next()) {
                        var edge = edges_3_1.value;
                        var source = isDownward ? edge.fromVertex : edge.toVertex;
                        var target = isDownward ? edge.toVertex : edge.fromVertex;
                        if (target === v && source && neighborPos.has(source)) {
                            sum += neighborPos.get(source);
                            count++;
                        }
                    }
                }
                catch (e_9_1) { e_9 = { error: e_9_1 }; }
                finally {
                    try {
                        if (edges_3_1 && !edges_3_1.done && (_b = edges_3.return)) _b.call(edges_3);
                    }
                    finally { if (e_9) throw e_9.error; }
                }
                barycenters.set(v, count > 0 ? sum / count : 0);
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (layer_1_1 && !layer_1_1.done && (_a = layer_1.return)) _a.call(layer_1);
            }
            finally { if (e_8) throw e_8.error; }
        }
        // Sort by barycenter
        layer.sort(function (a, b) { return (barycenters.get(a) || 0) - (barycenters.get(b) || 0); });
    };
    /**
     * Position nodes within each layer.
     */
    LayeredDigraphLayout.prototype._positionNodes = function (layers) {
        var e_10, _a;
        for (var l = 0; l < layers.length; l++) {
            var layer = layers[l];
            var totalWidth = 0;
            try {
                for (var layer_2 = (e_10 = void 0, __values(layer)), layer_2_1 = layer_2.next(); !layer_2_1.done; layer_2_1 = layer_2.next()) {
                    var v = layer_2_1.value;
                    totalWidth += v.width;
                }
            }
            catch (e_10_1) { e_10 = { error: e_10_1 }; }
            finally {
                try {
                    if (layer_2_1 && !layer_2_1.done && (_a = layer_2.return)) _a.call(layer_2);
                }
                finally { if (e_10) throw e_10.error; }
            }
            totalWidth += (layer.length - 1) * this._columnSpacing;
            var x = -totalWidth / 2;
            for (var i = 0; i < layer.length; i++) {
                var v = layer[i];
                v.x = x + v.width / 2;
                v.y = l * this._layerSpacing;
                x += v.width + this._columnSpacing;
            }
        }
    };
    return LayeredDigraphLayout;
}(Layout));

/**
 * CircularLayout - arranges nodes in a circle or circular pattern.
 */
var CircularLayout = /** @class */ (function (_super) {
    __extends(CircularLayout, _super);
    function CircularLayout() {
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this._radius = NaN;
        _this._startAngle = 0;
        _this._sweepAngle = 360;
        _this._arrangement = CircularArrangementConstantDistance;
        _this._spacing = 20;
        _this._direction = CircularDirectionClockwise;
        _this._aspectRatio = 1;
        return _this;
    }
    Object.defineProperty(CircularLayout.prototype, "radius", {
        get: function () { return this._radius; },
        set: function (val) { this._radius = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularLayout.prototype, "startAngle", {
        get: function () { return this._startAngle; },
        set: function (val) { this._startAngle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularLayout.prototype, "sweepAngle", {
        get: function () { return this._sweepAngle; },
        set: function (val) { this._sweepAngle = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularLayout.prototype, "arrangement", {
        get: function () { return this._arrangement; },
        set: function (val) { this._arrangement = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularLayout.prototype, "spacing", {
        get: function () { return this._spacing; },
        set: function (val) { this._spacing = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularLayout.prototype, "direction", {
        get: function () { return this._direction; },
        set: function (val) { this._direction = val; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CircularLayout.prototype, "aspectRatio", {
        get: function () { return this._aspectRatio; },
        set: function (val) { this._aspectRatio = val; },
        enumerable: false,
        configurable: true
    });
    CircularLayout.prototype.copy = function () {
        var copy = new CircularLayout();
        copy._arrangementOrigin = this._arrangementOrigin.copy();
        copy._radius = this._radius;
        copy._startAngle = this._startAngle;
        copy._sweepAngle = this._sweepAngle;
        copy._arrangement = this._arrangement;
        copy._spacing = this._spacing;
        copy._direction = this._direction;
        copy._aspectRatio = this._aspectRatio;
        return copy;
    };
    CircularLayout.prototype.doLayout = function (coll) {
        var e_1, _a;
        var parts = this.collectParts(coll);
        if (parts.count === 0)
            return;
        // Build network
        var net = this.makeNetwork(coll);
        if (net.vertexes.count === 0)
            return;
        // Find connected components
        var subNetworks = net.splitIntoSubNetworks();
        var origin = this.arrangementOrigin;
        var offsetX = 0;
        var offsetY = 0;
        var it = subNetworks.iterator;
        while (it.next()) {
            var subNet = it.value;
            this._layoutComponent(subNet, origin.x + offsetX, origin.y + offsetY);
            // Compute the bounding box of this component to offset the next one
            var vertexes = [];
            var vit = subNet.vertexes.iterator;
            while (vit.next()) {
                vertexes.push(vit.value);
            }
            if (vertexes.length > 0) {
                var maxX = -Infinity;
                try {
                    for (var vertexes_1 = (e_1 = void 0, __values(vertexes)), vertexes_1_1 = vertexes_1.next(); !vertexes_1_1.done; vertexes_1_1 = vertexes_1.next()) {
                        var v = vertexes_1_1.value;
                        maxX = Math.max(maxX, v.x + v.width);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (vertexes_1_1 && !vertexes_1_1.done && (_a = vertexes_1.return)) _a.call(vertexes_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                offsetX = maxX + this._spacing * 2;
            }
        }
        this.isValidLayout = true;
    };
    /**
     * Layout a single connected component in a circle.
     */
    CircularLayout.prototype._layoutComponent = function (net, centerX, centerY) {
        var vertexes = [];
        var vit = net.vertexes.iterator;
        while (vit.next()) {
            vertexes.push(vit.value);
        }
        if (vertexes.length === 0)
            return;
        // Single node - just place at center
        if (vertexes.length === 1) {
            var v = vertexes[0];
            v.x = centerX;
            v.y = centerY;
            if (v.node) {
                v.node.move(new Point(v.x, v.y));
            }
            return;
        }
        // Compute radius if not specified
        var radius = this._radius;
        if (isNaN(radius)) {
            radius = this._computeRadius(vertexes);
        }
        // Determine direction multiplier
        var clockwise = this._direction === CircularDirectionClockwise;
        var dirMult = clockwise ? 1 : -1;
        // Compute angular spacing based on arrangement
        var startRad = (this._startAngle * Math.PI) / 180;
        var sweepRad = (this._sweepAngle * Math.PI) / 180;
        // Position each vertex
        for (var i = 0; i < vertexes.length; i++) {
            var v = vertexes[i];
            var angle = void 0;
            switch (this._arrangement) {
                case CircularArrangementConstantAngle: {
                    // Equal angular spacing
                    angle = startRad + dirMult * (sweepRad * i / vertexes.length);
                    break;
                }
                case CircularArrangementConstantRadius: {
                    // Constant radius but adjusted angular spacing based on node size
                    angle = startRad + dirMult * (sweepRad * i / vertexes.length);
                    break;
                }
                case CircularArrangementPacked: {
                    // Pack nodes tightly along the circle
                    angle = startRad + dirMult * (sweepRad * i / vertexes.length);
                    break;
                }
                case CircularArrangementConstantDistance:
                default: {
                    // Constant arc distance between nodes
                    var nodeSize = Math.max(v.width, v.height);
                    var arcLength = nodeSize + this._spacing;
                    var angleStep = arcLength / radius;
                    angle = startRad + dirMult * angleStep * i;
                    break;
                }
            }
            var x = centerX + radius * Math.cos(angle) * this._aspectRatio;
            var y = centerY + radius * Math.sin(angle);
            v.x = x - v.width / 2;
            v.y = y - v.height / 2;
            if (v.node) {
                v.node.move(new Point(v.x, v.y));
            }
        }
    };
    /**
     * Compute an appropriate radius based on the vertex sizes and spacing.
     */
    CircularLayout.prototype._computeRadius = function (vertexes) {
        var e_2, _a;
        var totalSize = 0;
        try {
            for (var vertexes_2 = __values(vertexes), vertexes_2_1 = vertexes_2.next(); !vertexes_2_1.done; vertexes_2_1 = vertexes_2.next()) {
                var v = vertexes_2_1.value;
                totalSize += Math.max(v.width, v.height) + this._spacing;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (vertexes_2_1 && !vertexes_2_1.done && (_a = vertexes_2.return)) _a.call(vertexes_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        // Circumference = 2 * PI * r, so r = circumference / (2 * PI)
        var circumference = totalSize;
        return Math.max(circumference / (2 * Math.PI), 50);
    };
    CircularLayout.Circular = CircularNodeDiameterFormulaCircular;
    return CircularLayout;
}(Layout));

/**
 * AnimationTrigger - defines an animation that should run when a named property changes.
 */
var AnimationTrigger = /** @class */ (function () {
    function AnimationTrigger() {
        this._propertyName = '';
        this._animation = null;
        this._startsOn = 'changed';
    }
    Object.defineProperty(AnimationTrigger.prototype, "propertyName", {
        // ============ Properties ============
        get: function () {
            return this._propertyName;
        },
        set: function (val) {
            this._propertyName = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationTrigger.prototype, "animation", {
        get: function () {
            return this._animation;
        },
        set: function (val) {
            this._animation = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AnimationTrigger.prototype, "startsOn", {
        get: function () {
            return this._startsOn;
        },
        set: function (val) {
            this._startsOn = val;
        },
        enumerable: false,
        configurable: true
    });
    // ============ Methods ============
    AnimationTrigger.prototype.copy = function () {
        var trigger = new AnimationTrigger();
        trigger.propertyName = this._propertyName;
        trigger.startsOn = this._startsOn;
        if (this._animation) {
            trigger.animation = new Animation();
            trigger.animation.duration = this._animation.duration;
            trigger.animation.easing = this._animation.easing;
            trigger.animation.reversible = this._animation.reversible;
        }
        return trigger;
    };
    return AnimationTrigger;
}());

var GridSorting = {
    Forwards: GridSortingForwards,
    Reverse: GridSortingReverse,
    Ascending: GridSortingAscending,
    Descending: GridSortingDescending,
};
var GridAlignment = {
    Location: GridAlignmentLocation,
    Position: GridAlignmentPosition,
};
var Curve = {
    None: CurveNone,
    Bezier: CurveBezier,
    JumpOver: CurveJumpOver,
    JumpGap: CurveJumpGap,
};
var AutoScale = {
    None: AutoScaleNone,
    Uniform: AutoScaleUniform,
    UniformToFill: AutoScaleUniformToFill,
};
var Routing = {
    Normal: RoutingNormal,
    Orthogonal: RoutingOrthogonal,
    AvoidsNodes: RoutingAvoidsNodes,
};
var ScrollMode = {
    Document: ScrollDocument,
    Infinite: ScrollInfinite,
};
var Stretch = {
    Default: StretchDefault,
    Fill: StretchFill,
    None: StretchNone,
    Uniform: StretchUniform,
    UniformToFill: StretchUniformToFill,
    Horizontal: StretchHorizontal,
    Vertical: StretchVertical,
};
var TreeStyle = {
    Layered: TreeStyleLayered,
    Alternating: TreeStyleAlternating,
    LastParents: TreeStyleLastParents,
    RootOnly: TreeStyleRootOnly,
};
var TreeAlignment = {
    TopLeftBus: TreeAlignmentTopLeftBus,
    BottomRightBus: TreeAlignmentBottomRightBus,
    Bus: TreeAlignmentBus,
    BusBranching: TreeAlignmentBusBranching,
    CenterChildren: TreeAlignmentCenterChildren,
    CenterSubtrees: TreeAlignmentCenterSubtrees,
    Start: TreeAlignmentStart,
    End: TreeAlignmentEnd,
};
var TreeCompaction = {
    Block: TreeCompactionBlock,
    None: TreeCompactionNone,
};
var TreeSorting = {
    Forwards: TreeSortingForwards,
    Reverse: TreeSortingReverse,
    Ascending: TreeSortingAscending,
    Descending: TreeSortingDescending,
};
var TreeArrangement = {
    Vertical: TreeArrangementVertical,
    Horizontal: TreeArrangementHorizontal,
    FixedRoots: TreeArrangementFixedRoots,
};
var TreeLayerStyle = {
    Individual: TreeLayerStyleIndividual,
    Uniform: TreeLayerStyleUniform,
    Siblings: TreeLayerStyleSiblings,
};
var TreePath = {
    Default: TreePathDefault,
    Destination: TreePathDestination,
    Source: TreePathSource,
};
var CircularArrangement = {
    ConstantDistance: CircularArrangementConstantDistance,
    ConstantAngle: CircularArrangementConstantAngle,
    ConstantRadius: CircularArrangementConstantRadius,
    Packed: CircularArrangementPacked,
};
var CircularSorting = {
    Forwards: CircularSortingForwards,
    Reverse: CircularSortingReverse,
    Ascending: CircularSortingAscending,
    Descending: CircularSortingDescending,
    Optimized: CircularSortingOptimized,
};
var LayeredDigraphAggressive = {
    None: LayeredDigraphAggressiveNone,
    Horizontal: LayeredDigraphAggressiveHorizontal,
    Vertical: LayeredDigraphAggressiveVertical,
    All: LayeredDigraphAggressiveAll,
    Less: LayeredDigraphAggressiveLess,
    More: LayeredDigraphAggressiveMore,
};
var LayeredDigraphAlign = {
    None: LayeredDigraphAlignNone,
};
var LayeredDigraphPack = {
    None: LayeredDigraphPackNone,
};
var GridArrangement = {
    LeftToRight: GridArrangementLeftToRight,
    RightToLeft: GridArrangementRightToLeft,
};
var ImageStretch = {
    None: ImageStretchNone,
    Fill: ImageStretchFill,
    Uniform: ImageStretchUniform,
    UniformToFill: ImageStretchUniformToFill,
};
var Sizing = {
    None: SizingNone,
    Prop: SizingProp,
    Auto: SizingAuto,
};
var Wrap = {
    Fit: WrapFit,
    DesiredSize: WrapDesiredSize,
    None: WrapNone,
};
var CycleMode = {
    All: CycleAll,
    NotDirected: CycleNotDirected,
    NotUndirected: CycleNotUndirected,
    DestinationTree: CycleDestinationTree,
    SourceTree: CycleSourceTree,
};
var ChangeType = {
    Property: ChangedEventProperty,
    Insert: ChangedEventInsert,
    Remove: ChangedEventRemove,
    Transaction: ChangedEventTransaction,
};
var SegmentType = {
    Line: PathSegmentLine,
    QuadraticBezier: PathSegmentQuadraticBezier,
    CubicBezier: PathSegmentCubicBezier,
    Arc: PathSegmentArc,
    MoveTo: PathSegmentMoveTo,
    Close: PathSegmentClose,
};
var AnimationStyle = {
    Default: AnimationStyleDefault,
    AnimateLocations: AnimationStyleAnimateLocations,
    None: AnimationStyleNone,
};
var LinkAdjusting = {
    End: LinkAdjustingEnd,
    Stretch: LinkAdjustingStretch,
};
var Orientation = {
    None: OrientationNone,
    Along: OrientationAlong,
    Minus90: OrientationMinus90,
};
var GestureMode = {
    None: GestureModeNone,
    Cancel: GestureModeCancel,
    Zoom: GestureModeZoom,
};
var WheelMode = {
    Zoom: WheelModeZoom,
};
var TextEditingAccept = {
    LostFocus: TextEditingAcceptLostFocus,
};
var TextEditingStarting = {
    SingleClick: TextEditingStartingSingleClick,
};
var LayoutConditions = {
    Standard: LayoutConditionsStandard,
    NodeSized: LayoutConditionsNodeSized,
};
var GeometryStretch = {
    Uniform: GeometryStretchUniform,
};
var GeometryType = {
    Line: GeometryTypeLine,
    Path: GeometryTypePath,
};
var LinkingDirection = {
    ForwardsOnly: LinkingDirectionForwardsOnly,
};
var TriggerStart = {
    Bundled: TriggerStartBundled,
};
var Overflow = {
    Clip: OverflowClip,
    Ellipsis: OverflowEllipsis,
};
var TextOverflow = {
    Clip: OverflowClip,
    Ellipsis: OverflowEllipsis,
};

exports.ActionTool = ActionTool;
exports.Adornment = Adornment;
exports.Animation = Animation;
exports.AnimationDefault = AnimationDefault;
exports.AnimationEaseIn = AnimationEaseIn;
exports.AnimationEaseInOut = AnimationEaseInOut;
exports.AnimationEaseOut = AnimationEaseOut;
exports.AnimationEaseOutBounce = AnimationEaseOutBounce;
exports.AnimationLinear = AnimationLinear;
exports.AnimationManager = AnimationManager;
exports.AnimationStyle = AnimationStyle;
exports.AnimationStyleAnimateLocations = AnimationStyleAnimateLocations;
exports.AnimationStyleDefault = AnimationStyleDefault;
exports.AnimationStyleNone = AnimationStyleNone;
exports.AnimationTrigger = AnimationTrigger;
exports.AutoScale = AutoScale;
exports.AutoScaleNone = AutoScaleNone;
exports.AutoScaleUniform = AutoScaleUniform;
exports.AutoScaleUniformToFill = AutoScaleUniformToFill;
exports.Binding = Binding;
exports.Brush = Brush;
exports.BrushLinear = BrushLinear;
exports.BrushRadial = BrushRadial;
exports.BrushSolid = BrushSolid;
exports.CanvasRenderer = CanvasRenderer;
exports.ChangeType = ChangeType;
exports.ChangedEvent = ChangedEvent;
exports.ChangedEventInsert = ChangedEventInsert;
exports.ChangedEventProperty = ChangedEventProperty;
exports.ChangedEventRemove = ChangedEventRemove;
exports.ChangedEventTransaction = ChangedEventTransaction;
exports.CircularArrangement = CircularArrangement;
exports.CircularArrangementConstantAngle = CircularArrangementConstantAngle;
exports.CircularArrangementConstantDistance = CircularArrangementConstantDistance;
exports.CircularArrangementConstantRadius = CircularArrangementConstantRadius;
exports.CircularArrangementPacked = CircularArrangementPacked;
exports.CircularDirectionBidirectionalLeft = CircularDirectionBidirectionalLeft;
exports.CircularDirectionBidirectionalRight = CircularDirectionBidirectionalRight;
exports.CircularDirectionClockwise = CircularDirectionClockwise;
exports.CircularLayout = CircularLayout;
exports.CircularNodeDiameterFormulaCircular = CircularNodeDiameterFormulaCircular;
exports.CircularNodeDiameterFormulaPythagorean = CircularNodeDiameterFormulaPythagorean;
exports.CircularSorting = CircularSorting;
exports.CircularSortingAscending = CircularSortingAscending;
exports.CircularSortingDescending = CircularSortingDescending;
exports.CircularSortingForwards = CircularSortingForwards;
exports.CircularSortingOptimized = CircularSortingOptimized;
exports.CircularSortingReverse = CircularSortingReverse;
exports.ClickCreatingTool = ClickCreatingTool;
exports.ClickSelectingTool = ClickSelectingTool;
exports.CommandHandler = CommandHandler;
exports.ContextMenuTool = ContextMenuTool;
exports.Curve = Curve;
exports.CurveBezier = CurveBezier;
exports.CurveJumpGap = CurveJumpGap;
exports.CurveJumpOver = CurveJumpOver;
exports.CurveNone = CurveNone;
exports.CycleAll = CycleAll;
exports.CycleDestinationTree = CycleDestinationTree;
exports.CycleMode = CycleMode;
exports.CycleNotDirected = CycleNotDirected;
exports.CycleNotUndirected = CycleNotUndirected;
exports.CycleSourceTree = CycleSourceTree;
exports.Diagram = Diagram;
exports.DiagramEvent = DiagramEvent;
exports.DragSelectingTool = DragSelectingTool;
exports.DraggingTool = DraggingTool;
exports.EnumValue = EnumValue;
exports.FlipBoth = FlipBoth;
exports.FlipHorizontal = FlipHorizontal;
exports.FlipNone = FlipNone;
exports.FlipVertical = FlipVertical;
exports.ForceDirectedLayout = ForceDirectedLayout;
exports.Geometry = Geometry;
exports.GeometryStretch = GeometryStretch;
exports.GeometryStretchUniform = GeometryStretchUniform;
exports.GeometryType = GeometryType;
exports.GeometryTypeLine = GeometryTypeLine;
exports.GeometryTypePath = GeometryTypePath;
exports.GestureMode = GestureMode;
exports.GestureModeCancel = GestureModeCancel;
exports.GestureModeNone = GestureModeNone;
exports.GestureModeZoom = GestureModeZoom;
exports.GraduatedPanCenter = GraduatedPanCenter;
exports.GraduatedPanLeft = GraduatedPanLeft;
exports.GraduatedPanNone = GraduatedPanNone;
exports.GraduatedPanRight = GraduatedPanRight;
exports.GraphLinksModel = GraphLinksModel;
exports.GraphObject = GraphObject;
exports.GridAlignment = GridAlignment;
exports.GridAlignmentLocation = GridAlignmentLocation;
exports.GridAlignmentPosition = GridAlignmentPosition;
exports.GridArrangement = GridArrangement;
exports.GridArrangementBottomToTop = GridArrangementBottomToTop;
exports.GridArrangementLeftToRight = GridArrangementLeftToRight;
exports.GridArrangementRightToLeft = GridArrangementRightToLeft;
exports.GridArrangementTopToBottom = GridArrangementTopToBottom;
exports.GridLayout = GridLayout;
exports.GridLayoutCenter = GridLayoutCenter;
exports.GridLayoutLocation = GridLayoutLocation;
exports.GridSorting = GridSorting;
exports.GridSortingAscending = GridSortingAscending;
exports.GridSortingDescending = GridSortingDescending;
exports.GridSortingForwards = GridSortingForwards;
exports.GridSortingReverse = GridSortingReverse;
exports.GridWrappingFit = GridWrappingFit;
exports.GridWrappingNone = GridWrappingNone;
exports.Group = Group;
exports.HTMLInfo = HTMLInfo;
exports.ImageStretch = ImageStretch;
exports.ImageStretchFill = ImageStretchFill;
exports.ImageStretchNone = ImageStretchNone;
exports.ImageStretchUniform = ImageStretchUniform;
exports.ImageStretchUniformToFill = ImageStretchUniformToFill;
exports.InputEvent = InputEvent;
exports.Layer = Layer;
exports.LayeredDigraphAggressive = LayeredDigraphAggressive;
exports.LayeredDigraphAggressiveAll = LayeredDigraphAggressiveAll;
exports.LayeredDigraphAggressiveHorizontal = LayeredDigraphAggressiveHorizontal;
exports.LayeredDigraphAggressiveLess = LayeredDigraphAggressiveLess;
exports.LayeredDigraphAggressiveMore = LayeredDigraphAggressiveMore;
exports.LayeredDigraphAggressiveNone = LayeredDigraphAggressiveNone;
exports.LayeredDigraphAggressiveVertical = LayeredDigraphAggressiveVertical;
exports.LayeredDigraphAlign = LayeredDigraphAlign;
exports.LayeredDigraphAlignBottom = LayeredDigraphAlignBottom;
exports.LayeredDigraphAlignCenter = LayeredDigraphAlignCenter;
exports.LayeredDigraphAlignLower = LayeredDigraphAlignLower;
exports.LayeredDigraphAlignNone = LayeredDigraphAlignNone;
exports.LayeredDigraphAlignTop = LayeredDigraphAlignTop;
exports.LayeredDigraphAlignUpper = LayeredDigraphAlignUpper;
exports.LayeredDigraphCycleRemoveDepthFirst = LayeredDigraphCycleRemoveDepthFirst;
exports.LayeredDigraphCycleRemoveGreedy = LayeredDigraphCycleRemoveGreedy;
exports.LayeredDigraphDirectionDown = LayeredDigraphDirectionDown;
exports.LayeredDigraphDirectionLeft = LayeredDigraphDirectionLeft;
exports.LayeredDigraphDirectionRight = LayeredDigraphDirectionRight;
exports.LayeredDigraphDirectionUp = LayeredDigraphDirectionUp;
exports.LayeredDigraphInitDepthFirstIn = LayeredDigraphInitDepthFirstIn;
exports.LayeredDigraphInitDepthFirstOut = LayeredDigraphInitDepthFirstOut;
exports.LayeredDigraphInitNaive = LayeredDigraphInitNaive;
exports.LayeredDigraphLayeringLongestPathSink = LayeredDigraphLayeringLongestPathSink;
exports.LayeredDigraphLayeringLongestPathSource = LayeredDigraphLayeringLongestPathSource;
exports.LayeredDigraphLayeringOptimalLinkLength = LayeredDigraphLayeringOptimalLinkLength;
exports.LayeredDigraphLayout = LayeredDigraphLayout;
exports.LayeredDigraphPack = LayeredDigraphPack;
exports.LayeredDigraphPackAll = LayeredDigraphPackAll;
exports.LayeredDigraphPackExpand = LayeredDigraphPackExpand;
exports.LayeredDigraphPackMedian = LayeredDigraphPackMedian;
exports.LayeredDigraphPackNone = LayeredDigraphPackNone;
exports.LayeredDigraphPackStraighten = LayeredDigraphPackStraighten;
exports.Layout = Layout;
exports.LayoutConditions = LayoutConditions;
exports.LayoutConditionsNodeSized = LayoutConditionsNodeSized;
exports.LayoutConditionsStandard = LayoutConditionsStandard;
exports.LayoutEdge = LayoutEdge;
exports.LayoutNetwork = LayoutNetwork;
exports.LayoutVertex = LayoutVertex;
exports.Link = Link;
exports.LinkAdjusting = LinkAdjusting;
exports.LinkAdjustingEnd = LinkAdjustingEnd;
exports.LinkAdjustingStretch = LinkAdjustingStretch;
exports.LinkReshapingTool = LinkReshapingTool;
exports.LinkingBaseTool = LinkingBaseTool;
exports.LinkingDirection = LinkingDirection;
exports.LinkingDirectionForwardsOnly = LinkingDirectionForwardsOnly;
exports.LinkingTool = LinkingTool;
exports.List = List;
exports.Map = Map$1;
exports.Margin = Margin;
exports.Model = Model;
exports.Node = Node;
exports.Orientation = Orientation;
exports.OrientationAlong = OrientationAlong;
exports.OrientationMinus90 = OrientationMinus90;
exports.OrientationNone = OrientationNone;
exports.OrientationPlus180 = OrientationPlus180;
exports.OrientationPlus90 = OrientationPlus90;
exports.Overflow = Overflow;
exports.OverflowClip = OverflowClip;
exports.OverflowEllipsis = OverflowEllipsis;
exports.Overview = Overview;
exports.Palette = Palette;
exports.Panel = Panel;
exports.PanelAuto = PanelAuto;
exports.PanelGraduated = PanelGraduated;
exports.PanelGrid = PanelGrid;
exports.PanelHorizontal = PanelHorizontal;
exports.PanelLink = PanelLink;
exports.PanelPosition = PanelPosition;
exports.PanelSpot = PanelSpot;
exports.PanelTable = PanelTable;
exports.PanelTableColumn = PanelTableColumn;
exports.PanelTableRow = PanelTableRow;
exports.PanelVertical = PanelVertical;
exports.PanelViewbox = PanelViewbox;
exports.PanningTool = PanningTool;
exports.Part = Part;
exports.PathFigure = PathFigure;
exports.PathSegment = PathSegment;
exports.PathSegmentArc = PathSegmentArc;
exports.PathSegmentClose = PathSegmentClose;
exports.PathSegmentCubicBezier = PathSegmentCubicBezier;
exports.PathSegmentLine = PathSegmentLine;
exports.PathSegmentMoveTo = PathSegmentMoveTo;
exports.PathSegmentQuadraticBezier = PathSegmentQuadraticBezier;
exports.Picture = Picture;
exports.Placeholder = Placeholder;
exports.Point = Point;
exports.Rect = Rect;
exports.RelinkingTool = RelinkingTool;
exports.ResizingTool = ResizingTool;
exports.RotatingTool = RotatingTool;
exports.Routing = Routing;
exports.RoutingAvoidsNodes = RoutingAvoidsNodes;
exports.RoutingNormal = RoutingNormal;
exports.RoutingOrthogonal = RoutingOrthogonal;
exports.RowColumnDefinition = RowColumnDefinition;
exports.ScrollDocument = ScrollDocument;
exports.ScrollInfinite = ScrollInfinite;
exports.ScrollMode = ScrollMode;
exports.SegmentOrientationAlong = SegmentOrientationAlong;
exports.SegmentOrientationNone = SegmentOrientationNone;
exports.SegmentOrientationOpposite = SegmentOrientationOpposite;
exports.SegmentOrientationOrthogonal = SegmentOrientationOrthogonal;
exports.SegmentOrientationParallel = SegmentOrientationParallel;
exports.SegmentOrientationPerpendicular = SegmentOrientationPerpendicular;
exports.SegmentType = SegmentType;
exports.Set = Set;
exports.Shape = Shape;
exports.Size = Size;
exports.Sizing = Sizing;
exports.SizingAuto = SizingAuto;
exports.SizingNone = SizingNone;
exports.SizingProp = SizingProp;
exports.Spot = Spot;
exports.Stretch = Stretch;
exports.StretchDefault = StretchDefault;
exports.StretchFill = StretchFill;
exports.StretchHorizontal = StretchHorizontal;
exports.StretchNone = StretchNone;
exports.StretchUniform = StretchUniform;
exports.StretchUniformToFill = StretchUniformToFill;
exports.StretchVertical = StretchVertical;
exports.TextBlock = TextBlock;
exports.TextEditingAccept = TextEditingAccept;
exports.TextEditingAcceptLostFocus = TextEditingAcceptLostFocus;
exports.TextEditingStarting = TextEditingStarting;
exports.TextEditingStartingSingleClick = TextEditingStartingSingleClick;
exports.TextEditingTool = TextEditingTool;
exports.TextOverflow = TextOverflow;
exports.ThemeManager = ThemeManager;
exports.Tool = Tool;
exports.ToolManager = ToolManager;
exports.Transaction = Transaction;
exports.TreeAlignment = TreeAlignment;
exports.TreeAlignmentBottomRightBus = TreeAlignmentBottomRightBus;
exports.TreeAlignmentBus = TreeAlignmentBus;
exports.TreeAlignmentBusBranching = TreeAlignmentBusBranching;
exports.TreeAlignmentCenterChildren = TreeAlignmentCenterChildren;
exports.TreeAlignmentCenterSubtrees = TreeAlignmentCenterSubtrees;
exports.TreeAlignmentEnd = TreeAlignmentEnd;
exports.TreeAlignmentStart = TreeAlignmentStart;
exports.TreeAlignmentTopLeftBus = TreeAlignmentTopLeftBus;
exports.TreeArrangement = TreeArrangement;
exports.TreeArrangementFixedRoots = TreeArrangementFixedRoots;
exports.TreeArrangementHorizontal = TreeArrangementHorizontal;
exports.TreeArrangementVertical = TreeArrangementVertical;
exports.TreeCompaction = TreeCompaction;
exports.TreeCompactionBlock = TreeCompactionBlock;
exports.TreeCompactionNone = TreeCompactionNone;
exports.TreeLayerStyle = TreeLayerStyle;
exports.TreeLayerStyleIndividual = TreeLayerStyleIndividual;
exports.TreeLayerStyleSiblings = TreeLayerStyleSiblings;
exports.TreeLayerStyleUniform = TreeLayerStyleUniform;
exports.TreeLayout = TreeLayout;
exports.TreeModel = TreeModel;
exports.TreePath = TreePath;
exports.TreePathDefault = TreePathDefault;
exports.TreePathDestination = TreePathDestination;
exports.TreePathSource = TreePathSource;
exports.TreeSorting = TreeSorting;
exports.TreeSortingAscending = TreeSortingAscending;
exports.TreeSortingDescending = TreeSortingDescending;
exports.TreeSortingForwards = TreeSortingForwards;
exports.TreeSortingReverse = TreeSortingReverse;
exports.TreeStyle = TreeStyle;
exports.TreeStyleAlternating = TreeStyleAlternating;
exports.TreeStyleCompact = TreeStyleCompact;
exports.TreeStyleLastParents = TreeStyleLastParents;
exports.TreeStyleLayered = TreeStyleLayered;
exports.TreeStyleRootOnly = TreeStyleRootOnly;
exports.TriggerStart = TriggerStart;
exports.TriggerStartBundled = TriggerStartBundled;
exports.UndoManager = UndoManager;
exports.ViewboxStretchFill = ViewboxStretchFill;
exports.ViewboxStretchNone = ViewboxStretchNone;
exports.ViewboxStretchUniform = ViewboxStretchUniform;
exports.ViewboxStretchUniformToFill = ViewboxStretchUniformToFill;
exports.WheelMode = WheelMode;
exports.WheelModeZoom = WheelModeZoom;
exports.Wrap = Wrap;
exports.WrapDesiredSize = WrapDesiredSize;
exports.WrapFit = WrapFit;
exports.WrapNone = WrapNone;
exports.figures = figures;
exports.getFigureGeometry = getFigureGeometry;
//# sourceMappingURL=open-gojs.cjs.js.map
