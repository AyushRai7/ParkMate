import * as React from "react";
import {
  NavLink as RouterNavLink,
  NavLinkProps,
  NavLinkRenderProps,
} from "react-router-dom";
import { cn } from "@/lib/utils";

type NavLinkCompatProps = Omit<NavLinkProps, "className"> & {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
};

const NavLink = React.forwardRef<
  HTMLAnchorElement,
  NavLinkCompatProps
>(({ className, activeClassName, pendingClassName, ...props }, ref) => {
  return (
    <RouterNavLink
      ref={ref}
      className={({ isActive, isPending }: NavLinkRenderProps) =>
        cn(
          className,
          isActive && activeClassName,
          isPending && pendingClassName
        )
      }
      {...props}
    />
  );
});

NavLink.displayName = "NavLink";

export { NavLink };
