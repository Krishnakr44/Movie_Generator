"use client";

export interface ErrorBoxProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorBox({
  title = "Something went wrong",
  message,
  onDismiss,
  className = "",
}: ErrorBoxProps) {
  return (
    <div
      role="alert"
      className={[
        "rounded-card border border-red-900/60 bg-red-950/40 px-4 py-3",
        "text-red-200 text-sm",
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <span className="font-medium shrink-0">{title}</span>
        <p className="flex-1 min-w-0">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-red-400 hover:text-red-200 transition-colors p-0.5 rounded focus:ring-2 focus:ring-red-500/50 focus:outline-none"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
