import { describe, it, expect, vi } from "vitest";
import { codePlugin, FORMAT_CODE_COMMAND } from "../index.js";
import { createEditor } from "@lexra/core";

describe("codePlugin", () => {
  it("has the correct name", () => {
    expect(codePlugin.name).toBe("lexra/code");
  });

  it("registers a handler for FORMAT_CODE_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    codePlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(FORMAT_CODE_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof codePlugin.register(editor)).toBe("function");
  });

  it("unregisters on cleanup — update is not called after", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = codePlugin.register(editor);
    cleanup();
    editor.dispatchCommand(FORMAT_CODE_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls editor.update when FORMAT_CODE_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    codePlugin.register(editor);
    editor.dispatchCommand(FORMAT_CODE_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("is idempotent when registered twice via registerPlugin", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    editor.registerPlugin(codePlugin);
    editor.registerPlugin(codePlugin);
    editor.dispatchCommand(FORMAT_CODE_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });
});

describe("FORMAT_CODE_COMMAND", () => {
  it("has the correct type string", () => {
    expect(FORMAT_CODE_COMMAND.type).toBe("lexra:format:code");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_CODE_COMMAND)).toEqual(["type"]);
  });
});
