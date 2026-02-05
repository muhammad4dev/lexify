import * as React from "react";

export interface ToolbarGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/** Groups related toolbar controls. */
export const ToolbarGroup = React.forwardRef<
  HTMLDivElement,
  ToolbarGroupProps
>(({ role = "group", children, ...rest }, ref) => (
  <div ref={ref} role={role} {...rest}>
    {children}
  </div>
));

ToolbarGroup.displayName = "ToolbarGroup";
