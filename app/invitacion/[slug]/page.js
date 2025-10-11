import Image from "next/image";
import Section from "@/components/Section";
import Countdown from "@/components/Countdown";
import RSVPButton from "@/components/RSVPButton";
import MapLink from "@/components/MapLink";
import CalendarButton from "@/components/CalendarButton";
import AudioPlayer from "@/components/AudioPlayer";
import { getInvitation } from "@/lib/invitations";
// ⬇️ nuevo:
import GiftsReveal from "@/components/GiftsReveal";
import RSVPForm from "@/components/RSVPForm";

// ✅ NO usar 'await' con params aquí
export async function generateMetadata({ params }) {
  const { slug } = params;
  const data = getInvitation(slug);
  const title = data?.seo?.title || "Invitación";
  const description = data?.seo?.description || "Acompáñanos a celebrar.";
  const ogImage = data?.coverImage || "/imgs/sample-cover.jpg";
  const url = `https://tu-dominio.com/invitacion/${slug}`;
  return {
    title,
    description,
    openGraph: { title, description, url, images: [ogImage] },
    alternates: { canonical: url },
  };
}

export default function InvitationPage({ params }) {
  const { slug } = params;
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
  const fechaVisible = "Sábado 22 de noviembre 2025";

  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  const fondo1 = gallery[0]?.src || data.coverImage || "/imgs/sample-cover.jpg";
  const fondo2 = gallery[1]?.src || data.coverImage || "/imgs/sample-cover.jpg";
  const fondo3 = gallery[2]?.src || data.coverImage || "/imgs/sample-cover.jpg";

  return (
    <main>
      {/* Portada */}
      <div className="relative h-[70dvh] w-full">
        <Image
          src={data.coverImage}
          alt={data.personName}
          fill
          priority
          className="object-cover object-[center_35%] md:object-[center_25%]"
        />
        <div className="absolute inset-0 overlay-soft" />
        <div className="absolute inset-8 border border-gold-400/70 rounded-2xl pointer-events-none"></div>

        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-6">
          <div className="max-w-2xl">
            <h1
              className="text-6xl md:text-7xl font-normal tracking-tight"
              style={{ fontFamily: "FontInvitacion" }}
            >
              {data.personName}
            </h1>
            <p className="mt-3 text-xl font-light italic">{data.eventType}</p>

            {data.parents && (
              <p className="mt-2 text-zinc-100/90 italic font-serif">
                Hija de {data.parents}
              </p>
            )}

            <div className="divider" />
            <p className="text-zinc-100">{fechaVisible}</p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <AudioPlayer src={data.audioUrl} />
            </div>
          </div>
        </div>
      </div>

      {/* Cuenta regresiva con flores arriba */}
      <Section id="countdown" title="Cuenta regresiva">
        <div className="flex justify-center mb-6">
          <Image
            src="/imgs/flores.png"
            alt="Flores decorativas"
            width={320}
            height={120}
            className="h-auto w-56 md:w-72 opacity-95"
          />
        </div>

        {!isNaN(eventDate) && <Countdown dateISO={data.dateISO} />}
      </Section>

  {/* Sección "Momentos" con UNA foto de fondo general */}
<Section title="Momentos">
  <div
    className="relative rounded-2xl overflow-hidden p-10 md:p-16 text-center text-white shadow-lg"
    style={{
      backgroundImage: `url('/imgs/6.jpg')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Capa oscura con opacidad para mejorar contraste */}
    <div className="absolute inset-0 bg-black/30" />

    {/* Contenido centrado */}
    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
      <h3 className="text-2xl md:text-4xl font-semibold text-white">Ceremonia</h3>
      {data.church?.enabled ? (
        <p className="text-lg opacity-90">
          {data.church.name} · {data.church.time} h
        </p>
      ) : (
        <p className="text-lg opacity-90">Detalles por confirmar</p>
      )}

      <div className="border-t border-white/30 my-6 w-2/3 mx-auto" />

      <h3 className="text-2xl md:text-4xl font-semibold text-white">Recepción</h3>
      <p className="text-lg opacity-90">{data.venue?.name}</p>
      <p className="text-lg opacity-90">{data.venue?.address}</p>

      <div className="border-t border-white/30 my-6 w-2/3 mx-auto" />

      <h3 className="text-2xl md:text-3xl font-semibold text-white">Fiesta</h3>
       <p className="text-lg opacity-90">{data.venue?.name}</p>
     
    </div>
  </div>
</Section>


      {/* Detalles */}
<Section title="Detalles del evento">
  <div
    className="relative rounded-2xl overflow-hidden py-10 px-6 md:px-12 text-center bg-white shadow-md"
    style={{
      backgroundImage: `url('/imgs/borde.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >


    {/* Contenido visible */}
    <div className="relative z-10 space-y-8">
      {data.church?.enabled && (
        <div>
          <h3 className="text-2xl font-semibold text-zinc-800">Misa</h3>
          <p className="text-zinc-700 mt-1">
            {data.church.name} · {data.church.time} h
          </p>
          <div className="mt-3">
            <MapLink href={data.church.gmaps}>Ver iglesia</MapLink>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold text-zinc-800">Recepción</h3>
        <p className="text-zinc-700 mt-1">{data.venue.name}</p>
        <p className="text-zinc-700">{data.venue.address}</p>
        <div className="mt-3 flex justify-center gap-2">
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
  </div>
</Section>


   {/* Itinerario */}
      {/*   {Array.isArray(data.itinerary) && data.itinerary.length > 0 && (
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
      )} */}

      {/* Dress code */}
      {data.dressCode && (
        <Section title={data.dressCode.title}>
          <p className="text-center text-zinc-700">{data.dressCode.text}</p>
          {Array.isArray(data.dressCode.palette) && (
            <div className="mt-4 flex justify-center gap-2">
              {data.dressCode.palette.map((c) => (
                <span
                  key={c}
                  className="inline-block h-6 w-6 rounded-full border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Regalos (interactivo en Client Component) */}
      {data.gifts && (
        <Section title="Regalos">
          <GiftsReveal gifts={data.gifts} />
        </Section>
      )}

      {/* RSVP */}
      {/* Confirmar asistencia (nuevo formulario con Firestore) */}
      <Section title="Confirmar asistencia">
        <RSVPForm
          slug={slug}
          eventTitle={`${data.eventType} de ${data.personName}`}
        />
      </Section>

      {/* Galería removida */}
      {/* <GaleriaConZoom gallery={data.gallery} /> */}

      <footer className="container-p pb-20 text-center text-sm text-zinc-500">
        Hecho por{" "}
        <span className="font-medium">viricrearte</span> →
        <a
          href="https://wa.me/526622900500?text=¡Hola!%20Vengo%20de%20tu%20invitación%20digital%20😊"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 font-semibold underline ml-1"
        >
          WhatsApp
        </a>
      </footer>
    </main>
  );
}
