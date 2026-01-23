import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

export const FORMAT_ITALIC_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:format:italic");

export const italicPlugin: LexraPlugin = {
  name: "lexra/italic",
  register(editor: LexraEditor): () => void {
    return editor.registerCommandHandler(FORMAT_ITALIC_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText("italic");
        }
      });
    });
  },
};
