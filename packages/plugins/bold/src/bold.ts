import { $getSelection, $isRangeSelection } from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

/** Dispatch this command to toggle bold on the current selection. */
export const FORMAT_BOLD_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:format:bold");

export const boldPlugin: LexraPlugin = {
  name: "lexra/bold",

  register(editor: LexraEditor): () => void {
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
