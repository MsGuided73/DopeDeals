import { CheckCircle2 } from "lucide-react";

interface CheckmarkListProps {
  items: string[];
  /** Optional list heading. */
  heading?: string;
}

/**
 * Vertical bullet list with green check marks. Used in the right column of
 * IconRowSection to enumerate quick takeaways or product attributes.
 */
export default function CheckmarkList({ items, heading }: CheckmarkListProps) {
  return (
    <div>
      {heading && (
        <p className="text-[13px] font-bold uppercase tracking-widest text-neutral-700 mb-3">
          {heading}
        </p>
      )}
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <CheckCircle2
              className="w-4 h-4 text-[#1B7A4D] shrink-0 mt-0.5"
              aria-hidden
            />
            <span className="text-[14px] text-neutral-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
