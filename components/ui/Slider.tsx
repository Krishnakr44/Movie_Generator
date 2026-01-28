"use client";

import { useId } from "react";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  /** Optional labels for min/max (e.g. "Low", "High") */
  minLabel?: string;
  maxLabel?: string;
  /** Display value (e.g. "Moderate"); overrides raw value for display */
  displayValue?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

export function Slider({
  className = "",
  label,
  minLabel,
  maxLabel,
  displayValue,
  value,
  onChange,
  min,
  max,
  step = 1,
  id: providedId,
  ...props
}: SliderProps) {
  const id = providedId ?? useId();
  const progress = ((value - min) / (max - min)) * 100;

  return (
    <div className={["w-full", className].join(" ")}>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-parchment-200"
          >
            {label}
          </label>
        )}
        <span className="text-sm text-ink-400 tabular-nums ml-auto">
          {displayValue ?? value}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {minLabel && (
          <span className="text-xs text-ink-500 w-8 shrink-0">{minLabel}</span>
        )}
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none bg-ink-700 cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent
            [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={
            {
              background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${progress}%, var(--border-default) ${progress}%, var(--border-default) 100%)`,
            } as React.CSSProperties
          }
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={displayValue}
          {...props}
        />
        {maxLabel && (
          <span className="text-xs text-ink-500 w-8 shrink-0 text-right">{maxLabel}</span>
        )}
      </div>
    </div>
  );
}
