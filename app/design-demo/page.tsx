import { Hero, Panel, MetalDivider } from '@/components/design/NikeIndustrial';

export const metadata = {
  title: 'Design Demo — Industrial Aesthetic',
  description: 'Preview of the NikeIndustrial design primitives',
};

export default function Page() {
  return (
    <>
      <Hero title="Industrial Aesthetic" subtitle="Bold, minimal, geometric.">
        <div className="mt-4">
          <a
            href="#"
            className="inline-block rounded bg-black px-4 py-2 text-white hover:bg-neutral-800 transition"
          >
            Shop Now
          </a>
        </div>
      </Hero>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <Panel className="p-6">
          <h2 className="text-xl font-semibold tracking-tight">Panel Example</h2>
          <p className="mt-2 text-neutral-600">
            This panel demonstrates the glassy white surface with subtle border/shadow and rounded corners. Use it for product highlights,
            callouts, or content sections.
          </p>
        </Panel>

        <MetalDivider />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel className="p-6">
            <h3 className="font-semibold">Precision</h3>
            <p className="mt-1 text-sm text-neutral-600">Geometric layout with strong rhythm and spacing.</p>
          </Panel>
          <Panel className="p-6">
            <h3 className="font-semibold">Materiality</h3>
            <p className="mt-1 text-sm text-neutral-600">Metallic accents, concrete textures, and bold type.</p>
          </Panel>
          <Panel className="p-6">
            <h3 className="font-semibold">Focus</h3>
            <p className="mt-1 text-sm text-neutral-600">Minimal ornamentation with high-contrast CTAs.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}

