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

/**
 * Top KPI Micro-Chart Option Builders
 */
export function buildKpiSparklineOption(values, color) {
  return {
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false, min: Math.min(...values) * 0.8 },
    series: [{
      type: 'line',
      data: values,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2.5, color: color },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: color + '66' },
            { offset: 1, color: color + '05' }
          ]
        }
      }
    }],
    tooltip: { show: false }
  };
}

export function buildKpiBarSparklineOption(values, color) {
  return {
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: { type: 'category', show: false },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'bar',
      data: values,
      itemStyle: {
        color: color,
        borderRadius: [2, 2, 0, 0]
      },
      barWidth: '55%'
    }],
    tooltip: { show: false }
  };
}

export function buildKpiRingOption(percent, color, state) {
  const isDark = isDarkHex(state.backgroundColor);
  return {
    series: [{
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: { color: color }
      },
      axisLine: {
        lineStyle: {
          width: 6,
          color: [[1, isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)']]
        }
      },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      data: [{ value: percent }],
      detail: { show: false }
    }]
  };
}

export function buildKpiProgressOption(percent, color, state) {
  const isDark = isDarkHex(state.backgroundColor);
  return {
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'value', max: 100, show: false },
    yAxis: { type: 'category', show: false },
    series: [{
      type: 'bar',
      data: [percent],
      barWidth: 8,
      itemStyle: {
        color: color,
        borderRadius: 4
      },
      showBackground: true,
      backgroundStyle: {
        color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        borderRadius: 4
      }
    }]
  };
}

export function buildExecutiveScorecardOption(data, state) {
  return {
    title: {
      text: "Executive Datahub KPI Scorecard",
      subtext: "Comprehensive real-time health indicators across research, coverage & quality",
      left: "left",
      textStyle: { fontSize: 16, fontWeight: 700, color: state.titleColor },
      subtextStyle: { fontSize: 12, color: state.subtitleColor }
    },
    tooltip: { trigger: 'axis' },
    legend: { top: 45, right: 20, textStyle: { color: state.textColor } },
    grid: { left: 45, right: 30, top: 90, bottom: 40 },
    xAxis: {
      type: 'category',
      data: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
      axisLabel: { color: state.textColor }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Datasets (Units)',
        nameTextStyle: { color: state.subtitleColor },
        axisLabel: { color: state.textColor }
      },
      {
        type: 'value',
        name: 'Completeness (%)',
        max: 100,
        nameTextStyle: { color: state.subtitleColor },
        axisLabel: { color: state.textColor, formatter: '{value}%' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'Datasets Indexed',
        type: 'bar',
        data: [920, 1050, 1180, 1290, 1370, 1428],
        itemStyle: { color: state.palette[0] || "#06B6D4", borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Partner Collaborations',
        type: 'bar',
        data: [28, 32, 36, 40, 44, 48],
        itemStyle: { color: state.palette[1] || "#3B82F6", borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Data Quality Index',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: [84.2, 87.5, 89.1, 91.4, 93.0, 94.6],
        lineStyle: { width: 3, color: state.palette[2] || "#10B981" },
        itemStyle: { color: state.palette[2] || "#10B981" }
      }
    ]
  };
}
