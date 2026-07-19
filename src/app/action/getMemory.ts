"use server"

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma"; // Duplo ponto e vírgula removido daqui

export async function criarMemoria(formData: FormData) {
  // 1. Captura os dados enviados pelo formulário
  const titulo = formData.get("titulo") as string;
  const descricao = formData.get("descricao") as string;

  // AJUSTE 1: Evite usar `throw new Error` diretamente aqui se quiser que o catch capture de forma amigável
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

    // AJUSTE 2: Certifique-se de que o caminho aqui corresponde à rota exata onde o mural está renderizado.
    // Se o seu mural fica na página inicial, use "/". Se fica em /mural, use "/mural".
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


