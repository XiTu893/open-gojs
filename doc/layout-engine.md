# open-gojs 布局引擎设计文档

本文档记录 open-gojs 布局引擎的设计思路，以及从官方 GoJS 逆向学到的渲染布局逻辑，
包括坐标系、面板（Panel）布局、停靠（Spot/Alignment）、分组（Group）、自适应等内容。
供后续开发、维护 open-gojs 时参考。

## 1. 整体布局流程（Layout Pass）

官方 GoJS 的布局是**迭代收敛**的，分阶段进行：

1. **测量（Measure）**：对每个 Part 调用 `measure`，计算其 `naturalBounds` / `measuredBounds`。
2. **布局（Layout）**：Diagram 布局（默认 GridLayout）定位所有顶层 Node 和 Group；
   每个 Group 又有自己的 GroupLayout 定位其成员。
3. **排列（Arrange）**：对每个 Part 调用 `arrange`，将 `measuredBounds` 转化为 `actualBounds`
   （在父面板坐标系中的位置和大小）。
4. **失效重排（Invalidation）**：当节点增删、尺寸变化、可见性变化等触发布局失效时，
   会在事务末尾重新执行布局，直到收敛。

open-gojs 的 `Diagram._updateGeometry()` 是简化的一次性版本，但遵循同样的顺序。
关键点：**Group 的尺寸依赖其成员（通过 Placeholder），而成员位置又依赖 Group 的布局，
两者循环依赖，必须通过"先布置成员 → 重新测量 Group → 再网格定位 → 再布置成员"来收敛。**

## 2. 坐标系

### 2.1 Part.location 与 locationSpot

- `Part.location` 是一个锚点，`locationSpot` 决定 location 与 Part 边界的相对位置。
- 对普通 Node：location 通常是 Node 的中心（`locationSpot = Spot.Center`）。
- 对 Group：官方 GoJS 中，Group 的 location 常位于**成员区域（Placeholder）的左上角**，
  header（标题）向上延伸（局部坐标为负）。这与 Node 模型不同。
- `GraphObject.naturalBounds`：局部坐标，位置恒为 (0,0)。
- `GraphObject.measuredBounds`：考虑 angle/scale/strokeWidth 后的尺寸，位置受 strokeWidth 影响。
- `GraphObject.actualBounds`：在父面板坐标系中的最终位置和大小。

### 2.2 文档坐标 vs 面板坐标

- 每个 Panel 建立自己的坐标系。子元素的位置相对于父面板原点。
- Part 是顶级面板，其 actualBounds 在文档坐标系中。
- 渲染时，CanvasRenderer 会 `translate` 到每个对象的文档位置再绘制。

## 3. 面板（Panel）布局

Panel 有多种类型，各有不同布局算法：

### 3.1 Auto 面板（Panel.Auto）

- 用于"边框包内容"，例如 Node 的圆角矩形 + 文字。
- 有一个 **main 元素**（`isPanelMain` 或第一个元素，通常是 Shape 背景），
  其余为 others（内容）。
- 算法：测量 others 得到内容尺寸，让 main 元素**略大于内容**（含 margin 和 stroke）。
- others 元素**默认居中**（alignment = Spot.Center）。
- **注意**：others 的定位要**计入 margin**（GoJS 文档："The alignment value... if smaller than available space, alignment controls where placed"，margin 影响可用区域）。
- Shape 作为 main 时，其 actualBounds 填满面板内区（含 stroke 扩展）。

### 3.2 Vertical / Horizontal 面板

- Vertical：元素自上而下堆叠，每行高度 = 元素高度 + margin。
- 面板宽度 = 最宽元素宽度。
- **默认 alignment 是 Spot.Center**（GoJS 文档明确："the default alignment would normally be Spot.Center"）。
  因此较窄的元素在 Vertical 面板中**水平居中**；较矮的元素在 Horizontal 面板中**垂直居中**。
- 若元素宽度等于面板宽度，则居中无效果（对齐被忽略）。
- `defaultStretch` / `defaultAlignment` 可统一设置所有元素的默认值。

### 3.3 Spot 面板（Panel.Spot）

- 类似 Auto，有 main 元素和 others。
- others 按 `GraphObject.alignment` 定位在 main 周围，可超出 main 边界。
- 默认 alignment 也是 Spot.Center。

### 3.4 Table / Position / Grid / Viewbox 等

- Table：行列布局。
- Position：按 `GraphObject.position` 定位，且**总是包含 (0,0) 原点**。
- Viewbox：缩放单一元素适配面板。
- Grid：网格模式。

### 3.5 padding 与 margin 的区别

- `Panel.padding`：面板内边距，会缩小可用区域。
- `GraphObject.margin`：元素外边距，会让面板扩张（不缩小可用区域）。
- 背景色覆盖 padding 区域，不覆盖 margin 区域。

## 4. 停靠（Spot 与 Alignment）

- `Spot` 提供相对 + 绝对定位：`Spot.x/y` 是 0-1 的分数距离，`offsetX/offsetY` 是绝对偏移。
- 常用常量：TopLeft(0,0), Top(0.5,0), Center(0.5,0.5), BottomRight(1,1) 等。
- `GraphObject.alignment` 决定元素在其可用区域内停放的位置。
- `alignmentFocus` 决定元素自身哪个点被对齐（默认 Center）。
- **默认 alignment 规则**：Auto/Spot/Vertical/Horizontal 面板默认 Spot.Center。

## 5. 分组（Group）

### 5.1 Group 模板结构

典型 group 模板是一个 Vertical 面板：
```
Group (Vertical)
  ├─ TextBlock (标题 / header)
  └─ Panel (Auto)  -- name: "PANEL"
       ├─ Shape (背景形状, main)
       └─ Placeholder (成员区域, others, margin 通常 10)
```

### 5.2 Placeholder（占位符）

- Placeholder 是 Group 成员区域的占位，**尺寸 = 所有成员实际边界的并集 + padding**。
- 成员是 Group 的 memberParts，**不属于** Group 的视觉树（Panel.elements），
  而是通过 Placeholder 反映在布局中。
- Placeholder 在 Auto 面板中作为 others 被**居中**。
- 成员从 Placeholder 的**左上角**开始排列（水平方向）。

### 5.3 Group 成员布局（GroupLayout）

- 每个 Group 默认有一个 Layout（GroupLayout），负责定位其成员。
- 成员布局在 Group 的**成员区域（Placeholder 下方）**进行。
- 成员起点 = header 底部 + Placeholder margin + Shape stroke。
- 成员间水平排列，超出 `groupInnerWidth` 换行。
- open-gojs 的 `_computeGroupMemberOrigin`：计算成员区左上角
  `(insetX, headerHeight + insetY)`，其中 `inset = placeholder.margin + shape.strokeWidth`。
  该值**只依赖 header 高度与边距，不依赖成员位置**，避免循环依赖。

### 5.4 Group 尺寸自适应

- Group 的高度 = header 高度 + PANEL 高度。
- PANEL 高度 = Placeholder 尺寸 + 2×inset（margin + stroke）。
- 当成员移动/增删时，Placeholder 尺寸变化，Group 自动膨胀或收缩。

## 6. 自适应（Stretch 与 Auto 尺寸）

- `desiredSize`（=width/height）若为实数，则优先于 stretch。
- `minSize` / `maxSize` 约束尺寸，min 优先于 max。
- `stretch` 在无 desiredSize 时生效：Fill/Horizontal/Vertical/Uniform 等。
- Auto 面板的 main 元素会被拉伸到面板尺寸；others 保持自然尺寸。
- TextBlock 高度计算：官方 GoJS 用 `measureText('M').width * 1.3` 作为行高，
  不依赖浏览器 measureText 的 ascent/descent（后者在 'M' 无 descender 时 descent=0，
  会导致文字底部被裁剪）。open-gojs 已按此算法实现。

## 7. Shape 与 stroke

- Shape 的几何由 figure 生成（如 RoundedRectangle）。
- **figure 几何必须用 Shape 的实际尺寸生成**，否则在 renderShape 中非均匀 scale
  （scaleX ≠ scaleY）会导致 stroke 变形（如宽扁形状左右边框粗、上下边框细）。
- open-gojs 的 renderShape 对 figure 几何按 `shape.actualBounds` 重新生成，避免非均匀 scale。

## 8. 常见布局算法（GoJS 内置）

| 布局 | 用途 | 关键属性 |
|------|------|----------|
| GridLayout | 网格排列（默认） | spacing, cellSize, wrappingColumn, wrappingWidth, arrangement |
| TreeLayout | 树形分层 | angle, layerSpacing, nodeSpacing |
| ForceDirectedLayout | 力导向 | charges, forces, network 物理模拟 |
| LayeredDigraphLayout | 有向图分层 | direction, layerSpacing |
| CircularLayout | 环形 | radius, spacing, arrangement |

### GridLayout 要点

- **uniform cell size** = (最大 Part 宽度 + spacing.width, 最大 Part 高度 + spacing.height)。
- 元素按顺序从左到右排列，一行放不下则换行，行间距 = spacing.height。
- 默认 `spacing = (10,10)`，`wrappingColumn = NaN`（不限制列数），
  `wrappingWidth = NaN`（用 viewport 宽度）。
- 因此，**包含高 group 的图，行间距会比纯节点图大**（uniform cell 基于最高元素）。
  这是正常行为，不是 bug。

## 9. 已知的 open-gojs 布局细节

### 9.1 成员区起点计算

成员区左上角（相对 group 文档原点）：
```
insetX = placeholder.margin.left + PANEL 中 Shape 的 strokeWidth
insetY = placeholder.margin.top  + PANEL 中 Shape 的 strokeWidth
起点   = (groupX + insetX, groupY + headerHeight + insetY)
```
`headerHeight` = group 第一个元素（标题 TextBlock）的 measuredBounds.height。

### 9.2 网格布局中的 Group 处理

- 先为每个 Group 布置成员并重新测量，得到真实高度（含成员）。
- 网格布局用真实高度计算 cellSize。
- 再以最终位置重新布置成员。
- **注意**：不能给 Group 设临时位置后跳过网格定位，否则会与节点重叠。

## 10. 调试与验证

- `tests/rendering/group-border-diagnose.test.ts`：诊断 group 内部布局（标题、placeholder、成员对齐）。
- `scripts/cdp-render.cjs`：在真实 Chrome 中对比 open-gojs 与官方 gojs 的渲染结果
  （节点位置、group 内部坐标）。
- 对比指标：group/panel/placeholder/title 的局部坐标、TextBlock 高度、Shape 边框粗细。

## 11. 后续优化方向

- 将 `_updateGeometry` 改造成真正的迭代布局（多遍直到收敛），以支持嵌套 group 和动态尺寸变化。
- 支持用户自定义 Group.layout（GridLayout/TreeLayout 等）。
- 完善 `locationSpot` 模型，使 Group 的 location 与官方一致（成员区左上角）。
- 加入 Layout.invalidation 机制（isOngoing/isInitial）减少不必要的布局重算。