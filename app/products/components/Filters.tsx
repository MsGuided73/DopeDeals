"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [sort, setSort] = useState(params.get('sort') || 'newest');

  useEffect(() => {
    setQ(params.get('q') || '');
    setSort(params.get('sort') || 'newest');
  }, [params]);

  function apply(next: Record<string, string | undefined>) {
    const url = new URL(window.location.href);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) url.searchParams.delete(k); else url.searchParams.set(k, String(v));
    });
    router.push(url.pathname + '?' + url.searchParams.toString());
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products" className="border px-3 py-2 rounded-md" />
      <button className="px-3 py-2 bg-black text-white rounded-md" onClick={() => apply({ q })}>Search</button>
      <select value={sort} onChange={e => apply({ sort: e.target.value })} className="border px-2 py-2 rounded-md">
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}

