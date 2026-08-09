"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { criarMemoria, listarMemorias, toggleFavoritoMemoria } from "@/app/action/getMemory"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles, CalendarDays, Images, X, Sparkle, Quote } from "lucide-react"

interface Memoria {
  id: number;
  titulo: string;
  descricao: string;
  favorito: boolean;
}

export default function MuralMemorias() {
  const [listaMemorias, setListaMemorias] = useState<Memoria[]>([]);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [memoriaSelecionada, setMemoriaSelecionada] = useState<Memoria | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function carregarDados() {
      const dados = await listarMemorias();
      setListaMemorias(dados);
    }
    carregarDados();
  }, []);

  // Fechar no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMemoriaSelecionada(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Função para favoritar / desfavoritar a memória
  const handleToggleFavorito = (e: React.MouseEvent, id: number, estadoAtual: boolean) => {
    e.stopPropagation(); // Evita abrir o modal ao clicar no coração

    // Update Otimista: atualiza a tela na hora para UX instantânea
    setListaMemorias((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorito: !estadoAtual } : m))
    );

    if (memoriaSelecionada?.id === id) {
      setMemoriaSelecionada((prev) => prev ? { ...prev, favorito: !estadoAtual } : null);
    }

    startTransition(async () => {
      const res = await toggleFavoritoMemoria(id, estadoAtual);
      if (!res.success) {
        // Se der erro no servidor, reverte o estado local
        setListaMemorias((prev) =>
          prev.map((m) => (m.id === id ? { ...m, favorito: estadoAtual } : m))
        );
      }
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-amber-50 py-12 px-4 sm:px-6 relative overflow-hidden selection:bg-rose-200">
      
      {/* Luzes de Fundo */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-pink-200/60 shadow-xs text-rose-700 text-xs font-medium tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            Nosso Cantinho Secreto
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-rose-950 tracking-tight flex items-center justify-center gap-3">
            Mural de Memórias
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse shrink-0 drop-shadow-sm" />
          </h1>

          <p className="text-base text-rose-800/80 font-serif italic leading-relaxed">
            "Tudo o que está escrito aqui são momentos nossos que são especiais e que agora estão gravados para sempre." ✨
          </p>

          <div className="pt-2">
            <Button 
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 text-sm font-medium shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:from-pink-600 hover:to-rose-600 transition-all text-white hover:scale-105 active:scale-95 duration-200 cursor-pointer gap-2 border border-pink-300/30"
            >
              <Sparkles className="w-4 h-4 fill-current" /> Adicionar Nova Memória
            </Button>
          </div>

          {/* Modal de Criar Memória */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-lg bg-white/95 backdrop-blur-xl border-pink-200/80 rounded-3xl shadow-2xl p-6 sm:p-8">
              <DialogHeader className="text-left space-y-2">
                <DialogTitle className="text-2xl font-serif text-rose-950 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500" /> Eternizar Nova Memória
                </DialogTitle>
                <DialogDescription className="text-rose-700/90 text-sm leading-relaxed">
                  Pense com o coração. Tudo o que você guardar aqui se torna parte perpétua da nossa história. ❤️
                </DialogDescription>
              </DialogHeader>
              
              <form 
                action={async (formData) => {
                  await criarMemoria(formData);
                  const dados = await listarMemorias();
                  setListaMemorias(dados);
                  setOpen(false);
                  
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 4000);
                }} 
                className="space-y-5 pt-3"
              >
                <FieldGroup className="space-y-4">
                  <Field className="space-y-1.5">
                    <Label htmlFor="titulo" className="text-rose-900 font-medium text-xs uppercase tracking-wider">
                      Qual é essa memória? (Título)
                    </Label>
                    <Input 
                      id="titulo" 
                      name="titulo" 
                      placeholder="Ex: Nosso primeiro beijo na chuva..." 
                      required 
                      className="border-pink-200/80 focus-visible:ring-pink-400 focus:border-pink-400 bg-pink-50/40 rounded-xl h-11" 
                    />
                  </Field>

                  <Field className="space-y-1.5">
                    <Label htmlFor="descricao" className="text-rose-900 font-medium text-xs uppercase tracking-wider">
                      Detalhes desse momento (Descrição)
                    </Label>
                    <Input 
                      id="descricao" 
                      name="descricao" 
                      placeholder="Ex: Estava frio, mas o seu abraço me esquentou inteira..." 
                      required 
                      className="border-pink-200/80 focus-visible:ring-pink-400 focus:border-pink-400 bg-pink-50/40 rounded-xl h-11" 
                    />
                  </Field>
                </FieldGroup>
                
                <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-pink-100">
                  <DialogClose type="button" className="inline-flex h-10 items-center justify-center rounded-xl border border-pink-200 bg-white px-5 text-sm font-medium hover:bg-pink-50 cursor-pointer text-rose-700 transition-colors">
                    Cancelar
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium px-6 h-10 rounded-xl transition-all shadow-md shadow-pink-500/20"
                  >
                    Salvar Memória
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de Memórias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {listaMemorias.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-pink-300/70 p-8 shadow-sm">
              <div className="bg-pink-100/80 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
                <Heart className="w-8 h-8 fill-pink-500" />
              </div>
              <p className="text-rose-900 font-serif text-xl font-medium">
                Nossa história está esperando para ser escrita aqui... ❤️
              </p>
              <p className="text-sm text-rose-600/80 mt-1">
                Clique no botão acima e adicione a nossa primeira memória!
              </p>
            </div>
          ) : (
            listaMemorias.map((memoria, index) => {
              const rotateClass = index % 3 === 0 ? "-rotate-2" : index % 2 === 0 ? "rotate-2" : "-rotate-1";
              
              return (
                <div 
                  key={memoria.id} 
                  onClick={() => setMemoriaSelecionada(memoria)}
                  className={`bg-white/90 backdrop-blur-sm p-6 pb-5 shadow-md hover:shadow-2xl rounded-2xl border ${memoria.favorito ? 'border-rose-400 ring-2 ring-rose-200/60' : 'border-pink-100/80'} ${rotateClass} hover:rotate-0 hover:scale-105 transition-all duration-300 relative group flex flex-col justify-between cursor-pointer overflow-hidden`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-pink-200/50 backdrop-blur-xs border border-pink-300/30 rotate-1 shadow-xs z-10 pointer-events-none" />

                  <div className="pt-2">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <h3 className="font-serif font-bold text-xl text-rose-950 leading-snug group-hover:text-pink-600 transition-colors">
                        {memoria.titulo}
                      </h3>
                      
                      {/* Botão de Favoritar */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorito(e, memoria.id, memoria.favorito)}
                        className="p-1.5 -mr-1.5 rounded-full hover:bg-pink-100/60 transition-colors z-10 cursor-pointer shrink-0"
                        title={memoria.favorito ? "Remover dos favoritos" : "Favoritar memória"}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-all duration-200 ${
                            memoria.favorito 
                              ? "text-rose-500 fill-rose-500 scale-110 drop-shadow-xs" 
                              : "text-pink-300 hover:text-pink-500 group-hover:scale-110"
                          }`} 
                        />
                      </button>
                    </div>

                    <p className="text-sm text-rose-900/80 font-serif leading-relaxed whitespace-pre-line line-clamp-4 italic bg-pink-50/40 p-3.5 rounded-xl border border-pink-100/50">
                      "{memoria.descricao}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-pink-100 text-[11px] text-pink-600/80 font-mono">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-pink-400" /> Memória Eternizada
                    </span>
                    <span className="group-hover:translate-x-1 transition-transform text-rose-500 font-semibold flex items-center gap-1">
                      Ver memória completa →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 💖 JANELA DE LEITURA COM X E FAVORITO CORRIGIDOS 💖 */}
        {memoriaSelecionada && (
          <div 
            onClick={() => setMemoriaSelecionada(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-rose-950/40 backdrop-blur-md animate-in fade-in duration-300"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(244,114,182,0.3)] border border-pink-200/80 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-6 duration-300"
            >
              {/* Luzes de Fundo (com pointer-events-none) */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-pink-300/30 to-rose-200/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-rose-300/20 to-pink-100/30 rounded-full blur-3xl pointer-events-none" />

              {/* Botão X (Com z-20 para garantir prioridade de clique) */}
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMemoriaSelecionada(null);
                }}
                className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-pink-50 hover:bg-pink-100 text-rose-700 transition-all hover:scale-110 active:scale-90 duration-200 cursor-pointer shadow-xs border border-pink-100 flex items-center justify-center"
                title="Fechar"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="relative z-10 space-y-5">
                
                {/* Emblema Romântico Clicável (Favoritar direto do Modal) */}
                <div className="flex flex-col items-center justify-center space-y-1">
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorito(e, memoriaSelecionada.id, memoriaSelecionada.favorito)}
                    className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 shadow-md shadow-pink-500/20 hover:scale-110 transition-transform cursor-pointer"
                    title={memoriaSelecionada.favorito ? "Desfavoritar" : "Favoritar"}
                  >
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <Heart 
                        className={`w-5 h-5 transition-colors ${
                          memoriaSelecionada.favorito 
                            ? "text-rose-500 fill-rose-500 animate-pulse" 
                            : "text-pink-300"
                        }`} 
                      />
                    </div>
                  </button>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-pink-600 font-semibold flex items-center gap-1 pt-1">
                    <Sparkle className="w-3 h-3 fill-pink-400 text-pink-400" />
                    {memoriaSelecionada.favorito ? "Memória Favorita ❤️" : "Memória Eternizada"}
                    <Sparkle className="w-3 h-3 fill-pink-400 text-pink-400" />
                  </span>
                </div>

                {/* Título Principal */}
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-rose-950 text-center leading-tight tracking-tight px-4">
                  {memoriaSelecionada.titulo}
                </h2>

                {/* Caixa de Mensagem */}
                <div className="relative bg-gradient-to-b from-rose-50/60 via-pink-50/30 to-white rounded-2xl border border-pink-100/80 shadow-inner p-5 sm:p-6">
                  <Quote className="absolute top-3 left-3 w-6 h-6 text-pink-300/30 rotate-180 pointer-events-none" />
                  <Quote className="absolute bottom-3 right-3 w-6 h-6 text-pink-300/30 pointer-events-none" />

                  <div className="max-h-56 sm:max-h-64 overflow-y-auto pr-3 text-center scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-transparent">
                    <p className="text-base sm:text-lg text-rose-900/90 font-serif leading-relaxed italic whitespace-pre-line">
                      "{memoriaSelecionada.descricao}"
                    </p>
                  </div>
                </div>

                {/* Rodapé Interno */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-pink-100/80">
                  <p className="text-xs text-rose-700/80 font-serif italic flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    Guardado com amor no nosso mural.
                  </p>

                  <button 
                    type="button"
                    onClick={() => setMemoriaSelecionada(null)}
                    className="w-full sm:w-auto px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-semibold shadow-md shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    Guardar e Fechar
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Banner Galeria */}
        <Card className="w-full max-w-3xl mx-auto p-8 bg-white/70 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6 mt-20 transition-all hover:shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-200/30 rounded-full blur-2xl pointer-events-none" />
          
          <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-5 rounded-2xl text-white shrink-0 shadow-lg shadow-pink-500/30">
            <Images className="w-8 h-8" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <h3 className="text-xl font-serif font-bold text-rose-950">
              Quer ver esses momentos em imagens?
            </h3>
            <p className="text-sm text-rose-800/80 leading-relaxed font-serif">
              Escrever nossas memórias é lindo... Mas olhar para os nossos sorrisos é ainda melhor. Vamos dar uma olhada na nossa galeria de fotos juntas?
            </p>
            <Link href='/galeria' className="inline-block pt-1">
              <Button className="bg-rose-950 hover:bg-rose-900 text-white font-medium py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400" /> Abrir Nossa Galeria
              </Button>
            </Link>
          </div>
        </Card>

      </div>

      {/* Alerta Flutuante */}
      {showAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs bg-white/90 backdrop-blur-md border border-pink-200 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-pink-100 p-2.5 rounded-xl text-pink-500">
            <Heart className="w-5 h-5 fill-current animate-bounce" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-rose-950 text-sm">Mais uma memória salva!</h4>
            <p className="text-xs text-rose-700/80 mt-0.5">Nosso amor fica cada vez mais lindo guardado aqui. 💖</p>
          </div>
        </div>
      )}

    </div>
  )
}