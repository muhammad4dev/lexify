import { describe, it, expect, vi } from "vitest";
import { fontColorPlugin, SET_FONT_COLOR_COMMAND, REMOVE_FONT_COLOR_COMMAND } from "../index.js";
import { createEditor } from "@lexra/core";

describe("fontColorPlugin", () => {
  it("has the correct name", () => {
    expect(fontColorPlugin.name).toBe("lexra/font-color");
  });

  it("has no nodes (no custom node registration needed)", () => {
    expect(fontColorPlugin.nodes).toBeUndefined();
  });

  it("registers handlers for both commands", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    fontColorPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(SET_FONT_COLOR_COMMAND, expect.any(Function));
    expect(spy).toHaveBeenCalledWith(REMOVE_FONT_COLOR_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof fontColorPlugin.register(editor)).toBe("function");
  });

  it("calls update when SET_FONT_COLOR_COMMAND dispatched with valid color", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontColorPlugin.register(editor);
    editor.dispatchCommand(SET_FONT_COLOR_COMMAND, "#ff0000");
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("does NOT call update when dispatched with invalid color", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    fontColorPlugin.register(editor);
    editor.dispatchCommand(SET_FONT_COLOR_COMMAND, "not-a-color");
    expect(updateSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("warns when dispatched with invalid color", () => {
    const editor = createEditor({ namespace: "test" });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    fontColorPlugin.register(editor);
    editor.dispatchCommand(SET_FONT_COLOR_COMMAND, "16px");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("Invalid color value"));
    warnSpy.mockRestore();
  });

  it("accepts hex colors", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontColorPlugin.register(editor);
    for (const color of ["#fff", "#ff0000", "#ff000080"]) {
      editor.dispatchCommand(SET_FONT_COLOR_COMMAND, color);
    }
    expect(updateSpy).toHaveBeenCalledTimes(3);
  });

  it("accepts functional color notation", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontColorPlugin.register(editor);
    for (const color of ["rgb(255,0,0)", "rgba(0,0,0,0.5)", "hsl(120,100%,50%)"]) {
      editor.dispatchCommand(SET_FONT_COLOR_COMMAND, color);
    }
    expect(updateSpy).toHaveBeenCalledTimes(3);
  });

  it("accepts named colors", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontColorPlugin.register(editor);
    for (const color of ["red", "blue", "transparent"]) {
      editor.dispatchCommand(SET_FONT_COLOR_COMMAND, color);
    }
    expect(updateSpy).toHaveBeenCalledTimes(3);
  });

  it("calls update when REMOVE_FONT_COLOR_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    fontColorPlugin.register(editor);
    editor.dispatchCommand(REMOVE_FONT_COLOR_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("unregisters on cleanup", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = fontColorPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(SET_FONT_COLOR_COMMAND, "red");
    expect(updateSpy).not.toHaveBeenCalled();
  });
});

describe("SET_FONT_COLOR_COMMAND", () => {
  it("has the correct type string", () => {
    expect(SET_FONT_COLOR_COMMAND.type).toBe("lexra:style:font-color");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(SET_FONT_COLOR_COMMAND)).toEqual(["type"]);
  });
});
