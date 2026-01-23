import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

export const FORMAT_CODE_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:format:code");

export const codePlugin: LexraPlugin = {
  name: "lexra/code",
  register(editor: LexraEditor): () => void {
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
