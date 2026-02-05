import * as React from "react";

export interface ToolbarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether the format/option is currently active */
  isActive?: boolean;
}

/**
 * Unstyled base button for toolbar actions.
 * Sets data-active for CSS targeting; forwards all native button attributes.
 */
export const ToolbarButton = React.forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps
>(({ isActive = false, className, children, ...rest }, ref) => (
  <button
    ref={ref}
    type="button"
    data-active={isActive || undefined}
    className={className}
    {...rest}
  >
    {children}
  </button>
));

ToolbarButton.displayName = "ToolbarButton";
