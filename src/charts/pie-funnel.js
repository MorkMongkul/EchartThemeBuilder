/**
 * Part-to-Whole Chart Option Builders (Pie, Doughnut, Funnel, Treemap)
 */

export function buildPieOption(data, state, isDoughnut = false, showLegend = false) {
  return {
    title: { text: "Sector Share", left: "center", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "item" },
    legend: { show: showLegend, bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8 },
    series: [{
      type: "pie",
      radius: isDoughnut ? ["40%", "70%"] : "70%",
      center: ["50%", showLegend ? "46%" : "52%"],
      avoidLabelOverlap: true,
      data: data.categories.map((name, i) => ({ name, value: data.seriesData[0][i] })),
      label: { show: false }
    }]
  };
}

export function buildFunnelOption(data, state) {
  return {
    title: { text: "Dataset Publishing Pipeline (Funnel)", left: "center", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "item" },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8 },
    series: [{
      type: "funnel",
      left: "15%",
      width: "70%",
      top: 50,
      bottom: 40,
      data: data.categories.slice(0, 5).map((name, i) => ({ name, value: data.seriesData[0][i] }))
    }]
  };
}

export function buildTreemapOption(data, state) {
  return {
    title: {
      text: "Datasets Distributed by Sector (Treemap)",
      subtext: "Hierarchical capacity & sub-sector breakdown",
      left: "left",
      textStyle: { fontSize: 13, fontFamily: state.fontFamily, color: state.titleColor },
      subtextStyle: { fontSize: 11, fontFamily: state.fontFamily, color: state.subtitleColor }
    },
    tooltip: {
      trigger: "item",
      backgroundColor: state.tooltipBg,
      borderColor: state.palette[0] || "#06B6D4",
      borderRadius: state.tooltipRadius,
      textStyle: { color: state.tooltipText, fontFamily: state.fontFamily, fontSize: 12 },
      formatter: p => `<strong>${p.name}</strong><br/>Indicators / Datasets: <strong>${p.value}</strong>`
    },
    series: [{
      type: "treemap",
      top: 42,
      bottom: 24,
      left: 8,
      right: 8,
      roam: false,
      drillDownIcon: "▶",
      nodeClick: "zoomToNode",
      label: {
        show: true,
        formatter: "{b}\n{c}",
        color: "#ffffff",
        fontSize: 11,
        fontFamily: state.fontFamily,
        textShadowColor: "rgba(0,0,0,0.4)",
        textShadowBlur: 2
      },
      upperLabel: {
        show: true,
        height: 22,
        color: state.textColor,
        fontWeight: 600,
        fontSize: 11,
        fontFamily: state.fontFamily
      },
      breadcrumb: {
        show: true,
        left: 8,
        bottom: 0,
        emptyItemWidth: 25,
        itemStyle: {
          color: state.backgroundColor === "rgba(0,0,0,0)" ? "rgba(15,23,42,0.6)" : state.backgroundColor,
          borderColor: state.axisLineColor || "#CBD5E1",
          borderWidth: 1,
          textStyle: { color: state.textColor, fontFamily: state.fontFamily, fontSize: 11 }
        }
      },
      levels: [
        {
          itemStyle: {
            borderColor: state.backgroundColor === "rgba(0,0,0,0)" ? "#0F172A" : state.backgroundColor,
            borderWidth: 3,
            gapWidth: 3
          },
          upperLabel: { show: false }
        },
        {
          color: state.palette,
          colorMappingBy: "index",
          itemStyle: {
            borderColor: state.backgroundColor === "rgba(0,0,0,0)" ? "#0F172A" : state.backgroundColor,
            borderWidth: 2,
            gapWidth: 2
          },
          emphasis: {
            itemStyle: { borderColor: "#ffffff" }
          }
        },
        {
          colorSaturation: [0.35, 0.7],
          itemStyle: {
            borderColorSaturation: 0.6,
            gapWidth: 1
          }
        }
      ],
      data
    }]
  };
}

export function buildSunburstOption(data, state) {
  return {
    title: {
      text: "Sector & Sub-Indicator Sunburst",
      subtext: "Concentric hierarchical indicator tree",
      left: "center",
      textStyle: { fontSize: 13, fontFamily: state.fontFamily, color: state.titleColor },
      subtextStyle: { fontSize: 11, fontFamily: state.fontFamily, color: state.subtitleColor }
    },
    tooltip: {
      trigger: "item",
      backgroundColor: state.tooltipBg,
      borderColor: state.palette[0] || "#06B6D4",
      borderRadius: state.tooltipRadius,
      textStyle: { color: state.tooltipText, fontFamily: state.fontFamily, fontSize: 12 },
      formatter: p => `<strong>${p.name}</strong><br/>Value: <strong>${p.value || 0}</strong>`
    },
    series: [{
      type: "sunburst",
      center: ["50%", "54%"],
      radius: ["15%", "85%"],
      sort: "desc",
      emphasis: { focus: "ancestor" },
      data,
      label: {
        rotate: "radial",
        color: state.textColor,
        fontSize: 10,
        fontFamily: state.fontFamily
      },
      levels: [
        {},
        {
          r0: "15%",
          r: "40%",
          itemStyle: { borderWidth: 2, borderColor: state.backgroundColor === "rgba(0,0,0,0)" ? "#fff" : state.backgroundColor },
          label: { rotate: "tangential", fontWeight: 600, fontSize: 11 }
        },
        {
          r0: "40%",
          r: "68%",
          itemStyle: { borderWidth: 1.5, borderColor: state.backgroundColor === "rgba(0,0,0,0)" ? "#fff" : state.backgroundColor },
          label: { align: "right", fontSize: 10 }
        },
        {
          r0: "68%",
          r: "85%",
          label: { position: "outside", padding: 3, silent: false, fontSize: 9.5 },
          itemStyle: { borderWidth: 1 }
        }
      ]
    }]
  };
}

export function buildRoseOption(data, state) {
  return {
    title: {
      text: "Sector Capacity Distribution (Rose)",
      left: "center",
      textStyle: { fontSize: 13, fontFamily: state.fontFamily, color: state.titleColor }
    },
    tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { color: state.textColor, fontSize: 11 } },
    series: [{
      type: "pie",
      roseType: "area",
      radius: ["20%", "72%"],
      center: ["50%", "48%"],
      itemStyle: { borderRadius: state.pieRadius || 4 },
      data: data.categories.map((name, i) => ({ name, value: data.seriesData[0][i] })),
      label: { show: false }
    }]
  };
}
