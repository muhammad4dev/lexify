import {
  $getSelection,
  $isRangeSelection,
  $isElementNode,
  $isTextNode,
} from "lexical";
import { $createLinkNode, $isLinkNode, LinkNode } from "@lexical/link";
import { createCommand } from "@lexify/core";
import type { LexifyPlugin, LexifyEditor, LexifyCommand } from "@lexify/core";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LinkPayload {
  url: string;
  target?: string;
  rel?: string;
}

// ─── Commands ─────────────────────────────────────────────────────────────────

export const INSERT_LINK_COMMAND: LexifyCommand<LinkPayload> =
  createCommand<LinkPayload>("lexify:link:insert");

export const UPDATE_LINK_COMMAND: LexifyCommand<LinkPayload> =
  createCommand<LinkPayload>("lexify:link:update");

export const REMOVE_LINK_COMMAND: LexifyCommand<void> =
  createCommand<void>("lexify:link:remove");

// ─── Plugin ───────────────────────────────────────────────────────────────────

export const linkPlugin: LexifyPlugin = {
  name: "lexify/link",
  nodes: [LinkNode],

  register(editor: LexifyEditor): () => void {
    const unsubInsert = editor.registerCommandHandler(
      INSERT_LINK_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          if (selection.isCollapsed()) {
            // Nothing selected — insert a text link node
            const linkNode = $createLinkNode(payload.url, {
              ...(payload.target !== undefined && { target: payload.target }),
              ...(payload.rel !== undefined && { rel: payload.rel }),
            });
            selection.insertNodes([linkNode]);
          } else {
            // Wrap selected content in a link
            const nodes = selection.extract();
            const linkNode = $createLinkNode(payload.url, {
              ...(payload.target !== undefined && { target: payload.target }),
              ...(payload.rel !== undefined && { rel: payload.rel }),
            });
            const firstNode = nodes[0];
            if (firstNode) {
              firstNode.insertBefore(linkNode);
            }
            for (const node of nodes) {
              linkNode.append(node);
            }
          }
        });
      },
    );

    const unsubUpdate = editor.registerCommandHandler(
      UPDATE_LINK_COMMAND,
      (payload) => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const nodes = selection.getNodes();
          for (const node of nodes) {
            const parent = node.getParent();
            if ($isLinkNode(parent)) {
              parent.setURL(payload.url);
              if (payload.target !== undefined)
                parent.setTarget(payload.target);
              if (payload.rel !== undefined) parent.setRel(payload.rel);
            }
          }
        });
      },
    );

    const unsubRemove = editor.registerCommandHandler(
      REMOVE_LINK_COMMAND,
      () => {
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const nodes = selection.getNodes();
          const seen = new Set<string>();

          for (const node of nodes) {
            const parent = node.getParent();
            if ($isLinkNode(parent) && !seen.has(parent.getKey())) {
              seen.add(parent.getKey());
              // Unwrap: hoist children out of the link node, then remove it
              const children = parent.getChildren();
              for (const child of children) {
                if ($isTextNode(child) || $isElementNode(child)) {
                  parent.insertBefore(child);
                }
              }
              parent.remove();
            }
          }
        });
      },
    );

    return () => {
      unsubInsert();
      unsubUpdate();
      unsubRemove();
    };
  },
};
