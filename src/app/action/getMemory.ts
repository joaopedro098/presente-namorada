"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";

export async function criarMemoria(formData: FormData) {
  // 1. Captura os dados enviados pelo formulário
  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;

  if (!titulo || !descricao) {
    return { success: false, error: "Todos os campos são obrigatórios!" };
  }

  try {
    // 2. Salva no banco de dados usando o Prisma
    await prisma.memorias.create({
      data: {
        titulo,
        descricao,
      },
    });

    revalidatePath("/"); 
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar memória:", error);
    return { success: false, error: "Erro ao salvar no banco de dados." };
  }
}

// Busca todas as memórias salvas no banco
export async function listarMemorias() {
  try {
    const memorias = await prisma.memorias.findMany({
      orderBy: {
        id: "desc", // Mostra as mais recentes primeiro
      },
    });
    return memorias;
  } catch (error) {
    console.error("Erro ao buscar memórias:", error);
    return [];
  }
}

// Alterna o estado de favorito de uma memória (true <-> false)
export async function toggleFavoritoMemoria(id: number, estadoAtual: boolean) {
  try {
    await prisma.memorias.update({
      where: { id },
      data: {
        favorito: !estadoAtual,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Erro ao alternar favorito da memória:", error);
    return { success: false, error: "Erro ao favoritar no banco de dados." };
  }
}