/**
 * Apache ECharts Official Theme Builder JSON Schema Converter
 */

export function toThemeBuilderJSON(state) {
  return {
    version: 1,
    themeName: state.name || "cdriDatahubTheme",
    theme: {
      seriesCnt: state.palette.length,
      backgroundColor: state.bgTransparent ? "rgba(0,0,0,0)" : state.backgroundColor,
      titleColor: state.titleColor,
      subtitleColor: state.subtitleColor,
      textColorShow: false,
      textColor: state.textColor,
      markTextColor: "#ffffff",
      color: state.palette,
      borderColor: state.axisLineColor,
      borderWidth: 0,
      visualMapColor: [state.palette[0] || "#06B6D4", "#B7D4FB"],
      legendTextColor: state.textColor,
      kColor: state.palette[3] || "#8F3D8F",
      kColor0: state.palette[1] || "#4994DF",
      kBorderColor: state.palette[3] || "#8F3D8F",
      kBorderColor0: state.palette[1] || "#4994DF",
      kBorderWidth: 1,
      lineWidth: state.lineWidth,
      symbolSize: state.symbolSize,
      symbol: state.symbolType,
      symbolBorderWidth: 1.5,
      lineSmooth: state.lineSmooth,
      graphLineWidth: 1,
      graphLineColor: state.axisLineColor,
      mapLabelColor: state.titleColor,
      mapLabelColorE: state.palette[0] || "#06B6D4",
      mapBorderColor: "#cccccc",
      mapBorderColorE: state.palette[0] || "#06B6D4",
      mapBorderWidth: 0.5,
      mapBorderWidthE: 1,
      mapAreaColor: "#eeeeee",
      mapAreaColorE: "rgba(6,182,212,0.25)",
      axes: [
        {
          type: "all",
          name: "通用坐标轴",
          axisLineShow: state.axisLineShow,
          axisLineColor: state.axisLineColor,
          axisTickShow: false,
          axisTickColor: "#333",
          axisLabelShow: true,
          axisLabelColor: state.textColor,
          splitLineShow: state.splitLineShow,
          splitLineColor: [state.splitLineColor]
        },
        {
          type: "category",
          name: "类目坐标轴",
          axisLineShow: state.axisLineShow,
          axisLineColor: state.axisLineColor,
          axisTickShow: true,
          axisTickColor: "#333",
          axisLabelShow: true,
          axisLabelColor: state.textColor,
          splitLineShow: false,
          splitLineColor: [state.splitLineColor]
        },
        {
          type: "value",
          name: "数值坐标轴",
          axisLineShow: state.axisLineShow,
          axisLineColor: state.axisLineColor,
          axisTickShow: true,
          axisTickColor: "#333",
          axisLabelShow: true,
          axisLabelColor: state.textColor,
          splitLineShow: state.splitLineShow,
          splitLineColor: [state.splitLineColor]
        }
      ],
      axisSeparateSetting: false,
      toolboxColor: "#999999",
      toolboxEmphasisColor: state.palette[0] || "#06B6D4",
      tooltipAxisColor: state.axisLineColor,
      tooltipAxisWidth: 1,
      datazoomBackgroundColor: "rgba(255,255,255,0)",
      datazoomDataColor: "rgba(6,182,212,0.35)",
      datazoomFillColor: "rgba(6,182,212,0.15)",
      datazoomHandleColor: state.palette[0] || "#06B6D4",
      datazoomHandleWidth: "100%",
      datazoomLabelColor: state.textColor
    }
  };
}

export function fromThemeBuilderJSON(obj, targetState) {
  const t = obj.theme || obj;
  if (Array.isArray(t.color) && t.color.length) targetState.palette = t.color;
  if (t.backgroundColor && !t.backgroundColor.startsWith("rgba(0,0,0,0)")) {
    targetState.backgroundColor = t.backgroundColor;
  }
  if (t.titleColor) targetState.titleColor = t.titleColor;
  if (t.textColor) targetState.textColor = t.textColor;
  if (t.lineWidth) targetState.lineWidth = Number(t.lineWidth);
  if (t.symbolSize) targetState.symbolSize = Number(t.symbolSize);
  if (obj.themeName) targetState.name = obj.themeName;
}
