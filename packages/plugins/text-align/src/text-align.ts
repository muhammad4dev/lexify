import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  type ElementFormatType,
} from "lexical";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Supported alignment values.
 * Prefer "start"/"end" over "left"/"right" for RTL compatibility.
 */
export type TextAlignValue = "left" | "right" | "center" | "justify" | "start" | "end";

// ─── Command ──────────────────────────────────────────────────────────────────

export const SET_TEXT_ALIGN_COMMAND: LexraCommand<TextAlignValue> =
  createCommand<TextAlignValue>("lexra:block:text-align");

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const textAlignPlugin: LexraPlugin = {
  name: "lexra/text-align",

  register(editor: LexraEditor): () => void {
    return editor.registerCommandHandler(SET_TEXT_ALIGN_COMMAND, (value) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const seen = new Set<string>();
        const nodes = selection.getNodes();

        for (const node of nodes) {
          // Walk up to the nearest block-level ElementNode
          let current = node.getParent();
          while (current !== null) {
            if ($isElementNode(current) && !current.isInline()) {
              break;
            }
            current = current.getParent();
          }

          if (current !== null && !seen.has(current.getKey())) {
            seen.add(current.getKey());
            current.setFormat(value as ElementFormatType);
          }
        }
      });
    });
  },
};
