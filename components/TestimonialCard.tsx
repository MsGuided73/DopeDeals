export default function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <figure className="rounded-2xl bg-glass p-5 border border-white/10">
      <blockquote className="text-text/90">“{quote}”</blockquote>
      <figcaption className="mt-3 text-sm text-text/60">— {author}</figcaption>
    </figure>
  );
}

