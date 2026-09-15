/**
 * Code formatting & file export utilities
 */

export function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(text, onSuccess, onError) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
  } else {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      if (onSuccess) onSuccess();
    } catch (e) {
      if (onError) onError(e);
    }
  }
}

export function formatJsSnippet(themeName, themeObj) {
  return (
`// Apache ECharts Theme: ${themeName}
// Generated with CDRI Datahub Theme Builder

export const ${themeName} = ${JSON.stringify(themeObj, null, 2)};

// Direct browser / UMD registration:
if (typeof echarts !== 'undefined') {
  echarts.registerTheme('${themeName}', ${themeName});
}
`
  );
}
