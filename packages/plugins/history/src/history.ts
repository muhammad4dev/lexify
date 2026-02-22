import {
  UNDO_COMMAND as LEXICAL_UNDO_COMMAND,
  REDO_COMMAND as LEXICAL_REDO_COMMAND,
  type LexicalEditor,
} from "lexical";
import { registerHistory, createEmptyHistoryState } from "@lexical/history";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

/** Dispatch this command to undo the last change. */
export const UNDO_COMMAND: LexifyCommand<void> = createCommand<void>(
  "lexify:history:undo",
);

/** Dispatch this command to redo the last undone change. */
export const REDO_COMMAND: LexifyCommand<void> = createCommand<void>(
  "lexify:history:redo",
);

/** Default merge delay in ms — changes within this window are merged into one history entry. */
export const HISTORY_MERGE_DELAY = 300;

export const historyPlugin: LexifyPlugin = {
  name: "lexify/history",

  register(editor: LexifyEditor): () => void {
    // Access the underlying LexicalEditor via the internal escape hatch.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lexical = (editor as any)._lexical as LexicalEditor;

    const historyState = createEmptyHistoryState();
    const unregHistory = registerHistory(
      lexical,
      historyState,
      HISTORY_MERGE_DELAY,
    );

    const unsubUndo = editor.registerCommandHandler(UNDO_COMMAND, () => {
      lexical.dispatchCommand(LEXICAL_UNDO_COMMAND, undefined);
    });
    const unsubRedo = editor.registerCommandHandler(REDO_COMMAND, () => {
      lexical.dispatchCommand(LEXICAL_REDO_COMMAND, undefined);
    });

    return () => {
      unsubUndo();
      unsubRedo();
      unregHistory();
    };
  },
};
