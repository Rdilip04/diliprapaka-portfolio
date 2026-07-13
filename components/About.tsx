const skills = [
  "User Research",
  "Wireframing",
  "Prototyping",
  "Design Systems",
  "Figma",
  "Usability Testing",
  "Information Architecture",
  "Interaction Design",
];

export default function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-6 py-28 border-t border-neutral-100">
      <div className="grid sm:grid-cols-2 gap-16">
        <div>
          <p className="text-sm text-neutral-400 tracking-widest uppercase mb-3">
            About
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-6">
            A little about me
          </h2>
          <div className="space-y-4 text-neutral-500 leading-relaxed text-sm">
            <p>
              I'm Dilip Rapaka, a product designer with a passion for crafting
              experiences that feel effortless. I believe great design is
              invisible — it just works.
            </p>
            <p>
              My process starts with understanding people: their goals,
              frustrations, and the context in which they use a product. From
              there, I move from rough sketches to polished interfaces, always
              testing and iterating.
            </p>
            <p>
              When I'm not designing, you'll find me exploring new tools,
              reading about psychology and design, or looking for what makes
              everyday interactions delightful.
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm text-neutral-400 tracking-widest uppercase mb-6 mt-9 sm:mt-9">
            Skills & Tools
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-full px-4 py-1.5"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-10 space-y-4">
            <p className="text-sm text-neutral-400 tracking-widest uppercase">
              Currently
            </p>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Open to full-time roles and select freelance projects. I'm
              especially interested in B2B SaaS, developer tools, and products
              with real user impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
