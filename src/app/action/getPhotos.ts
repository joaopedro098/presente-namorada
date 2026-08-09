"use server"

import { prisma } from "../../../lib/prisma" // Ajuste o caminho conforme seu projeto
import { revalidatePath } from "next/cache"

// 1. Action de Salvar
export async function salvarFotoNoBanco(formData: FormData) {
  try {
    const titulo = formData.get("titulo") as string
    const descricao = formData.get("descricao") as string
    const imageUrl = formData.get("imageUrl") as string
    const dataFoto = formData.get("dataFoto") as string

    if (!imageUrl) {
      throw new Error("A URL da imagem é obrigatória.")
    }

    await prisma.fotos.create({
      data: {
        titulo: titulo || null,
        descricao: descricao || null,
        imageUrl: imageUrl,
        dataFoto: dataFoto || null,
      },
    })

    revalidatePath("/muralMemorias") 
  } catch (error) {
    console.error("Erro ao salvar no banco:", error)
    throw new Error("Não foi possível registrar o momento.")
  }
}

// 2. Action para listar as fotos
export async function listarFotosNoBanco() {
  try {
    const fotos = await prisma.fotos.findMany({
      orderBy: {
        id: "desc"
      }
    })
    return fotos
  } catch (error) {
    console.error("Erro ao listar fotos do banco:", error)
    return []
  }
}

// 3. Action de Favoritar
export async function favoritarFotoNoBanco(id: string | number, estadoAtual: boolean) {
  try {
    // SE O SEU ID NO PRIMA FOR String (UUID/CUID): use String(id)
    // SE O SEU ID NO PRIMA FOR Int (@id @default(autoincrement())): use Number(id)
    const targetId = typeof id === "number" ? id : Number(id) || String(id)

    await prisma.fotos.update({
      where: { 
        id: targetId as any
      },
      data: {
        favorito: !estadoAtual
      }
    })

    revalidatePath("/muralMemorias")
  } catch (error) {
    console.error("Erro ao favoritar foto:", error)
    throw new Error("Não foi possível favoritar a foto.")
  }
}