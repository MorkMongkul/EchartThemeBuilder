/**
 * Point, Distribution & Matrix Chart Option Builders
 */

export function buildScatterOption(data, state) {
  const maxSize = Math.max(...data.points.map(p => p.size), 1);
  return {
    title: { text: "Budget vs. Beneficiaries", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { formatter: p => `${p.data.name}: ($${p.data.value[0]}k, ${p.data.value[1]}k beneficiaries)` },
    grid: { left: 35, right: 20, top: 40, bottom: 30 },
    xAxis: { type: "value", splitLine: { show: true } },
    yAxis: { type: "value" },
    series: [{
      type: "scatter",
      data: data.points.map(p => ({ name: p.name, value: [p.x, p.y, p.size] })),
      symbolSize: val => 10 + (val[2] / maxSize) * 28,
      itemStyle: { opacity: 0.8 }
    }]
  };
}

export function buildHeatmapOption(data, sectors, quarters, state) {
  return {
    title: { text: "Project Activity Intensity", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { position: "top" },
    grid: { left: 35, right: 15, top: 40, bottom: 50 },
    xAxis: { type: "category", data: sectors, axisLabel: { interval: 0, rotate: 35, fontSize: 9 } },
    yAxis: { type: "category", data: quarters, axisLabel: { fontSize: 9 } },
    visualMap: {
      min: 0, max: 12, calculable: false, orient: "horizontal", left: "center", bottom: 0,
      itemWidth: 10, itemHeight: 80,
      inRange: { color: [state.backgroundColor, state.palette[0] || "#06B6D4", state.palette[2] || "#4C41C8"] },
      textStyle: { fontSize: 9, color: state.textColor }
    },
    series: [{ type: "heatmap", data: data, label: { show: false } }]
  };
}

export function buildBoxplotOption(data, sectors, state) {
  return {
    title: { text: "Sector Response Distribution (Boxplot)", left: "left", textStyle: { fontSize: 13 } },
    grid: { left: 45, right: 20, top: 50, bottom: 50 },
    xAxis: { type: "category", data: sectors, axisLabel: { interval: 0, rotate: 30, fontSize: 10 } },
    yAxis: { type: "value" },
    series: [{ type: "boxplot", data }]
  };
}

export function buildParallelOption(data, state) {
  const dimensions = data.dimensions || [
    { name: "Completeness", max: 100 },
    { name: "Timeliness", max: 100 },
    { name: "Data Quality", max: 10 },
    { name: "Downloads (k)", max: 200 },
    { name: "Policy Citations", max: 50 }
  ];

  return {
    title: {
      text: "Multi-Dimensional Sector Benchmarking",
      subtext: "Parallel coordinates evaluation across institutional metrics",
      left: "left",
      textStyle: { fontSize: 13, fontFamily: state.fontFamily, color: state.titleColor },
      subtextStyle: { fontSize: 11, fontFamily: state.fontFamily, color: state.subtitleColor }
    },
    tooltip: { trigger: "item" },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: state.textColor, fontSize: 11 }
    },
    parallelAxis: dimensions.map((dim, i) => ({
      dim: i,
      name: dim.name,
      max: dim.max,
      nameTextStyle: { color: state.textColor, fontSize: 11, fontFamily: state.fontFamily },
      axisLine: { lineStyle: { color: state.axisLineColor || "#CBD5E1" } },
      axisTick: { lineStyle: { color: state.axisLineColor || "#CBD5E1" } },
      splitLine: { show: false },
      axisLabel: { color: state.textColor, fontSize: 10, fontFamily: state.fontFamily }
    })),
    parallel: {
      left: "10%",
      right: "12%",
      top: 60,
      bottom: 45,
      parallelAxisDefault: {
        type: "value",
        nameLocation: "end"
      }
    },
    series: (data.data || []).map((item, idx) => ({
      name: item.name,
      type: "parallel",
      lineStyle: {
        width: 2.5,
        opacity: 0.85,
        color: state.palette[idx % state.palette.length] || "#06B6D4"
      },
      data: [item.value]
    }))
  };
}
