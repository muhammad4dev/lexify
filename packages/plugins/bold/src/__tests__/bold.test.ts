import { describe, it, expect, vi } from "vitest";
import { boldPlugin, FORMAT_BOLD_COMMAND } from "../index.js";
import { createEditor } from "@lexra/core";

// ─── Plugin contract ──────────────────────────────────────────────────────────

describe("boldPlugin", () => {
  it("has the correct name", () => {
    expect(boldPlugin.name).toBe("lexra/bold");
  });

  it("registers a handler for FORMAT_BOLD_COMMAND on mount", () => {
    const editor = createEditor({ namespace: "test" });
    const registerSpy = vi.spyOn(editor, "registerCommandHandler");
    boldPlugin.register(editor);
    expect(registerSpy).toHaveBeenCalledWith(FORMAT_BOLD_COMMAND, expect.any(Function));
  });

  it("returns a cleanup function from register", () => {
    const editor = createEditor({ namespace: "test" });
    const cleanup = boldPlugin.register(editor);
    expect(typeof cleanup).toBe("function");
  });

  it("unregisters its handler when cleanup is called", () => {
    const editor = createEditor({ namespace: "test" });
    const cleanup = boldPlugin.register(editor);
    const updateSpy = vi.spyOn(editor, "update");
    cleanup();
    // After cleanup, dispatching the command should not trigger update
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

  it("is idempotent when registered via editor.registerPlugin", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    editor.registerPlugin(boldPlugin);
    editor.registerPlugin(boldPlugin); // second call is a no-op
    editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined);
    // Only one handler registered — update called exactly once
    expect(updateSpy).toHaveBeenCalledOnce();
  });
});

// ─── FORMAT_BOLD_COMMAND ──────────────────────────────────────────────────────

describe("FORMAT_BOLD_COMMAND", () => {
  it("has the correct type string", () => {
    expect(FORMAT_BOLD_COMMAND.type).toBe("lexra:format:bold");
  });

  it("does not expose any Lexical types on its shape", () => {
    const keys = Object.keys(FORMAT_BOLD_COMMAND);
    // Only 'type' should be present (no _phantom at runtime)
    expect(keys).toEqual(["type"]);
  });
});
