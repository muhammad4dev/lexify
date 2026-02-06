import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import { FORMAT_BOLD_COMMAND } from "@lexra/plugin-bold";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type BoldButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const BoldButton = React.forwardRef<HTMLButtonElement, BoldButtonProps>(
  ({ children = "B", "aria-label": ariaLabel = "Bold", ...rest }, ref) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => editor.dispatchCommand(FORMAT_BOLD_COMMAND, undefined)}
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

BoldButton.displayName = "BoldButton";
