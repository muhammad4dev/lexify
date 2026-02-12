import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import { REDO_COMMAND } from "@lexra/plugin-history";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type RedoButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const RedoButton = React.forwardRef<HTMLButtonElement, RedoButtonProps>(
  ({ children = "↪", "aria-label": ariaLabel = "Redo", ...rest }, ref) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

RedoButton.displayName = "RedoButton";
