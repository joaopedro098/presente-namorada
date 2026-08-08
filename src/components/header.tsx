"use client";


import { Button } from "@/components/ui/button";  
import Link from "next/link";

import { Heart, Mail, Image as ImageIcon, Sparkles,  Clock } from "lucide-react"

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 px-6 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 border-b border-pink-200/60 shadow-sm gap-4">
      
      {/* Título com ícone romântico */}
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
      
      </div>

      {/* Links de Navegação */}
      <nav className="flex items-center gap-3 flex-wrap justify-center">
        
        {/* Carta */}
        <Button 
           
          variant="ghost" 
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Link href="/carta" className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-pink-100" />
            <span>Carta</span>
          </Link>
        </Button>

        {/* Galeria */}
        <Button 
         
          variant="ghost" 
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Link href="/galeria" className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-pink-100" />
            <span>Galeria</span>
          </Link>
        </Button>

        {/* Mural de Memórias */}
        <Button 
      
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Link href="/muralMemorias" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-100" />
            <span>Mural de Memórias</span>
          </Link>
        </Button>
         <Button 
      
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2 px-5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Link href="/contagem" className="flex items-center gap-2">
            < Clock className="w-4 h-4 text-pink-100" />
            <span>contagem</span>
          </Link>
        </Button>

      </nav>
    </header>
  )
}