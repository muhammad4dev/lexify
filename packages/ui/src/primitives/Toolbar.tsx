import * as React from "react";

export interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

/** Root toolbar container. */
export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ role = "toolbar", children, ...rest }, ref) => (
    <div ref={ref} role={role} {...rest}>
      {children}
    </div>
  ),
);

Toolbar.displayName = "Toolbar";
