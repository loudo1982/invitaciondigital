export const invitations = {
  "nicole-renata": {
    personName: "Nicole Renata",
    parents: "David González Cázares y Paulina Coboj Acosta",
    eventType: "XV Años",
    // Usamos la recepción como hora principal del evento para el contador y el .ics
    // Zona horaria Hermosillo (GMT-7 fijo en invierno para 22 nov 2025)
    dateISO: "2025-11-22T21:00:00-07:00", // 22 nov 2025, 9:00 pm
    coverImage: "/imgs/11.jpg",
    audioUrl: "", // opcional, deja vacío si no usarás música
    venue: {
      name: "Villa Toscana, Salón Imperial",
      address: "Hermosillo, Sonora",
      gmaps: "https://maps.google.com/?q=Villa+Toscana+Salon+Imperial+Hermosillo",
    },
    church: {
      enabled: true,
      name: "Iglesia Villa Toscana",
      time: "13:00",
      gmaps: "https://maps.google.com/?q=Iglesia+Villa+Toscana+Hermosillo",
    },
    itinerary: [
      { time: "13:00", title: "Misa", desc: "Iglesia Villa Toscana" },
      { time: "21:00", title: "Recepción", desc: "Villa Toscana, Salón Imperial" },
      { time: "23:00", title: "Vals y brindis", desc: "Salón principal" },
    ],
    dressCode: {
      title: "Código de vestimenta",
      text: "Formal. Hombres traje oscuro, mujeres vestido de cocktail/elegante.",
      palette: ["#c0a062", "#f1e9d2", "#1f1f1f"],
    },
    gifts: {
      text: "Tu presencia es el mejor regalo. Si deseas obsequiar, sugerimos regalo en sobre o transferir a la cuenta 012180015214591978 BBVA a nombre de Paulina Libertad Coboj Acosta .",
    },
    rsvp: {
      mode: "whatsapp",
      phone: "+526624765094", // <-- pon aquí el número real
      message: "Hola, confirmo mi asistencia a los XV de Nicole Renata.",
      formAction: "https://formsubmit.co/tu-correo",
    },
    gallery: [
  "/imgs/2.jpg",
  
  "/imgs/5.jpg",
  "/imgs/6.jpg",
  "/imgs/7.jpg",
 
  "/imgs/9.jpg",

],
    seo: {
      title: "XV Años de Nicole Renata | Invitación",
      description: "Acompáñanos a celebrar los XV de Nicole Renata. Confirma tu asistencia y guarda la fecha.",
    },
  },
};

export function getInvitation(slug) {
  return invitations[slug] ?? null;
}
