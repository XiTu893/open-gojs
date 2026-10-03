# 阶段 7 —— Layout 家族 API 对齐与行为计划

> 状态: **已实施完成**（2026-09-27）
> 结果: Layout 家族 5 个 focus 类 proto/static 缺口全部归零（GridLayout/CircularLayout/TreeLayout/ForceDirectedLayout/LayeredDigraphLayout 均 proto=0 static=0）；`npx tsc --noEmit` 0 错误；`npm run build` 0 新告警；`npm run verify` exit 0（API ACCEPTANCE PASSED）。
> 目标: 把 Layout 家族 5 个 focus 类的 prototype/static 缺口全部归零，并保证每个已实现方法/属性与官方 go.d.ts 签名及行为一致。
> 验收固定为: `npx tsc --noEmit` 0 错误、`npm run build` 0 新告警、`npm run test:api` 通过、`npm run test:cdp` 无回归。

## 0. 现状（对比 gojs@4.0.4 运行时）

| focus 类 | proto 缺口 | static 缺口 |
|---|---|---|
| `GridLayout` | 3 | 0 |
| `CircularLayout` | 6 | 14 |
| `TreeLayout` | 17 | 0 |
| `ForceDirectedLayout` | 23 | 0 |
| `LayeredDigraphLayout` | 24 | 23 |
| **合计** | **73** | **37** |

> 注: `Layout`/`LayoutNetwork/Vertex/Edge`/`Tree{Network,Vertex,Edge}`/`ForceDirected{Network,Vertex,Edge}`/`LayeredDigraph{Network,Vertex,Edge}`/`Circular{Network,Vertex,Edge}` 已在阶段 3 导出且缺口中位数多为 0；本阶段以 focus 列表内的 5 个布局类为主，同时对照修正其依赖的网络类签名。

## 1. 通用约定（每个已实现方法/属性必须遵守）

- **签名**：以 `node_modules/gojs/release/go.d.ts` 为唯一权威，逐一对照参数名/参数类型/返回类型；同名不存在的私有运行时成员用 `go-debug.pretty.js` 对照语义。
- **枚举静态值**：优先复用 `src/core/EnumValues.ts` 中已有的官方 `EnumValue` 常量；若缺则按官方数值新增，并注明 `go.d.ts` 行号。
- **行为对齐**：布局算法为"确定性输入→确定性坐标"输出，用 `tests/layout/` 的固定用例断言坐标（容差），不依赖 DOM。
- **禁止新增 `: any`**：允许 `unknown` + 收窄；官方本来就是 `any` 的字段除外，需注释注明 `go.d.ts` 行号。
- **惰性实现策略**：凡与"路由/布局引擎"强耦合、且当前无对应基础设施的成员，实现为 API 占位（`findRouter`/`setupRouters`/`addInvalidRoute`/`computeMove`/`getPositions` 等），但要确保签名正确、不改变既有渲染回归。

## 2. 分步实施计划

### 2.1 GridLayout（proto 3）
缺失: `commitLayers`、`comparer`、`wrappingColumn`。
- `commitLayers(grid, savedbounds, horiz, wrapping, comparer, spacing)`：网格布局核心，按列/行摆放 cells。
- `comparer`：排序比较器属性（`(a,b)=>number`，可空）。
- `wrappingColumn`/`wrappingWidth` 联动。
- 步骤：读 d.ts 签名 → 读官方 `GridLayout` 源 → 实现 grid 算法 + 确定性单测（3 个 cell 3x1 网格）。

### 2.2 CircularLayout（proto 6 + static 14）
缺失 proto: `actualCenter`、`actualSpacing`、`commitLinks`、`commitNodes`、`comparer`、`nodeDiameterFormula`。
缺失 static: `Ascending`、`BidirectionalLeft`、`BidirectionalRight`、`Clockwise`、`ConstantAngle`、`ConstantDistance`、`ConstantSpacing`、`Counterclockwise`、`Descending`、`Forwards`、`Optimized`、`Packed`、`Pythagorean`、`Reverse`。
- 静态按官方枚举值映射到 EnumValues（`CircularNodeDiameterFormula`、`CircularArrangement`、`CircularDirection`、`CircularSorting`、`CircularPacking`）。
- proto：圆环布局摆放（`nodeDiameterFormula` 的 `Constant`/`Pythagorean`）、`commitLinks`/`commitNodes`。
- 步骤：读 d.ts 静态区 → 补 EnumValues → 实现圆环坐标 → 确定性单测。

### 2.3 TreeLayout（proto 17）
缺失: `addComments`、`alternateChildPortSpot`、`alternateCommentMargin`、`alternateCommentSpacing`、`alternateComparer`、`alternatePortSpot`、`alternateSetsChildPortSpot`、`alternateSetsPortSpot`、`assignTreeVertexValues`、`commitLinks`、`commitNodes`、`computeBusLastRowSpacing`、`computeBusNodeSpacing`、`findRoots`、`initializeTreeVertexValues`、`layoutTree`、`sortTreeVertexChildren`。
- 全是树布局算法内部方法 + 备选子支（alternate）属性。依赖 `TreeVertex`/`TreeNetwork`/`TreeEdge`。
- 步骤：确认 `Tree{Network,Vertex,Edge}` 成员齐全 → 实现树布局（顺序、子树、Bus 压缩、评论）→ 确定性单测（familytree 场景坐标）。

### 2.4 ForceDirectedLayout（proto 23）
缺失: `addComments`、`coarsenNetwork`、`comments`、`commitLinks`、`commitNodes`、`computePairwiseDistances`、`defaultCommentElectricalCharge`、`defaultCommentSpringLength`、`doConnectedSubnetLayout`、`electricalFieldX`、`electricalFieldY`、`epsilonDistance`、`gravitationalFieldX`、`gravitationalFieldY`、`isFixed`、`maxPrelayoutIterations`、`moveFixedVertex`、`moveLimit`、`moveVertex`、`needsPrelayout`、`prelayoutQuality`、`prelayoutSpread`、`shouldInteract`。
- 力导向布局（斥力/弹簧/重力场）核心算法 + 预布局/粗化选项。
- 步骤：确认 `ForceDirected{Network,Vertex,Edge}` 齐全 → 实现力的迭代（固定顶点、移动顶点、场计算）→ 确定性单测（简单 2 节点收敛）。

### 2.5 LayeredDigraphLayout（proto 24 + static 23）
缺失 proto: `alignOption`、`assignLayers`、`centered`、`commitLayers`、`commitLinks`、`commitNodes`、`countCrossings`、`initializeIndices`、`initializeOption`、`iterations`、`linkLengthWeight`、`linkMinLength`、`linkStraightenWeight`、`maxColumn`、`maxIndex`、`maxIndexLayer`、`maxLayer`、`minIndexLayer`、`nodeMinColumnSpace`、`nodeMinLayerSpace`、`packIterations`、`reduceCrossings`、`removeCycles`、`straightenAndPack`。
缺失 static: `AggressiveLess`、`AggressiveMore`、`AggressiveNone`、`AlignAll`、`AlignLowerLeft`、`AlignUpperLeft`、`AlignUpperRight`、`CycleDepthFirst`、`CycleFromLayers`、`CycleGreedy`、`InitDepthFirstIn`、`InitDepthFirstOut`、`InitNaive`、`LayerLongestPathSource`、`LayerLongestPathSink`、`LinkLengthOptimal`、`PackAll`、`PackExpand`、`PackMedian`、`PackNone`、`PackStraighten`。
- 层级有向图布局（剥层/去环/降交叉/压实）算法 + 5 组静态枚举（`AlignOption`/`Cycle`/`Initialize`/`Layer`/`LinkLength`/`Pack`）。
- 步骤：补 5 组静态枚举 → 确认 `LayeredDigraph{Network,Vertex,Edge}` 齐全 → 实现剥层/去环/降交叉/压实 → 确定性单测（小 DAG 分层坐标）。

### 2.6 Layout / 网络类 / DoubleTreeLayout 核对（非 focus 但被依赖）
- `Layout.doLayout(coll)` 签名修正为 `Part | Iterator<Part> | Diagram | Iterable<Part>`（d.ts 行 218xx）。
- 核对 `LayoutNetwork/Vertex/Edge`、`Tree*`、`ForceDirected*`、`LayeredDigraph*`、`Circular{Network,Vertex,Edge}` 是否齐全；缺则补。
- `DoubleTreeLayout` 若在 index 导出则对照；不在则跳过。

## 3. 实施顺序（依赖驱动）

1. **枚举静态补齐**（Circular 14 + LayeredDigraph 23）→ 先消 static 缺口。
2. **网络/顶点/边类核对**（Tree/ForceDirected/LayeredDigraph/Circular 的 Network/Vertex/Edge）。
3. **GridLayout**（最小，先验证流程）→ **CircularLayout** → **TreeLayout** → **ForceDirectedLayout** → **LayeredDigraphLayout**（最大，最后）。
4. 每完成一个类: `npx tsc --noEmit` + `npm run build` + `scripts/compare-api.cjs --names <类>` 归零 + 该布局确定性单测。
5. 全部完成后: `npm run test:api` + `npm run test:cdp` 全量回归。

## 4. 验收清单（全部勾选即阶段 7 完成）

- [ ] `npx tsc --noEmit` = 0 错误
- [ ] `npm run build` = 0 新告警（仅余预存 3 处 Circular dependency）
- [ ] `npm run test:api` 通过（focus 类 prototype/static 缺口归零）
- [ ] 5 个布局类各自 `scripts/compare-api.cjs --names <类>` proto=0 static=0
- [ ] `tests/layout/` 每个布局至少 1 个确定性用例（固定输入→固定坐标，容差）
- [ ] `npm run test:cdp` 无回归
- [ ] 新增代码无裸 `: any`（官方 any 字段除外并注释 go.d.ts 行号）

## 5. 风险与说明

- **LayeredDigraphLayout 体积最大**（去环/降交叉是复杂图算法），单测需构造小而有代表性 DAG，断言分层号与坐标。
- **ForceDirectedLayout** 为迭代算法，单测只断言收敛后的稳定坐标（容差），不跑大量迭代。
- 惰性占位成员（路由/渲染 hint 相关）仅保证签名，不改变渲染回归基线。
- 若遇缺失的网络类（如 `CircularNetwork` 等），需新建，归入本阶段。