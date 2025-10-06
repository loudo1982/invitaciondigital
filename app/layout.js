import "./../app/globals.css";


export const metadata = {
  title: "Invitación Digital",
  description: "Invitaciones web interactivas para eventos.",
  metadataBase: new URL("https://tu-dominio.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Tipografías elegantes */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-[#faf9f6] text-zinc-800 antialiased">
        {children}
      </body>
    </html>
  );
}
