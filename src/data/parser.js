/**
 * CSV / JSON parser & column auto-mapping utilities
 */

export function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = "";
      } else if (c === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === '\r') {
        // ignore carriage return
      } else {
        field += c;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter(r => r.length > 1 || (r.length === 1 && r[0] !== ""));
}

export function parseUploadedText(text, isJson) {
  if (isJson) {
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("File is not valid JSON.");
    }
    if (!Array.isArray(data) || !data.length || typeof data[0] !== "object") {
      throw new Error('Expected JSON array of objects, e.g. [{"Category":"Education","Value":42}, ...].');
    }
    const headers = [];
    data.forEach(row => Object.keys(row).forEach(k => {
      if (!headers.includes(k)) headers.push(k);
    }));
    const rows = data.map(row => headers.map(h => row[h] !== undefined ? row[h] : ""));
    return { headers, rows };
  }

  const table = parseCSV(text);
  if (table.length < 2) {
    throw new Error("Expected a CSV with a header row and at least one data row.");
  }
  const headers = table[0].map(h => h.trim());
  const rows = table.slice(1).map(r => headers.map((_, i) => (r[i] !== undefined ? r[i].trim() : "")));
  return { headers, rows };
}

export function isNumeric(v) {
  if (v === "" || v === null || v === undefined) return false;
  return isFinite(Number(v));
}

export function computeColTypes(headers, rows) {
  return headers.map((_, ci) => {
    const vals = rows.map(r => r[ci]).filter(v => v !== "" && v !== null && v !== undefined);
    return vals.length > 0 && vals.every(isNumeric);
  });
}

export function autoMapColumns(headers, rows, colNumeric) {
  const firstText = colNumeric.findIndex(n => !n);
  const category = firstText >= 0 ? firstText : 0;
  const series = colNumeric
    .map((n, i) => n && i !== category ? i : -1)
    .filter(i => i >= 0)
    .slice(0, 8);
  const numericCols = colNumeric.map((n, i) => n ? i : -1).filter(i => i >= 0);
  const x = numericCols.length ? numericCols[0] : null;
  const y = numericCols.length > 1 ? numericCols[1] : null;
  const size = numericCols.length > 2 ? numericCols[2] : null;
  const group = (firstText >= 0 && firstText !== x) ? firstText : null;
  const source = headers.length ? 0 : null;
  const target = headers.length > 1 ? 1 : null;
  const valCol = numericCols.find(i => i !== source && i !== target);
  const value = valCol !== undefined ? valCol : (numericCols.length ? numericCols[0] : null);

  return { category, series, x, y, size, group, source, target, value };
}
