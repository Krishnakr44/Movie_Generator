"use client";

import { forwardRef } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const baseSelect =
  "w-full rounded-input bg-ink-800 border border-ink-600 text-parchment-100",
  focusRing =
  "focus:border-accent/60 focus:ring-2 focus:ring-accent/20 focus:outline-none",
  errorRing = "border-red-800/80 focus:border-red-700 focus:ring-red-900/30";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      label,
      hint,
      error,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const autoId =
      id ?? `select-${Math.random().toString(36).slice(2, 9)}`;
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
        <select
          ref={ref}
          id={autoId}
          className={[
            baseSelect,
            focusRing,
            error ? errorRing : "",
            "px-3 py-2.5 appearance-none cursor-pointer",
            "bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat",
            "pr-10 transition-colors duration-smooth",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a8a29e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          }}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            hint ? `${autoId}-hint` : error ? `${autoId}-error` : undefined
          }
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
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

Select.displayName = "Select";
