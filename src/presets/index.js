import { cdriLight, cdriDark } from './cdri.js';
import { vintage, macarons, shine, infographic, roma, cyberDark } from './classic.js';

export const PRESETS = {
  cdriLight,
  cdriDark,
  vintage,
  macarons,
  shine,
  infographic,
  roma,
  cyberDark
};

export const QUICK_PALETTES = {
  datahub: ["#14A0B8", "#4994DF", "#4C41C8", "#8F3D8F", "#DA2F54", "#F59847", "#BD910F", "#485922"],
  vibrant: ["#00C49F", "#0088FE", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57"],
  warm: ["#E76F51", "#F4A261", "#E9C46A", "#2A9D8F", "#264653", "#D62828"],
  cool: ["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8", "#48CAE4"],
  forest: ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2", "#D8F3DC"],
  highcontrast: ["#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442", "#0072B2"]
};

export function getPreset(key) {
  return PRESETS[key] ? JSON.parse(JSON.stringify(PRESETS[key])) : null;
}
