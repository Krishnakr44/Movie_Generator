"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#create", label: "Create Story" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on route change (e.g. after clicking a link)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-700/80 bg-ink-950/90 backdrop-blur-md supports-[backdrop-filter]:bg-ink-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-parchment-100 transition-colors hover:text-accent-light sm:text-xl"
          aria-label="Fiction Movie – Home"
        >
          Fiction Movie
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-smooth ease-smooth ${
                  active
                    ? "text-accent-light"
                    : "text-parchment-200 hover:bg-ink-800/60 hover:text-parchment-100"
                }`}
              >
                {label}
                {active && (
                  <span
                    className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-accent-light"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle + mobile menu button */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-parchment-200 hover:bg-ink-800 hover:text-parchment-100 focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-5 w-5">
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-smooth ease-smooth ${
                mobileOpen ? "top-2 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all duration-smooth ease-smooth ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition-all duration-smooth ease-smooth ${
                mobileOpen ? "top-2 -rotate-45" : "top-[14px]"
              }`}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Mobile nav panel: slide-down with opacity */}
      <div
        id="mobile-nav"
        className={`grid overflow-hidden transition-all duration-gentle ease-smooth md:hidden ${
          mobileOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <nav
          className="min-h-0 border-t border-ink-700/80 bg-ink-900/95 px-4 pb-4 pt-2"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-0.5">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-lg px-3 py-2.5 text-base font-medium transition-colors ${
                      active
                        ? "bg-accent-muted text-accent-light"
                        : "text-parchment-200 hover:bg-ink-800 hover:text-parchment-100"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
