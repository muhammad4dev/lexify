import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexra/plugin-list";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type BulletListButtonProps = Omit<ToolbarButtonProps, "onClick">;
export type NumberedListButtonProps = Omit<ToolbarButtonProps, "onClick">;
export type RemoveListButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const BulletListButton = React.forwardRef<
  HTMLButtonElement,
  BulletListButtonProps
>(
  (
    { children = "• List", "aria-label": ariaLabel = "Bullet list", ...rest },
    ref,
  ) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

BulletListButton.displayName = "BulletListButton";

export const NumberedListButton = React.forwardRef<
  HTMLButtonElement,
  NumberedListButtonProps
>(
  (
    {
      children = "1. List",
      "aria-label": ariaLabel = "Numbered list",
      ...rest
    },
    ref,
  ) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

NumberedListButton.displayName = "NumberedListButton";

export const RemoveListButton = React.forwardRef<
  HTMLButtonElement,
  RemoveListButtonProps
>(
  (
    {
      children = "Remove list",
      "aria-label": ariaLabel = "Remove list",
      ...rest
    },
    ref,
  ) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)}
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

RemoveListButton.displayName = "RemoveListButton";
