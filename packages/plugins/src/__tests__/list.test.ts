import { describe, it, expect, vi } from "vitest";
import {
  listPlugin,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  INDENT_LIST_ITEM_COMMAND,
  OUTDENT_LIST_ITEM_COMMAND,
} from "../index.js";
import { createEditor } from "@lexify/core";

describe("listPlugin", () => {
  it("has the correct name", () => {
    expect(listPlugin.name).toBe("lexify/list");
  });

  it("registers ListNode and ListItemNode", () => {
    expect(listPlugin.nodes).toBeDefined();
    expect(listPlugin.nodes!.length).toBe(2);
  });

  it("registers all 5 command handlers", () => {
    const editor = createEditor({ namespace: "test" });
    const spy = vi.spyOn(editor, "registerCommandHandler");
    listPlugin.register(editor);
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it("returns a cleanup function", () => {
    const editor = createEditor({ namespace: "test" });
    expect(typeof listPlugin.register(editor)).toBe("function");
  });

  it("calls update when INSERT_UNORDERED_LIST_COMMAND dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    listPlugin.register(editor);
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update when INSERT_ORDERED_LIST_COMMAND dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    listPlugin.register(editor);
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update when REMOVE_LIST_COMMAND dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    listPlugin.register(editor);
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update when INDENT_LIST_ITEM_COMMAND dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    listPlugin.register(editor);
    editor.dispatchCommand(INDENT_LIST_ITEM_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("calls update when OUTDENT_LIST_ITEM_COMMAND dispatched", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    listPlugin.register(editor);
    editor.dispatchCommand(OUTDENT_LIST_ITEM_COMMAND, undefined);
    expect(updateSpy).toHaveBeenCalledOnce();
  });

  it("unregisters all handlers on cleanup", () => {
    const editor = createEditor({ namespace: "test" });
    const updateSpy = vi.spyOn(editor, "update");
    const cleanup = listPlugin.register(editor);
    cleanup();
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    expect(updateSpy).not.toHaveBeenCalled();
  });
});

describe("list commands", () => {
  it.each([
    [
      "INSERT_UNORDERED_LIST_COMMAND",
      INSERT_UNORDERED_LIST_COMMAND,
      "lexify:list:insert:bullet",
    ],
    [
      "INSERT_ORDERED_LIST_COMMAND",
      INSERT_ORDERED_LIST_COMMAND,
      "lexify:list:insert:number",
    ],
    ["REMOVE_LIST_COMMAND", REMOVE_LIST_COMMAND, "lexify:list:remove"],
    [
      "INDENT_LIST_ITEM_COMMAND",
      INDENT_LIST_ITEM_COMMAND,
      "lexify:list:indent",
    ],
    [
      "OUTDENT_LIST_ITEM_COMMAND",
      OUTDENT_LIST_ITEM_COMMAND,
      "lexify:list:outdent",
    ],
  ] as const)("$0 has correct type", (_name, cmd, expected) => {
    expect(cmd.type).toBe(expected);
  });

  it("does not expose Lexical types", () => {
    expect(Object.keys(INSERT_UNORDERED_LIST_COMMAND)).toEqual(["type"]);
  });
});
