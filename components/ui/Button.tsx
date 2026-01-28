"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Full-width on small screens when true */
  block?: boolean;
}

const variantStyles: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-accent text-white border-transparent hover:bg-accent-light active:bg-accent-dark shadow-card",
  secondary:
    "bg-ink-800 text-parchment-100 border border-ink-600 hover:bg-ink-700 hover:border-ink-500",
  ghost:
    "bg-transparent text-ink-400 hover:text-parchment-100 hover:bg-ink-800/50 border-transparent",
  danger:
    "bg-red-900/30 text-red-300 border border-red-800/50 hover:bg-red-900/50",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-input",
  md: "px-4 py-2.5 text-sm rounded-input",
  lg: "px-6 py-3 text-base rounded-card",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      loading = false,
      block = false,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center font-medium transition-all duration-smooth ease-smooth",
          "border focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          variantStyles[variant],
          sizeStyles[size],
          block ? "w-full sm:w-auto" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" aria-hidden />
            <span>{children}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
