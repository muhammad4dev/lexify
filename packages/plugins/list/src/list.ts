import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  $createParagraphNode,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";
import {
  $createListNode,
  $createListItemNode,
  $isListNode,
  $isListItemNode,
  ListNode,
  ListItemNode,
} from "@lexical/list";
import { createCommand } from "@lexra/core";
import type { LexraPlugin, LexraEditor, LexraCommand } from "@lexra/core";

// ─── Commands ─────────────────────────────────────────────────────────────────

export const INSERT_UNORDERED_LIST_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:list:insert:bullet");

export const INSERT_ORDERED_LIST_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:list:insert:number");

export const REMOVE_LIST_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:list:remove");

export const INDENT_LIST_ITEM_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:list:indent");

export const OUTDENT_LIST_ITEM_COMMAND: LexraCommand<void> =
  createCommand<void>("lexra:list:outdent");

// ─── Helpers ──────────────────────────────────────────────────────────────────

type ListType = "bullet" | "number";

function insertList(editor: LexraEditor, listType: ListType): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const nodes = selection.getNodes();
    const listNode = $createListNode(listType);
    const seen = new Set<string>();

    for (const node of nodes) {
      // Walk up to block-level parent
      let block = node.getParent();
      while (block && !($isElementNode(block) && !block.isInline())) {
        block = block.getParent();
      }
      if (!block || seen.has(block.getKey())) continue;
      seen.add(block.getKey());

      const listItem = $createListItemNode();
      // Move block's children into the list item
      for (const child of block.getChildren()) {
        listItem.append(child);
      }
      listNode.append(listItem);
      block.insertBefore(listNode);
      block.remove();
    }
  });
}

function removeList(editor: LexraEditor): void {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const nodes = selection.getNodes();
    const seen = new Set<string>();

    for (const node of nodes) {
      let current = node.getParent();
      while (current && !$isListNode(current)) {
        current = current.getParent();
      }
      if (!current || seen.has(current.getKey())) continue;
      seen.add(current.getKey());

      // Replace each list item with a paragraph
      for (const child of current.getChildren()) {
        if ($isListItemNode(child)) {
          const para = $createParagraphNode();
          for (const grandchild of child.getChildren()) {
            para.append(grandchild);
          }
          current.insertBefore(para);
        }
      }
      current.remove();
    }
  });
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const listPlugin: LexraPlugin = {
  name: "lexra/list",
  nodes: [ListNode, ListItemNode],

  register(editor: LexraEditor): () => void {
    const unsubBullet = editor.registerCommandHandler(
      INSERT_UNORDERED_LIST_COMMAND,
      () => insertList(editor, "bullet"),
    );

    const unsubNumber = editor.registerCommandHandler(
      INSERT_ORDERED_LIST_COMMAND,
      () => insertList(editor, "number"),
    );

    const unsubRemove = editor.registerCommandHandler(
      REMOVE_LIST_COMMAND,
      () => removeList(editor),
    );

    // Indent/outdent delegate to Lexical's built-in commands via update
    const unsubIndent = editor.registerCommandHandler(INDENT_LIST_ITEM_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.getNodes().forEach((node) => {
            let item = node.getParent();
            while (item && !$isListItemNode(item)) item = item?.getParent() ?? null;
            if ($isListItemNode(item)) item.setIndent(item.getIndent() + 1);
          });
        }
      });
    });

    const unsubOutdent = editor.registerCommandHandler(OUTDENT_LIST_ITEM_COMMAND, () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.getNodes().forEach((node) => {
            let item = node.getParent();
            while (item && !$isListItemNode(item)) item = item?.getParent() ?? null;
            if ($isListItemNode(item)) {
              item.setIndent(Math.max(0, item.getIndent() - 1));
            }
          });
        }
      });
    });

    return () => {
      unsubBullet();
      unsubNumber();
      unsubRemove();
      unsubIndent();
      unsubOutdent();
    };
  },
};

// Re-export Lexical's built-in indent commands for convenience
export { INDENT_CONTENT_COMMAND, OUTDENT_CONTENT_COMMAND };
