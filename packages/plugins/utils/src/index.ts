// ─── CSS inline style utilities ───────────────────────────────────────────────

/**
 * Parse a CSS inline style string into a property → value map.
 * Handles semicolons inside url() and functional notation.
 */
export function parseStyleString(style: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const declaration of splitDeclarations(style)) {
    const colonIdx = declaration.indexOf(":");
    if (colonIdx === -1) continue;
    const property = declaration.slice(0, colonIdx).trim().toLowerCase();
    const value = declaration.slice(colonIdx + 1).trim();
    if (property && value) map.set(property, value);
  }
  return map;
}

/** Serialize a property → value map to a CSS inline style string. */
export function serializeStyleMap(styles: Map<string, string>): string {
  return Array.from(styles.entries())
    .map(([k, v]) => `${k}: ${v}`)
    .join("; ");
}

/**
 * Set or remove a single CSS property within an inline style string.
 * Passing `null` removes the property. Deduplicates on repeated set.
 */
export function setStyleProperty(
  existing: string,
  property: string,
  value: string | null,
): string {
  const styles = parseStyleString(existing);
  const key = property.toLowerCase();
  if (value === null) {
    styles.delete(key);
  } else {
    styles.set(key, value.trim());
  }
  return serializeStyleMap(styles);
}

/** Split a CSS style string on semicolons, respecting paren depth. */
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

// ─── Color validation ─────────────────────────────────────────────────────────

const HEX_COLOR_RE = /^#[0-9a-f]{3,8}$/i;
const FUNCTIONAL_COLOR_RE = /^(rgb|rgba|hsl|hsla|hwb|oklch|oklab|lab|lch|color)\s*\(/i;
const NAMED_COLORS = new Set([
  "black", "white", "red", "green", "blue", "yellow", "orange", "purple",
  "pink", "brown", "gray", "grey", "cyan", "magenta", "lime", "maroon",
  "navy", "olive", "teal", "silver", "aqua", "fuchsia", "coral", "indigo",
  "violet", "gold", "tan", "beige", "ivory", "lavender", "salmon", "turquoise",
  "transparent", "currentcolor", "inherit", "initial", "unset",
]);

export function isValidColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  return HEX_COLOR_RE.test(v) || FUNCTIONAL_COLOR_RE.test(v) || NAMED_COLORS.has(v);
}

// ─── Font-size validation ─────────────────────────────────────────────────────

const FONT_SIZE_RE = /^\d+(\.\d+)?(px|em|rem|%|pt|vh|vw|ch|ex)$/i;

export function isValidFontSize(value: string): boolean {
  return FONT_SIZE_RE.test(value.trim());
}
