import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import { UNDO_COMMAND } from "@lexra/plugin-history";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type UndoButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const UndoButton = React.forwardRef<HTMLButtonElement, UndoButtonProps>(
  ({ children = "↩", "aria-label": ariaLabel = "Undo", ...rest }, ref) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

UndoButton.displayName = "UndoButton";
