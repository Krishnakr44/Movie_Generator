/**
 * About Us – professional, vision-driven copy about the platform.
 * No marketing fluff; reading-optimized layout.
 */
export default function AboutPage() {
  return (
    <main className="min-h-[60vh]">
      <div className="mx-auto max-w-reader px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-parchment-100 sm:text-4xl">
          About Fiction Movie
        </h1>
        <p className="mt-2 text-ink-400 text-lg">
          Where storytelling meets structure.
        </p>

        <div className="mt-10 space-y-8 font-serif text-reader text-parchment-200 leading-relaxed">
          <section>
            <h2 className="font-sans text-xl font-semibold text-parchment-100 mb-3">
              What we do
            </h2>
            <p>
              Fiction Movie is a platform for writers who want control without losing creativity.
              We use AI to generate chapter-driven fiction within rules you define: world-building,
              character arcs, tone, and pacing. You direct; the engine writes. Every story stays
              consistent, memorable, and yours.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-parchment-100 mb-3">
              Structured AI storytelling
            </h2>
            <p>
              Instead of one-off prompts, we focus on structured narratives. You set world rules,
              character traits, and timeline events. Chapters are generated in order, with memory
              of what came before. That means coherent long-form fiction—mythology, folklore,
              sci-fi, or literary—without the mess of ad-hoc generation.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-parchment-100 mb-3">
              Indian and niche fiction
            </h2>
            <p>
              We have a special interest in Indian and niche fiction: mythology, regional folklore,
              desi sci-fi, and stories that are under-served by generic tools. The platform is
              built to support cultural depth, consistent terminology, and narrative traditions
              that matter to you.
            </p>
          </section>

          <section>
            <h2 className="font-sans text-xl font-semibold text-parchment-100 mb-3">
              Vision
            </h2>
            <p>
              We believe the best stories come when technology amplifies human vision rather than
              replacing it. Fiction Movie is designed for authors, hobbyists, and anyone who wants
              to tell long, structured stories without losing control—or spending years drafting
              alone.
            </p>
          </section>
        </div>

        <p className="mt-12 text-center sm:text-left">
          <a
            href="/#create"
            className="text-accent-light hover:underline font-medium"
          >
            Start your story →
          </a>
        </p>
      </div>
    </main>
  );
}
