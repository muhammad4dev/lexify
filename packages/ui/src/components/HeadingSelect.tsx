import * as React from "react";
import { useLexraEditor } from "@lexra/react";
import {
  SET_HEADING_COMMAND,
  REMOVE_HEADING_COMMAND,
} from "@lexra/plugin-heading";
import type { HeadingTag } from "@lexra/plugin-heading";

export type HeadingValue = HeadingTag | "paragraph";

export interface HeadingSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "value"> {
  value?: HeadingValue;
  onChange?: (value: HeadingValue) => void;
}

const OPTIONS: Array<{ value: HeadingValue; label: string }> = [
  { value: "paragraph", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

export const HeadingSelect = React.forwardRef<
  HTMLSelectElement,
  HeadingSelectProps
>(
  (
    {
      value = "paragraph",
      onChange,
      "aria-label": ariaLabel = "Block format",
      ...rest
    },
    ref,
  ) => {
    const editor = useLexraEditor();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const next = e.target.value as HeadingValue;
      if (next === "paragraph") {
        editor.dispatchCommand(REMOVE_HEADING_COMMAND, undefined);
      } else {
        editor.dispatchCommand(SET_HEADING_COMMAND, next);
      }
      onChange?.(next);
    };

    return (
      <select
        ref={ref}
        value={value}
        onChange={handleChange}
        aria-label={ariaLabel}
        {...rest}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
);

HeadingSelect.displayName = "HeadingSelect";
