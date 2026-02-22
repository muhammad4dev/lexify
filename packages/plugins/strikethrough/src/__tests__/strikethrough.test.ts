import { describe, it, expect, vi } from "vitest";
import { strikethroughPlugin, FORMAT_STRIKETHROUGH_COMMAND } from "../index.js";
import { createEditor } from "@lexify/core";

describe("strikethroughPlugin", () => {
  it("has the correct name", () => {
    expect(strikethroughPlugin.name).toBe("lexify/strikethrough");
  });

  it("registers a handler for FORMAT_STRIKETHROUGH_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    strikethroughPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(
      FORMAT_STRIKETHROUGH_COMMAND,
      expect.any(Function),
    );
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof strikethroughPlugin.register(editor)).toBe("function");
  });

  it("unregisters on cleanup — update is not called after", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = strikethroughPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(FORMAT_STRIKETHROUGH_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls editor.update when FORMAT_STRIKETHROUGH_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    strikethroughPlugin.register(editor);
    editor.dispatchCommand(FORMAT_STRIKETHROUGH_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("is idempotent when registered twice via registerPlugin", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    editor.registerPlugin(strikethroughPlugin);
    editor.registerPlugin(strikethroughPlugin);
    editor.dispatchCommand(FORMAT_STRIKETHROUGH_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });
});

describe("FORMAT_STRIKETHROUGH_COMMAND", () => {
  it("has the correct type string", () => {
    expect(FORMAT_STRIKETHROUGH_COMMAND.type).toBe(
      "lexify:format:strikethrough",
    );
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_STRIKETHROUGH_COMMAND)).toEqual(["type"]);
  });
});
