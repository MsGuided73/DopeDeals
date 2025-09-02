"use client";
import { useState } from 'react';

export default function ClubSection({ id, name = 'Dope City Circle', bullets = ['Insider drops', 'Members-only bundles', 'Guides to dial your setup'], onSubmit }: { id?: string; name?: string; bullets?: string[]; onSubmit?: (email:string)=>void }) {
  const [email, setEmail] = useState('');
  return (
    <section id={id} className="bg-surface-light text-black">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl md:text-4xl font-black">Join the {name}</h2>
          <ul className="mt-4 space-y-2 text-black/80">
            {bullets.map((b) => (<li key={b}>• {b}</li>))}
          </ul>
          <form className="mt-6 flex gap-3" onSubmit={(e)=>{e.preventDefault(); onSubmit?.(email);}}>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email address" className="flex-1 rounded-xl border px-4 py-2" />
            <button className="btn-primary" type="submit">Join</button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {["Members pricing","Early access","Priority support","Setup guides"].map((p)=> (
            <div key={p} className="rounded-2xl bg-white p-4 shadow-lift">
              <div className="font-semibold">{p}</div>
              <div className="text-sm text-black/70">Exclusive perk</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

