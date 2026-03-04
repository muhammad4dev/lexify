import * as React from "react";
import { useLexifyEditor } from "@lexify/react";
import { FORMAT_UNDERLINE_COMMAND } from "@lexify/plugins";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type UnderlineButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const UnderlineButton = React.forwardRef<
  HTMLButtonElement,
  UnderlineButtonProps
>(({ children = "U", "aria-label": ariaLabel = "Underline", ...rest }, ref) => {
  const editor = useLexifyEditor();
  return (
    <ToolbarButton
      ref={ref}
      aria-label={ariaLabel}
      onClick={() =>
        editor.dispatchCommand(FORMAT_UNDERLINE_COMMAND, undefined)
      }
      {...rest}
    >
      {children}
    </ToolbarButton>
  );
});

UnderlineButton.displayName = "UnderlineButton";
