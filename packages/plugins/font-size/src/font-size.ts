import { $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";
import { setStyleProperty, isValidFontSize } from "./style-utils.js";

export const SET_FONT_SIZE_COMMAND: LexifyCommand<string> =
  createCommand<string>("lexify:style:font-size");

export const REMOVE_FONT_SIZE_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:style:font-size:remove");

export const fontSizePlugin: LexifyPlugin = {
  name: "lexify/font-size",

  register(editor: LexifyEditor): () => void {
    const unsubSet = editor.registerCommandHandler(
      SET_FONT_SIZE_COMMAND,
      (value) => {
        if (!isValidFontSize(value)) {
          console.warn(
            `[lexify/font-size] Invalid font size value: "${value}". Skipped.`,
          );
          return;
        }
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const nodes = selection.getNodes();
          for (const node of nodes) {
            if ($isTextNode(node)) {
              const updated = setStyleProperty(
                node.getStyle(),
                "font-size",
                value,
              );
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
              const updated = setStyleProperty(
                node.getStyle(),
                "font-size",
                null,
              );
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
