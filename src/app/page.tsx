
"use client";
import Link from 'next/link';

import { Card } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
;
import { Heart } from 'lucide-react'; 

export default function MuralDeMemorias() {
  // Estado para controlar a exibição do alerta

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-pink-100 px-4">
      
      <h1 className="text-3xl font-bold text-pink-700 mb-6 textAlign-center">
        Bem-vindo ao mural de memórias
      </h1>

      <Card className="w-full max-w-lg p-6 bg-pink-200 shadow-md flex flex-col gap-4">
        <div>
          <p className="text-pink-900 text-lg text-center leading-relaxed">
            Cada memória que nós tivemos em nossa trajetória é especial, então por que não guardar elas em algum lugar?
            Para isso eu criei esse mural para nossas memórias especiais e para gravar cada passo que daremos juntos daqui em diante.
          </p>
        </div>

        <div className="text-center font-semibold text-pink-800 text-xl my-2">
          Está pronta para ver essas memórias?
        </div>

        {/* Botão que agora gerencia o estado e prepara para o redirecionamento */}
        <Button 
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Link href="/carta" className="flex items-center gap-2">
          <Heart className="w-5 h-5 fill-current" />
          Estou pronta!
           </Link>
        </Button>
              
             
              
          </Card>
            
          </div>
           
        )
     
    
  
}
