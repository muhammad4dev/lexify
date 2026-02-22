import { describe, it, expect, vi } from "vitest";
import { underlinePlugin, FORMAT_UNDERLINE_COMMAND } from "../index.js";
import { createEditor } from "@lexify/core";

describe("underlinePlugin", () => {
  it("has the correct name", () => {
    expect(underlinePlugin.name).toBe("lexify/underline");
  });

  it("registers a handler for FORMAT_UNDERLINE_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    underlinePlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(
      FORMAT_UNDERLINE_COMMAND,
      expect.any(Function),
    );
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof underlinePlugin.register(editor)).toBe("function");
  });

  it("unregisters on cleanup — update is not called after", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = underlinePlugin.register(editor);
    cleanup();
    editor.dispatchCommand(FORMAT_UNDERLINE_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls editor.update when FORMAT_UNDERLINE_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    underlinePlugin.register(editor);
    editor.dispatchCommand(FORMAT_UNDERLINE_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("is idempotent when registered twice via registerPlugin", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    editor.registerPlugin(underlinePlugin);
    editor.registerPlugin(underlinePlugin);
    editor.dispatchCommand(FORMAT_UNDERLINE_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });
});

describe("FORMAT_UNDERLINE_COMMAND", () => {
  it("has the correct type string", () => {
    expect(FORMAT_UNDERLINE_COMMAND.type).toBe("lexify:format:underline");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_UNDERLINE_COMMAND)).toEqual(["type"]);
  });
});
