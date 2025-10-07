'use client';

import { useState } from "react";
import Image from "next/image";
import Section from "@/components/Section";

export default function GaleriaConZoom({ gallery }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!Array.isArray(gallery) || gallery.length === 0) return null;

  return (
    <Section title="Galería">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {gallery.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-xl cursor-pointer hover:scale-[1.03] transition-transform"
            onClick={() => setSelectedImage(src)}
          >
            <Image src={src} alt={`Foto ${i + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Modal / Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-[90%]">
            <Image
              src={selectedImage}
              alt="Imagen ampliada"
              width={1200}
              height={800}
              className="w-full h-auto rounded-xl shadow-lg"
            />
            <button
              className="absolute top-3 right-3 bg-black/60 text-white rounded-full px-3 py-1 text-sm"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </Section>
  );
}
