"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Sparkles, Camera, CalendarHeart, X } from "lucide-react"

import UploadBotao from "@/components/uploadButton" 
import { salvarFotoNoBanco, listarFotosNoBanco, favoritarFotoNoBanco } from "@/app/action/getPhotos" 
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Foto {
  id: string | number 
  titulo: string
  descricao: string
  imageUrl: string 
  dataFoto?: string | null
  favorito?: boolean
}

export default function MuralFotos() {
  const [open, setOpen] = useState(false)
  const [listaFotos, setListaFotos] = useState<Foto[]>([])
  const [imgUrlGerada, setImgUrlGerada] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [fotoSelecionada, setFotoSelecionada] = useState<Foto | null>(null)

  async function carregarFotos() {
    try {
      const dados = await listarFotosNoBanco()
      setListaFotos((dados as Foto[]) || [])
    } catch (error) {
      console.error("Erro ao carregar fotos:", error)
    }
  }

  useEffect(() => {
    carregarFotos()
  }, [])

  const handleUploadCompleto = (url: string) => {
    setImgUrlGerada(url)
  }

  async function handleSubmeterFormulario(formData: FormData) {
    if (!imgUrlGerada) {
      alert("Por favor, faça o upload de uma foto primeiro!")
      return
    }

    setCarregando(true)
    try {
      formData.append("imageUrl", imgUrlGerada)
      await salvarFotoNoBanco(formData)
      
      setImgUrlGerada(null)
      setOpen(false)
      
      await carregarFotos()

      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false)
      }, 4000)

    } catch (error) {
      console.error("Erro ao salvar no banco:", error)
      alert("Houve um erro ao registrar a foto.")
    } finally {
      setCarregando(false)
    }
  }

  // Função otimista para favoritar/desfavoritar
  async function handleToggleFavorito(e: React.MouseEvent, foto: Foto) {
    e.stopPropagation() // Impede a abertura/fechamento indevido do modal
    
    const estadoAtual = !!foto.favorito
    const novoEstado = !estadoAtual

    // Atualização otimista no estado local do Mural
    setListaFotos((prev) => 
      prev.map((f) => f.id === foto.id ? { ...f, favorito: novoEstado } : f)
    )

    // Sincroniza a foto que está aberta no modal (se houver)
    if (fotoSelecionada && fotoSelecionada.id === foto.id) {
      setFotoSelecionada({ ...fotoSelecionada, favorito: novoEstado })
    }

    try {
      await favoritarFotoNoBanco(foto.id, estadoAtual)
    } catch (error) {
      console.error("Erro ao favoritar:", error)
      
      // Reverte em caso de erro na requisição
      setListaFotos((prev) => 
        prev.map((f) => f.id === foto.id ? { ...f, favorito: estadoAtual } : f)
      )
      if (fotoSelecionada && fotoSelecionada.id === foto.id) {
        setFotoSelecionada({ ...fotoSelecionada, favorito: estadoAtual })
      }
    }
  }

  function formatarData(dataString?: string | null) {
    if (!dataString) return null
    const [ano, mes, dia] = dataString.split("T")[0].split("-")
    if (!ano || !mes || !dia) return null
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50/60 to-amber-50/80 px-4 sm:px-8 py-10 text-slate-800 relative">
      
      {/* Cabeçalho do Mural */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 sm:mb-16 border-b border-rose-100/80 pb-8 text-center sm:text-left">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 flex items-center justify-center sm:justify-start gap-3 tracking-tight">
            Nosso Mural de Fotos 
            <Heart className="fill-rose-500 text-rose-500 animate-pulse w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0" />
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-rose-700/70 font-medium italic mt-2.5 max-w-2xl leading-relaxed flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0 hidden sm:inline" /> 
            Cada momento especial guardado com carinho para lembrarmos de todas as histórias que construímos juntos. ✨
          </p>
        </div>

        {/* Modal de Adicionar Foto */}
        <Dialog open={open} onOpenChange={setOpen}>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-7 rounded-full transition-all duration-300 shadow-md hover:shadow-pink-500/25 hover:scale-105 active:scale-95 flex items-center gap-2 border border-pink-400/30 text-sm sm:text-base shrink-0"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" /> Adicionar foto
          </Button>

          <DialogContent className="sm:max-w-[425px] w-[95vw] bg-white rounded-3xl shadow-2xl p-6 border border-rose-100 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-rose-600 flex items-center gap-2">
                Registrar Novo Momento ✨
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-slate-500">
                Escolha a foto e escreva uma legenda especial para o mural.
              </DialogDescription>
            </DialogHeader>

            <form action={handleSubmeterFormulario} className="space-y-4 my-2">
              <FieldGroup className="space-y-3.5">
                <Field>
                  <Label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Título do Momento</Label>
                  <Input 
                    name="titulo" 
                    placeholder="Ex: Nosso piquenique no parque..." 
                    required 
                    className="w-full mt-1 border border-rose-100 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all bg-rose-50/20 text-sm"
                  />
                </Field>

                <Field>
                  <Label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Data do Momento</Label>
                  <Input 
                    name="dataFoto" 
                    type="date"
                    required
                    className="w-full mt-1 border border-rose-100 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all bg-rose-50/20 text-slate-600 text-sm"
                  />
                </Field>

                <Field>
                  <Label className="text-xs font-bold text-rose-700 uppercase tracking-wider">Legenda de Amor</Label>
                  <Input 
                    name="descricao" 
                    placeholder="O que esse dia significou?" 
                    required 
                    className="w-full mt-1 border border-rose-100 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none transition-all bg-rose-50/20 text-sm"
                  />
                </Field>
              </FieldGroup>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-rose-200 rounded-2xl p-4 bg-gradient-to-b from-rose-50/30 to-pink-50/20 hover:bg-rose-50/50 transition-colors">
                <UploadBotao onUploadCompleto={handleUploadCompleto} />
                {imgUrlGerada && (
                  <p className="text-xs text-emerald-600 font-semibold mt-2.5 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    ✓ Imagem selecionada com sucesso! 📸
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)} 
                  className="text-slate-500 border-slate-200 hover:bg-slate-50 rounded-xl text-sm"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={carregando || !imgUrlGerada} 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl text-sm disabled:opacity-50 transition-all"
                >
                  {carregando ? "Guardando..." : "Colocar no Mural"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Grid das Fotos */}
      <main className="max-w-6xl mx-auto mb-16">
        {listaFotos.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-md rounded-3xl border border-rose-100 shadow-sm max-w-lg mx-auto p-8">
            <Heart className="w-12 h-12 text-rose-300 mx-auto mb-4 animate-bounce" />
            <p className="text-rose-800 font-bold text-lg">Nosso mural está esperando por você...</p>
            <p className="text-xs sm:text-sm text-rose-600/80 mt-2">Clique no botão acima para adicionar a primeira lembrança! 💕</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 justify-items-center">
            {listaFotos.map((foto, index) => {
              const rotacaoClasse = index % 3 === 0 
                ? "-rotate-2" 
                : index % 3 === 1 
                  ? "rotate-2" 
                  : "-rotate-1"

              return (
                <div
                  key={foto.id}
                  onClick={() => setFotoSelecionada(foto)}
                  className={`bg-white p-3.5 pb-8 shadow-[0_10px_25px_-5px_rgba(244,63,94,0.1)] hover:shadow-[0_20px_35px_-5px_rgba(244,63,94,0.2)] border border-rose-100/60 max-w-[290px] w-full transition-all duration-300 hover:-translate-y-2 hover:rotate-0 ${rotacaoClasse} group relative rounded-sm cursor-pointer`}
                >
                  {/* Fita Adesiva / Washi Tape decorativo */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-100/80 backdrop-blur-sm border border-amber-200/50 rotate-1 z-10 shadow-sm opacity-90" />

                  {/* Container da Imagem com Botão de Favoritar sobreposto */}
                  <div className="relative aspect-square w-full bg-slate-100 overflow-hidden rounded-sm mb-3.5 border border-slate-100">
                    <Image
                      src={foto.imageUrl}
                      alt={foto.titulo}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority={index < 3}
                    />

                    {/* Botão Favoritar na Imagem do Mural */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorito(e, foto)}
                      className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md z-20 transition-all duration-300 hover:scale-110 active:scale-95 ${
                        foto.favorito ? 'opacity-100 scale-100' : 'opacity-80 sm:opacity-0 group-hover:opacity-100'
                      }`}
                      title={foto.favorito ? "Remover dos favoritos" : "Favoritar foto"}
                    >
                      <Heart 
                        className={`w-5 h-5 transition-colors duration-300 ${
                          foto.favorito 
                            ? 'fill-rose-500 text-rose-500' 
                            : 'text-slate-400 hover:text-rose-500'
                        }`} 
                      />
                    </button>
                  </div>

                  {/* Detalhes da Polaroid */}
                  <div className="text-center px-1">
                    <h3 className="font-serif font-bold text-slate-800 text-base leading-snug tracking-tight line-clamp-1">
                      {foto.titulo}
                    </h3>
                    
                    {foto.dataFoto && (
                      <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1 mt-1">
                        <CalendarHeart className="w-3 h-3 text-rose-400" />
                        {formatarData(foto.dataFoto)}
                      </p>
                    )}

                    <p className="font-serif text-xs text-rose-600/90 italic mt-2 line-clamp-2 px-1 border-t border-dashed border-rose-100 pt-2">
                      "{foto.descricao}"
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* MODAL LIGHTBOX - POLAROID AMPLIADA */}
      <Dialog open={!!fotoSelecionada} onOpenChange={(open) => !open && setFotoSelecionada(null)}>
        <DialogContent className="max-w-[480px] w-[92vw] bg-transparent border-none p-0 shadow-none overflow-visible max-h-[95vh]">
          {fotoSelecionada && (
            <div className="relative w-full max-h-[90vh] overflow-y-auto p-2 sm:p-4">
              
              {/* Moldura Polaroid Ampliada */}
              <div className="bg-white p-4 sm:p-6 pb-8 rounded-sm shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-rose-100 relative mx-auto my-4 w-full">
                
                {/* Washi Tape */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-amber-100/90 backdrop-blur-sm border border-amber-200/60 rotate-1 z-30 shadow-sm" />

                {/* Botão Fechar */}
                <button
                  type="button"
                  onClick={() => setFotoSelecionada(null)}
                  className="absolute -top-3 -right-3 z-40 bg-white hover:bg-rose-50 border border-rose-100 p-2 rounded-full text-slate-600 shadow-lg transition-transform hover:scale-110 active:scale-95"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Container da Imagem Ampliada com Botão Favoritar sobreposto */}
                <div className="relative aspect-square w-full bg-slate-100 rounded-sm overflow-hidden mb-5 border border-slate-200/60 shadow-inner group/modalImg">
                  <Image
                    src={fotoSelecionada.imageUrl}
                    alt={fotoSelecionada.titulo}
                    fill
                    sizes="(max-width: 640px) 90vw, 480px"
                    className="object-cover"
                    priority
                  />

                  {/* Botão Favoritar Posicionado Sobre a Foto Ampliada */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorito(e, fotoSelecionada)}
                    className="absolute top-3 right-3 z-30 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-rose-100 hover:scale-110 active:scale-95 transition-all"
                    title={fotoSelecionada.favorito ? "Remover dos favoritos" : "Favoritar foto"}
                  >
                    <Heart 
                      className={`w-6 h-6 transition-colors duration-300 ${
                        fotoSelecionada.favorito 
                          ? 'fill-rose-500 text-rose-500 scale-105' 
                          : 'text-slate-400 hover:text-rose-500'
                      }`} 
                    />
                  </button>
                </div>

                {/* Legenda da Polaroid Ampliada */}
                <div className="text-center px-2">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-slate-800 leading-tight">
                    {fotoSelecionada.titulo}
                  </h3>

                  {fotoSelecionada.dataFoto && (
                    <div className="mt-2 flex justify-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500/80 bg-rose-50/80 px-3 py-1 rounded-full border border-rose-100/60">
                        <CalendarHeart className="w-3.5 h-3.5" />
                        {formatarData(fotoSelecionada.dataFoto)}
                      </span>
                    </div>
                  )}

                  <p className="text-sm sm:text-base font-serif text-rose-900/80 italic mt-3.5 leading-relaxed border-t border-dashed border-rose-100 pt-3.5">
                    "{fotoSelecionada.descricao}"
                  </p>
                </div>

              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Toast Flutuante */}
      {showAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs md:max-w-sm w-full bg-white/95 backdrop-blur-md border border-rose-200 p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-rose-50 p-2.5 rounded-xl text-rose-600 flex items-center justify-center shadow-inner shrink-0">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-extrabold text-rose-600">Momento Salvo! 💖</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
              Memória guardada com sucesso no nosso mural do amor.
            </p>
          </div>
        </div>
      )}
      
      {/* Rodapé */}
      <footer className="max-w-2xl mx-auto mt-16 sm:mt-24">
        <Card className="p-6 sm:p-8 bg-white/70 backdrop-blur-md border border-rose-100 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-xl">
          <div className="bg-rose-100/70 p-4 rounded-full text-rose-500 shrink-0">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current animate-pulse" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif mb-5">
              Nossa visita pelas memórias escritas chegou ao fim por aqui... Mas o nosso amor nunca para de crescer! Aguardo ansiosamente pelo seu retorno para registrarmos ainda mais momentos juntos.
            </p>
            <Link href="/" className="inline-block w-full sm:w-auto">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-pink-500/20 w-full sm:w-auto text-xs sm:text-sm">
                <Heart className="w-4 h-4 fill-current" /> Voltar ao início de tudo
              </Button>
            </Link>
          </div>
        </Card>
      </footer>
    </div>
  )
}