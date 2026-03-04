import { describe, it, expect, vi } from "vitest";
import {
  linkPlugin,
  INSERT_LINK_COMMAND,
  UPDATE_LINK_COMMAND,
  REMOVE_LINK_COMMAND,
} from "../index.js";
import { createEditor } from "@lexify/core";

describe("linkPlugin", () => {
  it("has the correct name", () => {
    expect(linkPlugin.name).toBe("lexify/link");
  });

  it("declares LinkNode in nodes[]", () => {
    expect(Array.isArray(linkPlugin.nodes)).toBe(true);
    expect(linkPlugin.nodes!.length).toBeGreaterThan(0);
  });

  it("registers handlers for all three commands on mount", () => {
    const editor = createEditor({ namespace: "test", plugins: [linkPlugin] });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    linkPlugin.register(editor);
    const registeredTypes = spy.mock.calls.map((c) => c[0].type);
    expect(registeredTypes).toContain("lexify:link:insert");
    expect(registeredTypes).toContain("lexify:link:update");
    expect(registeredTypes).toContain("lexify:link:remove");
  });

  it("returns a single cleanup function", () => {
    const editor = createEditor({ namespace: "test", plugins: [linkPlugin] });
    expect(typeof linkPlugin.register(editor)).toBe("function");
  });

  it("unregisters all handlers when cleanup is called", () => {
    const editor = createEditor({ namespace: "test", plugins: [linkPlugin] });
    const updateSpy = vi.spyOn(editor, "update");
    // destroy() calls all plugin cleanups registered at construction
    editor.destroy();
    editor.dispatchCommand(INSERT_LINK_COMMAND, { url: "https://example.com" });
    editor.dispatchCommand(UPDATE_LINK_COMMAND, { url: "https://example.com" });
    editor.dispatchCommand(REMOVE_LINK_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("calls update for INSERT_LINK_COMMAND", () => {
    const editor = createEditor({ namespace: "test", plugins: [linkPlugin] });
    const updateSpy = vi.spyOn(editor, "update");
    editor.dispatchCommand(INSERT_LINK_COMMAND, { url: "https://example.com" });
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update for UPDATE_LINK_COMMAND", () => {
    const editor = createEditor({ namespace: "test", plugins: [linkPlugin] });
    const updateSpy = vi.spyOn(editor, "update");
    editor.dispatchCommand(UPDATE_LINK_COMMAND, {
      url: "https://new.com",
      target: "_blank",
    });
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update for REMOVE_LINK_COMMAND", () => {
    const editor = createEditor({ namespace: "test", plugins: [linkPlugin] });
    const updateSpy = vi.spyOn(editor, "update");
    editor.dispatchCommand(REMOVE_LINK_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("does not expose Lexical types in command shapes", () => {
    expect(Object.keys(INSERT_LINK_COMMAND)).toEqual(["type"]);
    expect(Object.keys(UPDATE_LINK_COMMAND)).toEqual(["type"]);
    expect(Object.keys(REMOVE_LINK_COMMAND)).toEqual(["type"]);
  });
});

describe("command type strings", () => {
  it("INSERT_LINK_COMMAND type", () => {
    expect(INSERT_LINK_COMMAND.type).toBe("lexify:link:insert");
  });
  it("UPDATE_LINK_COMMAND type", () => {
    expect(UPDATE_LINK_COMMAND.type).toBe("lexify:link:update");
  });
  it("REMOVE_LINK_COMMAND type", () => {
    expect(REMOVE_LINK_COMMAND.type).toBe("lexify:link:remove");
  });
});
