'use client';
export default function RSVPButton({ rsvp, personName }) {
  if (!rsvp) return null;
  if (rsvp.mode === 'whatsapp') {
    const url = new URL('https://wa.me/' + rsvp.phone.replace(/\D/g, ''));
    url.searchParams.set('text', rsvp.message || `Confirmo asistencia a ${personName}`);
    return (
      <a className="px-4 py-2 rounded-xl bg-black text-white inline-block" href={url.toString()} target="_blank">
        Confirmar por WhatsApp
      </a>
    );
  }
  return (
    <form action={rsvp.formAction} method="POST" className="flex gap-2 flex-wrap">
      <input type="hidden" name="_subject" value={`RSVP ${personName}`} />
      <input name="nombre" required placeholder="Tu nombre" className="border rounded-xl px-3 py-2" />
      <input name="acompañantes" placeholder="# de acompañantes" className="border rounded-xl px-3 py-2" />
      <button className="px-4 py-2 rounded-xl bg-black text-white" type="submit">Enviar RSVP</button>
    </form>
  );
}
