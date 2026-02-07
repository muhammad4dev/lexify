import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LexraContext } from "@lexra/react";
import type { LexraEditor } from "@lexra/core";

// ─── Test helpers ─────────────────────────────────────────────────────────────

function createMockEditor(): LexraEditor {
  return {
    registerPlugin: vi.fn(),
    registerCommandHandler: vi.fn(() => vi.fn()),
    dispatchCommand: vi.fn(),
    getEditorState: vi.fn(),
    toJSON: vi.fn(),
    destroy: vi.fn(),
    update: vi.fn(),
  };
}

function EditorProvider({
  editor,
  children,
}: {
  editor: LexraEditor;
  children: React.ReactNode;
}) {
  return (
    <LexraContext.Provider value={editor}>{children}</LexraContext.Provider>
  );
}

// ─── Primitives ───────────────────────────────────────────────────────────────

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "../primitives/index.js";

describe("Toolbar", () => {
  it("renders with role=toolbar", () => {
    render(<Toolbar />);
    expect(screen.getByRole("toolbar")).toBeTruthy();
  });

  it("forwards className", () => {
    render(<Toolbar className="my-toolbar" />);
    expect(screen.getByRole("toolbar").className).toBe("my-toolbar");
  });

  it("renders children", () => {
    render(<Toolbar><span data-testid="child" /></Toolbar>);
    expect(screen.getByTestId("child")).toBeTruthy();
  });
});

describe("ToolbarButton", () => {
  it("renders a button", () => {
    render(<ToolbarButton>B</ToolbarButton>);
    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("sets data-active when isActive=true", () => {
    render(<ToolbarButton isActive>B</ToolbarButton>);
    expect(screen.getByRole("button").getAttribute("data-active")).toBe("true");
  });

  it("does not set data-active when isActive=false", () => {
    render(<ToolbarButton isActive={false}>B</ToolbarButton>);
    expect(screen.getByRole("button").getAttribute("data-active")).toBeNull();
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(<ToolbarButton onClick={onClick}>B</ToolbarButton>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when disabled=true", () => {
    render(<ToolbarButton disabled>B</ToolbarButton>);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });
});

describe("ToolbarGroup", () => {
  it("renders with role=group", () => {
    render(<ToolbarGroup />);
    expect(screen.getByRole("group")).toBeTruthy();
  });
});

describe("ToolbarSeparator", () => {
  it("renders with role=separator", () => {
    render(<ToolbarSeparator />);
    expect(screen.getByRole("separator")).toBeTruthy();
  });
});

// ─── Format buttons ───────────────────────────────────────────────────────────

import { BoldButton } from "../components/BoldButton.js";
import { ItalicButton } from "../components/ItalicButton.js";
import { UnderlineButton } from "../components/UnderlineButton.js";
import { StrikethroughButton } from "../components/StrikethroughButton.js";
import { CodeButton } from "../components/CodeButton.js";

describe.each([
  ["BoldButton", BoldButton, "Bold", "lexra:format:bold"],
  ["ItalicButton", ItalicButton, "Italic", "lexra:format:italic"],
  ["UnderlineButton", UnderlineButton, "Underline", "lexra:format:underline"],
  ["StrikethroughButton", StrikethroughButton, "Strikethrough", "lexra:format:strikethrough"],
  ["CodeButton", CodeButton, "Code", "lexra:format:code"],
] as const)("%s", (_name, Component, ariaLabel, commandType) => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders with correct aria-label", () => {
    render(<EditorProvider editor={editor}><Component /></EditorProvider>);
    expect(screen.getByRole("button", { name: ariaLabel })).toBeTruthy();
  });

  it("dispatches command on click", () => {
    render(<EditorProvider editor={editor}><Component /></EditorProvider>);
    fireEvent.click(screen.getByRole("button", { name: ariaLabel }));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: commandType }),
      undefined,
    );
  });

  it("supports isActive prop", () => {
    render(<EditorProvider editor={editor}><Component isActive /></EditorProvider>);
    expect(screen.getByRole("button").getAttribute("data-active")).toBe("true");
  });

  it("supports disabled prop", () => {
    render(<EditorProvider editor={editor}><Component disabled /></EditorProvider>);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });
});

// ─── HeadingSelect ────────────────────────────────────────────────────────────

import { HeadingSelect } from "../components/HeadingSelect.js";

describe("HeadingSelect", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders a select with 7 options", () => {
    render(<EditorProvider editor={editor}><HeadingSelect /></EditorProvider>);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.options.length).toBe(7);
  });

  it("defaults to paragraph", () => {
    render(<EditorProvider editor={editor}><HeadingSelect /></EditorProvider>);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("paragraph");
  });

  it("dispatches SET_HEADING_COMMAND when heading selected", () => {
    render(<EditorProvider editor={editor}><HeadingSelect /></EditorProvider>);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "h2" } });
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:block:heading" }),
      "h2",
    );
  });

  it("dispatches REMOVE_HEADING_COMMAND when paragraph selected", () => {
    render(<EditorProvider editor={editor}><HeadingSelect value="h1" /></EditorProvider>);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "paragraph" } });
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:block:heading:remove" }),
      undefined,
    );
  });

  it("calls onChange callback", () => {
    const onChange = vi.fn();
    render(<EditorProvider editor={editor}><HeadingSelect onChange={onChange} /></EditorProvider>);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "h3" } });
    expect(onChange).toHaveBeenCalledWith("h3");
  });
});

// ─── TextAlignButton ──────────────────────────────────────────────────────────

import { TextAlignButton } from "../components/TextAlignButton.js";

describe("TextAlignButton", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders with aria-label derived from align", () => {
    render(<EditorProvider editor={editor}><TextAlignButton align="center" /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Align center" })).toBeTruthy();
  });

  it("dispatches SET_TEXT_ALIGN_COMMAND with correct align value", () => {
    render(<EditorProvider editor={editor}><TextAlignButton align="right" /></EditorProvider>);
    fireEvent.click(screen.getByRole("button"));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:block:text-align" }),
      "right",
    );
  });
});

// ─── List buttons ─────────────────────────────────────────────────────────────

import { BulletListButton, NumberedListButton, RemoveListButton } from "../components/ListButtons.js";

describe("BulletListButton", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders with correct aria-label", () => {
    render(<EditorProvider editor={editor}><BulletListButton /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Bullet list" })).toBeTruthy();
  });

  it("dispatches INSERT_UNORDERED_LIST_COMMAND", () => {
    render(<EditorProvider editor={editor}><BulletListButton /></EditorProvider>);
    fireEvent.click(screen.getByRole("button"));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:list:insert:bullet" }),
      undefined,
    );
  });
});

describe("NumberedListButton", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders with correct aria-label", () => {
    render(<EditorProvider editor={editor}><NumberedListButton /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Numbered list" })).toBeTruthy();
  });

  it("dispatches INSERT_ORDERED_LIST_COMMAND", () => {
    render(<EditorProvider editor={editor}><NumberedListButton /></EditorProvider>);
    fireEvent.click(screen.getByRole("button"));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:list:insert:number" }),
      undefined,
    );
  });
});

describe("RemoveListButton", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("dispatches REMOVE_LIST_COMMAND", () => {
    render(<EditorProvider editor={editor}><RemoveListButton /></EditorProvider>);
    fireEvent.click(screen.getByRole("button"));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:list:remove" }),
      undefined,
    );
  });
});

// ─── FontSizeInput ────────────────────────────────────────────────────────────

import { FontSizeInput } from "../components/FontSizeInput.js";

describe("FontSizeInput", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders an input with correct aria-label", () => {
    render(<EditorProvider editor={editor}><FontSizeInput /></EditorProvider>);
    expect(screen.getByRole("textbox", { name: "Font size" })).toBeTruthy();
  });

  it("dispatches SET_FONT_SIZE_COMMAND on blur with valid value", () => {
    render(<EditorProvider editor={editor}><FontSizeInput /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "16px" } });
    fireEvent.blur(input);
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:style:font-size" }),
      "16px",
    );
  });

  it("dispatches SET_FONT_SIZE_COMMAND on Enter with valid value", () => {
    render(<EditorProvider editor={editor}><FontSizeInput /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "2em" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:style:font-size" }),
      "2em",
    );
  });

  it("dispatches REMOVE_FONT_SIZE_COMMAND when cleared", () => {
    render(<EditorProvider editor={editor}><FontSizeInput value="16px" /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:style:font-size:remove" }),
      undefined,
    );
  });

  it("calls onInvalidValue and does NOT dispatch for invalid value", () => {
    const onInvalidValue = vi.fn();
    render(<EditorProvider editor={editor}><FontSizeInput onInvalidValue={onInvalidValue} /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "bold" } });
    fireEvent.blur(input);
    expect(onInvalidValue).toHaveBeenCalledWith("bold");
    expect(editor.dispatchCommand).not.toHaveBeenCalled();
  });
});

// ─── FontColorInput ───────────────────────────────────────────────────────────

import { FontColorInput } from "../components/FontColorInput.js";

describe("FontColorInput", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders an input with correct aria-label", () => {
    render(<EditorProvider editor={editor}><FontColorInput /></EditorProvider>);
    expect(screen.getByRole("textbox", { name: "Font color" })).toBeTruthy();
  });

  it("dispatches SET_FONT_COLOR_COMMAND on blur with valid color", () => {
    render(<EditorProvider editor={editor}><FontColorInput /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "#ff0000" } });
    fireEvent.blur(input);
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:style:font-color" }),
      "#ff0000",
    );
  });

  it("dispatches REMOVE_FONT_COLOR_COMMAND when cleared", () => {
    render(<EditorProvider editor={editor}><FontColorInput value="red" /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:style:font-color:remove" }),
      undefined,
    );
  });

  it("calls onInvalidValue and does NOT dispatch for invalid color", () => {
    const onInvalidValue = vi.fn();
    render(<EditorProvider editor={editor}><FontColorInput onInvalidValue={onInvalidValue} /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "not-a-color" } });
    fireEvent.blur(input);
    expect(onInvalidValue).toHaveBeenCalledWith("not-a-color");
    expect(editor.dispatchCommand).not.toHaveBeenCalled();
  });

  it("accepts named colors on Enter", () => {
    render(<EditorProvider editor={editor}><FontColorInput /></EditorProvider>);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "blue" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:style:font-color" }),
      "blue",
    );
  });
});

// ─── UndoButton ───────────────────────────────────────────────────────────────

import { UndoButton } from "../components/UndoButton.js";

describe("UndoButton", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders a button with default aria-label", () => {
    render(<EditorProvider editor={editor}><UndoButton /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
  });

  it("dispatches UNDO_COMMAND on click", () => {
    render(<EditorProvider editor={editor}><UndoButton /></EditorProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:history:undo" }),
      undefined,
    );
  });

  it("accepts a custom aria-label", () => {
    render(<EditorProvider editor={editor}><UndoButton aria-label="Step back" /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Step back" })).toBeTruthy();
  });
});

// ─── RedoButton ───────────────────────────────────────────────────────────────

import { RedoButton } from "../components/RedoButton.js";

describe("RedoButton", () => {
  let editor: LexraEditor;
  beforeEach(() => { editor = createMockEditor(); });

  it("renders a button with default aria-label", () => {
    render(<EditorProvider editor={editor}><RedoButton /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Redo" })).toBeTruthy();
  });

  it("dispatches REDO_COMMAND on click", () => {
    render(<EditorProvider editor={editor}><RedoButton /></EditorProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Redo" }));
    expect(editor.dispatchCommand).toHaveBeenCalledWith(
      expect.objectContaining({ type: "lexra:history:redo" }),
      undefined,
    );
  });

  it("accepts a custom aria-label", () => {
    render(<EditorProvider editor={editor}><RedoButton aria-label="Step forward" /></EditorProvider>);
    expect(screen.getByRole("button", { name: "Step forward" })).toBeTruthy();
  });
});
