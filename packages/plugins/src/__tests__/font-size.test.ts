import { describe, it, expect, vi } from "vitest";
import {
  fontSizePlugin,
  SET_FONT_SIZE_COMMAND,
  REMOVE_FONT_SIZE_COMMAND,
  parseStyleString,
  serializeStyleMap,
  setStyleProperty,
  isValidFontSize,
} from "../index.js";
import { createEditor } from "@lexify/core";

// ─── style-utils ─────────────────────────────────────────────────────────────

describe("parseStyleString", () => {
  it("parses a single declaration", () => {
    const m = parseStyleString("font-size: 16px");
    expect(m.get("font-size")).toBe("16px");
  });

  it("parses multiple declarations", () => {
    const m = parseStyleString("font-size: 16px; color: red");
    expect(m.get("font-size")).toBe("16px");
    expect(m.get("color")).toBe("red");
  });

  it("handles trailing semicolon", () => {
    const m = parseStyleString("font-size: 16px;");
    expect(m.get("font-size")).toBe("16px");
  });

  it("normalises property name to lowercase", () => {
    const m = parseStyleString("Font-Size: 16px");
    expect(m.get("font-size")).toBe("16px");
  });

  it("returns empty map for empty string", () => {
    expect(parseStyleString("").size).toBe(0);
  });

  it("handles values containing colons (e.g. data URIs)", () => {
    const m = parseStyleString("background: url(data:image/png;base64,abc)");
    expect(m.get("background")).toBe("url(data:image/png;base64,abc)");
  });
});

describe("serializeStyleMap", () => {
  it("serialises a single entry", () => {
    const m = new Map([["font-size", "16px"]]);
    expect(serializeStyleMap(m)).toBe("font-size: 16px");
  });

  it("serialises multiple entries with semicolon separator", () => {
    const m = new Map([
      ["font-size", "16px"],
      ["color", "red"],
    ]);
    expect(serializeStyleMap(m)).toBe("font-size: 16px; color: red");
  });

  it("returns empty string for empty map", () => {
    expect(serializeStyleMap(new Map())).toBe("");
  });
});

describe("setStyleProperty", () => {
  it("adds a new property to an empty style", () => {
    expect(setStyleProperty("", "font-size", "16px")).toBe("font-size: 16px");
  });

  it("updates an existing property", () => {
    const result = setStyleProperty(
      "font-size: 14px; color: red",
      "font-size",
      "18px",
    );
    const m = parseStyleString(result);
    expect(m.get("font-size")).toBe("18px");
    expect(m.get("color")).toBe("red");
  });

  it("preserves unrelated properties", () => {
    const result = setStyleProperty(
      "color: blue; font-weight: bold",
      "font-size",
      "12px",
    );
    const m = parseStyleString(result);
    expect(m.get("color")).toBe("blue");
    expect(m.get("font-weight")).toBe("bold");
    expect(m.get("font-size")).toBe("12px");
  });

  it("removes a property when value is null", () => {
    const result = setStyleProperty(
      "font-size: 16px; color: red",
      "font-size",
      null,
    );
    const m = parseStyleString(result);
    expect(m.has("font-size")).toBe(false);
    expect(m.get("color")).toBe("red");
  });

  it("is a no-op when removing a non-existent property", () => {
    const result = setStyleProperty("color: red", "font-size", null);
    expect(parseStyleString(result).get("color")).toBe("red");
  });

  it("does not duplicate a property on repeated set", () => {
    let style = "";
    style = setStyleProperty(style, "font-size", "14px");
    style = setStyleProperty(style, "font-size", "16px");
    const m = parseStyleString(style);
    expect(m.get("font-size")).toBe("16px");
    // Ensure only one font-size key
    const allKeys = Array.from(m.keys()).filter((k) => k === "font-size");
    expect(allKeys).toHaveLength(1);
  });
});

describe("isValidFontSize", () => {
  it.each([
    "16px",
    "1.5em",
    "100%",
    "0.8rem",
    "12pt",
    "2vh",
    "3vw",
    "1ch",
    "2ex",
  ])("accepts valid value: %s", (v) => expect(isValidFontSize(v)).toBe(true));

  it.each(["red", "bold", "16", "auto", "", "16 px", "px16"])(
    "rejects invalid value: %s",
    (v) => expect(isValidFontSize(v)).toBe(false),
  );
});

// ─── fontSizePlugin ───────────────────────────────────────────────────────────

describe("fontSizePlugin", () => {
  it("has the correct name", () => {
    expect(fontSizePlugin.name).toBe("lexify/font-size");
  });

  it("registers handlers for both commands", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    fontSizePlugin.register(editor);
    const types = spy.mock.calls.map((c) => c[0].type);
    expect(types).toContain("lexify:style:font-size");
    expect(types).toContain("lexify:style:font-size:remove");
  });

  it("calls update for SET_FONT_SIZE_COMMAND with valid value", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontSizePlugin.register(editor);
    editor.dispatchCommand(SET_FONT_SIZE_COMMAND, "16px");
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("skips update for SET_FONT_SIZE_COMMAND with invalid value", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    fontSizePlugin.register(editor);
    editor.dispatchCommand(SET_FONT_SIZE_COMMAND, "invalid");
    expect(updateSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledOnce();
    warnSpy.mockRestore();
  });

  it("calls update for REMOVE_FONT_SIZE_COMMAND", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontSizePlugin.register(editor);
    editor.dispatchCommand(REMOVE_FONT_SIZE_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("unregisters both handlers on cleanup", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = fontSizePlugin.register(editor);
    cleanup();
    editor.dispatchCommand(SET_FONT_SIZE_COMMAND, "16px");
    editor.dispatchCommand(REMOVE_FONT_SIZE_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });
});
