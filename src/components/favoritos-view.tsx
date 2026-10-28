"use client";

import { CalendarDays, CalendarHeart, Heart, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Foto = {
  id: string;
  titulo: string | null;
  descricao: string | null;
  imageUrl: string;
  datafoto: string | null;
};
type Memoria = {
  id: number;
  titulo: string;
  descricao: string;
  createdAt: string;
};
type Carta = {
  id: number;
  titulo: string;
  conteudo: string;
  remetente: string;
  destinatario: string;
  createdAt: string;
};
type Selecionado =
  | { tipo: "foto"; item: Foto }
  | { tipo: "memoria"; item: Memoria }
  | { tipo: "carta"; item: Carta }
  | null;

function dataCurta(value?: string | null) {
  return value ? value.slice(0, 10).split("-").reverse().join("/") : null;
}

const cardClass =
  "block w-full cursor-pointer text-left transition-all duration-300 hover:-translate-y-2 hover:rotate-0 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-4";

export default function FavoritosView({
  activeTab,
  fotos,
  memorias,
  cartas,
}: {
  activeTab: string;
  fotos: Foto[];
  memorias: Memoria[];
  cartas: Carta[];
}) {
  const [selecionado, setSelecionado] = useState<Selecionado>(null);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-amber-50 px-4 py-10 text-slate-800 selection:bg-rose-200 sm:px-8">
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-96 w-96 rounded-full bg-rose-300/20 blur-3xl" />
      <main className="relative z-10 mx-auto max-w-6xl">
        <h1 className="mb-6 flex items-center gap-3 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 bg-clip-text text-3xl font-serif font-bold text-transparent sm:text-4xl">
          Meus Favoritos{" "}
          <Heart className="h-7 w-7 fill-rose-500 text-rose-500" />
        </h1>
        <nav
          aria-label="Categorias de favoritos"
          className="mb-10 flex flex-wrap gap-3 border-b border-rose-100/80 pb-4"
        >
          {[
            { id: "fotos", label: `📸 Fotos (${fotos.length})` },
            { id: "memorias", label: `🧠 Memórias (${memorias.length})` },
            { id: "cartas", label: `✉️ Cartas (${cartas.length})` },
          ].map(({ id, label }) => (
            <Link
              key={id}
              href={`?tab=${id}`}
              aria-current={activeTab === id ? "page" : undefined}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${activeTab === id ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/20" : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {activeTab === "fotos" && (
          <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3">
            {fotos.length === 0 ? (
              <Empty> Nenhuma foto favorita encontrada. 💕</Empty>
            ) : (
              fotos.map((foto, index) => (
                <button
                  key={foto.id}
                  type="button"
                  onClick={() => setSelecionado({ tipo: "foto", item: foto })}
                  aria-label={`Abrir foto ${foto.titulo || "favorita"}`}
                  className={`${cardClass} relative max-w-[290px] rounded-sm border border-rose-100/60 bg-white p-3.5 pb-8 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.1)] ${index % 3 === 0 ? "-rotate-2" : index % 3 === 1 ? "rotate-2" : "-rotate-1"}`}
                >
                  <div className="absolute -top-3 left-1/2 z-10 h-5 w-20 -translate-x-1/2 rotate-1 border border-amber-200/50 bg-amber-100/80 shadow-sm" />
                  <div className="relative mb-3.5 aspect-square w-full overflow-hidden rounded-sm border border-slate-100 bg-slate-100">
                    <Image
                      src={foto.imageUrl}
                      alt={foto.titulo || "Foto favorita"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md">
                      <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
                    </span>
                  </div>
                  <div className="px-1 text-center">
                    <h2 className="line-clamp-1 font-serif text-base font-bold text-slate-800">
                      {foto.titulo || "Sem título"}
                    </h2>
                    {foto.datafoto && (
                      <p className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                        <CalendarHeart className="h-3.5 w-3.5 text-rose-400" />
                        {dataCurta(foto.datafoto)}
                      </p>
                    )}
                    <p className="mt-2.5 line-clamp-2 border-t border-dashed border-rose-100 px-1 pt-2.5 font-serif text-xs italic text-rose-600/90">
                      “{foto.descricao}”
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === "memorias" && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {memorias.length === 0 ? (
              <Empty>Nenhuma memória favorita encontrada. 💕</Empty>
            ) : (
              memorias.map((memoria, index) => (
                <button
                  key={memoria.id}
                  type="button"
                  onClick={() =>
                    setSelecionado({ tipo: "memoria", item: memoria })
                  }
                  aria-label={`Abrir memória ${memoria.titulo}`}
                  className={`${cardClass} relative flex flex-col justify-between overflow-hidden rounded-2xl border border-rose-400 bg-white/90 p-6 pb-5 ring-2 ring-rose-200/60 ${index % 3 === 0 ? "-rotate-2" : index % 2 === 0 ? "rotate-2" : "-rotate-1"}`}
                >
                  <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-1 border border-pink-300/30 bg-pink-200/50 shadow-xs" />
                  <div className="pt-2">
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <h2 className="font-serif text-xl font-bold text-rose-950">
                        {memoria.titulo}
                      </h2>
                      <Heart className="h-5 w-5 shrink-0 fill-rose-500 text-rose-500" />
                    </div>
                    <p className="my-2 line-clamp-4 whitespace-pre-line rounded-xl border border-pink-100/50 bg-pink-50/40 p-3.5 font-serif text-sm italic text-rose-900/80">
                      “{memoria.descricao}”
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-pink-100 pt-3 font-mono text-[11px] text-pink-600/80">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-pink-400" />
                      {dataCurta(memoria.createdAt)}
                    </span>
                    <span className="font-semibold text-rose-500">
                      Memória Favorita ❤️
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}

        {activeTab === "cartas" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {cartas.length === 0 ? (
              <Empty>Nenhuma carta favorita encontrada. 💕</Empty>
            ) : (
              cartas.map((carta) => (
                <button
                  key={carta.id}
                  type="button"
                  onClick={() => setSelecionado({ tipo: "carta", item: carta })}
                  aria-label={`Abrir carta ${carta.titulo}`}
                  className={`${cardClass} flex flex-col rounded-xl border border-zinc-200 bg-white p-6 shadow-sm`}
                >
                  <span className="mb-1 flex w-full items-start justify-between gap-2 text-left">
                    <span className="text-lg font-bold text-zinc-800">
                      {carta.titulo}
                    </span>
                    <Heart className="h-5 w-5 shrink-0 fill-rose-500 text-rose-500" />
                  </span>
                  <span className="mb-3 w-full text-left text-xs font-medium text-rose-500">
                    De: {carta.remetente} → Para: {carta.destinatario}
                  </span>
                  <span className="line-clamp-3 w-full flex-grow whitespace-pre-line rounded-lg border border-zinc-100 bg-zinc-50 p-4 text-left text-sm text-zinc-600">
                    {carta.conteudo}
                  </span>
                  <span className="mt-4 w-full text-left text-xs text-zinc-400">
                    {dataCurta(carta.createdAt)}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </main>

      <Dialog
        open={!!selecionado}
        onOpenChange={(open) => !open && setSelecionado(null)}
      >
        <DialogContent className="max-h-[90vh] w-[92vw] max-w-xl overflow-y-auto rounded-3xl border border-pink-200/80 bg-white/95 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          {selecionado?.tipo === "foto" && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-xl bg-slate-100 shadow-inner">
                <Image
                  src={selecionado.item.imageUrl}
                  alt={selecionado.item.titulo || "Foto favorita"}
                  fill
                  sizes="(max-width: 640px) 90vw, 448px"
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="font-serif text-2xl font-bold text-rose-950">
                {selecionado.item.titulo || "Sem título"}
              </h2>
              {selecionado.item.datafoto && (
                <p className="flex items-center justify-center gap-2 text-sm text-rose-500">
                  <CalendarHeart className="h-4 w-4" />
                  {dataCurta(selecionado.item.datafoto)}
                </p>
              )}
              <p className="border-t border-dashed border-rose-100 pt-4 font-serif italic leading-relaxed text-rose-900/80">
                “{selecionado.item.descricao}”
              </p>
            </div>
          )}
          {selecionado?.tipo === "memoria" && (
            <div className="space-y-5 text-center">
              <Heart className="mx-auto h-8 w-8 fill-rose-500 text-rose-500" />
              <h2 className="font-serif text-2xl font-bold text-rose-950">
                {selecionado.item.titulo}
              </h2>
              <div className="relative rounded-2xl border border-pink-100 bg-pink-50/50 p-6">
                <Quote className="absolute left-3 top-3 h-5 w-5 rotate-180 text-pink-300/50" />
                <p className="whitespace-pre-line px-3 font-serif italic leading-relaxed text-rose-900">
                  {selecionado.item.descricao}
                </p>
                <Quote className="absolute bottom-3 right-3 h-5 w-5 text-pink-300/50" />
              </div>
              <p className="text-xs text-rose-500">
                Memória guardada em {dataCurta(selecionado.item.createdAt)}
              </p>
            </div>
          )}
          {selecionado?.tipo === "carta" && (
            <article className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-serif text-2xl font-bold text-rose-950">
                  {selecionado.item.titulo}
                </h2>
                <Heart className="mt-1 h-5 w-5 shrink-0 fill-rose-500 text-rose-500" />
              </div>
              <p className="text-sm text-rose-500">
                De: {selecionado.item.remetente} → Para:{" "}
                {selecionado.item.destinatario}
              </p>
              <p className="max-h-[50vh] overflow-y-auto whitespace-pre-line rounded-2xl border border-pink-100 bg-pink-50/50 p-5 font-serif leading-relaxed text-rose-950">
                {selecionado.item.conteudo}
              </p>
              <p className="text-xs text-zinc-400">
                {dataCurta(selecionado.item.createdAt)}
              </p>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="col-span-full mx-auto w-full max-w-lg rounded-3xl border border-rose-100 bg-white/70 p-8 py-16 text-center font-serif text-zinc-500 shadow-sm">
      {children}
    </p>
  );
}
