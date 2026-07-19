"use client"

import { useEffect, useState } from "react"
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
import { criarMemoria, listarMemorias } from "@/app/action/getMemory"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles, CalendarDays } from "lucide-react"

interface Memoria {
  id: number;
  titulo: string;
  descricao: string;
}

export default function MuralMemorias() {
  const [listaMemorias, setListaMemorias] = useState<Memoria[]>([]);
  const [open, setOpen] = useState(false); // Estado para controlar a abertura/fechamento do modal
  const [showAlert, setShowAlert] = useState(false); // Estado para controlar o Alerta Romântico

  useEffect(() => {
    async function carregarDados() {
      const dados = await listarMemorias();
      setListaMemorias(dados);
    }
    carregarDados();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50 py-10 px-4 sm:px-6 relative selection:bg-pink-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho do Mural */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-12 border-b border-pink-100/60 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-rose-900 flex items-center justify-center sm:justify-start gap-2">
              mural de memorias <Heart className="w-7 h-7 text-pink-500 fill-pink-500 animate-pulse" />
            </h1>
            <p className="text-sm text-rose-700/80 mt-1 font-medium text-center sm:text-left">
              tudo o que está escrito aqui são momentos nossos que são especiais e que agora estão gravados para sempre ✨
            </p>
          </div>
          
          <Button 
            onClick={() => setOpen(true)}
            className="inline-flex h-10 items-center justify-center rounded-full bg-pink-500 px-5 text-sm font-medium shadow-sm hover:bg-pink-600 transition-all text-white hover:scale-105 duration-200 cursor-pointer gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" /> Adicionar nova memória
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-pink-100">
              <DialogHeader>
                <DialogTitle className="text-xl font-serif text-rose-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" /> Lembrar de Algo Lindo
                </DialogTitle>
                <DialogDescription className="text-rose-700 text-xs leading-relaxed pt-2">
                  Tudo o que for adicionado nesse mural será gravado para sempre. Pense com o coração, e lembre-se que tudo o que estiver aqui pertence apenas ao nosso mundinho. ❤️
                </DialogDescription>
              </DialogHeader>
              
              <form 
                action={async (formData) => {
                  await criarMemoria(formData);
                  const dados = await listarMemorias();
                  setListaMemorias(dados);
                  setOpen(false); // Fecha o modal automaticamente após o sucesso!
                  
                  // Dispara o Alerta Romântico idêntico ao da galeria e faz sumir após 4 segundos
                  setShowAlert(true);
                  setTimeout(() => {
                    setShowAlert(false);
                  }, 4000);
                }} 
                className="space-y-4 pt-2"
              >
                <FieldGroup className="space-y-3">
                  <Field>
                    <Label htmlFor="titulo" className="text-rose-900 font-medium text-sm">O que aconteceu? (Título)</Label>
                    <Input id="titulo" name="titulo" placeholder="Ex: Nosso primeiro beijo na chuva..." required className="border-pink-200 focus-visible:ring-pink-400 focus:border-pink-400 bg-pink-50/30" />
                  </Field>
                  <Field>
                    <Label htmlFor="descricao" className="text-rose-900 font-medium text-sm">Detalhes desse momento (Descrição)</Label>
                    <Input id="descricao" name="descricao" placeholder="Ex: Estava frio, mas o seu abraço me esquentou inteira..." required className="border-pink-200 focus-visible:ring-pink-400 focus:border-pink-400 bg-pink-50/30" />
                  </Field>
                </FieldGroup>
                
                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <DialogClose type="button" className="inline-flex h-9 items-center justify-center rounded-lg border border-pink-200 bg-white px-4 text-sm font-medium hover:bg-pink-50 cursor-pointer text-rose-700 transition-colors">
                    Cancelar
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-4 py-2 rounded-lg transition-all"
                  >
                    Salvar no Coração
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid de Memórias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listaMemorias.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white/40 backdrop-blur-sm rounded-2xl border border-pink-100 p-6 shadow-sm">
              <p className="text-rose-700 font-serif text-lg">
                Nossa história está esperando para ser escrita aqui... ❤️
              </p>
              <p className="text-xs text-rose-600/70 mt-1">Clique acima e adicione nossa primeira memória!</p>
            </div>
          ) : (
            listaMemorias.map((memoria) => (
              <div 
                key={memoria.id} 
                className="bg-pink-50/60 backdrop-blur-xs p-5 pb-8 shadow-md rounded-xl border border-pink-100/70 -rotate-1 hover:rotate-0 hover:scale-102 transition-all duration-300 relative group flex flex-col justify-between overflow-hidden"
              >
                {/* Detalhe estético: um mini coração fofo no topo direito */}
                <Heart className="w-4 h-4 text-pink-300 absolute top-3 right-3 group-hover:text-pink-500 group-hover:scale-110 transition-all duration-300" />
                
                <div>
                  <h3 className="font-serif font-bold text-xl text-rose-950 mb-2 leading-tight">
                    {memoria.titulo}
                  </h3>
                  <p className="text-sm text-rose-900/80 font-sans leading-relaxed whitespace-pre-line">
                    {memoria.descricao}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-pink-100/40 text-[11px] text-pink-600/70 font-mono">
                  <CalendarDays className="w-3.5 h-3.5" /> Momento Eternizado
                </div>
              </div>
            ))
          )}
        </div>

        {/* Card do Convite para a Galeria - MODIFICADO SEM ASCHILD */}
        <Card className="w-full max-w-2xl mx-auto p-6 bg-white/60 backdrop-blur-md border border-pink-100 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-6 mt-16 transition-all hover:shadow-2xl">
          <div className="bg-pink-100 p-4 rounded-full text-pink-500 shrink-0">
            <Heart className="w-10 h-10 fill-current animate-pulse" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm sm:text-base text-rose-900 leading-relaxed font-serif mb-4">
              Escrever é uma forma perfeita de guardar sentimentos... Mas o que acha de também reviver os momentos lindos que registramos em fotos? Está pronta para ver nossos sorrisos?
            </p>
            <Link href='/galeria' className="w-full sm:w-auto block">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-pink-500/20 w-full sm:w-auto">
                <Heart className="w-4 h-4 fill-current" /> Ver Nossa Galeria de Fotos
              </Button>
            </Link>
          </div>
        </Card>

      </div>

      {/* ALERTA ROMÂNTICO FLUTUANTE */}
      {showAlert && (
        <div 
          className="fixed bottom-4 right-4 z-50 max-w-xs md:max-w-sm bg-pink-50/90 backdrop-blur-sm border border-pink-200 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-pink-100 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-pink-800 text-sm">Mais uma memória salva!</h4>
            <p className="text-xs text-pink-600 mt-0.5">Nosso amor fica cada vez mais lindo guardado aqui. 💖</p>
          </div>
        </div>
      )}
      
    </div>
  )
}