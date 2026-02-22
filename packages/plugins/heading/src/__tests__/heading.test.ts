import { describe, it, expect, vi } from "vitest";
import {
  headingPlugin,
  SET_HEADING_COMMAND,
  REMOVE_HEADING_COMMAND,
} from "../index.js";
import type { HeadingTag } from "../index.js";
import { createEditor } from "@lexify/core";

describe("headingPlugin", () => {
  it("has the correct name", () => {
    expect(headingPlugin.name).toBe("lexify/heading");
  });

  it("registers HeadingNode in nodes array", () => {
    expect(headingPlugin.nodes).toBeDefined();
    expect(headingPlugin.nodes!.length).toBe(1);
  });

  it("registers handlers for SET_HEADING_COMMAND and REMOVE_HEADING_COMMAND", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    headingPlugin.register(editor);
    expect(spy).toHaveBeenCalledWith(SET_HEADING_COMMAND, expect.any(Function));
    expect(spy).toHaveBeenCalledWith(
      REMOVE_HEADING_COMMAND,
      expect.any(Function),
    );
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof headingPlugin.register(editor)).toBe("function");
  });

  it("calls update when SET_HEADING_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    headingPlugin.register(editor);
    editor.dispatchCommand(SET_HEADING_COMMAND, "h1");
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update when REMOVE_HEADING_COMMAND is dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    headingPlugin.register(editor);
    editor.dispatchCommand(REMOVE_HEADING_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("accepts all HeadingTag values", () => {
    const tags: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5", "h6"];
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    headingPlugin.register(editor);
    for (const tag of tags) {
      editor.dispatchCommand(SET_HEADING_COMMAND, tag);
    }
    expect(updateSpy).toHaveBeenCalledTimes(tags.length);
  });

  it("unregisters on cleanup", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = headingPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(SET_HEADING_COMMAND, "h2");
    expect(updateSpy).not.toHaveBeenCalled();
  });
});

describe("SET_HEADING_COMMAND", () => {
  it("has the correct type string", () => {
    expect(SET_HEADING_COMMAND.type).toBe("lexify:block:heading");
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(SET_HEADING_COMMAND)).toEqual(["type"]);
  });
});

describe("REMOVE_HEADING_COMMAND", () => {
  it("has the correct type string", () => {
    expect(REMOVE_HEADING_COMMAND.type).toBe("lexify:block:heading:remove");
  });
});
