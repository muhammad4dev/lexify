import { describe, it, expect } from "vitest";
import {
  parseStyleString, serializeStyleMap, setStyleProperty,
  isValidColor, isValidFontSize,
} from "../index.js";

describe("parseStyleString", () => {
  it("parses single declaration", () => expect(parseStyleString("color: red").get("color")).toBe("red"));
  it("parses multiple declarations", () => {
    const m = parseStyleString("color: red; font-size: 16px");
    expect(m.get("color")).toBe("red");
    expect(m.get("font-size")).toBe("16px");
  });
  it("handles trailing semicolon", () => expect(parseStyleString("color: red;").get("color")).toBe("red"));
  it("normalises property to lowercase", () => expect(parseStyleString("Color: red").get("color")).toBe("red"));
  it("returns empty map for empty string", () => expect(parseStyleString("").size).toBe(0));
  it("handles semicolons inside url()", () => {
    const m = parseStyleString("background: url(data:image/png;base64,abc)");
    expect(m.get("background")).toBe("url(data:image/png;base64,abc)");
  });
  it("handles semicolons inside rgb()", () => {
    const m = parseStyleString("color: rgb(255,0,0); font-size: 12px");
    expect(m.get("color")).toBe("rgb(255,0,0)");
    expect(m.get("font-size")).toBe("12px");
  });
});

describe("serializeStyleMap", () => {
  it("serialises single entry", () => expect(serializeStyleMap(new Map([["color","red"]]))).toBe("color: red"));
  it("serialises multiple entries", () => expect(serializeStyleMap(new Map([["color","red"],["font-size","16px"]]))).toBe("color: red; font-size: 16px"));
  it("returns empty string for empty map", () => expect(serializeStyleMap(new Map())).toBe(""));
});

describe("setStyleProperty", () => {
  it("adds new property", () => expect(parseStyleString(setStyleProperty("", "color", "red")).get("color")).toBe("red"));
  it("updates existing property", () => expect(parseStyleString(setStyleProperty("color: red", "color", "blue")).get("color")).toBe("blue"));
  it("removes property when null", () => expect(parseStyleString(setStyleProperty("color: red", "color", null)).has("color")).toBe(false));
  it("preserves other properties on remove", () => {
    const m = parseStyleString(setStyleProperty("color: red; font-size: 16px", "color", null));
    expect(m.has("color")).toBe(false);
    expect(m.get("font-size")).toBe("16px");
  });
  it("deduplicates on repeated set", () => {
    let s = setStyleProperty("", "color", "red");
    s = setStyleProperty(s, "color", "blue");
    const keys = Array.from(parseStyleString(s).keys()).filter(k => k === "color");
    expect(keys).toHaveLength(1);
    expect(parseStyleString(s).get("color")).toBe("blue");
  });
});

describe("isValidColor", () => {
  it.each(["#fff", "#ff0000", "#ff000080", "rgb(255,0,0)", "rgba(0,0,0,0.5)", "hsl(360,100%,50%)", "oklch(0.5 0.2 30)", "red", "transparent", "currentColor"])
    ("accepts: %s", (v) => expect(isValidColor(v)).toBe(true));
  it.each(["16px", "bold", "", "not-a-color", "##fff"])
    ("rejects: %s", (v) => expect(isValidColor(v)).toBe(false));
});

describe("isValidFontSize", () => {
  it.each(["16px", "1.5em", "100%", "12pt", "2rem"])
    ("accepts: %s", (v) => expect(isValidFontSize(v)).toBe(true));
  it.each(["red", "16", "bold", ""])
    ("rejects: %s", (v) => expect(isValidFontSize(v)).toBe(false));
});
