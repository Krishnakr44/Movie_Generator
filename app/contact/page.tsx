import { ContactFormPlaceholder } from "@/components/ContactFormPlaceholder";

/**
 * Contact Us – simple layout with email and optional form UI only.
 * No backend submission; accessible and mobile-friendly.
 */
const CONTACT_EMAIL = "m87.krishna@gmail.com";

export default function ContactPage() {
  return (
    <main className="min-h-[60vh]">
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-parchment-100 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-2 text-ink-400 text-lg">
          We’d love to hear from you.
        </p>

        {/* Contact email – primary */}
        <section className="mt-10 rounded-card border border-ink-700 bg-ink-900/50 p-6">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-wider text-ink-500">
            Email
          </h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-2 block break-all text-lg font-medium text-parchment-100 hover:text-accent-light transition-colors underline underline-offset-2 decoration-ink-500 hover:decoration-accent-light"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-2 text-sm text-ink-400">
            For support, feedback, or partnerships.
          </p>
        </section>

        <ContactFormPlaceholder />
      </div>
    </main>
  );
}
