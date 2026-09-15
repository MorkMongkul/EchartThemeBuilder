/**
 * Core ECharts Theme Generator
 * Converts builder state into an ECharts theme configuration object.
 */

export function buildTheme(state) {
  const bgColor = state.bgTransparent ? "rgba(0,0,0,0)" : state.backgroundColor;

  return {
    color: state.palette,
    backgroundColor: bgColor,
    textStyle: {
      fontFamily: state.fontFamily,
      color: state.textColor
    },
    title: {
      textStyle: {
        color: state.titleColor,
        fontFamily: state.fontFamily,
        fontWeight: 700
      },
      subtextStyle: {
        color: state.subtitleColor,
        fontFamily: state.fontFamily
      }
    },
    legend: {
      textStyle: {
        color: state.textColor,
        fontFamily: state.fontFamily
      }
    },
    tooltip: {
      backgroundColor: state.tooltipBg,
      borderColor: state.palette[0] || "#06B6D4",
      borderWidth: 1,
      borderRadius: state.tooltipRadius,
      textStyle: {
        color: state.tooltipText,
        fontFamily: state.fontFamily
      }
    },
    categoryAxis: {
      axisLine: {
        show: state.axisLineShow,
        lineStyle: { color: state.axisLineColor }
      },
      axisTick: {
        show: state.axisLineShow,
        lineStyle: { color: state.axisLineColor }
      },
      axisLabel: {
        color: state.textColor,
        fontFamily: state.fontFamily
      },
      splitLine: {
        show: state.splitLineShow,
        lineStyle: {
          color: [state.splitLineColor],
          type: state.splitLineType
        }
      }
    },
    valueAxis: {
      axisLine: {
        show: state.axisLineShow,
        lineStyle: { color: state.axisLineColor }
      },
      axisTick: {
        show: state.axisLineShow,
        lineStyle: { color: state.axisLineColor }
      },
      axisLabel: {
        color: state.textColor,
        fontFamily: state.fontFamily
      },
      splitLine: {
        show: state.splitLineShow,
        lineStyle: {
          color: [state.splitLineColor],
          type: state.splitLineType
        }
      }
    },
    line: {
      itemStyle: { borderWidth: 1.5 },
      lineStyle: { width: state.lineWidth },
      symbolSize: state.symbolSize,
      symbol: state.symbolType,
      smooth: state.lineSmooth
    },
    bar: {
      itemStyle: {
        borderRadius: [state.barRadius, state.barRadius, 0, 0]
      }
    },
    pie: {
      itemStyle: {
        borderRadius: state.pieRadius,
        borderColor: bgColor,
        borderWidth: state.pieRadius > 0 ? 2 : 0
      }
    },
    radar: {
      lineStyle: { width: state.lineWidth },
      symbolSize: state.symbolSize,
      symbol: state.symbolType
    },
    graph: {
      color: state.palette,
      lineStyle: {
        color: state.axisLineColor,
        curveness: 0.2
      }
    }
  };
}
