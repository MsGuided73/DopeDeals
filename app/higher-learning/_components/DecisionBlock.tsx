export interface DecisionColumn {
  heading: string;
  items: string[];
}

interface DecisionBlockProps {
  title?: string;
  intro?: string;
  left: DecisionColumn;
  right: DecisionColumn;
}

/**
 * "Which One Should You Choose?" decision block — two parallel columns of
 * lifestyle bullets with a circular "VS" marker between them.
 */
export default function DecisionBlock({
  title = "Which One Should You Choose?",
  intro,
  left,
  right,
}: DecisionBlockProps) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl md:text-[28px] font-bold text-neutral-900 mb-2 leading-tight">
        {title}
      </h2>
      {intro && <p className="text-[15px] text-neutral-700 mb-5">{intro}</p>}

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-5 md:p-6">
        <DecisionColumnUI column={left} />
        <DecisionColumnUI column={right} />

        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-12 h-12 rounded-full bg-white border border-neutral-200 shadow-sm">
          <span className="text-xs font-bold tracking-widest text-neutral-700">VS</span>
        </div>
      </div>
    </section>
  );
}

function DecisionColumnUI({ column }: { column: DecisionColumn }) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#1B7A4D] mb-3">
        {column.heading}
      </h3>
      <ul className="list-disc list-inside text-sm text-neutral-800 space-y-1.5 marker:text-neutral-400">
        {column.items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}
