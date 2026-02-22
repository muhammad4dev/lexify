import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

export const FORMAT_CODE_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:format:code");

export const codePlugin: LexifyPlugin = {
  name: "lexify/code",
  register(editor: LexifyEditor): () => void {
    return editor.registerCommandHandler(FORMAT_CODE_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText("code");
        }
      });
    });
  },
};
