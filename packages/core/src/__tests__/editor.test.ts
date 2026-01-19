import { describe, it, expect, vi } from "vitest";
import { createEditor, createCommand } from "../index.js";
import type { LexraPlugin } from "../index.js";

// ─── createEditor ─────────────────────────────────────────────────────────────

describe("createEditor", () => {
  it("exposes the configured namespace", () => {
    const editor = createEditor({ namespace: "test" });
    expect(editor.namespace).toBe("test");
  });

  it("returns a serializable initial state", () => {
    const editor = createEditor({ namespace: "test" });
    const json = editor.toJSON();
    expect(json).toHaveProperty("root");
  });
});

// ─── Plugin registration ──────────────────────────────────────────────────────

describe("registerPlugin", () => {
  it("calls register on the plugin", () => {
    const cleanup = vi.fn();
    const plugin: LexraPlugin = {
      name: "test-plugin",
      register: vi.fn(() => cleanup),
    };
    const editor = createEditor({ namespace: "test" });
    editor.registerPlugin(plugin);
    expect(plugin.register).toHaveBeenCalledOnce();
  });

  it("is idempotent — registering twice only calls register once", () => {
    const plugin: LexraPlugin = {
      name: "test-plugin",
      register: vi.fn(() => vi.fn()),
    };
    const editor = createEditor({ namespace: "test" });
    editor.registerPlugin(plugin);
    editor.registerPlugin(plugin);
    expect(plugin.register).toHaveBeenCalledOnce();
  });

  it("registers plugins provided in config", () => {
    const plugin: LexraPlugin = {
      name: "config-plugin",
      register: vi.fn(() => vi.fn()),
    };
    createEditor({ namespace: "test", plugins: [plugin] });
    expect(plugin.register).toHaveBeenCalledOnce();
  });

  it("calls plugin cleanup on destroy", () => {
    const cleanup = vi.fn();
    const plugin: LexraPlugin = {
      name: "test-plugin",
      register: vi.fn(() => cleanup),
    };
    const editor = createEditor({ namespace: "test" });
    editor.registerPlugin(plugin);
    editor.destroy();
    expect(cleanup).toHaveBeenCalledOnce();
  });
});

// ─── Command system ───────────────────────────────────────────────────────────

describe("command system", () => {
  it("dispatches a command to a registered handler", () => {
    const CMD = createCommand<string>("test:cmd");
    const handler = vi.fn();
    const editor = createEditor({ namespace: "test" });
    editor.registerCommandHandler(CMD, handler);
    editor.dispatchCommand(CMD, "hello");
    expect(handler).toHaveBeenCalledWith("hello");
  });

  it("dispatches to multiple handlers for the same command", () => {
    const CMD = createCommand<number>("test:multi");
    const h1 = vi.fn();
    const h2 = vi.fn();
    const editor = createEditor({ namespace: "test" });
    editor.registerCommandHandler(CMD, h1);
    editor.registerCommandHandler(CMD, h2);
    editor.dispatchCommand(CMD, 42);
    expect(h1).toHaveBeenCalledWith(42);
    expect(h2).toHaveBeenCalledWith(42);
  });

  it("does not call handler after unsubscribe", () => {
    const CMD = createCommand<void>("test:unsub");
    const handler = vi.fn();
    const editor = createEditor({ namespace: "test" });
    const unsubscribe = editor.registerCommandHandler(CMD, handler);
    unsubscribe();
    editor.dispatchCommand(CMD, undefined);
    expect(handler).not.toHaveBeenCalled();
  });

  it("silently ignores dispatch with no handlers", () => {
    const CMD = createCommand<void>("test:no-handlers");
    const editor = createEditor({ namespace: "test" });
    expect(() => editor.dispatchCommand(CMD, undefined)).not.toThrow();
  });

  it("clears all handlers on destroy", () => {
    const CMD = createCommand<void>("test:destroy");
    const handler = vi.fn();
    const editor = createEditor({ namespace: "test" });
    editor.registerCommandHandler(CMD, handler);
    editor.destroy();
    // After destroy, dispatching should not throw and handler is not called
    expect(() => editor.dispatchCommand(CMD, undefined)).not.toThrow();
    expect(handler).not.toHaveBeenCalled();
  });

  it("commands with different types are independent", () => {
    const CMD_A = createCommand<string>("test:a");
    const CMD_B = createCommand<string>("test:b");
    const handlerA = vi.fn();
    const handlerB = vi.fn();
    const editor = createEditor({ namespace: "test" });
    editor.registerCommandHandler(CMD_A, handlerA);
    editor.registerCommandHandler(CMD_B, handlerB);
    editor.dispatchCommand(CMD_A, "a");
    expect(handlerA).toHaveBeenCalledWith("a");
    expect(handlerB).not.toHaveBeenCalled();
  });
});

// ─── createCommand ────────────────────────────────────────────────────────────

describe("createCommand", () => {
  it("returns an object with the given type", () => {
    const cmd = createCommand("my:command");
    expect(cmd.type).toBe("my:command");
  });

  it("two commands with the same type string are structurally equal", () => {
    const a = createCommand("shared");
    const b = createCommand("shared");
    expect(a.type).toBe(b.type);
  });
});
