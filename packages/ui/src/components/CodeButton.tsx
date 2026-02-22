import * as React from "react";
import { useLexifyEditor } from "@lexify/react";
import { FORMAT_CODE_COMMAND } from "@lexify/plugin-code";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type CodeButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const CodeButton = React.forwardRef<HTMLButtonElement, CodeButtonProps>(
  ({ children = "<>", "aria-label": ariaLabel = "Code", ...rest }, ref) => {
    const editor = useLexifyEditor();
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
