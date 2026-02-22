import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";
import { setStyleProperty, isValidColor } from "@lexify/plugin-utils";

export const SET_FONT_COLOR_COMMAND: LexifyCommand<string> =
  createCommand<string>("lexify:style:font-color");

export const REMOVE_FONT_COLOR_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:style:font-color:remove");

export const fontColorPlugin: LexifyPlugin = {
  name: "lexify/font-color",

  register(editor: LexifyEditor): () => void {
    const unsubSet = editor.registerCommandHandler(
      SET_FONT_COLOR_COMMAND,
      (value) => {
        if (!isValidColor(value)) {
          console.warn(
            `[lexify/font-color] Invalid color value: "${value}". Skipped.`,
          );
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
      },
    );

    const unsubRemove = editor.registerCommandHandler(
      REMOVE_FONT_COLOR_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;
          for (const node of selection.getNodes()) {
            if ($isTextNode(node)) {
              node.setStyle(setStyleProperty(node.getStyle(), "color", null));
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
