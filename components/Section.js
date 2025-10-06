export default function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="container-p my-12">
      {title && (
        <div className="text-center mb-5">
          <h2 className="inline-flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" aria-hidden />}
            {title}
          </h2>
          <div className="mx-auto mt-3 w-28 h-[2px] bg-gold-400/70 rounded-full" />
        </div>
      )}
      <div className="card p-6">{children}</div>
    </section>
  );
}
