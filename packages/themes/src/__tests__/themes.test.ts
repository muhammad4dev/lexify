import { describe, it, expect } from "vitest";
import { baseTheme, darkTheme } from "../index.js";
import type { LexifyTheme } from "../index.js";

// ─── Shape tests ──────────────────────────────────────────────────────────────

describe("baseTheme", () => {
  it("satisfies LexifyTheme type (compilation check)", () => {
    const _check: LexifyTheme = baseTheme;
    expect(_check).toBeTruthy();
  });

  it("has root class", () => expect(baseTheme.root).toBe("lexify-root"));
  it("has paragraph class", () =>
    expect(baseTheme.paragraph).toBe("lexify-paragraph"));
  it("has quote class", () => expect(baseTheme.quote).toBe("lexify-quote"));

  describe("heading", () => {
    it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)(
      "has %s class",
      (tag) => {
        expect(baseTheme.heading?.[tag]).toBe(`lexify-${tag}`);
      },
    );
  });

  describe("list", () => {
    it("has ul/ol classes", () => {
      expect(baseTheme.list?.ul).toBe("lexify-ul");
      expect(baseTheme.list?.ol).toBe("lexify-ol");
    });
    it("has listitem class", () =>
      expect(baseTheme.list?.listitem).toBe("lexify-listitem"));
    it("has nested list/listitem", () => {
      expect(baseTheme.list?.nested?.list).toBe("lexify-nested-list");
      expect(baseTheme.list?.nested?.listitem).toBe("lexify-nested-listitem");
    });
    it("has ulDepth and olDepth arrays", () => {
      expect(Array.isArray(baseTheme.list?.ulDepth)).toBe(true);
      expect(Array.isArray(baseTheme.list?.olDepth)).toBe(true);
      expect(baseTheme.list?.ulDepth?.length).toBeGreaterThan(0);
    });
    it("has checklist classes", () => {
      expect(baseTheme.list?.checklist).toBe("lexify-checklist");
      expect(baseTheme.list?.listitemChecked).toBe("lexify-listitem-checked");
      expect(baseTheme.list?.listitemUnchecked).toBe(
        "lexify-listitem-unchecked",
      );
    });
  });

  it("has link class", () => expect(baseTheme.link).toBe("lexify-link"));
  it("has code block class", () =>
    expect(baseTheme.code).toBe("lexify-code-block"));

  describe("codeHighlight", () => {
    it("has entries for common token types", () => {
      expect(baseTheme.codeHighlight?.["keyword"]).toBeDefined();
      expect(baseTheme.codeHighlight?.["string"]).toBeDefined();
      expect(baseTheme.codeHighlight?.["comment"]).toBeDefined();
      expect(baseTheme.codeHighlight?.["function"]).toBeDefined();
    });
    it("all values start with lexify-code-", () => {
      for (const v of Object.values(baseTheme.codeHighlight ?? {})) {
        expect(v).toMatch(/^lexify-code-/);
      }
    });
  });

  describe("text", () => {
    it.each(["bold", "italic", "underline", "strikethrough", "code"] as const)(
      "has %s class",
      (format) => {
        expect(baseTheme.text?.[format]).toMatch(/^lexify-text-/);
      },
    );
    it("has underlineStrikethrough class", () => {
      expect(baseTheme.text?.underlineStrikethrough).toBeDefined();
    });
    it("has subscript and superscript classes", () => {
      expect(baseTheme.text?.subscript).toBeDefined();
      expect(baseTheme.text?.superscript).toBeDefined();
    });
  });

  it("has mark and markOverlap classes", () => {
    expect(baseTheme.mark).toBe("lexify-mark");
    expect(baseTheme.markOverlap).toBe("lexify-mark-overlap");
  });

  it("has table classes", () => {
    expect(baseTheme.table).toBe("lexify-table");
    expect(baseTheme.tableCell).toBe("lexify-table-cell");
    expect(baseTheme.tableCellHeader).toBe("lexify-table-cell-header");
  });

  it("all string class names are non-empty strings", () => {
    function checkValues(obj: LexifyTheme): void {
      for (const [, v] of Object.entries(obj)) {
        if (typeof v === "string") {
          expect(v.length).toBeGreaterThan(0);
        } else if (Array.isArray(v)) {
          for (const s of v as string[]) expect(s.length).toBeGreaterThan(0);
        } else if (v !== null && typeof v === "object") {
          checkValues(v as LexifyTheme);
        }
      }
    }
    checkValues(baseTheme);
  });
});

// ─── darkTheme ────────────────────────────────────────────────────────────────

describe("darkTheme", () => {
  it("satisfies LexifyTheme type", () => {
    const _check: LexifyTheme = darkTheme;
    expect(_check).toBeTruthy();
  });

  it("appends -dark suffix to root-level string values", () => {
    expect(darkTheme.root).toBe("lexify-root-dark");
    expect(darkTheme.paragraph).toBe("lexify-paragraph-dark");
    expect(darkTheme.link).toBe("lexify-link-dark");
  });

  it("applies -dark to nested heading values", () => {
    expect(darkTheme.heading?.h1).toBe("lexify-h1-dark");
    expect(darkTheme.heading?.h3).toBe("lexify-h3-dark");
  });

  it("applies -dark to text format classes", () => {
    expect(darkTheme.text?.bold).toBe("lexify-text-bold-dark");
    expect(darkTheme.text?.italic).toBe("lexify-text-italic-dark");
  });

  it("applies -dark to list array depths", () => {
    expect(darkTheme.list?.ulDepth?.[0]).toBe("lexify-ul-depth-1-dark");
    expect(darkTheme.list?.olDepth?.[1]).toBe("lexify-ol-depth-2-dark");
  });

  it("is distinct from baseTheme", () => {
    expect(darkTheme.root).not.toBe(baseTheme.root);
  });
});
