"use client";
import { useState } from 'react';

type Answers = { hit:string; place:string; heat:string };

export default function ExperienceSpectrum({ onRecommend, onResults }: { onRecommend?: (answers:Answers)=>Promise<any>; onResults?: (data:any)=>void }) {
  const [answers, setAnswers] = useState<Answers>({ hit: 'Balanced', place: 'Home', heat: 'Torch' });
  const [data, setData] = useState<any>(null);
  const pos = answers.hit === 'Smooth' ? '20%' : answers.hit === 'Massive' ? '85%' : '50%';

  return (
    <section className="bg-[#F5F5F4]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-bold mb-4">Experience Spectrum</h2>
        {/* Tuner */}
        <div>
          <div className="flex justify-between text-sm text-black/70"><span>Flavor</span><span>Balance</span><span>Clouds</span></div>
          <div className="relative mt-2 h-2 rounded bg-black/10">
            <div className="absolute -top-1 h-4 w-4 rounded-full bg-brand-accent transition-left" style={{ left: `calc(${pos})` }} />
          </div>
        </div>
        {/* Controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <label className="text-sm">Preferred hit
            <select className="mt-1 w-full rounded border px-3 py-2" value={answers.hit} onChange={(e)=>setAnswers(a=>({...a, hit:e.target.value}))}>
              <option>Smooth</option>
              <option>Balanced</option>
              <option>Massive</option>
            </select>
          </label>
          <label className="text-sm">Where
            <select className="mt-1 w-full rounded border px-3 py-2" value={answers.place} onChange={(e)=>setAnswers(a=>({...a, place:e.target.value}))}>
              <option>Home</option>
              <option>Travel</option>
              <option>Both</option>
            </select>
          </label>
          <label className="text-sm">Heat
            <select className="mt-1 w-full rounded border px-3 py-2" value={answers.heat} onChange={(e)=>setAnswers(a=>({...a, heat:e.target.value}))}>
              <option>Torch</option>
              <option>E-rig</option>
              <option>Either</option>
            </select>
          </label>
        </div>
        <button className="btn-primary mt-6" onClick={async()=>{
          const res = onRecommend ? await onRecommend(answers) : await fetch('/api/recommend', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(answers) }).then(r=>r.json());
          setData(res); onResults?.(res);
        }}>See My Setup</button>

        {data && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {data.bundles?.map((b:any)=> (
              <div key={b.name} className="rounded-2xl bg-white p-4 shadow-lift">
                <div className="text-lg font-bold">{b.name}</div>
                <div className="mt-2 text-sm text-black/70">Rigs</div>
                <ul className="text-sm list-disc list-inside">
                  {b.rigs?.map((r:any)=> (<li key={r.id}>{r.title} — ${Number(r.price).toFixed(2)}</li>))}
                </ul>
                <div className="mt-2 text-sm text-black/70">Accessories</div>
                <ul className="text-sm list-disc list-inside">
                  {b.accessories?.map((r:any)=> (<li key={r.id}>{r.title} — ${Number(r.price).toFixed(2)}</li>))}
                </ul>
                <button className="btn-outline mt-3">Add Bundle</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

