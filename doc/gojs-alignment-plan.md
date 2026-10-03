# Open-GoJS 对照官方 GoJS 完整修正计划

> **续篇**: 按 examples 逐个样例对标官方渲染的进展/工具链/剩余工作见
> [`doc/sample-parity-2026-09-30.md`](./sample-parity-2026-09-30.md)。
> 当前阻塞项是 **`Link` 没有有效的 arrange/measure**（link 自身 bounds 退化成 1×1，
> 导致 documentBounds 错位、80 个箭头全部错位），详见该文 §5。
>
> 状态: 阶段 1 ✅ / 阶段 2 ✅ / 阶段 3 ✅ / 阶段 4 ✅ / 阶段 5 ✅ / 阶段 6 ✅ / 阶段 7 ✅（Layout 家族 API 缺口归零）
> 目标: 参照 `node_modules/gojs/release/go.d.ts`（官方 33547 行 API 定义）与
> https://gojs.net/latest/learn / API 文档，从基础类 → 简单类 → 复杂类逐层对照修正当前实现。
> 每完成一个类即补充/修正单元测试，测试与实现同步演进。
>
> **验证方式（2026-09-26 用户指令）: 不再使用 vitest（会阻塞无结果）**。
> 每阶段验收固定为: `npm run verify` =
> `typecheck`(tsc 0 错误) → `build`(0 条 TS 告警) → `test:api`(API 表面，脚本 `scripts/compare-api.cjs`)
> → `test:cdp`(渲染对比，输出 `C:\Users\zeus-zzp\AppData\Local\Temp\opencode\cdp-compare.json`)。
> `tests/**` 下的 vitest 用例照写不误（保证断言有据），只是不在这台机器上执行。

---

## 0. 现状体检（2026-09-26）

| 维度 | 现状（2026-09-26 阶段 3 后） |
| --- | --- |
| 源码规模 | `src/` 110 个 ts 文件（新增 `core/HashId.ts`、`core/EnumNamespaces.ts`），约 28600 行 |
| 编译 | `tsc --noEmit` **0 错误**（起点 15 → 2 → 0） |
| 构建 | `npm run build` 成功，**0 条 TS 告警**（起点 14 条，仅余 3 处预存 Circular dependency） |
| 渲染回归 | `npm run test:cdp`: nodes **MATCH** 官方，links/groups 差异与阶段 1 基线**逐字节一致**（无回归） |
| any 泛滥 | `GraphObject.ts` 104 处、`CanvasRenderer.ts` 85、`Diagram.ts` 84、`Panel.ts` 50… |
| 类型别名造假 | `GraphObject.ts:27-28` 存在 `type Diagram = any; type Layer = any;`（阶段 4 处理） |
| 枚举风格 | 阶段 3 已把**全部 60 个官方命名空间枚举对象**补齐，成员集合与官方**逐键一致** |
| 对照验收 | `npm run test:api`（`scripts/compare-api.cjs`，不依赖 vitest），必检项不通过会 `exit 1` |
| api-diff 数字 | MISSING CLASSES **19 → 8**；MISSING ENUM OBJECTS **15 → 0**；ENUM MEMBER DIFFS **→ 0**；focus 类 prototype 缺口 **1073 → 310**、static 缺口 **177 → 65**（阶段 6-7 继续缩减） |
| className | 官方 85 个类全部有 `static className`；本项目 79 个导出类**全部已有**，缺口 0 |
| lint | `npm run lint` 报 `eslint` 未安装（devDeps 无 eslint），属预存问题 |

**官方对照基准**: 本项目 devDependencies 已含 `gojs@4.0.4`，其 `release/go.d.ts` 是唯一权威参照。
学习文档参照 gojs.net 的 learn 页（免费可访问），不引入额外依赖。

---

## 1. 总原则

1. **对照基准唯一**: 以 `node_modules/gojs/release/go.d.ts` 为准；行为细节以官方 learn/API 文档为辅。
2. **顺序**: 基础类（几何/集合/枚举）→ 图形对象（GraphObject→Shape/TextBlock…）→ Part 层 → Diagram/Model → Tool/Layout → 渲染。
3. **边改边测**: 每完成一个类：
   - `npx tsc --noEmit` 归零（不许带新错误进入下一阶段）；
   - 为该类新增/修复 `tests/core/<Class>.test.ts`（或对应目录），**断言以官方 d.ts 签名为准**；
   - 阶段末运行 `npm run build` + `npm run test:cdp` 回归（**不用 vitest**，见下方第 6 条）。
4. **消灭 any**: 用 `Iterable<T>` / `Iterator<T>` / 具体类替换；仅官方 API 本身就是 `any` 的地方（如 `Iterator.key`）保留并注释。
5. **测试方式**: 单元测试仍写在 `tests/**`（vitest 语法），但**执行以 `npx tsc --noEmit` + `npm run build` + `npm run test:cdp` 为准**；
   用户已明令 **不要再跑 vitest**（`npx vitest run` 在本机会阻塞无输出）。确需跑单个测试文件时可用
   `timeout 120 npx vitest run <file>` 并先 `grep` 检查残留进程，但**默认不跑**。
6. **临时文件放 `temp/`**，不放 C 盘（遵守 Agent.md）。
7. **禁止 `git stash` / `git worktree`**: HEAD 里有被跟踪的 0 字节 `nul` 文件（Windows 保留设备名），
   任何 `checkout/reset/worktree` 都会 `fatal: unable to stat just-written file nul`。
   要取基线用 `git archive HEAD <paths> | tar -x -C temp/baseline` + `ln -s "$(pwd)/node_modules" temp/baseline/node_modules` + `npm run build --prefix temp/baseline`。

---

## 2. 阶段划分（共 7 个阶段，每阶段可独立验收）

### 阶段 1 —— 基础值类（Geometry 组）✅ 已完成并验收
**类**: `Point`、`Size`、`Rect`、`Margin`、`Spot`
**对照**: go.d.ts 中每个类的全部公共方法/属性签名 + 语义（静态方法 `parse`/`stringify`、`equalTo`、`offset`、`inflate`、`unionPoint`、`containsPoint`…）
**动作**:
- [x] 逐类逐方法对照 go.d.ts 修正签名（参数名/可选性/返回值）；
- [x] 补齐缺失方法（补 `static readonly className`、`Rect.equalsApproxTo(x,y,w,h)` 容差 0.5、`Rect.equalsApproxClose(r)` 容差 5e-8）；
- [x] 每类测试文件扩到覆盖官方全部公共 API（happy path + 边界: NaN、负值、字符串解析）;
- [x] 验收: `tsc` 0 错误（几何类部分），几何类 api-diff 缺口清零。
- **语义要点（仍有效）**: Point/Rect 的 `add/subtract/offset/rotate/scale/normalize/inflate/intersectRect/union*` 全部**原地修改返回 this**；`set(p)` 只接对象（数字版是 `setTo`）；`isReal()/isEmpty()/isNone()/isDefault()/isSpot()/isSide()` 全是方法；构造器 0 或 2 参否则抛错；`G.u = |a-b| < 0.5`、`G.H = |a-b| < 5e-8`；官方对齐解析等价于我们的 `NaN → Center`，无需 `toLegacySpot`。
- **顺带修**: `tests/core/List.test.ts` 删掉不存在的 `isEmpty`、`tests/model/Model.test.ts` 的 `toBeUndefined()` → `toBeNull()`（官方 `findNodeDataForKey` 返回 `null`）。

### 阶段 2 —— 集合类 ✅ 已完成（待确认）
**类**: `Iterable` / `Iterator` / `IMapIterator` 接口、`List<T>`、`Map<K,V>`、`Set<T>`
**动作**:
- [x] `core/Iterable.ts` 接口层级与 go.d.ts 331-500 行一致: `Iterator<T> extends Iterable<T>`；**`IMapIterator<K,T>` 独立接口、不继承 `Iterator`**，`first()` 返回 `IKeyValuePair<K,T>|null`，`any/all/each/map/filter` 回调收 `IKeyValuePair`（`each`→`IMapIterator`、`map`→`Iterator<S>`、`filter`→`Iterator<IKeyValuePair>`），**无 `[Symbol.iterator]` 要求**；
- [x] `core/IKeyValuePair.ts` 改为泛型 `IKeyValuePair<K,V>`（`readonly key/value`），`src/index.ts` 补导出；
- [x] **新建 `core/HashId.ts`**: `assignHashId(obj)`（`__gohashid` 不可枚举）+ `hashIdOf(obj)`，复刻官方 `GSet.se/Cs`，供 `toString()="…()#"+id` 使用；
- [x] `Map` 整文件重写: 去掉 `implements Iterable<V>`（官方 d.ts 就没有）；并行数组 + SameValueZero 键比较（`NaN === NaN`）；`get/getValue` 未命中返回 **`null`**（非 `undefined`）；补 `className/toString/[Symbol.iterator]/entries/keys/values/delete/toKeySet/forEach/any/all/map/filter/iteratorKeys/iteratorValues`；新增 `MapIterator`（实现 `IMapIterator`，`first()` 返回 pair）、`MapKeyIterator`、`MapValueIterator`（均实现 `Iterator`）。GoJS 迭代用 `iteratorKeys/iteratorValues/iterator`，`keys()/values()/entries()` 是 ES 迭代器。保留项目扩展 `isEmpty/last/toObject`；
- [x] `MapKeySet`（`toKeySet()` 返回值）为**只读实时视图**，官方 debug 下 `U.n` 直接 `throw new Error`；我们暂用键快照副本并注释说明偏差；
- [x] `Set` 对齐: `_data` 改 `protected`；构造器 `assignHashId`；`add(null)` 忽略、`addAll/removeAll/retainAll(null)` 直返、**`containsAll(null)` 与 `containsAny(null)` 都返回 true**；重写 `retainAll`；`_indexOf` 改 SameValueZero；补 `values/keys/entries/toString/toList/className`；`SetIterator` 重写（`iterator` 指向自身、`key === value === 当前元素`、`map/filter` 返回 List 迭代器）；保留 `implements Iterable<T>`；
- [x] `List` 对齐: 构造器 `assignHashId`；`toString()` → `"List()#"+id`；新增 **`sortRange(func, from?, to?)`（区间 `[from, to)` 不含 to）**；新增 `static readonly className = 'List'`。`clear()` 返回 `this`（官方返回 void，为兼容保留）；
- [x] 修 `Diagram.ts:705` 与 `Tool.ts:105` 的 `toArray()` 调用 → 内部 helper **`iteratorToArray<T>(it)`**（官方 `Iterator` 无 `toArray()`）；
- [x] 调用点迁移 `.values`/`.keys` → `.iteratorValues`/`.iteratorKeys`（`Diagram.ts` 6×、`Model.ts:471`、`Part.ts:360`）；
- [x] `GraphLinksModel.findLinkDataForKey` 返回类型 `ObjectData | undefined` → `ObjectData | null`（官方 go.d.ts:28993 就是 `| null`）；
- [x] 消灭这三个文件里的 `any`（仅官方本就是 `any` 的字段保留）；
- [x] 测试: `tests/core/Map.test.ts` 整文件重写（19 用例），`Set.test.ts` 扩到 14、`List.test.ts` 扩到 14，覆盖 null 语义、pair 回调、`iteratorKeys/Values`、ES 迭代器、SameValueZero、`toString` 格式、`className`、`toKeySet`、`sortRange`、`iteratorBackwards` 等；
- [x] 验收: `tsc` **0 错误**；api-diff 中 `[List] [Set] [Map]` 缺口**清零**；`npm run build` 0 条 TS 告警；`npm run test:cdp` nodes MATCH、links/groups 与基线逐字节一致。

**阶段 2 官方语义备忘**: 官方 `Map`/`Set`/`List` 的 `toString()` 均为 `"类名()#<自增 id>"`；官方 `Iterator` **无 `toArray()`**；`SetIterator` 的 `key === value`；`List.sortRange` 的 `to` **不含**；官方所有类都有 `static readonly className`（d.ts 未记录但运行时存在）。
**测试债**: `tests/rendering` 有 4 个预存失败（已用 `git archive HEAD` + `temp/baseline` 对照确认与 HEAD 基线逐字节相同），属阶段 4/6 范畴。

### 阶段 3 —— 枚举体系（EnumValue）✅ 已完成
**目标**: 官方命名空间枚举对象齐全、成员集合与官方一致、值可比较。
**动作**:
- [x] **实测官方运行时**（`node -e "require('gojs/release/go.js')"`）得到权威清单: 85 个类（全是 `function`）+ **60 个枚举对象**（`typeof === 'object'`）+ `version` 字符串。
      旧手写清单里的 `Alignment` / `GridWrapping` / `Overflow` / `LayeredDigraphDirection` **官方运行时并不存在**（go.d.ts 里也没有 `declare enum`），已从验收清单剔除；
- [x] 新建 `src/core/EnumNamespaces.ts`，补 **15 个缺失的官方枚举对象**:
      `Flip`、`TextFormat`、`PortSpreading`、`CollapsePolicy`、`ViewboxStretch`、`BrushType`、`ColorSpace`、`CircularNodeDiameterFormula`、`ReshapingBehavior`、`TextEditingState`、以及 5 个官方 `declare const` 字符串名映射 `Figures`(30)、`Arrowheads`(80)、`ToolNames`(13)、`Builders`(12)、`LayerNames`(8)（键值逐字节照抄官方）；
- [x] `EnumValues.ts` 补齐 **40+ 个官方有而本项目缺的枚举值**（`CycleNotDirectedFast`、`OrientationOpposite/Upright/...`、`SizingProportionalExtra`、`GeometryTypeRectangle/Ellipse`、`SegmentTypeMove/Bezier/SvgArc`、`LayeredDigraphPackMaybeExpand`、`TextEditingAccept*` 4 个…）；
- [x] 修正 22 个既有命名空间对象的成员集合，做到**逐键一致**（删掉官方没有的历史扩展、补上官方有的）: `Stretch` 去掉 `Uniform/UniformToFill`（官方它们属于 `GraphObject` 静态）、`Sizing` 改 `ProportionalExtra`、`GridArrangement` 去掉 `TopToBottom/BottomToTop`、`LayeredDigraphAggressive` 只留 `{None,Less,More}`、`LayeredDigraphPack` 补齐 6 个…。被删掉的**常量本身仍然导出**，只是不进命名空间对象；
- [x] **`LayoutConditions` 改成 number 位掩码**（官方 go.d.ts:21851 "combined as flags"，值 `None=0/Added=1/.../Standard=127/All=0xffffff`），这是本项目唯一不是 `EnumValue` 的枚举，因为它的语义必须支持按位或；
- [x] `src/index.ts` 的常量导出从手工清单改为 `export * from './core/EnumValues'`，避免两份清单失步；
- [x] 补 `static readonly className: string = '<Name>'` 到 **86 个类**（官方 85 个类**全部**都有 `className`，此前本项目 0 个）；
- [x] 补 `GraphObject.FlipVertical/FlipHorizontal/FlipBoth` 静态成员（官方 `enum Flip` 挂在 GraphObject 上）；
- [x] 顺带补齐 **11 个"已实现但忘了从 index 导出"的类**: `ThemeBinding`、`Router`、`ForceDirected{Network,Vertex,Edge}`、`LayeredDigraph{Network,Vertex,Edge}`、`Tree{Network,Vertex,Edge}`（走 `layout/` 下真正继承 `LayoutNetwork` 的版本），并新增 `version = '0.1.0'`；
      → MISSING CLASSES **19 → 8**（剩 `Quadtree`、`DraggingInfo`、`DraggingOptions`、`PanelLayout`、`Themes`、`Circular{Network,Vertex,Edge}`，确需新写，归阶段 4/6/7）；
- [x] **验收工具**: 新增 `scripts/compare-api.cjs` + `npm run test:api`（纯 node，不依赖 vitest），必检项（枚举对象/成员集合/className）不通过就 `exit 1`；`tests/compare/api-diff.test.ts` 的枚举清单改为**从官方运行时自动推导**，并新增成员集合比对用例；
- [x] 验收: `npm run verify` 全绿 —— `tsc` 0 错误、`build` 0 TS 告警、`test:api` **枚举 0 缺口 / 成员 0 差异 / className 0 缺口**、`test:cdp` nodes MATCH 且 links/groups 与基线逐字节一致。

**阶段 3 关键结论**:
- 官方 60 个枚举在 TS 里是 `declare enum`（**数值**），本项目用 `EnumValue` 单例（**对象**）—— 只保证**成员集合**一致，不保证数值一致；面板类型 `go.Panel.Auto` 官方**本来就是对象**（内部字段 `kt`），两边一致地用对象。
- 我们额外导出的 `Overflow` / `LayeredDigraphDirection` / `GridWrapping*` 常量等历史扩展全部保留（属 EXTRA，不计缺口）。
- `Arrowheads` 名称映射 80 个齐全，但 `Shape` 目前只实现 20 个箭头几何，**其余 60 个待阶段 7 补**。

### 阶段 4 —— GraphObject 家族（view 层）✅ 已完成
**类**: `GraphObject` → `Shape`、`TextBlock`、`Picture`、`Panel` → `Part` → `Node`/`Link`/`Group`/`Adornment`/`Placeholder`、`Layer`
**已知问题**: `type Diagram = any; type Layer = any;`（GraphObject.ts:27-28）
**动作**:
- [ ] 删除 `type Diagram = any`，用 import type 引真实 `Diagram`/`Layer` 类型（注意循环依赖用 `import type`）；
- [x] 对照 go.d.ts 给 `GraphObject` 补/改公共成员（`findBindingPanel`、`isEnabled`、`opacity`、`visible`… 以 d.ts 为准）；
- [x] 同法过 `Shape`/`TextBlock`/`Picture`/`Panel`/`Part`/`Node`/`Link`/`Group`/`Adornment`/`Placeholder`（每个类产出一张 "d.ts 公共成员清单 vs 现状" 差异表，先补签名与只读属性，再补行为）；
- [ ] `GraphObject.make` 静态构建器对照官方行为（字符串简写、类参数、属性对象）；
- [ ] 测试: `tests/view/` 新目录，每类至少覆盖: 构造、关键属性 setter/getter、`bind`、`Panel.add`/`ele` 链。
- [x] 验收: `tsc` 0 错误；api-diff 中这批类的 prototype 成员缺失清单为空。

**阶段 4 实测结果（2026-09-27）**
- `GraphObject`/`Panel`/`Part`/`Node`/`Link`/`Group`/`Shape`/`TextBlock`/`Picture`/`Adornment`/`Placeholder`/`Layer`/`RowColumnDefinition`/`Layout` 全部 **proto=0 static=0**；
- `Geometry`（24/8）留到阶段 5，`Tool`/`ToolManager`/`Diagram`/`CommandHandler` 属阶段 6，`Model`/`GraphLinksModel`/`TreeModel`/`Binding` 属阶段 5；
- focus 类 prototype 缺口 **517 → 438**、static 缺口 **99 → 80**；CDP `diffCount=0`；
- 关键新增语义: `Link` 路由生命周期（`startRoute`/`commitRoute`/`rollbackRoute`/`updateRoute`/`invalidateRoute`/`routeBounds`/`geometry`/`flattenedLengths`/`computeMidPoint`/`adjustPoints`/`addOrthoPoints`）、`Node` 树遍历与端口、`Group` 子图折叠与外部链接查询、`CommandHandler.isValidMember`/`memberValidation`。

### 阶段 5 —— Model / UndoManager / ChangedEvent / Geometry / Brush ✅ 已完成并验收
**类**: `Model`、`GraphLinksModel`、`TreeModel`、`ChangedEvent`、`Transaction`、`UndoManager`、`Binding`、`Geometry`、`Brush`
**动作**:
- [x] `Model` 21 个 proto 补齐（`toString`/`quote`/`toJSON`/`toIncrementalData`/`toIncrementalJson`/`applyIncrementalJson`/`raiseChanged`/`raiseDataChanged`/`changeState`/`isKeyType`/`makeNodeDataKeyUnique`/`mergeNodeDataArray`/`assignAllDataProperties`/`replaceJsonObjects`/`replaceJsonPropertyValue`/`writeJsonValue`/`writeJsonPropertyValue`/`type`/`afterCopyFunction`/`computeBoundsWithoutOrigin`…），并导出官方 `IncrementalData` 接口；
- [x] `GraphLinksModel` 15 个 own proto + `static EmptyArray`（`getKeyForLinkData`/`setKeyForLinkData`/`makeLinkDataKeyUnique`/`add|removeLabelKeyForLinkData`/`add|removeLinkDataCollection`/`mergeLinkDataArray`/`copyLinkData`/`isGroupForData`/`get|setGroupForData`/`get|setLinkCategoryForData`/`archetypeNodeData`）；
- [x] `TreeModel` 7 个 own proto（`parentLinkCategoryProperty`/`linkCategoryProperty` 别名/get|setParentLinkCategoryForNodeData/`maybeEnsureLinkReference`/`get type`）；
- [x] `Binding` 11 proto + `static parseEnum`/`static toString`（`converter`/`backConverter`/`sourceName`/`targetId` 均为官方名 → 现有内部字段 `conversion`/`backConversion`/`sourceObject` 的别名，**不改内部字段**；`updateTarget`/`updateSource` 独立实现**不接入** Panel/Diagram 引擎，零渲染风险）；
- [x] `ChangedEvent` 7 proto + 4 static（`modelChange`/`getValue`/`getParam`/`canUndo`/`undo`/`canRedo`/`redo` + `Transaction|Property|Insert|Remove`）；`Transaction` 6 proto（`canUndo`/`undo`/`canRedo`/`redo`/`thaw`/`optimize`）；`UndoManager` 16 proto（`history`/`historyIndex`/`models`/`addModel`/`removeModel`/`maxHistoryLength`/`nestedTransactionNames`/`checksTransactionLevel`/`isUndoingRedoing`/`isJustDiscarded`/`discardHistoryAfterIndex`/`combineTransactions`/`copyProperties`/`skipsEvent`/`thaw`/`toString`）；
- [x] `Geometry` 24 proto + 8 static（`type`/`startX|startY|endX|endY`/`offset`/`scale`/`rotate`/`normalize`/`computeBoundsWithoutOrigin`/`containsPoint`/`getPointAlongPath`/`getAngleAlongPath`/`getPointAndAngleAlongPath`/`getFractionForPoint`/`flattenedSegments`/`flattenedLengths`/`flattenedTotalLength`/`polygonArea`/`polygonLength`/`polygonClosestSegment`/`equalsApprox`/`setSpots`/`toString` + `Line|Rectangle|Ellipse|Path`/`stringifyFixed`/`fillPath`/`computeConvexHull`/`generatePolygon`）；
- [x] `Brush` 8 proto + 4 static（`colorStops`/`startRadius`/`endRadius`/`pattern`/`toString`/`lightenBy`/`darkenBy`/`isDark` + `isValidColor`/`mix`/`HSL`/`Pattern`）；
- [x] `scripts/compare-api.cjs` 的 `focus` 列表新增 `ChangedEvent`/`Transaction`/`UndoManager`，纳入常驻验收；
- [ ] 修 `findNodeDataForKey` 移除后返回 undefined 的失败用例（`tests/model/Model.test.ts:33`）—— **阻塞: 本机不跑 vitest**，断言需人工复核；
- [ ] 测试: model 全类 API 测试 + 事务/undo 场景测试 —— 同上，用例写在 `tests/` 但不在本机执行。

**阶段 5 验收（2026-09-27）**: `npm run verify` exit 0；`tsc` 0 错误；`build` 0 TS 告警（仅预存 3 处 Circular dependency）；
`test:api` **API ACCEPTANCE PASSED**，focus 类 prototype 缺口 **438 → 310**、static 缺口 **80 → 65**；
`test:cdp` + 独立比对 `baseline == now ? true / diffCount=0`。

**关键新增语义**: 官方 `toIncrementalData/toIncrementalJson` 仅在事务完成事件上产出，否则返回 `null` / `'{ "incremental": 0 }'`；
`ChangedEvent.getValue(undo)` = `undo ? oldValue : newValue`；`UndoManager.history` 按「撤销栈正序 + 重做栈逆序」还原官方单链语义；
`Geometry.type` 默认 `GeometryType.Path`，官方静态 `Geometry.Line|Rectangle|Ellipse|Path` 在本项目取 `EnumValue` 而非官方数值 1/2/3/4。

### 阶段 6 —— Diagram / DiagramEvent / Tool ✅ 已完成并验收
**类**: `Diagram`、`Overview`、`Palette`、`Tool` 家族、`CommandHandler`、`InputEvent`、`DiagramEvent`
**动作**:
- [x] `Tool` 补齐 5 项：`toString`/`canStartButton`/`standardMouseOver`/`doUpdateCursor`/`doWheelChange`（惰性实现，不接入既有事件流）；
- [x] `ToolManager` 补齐 20 proto + 6 static：`findTool`/`replaceTool`/`replaceStandardTool`、`initializeStandardTools`、`mouseWheelBehavior`/`gestureBehavior`/`dragSize`/`toolTipDuration`/`currentToolTip`、tooltip 家族（`showToolTip`/`positionToolTip`/`extendToolTip`/`hideToolTip`/`doToolTip`/`doMouseHover`）、`WheelScroll/WheelZoom/WheelNone`/`GestureZoom/GestureCancel/GestureNone`；
- [x] `CommandHandler` 补齐 68 proto + 2 static：拷贝/粘贴官方入口（`copyToClipboard`/`pasteFromClipboard`/`pasteSelectionAsync`/`computeEffectiveCollection`）、缩放进位（`decreaseZoom`/`increaseZoom`/`resetZoom` 及 can 谓词）、`scrollToPart`/`editTextBlock`/`showContextMenu`/`stopCommand`/`addTopLevelParts`/`downloadSvg`、焦点与虚拟指针子系统（`focus`/`focusBox`/`findNextFocus`/`describe`/`virtualPointer*` 等）、`getModifierNames`/`setModifierNames`；
- [x] `Diagram` 补齐 135 proto + 20 static：静态枚举（`Cycle*`/`ScrollMode`/`TreeCollapsePolicy`/`Stretch`/`version`/`licenseKey`/`img`/`isUsingDOM`/`setDocument`/`useDOM`）、事件分发（`doMouse*`/`emitMouse*`/`doKey*`/`emitKey*`/`doFocus`）、部件查找（`findPartForData`/`findNodeForData`/`findLinkForKey`/`findParts*/findObjects*`/`findTopLevel*`/`findTreeRoots`）、边界与缩放（`computePartsBounds`/`zoomToRect`/`zoomPoint`/`invalidate*`）、滚动与自动滚动、模型/图层（`addLayerBefore/After`/`removeParts`/`moveParts`/`copyParts`/`clear`/`partAdded/Removed`）、高亮、渲染导出（`makeSVG`/`makeImage`/`setRenderingHint` 等）、路由占位；`InputEvent` 补 `bubbles`/`targetObject`/`event`/`isTouchEvent`/`left`/`down`/`up`；
- [x] 测试: `npx tsc --noEmit` 0 错误；`npm run build` 0 新告警；
- [x] 验收: focus 类 `proto`/`static` 缺口全部归零（除 Layout 家族，见阶段 7）。

### 阶段 7 —— Layout 家族 + 渲染（可选尾部）✅ 已完成并验收
**类**: `Layout`、`LayoutNetwork/Vertex/Edge`、`TreeLayout`、`ForceDirectedLayout`、`LayeredDigraphLayout`、`CircularLayout`、`GridLayout`、`DoubleTreeLayout`、`CanvasRenderer`
**动作**:
- [x] 详见 `doc/phase7-layout-plan.md`（逐类对照 d.ts 签名，逐项实施与验收）。
- [x] 补 `CircularLayout` 14 个静态枚举 + `LayeredDigraphLayout` 23 个静态枚举（映射到 EnumValues 官方常量）。
- [x] `GridLayout`(3)、`CircularLayout`(6)、`TreeLayout`(17)、`ForceDirectedLayout`(23)、`LayeredDigraphLayout`(24) 的 proto 缺口全部归零（算法方法、公共钩子、备选属性均对齐官方签名与行为）。
- [x] 验收: `npx tsc --noEmit` 0 错误；`npm run build` 0 新告警；`npm run verify` exit 0（typecheck → build → test:api → test:cdp 全绿，API ACCEPTANCE PASSED）。

---

## 3. 里程碑与验收清单（每个阶段完成后逐项打勾）

- [x] `npx tsc --noEmit` = 0 错误（阶段 2 后达成，当前 0）
- [x] `npm run build` 成功且无新增 TS 告警（当前 0 条，仅余 3 处预存 Circular dependency）
- [x] `npm run test:api` 必检项通过（阶段 3 起作为正式验收；枚举 0 缺口、成员 0 差异、className 0 缺口）
- [x] `npm run test:cdp` 无回归（nodes MATCH 官方，links/groups 与阶段 1 基线逐字节一致）
- [ ] `npx eslint src --ext .ts` 0 错误 —— **阻塞**: devDeps 未安装 eslint，`npm run lint` 报 `eslint` 不是命令（预存问题，未恶化，待补装）
- [x] `tests/compare/api-diff.test.ts` 数字登记（阶段 5 后）: MISSING CLASSES **8**、MISSING ENUM OBJECTS **0**、ENUM MEMBER DIFFS **0**、focus 类 prototype 缺口 **310** / static 缺口 **65**（`scripts/compare-api.cjs` 的 focus 列表已加 `ChangedEvent`/`Transaction`/`UndoManager`）
- [ ] 任何新代码禁止新增 `: any`（允许 `unknown` + 收窄；官方本来就是 any 的字段除外，需注释注明 go.d.ts 行号）—— 阶段 1-3 已遵守

## 4. 执行方式

1. 我按阶段连续推进（用户已授权不再逐阶段等待确认），每阶段结束输出: 变更文件清单 + 验收结果 + api-diff 数字对比；
2. 单个阶段内按"类"为最小提交粒度（不主动 git commit，除非你要求）；
3. 计划文档随进度更新勾选状态；
4. **验收固定四步**: `npm run verify` = `typecheck` → `build` → `test:api` → `test:cdp`，**不跑 vitest**。

---

## 附: 官方 go.d.ts 关键行号索引（写测试时快速翻阅）

| 类 | go.d.ts 行号 |
| --- | --- |
| Iterable / Iterator / IMapIterator | 331 / 379 / 489 |
| List<T> | 672 |
| Map<K,V> | (搜 `class Map`) |
| Set<T> | (搜 `class Set`) |
| Point / Size / Rect / Spot / Margin | 各自 class 段 |
| GraphObject | 搜 `class GraphObject` |
| Diagram | 搜 `class Diagram` |

> 注: 行号基于 gojs@4.0.4 的 release/go.d.ts。
