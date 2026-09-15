# CDRI Datahub ECharts Theme Builder

A professional, modular visual theme designer and chart explorer for [Apache ECharts](https://echarts.apache.org/), tailored for the CDRI Datahub platform.

Built with a modern Vite + ES Modules architecture (no heavy frontend framework dependencies), this tool allows developers, analysts, and designers to create, preview, test for accessibility, and export publication-ready ECharts themes.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Development
```bash
# 1. Install dependencies
npm install

# 2. Start the local Vite development server
npm run dev

# App runs at: http://localhost:3000
```

### Production Build
```bash
# Build optimized static assets to dist/
npm run build

# Preview production build locally
npm run preview
```

The output in `dist/` is completely static and can be deployed directly to Cloudflare Pages, Netlify, Vercel, AWS S3, or Nginx.

---

## 🌟 Key Features

### 1. 21 Chart Types Supported
- **Trends & Comparisons**: Line Chart, Smooth Area, Step Line, Standard Bar, Stacked Bar, Horizontal Bar, Waterfall
- **Distributions & Compositions**: Donut / Ring, Rose Chart (Nightingale), Scatter Plot, Bubble Chart, Candlestick (OHLC), Heatmap
- **Flow & Multidimensional**: Radar Chart, Treemap, Sunburst, Sankey Diagram, Funnel Chart
- **Metrics & Geospatial**: Gauge Metric, Multi-Gauge KPI, World / Regional Choropleth Map

### 2. Dual-View Workspace
- **Dashboard Grid**: Live 9-chart bento dashboard rendering simultaneous charts (Line, Stacked Bar, Donut, Scatter, Heatmap, Radar, Treemap, Funnel, Gauge) updating synchronously as you tweak theme tokens.
- **Focus Chart Gallery**: Single-chart deep-dive mode for inspecting any of the 21 chart types at high resolution with interactive `dataZoom` sliders, tooltips, and legends.

### 3. Built-in Preset Themes
- **CDRI Light**: Clean, high-contrast palette tailored for institutional reports and daylight dashboards.
- **CDRI Dark**: Deep slate-blue dark theme with luminescent jewel tones for operations command centers.
- **Classic Themes**: Vintage, Macarons, Shine, Infographic, Roma, and Cyber Dark.

### 4. Accessibility & Inclusive Design (WCAG 2.1 AA)
- **Live Contrast Auditor**: Evaluates palette colors against chart background and text colors using the WCAG 2.1 relative luminance algorithm.
- **CVD (Color Vision Deficiency) Simulator**: Test your charts in real-time under Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Achromatopsia (monochrome).

### 5. Custom Data Upload
- Upload your own **CSV** or **JSON** dataset.
- Automatic column type detection (Categorical vs Numerical).
- Real-time mapping of dataset values directly into active charts.

### 6. Official Apache ECharts Compatible Export & Import
- **Export Formats**:
  - **Theme Builder JSON**: 100% compatible with the official Apache ECharts Theme Builder format.
  - **Native ECharts JSON**: Direct options object ready for `echarts.registerTheme('custom', json)`.
  - **ESM / UMD JavaScript**: Production-ready code modules with register boilerplate.
- **Import**: Drag or paste any JSON exported from this tool or the official Apache ECharts theme builder.

---

## 📁 Project Architecture

The project is structured into cleanly separated ES modules:

```text
EchartThemeBuilder/
├── index.html               # Clean HTML5 application shell
├── package.json             # Scripts & dependencies (echarts, vite)
├── vite.config.js           # Vite config with manual chunking
├── src/
│   ├── main.js              # Master orchestrator (state, UI event bindings)
│   ├── styles/
│   │   ├── main.css         # Master CSS bundle
│   │   ├── variables.css    # Color tokens, spacing, typography
│   │   ├── layout.css       # App layout, grid, sidebar, topbar
│   │   └── components.css   # Modals, swatches, badges, controls
│   ├── presets/
│   │   ├── cdri.js          # CDRI Light & Dark presets
│   │   ├── classic.js       # Vintage, Macarons, Shine, Roma, etc.
│   │   └── index.js         # Preset registry & palette generators
│   ├── data/
│   │   ├── sample-data.js   # Sector indicators & randomizer
│   │   └── parser.js        # RFC CSV / JSON parser & field inferrer
│   ├── charts/
│   │   ├── line-area.js     # Line, Area, Step chart option builders
│   │   ├── bar.js           # Standard, Stacked, Horizontal, Waterfall
│   │   ├── pie-funnel.js    # Donut, Rose, Funnel builders
│   │   ├── distribution.js  # Scatter, Bubble, Candlestick, Heatmap
│   │   ├── flow-geo.js      # Radar, Treemap, Sunburst, Sankey, Map
│   │   ├── kpi.js           # Gauge & Multi-Gauge KPI cards
│   │   └── index.js         # Unified chart router (21 types)
│   ├── theme/
│   │   ├── builder.js       # ECharts theme object constructor
│   │   ├── schema.js        # Apache Theme Builder JSON serializer/parser
│   │   └── exporter.js      # File downloader & clipboard exporter
│   └── utils/
│       └── accessibility.js # WCAG contrast calculator & CVD filters
└── dist/                    # Production bundle (generated via npm run build)
```

---

## 💻 How to Use Exported Themes in Datahub

### Option 1: Using ESM in Vite / Next.js / Nuxt
```javascript
import * as echarts from 'echarts';
import cdriTheme from './cdri-datahub-theme.json';

// Register theme
echarts.registerTheme('cdriTheme', cdriTheme);

// Initialize chart with registered theme
const chart = echarts.init(document.getElementById('my-chart'), 'cdriTheme');
chart.setOption({
  xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: { type: 'value' },
  series: [{ data: [120, 200, 150, 80, 70], type: 'bar' }]
});
```

### Option 2: Using Vanilla HTML / CDN
```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<script src="./cdri-datahub-theme.js"></script>
<script>
  // Theme is auto-registered as 'cdriTheme' by the exported script!
  const chart = echarts.init(document.getElementById('chart'), 'cdriTheme');
  chart.setOption({ ... });
</script>
```

---

## 📄 License
Internal asset for the CDRI Datahub platform.
