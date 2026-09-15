/**
 * Flow, Topology & Geospatial Chart Option Builders
 */

export function buildSankeyOption(data, state) {
  return {
    title: { text: "Data Publishing Pipeline", left: "left", textStyle: { fontSize: 13 } },
    tooltip: { trigger: "item" },
    series: [{
      type: "sankey",
      top: 35,
      bottom: 20,
      left: 15,
      right: 15,
      emphasis: { focus: "adjacency" },
      data: data.nodes,
      links: data.links,
      lineStyle: { color: "gradient", curveness: 0.5 },
      label: { color: state.textColor, fontSize: 10 }
    }]
  };
}

export function buildCambodiaChoroplethOption(provincesData, state) {
  const data = (provincesData || []).map(p => ({
    name: p.name,
    value: p.value,
    projects: p.projects || 0,
    budget: p.budget || 0
  }));

  const maxVal = Math.max(...data.map(d => d.value), 200);

  return {
    title: {
      text: "Cambodia Provincial Data Coverage",
      subtext: "25 Provinces & Municipalities — CDRI Research Projects",
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
      formatter: p => {
        if (!p.data) return `<strong>${p.name}</strong><br/>No active datasets recorded`;
        return `<div style="font-weight:700;margin-bottom:3px;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;">${p.name}</div>
                <div>Datasets Published: <strong>${p.data.value}</strong></div>
                <div>Field Projects: <strong>${p.data.projects}</strong></div>
                <div>Grant Value: <strong>$${p.data.budget}k</strong></div>`;
      }
    },
    visualMap: {
      min: 15,
      max: maxVal,
      left: "left",
      bottom: 20,
      text: ["High", "Low"],
      calculable: true,
      inRange: {
        color: [
          state.backgroundColor === "rgba(0,0,0,0)" ? "#F1F5F9" : state.backgroundColor,
          state.palette[0] || "#06B6D4",
          state.palette[1] || "#3B82F6",
          state.palette[2] || "#4C41C8"
        ]
      },
      textStyle: { color: state.textColor, fontFamily: state.fontFamily, fontSize: 11 }
    },
    series: [{
      name: "Cambodia Provincial Coverage",
      type: "map",
      map: "cambodia",
      roam: true,
      zoom: 1.15,
      emphasis: {
        label: { show: true, color: state.titleColor, fontWeight: 700, fontSize: 11 },
        itemStyle: { areaColor: state.palette[3] || "#8F3D8F", shadowBlur: 10, shadowColor: "rgba(0,0,0,0.3)" }
      },
      select: {
        itemStyle: { areaColor: state.palette[0] || "#06B6D4" },
        label: { color: "#fff" }
      },
      itemStyle: {
        borderColor: state.axisLineColor || "#CBD5E1",
        borderWidth: 0.8
      },
      data
    }]
  };
}

export function buildCambodiaBubbleOption(provincesData, capitals, state) {
  const points = (provincesData || []).map(p => {
    const coord = (capitals && capitals[p.name]) || [104.9, 12.5];
    return {
      name: p.name,
      value: [...coord, p.value],
      projects: p.projects,
      budget: p.budget
    };
  });

  const maxVal = Math.max(...points.map(p => p.value[2]), 200);

  return {
    title: {
      text: "Cambodia Provincial Hubs & Research Intensity",
      subtext: "Geo-scatter ripple indicators by provincial capital",
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
      formatter: p => {
        return `<div style="font-weight:700;margin-bottom:3px;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:3px;">${p.name} Hub</div>
                <div>Datasets: <strong>${p.value[2]}</strong></div>
                <div>Active Studies: <strong>${p.data.projects || 0}</strong></div>`;
      }
    },
    geo: {
      map: "cambodia",
      roam: true,
      zoom: 1.15,
      itemStyle: {
        areaColor: state.backgroundColor === "rgba(0,0,0,0)" ? "#F8FAFC" : state.backgroundColor,
        borderColor: state.axisLineColor || "#CBD5E1",
        borderWidth: 0.8
      },
      emphasis: {
        itemStyle: { areaColor: "rgba(6, 182, 212, 0.15)" }
      }
    },
    series: [
      {
        name: "Research Hubs",
        type: "effectScatter",
        coordinateSystem: "geo",
        data: points,
        symbolSize: val => Math.max(8, (val[2] / maxVal) * 32),
        showEffectOn: "render",
        rippleEffect: { brushType: "stroke", scale: 3.5, period: 4 },
        itemStyle: {
          color: state.palette[0] || "#06B6D4",
          shadowBlur: 8,
          shadowColor: state.palette[0] || "#06B6D4"
        },
        label: {
          show: true,
          formatter: "{b}",
          position: "right",
          color: state.textColor,
          fontSize: 10,
          fontFamily: state.fontFamily
        }
      }
    ]
  };
}

export function buildMapOption(mapData, worldStatus, state) {
  if (worldStatus !== "ready") {
    return {
      title: { text: "International Data Partnerships by Country", left: "left", textStyle: { fontSize: 13 } },
      graphic: {
        type: "text",
        left: "center",
        top: "middle",
        style: {
          text: worldStatus === "error" ? "World map data unavailable." : "Loading world map...",
          fontSize: 14,
          fontFamily: state.fontFamily,
          fill: state.textColor
        }
      }
    };
  }

  const data = Object.entries(mapData).map(([name, value]) => ({ name, value }));
  return {
    title: {
      text: "International Data Partnerships by Country",
      subtext: "Global research collaborative network (Choropleth)",
      left: "left",
      textStyle: { fontSize: 13, fontFamily: state.fontFamily, color: state.titleColor },
      subtextStyle: { fontSize: 11, fontFamily: state.fontFamily, color: state.subtitleColor }
    },
    tooltip: { trigger: "item", formatter: p => p.value != null ? `${p.name}: ${p.value} bilateral initiatives` : `${p.name}: no bilateral data` },
    visualMap: {
      min: 0,
      max: 200,
      left: "left",
      bottom: 20,
      calculable: true,
      inRange: { color: [state.backgroundColor === "rgba(0,0,0,0)" ? "#E2E8F0" : state.backgroundColor, state.palette[0] || "#06B6D4", state.palette[1] || "#3B82F6"] },
      textStyle: { color: state.textColor, fontFamily: state.fontFamily }
    },
    series: [{
      name: "Global Partnerships",
      type: "map",
      map: "world",
      roam: true,
      emphasis: {
        label: { show: true, color: state.titleColor },
        itemStyle: { areaColor: state.palette[2] || "#8F3D8F" }
      },
      data
    }]
  };
}

export function buildGraphOption(state) {
  const nodes = ["CDRI", "Datahub", "Ministries", "Donors", "Researchers", "Open Data", "Surveys"].map((n, i) => ({
    id: String(i),
    name: n,
    symbolSize: 28 + (n === "CDRI" ? 18 : 0)
  }));
  const links = [
    [0, 1], [1, 2], [1, 3], [1, 4], [0, 5], [5, 6]
  ].map(([a, b]) => ({ source: String(a), target: String(b) }));

  return {
    title: { text: "CDRI Datahub Architecture & Network", left: "left", textStyle: { fontSize: 13 } },
    series: [{
      type: "graph",
      layout: "force",
      roam: true,
      label: { show: true, color: state.textColor },
      force: { repulsion: 200, edgeLength: 100 },
      data: nodes,
      links,
      lineStyle: { color: state.axisLineColor, curveness: 0.15 }
    }]
  };
}
