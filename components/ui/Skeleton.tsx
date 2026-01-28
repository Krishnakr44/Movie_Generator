"use client";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Preset shape for common patterns */
  variant?: "text" | "paragraph" | "card" | "button" | "circle";
}

export function Skeleton({
  className = "",
  variant,
  ...props
}: SkeletonProps) {
  const base = "animate-pulse rounded bg-ink-700/60";
  const variants: Record<NonNullable<SkeletonProps["variant"]>, string> = {
    text: "h-4 max-w-[8rem]",
    paragraph: "h-3 max-w-full mb-2 last:mb-0",
    card: "h-24",
    button: "h-10 max-w-[10rem]",
    circle: "rounded-full w-10 h-10",
  };
  return (
    <div
      className={[base, variant ? variants[variant] : "", className].join(" ")}
      aria-hidden
      {...props}
    />
  );
}

/** Multi-line skeleton for story/chapter loading */
export function ChapterSkeleton() {
  return (
    <div className="max-w-reader space-y-3 animate-fade-in">
      <Skeleton className="h-6 w-48 mb-4" />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Skeleton
          key={i}
          className="h-3 w-full"
          style={{ width: i === 4 ? "85%" : "100%" }}
        />
      ))}
    </div>
  );
}

/** Card-shaped skeleton for creation panels */
export function CardSkeleton() {
  return (
    <div className="rounded-card bg-ink-900 border border-ink-700 p-5 space-y-4">
      <Skeleton variant="text" className="max-w-[6rem]" />
      <Skeleton variant="paragraph" className="max-w-full" />
      <Skeleton variant="paragraph" className="max-w-[90%]" />
      <Skeleton variant="button" className="mt-2" />
    </div>
  );
}
