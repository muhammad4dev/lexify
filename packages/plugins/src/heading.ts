import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const SET_HEADING_COMMAND: LexifyCommand<HeadingTag> =
  createCommand<HeadingTag>("lexify:block:heading");

export const REMOVE_HEADING_COMMAND: LexifyCommand<void> = createCommand<void>(
  "lexify:block:heading:remove",
);

export const headingPlugin: LexifyPlugin = {
  name: "lexify/heading",
  nodes: [HeadingNode],

  register(editor: LexifyEditor): () => void {
    const unsubSet = editor.registerCommandHandler(
      SET_HEADING_COMMAND,
      (tag) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(tag));
          }
        });
      },
    );

    const unsubRemove = editor.registerCommandHandler(
      REMOVE_HEADING_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        });
      },
    );

    return () => {
      unsubSet();
      unsubRemove();
    };
  },
};
