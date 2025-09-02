"use client";
import { useState } from 'react';
import { recommend, type VibeInputs } from 'lib/productFilters';
import { track } from 'lib/analytics';

export default function VibeFinder() {
  const [inputs, setInputs] = useState<VibeInputs>({ what: 'Flower', where: 'Home', flavorClouds: 50, budget: 'All' });
  const [results, setResults] = useState<any[]>([]);

  async function submit() {
    // Call the API to score (can also run locally for mock)
    const r = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inputs) });
    const data = r.ok ? await r.json() : recommend(inputs);
    setResults(data);
    track({ type: 'vibe_submitted', profile: inputs as any });
  }

  return (
    <section aria-labelledby="vibe" className="mx-auto max-w-7xl px-6 py-12">
      <h2 id="vibe" className="text-2xl font-bold text-text">Find your vibe</h2>
      <p className="text-text/70 text-sm">Answer a few quick questions — we’ll match the perfect setup.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text/80 mb-1">What do you smoke?</label>
            <div className="flex flex-wrap gap-2">
              {(['Flower','Resin','Rosin','Hash'] as const).map(v => (
                <button key={v} onClick={() => setInputs(i=>({ ...i, what:v }))} className={`px-3 py-2 rounded-lg border ${inputs.what===v? 'bg-accent text-black border-accent':'border-white/20'}`}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text/80 mb-1">Where do you smoke?</label>
            <div className="flex flex-wrap gap-2">
              {(['Home','On-the-Go','Party'] as const).map(v => (
                <button key={v} onClick={() => setInputs(i=>({ ...i, where:v }))} className={`px-3 py-2 rounded-lg border ${inputs.where===v? 'bg-accent text-black border-accent':'border-white/20'}`}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm text-text/80 mb-1">Flavor vs Clouds</label>
            <input type="range" min={0} max={100} value={inputs.flavorClouds} onChange={(e)=>setInputs(i=>({ ...i, flavorClouds: Number(e.target.value) }))} className="w-full" />
            <div className="text-xs text-text/60">{inputs.flavorClouds < 50 ? 'Flavor forward' : inputs.flavorClouds > 50 ? 'Clouds for days' : 'Balanced'}</div>
          </div>
          {(inputs.what==='Resin'||inputs.what==='Rosin') && (
            <div>
              <label className="block text-sm text-text/80 mb-1">Heat preference</label>
              <div className="flex flex-wrap gap-2">
                {(['Torch','E-Nail','Battery'] as const).map(v => (
                  <button key={v} onClick={() => setInputs(i=>({ ...i, heat:v }))} className={`px-3 py-2 rounded-lg border ${inputs.heat===v? 'bg-accent text-black border-accent':'border-white/20'}`}>{v}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm text-text/80 mb-1">Budget</label>
            <div className="flex flex-wrap gap-2">
              {(['Budget','Mid','Premium','All'] as const).map(v => (
                <button key={v} onClick={() => setInputs(i=>({ ...i, budget:v }))} className={`px-3 py-2 rounded-lg border ${inputs.budget===v? 'bg-accent text-black border-accent':'border-white/20'}`}>{v}</button>
              ))}
            </div>
          </div>
          <button onClick={submit} className="mt-2 rounded-lg bg-accent text-black px-4 py-2 font-semibold">Show my matches</button>
        </div>

        <div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-white/10 p-6 text-text/70">Your picks will appear here.</div>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-4">
              {results.map((r) => (
                <li key={r.id} className="rounded-2xl border border-white/10 p-3 bg-glass">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt="" className="h-36 w-full object-cover rounded-lg" />
                  <div className="mt-2 font-semibold text-text">{r.name}</div>
                  <div className="text-sm text-text/80">${r.price.toFixed(2)} {r.vipPrice && (<span className="ml-1 rounded bg-black/60 px-2 py-0.5 text-[10px]">VIP ${r.vipPrice.toFixed(2)}</span>)}</div>
                  <p className="mt-1 text-xs text-text/70">{r.why}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 rounded bg-accent text-black py-1.5 text-sm">Add to Cart</button>
                    <a href={`/product/${r.id}`} className="flex-1 rounded border border-white/20 py-1.5 text-center text-sm hover:bg-white/10">Learn More</a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

