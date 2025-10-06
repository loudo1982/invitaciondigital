'use client';
export default function ShareButtons({ url, title }) {
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Enlace copiado');
    }
  };
  return (
    <button onClick={share} className="px-4 py-2 rounded-xl border">Compartir</button>
  );
}
