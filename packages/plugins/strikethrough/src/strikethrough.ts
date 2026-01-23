import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

export const FORMAT_STRIKETHROUGH_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:format:strikethrough");

export const strikethroughPlugin: LexraPlugin = {
  name: "lexra/strikethrough",
  register(editor: LexraEditor): () => void {
    return editor.registerCommandHandler(FORMAT_STRIKETHROUGH_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText("strikethrough");
        }
      });
    });
  },
};
