import { Heart } from "lucide-react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

export default function AlertAdd() {
  return (
    // O container fica fixo no canto inferior direito, com um espaçamento delicado e empilhado
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-full max-w-xs md:max-w-sm">
      
      {/* Alerta 1: Sucesso / Conclusão */}
      <Alert className="border-pink-200 bg-pink-50/90 backdrop-blur-sm text-pink-900 shadow-md rounded-xl p-3 animate-fade-in-up transition-all">
        <Heart className="h-5 w-5 text-pink-500 fill-pink-500 animate-pulse" />
        <div className="pl-2">
          <AlertTitle className="font-semibold text-pink-600 flex items-center gap-1 text-sm">
            Momento registrado! ❤️
          </AlertTitle>
          <AlertDescription className="text-xs text-pink-700/90 mt-0.5">
            Sua nova foto e legenda foram salvas com sucesso no nosso mural.
          </AlertDescription>
        </div>
      </Alert>

     
    </div>
  )
}
   