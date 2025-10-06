import Image from 'next/image';
import Section from '@/components/Section';
import Countdown from '@/components/Countdown';
import RSVPButton from '@/components/RSVPButton';
import MapLink from '@/components/MapLink';
import CalendarButton from '@/components/CalendarButton';
import AudioPlayer from '@/components/AudioPlayer';
import ShareButtons from '@/components/ShareButtons';
import { getInvitation } from '@/lib/invitations';
import { Images } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;        // 👈 importante
  const data = getInvitation(slug);
  const title = data?.seo?.title || `Invitación`;
  const description = data?.seo?.description || `Acompáñanos a celebrar.`;
  const ogImage = data?.coverImage || '/imgs/sample-cover.jpg';
  const url = `https://tu-dominio.com/invitacion/${slug}`;
  return {
    title,
    description,
    openGraph: { title, description, url, images: [ogImage] },
    alternates: { canonical: url },
  };
}

export default async function InvitationPage({ params }) {
  const { slug } = await params;        // 👈 importante
  const data = getInvitation(slug);

  if (!data) {
    return (
      <main className="container-p py-16 text-center">
        <h1>Invitación no encontrada</h1>
        <p className="mt-4">Revisa el enlace o crea una nueva.</p>
      </main>
    );
  }

  const eventDate = new Date(data.dateISO);
  const longDate = eventDate.toLocaleDateString('es-MX', { dateStyle: 'full' });

  return (
    <main>
      {/* Portada */}
      <div className="relative h-[70dvh] w-full">
        <Image src={data.coverImage} alt={data.personName} fill priority className="object-cover" />
        <div className="absolute inset-0 overlay-soft" />
        {/* Marco dorado */}
        <div className="absolute inset-8 border border-gold-400/70 rounded-2xl pointer-events-none"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div className="max-w-2xl">
            <span className="pill mx-auto mb-48">Celebración de {data.eventType}</span>
            <h1 className="mt-4 text-5xl md:text-6xl">{data.personName}</h1>
            {data.parents && (
              <p className="mt-2 text-zinc-100/90 italic font-serif">
                Hija de {data.parents}
              </p>
            )}
            <div className="divider" />
            <p className="text-zinc-100">{longDate}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <AudioPlayer src={data.audioUrl} />
              <ShareButtons
                url={`https://tu-dominio.com/invitacion/${slug}`}  // 👈 usa slug, NO params.slug
                title={data.seo?.title || data.personName}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cuenta regresiva */}
      <Section title="Cuenta regresiva">
        <Countdown dateISO={data.dateISO} />
      </Section>

      {/* Detalles */}
      <Section title="Detalles del evento">
        <div className="space-y-3 text-center">
          {data.church?.enabled && (
            <div>
              <h3>Misa</h3>
              <p className="text-zinc-600">{data.church.name} · {data.church.time} h</p>
              <div className="mt-2">
                <MapLink href={data.church.gmaps}>Ver iglesia</MapLink>
              </div>
            </div>
          )}
          <div>
            <h3>Recepción</h3>
            <p className="text-zinc-600">{data.venue.name}</p>
            <p className="text-zinc-600">{data.venue.address}</p>
            <div className="mt-2 flex justify-center gap-2">
              <MapLink href={data.venue.gmaps}>Abrir mapa</MapLink>
              <CalendarButton
                title={`${data.eventType} de ${data.personName}`}
                details={`Acompáñanos en ${data.venue.name}`}
                startISO={data.dateISO}
                location={`${data.venue.name}, ${data.venue.address}`}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Itinerario */}
      {Array.isArray(data.itinerary) && data.itinerary.length > 0 && (
        <Section title="Itinerario">
          <ul className="grid gap-3 md:grid-cols-3">
            {data.itinerary.map((it, i) => (
              <li key={i} className="p-4 rounded-xl border">
                <div className="font-mono text-sm text-zinc-500">{it.time} h</div>
                <div className="font-semibold">{it.title}</div>
                <div className="text-zinc-600">{it.desc}</div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Dress code */}
      {data.dressCode && (
        <Section title={data.dressCode.title}>
          <p className="text-center text-zinc-700">{data.dressCode.text}</p>
          {Array.isArray(data.dressCode.palette) && (
            <div className="mt-4 flex justify-center gap-2">
              {data.dressCode.palette.map((c) => (
                <span key={c} className="inline-block h-6 w-6 rounded-full border" style={{ backgroundColor: c }} />
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Regalos */}
      {data.gifts && (
        <Section title="Regalos">
          <p className="text-center text-zinc-700">{data.gifts.text}</p>
        </Section>
      )}

      {/* RSVP */}
      <Section title="Confirmar asistencia">
        <div className="flex justify-center">
          <RSVPButton rsvp={data.rsvp} personName={data.personName} />
        </div>
      </Section>

      {/* Galería */}
      {Array.isArray(data.gallery) && data.gallery.length > 0 && (
        <Section id="galeria" title="Galería" icon={Images}>
         <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
  {data.gallery?.map((src, i) => (
    <div
      key={i}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-xl ring-1 ring-black/5 transition hover:scale-[1.02]"
    >
      <Image
        src={src}
        alt={`Foto ${i + 1}`}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        priority={i < 2}
      />
    </div>
  ))}
</div>
        </Section>
      )}

      <footer className="container-p pb-20 text-center text-sm text-zinc-500">
        Hecho con 💖 por la familia González Coboj
      </footer>
    </main>
  );
}
