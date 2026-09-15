/**
 * Bar & Column Chart Option Builders
 */

export function buildBarOption(data, state, isStacked = false) {
  return {
    title: { text: isStacked ? "Funding Source Distribution" : "Datasets by Sector", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, icon: "rect", itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 11 } },
    grid: { left: 35, right: 15, top: 40, bottom: 55 },
    xAxis: { type: "category", data: data.categories, axisLabel: { interval: 0, rotate: 30, fontSize: 10 } },
    yAxis: { type: "value" },
    series: data.seriesNames.map((name, i) => ({
      name,
      type: "bar",
      stack: isStacked ? "total" : null,
      data: data.seriesData[i],
      itemStyle: {
        borderRadius: (!isStacked || i === data.seriesNames.length - 1) ? [state.barRadius, state.barRadius, 0, 0] : 0
      }
    }))
  };
}

export function buildHorizontalBarOption(data, state) {
  return {
    title: { text: "Datasets by Sector (Horizontal)", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "axis" },
    grid: { left: 110, right: 30, top: 40, bottom: 30 },
    xAxis: { type: "value" },
    yAxis: { type: "category", data: data.categories },
    series: [{
      type: "bar",
      data: data.seriesData[0],
      itemStyle: { borderRadius: [0, state.barRadius, state.barRadius, 0] }
    }]
  };
}

export function buildWaterfallOption(data, state) {
  const categories = data.categories || [];
  const steps = data.steps || [];
  const base = [];
  const positive = [];
  const negative = [];

  let current = 0;
  for (let i = 0; i < steps.length; i++) {
    const val = steps[i];
    if (i === 0 || i === steps.length - 1) {
      base.push(0);
      positive.push(val > 0 ? val : 0);
      negative.push(val < 0 ? Math.abs(val) : 0);
      current = val;
    } else if (val >= 0) {
      base.push(current);
      positive.push(val);
      negative.push(0);
      current += val;
    } else {
      current += val;
      base.push(current);
      positive.push(0);
      negative.push(Math.abs(val));
    }
  }

  return {
    title: {
      text: "Research & Grant Funding Waterfall",
      subtext: "Variance breakdown of budget inflows, outlays, and net reserves",
      left: "left",
      textStyle: { fontSize: 13, fontFamily: state.fontFamily, color: state.titleColor },
      subtextStyle: { fontSize: 11, fontFamily: state.fontFamily, color: state.subtitleColor }
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      formatter: params => {
        const item = params.find(p => p.value > 0 && p.seriesName !== "Base");
        const name = params[0].name;
        return item ? `<strong>${name}</strong>: $${item.value}k` : `${name}`;
      }
    },
    grid: { left: 45, right: 20, top: 50, bottom: 50 },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: { interval: 0, rotate: 25, fontSize: 10, fontFamily: state.fontFamily }
    },
    yAxis: { type: "value", axisLabel: { formatter: "${value}k", fontFamily: state.fontFamily } },
    series: [
      {
        name: "Base",
        type: "bar",
        stack: "waterfall",
        itemStyle: { borderColor: "transparent", color: "transparent" },
        emphasis: { itemStyle: { borderColor: "transparent", color: "transparent" } },
        data: base
      },
      {
        name: "Increase / Revenue",
        type: "bar",
        stack: "waterfall",
        data: positive,
        itemStyle: { color: state.palette[0] || "#06B6D4", borderRadius: [state.barRadius, state.barRadius, 0, 0] }
      },
      {
        name: "Expenditure / Outlay",
        type: "bar",
        stack: "waterfall",
        data: negative,
        itemStyle: { color: state.palette[3] || "#EF4444", borderRadius: [state.barRadius, state.barRadius, 0, 0] }
      }
    ]
  };
}
