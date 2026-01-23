import { describe, it, expect, vi } from "vitest";
import { italicPlugin, FORMAT_ITALIC_COMMAND } from "../index.js";
import { createEditor } from "@lexra/core";

describe("italicPlugin", () => {
  it("has the correct name", () => {
    expect(italicPlugin.name).toBe("lexra/italic");
  });

  it("registers a handler for FORMAT_ITALIC_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    italicPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(FORMAT_ITALIC_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof italicPlugin.register(editor)).toBe("function");
  });

  it("unregisters on cleanup — update is not called after", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = italicPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(FORMAT_ITALIC_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls editor.update when FORMAT_ITALIC_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    italicPlugin.register(editor);
    editor.dispatchCommand(FORMAT_ITALIC_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("is idempotent when registered twice via registerPlugin", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    editor.registerPlugin(italicPlugin);
    editor.registerPlugin(italicPlugin);
    editor.dispatchCommand(FORMAT_ITALIC_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });
});

describe("FORMAT_ITALIC_COMMAND", () => {
  it("has the correct type string", () => {
    expect(FORMAT_ITALIC_COMMAND.type).toBe("lexra:format:italic");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_ITALIC_COMMAND)).toEqual(["type"]);
  });
});
