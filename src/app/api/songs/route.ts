import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("As variáveis do Supabase não estão configuradas.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

// POST: Registra no Prisma um arquivo já enviado diretamente ao Storage.
export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Os dados da música estão inválidos." },
        { status: 400 },
      );
    }
    const { title, artist, path } = body as Record<string, unknown>;

    if (
      typeof title !== "string" ||
      typeof artist !== "string" ||
      typeof path !== "string"
    ) {
      return NextResponse.json(
        { error: "Título, artista e arquivo de áudio são obrigatórios." },
        { status: 400 },
      );
    }

    if (!title.trim() || !artist.trim()) {
      return NextResponse.json(
        { error: "Informe o título e o artista da música." },
        { status: 400 },
      );
    }

    if (title.trim().length > 120 || artist.trim().length > 120) {
      return NextResponse.json(
        { error: "Título e artista devem ter no máximo 120 caracteres." },
        { status: 400 },
      );
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(mp3|wav|m4a|ogg|aac|flac|opus|wma)$/i.test(
        path,
      )
    ) {
      return NextResponse.json(
        { error: "O caminho do arquivo de áudio é inválido." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();
    // O browser envia o arquivo ao Storage; esta rota só grava a faixa no banco.
    const { data: publicUrlData } = supabase.storage
      .from("songs")
      .getPublicUrl(path);

    const audioUrl = publicUrlData.publicUrl;

    // 3. Salvar o registro no Banco de Dados via Prisma
    const song = await prisma.song.create({
      data: {
        title: title.trim(),
        artist: artist.trim(),
        url: audioUrl,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error) {
    console.error("Erro ao enviar música:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar áudio." },
      { status: 500 },
    );
  }
}

// GET: Retorna todas as músicas salvas
export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Erro ao buscar músicas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar músicas." },
      { status: 500 },
    );
  }
}
