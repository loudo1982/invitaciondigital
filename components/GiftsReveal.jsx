'use client';

import { useState } from 'react';

export default function GiftsReveal({ gifts }) {
  const [open, setOpen] = useState(false);

  if (!gifts) return null;

  const {
    text = "Si deseas hacernos un regalo, puedes consultar la información bancaria.",
    buttonText = "Datos bancarios",
    titular,
    banco,
    clabe,
    referencia,
  } = gifts;

  const copiar = async () => {
    try {
      const txt = [
        titular && `Titular: ${titular}`,
        banco && `Banco: ${banco}`,
        clabe && `CLABE: ${clabe}`,
        referencia && `Referencia: ${referencia}`,
      ]
        .filter(Boolean)
        .join('\n');
      await navigator.clipboard.writeText(txt);
      alert('Datos copiados al portapapeles');
    } catch {
      alert('No se pudo copiar automáticamente. Selecciona y copia manualmente.');
    }
  };

  return (
  <div
    className="relative max-w-xl mx-auto rounded-2xl overflow-hidden shadow-md p-10 text-center text-zinc-800"
    style={{
      backgroundImage: `url('/imgs/sobre.png')`, // o tu nueva imagen generada
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'transparent',
    }}
  >


    <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
      {/* Texto primero */}
      <p className="text-center text-zinc-700 max-w-md">{text}</p>

      {/* Espacio para dejar visible el sobre */}
      <div className="h-24" /> {/* puedes ajustar altura: 24 = 6rem */}

      {/* Botones más abajo */}
      <div className="flex flex-col items-center gap-3 justify-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="px-4 py-1 rounded-md shadow-sm border hover:shadow-md transition text-sm bg-white/60 mb-6"
        >
          {open ? 'Ocultar información bancaria' : buttonText}
        </button>

        {open && (
          <button
            type="button"
            onClick={copiar}
            className="px-3 py-2 rounded-md border bg-white/80 hover:bg-white transition text-sm"
          >
            Copiar datos
          </button>
        )}
      </div>

      {/* Datos revelados */}
      <div
        className={`mt-4 p-4 rounded-md border transition-all duration-300 overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!open}
      >
        {open && (
          <div className="text-sm text-zinc-800 space-y-1 bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            {titular && <div><strong>Titular:</strong> {titular}</div>}
            {banco && <div><strong>Banco:</strong> {banco}</div>}
            {clabe && (
              <div>
                <strong>CLABE:</strong>{' '}
                <code className="bg-zinc-100 px-2 py-0.5 rounded">{clabe}</code>
              </div>
            )}
            {referencia && <div><strong>Referencia:</strong> {referencia}</div>}
            <p className="text-xs text-zinc-600 mt-2 italic">
              Cuenta CLABE: 012 180 01521459197 8 — BBVA <br />
              A nombre de <strong>Paulina Libertad Coboj Acosta</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

    
}
