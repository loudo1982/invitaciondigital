'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase-config';

export default function RSVPForm({ slug, eventTitle }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [asistencia, setAsistencia] = useState('si'); // 'si' | 'no'
  const [acompanantes, setAcompanantes] = useState(0); // 0–10
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDone(false);

    if (!nombre.trim() || !apellido.trim()) {
      setError('Por favor, completa nombre y apellido.');
      return;
    }
    if (acompanantes < 0 || acompanantes > 10) {
      setError('El número de acompañantes debe ser entre 0 y 10.');
      return;
    }

    try {
      setSending(true);
      await addDoc(collection(db, 'rsvps'), {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        attending: asistencia === 'si',  // boolean
        companions: Number(acompanantes),
        slug: slug || null,
        eventTitle: eventTitle || null,
        createdAt: serverTimestamp(),
      });
      setDone(true);
      setNombre('');
      setApellido('');
      setAsistencia('si');
      setAcompanantes(0);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar tu confirmación. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
  className="relative max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-lg p-6 md:p-10 min-h-[420px] flex items-center justify-center"
  style={{
    backgroundImage: "url('/imgs/7.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  

      <form onSubmit={onSubmit} className="relative z-10">
       
        <p className="text-center text-zinc-700 mb-6">
          {eventTitle ? ` ${eventTitle}` : '¡Gracias por acompañarnos!'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="text-left">
            <label className="block text-sm text-zinc-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400 bg-white"
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm text-zinc-700 mb-1">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400 bg-white"
              placeholder="Tu apellido"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-sm text-zinc-700 mb-1">Asistencia</label>
            <select
              value={asistencia}
              onChange={(e) => setAsistencia(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-zinc-400"
            >
              <option value="si">Asistiré</option>
              <option value="no">No podré asistir</option>
            </select>
          </div>

          <div className="text-left">
            <label className="block text-sm text-zinc-700 mb-1">Acompañantes</label>
            <input
              type="number"
              min={0}
              max={10}
              value={acompanantes}
              onChange={(e) => setAcompanantes(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400 bg-white"
              placeholder="0"
            />
            <p className="text-xs text-zinc-500 mt-1">Ingresa 0 si vas solo/a.</p>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-600 mt-3">{error}</p>
        )}

        <div className="mt-6 flex items-center justify-center">
          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-black text-white hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {sending && (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {sending ? 'Enviando...' : 'Confirmar'}
          </button>
        </div>

        {done && (
          <div className="mt-4 text-center text-green-700 text-sm">
            ¡Gracias! Tu respuesta ha sido registrada.
          </div>
        )}
      </form>
    </div>
  );
}
