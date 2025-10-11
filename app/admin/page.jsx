'use client';

import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase/firebase-config';
// ⬇️ Si tienes Firebase Auth y quieres proteger por correo:
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ALLOWED_EMAILS = [
  // Agrega aquí correos que pueden entrar al admin (si usas Auth)
  // 'tucorreo@dominio.com',
];

const TEMP_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASS || ''; // opcional

function formatTS(ts) {
  if (!ts?.toDate) return '';
  const d = ts.toDate();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}

function toCSV(rows) {
  const header = [
    'nombre',
    'apellido',
    'attending',
    'companions',
    'slug',
    'eventTitle',
    'createdAt',
  ];
  const lines = [header.join(',')];
  for (const r of rows) {
    const line = [
      (r.nombre ?? '').replaceAll(',', ' '),
      (r.apellido ?? '').replaceAll(',', ' '),
      r.attending ? 'SI' : 'NO',
      String(r.companions ?? 0),
      (r.slug ?? '').replaceAll(',', ' '),
      (r.eventTitle ?? '').replaceAll(',', ' '),
      formatTS(r.createdAt),
    ].join(',');
    lines.push(line);
  }
  return lines.join('\n');
}

export default function AdminPage() {
  // -------- Protección muy simple --------
  const [authOk, setAuthOk] = useState(ALLOWED_EMAILS.length === 0 && !TEMP_ADMIN_PASSWORD ? true : false);
  const [passInput, setPassInput] = useState('');

  useEffect(() => {
    // Si hay correos permitidos, intenta validar por Firebase Auth
    if (ALLOWED_EMAILS.length > 0) {
      try {
        const auth = getAuth();
        const unsub = onAuthStateChanged(auth, (user) => {
          if (user?.email && ALLOWED_EMAILS.includes(user.email)) {
            setAuthOk(true);
          } else {
            setAuthOk(false);
          }
        });
        return () => unsub();
      } catch {
        // Si no hay Auth configurado, usar password temporal
      }
    }
  }, []);

  // Si no hay auth por correo, permite password temporal
  const tryPassword = (e) => {
    e.preventDefault();
    if (!TEMP_ADMIN_PASSWORD) return;
    if (passInput === TEMP_ADMIN_PASSWORD) setAuthOk(true);
    else alert('Contraseña incorrecta');
  };

  // -------- Estados y filtros --------
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [slug, setSlug] = useState('');               // filtra por slug
  const [assist, setAssist] = useState('todos');      // 'todos' | 'si' | 'no'
  const [qText, setQText] = useState('');             // búsqueda por nombre/apellido (cliente)

  // -------- Suscripción Firestore --------
  useEffect(() => {
    setLoading(true);

    // Base: rsvps ordenado por createdAt desc
    let qRef = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));

    // Si deseas filtrar por slug al nivel de Firestore (más eficiente):
    // Hacemos where slug == ... (si está definido)
    if (slug.trim()) {
      qRef = query(
        collection(db, 'rsvps'),
        where('slug', '==', slug.trim()),
        orderBy('createdAt', 'desc')
      );
      // Nota: esta combinación puede requerir un índice compuesto en Firestore.
      // Firebase Console te sugerirá el índice al primer intento.
    }

    const unsub = onSnapshot(
      qRef,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setRows(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [slug]);

  // -------- Filtros en cliente --------
  const filtered = useMemo(() => {
    let out = [...rows];

    if (assist !== 'todos') {
      const want = assist === 'si';
      out = out.filter((r) => !!r.attending === want);
    }

    if (qText.trim()) {
      const t = qText.trim().toLowerCase();
      out = out.filter((r) => {
        const a = (r.apellido ?? '').toLowerCase();
        const n = (r.nombre ?? '').toLowerCase();
        return a.includes(t) || n.includes(t);
      });
    }

    return out;
  }, [rows, assist, qText]);

  // -------- Stats --------
  const stats = useMemo(() => {
    const total = filtered.length;
    const si = filtered.filter((r) => !!r.attending).length;
    const no = filtered.filter((r) => r.attending === false).length;
    const companions = filtered.reduce((acc, r) => acc + (r.companions ?? 0), 0);
    return { total, si, no, companions };
  }, [filtered]);

  // -------- Export CSV --------
  const exportCSV = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rsvps_${slug || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authOk) {
    return (
      <main className="container-p max-w-xl mx-auto py-10">
        <h1 className="text-2xl font-semibold mb-4">Admin</h1>
        {ALLOWED_EMAILS.length > 0 ? (
          <p className="text-zinc-700">
            Inicia sesión con un correo autorizado para acceder.
          </p>
        ) : TEMP_ADMIN_PASSWORD ? (
          <form onSubmit={tryPassword} className="space-y-3">
            <label className="block text-sm text-zinc-700">Contraseña de admin</label>
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
              placeholder="••••••••"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-black text-white hover:bg-zinc-800"
            >
              Entrar
            </button>
            <p className="text-xs text-zinc-500">
              Define <code>NEXT_PUBLIC_ADMIN_PASS</code> en tu entorno.
            </p>
          </form>
        ) : (
          <p className="text-zinc-700">
            Configura correos permitidos o <code>NEXT_PUBLIC_ADMIN_PASS</code> para proteger /admin.
          </p>
        )}
      </main>
    );
  }

  return (
    <main className="container-p max-w-6xl mx-auto py-8">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold">Panel de invitados</h1>
        <p className="text-zinc-600">Revisar y exportar confirmaciones</p>
      </header>

      {/* Filtros */}
      <section className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-zinc-700 mb-1">Buscar (nombre o apellido)</label>
          <input
            value={qText}
            onChange={(e) => setQText(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
            placeholder="Ej. Juan / López"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-700 mb-1">Slug del evento</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-400"
            placeholder="Ej. quince-nicole"
          />
          <p className="text-xs text-zinc-500 mt-1">Vacío = todos los eventos.</p>
        </div>

        <div>
          <label className="block text-sm text-zinc-700 mb-1">Asistencia</label>
          <select
            value={assist}
            onChange={(e) => setAssist(e.target.value)}
            className="w-full rounded-md border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-zinc-400"
          >
            <option value="todos">Todos</option>
            <option value="si">Asistirán</option>
            <option value="no">No asistirán</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={exportCSV}
            className="w-full px-4 py-2 rounded-md border shadow-sm hover:shadow-md"
          >
            Exportar CSV
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs text-zinc-500">Total</div>
          <div className="text-xl font-semibold">{stats.total}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs text-zinc-500">Asisten (Sí)</div>
          <div className="text-xl font-semibold text-emerald-600">{stats.si}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs text-zinc-500">No asisten</div>
          <div className="text-xl font-semibold text-rose-600">{stats.no}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs text-zinc-500">Acompañantes</div>
          <div className="text-xl font-semibold">{stats.companions}</div>
        </div>
      </section>

      {/* Tabla */}
      <section className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Apellido</th>
              <th className="px-3 py-2 text-left">Asiste</th>
              <th className="px-3 py-2 text-left">Acomp.</th>
              <th className="px-3 py-2 text-left">Slug</th>
              <th className="px-3 py-2 text-left">Evento</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-6 text-center" colSpan={7}>
                  <span className="inline-block h-5 w-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-zinc-500" colSpan={7}>
                  Sin resultados.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{formatTS(r.createdAt)}</td>
                  <td className="px-3 py-2">{r.nombre}</td>
                  <td className="px-3 py-2">{r.apellido}</td>
                  <td className="px-3 py-2">{r.attending ? 'Sí' : 'No'}</td>
                  <td className="px-3 py-2">{r.companions ?? 0}</td>
                  <td className="px-3 py-2">{r.slug ?? ''}</td>
                  <td className="px-3 py-2">{r.eventTitle ?? ''}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="mt-6 text-xs text-zinc-500">
        Vista en tiempo real — ordenado por creación descendente.
      </footer>
    </main>
  );
}
