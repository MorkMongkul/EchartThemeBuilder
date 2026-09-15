/**
 * Accessibility & Contrast Utilities
 * WCAG 2.1 AA Graphical Objects Threshold: >= 3.0:1
 */

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const num = parseInt(v, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function relLuminance(rgb) {
  const chan = c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * chan(rgb[0]) + 0.7152 * chan(rgb[1]) + 0.0722 * chan(rgb[2]);
}

export function contrastRatio(hex1, hex2) {
  const l1 = relLuminance(hexToRgb(hex1));
  const l2 = relLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isDarkHex(hex) {
  if (!hex || !/^#[0-9A-Fa-f]{3,6}$/.test(hex)) return false;
  return relLuminance(hexToRgb(hex)) < 0.2;
}

export function updateWCAGAnalysis(palette, backgroundColor, isTransparent) {
  const baseBg = isTransparent ? "#ffffff" : backgroundColor;
  let failCount = 0;
  const badges = document.querySelectorAll(".swatch-wcag-badge");

  palette.forEach((hex, i) => {
    const ratio = contrastRatio(hex, baseBg);
    const fails = ratio < 3.0;
    if (fails) failCount++;
    if (badges[i]) {
      badges[i].style.display = fails ? "flex" : "none";
      badges[i].title = `${ratio.toFixed(2)}:1 contrast against background (WCAG AA graphical min: 3:1)`;
    }
  });

  const card = document.getElementById("wcagBadge");
  if (card) {
    if (failCount === 0) {
      card.className = "contrast-card ok";
      card.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg> All ${palette.length} colors pass WCAG AA contrast (&ge;3:1)`;
    } else {
      card.className = "contrast-card warn";
      card.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${failCount} of ${palette.length} colors fall below 3:1 contrast against canvas`;
    }
  }
}

export function applyCvdFilter(filterVal, stageElement) {
  if (!stageElement) return;
  if (filterVal === "none") {
    stageElement.style.filter = "none";
  } else {
    stageElement.style.filter = `url(#${filterVal})`;
  }
}
