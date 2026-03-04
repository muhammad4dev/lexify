import { describe, it, expect, vi, beforeEach } from "vitest";
import { historyPlugin, UNDO_COMMAND, REDO_COMMAND } from "../index.js";
import { createEditor } from "@lexify/core";
import type { LexifyEditor } from "@lexify/core";

// ─── Plugin contract ──────────────────────────────────────────────────────────

describe("historyPlugin", () => {
  let editor: LexifyEditor;

  beforeEach(() => {
    editor = createEditor({ namespace: "test" });
  });

  it("has the correct name", () => {
    expect(historyPlugin.name).toBe("lexify/history");
  });

  it("registers handlers for UNDO_COMMAND and REDO_COMMAND on mount", () => {
    const registerSpy = vi.spyOn(editor, "registerCommandHandler");
    historyPlugin.register(editor);
    expect(registerSpy).toHaveBeenCalledWith(
      UNDO_COMMAND,
      expect.any(Function),
    );
    expect(registerSpy).toHaveBeenCalledWith(
      REDO_COMMAND,
      expect.any(Function),
    );
  });

  it("returns a cleanup function from register", () => {
    const cleanup = historyPlugin.register(editor);
    expect(typeof cleanup).toBe("function");
  });

  it("unregisters handlers when cleanup is called", () => {
    // Register, cleanup, then dispatch — dispatchCommand should not throw
    const cleanup = historyPlugin.register(editor);
    cleanup();
    // After cleanup, dispatching commands is a no-op (no handlers to call)
    expect(() => editor.dispatchCommand(UNDO_COMMAND, undefined)).not.toThrow();
    expect(() => editor.dispatchCommand(REDO_COMMAND, undefined)).not.toThrow();
  });

  it("is idempotent when registered via editor.registerPlugin", () => {
    const registerSpy = vi.spyOn(editor, "registerCommandHandler");
    editor.registerPlugin(historyPlugin);
    editor.registerPlugin(historyPlugin); // second call is a no-op
    // registerCommandHandler should have been called exactly twice (UNDO + REDO)
    expect(registerSpy).toHaveBeenCalledTimes(2);
  });

  it("exposes _lexical as the underlying Lexical editor", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((editor as any)._lexical).toBeDefined();
  });
});

// ─── Commands ─────────────────────────────────────────────────────────────────

describe("UNDO_COMMAND", () => {
  it("has the correct type string", () => {
    expect(UNDO_COMMAND.type).toBe("lexify:history:undo");
  });

  it("does not expose any Lexical types on its shape", () => {
    expect(Object.keys(UNDO_COMMAND)).toEqual(["type"]);
  });
});

describe("REDO_COMMAND", () => {
  it("has the correct type string", () => {
    expect(REDO_COMMAND.type).toBe("lexify:history:redo");
  });

  it("does not expose any Lexical types on its shape", () => {
    expect(Object.keys(REDO_COMMAND)).toEqual(["type"]);
  });
});
