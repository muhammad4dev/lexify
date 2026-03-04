import { describe, it, expect, vi } from "vitest";
import { createEditor } from "@lexify/core";
import {
  boldPlugin, FORMAT_BOLD_COMMAND,
  italicPlugin, FORMAT_ITALIC_COMMAND,
  underlinePlugin, FORMAT_UNDERLINE_COMMAND,
  strikethroughPlugin, FORMAT_STRIKETHROUGH_COMMAND,
  codePlugin, FORMAT_CODE_COMMAND,
} from "../index.js";

// ─── boldPlugin ───────────────────────────────────────────────────────────────

describe("boldPlugin", () => {
  it("has the correct name", () => {
    expect(boldPlugin.name).toBe("lexify/bold");
  });

  it("registers a handler for FORMAT_BOLD_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    boldPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(FORMAT_BOLD_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function from register", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof boldPlugin.register(editor)).toBe("function");
  });

  it("unregisters its handler when cleanup is called", () => {
    const editor = createEditor({ namespace: "test" });
    const cleanup = boldPlugin.register(editor);
    const updateSpy = vi.spyOn(editor, "update");
    cleanup();
    editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls editor.update when FORMAT_BOLD_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    boldPlugin.register(editor);
    editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("is idempotent when registered twice via registerPlugin", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    editor.registerPlugin(boldPlugin);
    editor.registerPlugin(boldPlugin);
    editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });
});

describe("FORMAT_BOLD_COMMAND", () => {
  it("has the correct type string", () => {
    expect(FORMAT_BOLD_COMMAND.type).toBe("lexify:format:bold");
  });

  it("does not expose any Lexical types on its shape", () => {
    expect(Object.keys(FORMAT_BOLD_COMMAND)).toEqual(["type"]);
  });
});

// ─── italicPlugin ─────────────────────────────────────────────────────────────

describe("italicPlugin", () => {
  it("has the correct name", () => {
    expect(italicPlugin.name).toBe("lexify/italic");
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

  it("unregisters on cleanup", () => {
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
    expect(FORMAT_ITALIC_COMMAND.type).toBe("lexify:format:italic");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_ITALIC_COMMAND)).toEqual(["type"]);
  });
});

// ─── underlinePlugin ──────────────────────────────────────────────────────────

describe("underlinePlugin", () => {
  it("has the correct name", () => {
    expect(underlinePlugin.name).toBe("lexify/underline");
  });

  it("registers a handler for FORMAT_UNDERLINE_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    underlinePlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(FORMAT_UNDERLINE_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof underlinePlugin.register(editor)).toBe("function");
  });

  it("unregisters on cleanup", () => {
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

// ─── strikethroughPlugin ──────────────────────────────────────────────────────

describe("strikethroughPlugin", () => {
  it("has the correct name", () => {
    expect(strikethroughPlugin.name).toBe("lexify/strikethrough");
  });

  it("registers a handler for FORMAT_STRIKETHROUGH_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    strikethroughPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(FORMAT_STRIKETHROUGH_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof strikethroughPlugin.register(editor)).toBe("function");
  });

  it("unregisters on cleanup", () => {
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
    expect(FORMAT_STRIKETHROUGH_COMMAND.type).toBe("lexify:format:strikethrough");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_STRIKETHROUGH_COMMAND)).toEqual(["type"]);
  });
});

// ─── codePlugin ───────────────────────────────────────────────────────────────

describe("codePlugin", () => {
  it("has the correct name", () => {
    expect(codePlugin.name).toBe("lexify/code");
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

  it("unregisters on cleanup", () => {
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
    expect(FORMAT_CODE_COMMAND.type).toBe("lexify:format:code");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(FORMAT_CODE_COMMAND)).toEqual(["type"]);
  });
});
