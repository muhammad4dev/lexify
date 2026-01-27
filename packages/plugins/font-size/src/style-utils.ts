// ─── Style string utilities ───────────────────────────────────────────────────

/**
 * Parse a CSS inline style string into a property → value map.
 * Preserves declaration order. Handles semicolons inside url() and strings.
 */
export function parseStyleString(style: string): Map<string, string> {
  const map = new Map<string, string>();
  // Split on semicolons that are not nested inside parentheses
  const declarations = splitDeclarations(style);
  for (const declaration of declarations) {
    const colonIdx = declaration.indexOf(":");
    if (colonIdx === -1) continue;
    const property = declaration.slice(0, colonIdx).trim().toLowerCase();
    const value = declaration.slice(colonIdx + 1).trim();
    if (property && value) {
      map.set(property, value);
    }
  }
  return map;
}

function splitDeclarations(style: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of style) {
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === ";" && depth === 0) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  if (current.trim()) result.push(current);
  return result;
}

/** Serialize a property → value map back to a CSS inline style string. */
export function serializeStyleMap(styles: Map<string, string>): string {
  return Array.from(styles.entries())
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}

/**
 * Set or remove a single CSS property within an existing inline style string.
 * Returns the updated style string.
 */
export function setStyleProperty(
  existing: string,
  property: string,
  value: string | null,
): string {
  const styles = parseStyleString(existing);
  if (value === null) {
    styles.delete(property.toLowerCase());
  } else {
    styles.set(property.toLowerCase(), value.trim());
  }
  return serializeStyleMap(styles);
}

// ─── Font-size validation ─────────────────────────────────────────────────────

const FONT_SIZE_RE = /^\d+(\.\d+)?(px|em|rem|%|pt|vh|vw|ch|ex)$/i;

export function isValidFontSize(value: string): boolean {
  return FONT_SIZE_RE.test(value.trim());
}
