import * as React from "react";
import { useLexifyEditor } from "@lexify/react";
import {
  SET_FONT_SIZE_COMMAND,
  REMOVE_FONT_SIZE_COMMAND,
} from "@lexify/plugin-font-size";
import { isValidFontSize } from "@lexify/plugin-utils";

export interface FontSizeInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> {
  value?: string;
  onChange?: (value: string) => void;
  /** Called when the submitted value fails validation */
  onInvalidValue?: (value: string) => void;
}

export const FontSizeInput = React.forwardRef<
  HTMLInputElement,
  FontSizeInputProps
>(
  (
    {
      value = "",
      onChange,
      onInvalidValue,
      "aria-label": ariaLabel = "Font size",
      placeholder = "e.g. 16px",
      ...rest
    },
    ref,
  ) => {
    const editor = useLexifyEditor();
    const [localValue, setLocalValue] = React.useState(value);

    React.useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const commit = (raw: string) => {
      const trimmed = raw.trim();
      if (!trimmed) {
        editor.dispatchCommand(REMOVE_FONT_SIZE_COMMAND, undefined);
        onChange?.("");
        return;
      }
      if (!isValidFontSize(trimmed)) {
        onInvalidValue?.(trimmed);
        return;
      }
      editor.dispatchCommand(SET_FONT_SIZE_COMMAND, trimmed);
      onChange?.(trimmed);
    };

    return (
      <input
        ref={ref}
        type="text"
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
          }
        }}
        {...rest}
      />
    );
  },
);

FontSizeInput.displayName = "FontSizeInput";
