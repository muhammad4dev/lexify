import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

/** Dispatch this command to toggle bold on the current selection. */
export const FORMAT_BOLD_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:format:bold");

export const boldPlugin: LexifyPlugin = {
  name: "lexify/bold",

  register(editor: LexifyEditor): () => void {
    return editor.registerCommandHandler(FORMAT_BOLD_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText("bold");
        }
      });
    });
  },
};
