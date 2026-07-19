import { Card } from '@/components/ui/card'; 
import { Button } from '@/components/ui/button';
import { Heart,  } from 'lucide-react';
 import Link from 'next/link';

export default function cartas(){
     return (
        <div className="flex flex-col items-center justify-center min-h-screen py-6 bg-pink-100 px-4">
      
      <h1 className="text-3xl font-bold text-pink-700 mb-6 textAlign-center">
        carta aberta para minha princesa
      </h1>

      <Card className="w-full max-w-lg p-6 bg-pink-200 shadow-md flex flex-col gap-4">
        <div>
          <p className="text-pink-900 text-lg text-center leading-relaxed">
           Tão natural quanto a luz do dia, tão calma quanto um domingo a tarde, tão linda quanto um por do sol na praia, tão intensa quanto um carro de corrida, e tão bela quanto a lua, é tão incrível quanto uma heroína, essa é a mulher que eu decidi amar, a mulher que eu decidi tomar como minha e cuidar como se fosse um diamante, a mulher que eu decidi casar a mulher que eu decidi que quero passar minha vida ao lado e criar memórias incríveis, essa é a mulher que eu decidi aprender um pouco sobre cada dia mais, a mulher que me ensinou o que é amar, o que é cuidar, e o que é ter algo que você quer proteger, que me incentiva a ser melhor todos os dias, que me incentiva a estudar, e que me deu um motivo para querer aprender mais, e o mais incrível é que eu nunca me importei com como seria meu futuro desde que eu estive bem pra mim já estava bom, mas desde que você chegou, isso mudou; eu comecei a planejar meu futuro detalhe por detalhe, porque essa mulher merece tudo, merece ter um futuro bom, merece viajar, conhecer lugares, conhecer novas culturas, essa mulher merece tudo, eu não vou prometer te dar o mundo, porque ele está corrompido e muito sujo, mas eu prometo dias felizes, cheio de amor e respeito, te prometo uma vida feliz e confortavel, e prometo te amar eternamente, e tudo mais o que eu puder te dar.

Minha vida antes de te conhecer era muito mais calma, daí você chegou e virou ela de cabeça para baixo, mas sabe de uma coisa, foi a melhor  que me aconteceu, sabe porque? Porque minha vida se tornou mais alegre e mais divertida, você entrou nela e começou a organizar ela, tirar as coisas ruins, organizar meu coração e além de organizar tudo, você roubou ele para você de um jeito que eu nem percebi, e com toda essa loucura, todo o dia eu fui me apaixonando cada vez mais, até que um dia eu percebi que se eu te perder minha vida acabou, que se eu te  perder minha perde o sentido, e a partir desse dia eu decidi cuidar de você pra mim não te perder, e alèm disso, tem muitas coisas que eu quero fazer com você ainda, como viajar de moto pra algum lugar, viajarmos para outro país, e principalmente abrir nossa clínica no canadá, para cuidar dos animais e proteger eles também, e além disso tudo eu quero te ajudar a realizar seus sonhos e te apoiar eles, independente de tudo.

Nòs teremos dia  bons e ruins, temos dias felizes e tristes, mas que os dias bons superam os dias ruins, que os dias alegres superem os triste e que em todos esses dias a gente fique um ao lado do outro e que em todos esses dias nunca falte carinho, amor e respeito, e principalmente risadas, minha melhor escolha foi você, minha maior sorte foi você, minha melhor escolha foi te amar, e não só te amar, mas viver esse amor, você já tem meu coração e ele sempre vai ser seu, e não tem espaço para mais ninguém nele, eu posso ter vários defeitos e não vou mentir, mas uma coisa que não tenho defeito algum é em te amar mais do que tudo.<br />

❤️ EU TE AMO DAQUI ATÉ A LUA  ❤️

          </p>
        </div>

        <div className="text-center font-semibold text-pink-800 text-xl my-2">
          momentos não devem apenas ser lembrados, devem ser escritos para ficarem pra sempre gravados, e é isso que eu quero fazer agora, aparitr desse ponto comearemos a escrver nossa historia, está pronta?
        </div>

        <button className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
        <Link href="/muralMemorias" className="flex items-center gap-2">
   
    <Heart className="w-5 h-5 fill-current" />
    Estou pronta!
  
</Link>
</button>
  </Card>
</div>
     )
}