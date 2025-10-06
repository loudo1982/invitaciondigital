'use client';
import { useEffect, useState } from 'react';

export default function Countdown({ dateISO }) {
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const target = new Date(dateISO).getTime();
    const t = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(target - now, 0);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setLeft({ d, h, m, s });
    }, 1000);
    return () => clearInterval(t);
  }, [dateISO]);

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      {[
        { k: 'Días', v: left.d },
        { k: 'Horas', v: left.h },
        { k: 'Min', v: left.m },
        { k: 'Seg', v: left.s },
      ].map((x) => (
        <div key={x.k} className="rounded-xl border p-3">
          <div className="text-3xl font-bold tabular-nums">{x.v}</div>
          <div className="text-xs text-zinc-500">{x.k}</div>
        </div>
      ))}
    </div>
  );
}
