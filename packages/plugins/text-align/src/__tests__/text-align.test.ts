import { describe, it, expect, vi } from "vitest";
import { textAlignPlugin, SET_TEXT_ALIGN_COMMAND } from "../index.js";
import type { TextAlignValue } from "../index.js";
import { createEditor } from "@lexra/core";

describe("textAlignPlugin", () => {
  it("has the correct name", () => {
    expect(textAlignPlugin.name).toBe("lexra/text-align");
  });

  it("has no nodes (no custom node registration needed)", () => {
    expect(textAlignPlugin.nodes).toBeUndefined();
  });

  it("registers a handler for SET_TEXT_ALIGN_COMMAND", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    textAlignPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(SET_TEXT_ALIGN_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof textAlignPlugin.register(editor)).toBe("function");
  });

  it("calls update when SET_TEXT_ALIGN_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    textAlignPlugin.register(editor);
    editor.dispatchCommand(SET_TEXT_ALIGN_COMMAND, "center");
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("unregisters on cleanup", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = textAlignPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(SET_TEXT_ALIGN_COMMAND, "left");
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("accepts all valid alignment values", () => {
    const values: TextAlignValue[] = ["left", "right", "center", "justify", "start", "end"];
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    textAlignPlugin.register(editor);
    for (const v of values) {
      editor.dispatchCommand(SET_TEXT_ALIGN_COMMAND, v);
    }
    expect(updateSpy).toHaveBeenCalledTimes(values.length);
  });
});

describe("SET_TEXT_ALIGN_COMMAND", () => {
  it("has the correct type string", () => {
    expect(SET_TEXT_ALIGN_COMMAND.type).toBe("lexra:block:text-align");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(SET_TEXT_ALIGN_COMMAND)).toEqual(["type"]);
  });
});
