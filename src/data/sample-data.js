import * as echarts from 'echarts';
import { CAMBODIA_GEOJSON } from './cambodia-geojson.js';
import { WORLD_GEOJSON } from './world-geojson.js';

// Auto-register Cambodia and World maps immediately (100% offline, zero network delay)
echarts.registerMap('cambodia', CAMBODIA_GEOJSON);
echarts.registerMap('world', WORLD_GEOJSON);

export const SECTORS = [
  "Education",
  "Agriculture",
  "Health",
  "Economy",
  "Governance",
  "Environment",
  "Infrastructure",
  "Social Protection"
];

export const QUARTERS = [
  "2023 Q3",
  "2023 Q4",
  "2024 Q1",
  "2024 Q2",
  "2024 Q3",
  "2024 Q4"
];

export function cloneDeep(o) {
  return JSON.parse(JSON.stringify(o));
}

export function jitter(v) {
  return Math.max(1, Math.round(v * (0.75 + Math.random() * 0.5)));
}

// All 25 official Cambodia provinces with CDRI indicators
export const CAMBODIA_PROVINCES = [
  { name: "Phnom Penh", value: 185, projects: 42, budget: 1400 },
  { name: "Siem Reap", value: 112, projects: 28, budget: 850 },
  { name: "Battambang", value: 96, projects: 24, budget: 720 },
  { name: "Kandal", value: 88, projects: 22, budget: 640 },
  { name: "Kampong Cham", value: 76, projects: 19, budget: 580 },
  { name: "Kampot", value: 70, projects: 18, budget: 510 },
  { name: "Preah Sihanouk", value: 68, projects: 16, budget: 490 },
  { name: "Kampong Thom", value: 62, projects: 15, budget: 440 },
  { name: "Takeo", value: 58, projects: 14, budget: 410 },
  { name: "Pursat", value: 54, projects: 13, budget: 390 },
  { name: "Banteay Meanchey", value: 50, projects: 12, budget: 370 },
  { name: "Kampong Speu", value: 48, projects: 11, budget: 350 },
  { name: "Kampong Chhnang", value: 44, projects: 10, budget: 320 },
  { name: "Prey Veng", value: 42, projects: 10, budget: 300 },
  { name: "Svay Rieng", value: 40, projects: 9, budget: 290 },
  { name: "Tbong Khmum", value: 36, projects: 9, budget: 260 },
  { name: "Kratie", value: 38, projects: 8, budget: 270 },
  { name: "Preah Vihear", value: 34, projects: 8, budget: 250 },
  { name: "Stung Treng", value: 32, projects: 7, budget: 230 },
  { name: "Oddar Meanchey", value: 30, projects: 7, budget: 210 },
  { name: "Koh Kong", value: 28, projects: 6, budget: 190 },
  { name: "Mondulkiri", value: 26, projects: 6, budget: 180 },
  { name: "Ratanakiri", value: 25, projects: 5, budget: 175 },
  { name: "Pailin", value: 22, projects: 5, budget: 150 },
  { name: "Kep", value: 18, projects: 4, budget: 130 }
];

export const CAMBODIA_CAPITALS = {
  "Phnom Penh": [104.9282, 11.5564],
  "Siem Reap": [103.8564, 13.3671],
  "Battambang": [103.1982, 13.0957],
  "Kandal": [104.9822, 11.4552],
  "Kampong Cham": [105.4645, 11.9934],
  "Kampot": [104.1814, 10.6104],
  "Preah Sihanouk": [103.5234, 10.6275],
  "Kampong Thom": [104.8887, 12.7111],
  "Takeo": [104.7988, 10.9908],
  "Pursat": [103.9192, 12.5388],
  "Banteay Meanchey": [102.9896, 13.5859],
  "Kampong Speu": [104.5209, 11.4533],
  "Kampong Chhnang": [104.6656, 12.2500],
  "Prey Veng": [105.3253, 11.4868],
  "Svay Rieng": [105.7993, 11.0879],
  "Kratie": [106.0188, 12.4881],
  "Preah Vihear": [104.9805, 13.8073],
  "Stung Treng": [105.9699, 13.5259],
  "Oddar Meanchey": [103.5176, 14.1818],
  "Koh Kong": [102.9838, 11.6153],
  "Mondulkiri": [107.1882, 12.4558],
  "Ratanakiri": [106.9873, 13.7394],
  "Pailin": [102.6093, 12.8489],
  "Tbong Khmum": [105.6592, 11.8891],
  "Kep": [104.3167, 10.4833]
};

export const TREEMAP_BASE = [
  {
    name: "Education",
    value: 126,
    children: [
      { name: "Primary Education", value: 52 },
      { name: "Secondary Education", value: 38 },
      { name: "Higher Education & TVET", value: 24 },
      { name: "Early Childhood Care", value: 12 }
    ]
  },
  {
    name: "Agriculture & Water",
    value: 108,
    children: [
      { name: "Paddy Rice Production", value: 48 },
      { name: "Irrigation Management", value: 32 },
      { name: "Horticulture & Cash Crops", value: 16 },
      { name: "Aquaculture & Inland Fisheries", value: 12 }
    ]
  },
  {
    name: "Health & Nutrition",
    value: 88,
    children: [
      { name: "Maternal & Child Health", value: 40 },
      { name: "Universal Health Coverage", value: 28 },
      { name: "Nutrition Interventions", value: 20 }
    ]
  },
  {
    name: "Economy & Trade",
    value: 78,
    children: [
      { name: "Garment & Manufacturing", value: 34 },
      { name: "SME Digital Adoption", value: 26 },
      { name: "Cross-Border Trade Facilitation", value: 18 }
    ]
  },
  {
    name: "Governance & Inclusion",
    value: 65,
    children: [
      { name: "Sub-National Administration", value: 35 },
      { name: "Public Financial Management", value: 30 }
    ]
  },
  {
    name: "Environment & Climate",
    value: 58,
    children: [
      { name: "Tonle Sap Ecosystem", value: 30 },
      { name: "Renewable Energy Transition", value: 28 }
    ]
  },
  {
    name: "Social Protection",
    value: 52,
    children: [
      { name: "IDPoor Digital Cash Transfer", value: 32 },
      { name: "Pension & Social Security", value: 20 }
    ]
  }
];

export const SUNBURST_BASE = [
  {
    name: "Education",
    children: [
      {
        name: "Basic Education",
        children: [
          { name: "Enrollment Rate", value: 30 },
          { name: "Dropout Rate", value: 18 }
        ]
      },
      {
        name: "Higher Ed",
        children: [
          { name: "STEM Graduates", value: 22 },
          { name: "Research Grants", value: 14 }
        ]
      }
    ]
  },
  {
    name: "Agriculture",
    children: [
      {
        name: "Crops",
        children: [
          { name: "Paddy Rice", value: 38 },
          { name: "Cassava & Pepper", value: 20 }
        ]
      },
      {
        name: "Fisheries",
        children: [
          { name: "Tonle Sap Catch", value: 24 },
          { name: "Aquaculture Output", value: 12 }
        ]
      }
    ]
  },
  {
    name: "Health",
    children: [
      {
        name: "Healthcare Access",
        children: [
          { name: "Health Centers", value: 26 },
          { name: "HEF Coverage", value: 22 }
        ]
      },
      {
        name: "Nutrition",
        children: [
          { name: "Stunting Reduction", value: 18 },
          { name: "Food Security", value: 14 }
        ]
      }
    ]
  },
  {
    name: "Economy",
    children: [
      {
        name: "Industry",
        children: [
          { name: "Garment & Footwear", value: 32 },
          { name: "Electronics", value: 16 }
        ]
      },
      {
        name: "Services",
        children: [
          { name: "Tourism Revenue", value: 24 },
          { name: "FinTech Transactions", value: 18 }
        ]
      }
    ]
  }
];

export const WATERFALL_BASE = {
  categories: [
    "Baseline Budget",
    "Gov Core Grant",
    "Partner Donors",
    "Private Endowment",
    "Field Surveys",
    "Policy Outreach",
    "Admin & Facilities",
    "Net Balance"
  ],
  steps: [120, 45, 60, 25, -42, -28, -35, 145]
};

export const PARALLEL_BASE = {
  dimensions: [
    { name: "Completeness", max: 100 },
    { name: "Timeliness", max: 100 },
    { name: "Data Quality", max: 10 },
    { name: "Downloads (k)", max: 200 },
    { name: "Policy Citations", max: 50 }
  ],
  data: [
    { name: "Education", value: [88, 82, 9.2, 165, 42] },
    { name: "Agriculture", value: [78, 90, 8.5, 140, 36] },
    { name: "Health", value: [94, 75, 9.6, 185, 48] },
    { name: "Economy", value: [82, 88, 8.8, 120, 31] },
    { name: "Environment", value: [71, 68, 7.9, 95, 24] }
  ]
};

export const BOXPLOT_BASE = [
  [8, 12, 15, 19, 26],
  [10, 14, 18, 23, 30],
  [6, 9, 12, 15, 20],
  [9, 13, 17, 21, 28],
  [11, 15, 19, 24, 32],
  [7, 10, 13, 17, 22],
  [12, 16, 21, 27, 35],
  [9, 12, 16, 20, 26]
];

export const MAP_BASE = {
  "Cambodia": 195, "China": 142, "Japan": 128, "United States": 115, "France": 92,
  "Australia": 88, "Korea": 82, "Germany": 78, "Vietnam": 95, "Thailand": 90,
  "United Kingdom": 74, "Canada": 65, "India": 98, "Indonesia": 84, "Singapore": 70,
  "Malaysia": 72, "Philippines": 68, "Laos": 62, "Myanmar": 55, "Brazil": 58,
  "South Africa": 52, "Sweden": 48, "Netherlands": 54, "Switzerland": 46, "Italy": 56
};

export const SAMPLE_BASE = {
  trend: {
    categories: [...QUARTERS],
    seriesNames: ["Education", "Health", "Agriculture", "Economy"],
    seriesData: [
      [42, 48, 55, 63, 71, 80],
      [30, 34, 37, 41, 46, 50],
      [58, 55, 60, 57, 62, 66],
      [24, 28, 35, 39, 44, 49]
    ]
  },
  stackedBar: {
    categories: [...SECTORS],
    seriesNames: ["Government Funded", "Donor Funded"],
    seriesData: [
      [70, 50, 60, 40, 45, 30, 35, 28],
      [56, 44, 28, 31, 20, 28, 17, 19]
    ]
  },
  pie: {
    categories: [...SECTORS],
    seriesNames: ["Datasets Published"],
    seriesData: [[126, 94, 88, 71, 65, 58, 52, 47]]
  },
  radar: {
    categories: [...SECTORS],
    seriesNames: ["2023 Coverage", "2024 Coverage"],
    seriesData: [
      [55, 60, 48, 62, 40, 45, 50, 38],
      [72, 74, 60, 78, 55, 58, 66, 50]
    ]
  },
  sankey: {
    nodes: ["Government", "Donors", "Surveys", "Education", "Health", "Agriculture", "Economy", "Published", "Review"].map(name => ({ name })),
    links: [
      { source: "Government", target: "Education", value: 40 },
      { source: "Government", target: "Health", value: 30 },
      { source: "Government", target: "Agriculture", value: 25 },
      { source: "Donors", target: "Education", value: 35 },
      { source: "Donors", target: "Health", value: 28 },
      { source: "Donors", target: "Economy", value: 20 },
      { source: "Surveys", target: "Agriculture", value: 22 },
      { source: "Surveys", target: "Economy", value: 18 },
      { source: "Education", target: "Published", value: 60 },
      { source: "Education", target: "Review", value: 15 },
      { source: "Health", target: "Published", value: 45 },
      { source: "Health", target: "Review", value: 13 },
      { source: "Agriculture", target: "Published", value: 38 },
      { source: "Agriculture", target: "Review", value: 9 },
      { source: "Economy", target: "Published", value: 30 },
      { source: "Economy", target: "Review", value: 8 }
    ]
  },
  bubble: {
    points: SECTORS.map((name, i) => ({
      name,
      x: [420, 260, 340, 190, 150, 130, 175, 110][i],
      y: [85, 60, 70, 40, 35, 30, 38, 45][i],
      size: [126, 94, 88, 71, 65, 58, 52, 47][i]
    }))
  },
  heatmap: (() => {
    const d = [];
    SECTORS.forEach((s, si) => QUARTERS.forEach((q, qi) => d.push([si, qi, Math.round(Math.random() * 12)])));
    return d;
  })(),
  candlestick: (() => {
    const days = Array.from({ length: 12 }, (_, i) => "W" + (i + 1));
    const vals = days.map(() => {
      const o = 80 + Math.random() * 30, c = o + (Math.random() - 0.5) * 20;
      const l = Math.min(o, c) - Math.random() * 10, h = Math.max(o, c) + Math.random() * 10;
      return [Math.round(o), Math.round(c), Math.round(l), Math.round(h)];
    });
    return { days, vals };
  })(),
  gauge: 78,
  treemap: cloneDeep(TREEMAP_BASE),
  sunburst: cloneDeep(SUNBURST_BASE),
  waterfall: cloneDeep(WATERFALL_BASE),
  parallel: cloneDeep(PARALLEL_BASE),
  cambodiaProvinces: cloneDeep(CAMBODIA_PROVINCES),
  cambodiaCapitals: cloneDeep(CAMBODIA_CAPITALS),
  boxplot: cloneDeep(BOXPLOT_BASE),
  map: cloneDeep(MAP_BASE)
};

export let worldMapStatus = "ready";

export function loadWorldMap(onReady) {
  worldMapStatus = "ready";
  if (onReady) onReady();
}
