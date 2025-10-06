import Link from "next/link";

export default function Home() {
  return (
    <main className="container-p py-16 text-center">
      <h1>Invitaciones digitales modernas</h1>
      <p className="mt-4 text-zinc-600">
        Crea y comparte una invitación web interactiva. Reutilizable con la ruta
        <span className="font-mono"> /invitacion/[slug]</span>.
      </p>
      <div className="mt-8 inline-flex gap-3">
        <Link className="px-5 py-3 rounded-xl bg-black text-white" href="/invitacion/nicole-renata">
          Ver demo (Nicole Renata)
        </Link>
        <Link className="px-5 py-3 rounded-xl border" href="/invitacion/tu-nombre">
          Crear la tuya
        </Link>
      </div>
    </main>
  );
}
