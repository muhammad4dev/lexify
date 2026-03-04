import * as React from "react";
import { useLexifyEditor } from "@lexify/react";
import {
  SET_FONT_COLOR_COMMAND,
  REMOVE_FONT_COLOR_COMMAND,
} from "@lexify/plugins";
import { isValidColor } from "@lexify/plugins";

export interface FontColorInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
> {
  value?: string;
  onChange?: (value: string) => void;
  /** Called when the submitted value fails color validation */
  onInvalidValue?: (value: string) => void;
}

export const FontColorInput = React.forwardRef<
  HTMLInputElement,
  FontColorInputProps
>(
  (
    {
      value = "",
      onChange,
      onInvalidValue,
      "aria-label": ariaLabel = "Font color",
      placeholder = "e.g. #ff0000",
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
        editor.dispatchCommand(REMOVE_FONT_COLOR_COMMAND, undefined);
        onChange?.("");
        return;
      }
      if (!isValidColor(trimmed)) {
        onInvalidValue?.(trimmed);
        return;
      }
      editor.dispatchCommand(SET_FONT_COLOR_COMMAND, trimmed);
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

FontColorInput.displayName = "FontColorInput";
