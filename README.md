# Open-GoJS

[GoJS](https://gojs.net/) 图表库的开源 TypeScript 实现。Open-GoJS 提供交互式图表功能，用于构建可视化应用——流程图、组织架构图、思维导图、网络拓扑图等——完全基于 HTML5 Canvas 在浏览器中运行。

## 特性

### 核心架构
- **Canvas 渲染** — 基于 HTML5 Canvas 的高性能渲染
- **模型-视图架构** — 数据层（Model）与可视化层（Diagram/Part）分离
- **数据绑定** — 模型数据与视觉属性之间的声明式绑定，支持单向和双向绑定
- **事务系统** — 完整的撤销/重做支持，支持嵌套事务和 `ChangedEvent.Transaction` 生命周期事件

### 视觉对象
- **GraphObject 层次结构** — `GraphObject` → `Panel` → `Shape`、`TextBlock`、`Picture`
- **Panel 布局** — Auto（垂直/水平）、Spot、Table、Grid、Position、Link、Viewbox、Graduated
- **Table Panel** — 两轮测量，支持 `SizingNone`、`SizingAuto`、`SizingProp`；行列分隔符
- **Grid Panel** — 多层网格线，可配置 `interval`、stroke、fill 实现条形图案
- **67+ 内置图形** — Rectangle、Ellipse、Diamond、Triangle、RoundedRectangle 等

### 交互工具
- **ToolManager** — 完整的工具生命周期：`doActivate` → `doMouseMove` → `doMouseUp` → `doDeactivate`
- **ClickSelectingTool** — 点击选择，支持选中装饰
- **DraggingTool** — 拖拽移动，支持 Ctrl+拖拽复制
- **DragSelectingTool** — 框选，带视觉反馈
- **LinkingTool / RelinkingTool** — 创建和重连连线，带临时连线预览
- **ResizingTool / RotatingTool** — 缩放手柄和旋转装饰
- **LinkReshapingTool** — 拖拽连线段重塑形状
- **PanningTool** — 点击拖拽平移
- **TextEditingTool** — 原地文本编辑
- **ClickCreatingTool** — 双击创建节点

### 布局算法
- **GridLayout** — 网格排列
- **TreeLayout** — 层次树布局，支持多种风格（Layered、Alternating、LastParents、Compact、RootOnly）
- **ForceDirectedLayout** — 基于物理的弹簧布局
- **LayeredDigraphLayout** — Sugiyama 风格分层有向图布局
- **CircularLayout** — 圆形/弧形排列
- **自动布局失效** — 图表变化时布局自动重新运行

### 模型与数据
- **Model** — 基础模型，支持 `nodeDataArray`、键管理和数据属性变更通知
- **GraphLinksModel** — 完整图模型，支持独立 `linkDataArray`、端口标识和连线键
- **TreeModel** — 树结构模型，使用父键引用
- **JSON 序列化** — 所有模型类型均支持 `toJson()` / `fromJson()`

### 图表功能
- **视口控制** — 位置、缩放、自适应、居中矩形、滚动到矩形
- **图层系统** — Background、Grid、Default、Foreground、Adornment、Tool 图层
- **Diagram.grid** — 可配置的背景网格面板
- **选择** — 多选，支持最大数量限制和选中装饰
- **键盘快捷键** — Delete、Ctrl+Z/Y、Ctrl+C/V、方向键
- **触摸支持** — 移动端触摸事件
- **Overview** — 缩略图概览控件
- **Palette** — 拖出式调色板，用于模板式节点创建

### 连线高级功能
- **正交路由** — 基于端口方向的多段正交路径，支持圆角
- **JumpOver/JumpGap** — 连线交叉处的跨越弧和间隙渲染
- **20 种箭头** — Standard、Triangle、Backward、Circle、Diamond 等
- **连线重塑** — 拖拽连线段调整路径

### 动画系统
- **AnimationManager** — 统一管理动画生命周期和帧循环
- **Animation** — 支持数值、Point、Rect 等类型的属性插值
- **缓动函数** — EaseLinear、EaseInOut、EaseIn、EaseOut
- **defaultAnimation** — 默认动画实例，用于自动布局动画

## 安装

```bash
npm install
```

## 构建

```bash
npm run build
```

在 `dist/` 目录下生成三种输出格式：
- `open-gojs.umd.js` — UMD 包（浏览器 `<script>` 标签）
- `open-gojs.esm.js` — ES Module 包
- `open-gojs.cjs.js` — CommonJS 包
- `index.d.ts` — TypeScript 类型声明

## 快速开始

```html
<!DOCTYPE html>
<html>
<head>
  <script src="node_modules/open-gojs/dist/open-gojs.umd.js"></script>
</head>
<body>
  <div id="myDiagramDiv" style="width:600px; height:400px; border:1px solid black;"></div>
  <script>
    const $ = go.GraphObject.make;

    const diagram = $(go.Diagram, "myDiagramDiv", {
      "undoManager.isEnabled": true
    });

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        $(go.Shape, "RoundedRectangle", { fill: "white", stroke: "gray" }),
        $(go.TextBlock, { margin: 8 }, new go.Binding("text", "name"))
      );

    diagram.linkTemplate =
      $(go.Link,
        $(go.Shape),
        $(go.Shape, { toArrow: "Standard" })
      );

    diagram.model = new go.GraphLinksModel(
      [{ key: 1, name: "Alpha" }, { key: 2, name: "Beta" }],
      [{ from: 1, to: 2 }]
    );
  </script>
</body>
</html>
```

## 项目结构

```
src/
├── core/           # 核心类型：Point、Rect、Size、Spot、Margin、List、Map、Set、Brush、Geometry
├── model/          # 数据层：Model、GraphLinksModel、TreeModel、ChangedEvent、Transaction、UndoManager、Binding
├── view/           # 视觉对象：GraphObject、Panel、Shape、TextBlock、Picture、Part、Node、Link、Group、Adornment、Placeholder、Layer
├── diagram/        # 图表控制器：Diagram、Overview、Palette、InputEvent、DiagramEvent、ThemeManager
├── tool/           # 交互工具：ToolManager、DraggingTool、LinkingTool、ResizingTool 等
├── layout/         # 布局算法：GridLayout、TreeLayout、ForceDirectedLayout、LayeredDigraphLayout、CircularLayout
├── render/         # Canvas 渲染器：CanvasRenderer
├── figures/        # 内置图形定义
├── animation/      # 动画系统：AnimationManager、Animation、AnimationTrigger
├── command/        # 命令处理：CommandHandler
└── index.ts        # 公共 API 导出
```

## API 兼容性

Open-GoJS 遵循 GoJS API 设计，主要公共类如下：

| 分类 | 类 |
|------|------|
| 核心 | `Point`、`Size`、`Rect`、`Spot`、`Margin`、`List`、`Map`、`Set`、`Brush`、`Geometry` |
| 模型 | `Model`、`GraphLinksModel`、`TreeModel`、`ChangedEvent`、`Transaction`、`UndoManager`、`Binding` |
| 视图 | `GraphObject`、`Panel`、`Shape`、`TextBlock`、`Picture`、`Part`、`Node`、`Link`、`Group`、`Adornment`、`Placeholder`、`Layer` |
| 图表 | `Diagram`、`Overview`、`Palette`、`InputEvent`、`DiagramEvent` |
| 工具 | `Tool`、`ToolManager`、`DraggingTool`、`LinkingTool`、`RelinkingTool`、`ResizingTool`、`RotatingTool` 等 |
| 布局 | `Layout`、`GridLayout`、`TreeLayout`、`ForceDirectedLayout`、`LayeredDigraphLayout`、`CircularLayout` |

详细 API 参考请查阅 [GoJS API 文档](https://gojs.net/latest/api/)。

## 开发

```bash
# 类型检查
npx tsc --noEmit

# 构建
npm run build

# 运行测试
npm test

# 启动开发服务器和示例
npm start
```

## 当前状态

Open-GoJS 正在积极开发中。核心图表功能已可用。请查看 `examples/` 目录获取可运行的示例。

### 已完成
- Canvas 渲染管线
- 模型-视图-控制器架构
- 数据绑定（单向和双向）
- 所有主要面板类型（Auto、Spot、Table、Grid、Position、Link、Graduated）
- 交互工具（拖拽、连线、缩放、旋转、选择、平移、文本编辑）
- 布局算法（Grid、Tree、ForceDirected、LayeredDigraph、Circular）
- 事务系统，支持撤销/重做和嵌套事务
- ChangedEvent.Transaction 生命周期事件
- Grid 面板，可配置多层线条
- Table 面板，支持 SizingAuto/SizingProp 和分隔符
- 67+ 内置图形
- 正交路由，支持端口方向感知和圆角
- JumpOver/JumpGap 连线交叉渲染
- 20 种箭头类型
- Group/Placeholder 分组功能
- SubGraphExpanderButton 展开/折叠
- 动画系统集成（AnimationManager + Animation）
- 7 种 DiagramEvent（SelectionDeleted、ClipboardChanged、PartResized 等）

### 进行中
- AvoidsNodes 路由
- 更多图形定义（GoJS 有 100+）
- Overview 拖拽平移
- Palette 拖出

## 许可证

MIT

## 支持项目

如果您觉得 Open-GoJS 有用，欢迎支持开发：

<div align="center">
  <img src="QrReward.jpg" alt="捐赠" width="200" />
</div>
