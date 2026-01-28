import Link from "next/link";
import { BackToTop } from "@/components/BackToTop";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#create", label: "Create Story" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

const CONTACT_EMAIL = "m87.krishna@gmail.com";

/** Simple mail icon – no external dependency */
function MailIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-ink-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink-700/80 bg-ink-900/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand + tagline – spans more on large screens */}
          <div className="sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-block font-display text-xl font-semibold tracking-tight text-parchment-100 transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 rounded"
            >
              Fiction Movie
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-400 max-w-sm">
              AI-powered Indian fiction. You set the rules; we help you tell the story.
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-4 lg:col-start-7">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Navigate
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 sm:flex-col sm:gap-y-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-parchment-200 transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">
              Contact
            </h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 text-sm text-parchment-200 transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 rounded"
            >
              <MailIcon />
              <span className="break-all underline underline-offset-2 decoration-ink-600 hover:decoration-accent-light">
                {CONTACT_EMAIL}
              </span>
            </a>
            <p className="mt-1.5 text-xs text-ink-500">
              Support, feedback & partnerships
            </p>
          </div>
        </div>

        {/* Bottom bar: copyright + back to top */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-700/60 pt-8 sm:flex-row">
          <p className="text-xs text-ink-500 order-2 sm:order-1">
            © {currentYear} Fiction Movie. All rights reserved.
          </p>
          <span className="order-1 sm:order-2">
            <BackToTop />
          </span>
        </div>
      </div>
    </footer>
  );
}
