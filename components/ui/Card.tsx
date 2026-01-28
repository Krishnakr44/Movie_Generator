"use client";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slightly elevated on hover when true */
  hover?: boolean;
  /** Padding variant */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  className = "",
  hover = false,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-card bg-ink-900 border border-ink-700",
        "shadow-card transition-shadow duration-smooth",
        hover ? "hover:shadow-card-hover hover:border-ink-600" : "",
        paddingMap[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = "",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={["flex items-center justify-between gap-2 mb-4", className].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  as: As = "h3",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: "h2" | "h3" | "h4" }) {
  return (
    <As
      className={[
        "text-base font-semibold text-parchment-100 tracking-tight",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
