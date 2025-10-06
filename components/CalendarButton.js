'use client';
export default function CalendarButton({ title, details, startISO, durationMinutes = 300, location }) {
  const handleClick = () => {
    const start = new Date(startISO);
    const end = new Date(start.getTime() + durationMinutes * 60000);
    const dt = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Invitacion Digital//ES',
      'BEGIN:VEVENT',
      `DTSTART:${dt(start)}`,
      `DTEND:${dt(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details}`,
      location ? `LOCATION:${location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'evento.ics'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
  <button
  onClick={handleClick}
  className="px-5 py-2 rounded-full border border-gold-400/80 bg-white hover:bg-gold-300/20 transition"
>
  Agregar al calendario
</button>

  );
}
