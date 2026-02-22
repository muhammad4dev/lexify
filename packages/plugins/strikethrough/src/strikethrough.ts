import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

export const FORMAT_STRIKETHROUGH_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:format:strikethrough");

export const strikethroughPlugin: LexifyPlugin = {
  name: "lexify/strikethrough",
  register(editor: LexifyEditor): () => void {
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
