import { $getSelection, $isRangeSelection, $createParagraphNode } from "lexical";
import { $createHeadingNode, HeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const SET_HEADING_COMMAND: LexraCommand<HeadingTag> =
  createCommand<HeadingTag>("lexra:block:heading");

export const REMOVE_HEADING_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:block:heading:remove");

export const headingPlugin: LexraPlugin = {
  name: "lexra/heading",
  nodes: [HeadingNode],

  register(editor: LexraEditor): () => void {
    const unsubSet = editor.registerCommandHandler(SET_HEADING_COMMAND, (tag) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    });

    const unsubRemove = editor.registerCommandHandler(REMOVE_HEADING_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    });

    return () => {
      unsubSet();
      unsubRemove();
    };
  },
};
