import { prisma } from '../../../lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import type { FotosModel, MemoriasModel, cartaModel } from '../../../generated/prisma/models';
import { Heart, CalendarDays, Quote, CalendarHeart } from 'lucide-react';

export default async function FavoritosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || 'fotos';

  // Busca os favoritos de cada tabela em paralelo
  const [fotosFavoritas, memoriasFavoritas, cartasFavoritas] = await Promise.all([
    prisma.fotos.findMany({ where: { favorito: true }, orderBy: { createdAt: 'desc' } }),
    prisma.memorias.findMany({ where: { favorito: true }, orderBy: { createdAt: 'desc' } }),
    prisma.carta.findMany({ where: { favorito: true }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-amber-50 px-4 sm:px-8 py-10 text-slate-800 relative selection:bg-rose-200">
      
      {/* Luzes de Fundo */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 mb-6 flex items-center gap-3">
          Meus Favoritos ❤️
        </h1>

        {/* Cabeçalho com os botões de navegação */}
        <div className="flex gap-3 border-b border-rose-100/80 pb-4 mb-10 flex-wrap">
          <Link
            href="?tab=fotos"
            className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'fotos'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            📸 Fotos ({fotosFavoritas.length})
          </Link>
          <Link
            href="?tab=memorias"
            className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'memorias'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            🧠 Memórias ({memoriasFavoritas.length})
          </Link>
          <Link
            href="?tab=cartas"
            className={`px-5 py-2.5 rounded-full font-medium transition-all text-sm ${
              activeTab === 'cartas'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20'
                : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            ✉️ Cartas ({cartasFavoritas.length})
          </Link>
        </div>

        {/* Seção de Fotos - Estilo Polaroid Aprimorado */}
        {activeTab === 'fotos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 justify-items-center">
            {fotosFavoritas.length === 0 ? (
              <p className="text-zinc-500 col-span-full text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100 shadow-sm w-full max-w-lg mx-auto p-8 font-serif">
                Nenhuma foto favorita encontrada. 💕
              </p>
            ) : (
              fotosFavoritas.map((foto: FotosModel, index: number) => {
                const rotacaoClasse = index % 3 === 0 
                  ? "-rotate-2" 
                  : index % 3 === 1 
                    ? "rotate-2" 
                    : "-rotate-1";

                return (
                  <div
                    key={foto.id}
                    className={`bg-white p-3.5 pb-8 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.1)] hover:shadow-[0_20px_35px_-5px_rgba(244,63,94,0.2)] border border-rose-100/60 max-w-[290px] w-full transition-all duration-300 hover:-translate-y-2 hover:rotate-0 ${rotacaoClasse} group relative rounded-sm`}
                  >
                    {/* Fita Adesiva / Washi Tape decorativo */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/80 backdrop-blur-sm border border-amber-200/50 rotate-1 z-10 shadow-sm opacity-90" />

                    <div className="relative aspect-square w-full bg-slate-100 overflow-hidden rounded-sm mb-3.5 border border-slate-100">
                      <Image
                        src={foto.imageUrl}
                        alt={foto.titulo || 'Foto favorita'}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={index < 3}
                      />

                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md z-20">
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                      </div>
                    </div>

                    <div className="text-center px-1">
                      <h3 className="font-serif font-bold text-slate-800 text-base leading-snug tracking-tight line-clamp-1">
                        {foto.titulo || 'Sem título'}
                      </h3>
                      
                      {foto.datafoto && (
                        <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5 mt-1.5">
                          <CalendarHeart className="w-3.5 h-3.5 text-rose-400" />
                          {new Date(foto.datafoto).toLocaleDateString('pt-BR')}
                        </p>
                      )}

                      <p className="font-serif text-xs text-rose-600/90 italic mt-2.5 line-clamp-2 px-1 border-t border-dashed border-rose-100 pt-2.5">
                        &quot;{foto.descricao}&quot;
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Seção de Memórias (Estilizada exatamente igual ao mural) */}
        {activeTab === 'memorias' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {memoriasFavoritas.length === 0 ? (
              <p className="text-zinc-500 col-span-full text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100 shadow-sm font-serif">
                Nenhuma memória favorita encontrada. 💕
              </p>
            ) : (
              memoriasFavoritas.map((memoria: MemoriasModel, index: number) => {
                const rotateClass = index % 3 === 0 ? "-rotate-2" : index % 2 === 0 ? "rotate-2" : "-rotate-1";

                return (
                  <div 
                    key={memoria.id} 
                    className={`bg-white/90 backdrop-blur-sm p-6 pb-5 shadow-md hover:shadow-2xl rounded-2xl border border-rose-400 ring-2 ring-rose-200/60 ${rotateClass} hover:rotate-0 hover:scale-105 transition-all duration-300 relative group flex flex-col justify-between overflow-hidden`}
                  >
                    {/* Fita Adesiva / Washi Tape decorativo */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/50 backdrop-blur-xs border border-pink-300/30 rotate-1 shadow-xs z-10 pointer-events-none" />

                    <div className="pt-2">
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="font-serif font-bold text-xl text-rose-950 leading-snug group-hover:text-pink-600 transition-colors">
                          {memoria.titulo}
                        </h3>
                        
                        <div className="p-1.5 -mr-1.5 rounded-full bg-pink-100/60 shrink-0">
                          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-xs" />
                        </div>
                      </div>

                      <div className="relative bg-pink-50/40 p-3.5 rounded-xl border border-pink-100/50 my-2">
                        <Quote className="absolute top-2 left-2 w-4 h-4 text-pink-300/40 rotate-180 pointer-events-none" />
                        <p className="text-sm text-rose-900/80 font-serif leading-relaxed whitespace-pre-line italic px-2">
                          &quot;{memoria.descricao}&quot;
                        </p>
                        <Quote className="absolute bottom-2 right-2 w-4 h-4 text-pink-300/40 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-5 pt-3 border-t border-pink-100 text-[11px] text-pink-600/80 font-mono">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-pink-400" /> 
                        {new Date(memoria.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-rose-500 font-semibold">
                        Memória Favorita ❤️
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Seção de Cartas */}
        {activeTab === 'cartas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cartasFavoritas.length === 0 ? (
              <p className="text-zinc-500 col-span-full text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100 shadow-sm font-serif">
                Nenhuma carta favorita encontrada. 💕
              </p>
            ) : (
              cartasFavoritas.map((cartaItem: cartaModel) => (
                <div key={cartaItem.id} className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex flex-col transition-all hover:shadow-md">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg text-zinc-800">{cartaItem.titulo}</h3>
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500 shrink-0" />
                  </div>
                  <div className="text-xs text-rose-500 font-medium mb-3">
                    De: {cartaItem.remetente} &rarr; Para: {cartaItem.destinatario}
                  </div>
                  <p className="text-zinc-600 text-sm whitespace-pre-line bg-zinc-50 p-4 rounded-lg border border-zinc-100 flex-grow">
                    {cartaItem.conteudo}
                  </p>
                  <span className="text-xs text-zinc-400 mt-4">
                    {new Date(cartaItem.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}