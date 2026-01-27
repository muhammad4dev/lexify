import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";
import { setStyleProperty, isValidFontSize } from "./style-utils.js";

export const SET_FONT_SIZE_COMMAND: LexraCommand<string> =
  createCommand<string>("lexra:style:font-size");

export const REMOVE_FONT_SIZE_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:style:font-size:remove");

export const fontSizePlugin: LexraPlugin = {
  name: "lexra/font-size",

  register(editor: LexraEditor): () => void {
    const unsubSet = editor.registerCommandHandler(
      SET_FONT_SIZE_COMMAND,
      (value) => {
        if (!isValidFontSize(value)) {
          console.warn(`[lexra/font-size] Invalid font size value: "${value}". Skipped.`);
          return;
        }
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const nodes = selection.getNodes();
          for (const node of nodes) {
            if ($isTextNode(node)) {
              const updated = setStyleProperty(node.getStyle(), "font-size", value);
              node.setStyle(updated);
            }
          }
        });
      },
    );

    const unsubRemove = editor.registerCommandHandler(
      REMOVE_FONT_SIZE_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const nodes = selection.getNodes();
          for (const node of nodes) {
            if ($isTextNode(node)) {
              const updated = setStyleProperty(node.getStyle(), "font-size", null);
              node.setStyle(updated);
            }
          }
        });
      },
    );

    return () => {
      unsubSet();
      unsubRemove();
    };
  },
};
