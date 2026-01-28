"use client";

import { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

const baseInput =
  "w-full rounded-input bg-ink-800 border border-ink-600 text-parchment-100 placeholder:text-ink-500",
  focusRing =
  "focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:outline-none",
  errorRing = "border-red-800/80 focus:border-red-700 focus:ring-red-900/30";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, hint, error, id, ...props }, ref) => {
    const autoId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={autoId}
            className="block text-sm font-medium text-parchment-200 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={autoId}
          className={[
            baseInput,
            focusRing,
            error ? errorRing : "",
            "px-3 py-2.5 transition-colors duration-smooth",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            [hint ? `${autoId}-hint` : null, error ? `${autoId}-error` : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          {...props}
        />
        {hint && !error && (
          <p id={`${autoId}-hint`} className="mt-1 text-xs text-ink-500">
            {hint}
          </p>
        )}
        {error && (
          <p id={`${autoId}-error`} className="mt-1 text-xs text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
