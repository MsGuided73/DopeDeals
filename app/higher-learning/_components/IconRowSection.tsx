import { ReactNode } from "react";

interface IconRowSectionProps {
  /** Icon rendered inside the leftmost circular badge. Pass a lucide icon (sized w-7 h-7). */
  icon: ReactNode;
  /** Section heading. */
  title: string;
  /** Section body copy. Can be plain string or rich nodes. */
  children?: ReactNode;
  /** Content rendered in the right column of the inner 2-col grid (list, callout, paragraph, icon row, etc.). */
  rightContent?: ReactNode;
  /** Optional content rendered below the body in the LEFT column (e.g., an inline highlight callout). */
  leftBelow?: ReactNode;
  /** Adds a hairline divider above the section. Useful for stacking siblings. */
  divider?: boolean;
}

/**
 * Repeating section primitive for long-form Higher Learning articles.
 * Renders a circular outlined icon on the left and a 2-column content area
 * (title + body, plus optional right column) for the rest of the row. On
 * mobile, stacks vertically with the icon above the content.
 */
export default function IconRowSection({
  icon,
  title,
  children,
  rightContent,
  leftBelow,
  divider = true,
}: IconRowSectionProps) {
  return (
    <section
      className={`flex flex-col md:flex-row gap-5 md:gap-6 py-6 ${
        divider ? "border-t border-neutral-100" : ""
      }`}
    >
      <div className="shrink-0">
        <div className="w-[72px] h-[72px] rounded-full border border-[#d8e6cf] bg-[#f0f5e8] flex items-center justify-center text-[#1B7A4D]">
          {icon}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
        <div>
          <h2 className="text-[20px] md:text-[22px] font-bold text-neutral-900 mb-3 leading-snug">
            {title}
          </h2>
          {children && (
            <div className="text-[14px] text-neutral-700 leading-relaxed space-y-3">
              {children}
            </div>
          )}
          {leftBelow && <div className="mt-4">{leftBelow}</div>}
        </div>

        {rightContent && <div className="text-[14px] text-neutral-700">{rightContent}</div>}
      </div>
    </section>
  );
}
