import Image from 'next/image';

interface PolaroidProps {
  src: string;
  alt: string;
  subtitle?: string;
}

export default function Polaroid({ src, alt, subtitle }: PolaroidProps) {
  return (
    <div className="inline-block bg-white p-4 pb-12 shadow-xl border border-gray-100 rounded-sm transform hover:scale-105 hover:rotate-0 transition-all duration-300 -rotate-2 max-w-[280px]">
      {/* Container da Imagem */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 border border-gray-200">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
      
      {/* Espaço em branco inferior com legenda (opcional) */}
      {subtitle && (
        <p className="mt-4 text-center font-serif text-gray-700 text-lg tracking-wide select-none">
          {subtitle}
        </p>
      )}
    </div>
  );
}