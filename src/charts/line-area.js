/**
 * Line & Area Chart Option Builders
 */

export function buildLineOption(data, state, isSmooth = false) {
  return {
    title: { text: "Datasets Over Time", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 11 } },
    grid: { left: 35, right: 15, top: 40, bottom: 35 },
    xAxis: { type: "category", data: data.categories, boundaryGap: false },
    yAxis: { type: "value" },
    series: data.seriesNames.map((name, i) => ({
      name,
      type: "line",
      data: data.seriesData[i],
      smooth: isSmooth || state.lineSmooth
    }))
  };
}

export function buildAreaOption(data, state, isStacked = false) {
  return {
    title: { text: isStacked ? "Stacked Datasets (Area)" : "Datasets (Area)", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 11 } },
    grid: { left: 45, right: 25, top: 50, bottom: 40 },
    xAxis: { type: "category", data: data.categories, boundaryGap: false },
    yAxis: { type: "value" },
    series: data.seriesNames.map((name, i) => ({
      name,
      type: "line",
      areaStyle: {},
      stack: isStacked ? "areaTotal" : null,
      data: data.seriesData[i],
      smooth: state.lineSmooth
    }))
  };
}
