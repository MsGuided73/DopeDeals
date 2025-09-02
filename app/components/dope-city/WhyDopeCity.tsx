export default function WhyDopeCity() {
  const cards = [
    { title: 'Curated > Clutter', body: 'We hand-pick glass and tools that actually perform. No gimmicks—just the good stuff.' },
    { title: 'Experience-First', body: 'Flavor, Balance, or Clouds—tune your setup to your goal.' },
    { title: 'Fast & Fair', body: 'Quick shipping, easy returns, and straight answers.' },
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-black text-black">Why Dope City</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {cards.map((c)=> (
            <div key={c.title} className="rounded-2xl border p-6 shadow-lift">
              <div className="text-xl font-bold">{c.title}</div>
              <p className="mt-2 text-black/70">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

