# Open-GoJS

An open-source TypeScript implementation of the [GoJS](https://gojs.net/) diagramming library. Open-GoJS provides interactive diagramming capabilities for building visual applications — flowcharts, org charts, mind maps, network diagrams, and more — entirely in the browser using HTML5 Canvas.

## Features

### Core Architecture
- **Canvas-based rendering** — High-performance rendering via HTML5 Canvas
- **Model-View architecture** — Separation of data (Model) and visualization (Diagram/Part)
- **Data binding** — Declarative binding between model data and visual properties, supporting one-way and two-way bindings
- **Transaction system** — Full undo/redo support with nested transactions and `ChangedEvent.Transaction` lifecycle events

### Visual Objects
- **GraphObject hierarchy** — `GraphObject` → `Panel` → `Shape`, `TextBlock`, `Picture`
- **Panel layouts** — Auto (vertical/horizontal), Spot, Table, Grid, Position, Link, Viewbox, Graduated
- **Table Panel** — Two-round measurement with `SizingNone`, `SizingAuto`, `SizingProp`; row/column separators
- **Grid Panel** — Multi-layer grid lines with configurable `interval`, stroke, and fill for bar patterns
- **30+ built-in Figures** — Rectangle, Ellipse, Diamond, Triangle, RoundedRectangle, etc.

### Interactive Tools
- **ToolManager** — Complete tool lifecycle: `doActivate` → `doMouseMove` → `doMouseUp` → `doDeactivate`
- **ClickSelectingTool** — Click-to-select with selection adornments
- **DraggingTool** — Drag-to-move with Ctrl+drag copy support
- **DragSelectingTool** — Rubber-band selection with visual feedback
- **LinkingTool / RelinkingTool** — Create and reconnect links with temporary link preview
- **ResizingTool / RotatingTool** — Resize handles and rotation adornments
- **LinkReshapingTool** — Drag link segments to reshape
- **PanningTool** — Click-drag panning
- **TextEditingTool** — In-place text editing
- **ClickCreatingTool** — Double-click to create nodes

### Layout Algorithms
- **GridLayout** — Arranges nodes in a grid pattern
- **TreeLayout** — Hierarchical tree layout with multiple styles (Layered, Alternating, LastParents, Compact, RootOnly)
- **ForceDirectedLayout** — Physics-based spring layout
- **LayeredDigraphLayout** — Sugiyama-style layered digraph layout
- **CircularLayout** — Arranges nodes in a circle or arc
- **Auto layout invalidation** — Layouts automatically re-run when the diagram changes

### Model & Data
- **Model** — Base model with `nodeDataArray`, key management, and data property change notifications
- **GraphLinksModel** — Full graph model with separate `linkDataArray`, port identifiers, and link key support
- **TreeModel** — Tree-structured model using parent-key references
- **JSON serialization** — `toJson()` / `fromJson()` for all model types

### Diagram Features
- **Viewport control** — Position, scale, zoom-to-fit, center-rect, scroll-to-rect
- **Layer system** — Background, Grid, Default, Foreground, Adornment, Tool layers
- **Diagram.grid** — Configurable background grid panel
- **Selection** — Multi-select with max count, selection adornments
- **Keyboard shortcuts** — Delete, Ctrl+Z/Y, Ctrl+C/V, arrow keys
- **Touch support** — Touch events for mobile interaction
- **Overview** — Minimap overview control
- **Palette** — Drag-out palette for stencil-style node creation

## Installation

```bash
npm install
```

## Building

```bash
npm run build
```

This produces three output formats in `dist/`:
- `open-gojs.umd.js` — UMD bundle (browser `<script>` tag)
- `open-gojs.esm.js` — ES Module bundle
- `open-gojs.cjs.js` — CommonJS bundle
- `index.d.ts` — TypeScript type declarations

## Quick Start

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

## Project Structure

```
src/
├── core/           # Core types: Point, Rect, Size, Spot, Margin, List, Map, Set, Brush, Geometry
├── model/          # Data layer: Model, GraphLinksModel, TreeModel, ChangedEvent, Transaction, UndoManager, Binding
├── view/           # Visual objects: GraphObject, Panel, Shape, TextBlock, Picture, Part, Node, Link, Group, Adornment, Placeholder, Layer, RowColumnDefinition
├── diagram/        # Diagram controller: Diagram, Overview, Palette, InputEvent, DiagramEvent, ThemeManager
├── tool/           # Interactive tools: ToolManager, DraggingTool, LinkingTool, ResizingTool, etc.
├── layout/         # Layout algorithms: GridLayout, TreeLayout, ForceDirectedLayout, LayeredDigraphLayout, CircularLayout
├── render/         # Canvas renderer: CanvasRenderer
├── figures/        # Built-in figure definitions
├── animation/      # Animation system: AnimationManager, Animation, AnimationTrigger
├── command/        # Command handling: CommandHandler
└── index.ts        # Public API exports
```

## API Compatibility

Open-GoJS follows the GoJS API design with these key public classes:

| Category | Classes |
|----------|---------|
| Core | `Point`, `Size`, `Rect`, `Spot`, `Margin`, `List`, `Map`, `Set`, `Brush`, `Geometry` |
| Model | `Model`, `GraphLinksModel`, `TreeModel`, `ChangedEvent`, `Transaction`, `UndoManager`, `Binding` |
| View | `GraphObject`, `Panel`, `Shape`, `TextBlock`, `Picture`, `Part`, `Node`, `Link`, `Group`, `Adornment`, `Placeholder`, `Layer` |
| Diagram | `Diagram`, `Overview`, `Palette`, `InputEvent`, `DiagramEvent` |
| Tool | `Tool`, `ToolManager`, `DraggingTool`, `LinkingTool`, `RelinkingTool`, `ResizingTool`, `RotatingTool`, etc. |
| Layout | `Layout`, `GridLayout`, `TreeLayout`, `ForceDirectedLayout`, `LayeredDigraphLayout`, `CircularLayout` |

Refer to the [GoJS API documentation](https://gojs.net/latest/api/) for detailed API reference.

## Development

```bash
# Type checking
npx tsc --noEmit

# Build
npm run build

# Run tests
npm test

# Start dev server with examples
npm start
```

## Current Status

Open-GoJS is under active development. Core diagramming features are functional. See the `examples/` directory for working demos.

### Completed
- Canvas rendering pipeline
- Model-View-Controller architecture
- Data binding (one-way and two-way)
- All major panel types (Auto, Spot, Table, Grid, Position, Link)
- Interactive tools (drag, link, resize, rotate, select, pan, text edit)
- Layout algorithms (Grid, Tree, ForceDirected, LayeredDigraph, Circular)
- Transaction system with undo/redo and nested transactions
- ChangedEvent.Transaction lifecycle events
- Grid panel with configurable multi-layer lines
- Table panel with SizingAuto/SizingProp and separators
- 30+ built-in figures

### In Progress
- Graduated panel layout and rendering
- More figure definitions (100+ in GoJS)
- AvoidsNodes routing
- JumpOver/JumpGap link rendering
- Animation system integration
- Overview drag-to-pan
- Palette drag-out

## License

MIT

## Support the Project

If you find Open-GoJS useful, consider supporting its development:

<div align="center">
  <img src="QrReward.jpg" alt="Donate" width="200" />
</div>
