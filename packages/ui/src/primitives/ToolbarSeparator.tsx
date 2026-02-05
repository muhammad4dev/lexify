import * as React from "react";

export interface ToolbarSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/** Visual divider between toolbar groups. */
export const ToolbarSeparator = React.forwardRef<
  HTMLDivElement,
  ToolbarSeparatorProps
>(({ role = "separator", ...rest }, ref) => (
  <div ref={ref} role={role} aria-orientation="vertical" {...rest} />
));

ToolbarSeparator.displayName = "ToolbarSeparator";
