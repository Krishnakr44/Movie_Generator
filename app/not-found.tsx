import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <h1 className="font-display text-6xl sm:text-7xl font-semibold text-parchment-100 tracking-tight">
          404
        </h1>
        <p className="mt-4 text-lg text-ink-400">
          This page doesn&apos;t exist or has been moved.
        </p>
        <p className="mt-2 text-parchment-200">
          Head back home to create your next story.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-input px-6 py-3 bg-accent hover:bg-accent-light text-parchment-100 font-medium transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
