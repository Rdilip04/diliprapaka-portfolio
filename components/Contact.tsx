const links = [
  { label: "Email", href: "mailto:rapakadilip582@gmail.com", display: "rapakadilip582@gmail.com" },
  { label: "LinkedIn", href: "#", display: "linkedin.com/in/diliprapaka" },
  { label: "Dribbble", href: "#", display: "dribbble.com/diliprapaka" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="max-w-5xl mx-auto px-6 py-28 border-t border-neutral-100"
    >
      <div className="max-w-xl">
        <p className="text-sm text-neutral-400 tracking-widest uppercase mb-3">
          Contact
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-4">
          Let's work together
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed mb-10">
          Have a project in mind or just want to chat about design? I'd love to
          hear from you. I usually respond within a day.
        </p>

        <div className="space-y-4">
          {links.map(({ label, href, display }) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between group border border-neutral-100 rounded-xl px-5 py-4 hover:border-neutral-300 transition-colors"
            >
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-neutral-900">{display}</p>
              </div>
              <span className="text-neutral-300 group-hover:text-neutral-900 transition-colors">
                →
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="mt-20 pt-8 border-t border-neutral-100 flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          © {new Date().getFullYear()} Dilip Rapaka. All rights reserved.
        </p>
        <p className="text-xs text-neutral-400">Product Designer</p>
      </div>
    </section>
  );
}
