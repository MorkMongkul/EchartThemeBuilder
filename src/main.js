import * as echarts from 'echarts';
import './styles/main.css';

import { PRESETS, QUICK_PALETTES, getPreset } from './presets/index.js';
import {
  SECTORS,
  QUARTERS,
  SAMPLE_BASE,
  cloneDeep,
  jitter,
  worldMapStatus,
  loadWorldMap
} from './data/sample-data.js';
import {
  parseUploadedText,
  computeColTypes,
  autoMapColumns
} from './data/parser.js';
import {
  buildLineOption,
  buildBarOption,
  buildPieOption,
  buildScatterOption,
  buildRadarOption,
  buildHeatmapOption,
  buildCandlestickOption,
  buildGaugeOption,
  buildSankeyOption,
  buildCambodiaChoroplethOption,
  buildMapOption,
  buildTreemapOption,
  buildSunburstOption,
  buildWaterfallOption,
  getFocusChartOption
} from './charts/index.js';
import { buildTheme } from './theme/builder.js';
import { toThemeBuilderJSON, fromThemeBuilderJSON } from './theme/schema.js';
import { downloadFile, copyToClipboard, formatJsSnippet } from './theme/exporter.js';
import { updateWCAGAnalysis, applyCvdFilter } from './utils/accessibility.js';

/* ==================================================================
   1. State Management
   ================================================================== */
const state = {
  ...cloneDeep(PRESETS.cdriLight),
  bgTransparent: false,
  axisLineShow: true,
  splitLineShow: true,
  fontFamily: "Inter, sans-serif",
  viewMode: "dashboard", // "dashboard" | "focus"
  focusChartType: "line",
  dataSource: "sample"    // "sample" | "upload"
};

let workingData = cloneDeep(SAMPLE_BASE);

const uploadState = {
  headers: [],
  rows: [],
  colNumeric: [],
  fileName: "",
  mapping: { category: 0, series: [], x: null, y: null, group: null, size: null, source: null, target: null, value: null }
};

const chartInstances = {
  line: null,
  bar: null,
  pie: null,
  scatter: null,
  radar: null,
  heatmap: null,
  candlestick: null,
  gauge: null,
  sankey: null,
  cambodia: null,
  map: null,
  treemap: null,
  sunburst: null,
  waterfall: null,
  focus: null
};

/* ==================================================================
   2. Chart Rendering Pipeline
   ================================================================== */
function registerCurrentTheme() {
  echarts.registerTheme(state.name, buildTheme(state));
}

function initDashboardCharts() {
  registerCurrentTheme();

  const binds = [
    { key: "cambodia", id: "gridChartCambodia", fn: () => buildCambodiaChoroplethOption(workingData.cambodiaProvinces, state) },
    { key: "map", id: "gridChartMap", fn: () => buildMapOption(workingData.map, worldMapStatus, state) },
    { key: "treemap", id: "gridChartTreemap", fn: () => buildTreemapOption(workingData.treemap, state) },
    { key: "line", id: "gridChartLine", fn: () => buildLineOption(workingData.trend, state) },
    { key: "bar", id: "gridChartBar", fn: () => buildBarOption(workingData.stackedBar, state, true) },
    { key: "pie", id: "gridChartPie", fn: () => buildPieOption(workingData.pie, state, true, false) },
    { key: "sunburst", id: "gridChartSunburst", fn: () => buildSunburstOption(workingData.sunburst, state) },
    { key: "gauge", id: "gridChartGauge", fn: () => buildGaugeOption(workingData.gauge, state) },
    { key: "sankey", id: "gridChartSankey", fn: () => buildSankeyOption(workingData.sankey, state) },
    { key: "heatmap", id: "gridChartHeatmap", fn: () => buildHeatmapOption(workingData.heatmap, SECTORS, QUARTERS, state) },
    { key: "scatter", id: "gridChartScatter", fn: () => buildScatterOption(workingData.bubble, state) },
    { key: "radar", id: "gridChartRadar", fn: () => buildRadarOption(workingData.radar, state) },
    { key: "candlestick", id: "gridChartCandlestick", fn: () => buildCandlestickOption(workingData.candlestick, state) },
    { key: "waterfall", id: "gridChartWaterfall", fn: () => buildWaterfallOption(workingData.waterfall, state) }
  ];

  binds.forEach(b => {
    const el = document.getElementById(b.id);
    if (!el) return;
    if (chartInstances[b.key]) chartInstances[b.key].dispose();
    chartInstances[b.key] = echarts.init(el, state.name);
    chartInstances[b.key].setOption(b.fn());
  });
}

function getMappedUploadDataset(type) {
  const { headers, rows, mapping } = uploadState;
  if (!headers.length || !rows.length) return null;

  if (type === "scatter" || type === "bubble") {
    if (mapping.x == null || mapping.y == null) return null;
    const points = rows.map((r, i) => {
      const x = Number(r[mapping.x]), y = Number(r[mapping.y]);
      const size = mapping.size != null ? Number(r[mapping.size]) : 15;
      if (!isFinite(x) || !isFinite(y)) return null;
      return { name: r[mapping.category] || `Item ${i + 1}`, x, y, size: isFinite(size) ? size : 15 };
    }).filter(Boolean);
    return { points };
  }

  if (type === "sankey") {
    if (mapping.source == null || mapping.target == null || mapping.value == null) return null;
    const nodeNames = [];
    const links = [];
    rows.forEach(r => {
      const source = String(r[mapping.source] || "").trim();
      const target = String(r[mapping.target] || "").trim();
      const value = Number(r[mapping.value]);
      if (!source || !target || source === target || !isFinite(value) || value <= 0) return;
      if (!nodeNames.includes(source)) nodeNames.push(source);
      if (!nodeNames.includes(target)) nodeNames.push(target);
      links.push({ source, target, value });
    });
    return { nodes: nodeNames.map(name => ({ name })), links };
  }

  const catIdx = mapping.category;
  const seriesIdx = mapping.series;
  if (!seriesIdx.length) return null;
  const categories = rows.map(r => String(r[catIdx] || ""));
  const seriesNames = seriesIdx.map(i => headers[i]);
  const seriesData = seriesIdx.map(i => rows.map(r => {
    const v = Number(r[i]);
    return isFinite(v) ? v : 0;
  }));
  return { categories, seriesNames, seriesData };
}

function renderFocusChart() {
  const el = document.getElementById("focusChart");
  if (!el) return;
  registerCurrentTheme();
  if (chartInstances.focus) chartInstances.focus.dispose();
  chartInstances.focus = echarts.init(el, state.name);

  const t = state.focusChartType;
  const customData = state.dataSource === "upload" ? getMappedUploadDataset(t) : null;

  const dataset = {
    trend: (customData && customData.categories) ? customData : workingData.trend,
    stackedBar: (customData && customData.categories) ? customData : workingData.stackedBar,
    pie: (customData && customData.categories) ? customData : workingData.pie,
    bubble: (customData && customData.points) ? customData : workingData.bubble,
    sankey: (customData && customData.nodes) ? customData : workingData.sankey,
    radar: (customData && customData.categories) ? customData : workingData.radar,
    treemap: workingData.treemap,
    sunburst: workingData.sunburst,
    waterfall: workingData.waterfall,
    parallel: workingData.parallel,
    cambodiaProvinces: workingData.cambodiaProvinces,
    cambodiaCapitals: workingData.cambodiaCapitals,
    boxplot: workingData.boxplot,
    heatmap: workingData.heatmap,
    candlestick: workingData.candlestick,
    gauge: workingData.gauge,
    map: workingData.map,
    sectors: SECTORS,
    quarters: QUARTERS
  };

  const opt = getFocusChartOption(t, dataset, worldMapStatus, state);
  chartInstances.focus.setOption(opt);
}

function renderAll() {
  registerCurrentTheme();
  if (state.viewMode === "dashboard") {
    initDashboardCharts();
  } else {
    renderFocusChart();
  }
  updateWCAGAnalysis(state.palette, state.backgroundColor, state.bgTransparent);
  updateModalCodeViewer();
}

function resizeAll() {
  Object.values(chartInstances).forEach(c => { if (c) c.resize(); });
}
window.addEventListener("resize", resizeAll);

/* ==================================================================
   3. View Mode Switching
   ================================================================== */
export function switchViewMode(mode) {
  state.viewMode = mode;
  const isDash = mode === "dashboard";
  document.getElementById("btnModeDashboard").classList.toggle("active", isDash);
  document.getElementById("btnModeFocus").classList.toggle("active", !isDash);
  document.getElementById("dashboardGrid").style.display = isDash ? "grid" : "none";
  document.getElementById("focusView").style.display = isDash ? "none" : "flex";

  if (isDash) {
    document.getElementById("viewHeadingTitle").textContent = "Theme Preview Bento Dashboard";
    document.getElementById("viewHeadingMeta").textContent = "Synchronized live preview across 14 Bento-arranged chart families";
    setTimeout(initDashboardCharts, 50);
  } else {
    document.getElementById("viewHeadingTitle").textContent = "Focused Single Chart Inspection";
    document.getElementById("viewHeadingMeta").textContent = "Deep-dive into individual chart type options";
    setTimeout(renderFocusChart, 50);
  }
}

export function openFocusMode(chartType) {
  state.focusChartType = chartType;
  document.getElementById("focusChartTypeSelect").value = chartType;
  switchViewMode("focus");
}
window.openFocusMode = openFocusMode;
window.switchViewMode = switchViewMode;

/* ==================================================================
   3b. Sidebar Hide / Reveal & Floating HUD Controller
   ================================================================== */
const sidebarState = {
  collapsed: false,
  floating: false
};

function triggerSmoothChartResize() {
  const start = performance.now();
  function loop(now) {
    resizeAll();
    if (now - start < 350) {
      requestAnimationFrame(loop);
    } else {
      resizeAll();
    }
  }
  requestAnimationFrame(loop);
}

function updateSidebarUI() {
  const app = document.getElementById("app");
  if (!app) return;
  app.classList.toggle("sidebar-collapsed", sidebarState.collapsed);
  app.classList.toggle("sidebar-floating", sidebarState.floating);

  // Update topbar button icon
  const topIcon = document.getElementById("sidebarToggleIcon");
  if (topIcon) {
    topIcon.innerHTML = sidebarState.collapsed
      ? '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M11 9l3 3-3 3"/>'
      : '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><path d="M14 9l-3 3 3 3"/>';
  }

  // Update floating button status in sidebar header
  const floatBtn = document.getElementById("btnSidebarFloatToggle");
  if (floatBtn) {
    floatBtn.classList.toggle("active", sidebarState.floating);
    floatBtn.title = sidebarState.floating ? "Switch to Docked Sidebar" : "Switch to Floating Drawer Mode";
  }

  triggerSmoothChartResize();
}

export function toggleSidebar(forceState) {
  sidebarState.collapsed = typeof forceState === "boolean" ? forceState : !sidebarState.collapsed;
  updateSidebarUI();
  if (sidebarState.collapsed) {
    showToast("Controls hidden (Press Ctrl+B to restore)");
  } else {
    showToast("Theme controls revealed");
  }
}

export function toggleFloatingSidebar() {
  sidebarState.floating = !sidebarState.floating;
  if (sidebarState.floating) {
    sidebarState.collapsed = false;
  }
  updateSidebarUI();
  showToast(sidebarState.floating ? "Floating Drawer mode active" : "Docked Sidebar mode active");
}
window.toggleSidebar = toggleSidebar;
window.toggleFloatingSidebar = toggleFloatingSidebar;

/* ==================================================================
   4. Palette Swatches Management
   ================================================================== */
function renderPaletteSwatches() {
  const grid = document.getElementById("paletteGrid");
  if (!grid) return;
  grid.innerHTML = "";
  document.getElementById("paletteCountBadge").textContent = `${state.palette.length} colors`;

  state.palette.forEach((colorHex, idx) => {
    const card = document.createElement("div");
    card.className = "palette-swatch-card";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.value = colorHex;
    colorInput.title = `Color ${idx + 1}`;
    colorInput.addEventListener("input", e => {
      state.palette[idx] = e.target.value;
      hexLabel.textContent = e.target.value;
      renderAll();
    });

    const hexLabel = document.createElement("span");
    hexLabel.className = "palette-swatch-hex";
    hexLabel.textContent = colorHex;

    const delBtn = document.createElement("div");
    delBtn.className = "palette-swatch-del";
    delBtn.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    delBtn.title = "Delete color";
    delBtn.addEventListener("click", () => {
      if (state.palette.length <= 2) {
        showToast("Theme requires at least 2 colors!");
        return;
      }
      state.palette.splice(idx, 1);
      renderPaletteSwatches();
      renderAll();
    });

    const wcagBadge = document.createElement("div");
    wcagBadge.className = "swatch-wcag-badge";
    wcagBadge.innerHTML = '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    card.appendChild(colorInput);
    card.appendChild(hexLabel);
    card.appendChild(delBtn);
    card.appendChild(wcagBadge);
    grid.appendChild(card);
  });

  updateWCAGAnalysis(state.palette, state.backgroundColor, state.bgTransparent);
}

/* ==================================================================
   5. Presets & Controls Sync
   ================================================================== */
function applyPreset(presetKey) {
  const p = getPreset(presetKey);
  if (!p) return;
  Object.assign(state, p);
  syncControlsFromState();
  renderPaletteSwatches();
  renderAll();
  showToast(`Loaded "${p.name}" preset.`);
}

function syncControlsFromState() {
  document.getElementById("themeNameInput").value = state.name;
  document.getElementById("ctrlBgColor").value = state.backgroundColor;
  document.getElementById("ctrlBgColorHex").value = state.backgroundColor;
  document.getElementById("ctrlBgTransparent").checked = state.bgTransparent;
  document.getElementById("ctrlTitleColor").value = state.titleColor;
  document.getElementById("ctrlTitleColorHex").value = state.titleColor;
  document.getElementById("ctrlSubtitleColor").value = state.subtitleColor;
  document.getElementById("ctrlSubtitleColorHex").value = state.subtitleColor;
  document.getElementById("ctrlTextColor").value = state.textColor;
  document.getElementById("ctrlTextColorHex").value = state.textColor;

  document.getElementById("ctrlAxisLineShow").checked = state.axisLineShow;
  document.getElementById("ctrlAxisLineColor").value = state.axisLineColor;
  document.getElementById("ctrlAxisLineColorHex").value = state.axisLineColor;
  document.getElementById("ctrlSplitLineShow").checked = state.splitLineShow;
  document.getElementById("ctrlSplitLineColor").value = state.splitLineColor;
  document.getElementById("ctrlSplitLineColorHex").value = state.splitLineColor;
  document.getElementById("ctrlSplitLineType").value = state.splitLineType;

  document.getElementById("ctrlLineWidth").value = state.lineWidth;
  document.getElementById("valLineWidth").textContent = state.lineWidth + "px";
  document.getElementById("ctrlSymbolSize").value = state.symbolSize;
  document.getElementById("valSymbolSize").textContent = state.symbolSize + "px";
  document.getElementById("ctrlSymbolType").value = state.symbolType;
  document.getElementById("ctrlLineSmooth").checked = state.lineSmooth;
  document.getElementById("ctrlBarRadius").value = state.barRadius;
  document.getElementById("valBarRadius").textContent = state.barRadius + "px";
  document.getElementById("ctrlPieRadius").value = state.pieRadius;
  document.getElementById("valPieRadius").textContent = state.pieRadius + "px";

  document.getElementById("ctrlTooltipBg").value = state.tooltipBg.startsWith("#") ? state.tooltipBg : "#0F172A";
  document.getElementById("ctrlTooltipBgHex").value = state.tooltipBg;
  document.getElementById("ctrlTooltipText").value = state.tooltipText;
  document.getElementById("ctrlTooltipTextHex").value = state.tooltipText;
  document.getElementById("ctrlTooltipBorderRadius").value = state.tooltipRadius;
  document.getElementById("valTooltipRadius").textContent = state.tooltipRadius + "px";

  setCanvasDark(state.canvasDark);
}

function setCanvasDark(dark) {
  state.canvasDark = dark;
  document.getElementById("main").classList.toggle("dark-canvas", dark);
  const iconEl = document.getElementById("canvasBgIcon");
  if (iconEl) {
    iconEl.innerHTML = dark
      ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
  document.getElementById("canvasBgText").textContent = dark ? "Light Canvas" : "Dark Canvas";
}

/* ==================================================================
   6. Modal & Export Utilities
   ================================================================== */
const modal = document.getElementById("exportModal");
let activeExportTab = "builderJson";

function updateModalCodeViewer() {
  const viewer = document.getElementById("modalCodeViewer");
  if (!viewer) return;

  if (activeExportTab === "builderJson") {
    viewer.textContent = JSON.stringify(toThemeBuilderJSON(state), null, 2);
  } else if (activeExportTab === "nativeJson") {
    viewer.textContent = JSON.stringify(buildTheme(state), null, 2);
  } else if (activeExportTab === "jsSnippet") {
    const themeName = state.name || "cdriDatahubTheme";
    viewer.textContent = formatJsSnippet(themeName, buildTheme(state));
  }
}

export function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  document.getElementById("toastMsg").textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ==================================================================
   7. Custom Upload & Column Mapping
   ================================================================== */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function colOptions(headers, numericMask, selected, numericOnly) {
  return headers.map((h, i) => {
    if (numericOnly && numericMask && !numericMask[i]) return "";
    return `<option value="${i}" ${i === selected ? "selected" : ""}>${escapeHtml(h)}</option>`;
  }).join("");
}

function renderUploadPanel() {
  const { headers, rows } = uploadState;
  const panel = document.getElementById("uploadPanel");
  if (!headers.length) {
    panel.style.display = "none";
    return;
  }
  panel.style.display = "block";
  document.getElementById("uploadSummary").textContent = `${uploadState.fileName} (${rows.length} rows, ${headers.length} columns)`;

  let previewHtml = "<tr>" + headers.map(h => `<th>${escapeHtml(h)}</th>`).join("") + "</tr>";
  rows.slice(0, 5).forEach(r => {
    previewHtml += "<tr>" + r.map(v => `<td>${escapeHtml(v)}</td>`).join("") + "</tr>";
  });
  document.getElementById("uploadPreviewTable").innerHTML = previewHtml;

  const t = state.focusChartType;
  const mapArea = document.getElementById("mappingArea");

  if (t === "scatter" || t === "bubble") {
    mapArea.innerHTML = `
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">X Column</label><select id="mapX" class="ctrl-select" style="width:140px;">${colOptions(headers, uploadState.colNumeric, uploadState.mapping.x, true)}</select></div>
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Y Column</label><select id="mapY" class="ctrl-select" style="width:140px;">${colOptions(headers, uploadState.colNumeric, uploadState.mapping.y, true)}</select></div>
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Size / Weight</label><select id="mapSize" class="ctrl-select" style="width:140px;">${colOptions(headers, uploadState.colNumeric, uploadState.mapping.size, true)}</select></div>
      </div>
    `;
    document.getElementById("mapX").addEventListener("change", e => { uploadState.mapping.x = Number(e.target.value); renderFocusChart(); });
    document.getElementById("mapY").addEventListener("change", e => { uploadState.mapping.y = Number(e.target.value); renderFocusChart(); });
    document.getElementById("mapSize").addEventListener("change", e => { uploadState.mapping.size = Number(e.target.value); renderFocusChart(); });
  } else if (t === "sankey") {
    mapArea.innerHTML = `
      <div style="display:flex;gap:14px;flex-wrap:wrap;">
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Source Column</label><select id="mapSource" class="ctrl-select" style="width:140px;">${colOptions(headers, null, uploadState.mapping.source, false)}</select></div>
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Target Column</label><select id="mapTarget" class="ctrl-select" style="width:140px;">${colOptions(headers, null, uploadState.mapping.target, false)}</select></div>
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Flow Value</label><select id="mapVal" class="ctrl-select" style="width:140px;">${colOptions(headers, uploadState.colNumeric, uploadState.mapping.value, true)}</select></div>
      </div>
    `;
    document.getElementById("mapSource").addEventListener("change", e => { uploadState.mapping.source = Number(e.target.value); renderFocusChart(); });
    document.getElementById("mapTarget").addEventListener("change", e => { uploadState.mapping.target = Number(e.target.value); renderFocusChart(); });
    document.getElementById("mapVal").addEventListener("change", e => { uploadState.mapping.value = Number(e.target.value); renderFocusChart(); });
  } else {
    const seriesChecks = headers.map((h, i) => (uploadState.colNumeric[i] && i !== uploadState.mapping.category)
      ? `<label style="display:flex;align-items:center;gap:4px;font-size:12px;cursor:pointer;"><input type="checkbox" data-col="${i}" ${uploadState.mapping.series.includes(i) ? "checked" : ""}> ${escapeHtml(h)}</label>`
      : ""
    ).join("");
    mapArea.innerHTML = `
      <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start;">
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Category / X Axis</label><select id="mapCategory" class="ctrl-select" style="width:150px;">${colOptions(headers, null, uploadState.mapping.category, false)}</select></div>
        <div><label style="font-size:11px;color:var(--muted);display:block;margin-bottom:4px;">Series Columns</label><div style="display:flex;flex-wrap:wrap;gap:8px;max-width:320px;">${seriesChecks}</div></div>
      </div>
    `;
    document.getElementById("mapCategory").addEventListener("change", e => {
      uploadState.mapping.category = Number(e.target.value);
      uploadState.mapping.series = uploadState.mapping.series.filter(i => i !== uploadState.mapping.category);
      renderUploadPanel();
      renderFocusChart();
    });
    mapArea.querySelectorAll("input[type=checkbox]").forEach(cb => {
      cb.addEventListener("change", e => {
        const colIdx = Number(e.target.dataset.col);
        if (e.target.checked) uploadState.mapping.series.push(colIdx);
        else uploadState.mapping.series = uploadState.mapping.series.filter(x => x !== colIdx);
        renderFocusChart();
      });
    });
  }
}

/* ==================================================================
   8. Event Listeners & Bootstrap
   ================================================================== */
function bindEvents() {
  // Sidebar Collapse / Reveal / Floating Toggles
  const btnToggleSidebar = document.getElementById("btnToggleSidebar");
  if (btnToggleSidebar) btnToggleSidebar.addEventListener("click", () => toggleSidebar());

  const btnSidebarCollapse = document.getElementById("btnSidebarCollapse");
  if (btnSidebarCollapse) btnSidebarCollapse.addEventListener("click", () => toggleSidebar(true));

  const btnSidebarFloatToggle = document.getElementById("btnSidebarFloatToggle");
  if (btnSidebarFloatToggle) btnSidebarFloatToggle.addEventListener("click", () => toggleFloatingSidebar());

  // Global Shortcut: Ctrl+B or Cmd+B to toggle sidebar
  window.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      toggleSidebar();
    }
  });

  document.getElementById("btnModeDashboard").addEventListener("click", () => switchViewMode("dashboard"));
  document.getElementById("btnModeFocus").addEventListener("click", () => switchViewMode("focus"));
  document.getElementById("focusChartTypeSelect").addEventListener("change", e => {
    state.focusChartType = e.target.value;
    renderFocusChart();
    renderUploadPanel();
  });

  // Palette Actions
  document.getElementById("btnAddColor").addEventListener("click", () => {
    if (state.palette.length >= 16) {
      showToast("Maximum 16 colors reached!");
      return;
    }
    const nextColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    state.palette.push(nextColor);
    renderPaletteSwatches();
    renderAll();
    showToast("Added new color swatch.");
  });

  document.getElementById("btnReversePalette").addEventListener("click", () => {
    state.palette.reverse();
    renderPaletteSwatches();
    renderAll();
    showToast("Palette reversed!");
  });

  document.getElementById("paletteQuickPreset").addEventListener("change", e => {
    const v = e.target.value;
    if (QUICK_PALETTES[v]) {
      state.palette = [...QUICK_PALETTES[v]];
      renderPaletteSwatches();
      renderAll();
      showToast("Palette preset applied!");
    }
    e.target.value = "";
  });

  document.getElementById("presetSelect").addEventListener("change", e => applyPreset(e.target.value));

  document.getElementById("cvdSelect").addEventListener("change", e => {
    applyCvdFilter(e.target.value, document.getElementById("canvasStage"));
  });

  document.getElementById("btnToggleCanvasBg").addEventListener("click", () => {
    setCanvasDark(!state.canvasDark);
  });

  document.getElementById("themeNameInput").addEventListener("input", e => {
    state.name = e.target.value.trim() || "cdriTheme";
    updateModalCodeViewer();
  });

  // Color Pickers
  function bindColorPair(pickerId, hexId, stateKey) {
    const p = document.getElementById(pickerId);
    const h = document.getElementById(hexId);
    if (!p || !h) return;
    p.addEventListener("input", e => {
      state[stateKey] = e.target.value;
      h.value = e.target.value;
      renderAll();
    });
    h.addEventListener("change", e => {
      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        state[stateKey] = e.target.value;
        p.value = e.target.value;
        renderAll();
      }
    });
  }
  bindColorPair("ctrlBgColor", "ctrlBgColorHex", "backgroundColor");
  bindColorPair("ctrlTitleColor", "ctrlTitleColorHex", "titleColor");
  bindColorPair("ctrlSubtitleColor", "ctrlSubtitleColorHex", "subtitleColor");
  bindColorPair("ctrlTextColor", "ctrlTextColorHex", "textColor");
  bindColorPair("ctrlAxisLineColor", "ctrlAxisLineColorHex", "axisLineColor");
  bindColorPair("ctrlSplitLineColor", "ctrlSplitLineColorHex", "splitLineColor");
  bindColorPair("ctrlTooltipBg", "ctrlTooltipBgHex", "tooltipBg");
  bindColorPair("ctrlTooltipText", "ctrlTooltipTextHex", "tooltipText");

  document.getElementById("ctrlBgTransparent").addEventListener("change", e => { state.bgTransparent = e.target.checked; renderAll(); });
  document.getElementById("ctrlAxisLineShow").addEventListener("change", e => { state.axisLineShow = e.target.checked; renderAll(); });
  document.getElementById("ctrlSplitLineShow").addEventListener("change", e => { state.splitLineShow = e.target.checked; renderAll(); });
  document.getElementById("ctrlSplitLineType").addEventListener("change", e => { state.splitLineType = e.target.value; renderAll(); });

  document.getElementById("ctrlLineWidth").addEventListener("input", e => {
    state.lineWidth = Number(e.target.value);
    document.getElementById("valLineWidth").textContent = state.lineWidth + "px";
    renderAll();
  });
  document.getElementById("ctrlSymbolSize").addEventListener("input", e => {
    state.symbolSize = Number(e.target.value);
    document.getElementById("valSymbolSize").textContent = state.symbolSize + "px";
    renderAll();
  });
  document.getElementById("ctrlSymbolType").addEventListener("change", e => { state.symbolType = e.target.value; renderAll(); });
  document.getElementById("ctrlLineSmooth").addEventListener("change", e => { state.lineSmooth = e.target.checked; renderAll(); });
  document.getElementById("ctrlBarRadius").addEventListener("input", e => {
    state.barRadius = Number(e.target.value);
    document.getElementById("valBarRadius").textContent = state.barRadius + "px";
    renderAll();
  });
  document.getElementById("ctrlPieRadius").addEventListener("input", e => {
    state.pieRadius = Number(e.target.value);
    document.getElementById("valPieRadius").textContent = state.pieRadius + "px";
    renderAll();
  });
  document.getElementById("ctrlTooltipBorderRadius").addEventListener("input", e => {
    state.tooltipRadius = Number(e.target.value);
    document.getElementById("valTooltipRadius").textContent = state.tooltipRadius + "px";
    renderAll();
  });
  document.getElementById("ctrlFontFamily").addEventListener("change", e => {
    state.fontFamily = e.target.value;
    renderAll();
  });

  // Accordion Expand/Collapse
  document.querySelectorAll(".acc-header").forEach(h => {
    h.addEventListener("click", () => {
      const parent = h.closest(".acc-item");
      parent.classList.toggle("open");
    });
  });

  // Randomize & Reset
  document.getElementById("btnRandomize").addEventListener("click", () => {
    workingData.trend.seriesData = workingData.trend.seriesData.map(arr => arr.map(jitter));
    workingData.stackedBar.seriesData = workingData.stackedBar.seriesData.map(arr => arr.map(jitter));
    workingData.pie.seriesData[0] = workingData.pie.seriesData[0].map(jitter);
    workingData.radar.seriesData = workingData.radar.seriesData.map(arr => arr.map(v => Math.min(100, jitter(v))));
    workingData.sankey.links = workingData.sankey.links.map(l => ({ ...l, value: jitter(l.value) }));
    workingData.bubble.points = workingData.bubble.points.map(p => ({ ...p, x: jitter(p.x), y: jitter(p.y), size: jitter(p.size) }));
    workingData.gauge = Math.round(50 + Math.random() * 45);
    renderAll();
    showToast("Sample data randomized.");
  });

  document.getElementById("btnReset").addEventListener("click", () => {
    applyPreset("cdriLight");
    document.getElementById("presetSelect").value = "cdriLight";
  });

  // Modal Dialog
  document.getElementById("btnOpenExportModal").addEventListener("click", () => {
    updateModalCodeViewer();
    modal.showModal();
  });
  document.getElementById("btnCloseExportModal").addEventListener("click", () => modal.close());

  document.querySelectorAll(".modal-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".modal-tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeExportTab = btn.dataset.tab;
      updateModalCodeViewer();
    });
  });

  document.getElementById("btnCopyModalCode").addEventListener("click", () => {
    const code = document.getElementById("modalCodeViewer").textContent;
    copyToClipboard(code, () => showToast("Code copied to clipboard."), () => showToast("Copy failed, please select and copy manually."));
  });

  document.getElementById("btnDownloadJson").addEventListener("click", () => {
    const jsonContent = JSON.stringify(toThemeBuilderJSON(state), null, 2);
    downloadFile(jsonContent, `${state.name || "cdri-theme"}-builder.json`, "application/json");
    showToast("Downloaded Theme Builder JSON.");
  });

  document.getElementById("btnDownloadJs").addEventListener("click", () => {
    const themeName = state.name || "cdriDatahubTheme";
    const jsCode = formatJsSnippet(themeName, buildTheme(state));
    downloadFile(jsCode, `${themeName}.js`, "text/javascript");
    showToast("Downloaded Theme JS Module.");
  });

  // Import JSON File
  document.getElementById("btnImport").addEventListener("click", () => document.getElementById("importFileInput").click());
  document.getElementById("importFileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const obj = JSON.parse(evt.target.result);
        fromThemeBuilderJSON(obj, state);
        syncControlsFromState();
        renderPaletteSwatches();
        renderAll();
        showToast("Theme imported successfully.");
      } catch (err) {
        alert("Invalid Theme JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  // Data Source Switcher
  document.getElementById("btnSourceSample").addEventListener("click", () => {
    state.dataSource = "sample";
    document.getElementById("btnSourceSample").classList.add("active");
    document.getElementById("btnSourceUpload").classList.remove("active");
    document.getElementById("sidebarUploadArea").style.display = "none";
    document.getElementById("uploadPanel").style.display = "none";
    renderAll();
    showToast("Switched to CDRI Sample Metrics.");
  });

  document.getElementById("btnSourceUpload").addEventListener("click", () => {
    state.dataSource = "upload";
    document.getElementById("btnSourceUpload").classList.add("active");
    document.getElementById("btnSourceSample").classList.remove("active");
    document.getElementById("sidebarUploadArea").style.display = "block";
    if (!uploadState.headers.length) {
      document.getElementById("customFileInput").click();
    } else {
      switchViewMode("focus");
      renderUploadPanel();
      renderFocusChart();
    }
  });

  document.getElementById("btnTriggerUpload").addEventListener("click", () => {
    document.getElementById("customFileInput").click();
  });

  document.getElementById("customFileInput").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const isJson = /\.json$/i.test(file.name) || file.type === "application/json";
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const { headers, rows } = parseUploadedText(evt.target.result, isJson);
        uploadState.headers = headers;
        uploadState.rows = rows;
        uploadState.colNumeric = computeColTypes(headers, rows);
        uploadState.fileName = file.name;
        uploadState.mapping = autoMapColumns(headers, rows, uploadState.colNumeric);

        document.getElementById("sidebarUploadFileLabel").textContent = `${file.name} (${rows.length} rows)`;
        switchViewMode("focus");
        renderUploadPanel();
        renderFocusChart();
        showToast(`Loaded ${file.name}.`);
      } catch (err) {
        alert("Error parsing file: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });
}

/* ==================================================================
   9. Initialization
   ================================================================== */
loadWorldMap(() => {
  if (state.viewMode === "focus" && state.focusChartType === "map") {
    renderFocusChart();
  }
});

syncControlsFromState();
renderPaletteSwatches();
bindEvents();
renderAll();
