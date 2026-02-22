import { useState } from "react";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  UndoButton,
  RedoButton,
  BoldButton,
  ItalicButton,
  UnderlineButton,
  StrikethroughButton,
  CodeButton,
  HeadingSelect,
  TextAlignButton,
  BulletListButton,
  NumberedListButton,
  FontSizeInput,
  FontColorInput,
} from "@lexify/ui";
import { useLexifyEditor } from "@lexify/react";
import { INSERT_LINK_COMMAND } from "@lexify/plugin-link";
import type { HeadingValue } from "@lexify/ui";

export function EditorToolbar() {
  const editor = useLexifyEditor();
  const [headingValue, setHeadingValue] = useState<HeadingValue>("paragraph");
  const [fontSize, setFontSize] = useState("");
  const [fontColor, setFontColor] = useState("");
  const [invalidSize, setInvalidSize] = useState(false);
  const [invalidColor, setInvalidColor] = useState(false);

  const handleInsertLink = () => {
    const url = window.prompt("Enter URL:");
    if (url?.trim()) {
      editor.dispatchCommand(INSERT_LINK_COMMAND, { url: url.trim() });
    }
  };

  return (
    <Toolbar className="toolbar" aria-label="Text formatting">
      {/* Undo / Redo */}
      <ToolbarGroup className="toolbar-group">
        <UndoButton className="toolbar-btn" title="Undo (⌘Z)" />
        <RedoButton className="toolbar-btn" title="Redo (⌘⇧Z)" />
      </ToolbarGroup>

      <ToolbarSeparator className="toolbar-sep" />

      {/* Block format */}
      <ToolbarGroup className="toolbar-group">
        <HeadingSelect
          value={headingValue}
          onChange={setHeadingValue}
          className="toolbar-select"
        />
      </ToolbarGroup>

      <ToolbarSeparator className="toolbar-sep" />

      {/* Text format */}
      <ToolbarGroup className="toolbar-group">
        <BoldButton className="toolbar-btn" title="Bold (⌘B)" />
        <ItalicButton className="toolbar-btn" title="Italic (⌘I)" />
        <UnderlineButton className="toolbar-btn" title="Underline (⌘U)" />
        <StrikethroughButton className="toolbar-btn" title="Strikethrough" />
        <CodeButton className="toolbar-btn" title="Inline code" />
      </ToolbarGroup>

      <ToolbarSeparator className="toolbar-sep" />

      {/* Alignment */}
      <ToolbarGroup className="toolbar-group">
        <TextAlignButton
          align="left"
          className="toolbar-btn"
          title="Align left"
        >
          ←
        </TextAlignButton>
        <TextAlignButton align="center" className="toolbar-btn" title="Center">
          ↔
        </TextAlignButton>
        <TextAlignButton
          align="right"
          className="toolbar-btn"
          title="Align right"
        >
          →
        </TextAlignButton>
        <TextAlignButton
          align="justify"
          className="toolbar-btn"
          title="Justify"
        >
          ⇔
        </TextAlignButton>
      </ToolbarGroup>

      <ToolbarSeparator className="toolbar-sep" />

      {/* Lists */}
      <ToolbarGroup className="toolbar-group">
        <BulletListButton className="toolbar-btn" title="Bullet list" />
        <NumberedListButton className="toolbar-btn" title="Numbered list" />
      </ToolbarGroup>

      <ToolbarSeparator className="toolbar-sep" />

      {/* Link */}
      <ToolbarGroup className="toolbar-group">
        <button
          type="button"
          className="toolbar-btn"
          title="Insert link"
          onClick={handleInsertLink}
        >
          🔗
        </button>
      </ToolbarGroup>

      <ToolbarSeparator className="toolbar-sep" />

      {/* Inline styles */}
      <ToolbarGroup className="toolbar-group toolbar-group--inline">
        <label className="toolbar-label" htmlFor="font-size-input">
          Size
        </label>
        <FontSizeInput
          id="font-size-input"
          value={fontSize}
          onChange={(v) => {
            setFontSize(v);
            setInvalidSize(false);
          }}
          onInvalidValue={() => setInvalidSize(true)}
          className={`toolbar-input${invalidSize ? " toolbar-input--error" : ""}`}
          title={
            invalidSize ? "Invalid font size (e.g. 16px, 1.5em)" : "Font size"
          }
        />
      </ToolbarGroup>

      <ToolbarGroup className="toolbar-group toolbar-group--inline">
        <label className="toolbar-label" htmlFor="font-color-input">
          Color
        </label>
        <FontColorInput
          id="font-color-input"
          value={fontColor}
          onChange={(v) => {
            setFontColor(v);
            setInvalidColor(false);
          }}
          onInvalidValue={() => setInvalidColor(true)}
          className={`toolbar-input${invalidColor ? " toolbar-input--error" : ""}`}
          title={
            invalidColor
              ? "Invalid color (e.g. #ff0000, red, rgb(...))"
              : "Font color"
          }
        />
      </ToolbarGroup>
    </Toolbar>
  );
}
