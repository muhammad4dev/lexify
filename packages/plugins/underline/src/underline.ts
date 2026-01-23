import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

export const FORMAT_UNDERLINE_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:format:underline");

export const underlinePlugin: LexraPlugin = {
  name: "lexra/underline",
  register(editor: LexraEditor): () => void {
    return editor.registerCommandHandler(FORMAT_UNDERLINE_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText("underline");
        }
      });
    });
  },
};
