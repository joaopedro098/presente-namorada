"use server"

import { prisma } from "../../../lib/prisma" // Ajuste o caminho da sua instância do Prisma
import { revalidatePath } from "next/cache"

// 1. Sua Action de Salvar (Atualizada)
export async function salvarFotoNoBanco(formData: FormData) {
  try {
    const titulo = formData.get("titulo") as string
    const descricao = formData.get("descricao") as string
    const imageUrl = formData.get("imageUrl") as string

    if (!imageUrl) {
      throw new Error("A URL da imagem é obrigatória.")
    }

    await prisma.fotos.create({
      data: {
        titulo: titulo || null,
        descricao: descricao || null,
        imageUrl: imageUrl,
      },
    })

    revalidatePath("/muralMemorias") 
  } catch (error) {
    console.error("Erro ao salvar no banco:", error)
    throw new Error("Não foi possível registrar o momento.")
  }
}

// 2. NOVA ACTION: Adicione esta função para buscar as fotos do banco
export async function listarFotosNoBanco() {
  try {
    const fotos = await prisma.fotos.findMany({
      orderBy: {
        id: "desc" // Traz as fotos mais recentes primeiro
      }
    })
    return fotos
  } catch (error) {
    console.error("Erro ao listar fotos do banco:", error)
    return []
  }
}