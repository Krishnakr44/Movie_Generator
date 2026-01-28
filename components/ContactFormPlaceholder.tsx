"use client";

/**
 * Contact form UI only – no backend. Prevents default submit in client.
 */
const CONTACT_EMAIL = "m87.krishna@gmail.com";

export function ContactFormPlaceholder() {
  return (
    <section className="mt-10" aria-label="Contact form (UI only)">
      <h2 className="font-sans text-lg font-semibold text-parchment-100">
        Send a message
      </h2>
      <p className="mt-1 text-sm text-ink-400">
        This form is for layout only. Use the email above to reach us.
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <label className="block">
          <span className="block text-sm font-medium text-parchment-200 mb-1">
            Name
          </span>
          <input
            type="text"
            name="name"
            placeholder="Your name"
            disabled
            className="w-full rounded-input border border-ink-600 bg-ink-800 px-3 py-2.5 text-parchment-100 placeholder-ink-500 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
            aria-describedby="form-disabled-desc"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-parchment-200 mb-1">
            Email
          </span>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            disabled
            className="w-full rounded-input border border-ink-600 bg-ink-800 px-3 py-2.5 text-parchment-100 placeholder-ink-500 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-parchment-200 mb-1">
            Message
          </span>
          <textarea
            name="message"
            placeholder="Your message…"
            rows={4}
            disabled
            className="w-full resize-y rounded-input border border-ink-600 bg-ink-800 px-3 py-2.5 text-parchment-100 placeholder-ink-500 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <p id="form-disabled-desc" className="text-xs text-ink-500 -mt-2">
          Form is display-only. Contact us at {CONTACT_EMAIL}.
        </p>
        <button
          type="button"
          disabled
          className="mt-2 w-full rounded-card bg-ink-700 py-2.5 text-sm font-medium text-ink-500 cursor-not-allowed sm:w-auto sm:px-6"
        >
          Send message
        </button>
      </form>
    </section>
  );
}
