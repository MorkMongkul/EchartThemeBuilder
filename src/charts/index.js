import { buildLineOption, buildAreaOption } from './line-area.js';
import { buildBarOption, buildHorizontalBarOption, buildWaterfallOption } from './bar.js';
import { buildScatterOption, buildHeatmapOption, buildBoxplotOption, buildParallelOption } from './distribution.js';
import { buildPieOption, buildFunnelOption, buildTreemapOption, buildSunburstOption, buildRoseOption } from './pie-funnel.js';
import { buildSankeyOption, buildMapOption, buildGraphOption, buildCambodiaChoroplethOption, buildCambodiaBubbleOption } from './flow-geo.js';
import {
  buildRadarOption,
  buildGaugeOption,
  buildCandlestickOption,
  buildKpiSparklineOption,
  buildKpiBarSparklineOption,
  buildKpiRingOption,
  buildKpiProgressOption,
  buildExecutiveScorecardOption
} from './kpi.js';

export {
  buildLineOption,
  buildAreaOption,
  buildBarOption,
  buildHorizontalBarOption,
  buildWaterfallOption,
  buildScatterOption,
  buildHeatmapOption,
  buildBoxplotOption,
  buildParallelOption,
  buildPieOption,
  buildFunnelOption,
  buildTreemapOption,
  buildSunburstOption,
  buildRoseOption,
  buildSankeyOption,
  buildMapOption,
  buildCambodiaChoroplethOption,
  buildCambodiaBubbleOption,
  buildGraphOption,
  buildRadarOption,
  buildGaugeOption,
  buildCandlestickOption,
  buildKpiSparklineOption,
  buildKpiBarSparklineOption,
  buildKpiRingOption,
  buildKpiProgressOption,
  buildExecutiveScorecardOption
};

/**
 * Resolves chart option for any chart type in single focus mode.
 */
export function getFocusChartOption(type, data, worldStatus, state) {
  let opt = {};

  switch (type) {
    case 'cambodiaChoropleth':
      opt = buildCambodiaChoroplethOption(data.cambodiaProvinces, state);
      break;
    case 'cambodiaBubble':
      opt = buildCambodiaBubbleOption(data.cambodiaProvinces, data.cambodiaCapitals, state);
      break;
    case 'map':
      opt = buildMapOption(data.map, worldStatus, state);
      break;
    case 'treemap':
      opt = buildTreemapOption(data.treemap, state);
      break;
    case 'sunburst':
      opt = buildSunburstOption(data.sunburst, state);
      break;
    case 'rose':
      opt = buildRoseOption(data.pie, state);
      break;
    case 'waterfall':
      opt = buildWaterfallOption(data.waterfall, state);
      break;
    case 'parallel':
      opt = buildParallelOption(data.parallel, state);
      break;
    case 'line':
    case 'lineSmooth':
      opt = buildLineOption(data.trend, state, type === 'lineSmooth');
      break;
    case 'area':
    case 'stackedArea':
      opt = buildAreaOption(data.trend, state, type === 'stackedArea');
      break;
    case 'bar':
    case 'stackedBar':
      opt = buildBarOption(data.stackedBar, state, type === 'stackedBar');
      break;
    case 'horizontalBar':
      opt = buildHorizontalBarOption(data.stackedBar, state);
      break;
    case 'pie':
    case 'doughnut':
      opt = buildPieOption(data.pie, state, type === 'doughnut', true);
      break;
    case 'funnel':
      opt = buildFunnelOption(data.pie, state);
      break;
    case 'boxplot':
      opt = buildBoxplotOption(data.boxplot, data.sectors, state);
      break;
    case 'scatter':
    case 'bubble':
      opt = buildScatterOption(data.bubble, state);
      break;
    case 'radar':
      opt = buildRadarOption(data.radar, state);
      break;
    case 'heatmap':
      opt = buildHeatmapOption(data.heatmap, data.sectors, data.quarters, state);
      break;
    case 'candlestick':
      opt = buildCandlestickOption(data.candlestick, state);
      break;
    case 'gauge':
      opt = buildGaugeOption(data.gauge, state);
      break;
    case 'kpiScorecard':
      opt = buildExecutiveScorecardOption(data, state);
      break;
    case 'sankey':
      opt = buildSankeyOption(data.sankey, state);
      break;
    case 'graph':
      opt = buildGraphOption(state);
      break;
    default:
      opt = buildCambodiaChoroplethOption(data.cambodiaProvinces, state);
  }

  // Interactive dataZoom for continuous coordinate axes
  if (opt.xAxis && opt.xAxis.type === 'category') {
    opt.dataZoom = [
      { type: 'inside' },
      { type: 'slider', bottom: 8, height: 16, borderColor: 'transparent' }
    ];
  }

  return opt;
}
