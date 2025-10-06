'use client';
import { useRef, useState } from 'react';

export default function AudioPlayer({ src }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);
  if (!src) return null;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => {
          if (!ref.current) return;
          if (playing) { ref.current.pause(); setPlaying(false); }
          else { ref.current.play(); setPlaying(true); }
        }}
        className="px-3 py-1 rounded-lg border"
      >{playing ? 'Pausar música' : 'Reproducir música'}</button>
      <audio ref={ref} src={src} preload="none" />
    </div>
  );
}
