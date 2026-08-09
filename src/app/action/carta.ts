'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../../lib/prisma'; // Certifique-se de que o caminho do prisma está correto

// Buscar todas as cartas salvas no banco
export async function getCartas() {
  try {
    const cartas = await prisma.carta.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data: cartas };
  } catch (error) {
    console.error('Erro ao buscar cartas:', error);
    return { success: false, data: [] };
  }
}

// Criar uma nova carta no banco de dados
export async function criarCarta(formData: FormData) {
  const titulo = formData.get('titulo') as string;
  const conteudo = formData.get('conteudo') as string;
  const remetente = formData.get('remetente') as string;
  const destinatario = formData.get('destinatario') as string;

  if (!titulo || !conteudo || !remetente || !destinatario) {
    return { 
      success: false, 
      error: 'Título, conteúdo, remetente e destinatário são obrigatórios.' 
    };
  }

  try {
    const novaCarta = await prisma.carta.create({
      data: {
        titulo,
        conteudo,
        remetente,
        destinatario,
      },
    });

    // Revalida a página para atualizar os dados em tempo real
    revalidatePath('/cartas');
    return { success: true, data: novaCarta };
  } catch (error) {
    console.error('Erro ao criar carta:', error);
    return { success: false, error: 'Erro ao salvar a carta no banco.' };
  }
}

// Alternar o status de favorito de uma carta no banco de dados
export async function toggleFavoritoCarta(id: number) {
  try {
    // 1. Busca a carta atual para saber o estado do campo favorito
    const cartaAtual = await prisma.carta.findUnique({
      where: { id },
    });

    if (!cartaAtual) {
      return { success: false, error: 'Carta não encontrada.' };
    }

    // 2. Atualiza invertendo o valor booleano
    const cartaAtualizada = await prisma.carta.update({
      where: { id },
      data: {
        favorito: !cartaAtual.favorito,
      },
    });

    revalidatePath('/cartas');
    return { success: true, data: cartaAtualizada };
  } catch (error) {
    console.error('Erro ao alternar favorito da carta:', error);
    return { success: false, error: 'Erro ao favoritar a carta.' };
  }
}