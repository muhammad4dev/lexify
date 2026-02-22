import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

export const FORMAT_ITALIC_COMMAND: LexifyCommand<void> = createCommand<void>(
  "lexify:format:italic",
);

export const italicPlugin: LexifyPlugin = {
  name: "lexify/italic",
  register(editor: LexifyEditor): () => void {
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
