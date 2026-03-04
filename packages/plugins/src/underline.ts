import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

export const FORMAT_UNDERLINE_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:format:underline");

export const underlinePlugin: LexifyPlugin = {
  name: "lexify/underline",
  register(editor: LexifyEditor): () => void {
    return editor.registerCommandHandler(FORMAT_UNDERLINE_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) selection.formatText("underline");
      });
    });
  },
};
