import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";
import { setStyleProperty, isValidColor } from "@lexra/plugin-utils";

export const SET_FONT_COLOR_COMMAND: LexraCommand<string> =
  createCommand<string>("lexra:style:font-color");

export const REMOVE_FONT_COLOR_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:style:font-color:remove");

export const fontColorPlugin: LexraPlugin = {
  name: "lexra/font-color",

  register(editor: LexraEditor): () => void {
    const unsubSet = editor.registerCommandHandler(SET_FONT_COLOR_COMMAND, (value) => {
      if (!isValidColor(value)) {
        console.warn(`[lexra/font-color] Invalid color value: "${value}". Skipped.`);
        return;
      }
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        for (const node of selection.getNodes()) {
          if ($isTextNode(node)) {
            node.setStyle(setStyleProperty(node.getStyle(), "color", value));
          }
        }
      });
    });

    const unsubRemove = editor.registerCommandHandler(REMOVE_FONT_COLOR_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        for (const node of selection.getNodes()) {
          if ($isTextNode(node)) {
            node.setStyle(setStyleProperty(node.getStyle(), "color", null));
          }
        }
      });
    });

    return () => {
      unsubSet();
      unsubRemove();
    };
  },
};
