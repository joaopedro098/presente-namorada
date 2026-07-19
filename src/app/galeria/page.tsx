"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Sparkles, Camera } from "lucide-react"

// Importação dos seus componentes e actions customizados
import UploadBotao from "@/components/uploadButton" 
import { salvarFotoNoBanco, listarFotosNoBanco } from "@/app/action/getPhotos"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Foto {
  id: string | number 
  titulo: string
  descricao: string
  imageUrl: string 
}

export default function MuralFotos() {
  const [open, setOpen] = useState(false)
  const [listaFotos, setListaFotos] = useState<Foto[]>([])
  const [imgUrlGerada, setImgUrlGerada] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  
  // Estado para controlar a exibição do alerta romântico
  const [showAlert, setShowAlert] = useState(false)

  // 1. Carrega as fotos do banco assim que a página abre
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

  // 2. Callback que o seu UploadBotao chama quando o Cloudinary faz o upload com sucesso
  const handleUploadCompleto = (url: string) => {
    setImgUrlGerada(url)
  }

  // 3. Função para submeter o formulário completo (Texto + Imagem do Cloudinary)
  async function handleSubmeterFormulario(formData: FormData) {
    if (!imgUrlGerada) {
      alert("Por favor, faça o upload de uma foto primeiro!")
      return
    }

    setCarregando(true)
    try {
      // Adiciona a URL do Cloudinary para os dados que vão para a Server Action
      formData.append("imageUrl", imgUrlGerada)

      await salvarFotoNoBanco(formData)
      
      // Limpa os estados e fecha o modal
      setImgUrlGerada(null)
      setOpen(false)
      
      // Atualiza o mural com as fotos novas do banco de dados
      await carregarFotos()

      // DISPARA O ALERTA ROMÂNTICO ✨
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

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50 p-8 text-slate-800 relative overflow-x-hidden">
      
      {/* Cabeçalho do Mural */}
      <header className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 mb-16 border-b border-pink-100 pb-8 text-center sm:text-left">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 flex items-center justify-center sm:justify-start gap-3 drop-shadow-sm">
            Nosso Mural de Fotos 
            <Heart className="fill-pink-500 text-pink-500 animate-pulse w-8 h-8 flex-shrink-0" />
          </h1>
          <p className="text-sm md:text-base text-pink-600/70 font-medium italic mt-2 flex items-center justify-center sm:justify-start gap-1">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" /> 
           cada momento especial agora está registrado para sempre em formato de imagens com lindos sorrisos e legendas que nos ajudaram a lembrar das historias que vivemos ✨
          </p>
        </div>

        {/* Modal / Dialog para Adicionar Nova Foto */}
        <Dialog open={open} onOpenChange={setOpen}>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 border border-pink-400/20"
          >
            <Camera className="w-4 h-4" /> Adicionar uma nova foto
          </Button>

          <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-2xl p-6 border border-pink-100">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-pink-600 flex items-center gap-1.5">
                Registrar Novo Momento ✨
              </DialogTitle>
              <DialogDescription className="text-sm text-pink-500/70 italic">
                Suba a foto favorita de vocês e eternize o momento com uma linda legenda.
              </DialogDescription>
            </DialogHeader>

            <form action={handleSubmeterFormulario} className="space-y-4 my-4">
              <FieldGroup className="space-y-4">
                <Field>
                  <Label className="text-sm font-bold text-pink-700">Título do Momento</Label>
                  <Input 
                    name="titulo" 
                    placeholder="Ex: O dia em que me apaixonei ainda mais..." 
                    required 
                    className="w-full mt-1.5 border border-pink-100 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all bg-pink-50/20 placeholder:text-slate-300"
                  />
                </Field>
                <Field>
                  <Label className="text-sm font-bold text-pink-700">Legenda de Amor</Label>
                  <Input 
                    name="descricao" 
                    placeholder="O que esse sorriso ou esse dia significou?" 
                    required 
                    className="w-full mt-1.5 border border-pink-100 rounded-xl p-2.5 focus:ring-2 focus:ring-pink-300 focus:border-pink-400 outline-none transition-all bg-pink-50/20 placeholder:text-slate-300"
                  />
                </Field>
              </FieldGroup>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-pink-200 rounded-xl p-5 bg-gradient-to-b from-pink-50/40 to-rose-50/20 hover:bg-pink-50/60 transition-colors duration-200">
                <UploadBotao onUploadCompleto={handleUploadCompleto} />
                {imgUrlGerada && (
                  <p className="text-xs text-emerald-600 font-semibold mt-3 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 animate-fade-in">
                    ✓ Imagem revelada e pronta para o mural! 📸
                  </p>
                )}
              </div>

              <DialogFooter className="flex gap-2 pt-3 justify-end sm:space-x-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)} 
                  className="text-slate-500 border-slate-200 hover:bg-slate-50 rounded-xl px-5"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={carregando || !imgUrlGerada} 
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-xl px-5 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                >
                  {carregando ? "Guardando..." : "Colocar no Mural"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      {/* Grid de Exibição das Fotos (Estilo Polaroid Retrô Romântico) */}
      <main className="max-w-6xl mx-auto mb-12">
        {listaFotos.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-3xl border border-pink-100 shadow-xl max-w-xl mx-auto p-8">
            <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4 animate-bounce" />
            <p className="text-pink-700 font-bold text-lg">Nosso mural está esperando por você...</p>
            <p className="text-sm text-pink-500/80 mt-2">Clique no botão acima para eternizar a nossa primeira foto juntos aqui! 💕</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
            {listaFotos.map((foto, index) => {
              // Alterna levemente a rotação para criar um efeito analógico orgânico de fotos jogadas na mesa
              const rotacaoClasse = index % 3 === 0 
                ? "-rotate-2" 
                : index % 3 === 1 
                  ? "rotate-2" 
                  : "-rotate-1"

              return (
                <div
                  key={foto.id}
                  className={`bg-white p-4 pb-14 shadow-[0_10px_30px_rgba(244,63,94,0.08)] border border-pink-50/60 max-w-[280px] w-full transition-all duration-300 hover:scale-105 hover:rotate-0 hover:shadow-[0_20px_40px_rgba(244,63,94,0.15)] ${rotacaoClasse} group relative rounded-sm`}
                >
                  {/* Detalhe fofo: Um mini coraçãozinho no topo que simula uma fita ou adesivo prendendo a foto */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500 drop-shadow-sm animate-pulse" />
                  </div>

                  {/* Foto Quadrada */}
                  <div className="relative aspect-square w-full bg-pink-50/30 overflow-hidden rounded-sm mb-4 border border-slate-100/50">
                    <Image
                      src={foto.imageUrl}
                      alt={foto.titulo}
                      fill
                      sizes="(max-w-280px) 100vw"
                      className="object-cover group-hover:scale-102 transition-transform duration-500"
                      priority={index < 3}
                    />
                  </div>

                  {/* Legenda Estilo Polaroid */}
                  <div className="text-center px-1">
                    <h3 className="font-serif font-bold text-base text-slate-800 leading-tight tracking-wide drop-shadow-sm">
                      {foto.titulo}
                    </h3>
                    <p className="font-serif text-xs text-pink-500 italic mt-2 line-clamp-2 px-1 border-t border-dashed border-pink-100/60 pt-2">
                      {foto.descricao}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* COMPONENTE DE ALERTA ROMÂNTICO (TOAST FLUTUANTE) */}
      {showAlert && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs md:max-w-sm w-full bg-white/95 backdrop-blur-md border border-pink-200 p-4 rounded-2xl shadow-[0_15px_40px_rgba(244,63,94,0.18)] flex items-start gap-3 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="bg-pink-50 p-2.5 rounded-xl text-pink-600 flex items-center justify-center shadow-inner">
            <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-extrabold text-pink-600">Momento Salvo! 💖</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
              Mais uma memória linda guardada a sete chaves no nosso cantinho do amor.
            </p>
          </div>
        </div>
      )}
      
      <Card className="w-full max-w-2xl mx-auto p-6 bg-white/60 backdrop-blur-md border border-pink-100 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 mt-16 transition-all hover:shadow-2xl">
  <div className="bg-pink-100 p-4 rounded-full text-pink-500 shrink-0">
    <Heart className="w-10 h-10 fill-current animate-pulse" />
  </div>
  <div className="flex-1 text-center md:text-left">
    <p className="text-sm sm:text-base text-rose-900 leading-relaxed font-serif mb-4">
      Nossa visita pelas memórias escritas chegou ao fim por aqui... Mas o nosso amor nunca para de crescer! Aguardo ansiosamente pelo seu retorno para que possamos registrar e eternizar ainda mais momentos lindos juntos. Que tal ver nossos sorrisos agora?
    </p>
    <Link href='/' className="w-full sm:w-auto block">
      <Button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-pink-500/20 w-full sm:w-auto">
        <Heart className="w-4 h-4 fill-current" /> voltar ao inicio de tudo
      </Button>
    </Link>
  </div>
</Card>
    </div>
  )
}