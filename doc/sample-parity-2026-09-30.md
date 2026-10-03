# 样例逐个对标 · 渲染对标（2026-09-30 会话交接）

> 本文是 `doc/gojs-alignment-plan.md` 的延续：那篇是"按类对齐 API"，本文是
> **"按 examples 逐个样例对标官方渲染"**的进展、证据与下一步。
>
> 状态：`tsc --noEmit` clean ｜ rollup 4 产物通过 ｜ `npm run test:cdp` OK ｜ **全部改动未提交**
>
> **验证方式（沿用 Agent.md 指令）：不用 vitest。** 全部用 `temp/survey/` 下的
> CDP 脚本跑真实浏览器做像素/数据对标。

---

## 0. 权威基准

| 用途 | 来源 |
| --- | --- |
| API 权威定义 | `node_modules/gojs/release/go.d.ts`（devDep 已装 **gojs@4.0.4**） |
| **可运行的官方实现** | `node_modules/gojs/release/go.js` ← **最重要的基准，可直接 A/B** |
| 官方样例源码 | gojs.net 是 SvelteKit，样例代码在 `/_app/immutable/nodes/*.js` 的 `jsCode:` 字段里（见工具 1） |
| 官方截图 | `https://gojs.net/latest/assets/images/screenshots/<name>.png` |

> 官方 runtime 的压缩代码是**行为判定的最终依据**：很多 4.0 行为与 2.x 文档/直觉相反
> （见 §4），遇到分歧以 `go.js` 实测为准。

---

## 1. 工具链（本轮新建，全部可复跑）

放在 `temp/survey/`，输出也在 `temp/survey/` 下。

| 脚本 | 作用 | 关键输出 |
| --- | --- | --- |
| `fetch_official.cjs` | 从 gojs.net 路由 chunk 抽官方 `jsCode`/`cssCode` | `temp/official/samples/<name>.js`（**149/157 成功**） |
| `diff_samples.cjs` | 本地 `<script id="code">` vs 官方 jsCode 逐行 diff（压缩空白、过滤本站 wrapper 噪音） | `temp/survey/sample_diff/*.diff`、`summary.json` |
| `cluster_diffs.cjs` | 按根因签名聚类差异 | 61 个 cluster |
| `ab_render.cjs` | **整样例像素 A/B**：同一份官方代码分别跑 `go.js` 与 `dist/`，输出 diff% 与双方 pageerror | `temp/survey/ab/*.png`、`ab/results.jsonl`（增量追加，可分批跑） |
| `arrow_unit.cjs` | **80 个箭头逐个像素表**（一行一个箭头，from/to 分列差异） | `temp/survey/arrow_unit/rows.json` |
| `arrow_geom.cjs` | **80 个箭头几何体逐条 diff**（已把官方数字 `SegmentType` 与本项目 `EnumValue` 名字归一化） | `temp/survey/arrow_unit/geom_diff.json` |
| `arrow_bbox.cjs` | 每个箭头两端的**墨迹包围盒** ← 诊断箭头问题最有效的工具 | stdout |
| `arrow_crop.cjs` | 放大并排截图（上行官方 / 下行我们） | `arrow_unit/crop_<name>.png` |
| `arrow_size.cjs` | 对比 `scale`/`naturalBounds`/`measuredBounds`/`geoBounds` 四项指标 | stdout |
| `part_dump.cjs` | **在真实样例上** dump 前 4 条 link 的 points / natural / measured / actual bounds + 每个子图元的 bounds + `documentBounds` / `position`（把 `ab_render.cjs` 生成的样例页注入 dump 脚本后跑）← 查 link 度量最通用 | `node temp/survey/part_dump.cjs basic ours` |
| `db_probe.cjs` | margin / `getDocumentBounds()` 判别（§2.14） | stdout |
| `align_probe.cjs` | 官方 `position`/`viewportBounds`/`viewSize`/各 Spot/`documentBounds` 探针（`WAIT=domcontentloaded`、`SCALE=2`、`PAD=`、`SPOT=` 可调） | stdout |
| `arrow_geom_probe.cjs` | 逐段 dump 箭头几何体（官方无 `Shape.getArrowheadGeometry`，从渲染出的 Shape 读 `geometry`） | stdout |
| `arrow_kids.cjs` | dump link 每个子对象的 natural/measured/actual bounds ← **定位 Link bounds 问题靠它** | stdout |
| `ab_probe.cjs` / `geom_probe.cjs` / `defmodel.cjs` / `locprop.cjs` / `circ_probe.cjs` / `circvar.cjs` / `picstate2.cjs` | 各类定点探针 | stdout |

**批量跑 A/B**（分批，避免超时；已测过的会跳过，加 `--all` 强制重测）：

```bash
node temp/survey/ab_render.cjs $(cat temp/survey/ab_bases.txt | tr '\n' ' ')
node temp/survey/arrow_unit.cjs                 # 80 箭头像素表
node temp/survey/arrow_geom.cjs                 # 80 箭头几何体 diff
```

### 工具本身踩过的坑（别再踩）
1. **官方样例把 Diagram 存在 `init()` 的局部 `var` 里** → probe 里要包一层
   `go.Diagram` 构造器把实例挂到 `window.__d`。
2. **chunk 里的 `jsCode` 是模板字符串**，必须**单趟从左到右**反转义。
   用 `split('\\n').join('\n')` 会把样例里 `'\n'` 这种字符串字面量破坏成真换行
   （`basic` 的 tooltip 因此假报 48 处差异）。
3. **压缩空白时要避开字符串字面量**，否则 `'{a:1}'` vs `'{ a: 1 }` 之外的差异会被误报。
4. 官方样例有的依赖 `extensions/*.js`（`Inspector`、`ParallelLayout`、
   `AvoidsLinksRouter`、`HyperlinkText`、`ArrangingLayout`、`DrawCommandHandler`），
   A/B harness 目前**没加载**，这些样例会报"两边都错"，属 harness 噪声。

---

## 2. 已验证的修复（都做过 A/B 或几何体比对）

### 2.1 `ModelChanged` / `Changed` 事件（影响 14+ 样例）
官方在 `setProperties` 里**特判**这两个键转发到监听器注册，不是普通属性：

```js
if (s && r === "ModelChanged") { t.addModelChangedListener(e[r]); continue }
else if (s && r === "Changed")   { t.addChangedListener(e[r]);    continue }
```

改动：`src/diagram/Diagram.ts`
- `setProperties` 特判 `ModelChanged` → `addModelChangedListener`、`Changed` → `addChangedListener`
- `addModelChangedListener` 挂到 live model（官方做法），`set model` 时重挂
- `set model` 后走一遍事务，让 `isTransactionFinished` 立即为 true
- `Model.raiseChangedEvent/raiseTransactionEvent` 补 `e.model`（否则 `e.model.toJson()` 挂）
- `e.model` 非空时 `e.diagram` 保持 null（官方语义）
- `UndoManager`：非官方事件名 `StartingTransaction` → 官方 `StartingFirstTransaction`（只首次）

**验证**（`temp/official/probe_events.cjs` vs `temp/ours_probe_events.html`），
事件序列逐条一致：

```
StartingFirstTransaction → StartedTransaction → CommittingTransaction → CommittedTransaction(itf=true)
```

### 2.2 `Layer.add` 不给 Part 打 `_diagram`
→ 所有 model 创建的节点其 `.diagram` 恒为 null（`Picture` 加载完无法重绘、
样例里任何 `.diagram` 用法失效）。已修 `src/view/Layer.ts`（add/remove/clear，
走 `diagram.partAdded/partRemoved`）。

### 2.3 `Picture.copy()` 不加载自己的图
模板被 `copy()` 成几十个 Picture 后，副本只拷贝了仍为 null 的句柄、永不加载 →
节点全是"图片缺失"占位框（`beatPaths` 的 logo 全是空框）。
已修 `src/view/Picture.ts`：加**官方式 url→`HTMLImageElement` 静态缓存**，
`copy()` 走 `source` setter 接入缓存并注册自己的 load 回调，load 完成触发重绘
（原来只在 `desiredSize` 为 NaN 时才重绘）。

### 2.4 默认 model 应是 `GraphLinksModel`
`Diagram._model` 原本是基类 `Model` → `myDiagram.model.addLinkData()` 不存在
（`grouping` 直接崩）。已修 `src/diagram/Diagram.ts`。

### 2.5 `moveParts`/`copyParts`/`removeParts` 的 `coll.iterator()`
本项目 `List.iterator` 是**属性**（一个 Iterator 对象）不是方法，原代码
`coll.iterator()` → TypeError（`doubleCircle` 崩）。
已加 `_iterateParts()` 同时接受 List/Set/Iterator/数组。

### 2.6 `CircularLayout` 三处（**这就是 arrowheads 方向反了的根因**）
现象：官方 `node1=(298,3)`，我们 `node1=(217,3)`，且 `ours = 516 − official` → 整圈镜像。
三处叠加：

1. **枚举只认 `EnumValue`，官方传数字**。GoJS 4.0 全部是数字枚举：
   `CircularArrangement 0..3`、`CircularDirection 10..13`、`CircularSorting 20..24`、
   `CircularNodeDiameterFormula 30..31`。传数字时全部落到 `default` 分支，
   而 `arcCum` 只在 `constantDistance` 时填充 → **角度全变 NaN，整个布局不跑**。
   → 加 `_enum()` 同时接受数字与对象；`arcCum` 改为无条件计算。
2. **默认值全错**。官方默认 `arrangement=ConstantSpacing(0)`、`sorting=Optimized(24)`、
   `nodeDiameterFormula=Pythagorean(30)`；我们是 `ConstantDistance`/`Forwards`/`Circular`。
3. **官方 `sorting=Optimized` 对「星形」和「简单环」给出的环顺序是给定顺序的逆序**
   （4 节点实测 `A:-90, B:180, C:90, D:0`，等价于顶点序 `[D,C,B,A]` + 角度递增）。
   我们是正序 → 镜像。已实现 `sorting` 四种语义，`Optimized` 走逆序。

顺带修正（均与官方数值对上）：
- 新增 `_effectiveDiameter()`，让 `nodeDiameterFormula` 真正参与计算
- `_computeRadius()` 去掉写死的 `Math.max(..., 50)` 下限 → 4 节点 25px 现在两边都是 **r=26.33**
- 显式 `radius` 装不下时按官方增长半径（`ConstantSpacing`/`ConstantDistance` 都算）

### 2.7 箭头「弧」几何体（`Circle` 等带弧箭头整体平移）
`src/view/Shape.ts:59` `"Circle": "F1 m 8,4 b 0 360 -4 0 4 z"`，5 参含义是
「起点在角度 0、**圆心相对当前点偏移 (-4,0)**、半径 4」。
但 `src/core/Geometry.ts` 的 `b` 分支把它当成「相对终点 + 反解椭圆」，
圆心解到 `(12,4)` 而非 `(4,4)` → 包围盒 `[8,0,8,8]`（官方 `[0,0,8,8]`），
而且用 4 段三次贝塞尔近似整圆，官方是**一条精确 `Arc` 段**。

已改：
- `src/core/PathSegment.ts` 新增 `PathSegment.AngleArc(centerX, centerY, radiusX, radiusY, startAngle, sweepAngle)`
- `src/core/Geometry.ts` 的 `b` 分支：5 参时直接生成 `AngleArc`

**验证** —— 现在逐字段一致：
```
官方: {"type":5, centerX:4, centerY:4, radiusX:4, radiusY:4, startAngle:0, sweepAngle:360}  bounds=[0,0,8,8]
我们: {"type":"Arc", centerX:4, centerY:4, radiusX:4, radiusY:4, startAngle:0, sweepAngle:360}  bounds=[0,0,8,8]
```
几何一致率 32/80 → **33/80**；`belts`（重度用弧）1.80% → **1.75%**，无回归。

### 2.8 `examples/absolute.html` 对齐官方 4.0.4
本地样例是旧版且有偏差，已按官方改：文字绑 `key`（Alpha/Beta/Gamma/Delta）、
`stroke:'transparent'` + `strokeWidth:0`（节点**不**该有边框）、
背景 `new go.Shape({strokeWidth:0, fill:'#333'})`（**用户看到的"没有边框"就是这个 #333 框**）、
`shadowBlur: 3`、官方 `linkTemplate`（`#333` + `toArrow:'standard'`）。
网站 wrapper 差异（`<textarea>.value` vs `<pre><code>.innerHTML` + Prism）是有意保留的。

### 2.9 `Link` 的 arrange/measure（**80 个箭头全部错位的总开关**）

`temp/survey/arrow_kids.cjs` 在单条 `Standard` 箭头、`scale:3` 单元页上 dump
link 每个子对象的 natural/measured/actual bounds，暴露了 4 个独立缺陷。
修复后该单元页与官方**逐字段完全一致**：

| | 官方 | 修复前 | 修复后 |
| --- | --- | --- | --- |
| `link.naturalBounds` | `[0,0,300,27]` | `[0,0,1,1]` | `[0,0,300,27]` ✅ |
| `link.measuredBounds` | `[0,0,300,27]` | `[0,0,1,1]` | `[0,0,300,27]` ✅ |
| `link.actualBounds` | `[0.5,9.5,300,27]` | `[null,null,1,1]` | `[0.5,9.5,300,27]` ✅ |
| `diagram.documentBounds` | `[-5,4.5,311,37]` | `[-5,-5,311,33.5]` | `[-5,4.5,311,37]` ✅ |
| `diagram.position` | `[-149.5,-37]` | `[-149.5,-48.25]` | `[-149.5,-37]` ✅ |

**为什么画面看着是对的**：`CanvasRenderer._renderArrow` 直接读 `link.points` 算位置，
完全绕过 layout。所以连线画得没问题，但**布局度量是垃圾** → `documentBounds` 错位
→ 视口被推偏 → 每一行箭头都错位。官方是关于链路中线对称的，我们不是。

四处修改：

1. **`src/view/Panel.ts` `_measureLink()`：measure 前先 `updateRoute()`**
   缺这一步时 `link.points` 此刻仍为空，`_unionRect` 退化成 `[0,0,1,1]`。
2. **`src/view/Panel.ts` `_measureLink()`：把子图元 measured 尺寸并入 `_unionRect`**
   箭头 `measured = natural×scale` 比路线高，缺了它 link 只有一条零高度线
   （`299×0` → `299×27`）。
3. **`src/view/Link.ts` `_computeRouteBounds()`：回写 `Link._position` = 路线包围盒中心**
   `Part._position` 默认是 `Point(NaN, NaN)`，而 `Link` **从来不写它**，
   于是 `Diagram` 用 `pos` 去 arrange 得到 NaN 矩形。
4. **`src/diagram/Diagram.ts` `_measureArrangeAll()`：链接的 arrange 矩形以 position 为中心**
   节点 `actualBounds` 以 position 为**左上角**，链接以路线中点为**中心**（官方语义）。
   统一按左上角排会让 link 包围盒整体偏移半个自身尺寸。

### 2.10 ⚠️ 路线两端的「延伸半个线宽」—— 已撤销，证据冲突

最初在合成单元页上测到：官方把路线两端各**向外**延长 `strokeWidth/2`
（1×1 节点 → 端口沿 1/300、官方 0.5/300.5；40×40 节点 → 40/300、官方 39.5/300.5），
据此实现了 `_shortenRoute()`。方向先试反（向内缩短）得到 `1.5..299.5`，已纠正。

**但在真实样例 `basic` 上结论相反**：官方路线 `58.16 → 78.16` 正好等于两个端口沿
（节点 0 右沿 58.157、节点 1 左沿 78.157，间距 20），**没有任何延伸**。
而且加不加这个开关，`basic` 的路线都是 `58.16 → 75.16`（本身就短 3px），
说明该实现在真实样例上是**死代码**、从未生效。

**决策：整段删除 `_shortenRoute()`。** 实测删除后净收益为正：
`contentAlign` 2.222 → **2.004**、`conceptMap` 3.774 → **3.527**、
`distances` 5.777 → **5.740**、`animatedFocus` 97.256 → **96.469**。

**留作待解疑问**：为什么合成页要延伸、真实样例不延伸？
最可能是合成页的节点模板（`PanelAuto` + 1×1 或无边框 Shape）走了官方
「端口无有效几何 → 用 Spot 中心」的分支，而 `basic` 走的是「按形状求交」分支。
要定论需在官方侧对两种节点模板各测一次 `getNearestIntersectionPoint`。

---

### 2.11 link 的「画线」主图元必须按路线长度定尺

`temp/survey/part_dump.cjs`（把 `ab_render.cjs` 生成的样例页注入 dump 脚本，
逐条打印 link 的 points / natural / measured / actual bounds 与各子图元的 bounds）
在 `basic` 上暴露：

| | 官方 | 我们（修前） |
| --- | --- | --- |
| `link0` 路线 | `58.16 → 78.16`（20 长） | `58.16 → 75.16`（17） |
| 画线主图元 `measuredBounds` | `[-1,-1,19,2]` | **`[0,0,2,2]`**（默认 1×1 加描边） |
| `link0.actualBounds` | `[57.16,12.52,21,9]` | `[20.97,12.52,9,9]` |

官方把画线主图元的 measured 尺寸设为 `(路线长, 线宽)`，起点前留半个线宽。
缺这一步时主图元保持默认尺寸，link 的 naturalBounds 塌缩成箭头大小。
已在 `Panel._measureLink()` 里补上（新增 `_findLinkMainElement()` 找主图元），
主图元 measured 由 `2×2` 变为按路线长定尺。

**当时只修了一半**：主图元只从 `2×2` 变成 `3.23×2`，官方是 `19×2`。
根因是 measure 时刻的路线陈旧 → 已在 §5.1 定位并修好，现在主图元
measured 与官方**完全一致**（`[-1,-1,19,2]`）。

**效果**：`doubleCircle` 26.23（原始基线）→ **24.86**；
`conceptMap` 3.42 → 3.76（+0.34）。净收益为正，保留。

---

### 2.12 `friendWheel` 曲线连线（部分修复）

**症状**：官方 `friendWheel` 的连线是明显的贝塞尔曲线，我们的全是直线。

**根因 1（已修，直线的原因）**：`CanvasRenderer._renderLinkPath()` 的
`CurveBezier` 分支直接读 `link._curviness`，而该字段默认是 `NaN`，
于是 `if (curviness && isFinite(curviness) && curviness !== 0)` 不成立，
走 `ctx.lineTo(...)` 画成直线。
官方 `Link.RF = 16`（见 `node_modules/gojs/release/go.js` 里
`static RF=16`，`computeCurviness()` 在 `curviness` 为 NaN 时回落到它）。
→ 改用 `link.computeCurviness()`。
**`friendWheel` 23.993% → 21.578%（−2.4）**，其余 8 个样例无变化。

**根因 2（未修完）**：官方是**在 `computePoints()` 里就把贝塞尔控制点插进
`link.points`**，实测官方 `link0.points` 是 4 点：

```
[[594.46,53.7],[595.46,74.25],[597.86,75.39],[614.47,63.25]]
```

我们在 `Link._applyBezierCurve()` 里按官方 `t3` 的公式实现了这件事
（控制点取弦上 1/3、2/3 处，再沿弦法线偏移 `computeCurviness()`；
水平弦直接改 y，其余按斜率 `f = -a/h` 投影），
并在 `_finalizeRoute()` 与 `updateRoute()` 的 `commitRoute()` 之后各调一次。

**但插入的点每次都被回退**，实测仍然是 2 点：
给 `_applyBezierCurve` 挂计数器后读到 40 次调用，每次都是
`{cc:"CurveBezier", n:2}` —— 即**守卫全部通过、函数确实执行了**，
但执行完之后 `_points` 又是 2 点。
`points` getter 直接返回 `this._points`，`List.insertAt` 也正常，
所以问题在于**调用之后还有别的代码把 `_points` 重建成 2 点**
（怀疑 `computePoints()` 重跑时读到了已被改成 4 点的 `_points` 后
判定非法并回滚，或 `rollbackRoute()` 恢复了旧的 `_oldPoints`）。
**根因未定位。**

**根因 3（已定位，未修）**：`friendWheel` 靠自定义 `WheelLayout` 的
`commitLinks()` 覆写来设 `link.curviness`（夹在 30~60 之间，带符号），
靠 `commitNodes()` 覆写来按 `v.actualAngle` 旋转节点与文字。
本项目有两个缺口让这两个覆写**根本没机会生效**：

1. **`LayoutVertex` 没有 `actualAngle` 字段** → `v.actualAngle` 恒为 `undefined`，
   `da - sa` 得 NaN，曲率与旋转全废。已在 `LayoutVertex.ts` 补上该字段声明。
2. **`CircularLayout.doLayout` 从不设 `this._network`**，也从不调用
   `commitNodes()` / `commitLinks()`。样例里 `this.network.edges.each(...)`
   直接对 `null` 取属性，抛错被布局层吞掉 → 静默失效。

试过补 `this._network = net` + 在 `doLayout` 末尾调 `this.commitLinks()`：
`curviness` **仍是 NaN**（覆写依旧没真正跑通），而指标净负
（friendWheel 21.58→21.70、conceptMap 3.79→3.93、doubleCircle 26.65→27.62）。
→ **已回退**，只保留 `actualAngle` 字段声明（纯新增，无行为影响）。

**真正的阻塞点**：本项目把官方 `commitNodes()` 里的「节点定位」内联进了
`_layoutComponent()`，所以一旦调用 `commitNodes()` 就会**重复叠加中心偏移**。
要支持子类覆写，必须先做结构改造：`_layoutComponent` 只写相对中心的
`v.x/v.y`，由 `doLayout` 末尾统一调 `this.commitNodes()` 落位。
这是 `friendWheel`（以及任何覆写 `commitNodes`/`commitLinks` 的 CircularLayout
子类）能对齐的前提，属高风险重构，需单独排期。

**`friendWheel` 度量本身有 ~1.4 个百分点的run-to-run 波动**
（同一份构建连续测得 23.99 / 21.58 / 21.70 / 23.05 / 22.72），
判断该样例优劣时不要拿单次读数下结论。

### 2.13 空文本 TextBlock 仍要保留一个空行的高度

把 `part_dump.cjs` 扩展成也 dump 节点的每个子图元（类型 / 是否 panel main /
`actualBounds` / `measuredBounds` / `naturalBounds`），在 `connectionBoxNode`
上直接抓到节点少高 13.73 的来源 —— 节点里那个**宽度为 0 的 TextBlock**：

| | 官方 | 我们（修前） |
| --- | --- | --- |
| 3 号子图元 `measuredBounds` | `[0,0,0,13.72]` | `[0,0,0,0]` |
| 3 号子图元 `naturalBounds` | `[0,0,0,13.72]` | `[0,0,0,0]` |
| `node0.actualBounds` | `[0,0,94,129.45]` | `[0,0,94,115.72]` |

`115.72 + 13.73 = 129.45`，分毫不差。
`TextBlock._measure()` 里 `if (!this._text)` 直接返回 `0×0`，
而官方对空文本仍排一个**空行**，高度就是字体行高。

**修法**：空文本时用 `_getLineHeight()` 算出行高，
`naturalBounds = measuredBounds = Rect(0, 0, 0, lineHeight + spacingAbove + spacingBelow)`。
（注意 `TextBlock` 没有 `fontSize` 属性，行高要经 `TextBlock._getFontSize(this._font)` 取。）

**效果**：`connectionBoxNode` 的 `node0.actualBounds` 现在与官方**完全一致**
（`[0,0,94,129.45]`）。

**⚠️ 但 `connectionBoxNode` 的像素 diff 反而从 9.396% 涨到 11.085%。**
这是**下游症状，不是本修复的错**：节点高度修正后，依赖它的 15 条连线路由跟着变了，
暴露出该样例**第二处路由缺陷**（此前被错误的节点高度掩盖）。
同批 `doubleCircle` 26.65→**24.12**、`animatedFocus` 96.47→**96.35**、`contentAlign` +0.15。
按「语义有官方实测证据就保留，像素为负先查下游」的原则**保留本修复**。

### 2.14 ✅ `GraphObject.getDocumentBounds()` 给子图元多加了一份 margin（原 §6 #5，已修）

新工具 **`temp/survey/db_probe.cjs`**：构造 Auto Node `margin=(10,20,30,40)` +
Panel Vertical `margin=(5,6,7,8)` + TextBlock `margin=(1,2,3,4)` + Ellipse
`margin=(9,10,11,12)`，load 后 700ms dump 两边的 `db/ab/nb/margin`。

实测规则（官方）：

> **`getDocumentBounds() = 自身 actualBounds + Σ(父 panel 的 `actualBounds` 原点)`，任何一层都不加 margin。**

证据：根 TextBlock 的 `db − ab = (8.5, 5.5)`，正好是它父 Panel 的 `actualBounds` 原点；
若是把 margin 全加起来应是 `(10+5+1, 20+6+2) = (16, 28)`，差得远。

**修法**：`src/view/GraphObject.ts` `getDocumentBounds()` 循环里删掉
`margin.left / margin.top`（顺带删掉已无用的 `obj` 变量）。

**效果**：`basic` 修后与官方完全一致 —— node0 TextBlock
`db = [9.26,9.26,39.63,15.52]`（修前 `[15.26,15.26,…]`，样例里 `margin: 6`）。
影响面：`Shape.getNearestIntersectionPoint`、`Link._connectionPoint`、
`AvoidsLinksRouter`、`LayoutNetwork:91`、`Layout:327` 等 20+ 处都吃 `getDocumentBounds()`。

**A/B**：`comments` 3.955→**3.725**（恒定读数，可信）；`doubleCircle` 用「旧代码跑 6 次 vs
新代码跑 6 次」双向实验证明是**噪声**（旧均值 ≈26.5、区间 24.76–28.10）而非回归 → **保留**。
（当时顺带记的 `animatedFocus` 96.469→92.9 属**重灾区读数**，见 §4 波动分档，不作证据。）

配套把 `part_dump.cjs` 扩成：子图元递归到 depth 3、打印 `ml/mt`(margin) 与 `db`。

### 2.15 ✅ `_renderArrow` 尺寸口径（原 §6 #6 前半，已修）

`src/render/CanvasRenderer.ts` `_renderArrow()` 两处：

1. 绘制尺寸由 `width || 10` 改为 `arrowScale = shape.scale`（官方 8×8 @scale3 → 24px，
   我们原先只会画 10px）；显式 `width`/`height` 时仍优先用它。
2. 加 `inset = strokeWidth * arrowScale / 2`：官方 `measuredBounds` 把描边算进盒子，
   几何要相对盒子**内缩半个描边**（`toArrow` 取 `-inset`、`fromArrow` 取 `+inset`），
   `ctx.lineWidth = strokeWidth * arrowScale`。

**A/B**（两项实验都做过，别再试）：

| 变体 | `arrowheads` 整样例 | 单元页 `Standard` |
| --- | --- | --- |
| scale + inset（当前） | **2.116%** | **11.496%** |
| scale + inset=0 | 2.158% | 13.409% |

单元页收益：`match 0/80 → **17/80**`、最差项 31.0% → **18.67%**、
`Standard` 13.9% → **11.5%**、最好项 11.6% → **6.40%**。
墨迹包围盒官方 `y[6,30]`(24 高) / 我们 `y[10,33]`(23 高)（修前 `y[16,27]`）。

**代价**：`arrowheads` 整样例 2.017 → 2.116（+0.099，3 次复测恒定，非噪声）。
已确认**不是位置问题** —— 该样例官方/我们的 `position`、`documentBounds`、
`viewportBounds` 逐字段完全一致（`pos=[-192.169,-52.169] doc=[-18.25,-18.25,552.162,552.162]`），
纯箭头绘制差异。按「单元页是受控实验、口径以官方 measuredBounds 为准」**保留**。

### 2.16 ✅ 滚动条槽位：`viewportBounds` 要扣 11px（原 §6 #6 后半，已修）

`arrow_unit` 单元页整页像素偏移 3.5px 的根因，排查链：

1. 官方 `Diagram.position = [-5.5,4]`（= `documentBounds` 左上），我们 `[-5,0.5]`。
2. `0.5 = db.y + 0.5·db.height − 0.5·vpHeight` → 我们把内容**竖直居中**了，官方没有。
3. 直接照抄官方 `on(t)` 只跑到 spot 对齐就 `return`、去掉 clamp → 整页更差
   （`barCharts` 0.73→9.56、`donutCharts` 0.97→14.8…），**已回退**（见 §5.3）。
4. 真凶：**官方 `viewportBounds.height` 是 3509，不是 3520**（3520 − 11px 横向滚动条）。

**官方滚动条预留规则**（`temp/survey/align_probe.cjs` 对 4 个合成尺寸 + scale1/2 实测，8/8 命中）：

```
若 documentBounds.width  * scale > viewSize.width  → 可用高度 -= 11   (横向滚动条占一行)
若 documentBounds.height * scale > viewSize.height → 可用宽度  -= 11   (纵向滚动条占一列)
```
- 两条判定**互相独立**、都只跟**原始 `viewSize`** 比（不看另一条是否已经扣过）；
- 11 是**固定屏幕 px**（scale2 下 `viewportBounds = (400−11)/2 = 194.5`，实测吻合）；
- 官方还兜底 `Math.max(St − Ht, 1)`，否则未布局的 div（`clientWidth=0`）会算出负尺寸；
- 官方**占位但不绘制**滚动条（`unit_official.png` 底部 11 行全白），所以照抄不引入新像素。

**修法**：`Diagram.viewportBounds` 按上式扣减；`SCROLLBAR_SIZE = 11`。

**配套修正**（这两处的口径不一样，别混）：

| 位置 | 用哪个视口 | 证据 |
| --- | --- | --- |
| `_applyInitialViewport()` 的 spot 对齐 | **原始 `viewSize`** | `orgChartStatic` `initialDocumentSpot=TopCenter`，官方 `position.x = 1182.907 = docCentre − 900/2`；用 `viewportBounds`(889) 会得 1188.407 |
| `_clampViewportPosition()`（官方 `H2`） | **带预留的 `viewportBounds`** | 单元页官方 `St=3509`，才让 `i > documentBounds.height` 不成立、`position.y` 稳在 4 |

**A/B**：`orgChartStatic` **8.117%（3 次恒定）**，回退视口口径后保持；
`arrowheads`/`basic`/`comments`/`connectionBoxNode` 全部恒定不变。
全 148 样例复跑一遍，**报错样例集合与上一轮逐名相同、新增 0 个**
（`orgChartStatic` 曾报 `Rect(0,0,-11,-11)`，就是没兜底导致，现已消失）。
> 注意：本轮曾把 `animatedFocus` 96.47→92.9、`grouping` 3.60→2.43 记作本修复的收益，
> 后经 3 次复跑证明两者都在**重灾区**（89~98 / 2.3~4.3），**收益不成立**。

**已知未解**（本轮记录，见 §6 #13/#14）：官方 `H2` 的 `else` 分支在
`viewH ∈ (3530, 3550)` 这个窄带里给出与「预留后视口」不同的结果（最多差 5.5px），
且官方 `alignDocument` 源码写的是 `viewportBounds` 而照抄会变差。

## 3. 关键 API 差异发现（4.0 与直觉/2.x 不同，容易反复踩）


| 项 | 官方 4.0 | 本项目 | 说明 |
| --- | --- | --- | --- |
| `LayeredDigraphLayout.direction` | **角度 0/90/180/270**，90=向下 | 原为 2.x 的 10/20/90/180 | 已改成角度；`beatPaths` 原本横躺就是因为 90 在两套语义里含义相反 |
| `CircularLayout` 各枚举 | 数字 | EnumValue 对象 | 已加双向兼容（§2.6） |
| `PathFigure.SegmentType` | 数字 `Move=1 Line=2 Bezier=3 QuadraticBezier=4 Arc=5 SvgArc=6`，**没有 Close** | 2.x 名字 `MoveTo`/`CubicBezier`/…/**有 `Close`** | 我们的几何体普遍多一个尾 `Close`（视觉多为空操作，但说明两边几何表不同源） |
| `Model.nodeLocationProperty` / `nodeSizeProperty` / `nodeAngleProperty` | **已删除**（d.ts 里查无此属性） | 仍认 `loc` | 4.0 位置只能靠 binding（`.bind('position','loc',go.Point.parse)`）。我们认 `loc` 是**超集**，但依赖 `loc` 又不 binding 的样例会与官方分道扬镳 |
| `Shape.getArrowheadGeometry(name)` | **不是公开 API** | 内部有 `_getArrowheadGeometry` | 公开的是 `getArrowheadGeometries()` → `Map<name, Geometry>` |
| `Diagram.layout()` | **不存在**（会 TypeError） | 也不存在 | 探针里别用；靠挂真实 div 等异步布局 |
| `Diagram.fromDiv()` | 参数是 **`HTMLElement`**（`fromDiv(document.getElementById('dv'))` 能用） | 参数是 **string id**，传 element 会返回 `null` | 探针兼容写法：`fromDiv(id) \|\| fromDiv(el)`。见 `temp/survey/align_probe.cjs` |
| `gojs` npm 4.x 包 | **不含 `samples/`** | — | 官方样例源码只能从 gojs.net 的 Svelte chunk 抽（工具 1） |

---

## 4. 指标基线（2026-09-30 最新一轮，`ab_render.cjs` 像素 diff，越小越好）

| 样例 | diff% | 备注 |
| --- | --- | --- |
| `barCharts` | 0.730% | |
| `adornmentButtons` | 0.845% | |
| `donutCharts` | 0.964% | |
| `candlestickCharts` | 1.001% | |
| `basic` | **1.034%** | §2.14 修 `getDocumentBounds` 后 |
| `belts` | 1.765% | 轻微波动 ±0.15 |
| `arrowheads` | 2.116% | 恒定值（3 次复测一致）；较基线 +0.099，来自 §2.15 箭头口径，已确认非位置问题 |
| `contentAlign` | 1.98~2.27% | 轻微波动 ±0.15，基线 2.004 落在区间内 |
| `customTextEditingTool` | 3.586% | |
| `conceptMap` | 2.97~4.07% | 中等波动，基线 3.119 落在区间内；**别拿单次读数下结论** |
| `comments` | **3.725%** | 基线 3.955，§2.14 修后 |
| `customExpandCollapse` | 4.222% | |
| `grouping` | 2.25~4.34% | **重灾区**，任何单次读数都不可引用 |
| `distances` | 5.756% | 轻微波动；原始基线 5.386%，且 ours 侧报错 |
| `beatPaths` | 6.600% | 剩 LayeredDigraphLayout 算法差异 |
| `orgChartStatic` | 8.117% | §2.16 视口口径修正后回到基线 |
| `connectionBoxNode` | 11.080% | 节点高度已修正（见 §2.13），但暴露出第二处路由缺陷；原始基线 7.740% |
| `absolute` | 14.487% | |
| `friendWheel` | 21.3~23.0% | 中等波动 ±1.5，基线 22±1.4 落在区间内，**看不出改善** |
| `controlGauges` | 23.520% | 且 ours 侧报错 |
| `doubleCircle` | 25.6~28.3% | **噪声 ±1.7**（旧代码 6 次 24.76–28.10、均值 26.5；本轮 3 次 25.6/26.6/27.1/28.3），基线 24.119 是幸运读数，**「优于基线」不成立** |
| `DOMTree` | 30.465% | |
| `animatedFocus` | **89.0~98.0%** | **重灾区**（3 次：98.0/89.0/90.4），原始基线 98.06 也在区间内。历史上记过的 96.47/92.90 都只是波动，**任何「改善」说法都不成立** |

**全量 148 样例**（`ab_render.cjs --all $(cat ab_bases.txt)`，本轮最终构建，`ab_full_0035.log`）：

| 报错类别 | 数量 | 说明 |
| --- | --- | --- |
| **仅我们报错** | **12** | `addRemoveColumns`/`canvases`/`controlGauges`(样例自身 null)、`pathAnimation`/`pipeTree`/`spacingZoom`/`timeline`(样例逻辑)、`constantSize`/`productionEditor`/`virtualizedTree`/`virtualizedTreeLayout`(harness 超时)、`spreadsheet`(`Rect(4,4,-8,12)` ← **疑似真 bug，见 §6 #15**) |
| 仅官方报错 | 14 | 全是 §6 #12 的 harness/ext 噪声 |
| 两边都报错 | 65 | harness 噪声 |

与上一轮 `ab_full_0034.log` 相比，**三个类别完全相同、新增 0 个**（脚本逐名比对），
即本轮 4 处改动**没有引入任何新的报错样例**。

最差样例：`icons` 99.3、`animatedFocus` 89~98、`spreadsheet` 54.98、`tiger` 54.9、
`thermometer` 39.1、`swimLanes` 33.0、`DOMTree` 30.465。

> ⚠️ **读数波动分档**（每个样例 3 次复跑，最坏情况）：
>
> | 档 | 样例 | 波动幅度 |
> | --- | --- | --- |
> | **完全恒定**（可用单次读数） | `basic` `comments` `arrowheads` `orgChartStatic` `connectionBoxNode` | 3 次读数**逐位相同** |
> | 轻微 | `contentAlign` `belts` `distances` | ±0.15 |
> | 中等 | `conceptMap` `doubleCircle` `friendWheel` | ±0.5 / ±1.7 / ±1.5 |
> | **重灾**（含动画/异步，单次读数无效） | `animatedFocus` `grouping` `ruleredDiagram` `dragUnoccupied` | **98.0↔89.0 / 2.3↔4.3 / 17.2↔26.5 / 5.9↔10.9** |
>
> `animatedFocus` 曾记的 92.897 与 `grouping` 曾记的 2.43 都落在重灾区区间内，
> **不能当作「改善」引用**；改用「该档区间」或复跑 3 次取最小值。

**箭头单元页**（`arrow_unit.cjs`，80 个箭头逐个，**脚本级确定性读数**）：

| | 修复前 | §2.15+§2.16 后 |
| --- | --- | --- |
| 完全匹配 | 0/80 | **17/80** |
| 最差项 | 36.3% (`DiamondCircle`) | **18.67%** (`AccelerationArrow`) |
| 最好项 | 11.6% | **0.038%**（`X`/`TripleLine`/… 共 6 项） |
| `Circle` | 24.8% → 20.0% | **2.94%** |
| `Standard` | 22.3% → 13.9% | **6.06%** |
| 平均 | — | **6.23%**（50/80 < 8%，28/80 < 5%） |
| 竖直偏移 `dy` | 3.5px 整页偏 | **0（全部 80 行）** |
| 几何体一致 | 33/80 | 33/80（47 项不同，见 §6 #7） |

**样例代码一致性**（`diff_samples.cjs`）：**72/149 完全一致**、68 有差异、8 仅 wrapper 差异、9 拿不到官方源码。
差异根因 61 个 cluster，最大三类：
- `Model.setDataProperty(x,p,v)` vs `Model.set(x,p,v)`（官方用前者，10 个样例）
- 官方样例共有的 `SaveButton` / `Modified` / `document.title` 加星号那段
- 官方把多子路径放在**同一个 figure 里用 `Move` 分隔**，我们是每子路径一个 figure

## 5. 当前状态与未结问题

### 5.1 ✅ 已修：measure 时刻的路线是陈旧的

在 `Panel._measureLink()` 里挂 `globalThis.__linkMeasureLog` 打调试，
用 `temp/survey/measure_log.cjs` 跑 `basic`，**直接读到判别证据**：

```
修前： fromAb=[null, 58.157]  toAb=[null, 49.705]  len=3.226  valid=true
       fromAb=[0,    58.157]  toAb=[78.157, 49.705]  len=3.226  valid=true   <-- 端口已定型，路线还是旧的
修后： fromAb=[0,    58.157]  toAb=[78.157, 49.705]  len=19                  <-- 正确
```

**根因确认 = 三个候选里的第 1 个**（不是 iterator 复用，也不是节点未 arrange）：
首次算路线时端口 `actualBounds.x` 还是 `null`，算完把 `_isRouteValid` 置 `true`，
之后 `updateRoute()` 一直短路，节点排好后**再没触发过重算**。

**修法**：`Diagram._measureArrangeAll()` 在 `pass(0)` 节点、`pass(1)` 组排完后
新增 `_invalidateLinkRoutes()` 统一失效，再进 `pass(2)` 排链接。

**效果**：`basic` 的 `documentBounds` 与 `position` 现在与官方**完全一致**：

| | 官方 | 我们 |
| --- | --- | --- |
| `documentBounds` | `[-5,-5,179.92,158.12]` | ✅ 一致（修前 `[-14.94,-5,189.86,158.12]`） |
| `position` | `[-365.04,-235.94]` | ✅ 一致（修前 `[-370.01,-235.94]`） |
| 画线主图元 `measuredBounds` | `[-1,-1,19,2]` | ✅ 一致（修前 `[0,0,2,2]`） |
| `link0.actualBounds` | `[57.16,12.52,21,9]` | `[57.16,12.52,19,9]`（x/y 一致，宽差 2） |

### 5.2 ✅ 基本澄清：整样例 A/B 已回到基线，剩余回退来自别的子系统

> ⚠️ **本节是历史快照，表里的数字多为单次读数**。后来（§4 波动分档）确认
> `animatedFocus`/`conceptMap`/`doubleCircle`/`distances` 都会漂移，
> 因此表里标注的「改善/持平/回退」**一律不作为结论**，只用于说明当时的思路。

路线陈旧修好后（并删除 §2.10 的延伸），与**最初基线**逐样例对比：

| 样例 | 最初基线 | 现在 | 说明 |
| --- | --- | --- | --- |
| `basic` | 1.041 | **1.041** | ✅ 完全回到基线 |
| `comments` | 3.725 | **3.725** | ✅ 完全回到基线 |
| `customContextMenu` | 0.651 | **0.651** | ✅ 完全回到基线 |
| `contentAlign` | 2.009 | **2.004** | ✅ 略优于基线 |
| `animatedFocus` | 98.059 | **96.469** | ✅ 改善 1.6 |
| `belts` / `arrowheads` | 1.751 / 2.017 | 1.753 / 2.017 | 持平（噪声级） |
| `conceptMap` | 3.119 | 3.527 | +0.41 |
| `doubleCircle` | 26.230 | 26.654 | +0.42 |
| `distances` | 5.386 | 5.740 | +0.35（且 ours 报错） |
| `connectionBoxNode` | 7.740 | 9.396 | **+1.66，见下** |

**`connectionBoxNode` 的回退不是 link 造成的**，`part_dump` 已定位到真凶：

| | 官方 | 我们 |
| --- | --- | --- |
| `node0.actualBounds` | `[0,0,94,129.45]` | `[0,0,94,115.72]` ← **节点高差 13.73** |
| `doc` | `[-5,-85,304,299.45]` | `[-23.8,-85,341.6,401.45]` |

是**节点（带端口的 connection box）测量高度就不对**，进而带偏连线路由与文档包围盒；
之前 link 包围盒坏掉时把这个缺陷**掩盖**了，修好 link 后才暴露。
→ 归入 §6 剩余工作第 5 项（节点/端口测量），不是 link 的账。

### 5.3 已回退的实验（都因实测更差，别重复）
| 实验 | 结果 |
| --- | --- |
| `_renderArrow` 里乘 `Shape.scale` | 箭头撑满整行，`Circle` 24.8% → 28.9% |
| `_renderArrow` 改用 `measuredBounds`（27）当绘制尺寸 | `Circle` 22.3% → 28.7%，且 `documentBounds` 纹丝不动 |
| 在 `_computeRouteBounds()` 里直接回写 link 自身 bounds | 无效（时机不对，被通用 arrange 覆盖）→ 改为在 `_measureLink()` 里做 |
| 路线两端「向内缩短」 `strokeWidth/2` | 方向错，1×1 案例得 `1.5..299.5`，官方是 `0.5..300.5` |
| `Link._position` 用 4 参 `new Point(x,y,w,h)` | 编译错，`Point` 无 4 参构造 |
| `from.distanceToPoint()` | 编译错，`Point` 只有 `distanceSquaredPoint()` |
| `_applyInitialViewport()` 去掉 clamp（照抄官方 `on(t)` 只到 spot 对齐就 `return`） | **大范围回退**：`barCharts` 0.73→**9.56**、`donutCharts` 0.97→**14.8**、`adornmentButtons` 0.85→**9.57**、`basic` 1.04→5.48。官方其实**会**跑 clamp（见 §2.16），回退 |
| `alignDocument()` 照抄官方源码用 `viewportBounds` | `animatedFocus` 92.7→**97.3**、`grouping` 2.43→**4.34**、`conceptMap` 3.13→**3.73**。官方调用点之后还会再跑一次 `H2`，我们没有那一步 → 保持 `viewSize` 口径 |
| `_clampViewportPosition()` 照抄官方 `H2` 用 `padding`（`const a = this.kh`） | `animatedFocus` 92.7→**97.3**、`grouping` 2.43→**3.06**、`conceptMap` 3.13→**3.47**。官方 `documentBounds` 与 `H2` **双重计入** padding（实测 pad=50 → doc `[0,0,77,14]`→`[-50,-50,177,114]`，两边一致），我们照抄反而变差 → 保持 0 |
| `_renderArrow` 去掉 `inset` | `arrowheads` 2.116→**2.158**、单元页 `Standard` 11.50→**13.41** → 保留 inset |

### 5.4 单元页仍存在的差异（已知、未修）
`arrow_unit.cjs` 现在报 `rows compared: 80  match: 17  differ: 63`（§2.15+§2.16 前是 0/80）。
单元页 `doc` 只差 0.5px（官方 `[-5.5,4,329.5,3513]` / 我们 `[-5,4,329,3513]`），
`position`/`viewportBounds` 完全一致（`pos=[-5·,4]`、`vp=[…,320,3509]`）、
80 行 `dy` 全为 0。剩余差异来自**箭头几何体本身**（47 项不同，见 §6 #7）与
`AccelerationArrow`/`TripleFeathers` 这类个别绘制细节。

新工具：
- `temp/survey/db_probe.cjs` — margin / `getDocumentBounds()` 判别（§2.14）
- `temp/survey/align_probe.cjs` — 官方 `position`/`viewportBounds`/`viewSize`/各 Spot 探针
  （`WAIT=domcontentloaded` 可绕开部分样例的 networkidle 超时；`SCALE=2` 复测缩放）
- `temp/survey/arrow_geom_probe.cjs` — 逐段 dump 箭头几何体（官方没有
  `Shape.getArrowheadGeometry`，要用渲染出的 Shape 读 `geometry`）

---

---

## 6. 剩余工作（按依赖顺序）

| # | 事项 | 下一动作 |
| --- | --- | --- |
| 1 | **CircularLayout 支持子类覆写 `commitNodes`/`commitLinks`（friendWheel 的前提）** | 本项目把节点定位内联进 `_layoutComponent()`，导致调用 `commitNodes()` 会重复叠加中心偏移。需先重构：`_layoutComponent` 只写相对中心的 `v.x/v.y`，由 `doLayout` 末尾统一调 `this.commitNodes()` 落位，并设 `this._network`。高风险，单独排期 |
| 2 | **`friendWheel` 的椭圆排布** | 官方 `node0.ab=[750.84,176.07,75.48,44.13]`，我们 `[1442.9,447.7,70.95,27]`：椭圆半径偏大、节点溢出视口、名字标签未旋转。依赖第 1 项先落地 |
| 3 | **`computeCurviness` 与曲率链路** | 官方 friendWheel 的 curviness 由样例 `commitLinks()` 给出 30~60；我们恒为 16。曲率链路依赖第 1 项。另需对照官方 `computeCurviness` 源码（有一段遍历 bundle `this.lr.cn` 的逻辑）补齐缺省分支 |
| 4 | **`connectionBoxNode` 第二处路由缺陷** | 节点高度已在 §2.13 修正（与官方完全一致），但像素 diff 9.396→11.085：节点高度一变，15 条连线的路由跟着变，暴露出此前被掩盖的路由问题。用 `part_dump.cjs connectionBoxNode` 对比每条 link 的 `points`（官方 vs 我们），重点看带端口的 `fromPort`/`toPort` 求交 |
| 5 | ~~`getDocumentBounds()` 对子图元多加一份偏移~~ | ✅ **已完成 → §2.14**。规则：`db = 自身 ab + Σ(父 panel 的 ab 原点)`，任何一层都不加 margin。`basic` 已与官方逐字段一致 |
| 6 | ~~箭头绘制尺寸口径 + 单元页整页偏移 3.5px~~ | ✅ **已完成 → §2.15 / §2.16**（`match 0/80 → 17/80`、`dy` 全 0）。**残留**：子形状 actualBounds 仍未摆到路线两端（官方 `[0.5,0,27,27]` / `[272.5,0,27,27]`，我们全在 `[0,0,27,27]`），需在 `_arrangeLink()` 里按 segmentIndex/segmentOffset 定位 |
| 7 | 箭头几何体剩余 47 项 | 去掉多余 `Close`；官方用单条 `Arc` 的别用贝塞尔近似；`Backward*` 家族子几何 bounds 水平镜像（`BackwardSemiCircle` 官方 `b=[0,0,4,8]`、我们 `b=[4,0,0,8]`） |
| 8 | 报错样例 | `canvases`(`null.appendChild`)、`controlGauges`(`null.bounds`)、`addRemoveColumns`(`null.data`)、`distances`(`standardMouseSelect`)、`incrementalTree`(`isTreeLeaf` 只读)、`icons`(`undefined.get`) |
| 9 | 样例代码一致性 68 项 | 先批量：`setDataProperty` 统一、`SaveButton`/`Modified` 块；再处理 61 个 cluster 里的大项 |
| 10 | `LayeredDigraphLayout` | 官方是 network-simplex 分层 + 排序 + 打包；本项目是最长路径分层。`beatPaths` 剩余差异主因，工作量大 |
| 11 | 8 个拿不到官方源码的样例 | `cLayout` / `doubleTree` / `fdLayout` / `gLayout` / `ldLayout` / `tLayout` / `radial`（chunk 里无 `jsCode`）/ `dimensioning`（页面 404） |
| 12 | A/B harness 加载 extensions | 消除 `Inspector`/`ParallelLayout` 等 6 个扩展带来的噪声 |
| 13 | 官方 `H2` 在「预留后视口 vs 原始 viewSize」上的窄带分歧 | `align_probe.cjs` 对 `viewH ∈ [3400,4000]` 扫出的官方 `position.y`：`≤3530` 恒为 4、`3531–3540` 每 +1 降 1、`≥3550` 走 `4+1756.5−viewH/2`。**拟合公式** `y = max(clamp(3534−H, ·, 4), 1760.5−H/2)` 与 21 个实测点全吻合，但 `3534−H` 里的 3534 依赖具体 `documentBounds`（= `doc.bottom + 17`），**17 这个常数的来历未定**。当前实现（统一用预留后的 `viewportBounds`）在该窄带最多差 5.5px，窄带之外全对 |
| 14 | `alignDocument` 官方源码与实测冲突 | 官方 `alignDocument` 源码写的是 `this.viewportBounds`，但照抄会让 `animatedFocus` 92.7→97.3、`grouping` 2.43→4.34。官方 `zoomToFit` 在 `alignDocument` 之后**还会再跑一次 `H2(documentBounds, Pt/scale, St/scale, cf, false)`**，我们缺这一步。要么补上那次 `H2`，要么保持现状（`viewSize` 口径，实测更好）。`_applyInitialViewport` 的 spot 对齐**已确认该用原始 `viewSize`**（`orgChartStatic` 实证，见 §2.16）。⚠️ 本条的 A/B 读数取自 `animatedFocus`/`grouping` 两个**重灾样例**，证据强度低，动手前先在恒定样例（`basic`/`comments`/`arrowheads`）上重测 |
| 15 | **`spreadsheet` 抛 `Invalid arguments to Rect constructor: 4, 4, -8, 12`** | 全量扫描发现的**唯一疑似库内真 bug**（其余 11 个 ours-only 报错都是样例自身 null 或 harness 超时）。负宽 Rect 说明某处减法把宽算成负数，且未做 `Rect` 的防御归一。用 `node temp/survey/ab_render.cjs --all spreadsheet` 复现，再在 `Rect` 构造器断点抓调用栈 |

## 7. 注意事项

- **不要跑 `vitest`**（Agent.md 明令，会卡死无结果）。用 `npm run typecheck && npm run build && npm run test:cdp`。
- 临时文件放 `temp/`，别放 C 盘。
- 每修一项都跑一遍 `ab_render.cjs`，**指标变差就回退**（已有 10 次这样的回退/纠正记录，都写在 §5.3）。
- **读数分档**（详见 §4 的「波动分档」表）：`basic`/`comments`/`arrowheads`/`orgChartStatic`/
  `connectionBoxNode` **3 次复跑逐位相同**，可用单次读数；`conceptMap`/`doubleCircle`/`friendWheel`/
  `contentAlign` 中度波动；**`animatedFocus`/`grouping`/`ruleredDiagram`/`dragUnoccupied` 是重灾区，
  单次读数无效**，历史上据此得出的几条「改善/回退」结论已作废。
- 改动**全部未提交**（`git status` 有 223 个文件），提交前请确认要不要挑着提。
