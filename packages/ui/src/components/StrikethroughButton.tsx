import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import { FORMAT_STRIKETHROUGH_COMMAND } from "@lexra/plugin-strikethrough";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type StrikethroughButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const StrikethroughButton = React.forwardRef<HTMLButtonElement, StrikethroughButtonProps>(
  ({ children = "S", "aria-label": ariaLabel = "Strikethrough", ...rest }, ref) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => editor.dispatchCommand(FORMAT_STRIKETHROUGH_COMMAND, undefined)}
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

StrikethroughButton.displayName = "StrikethroughButton";
