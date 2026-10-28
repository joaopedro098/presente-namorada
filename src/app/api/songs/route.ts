import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const maxFileSize = 50 * 1024 * 1024;

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("As variáveis do Supabase não estão configuradas.");
  }

  return createClient(supabaseUrl, supabaseKey);
}

// POST: Envia o áudio e salva os dados no Prisma
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const artist = formData.get("artist");

    if (
      !(file instanceof File) ||
      !title ||
      !artist ||
      typeof title !== "string" ||
      typeof artist !== "string"
    ) {
      return NextResponse.json(
        { error: "Título, artista e arquivo são obrigatórios." },
        { status: 400 },
      );
    }

    if (!title.trim() || !artist.trim()) {
      return NextResponse.json(
        { error: "Informe o título e o artista da música." },
        { status: 400 },
      );
    }

    if (file.size === 0 || !file.type.startsWith("audio/")) {
      return NextResponse.json(
        { error: "Escolha um arquivo de áudio válido." },
        { status: 400 },
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "O arquivo deve ter no máximo 50 MB." },
        { status: 413 },
      );
    }

    // Converter arquivo para Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const supabase = getSupabaseClient();

    // Formatar nome de arquivo seguro
    const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${randomUUID()}-${safeOriginalName}`;

    // 1. Upload para o Supabase Storage (no Bucket 'songs')
    const { error: uploadError } = await supabase.storage
      .from("songs")
      .upload(filename, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: `Erro no upload: ${uploadError.message}. Verifique as permissões de RLS do Bucket.`,
        },
        { status: 400 },
      );
    }

    // 2. Pegar a URL pública do áudio no Supabase
    const { data: publicUrlData } = supabase.storage
      .from("songs")
      .getPublicUrl(filename);

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
