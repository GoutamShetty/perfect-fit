export type LegalSection = { heading: string; body: string };

export default function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl text-neutral-50">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">Last updated: {new Date().toLocaleDateString("en-IN")}</p>
        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl text-gold">{s.heading}</h2>
              <p className="mt-2 leading-relaxed text-neutral-400">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
