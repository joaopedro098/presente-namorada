'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Calendar, X, Sparkles, User, Send, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import { criarCarta, getCartas } from '@/app/action/carta';

interface CartaType {
  id: number;
  titulo: string;
  conteudo: string;
  favorito: boolean;
  createdAt: Date;
  remetente?: string;
  destinatario?: string;
}

export default function CartasPage() {
  const [cartas, setCartas] = useState<CartaType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Estado para controlar a carta expandida na tela
  const [cartaExpandida, setCartaExpandida] = useState<CartaType | null>(null);

  // Carrega as cartas salvas no banco de dados
  const carregarCartas = async () => {
    const res = await getCartas();
    if (res.success && res.data) {
      setCartas(res.data as CartaType[]);
    }
  };

  useEffect(() => {
    carregarCartas();
  }, []);

  // Função para alternar o estado de favorito de uma carta
  const handleToggleFavorito = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Evita que abra o modal de leitura ao clicar no coração

    setCartas((prevCartas) =>
      prevCartas.map((c) =>
        c.id === id ? { ...c, favorito: !c.favorito } : c
      )
    );

    // Se a carta expandida for a mesma que teve o favorito alterado, atualiza o modal
    if (cartaExpandida && cartaExpandida.id === id) {
      setCartaExpandida((prev) => prev ? { ...prev, favorito: !prev.favorito } : null);
    }
  };

  // Submissão do formulário
  const handleCriarCarta = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await criarCarta(formData);

    if (res.success) {
      setIsModalOpen(false);
      await carregarCartas();
    } else {
      alert(res.error || 'Erro ao salvar a carta.');
    }
    setLoading(false);
  };

  // Carta principal fixa
  const cartaPrincipal: CartaType = {
    id: 0,
    titulo: 'Carta Aberta para Minha Princesa',
    conteudo: `Tão natural quanto a luz do dia, tão calma quanto um domingo a tarde, tão linda quanto um por do sol na praia, tão intensa quanto um carro de corrida, e tão bela quanto a lua, é tão incrível quanto uma heroína, essa é a mulher que eu decidi amar, a mulher que eu decidi tomar como minha e cuidar como se fosse um diamante, a mulher que eu decidi casar a mulher que eu decidi que quero passar minha vida ao lado e criar memórias incríveis, essa é a mulher que eu decidi aprender um pouco sobre cada dia mais, a mulher que me ensinou o que é amar, o que é cuidar, e o que é ter algo que você quer proteger, que me incentiva a ser melhor todos os dias, que me incentiva a estudar, e que me deu um motivo para querer aprender mais, e o mais incrível é que eu nunca me importei com como seria meu futuro desde que eu estive bem pra mim já estava bom, mas desde que você chegou, isso mudou; eu comecei a planejar meu futuro detalhe por detalhe, porque essa mulher merece tudo, merece ter um futuro bom, merece viajar, conhecer lugares, conhecer novas culturas, essa mulher merece tudo, eu não vou prometer te dar o mundo, porque ele está corrompido e muito sujo, mas eu prometo dias felizes, cheio de amor e respeito, te prometo uma vida feliz e confortavel, e prometo te amar eternamente, e tudo mais o que eu puder te dar.

Minha vida antes de te conhecer era muito mais calma, daí você chegou e virou ela de cabeça para baixo, mas sabe de uma coisa, foi a melhor que me aconteceu, sabe porque? Porque minha vida se tornou mais alegre e mais divertida, você entrou nela e começou a organizar ela, tirar as coisas ruins, organizar meu coração e além de organizar tudo, você roubou ele para você de um jeito que eu nem percebi, e com toda essa loucura, todo o dia eu fui me apaixonando cada vez mais, até que um dia eu percebi que se eu te perder minha vida acabou, que se eu te perder minha perde o sentido, e a partir desse dia eu decidi cuidar de você pra mim não te perder, e além disso, tem muitas coisas que eu quero fazer com você ainda, como viajar de moto pra algum lugar, viajarmos para outro país, e principalmente abrir nossa clínica no canadá, para cuidar dos animais e proteger eles também, e além disso tudo eu quero te ajudar a realizar seus sonhos e te apoiar eles, independente de tudo.

Nós teremos dia bons e ruins, temos dias felizes e tristes, mas que os dias bons superam os dias ruins, que os dias alegres superem os triste e que em todos esses dias a gente fique um ao lado do outro e que em todos esses dias nunca falte carinho, amor e respeito, e principalmente risadas, minha melhor escolha foi você, minha maior sorte foi você, minha melhor escolha foi te amar, e não só te amar, mas viver esse amor, você já tem meu coração e ele sempre vai ser seu, e não tem espaço para mais ninguém nele, eu posso ter vários defeitos e não vou mentir, mas uma coisa que não tenho defeito algum é em te amar mais do que tudo.

❤️ EU TE AMO DAQUI ATÉ A LUA ❤️`,
    favorito: true,
    createdAt: new Date(),
    remetente: 'Seu Amor',
    destinatario: 'Minha Princesa'
  };

  return (
    <div className="flex flex-col items-center min-h-screen pt-10 pb-16 bg-pink-100 px-4 md:px-8 gap-8">
      
      {/* --- CABEÇALHO COM TÍTULO --- */}
      <div className="w-full max-w-7xl flex flex-col items-center justify-center border-b border-pink-200 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-pink-700 flex items-center justify-center gap-2">
          Nossa História em Cartas <Sparkles className="w-7 h-7 text-pink-500 fill-pink-300" />
        </h1>
        <p className="text-pink-800 text-sm md:text-base mt-1">
          Todas as nossas memórias e declarações guardadas para sempre.
        </p>
      </div>

      {/* --- GRID DE CARTAS (LADO A LADO) --- */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* --- CARTA ORIGINAL (DESTAQUE) --- */}
        <Card 
          onClick={() => setCartaExpandida(cartaPrincipal)}
          className="p-6 bg-pink-200 hover:bg-pink-250 transition-all cursor-pointer shadow-lg hover:shadow-xl border-2 border-pink-400 rounded-2xl flex flex-col justify-between gap-4 min-h-[500px] relative group"
        >
          <div>
            <div className="flex justify-between items-center border-b border-pink-300 pb-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-300/60 px-3 py-1 rounded-full">
                Carta Principal ❤️
              </span>
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-pink-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                <Heart className="w-5 h-5 text-pink-600 fill-pink-600" />
              </div>
            </div>

            {/* Remetente & Destinatário Fixos */}
            <div className="flex flex-wrap gap-2 text-xs font-medium text-pink-800 mb-3 bg-pink-300/40 p-2 rounded-lg">
              <span><strong>De:</strong> {cartaPrincipal.remetente}</span>
              <span>•</span>
              <span><strong>Para:</strong> {cartaPrincipal.destinatario}</span>
            </div>

            <h2 className="text-2xl font-bold text-pink-900 mb-3">
              {cartaPrincipal.titulo}
            </h2>

            <p className="line-clamp-[10] text-pink-950 text-base leading-relaxed whitespace-pre-line">
              {cartaPrincipal.conteudo}
            </p>
          </div>

          <span className="text-xs font-semibold text-pink-700 underline text-right pt-2">
            Clique para ler inteira...
          </span>

        </Card>

        {/* --- CARTAS CRIADAS DINAMICAMENTE NO BANCO DE DADOS --- */}
        {cartas.map((carta) => (
          <Card 
            key={carta.id} 
            onClick={() => setCartaExpandida(carta)}
            className="p-6 bg-pink-200 hover:bg-pink-250 transition-all cursor-pointer shadow-lg hover:shadow-xl border-2 border-pink-400 rounded-2xl flex flex-col justify-between gap-4 min-h-[500px] relative group"
          >
            <div>
              <div className="flex justify-between items-center border-b border-pink-300 pb-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-300/60 px-3 py-1 rounded-full flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(carta.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </span>
                
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-pink-600 opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Botão de Favoritar */}
                  <button 
                    onClick={(e) => handleToggleFavorito(e, carta.id)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={carta.favorito ? "Remover dos favoritos" : "Favoritar carta"}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-colors ${
                        carta.favorito 
                          ? 'text-pink-600 fill-pink-600' 
                          : 'text-pink-400 hover:text-pink-600'
                      }`} 
                    />
                  </button>
                </div>
              </div>

              {/* Remetente & Destinatário Dinâmicos */}
              {(carta.remetente || carta.destinatario) && (
                <div className="flex flex-wrap gap-2 text-xs font-medium text-pink-800 mb-3 bg-pink-300/40 p-2 rounded-lg">
                  {carta.remetente && <span><strong>De:</strong> {carta.remetente}</span>}
                  {carta.remetente && carta.destinatario && <span>•</span>}
                  {carta.destinatario && <span><strong>Para:</strong> {carta.destinatario}</span>}
                </div>
              )}

              <h3 className="text-2xl font-bold text-pink-900 mb-3">
                {carta.titulo}
              </h3>

              <p className="line-clamp-[10] text-pink-950 text-base leading-relaxed whitespace-pre-line">
                {carta.conteudo}
              </p>
            </div>

            <span className="text-xs font-semibold text-pink-700 underline text-right pt-2">
              Clique para ler inteira...
            </span>

          </Card>
        ))}

        {/* --- CARD BOTÃO "+ ESCREVER NOVA CARTA" --- */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50/50 transition-all rounded-2xl p-6 min-h-[500px] flex flex-col items-center justify-center gap-3 text-pink-500 hover:text-pink-600 group cursor-pointer"
        >
          <div className="p-4 bg-pink-100 group-hover:bg-pink-200 rounded-full transition-colors">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-semibold text-lg">Escrever Nova Carta</span>
        </button>

      </div>

      {/* --- MODAL DA CARTA EXPANDIDA --- */}
      {cartaExpandida && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={() => setCartaExpandida(null)}
        >
          <Card 
            className="w-full max-w-2xl max-h-[85vh] p-6 sm:p-8 bg-white rounded-3xl shadow-2xl flex flex-col gap-4 relative overflow-hidden animate-in zoom-in-95 duration-200 border-2 border-pink-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button 
              onClick={() => setCartaExpandida(null)}
              className="absolute top-4 right-4 p-2 text-pink-400 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabeçalho do Modal */}
            <div className="border-b border-pink-100 pb-4 pr-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-pink-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(cartaExpandida.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>

                {/* Ícone Favorito no Modal */}
                {cartaExpandida.id !== 0 && (
                  <button 
                    onClick={(e) => handleToggleFavorito(e, cartaExpandida.id)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        cartaExpandida.favorito 
                          ? 'text-pink-500 fill-pink-500' 
                          : 'text-pink-300'
                      }`} 
                    />
                  </button>
                )}
              </div>

              {/* Remetente e Destinatário no Modal */}
              {(cartaExpandida.remetente || cartaExpandida.destinatario) && (
                <div className="inline-flex flex-wrap gap-2 text-xs font-semibold text-pink-700 bg-pink-50 px-3 py-1.5 rounded-lg border border-pink-200 mb-2">
                  {cartaExpandida.remetente && <span>De: {cartaExpandida.remetente}</span>}
                  {cartaExpandida.remetente && cartaExpandida.destinatario && <span>•</span>}
                  {cartaExpandida.destinatario && <span>Para: {cartaExpandida.destinatario}</span>}
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold text-pink-900 mt-1">
                {cartaExpandida.titulo}
              </h2>
            </div>

            {/* Conteúdo Completo com Scroll Integrado */}
            <div className="overflow-y-auto pr-2 text-slate-800 leading-relaxed text-base sm:text-lg whitespace-pre-line space-y-4 max-h-[55vh] scrollbar-thin scrollbar-thumb-pink-300">
              {cartaExpandida.conteudo}
            </div>

            {/* Rodapé do Modal */}
            <div className="pt-4 border-t border-pink-100 flex justify-between items-center text-xs text-pink-400 font-medium">
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                Guardado com amor
              </span>
              <Button 
                onClick={() => setCartaExpandida(null)}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl px-5"
              >
                Fechar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* --- MODAL PARA ESCREVER NOVA CARTA --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-pink-700 flex items-center gap-2">
              <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
              Nova Carta
            </h2>

            <form onSubmit={handleCriarCarta} className="flex flex-col gap-3">
              
              {/* Inputs de Remetente e Destinatário */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-pink-900 mb-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Remetente (De)
                  </label>
                  <input 
                    type="text" 
                    name="remetente" 
                    required 
                    placeholder="Ex: Seu Amor"
                    className="w-full p-2.5 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-pink-900 mb-1 flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Destinatário (Para)
                  </label>
                  <input 
                    type="text" 
                    name="destinatario" 
                    required 
                    placeholder="Ex: Minha Princesa"
                    className="w-full p-2.5 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-pink-900 mb-1">Título</label>
                <input 
                  type="text" 
                  name="titulo" 
                  required 
                  placeholder="Ex: Um motivo para te amar hoje"
                  className="w-full p-2.5 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>

              {/* Conteúdo */}
              <div>
                <label className="block text-xs font-semibold text-pink-900 mb-1">Sua Mensagem</label>
                <textarea 
                  name="conteudo" 
                  required 
                  rows={5}
                  placeholder="Escreva sua carta com todo o amor..."
                  className="w-full p-2.5 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl"
                >
                  {loading ? 'Guardando...' : 'Salvar Carta'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="w-full max-w-2xl mx-auto mt-16 sm:mt-24">
        <Card className="p-6 sm:p-8 bg-white/70 backdrop-blur-md border border-rose-100 rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-xl">
          <div className="bg-rose-100/70 p-4 rounded-full text-rose-500 shrink-0">
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current animate-pulse" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif mb-5">
              momentos não devem apenas ser lembrados, devem ser escritos para ficarem pra sempre gravados, e é isso que eu quero fazer agora, a partir desse ponto começaremos a escrever nossa história, está pronta?
            </p>
            <Link href="/muralMemorias" className="inline-block w-full sm:w-auto">
              <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-2.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md shadow-pink-500/20 w-full sm:w-auto text-xs sm:text-sm">
                <Heart className="w-4 h-4 fill-current" /> Estou pronta!
              </Button>
            </Link>
          </div>
        </Card>
      </footer>

    </div>
  );
}