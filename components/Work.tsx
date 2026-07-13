const projects = [
  {
    id: "01",
    title: "Project Name One",
    category: "Mobile App · UX/UI Design",
    description:
      "A brief description of the problem you solved, the approach you took, and the impact it had on users and the business.",
    tags: ["Research", "Wireframing", "Prototyping"],
    bg: "bg-neutral-50",
  },
  {
    id: "02",
    title: "Project Name Two",
    category: "SaaS Platform · Product Design",
    description:
      "A brief description of the problem you solved, the approach you took, and the impact it had on users and the business.",
    tags: ["Design System", "User Testing", "Handoff"],
    bg: "bg-stone-50",
  },
  {
    id: "03",
    title: "Project Name Three",
    category: "Web App · End-to-End Design",
    description:
      "A brief description of the problem you solved, the approach you took, and the impact it had on users and the business.",
    tags: ["Discovery", "Information Architecture", "UI"],
    bg: "bg-zinc-50",
  },
];

export default function Work() {
  return (
    <section id="work" className="max-w-5xl mx-auto px-6 py-28">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-sm text-neutral-400 tracking-widest uppercase mb-3">
            Selected Work
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Recent projects
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`group ${project.bg} rounded-2xl p-8 flex flex-col sm:flex-row sm:items-start gap-6 cursor-pointer hover:bg-neutral-100 transition-colors`}
          >
            <span className="text-xs font-mono text-neutral-300 pt-1 shrink-0">
              {project.id}
            </span>
            <div className="flex-1">
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">
                {project.category}
              </p>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-neutral-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-5 max-w-xl">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-neutral-400 border border-neutral-200 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-neutral-300 group-hover:text-neutral-900 transition-colors text-xl self-center">
              →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
