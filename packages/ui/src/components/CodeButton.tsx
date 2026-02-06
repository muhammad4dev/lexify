import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import { FORMAT_CODE_COMMAND } from "@lexra/plugin-code";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type CodeButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const CodeButton = React.forwardRef<HTMLButtonElement, CodeButtonProps>(
  ({ children = "<>", "aria-label": ariaLabel = "Code", ...rest }, ref) => {
    const editor = useLexraEditor();
    return (
      <ToolbarButton
        ref={ref}
        aria-label={ariaLabel}
        onClick={() => editor.dispatchCommand(FORMAT_CODE_COMMAND, undefined)}
        {...rest}
      >
        {children}
      </ToolbarButton>
    );
  },
);

CodeButton.displayName = "CodeButton";
