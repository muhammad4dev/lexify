import * as React from "react";
import { useLexifyEditor } from "@lexify/react";
import { FORMAT_ITALIC_COMMAND } from "@lexify/plugins";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export type ItalicButtonProps = Omit<ToolbarButtonProps, "onClick">;

export const ItalicButton = React.forwardRef<
  HTMLButtonElement,
  ItalicButtonProps
>(({ children = "I", "aria-label": ariaLabel = "Italic", ...rest }, ref) => {
  const editor = useLexifyEditor();
  return (
    <ToolbarButton
      ref={ref}
      aria-label={ariaLabel}
      onClick={() => editor.dispatchCommand(FORMAT_ITALIC_COMMAND, undefined)}
      {...rest}
    >
      {children}
    </ToolbarButton>
  );
});

ItalicButton.displayName = "ItalicButton";
