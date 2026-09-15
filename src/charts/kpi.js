import { isDarkHex } from '../utils/accessibility.js';

/**
 * KPI & Specialized Chart Option Builders (Radar, Gauge, Candlestick)
 */

export function buildRadarOption(data, state) {
  return {
    title: { text: "Sector Completeness", left: "center", textStyle: { fontSize: 13 } },
    tooltip: {},
    legend: { bottom: 0, itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
    radar: {
      radius: "60%",
      indicator: data.categories.map(name => ({ name, max: 100 })),
      splitArea: { show: false }
    },
    series: [{
      type: "radar",
      data: data.seriesNames.map((name, i) => ({ name, value: data.seriesData[i] }))
    }]
  };
}

export function buildGaugeOption(value, state) {
  return {
    title: { text: "Platform Health Index", left: "center", textStyle: { fontSize: 13 } },
    series: [{
      type: "gauge",
      center: ["50%", "58%"],
      radius: "80%",
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      progress: {
        show: true,
        width: 14,
        itemStyle: { color: state.palette[0] || "#06B6D4" }
      },
      axisLine: {
        lineStyle: {
          width: 14,
          color: [[1, isDarkHex(state.backgroundColor) ? "#1E293B" : "#E2E8F0"]]
        }
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 26,
        offsetCenter: [0, 0],
        color: state.textColor,
        fontFamily: state.fontFamily,
        formatter: "{value}%"
      },
      data: [{ value }]
    }]
  };
}

export function buildCandlestickOption(data, state) {
  return {
    title: { text: "API Turnaround Latency (ms)", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 15, top: 40, bottom: 30 },
    xAxis: { type: "category", data: data.days, axisLabel: { fontSize: 10 } },
    yAxis: { type: "value", scale: true },
    series: [{
      type: "candlestick",
      data: data.vals,
      itemStyle: {
        color: state.palette[3] || "#8F3D8F",
        color0: state.palette[1] || "#4994DF",
        borderColor: state.palette[3] || "#8F3D8F",
        borderColor0: state.palette[1] || "#4994DF"
      }
    }]
  };
}
