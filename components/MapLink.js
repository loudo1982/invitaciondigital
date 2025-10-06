export default function MapLink({ href, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" className="px-4 py-2 rounded-xl border inline-block">
      {children || 'Abrir ubicación'}
    </a>
  );
}
