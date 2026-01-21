import { describe, it, expect } from "vitest";
import { baseTheme, darkTheme } from "../index.js";
import type { LexraTheme } from "../index.js";

// ─── Shape tests ──────────────────────────────────────────────────────────────

describe("baseTheme", () => {
  it("satisfies LexraTheme type (compilation check)", () => {
    const _check: LexraTheme = baseTheme;
    expect(_check).toBeTruthy();
  });

  it("has root class", () => expect(baseTheme.root).toBe("lexra-root"));
  it("has paragraph class", () => expect(baseTheme.paragraph).toBe("lexra-paragraph"));
  it("has quote class", () => expect(baseTheme.quote).toBe("lexra-quote"));

  describe("heading", () => {
    it.each(["h1","h2","h3","h4","h5","h6"] as const)("has %s class", (tag) => {
      expect(baseTheme.heading?.[tag]).toBe(`lexra-${tag}`);
    });
  });

  describe("list", () => {
    it("has ul/ol classes", () => {
      expect(baseTheme.list?.ul).toBe("lexra-ul");
      expect(baseTheme.list?.ol).toBe("lexra-ol");
    });
    it("has listitem class", () => expect(baseTheme.list?.listitem).toBe("lexra-listitem"));
    it("has nested list/listitem", () => {
      expect(baseTheme.list?.nested?.list).toBe("lexra-nested-list");
      expect(baseTheme.list?.nested?.listitem).toBe("lexra-nested-listitem");
    });
    it("has ulDepth and olDepth arrays", () => {
      expect(Array.isArray(baseTheme.list?.ulDepth)).toBe(true);
      expect(Array.isArray(baseTheme.list?.olDepth)).toBe(true);
      expect(baseTheme.list?.ulDepth?.length).toBeGreaterThan(0);
    });
    it("has checklist classes", () => {
      expect(baseTheme.list?.checklist).toBe("lexra-checklist");
      expect(baseTheme.list?.listitemChecked).toBe("lexra-listitem-checked");
      expect(baseTheme.list?.listitemUnchecked).toBe("lexra-listitem-unchecked");
    });
  });

  it("has link class", () => expect(baseTheme.link).toBe("lexra-link"));
  it("has code block class", () => expect(baseTheme.code).toBe("lexra-code-block"));

  describe("codeHighlight", () => {
    it("has entries for common token types", () => {
      expect(baseTheme.codeHighlight?.["keyword"]).toBeDefined();
      expect(baseTheme.codeHighlight?.["string"]).toBeDefined();
      expect(baseTheme.codeHighlight?.["comment"]).toBeDefined();
      expect(baseTheme.codeHighlight?.["function"]).toBeDefined();
    });
    it("all values start with lexra-code-", () => {
      for (const v of Object.values(baseTheme.codeHighlight ?? {})) {
        expect(v).toMatch(/^lexra-code-/);
      }
    });
  });

  describe("text", () => {
    it.each(["bold","italic","underline","strikethrough","code"] as const)("has %s class", (format) => {
      expect(baseTheme.text?.[format]).toMatch(/^lexra-text-/);
    });
    it("has underlineStrikethrough class", () => {
      expect(baseTheme.text?.underlineStrikethrough).toBeDefined();
    });
    it("has subscript and superscript classes", () => {
      expect(baseTheme.text?.subscript).toBeDefined();
      expect(baseTheme.text?.superscript).toBeDefined();
    });
  });

  it("has mark and markOverlap classes", () => {
    expect(baseTheme.mark).toBe("lexra-mark");
    expect(baseTheme.markOverlap).toBe("lexra-mark-overlap");
  });

  it("has table classes", () => {
    expect(baseTheme.table).toBe("lexra-table");
    expect(baseTheme.tableCell).toBe("lexra-table-cell");
    expect(baseTheme.tableCellHeader).toBe("lexra-table-cell-header");
  });

  it("all string class names are non-empty strings", () => {
    function checkValues(obj: LexraTheme): void {
      for (const [, v] of Object.entries(obj)) {
        if (typeof v === "string") {
          expect(v.length).toBeGreaterThan(0);
        } else if (Array.isArray(v)) {
          for (const s of v as string[]) expect(s.length).toBeGreaterThan(0);
        } else if (v !== null && typeof v === "object") {
          checkValues(v as LexraTheme);
        }
      }
    }
    checkValues(baseTheme);
  });
});

// ─── darkTheme ────────────────────────────────────────────────────────────────

describe("darkTheme", () => {
  it("satisfies LexraTheme type", () => {
    const _check: LexraTheme = darkTheme;
    expect(_check).toBeTruthy();
  });

  it("appends -dark suffix to root-level string values", () => {
    expect(darkTheme.root).toBe("lexra-root-dark");
    expect(darkTheme.paragraph).toBe("lexra-paragraph-dark");
    expect(darkTheme.link).toBe("lexra-link-dark");
  });

  it("applies -dark to nested heading values", () => {
    expect(darkTheme.heading?.h1).toBe("lexra-h1-dark");
    expect(darkTheme.heading?.h3).toBe("lexra-h3-dark");
  });

  it("applies -dark to text format classes", () => {
    expect(darkTheme.text?.bold).toBe("lexra-text-bold-dark");
    expect(darkTheme.text?.italic).toBe("lexra-text-italic-dark");
  });

  it("applies -dark to list array depths", () => {
    expect(darkTheme.list?.ulDepth?.[0]).toBe("lexra-ul-depth-1-dark");
    expect(darkTheme.list?.olDepth?.[1]).toBe("lexra-ol-depth-2-dark");
  });

  it("is distinct from baseTheme", () => {
    expect(darkTheme.root).not.toBe(baseTheme.root);
  });
});
