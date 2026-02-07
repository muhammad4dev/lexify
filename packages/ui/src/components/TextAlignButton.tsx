import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import { SET_TEXT_ALIGN_COMMAND } from "@lexra/plugin-text-align";
import type { TextAlignValue } from "@lexra/plugin-text-align";
import { ToolbarButton } from "../primitives/ToolbarButton.js";
import type { ToolbarButtonProps } from "../primitives/ToolbarButton.js";

export interface TextAlignButtonProps
  extends Omit<ToolbarButtonProps, "onClick"> {
  /** The alignment this button applies */
  align: TextAlignValue;
}

export const TextAlignButton = React.forwardRef<
  HTMLButtonElement,
  TextAlignButtonProps
>(
  (
    {
      align,
      children,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const editor = useLexraEditor();
    const label = ariaLabel ?? `Align ${align}`;
    return (
      <ToolbarButton
        ref={ref}
        aria-label={label}
        onClick={() => editor.dispatchCommand(SET_TEXT_ALIGN_COMMAND, align)}
        {...rest}
      >
        {children ?? align}
      </ToolbarButton>
    );
  },
);

TextAlignButton.displayName = "TextAlignButton";
