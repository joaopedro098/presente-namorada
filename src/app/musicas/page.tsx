"use client";

import { createClient } from "@supabase/supabase-js";
import { Heart, Loader2, Music, Music2, Upload, User } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

const maxFileSize = 50 * 1024 * 1024;
const allowedAudioExtensions = [
  "mp3",
  "wav",
  "m4a",
  "ogg",
  "aac",
  "flac",
  "opus",
  "wma",
];

export default function MusicasPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadSongs = useCallback(async () => {
    try {
      const response = await fetch("/api/songs");
      if (!response.ok)
        throw new Error("Não foi possível carregar a playlist.");
      const data: unknown = await response.json();
      if (Array.isArray(data)) setSongs(data as Song[]);
    } catch (loadError) {
      console.error("Erro ao carregar músicas:", loadError);
      setError(
        "Não foi possível carregar a playlist. Tente atualizar a página.",
      );
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    void loadSongs();
  }, [loadSongs]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      setError("Escolha um arquivo de áudio para continuar.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!allowedAudioExtensions.includes(extension)) {
      setError("Escolha um arquivo de áudio válido, como MP3, WAV ou M4A.");
      return;
    }

    if (file.size > maxFileSize) {
      setError("No plano gratuito, o arquivo precisa ter no máximo 50 MB.");
      return;
    }

    setLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) {
        throw new Error(
          "A configuração de armazenamento de músicas está incompleta.",
        );
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const storagePath = `${crypto.randomUUID()}.${extension || "mp3"}`;
      const { error: uploadError } = await supabase.storage
        .from("songs")
        .upload(storagePath, file, {
          contentType: file.type || `audio/${extension}`,
          upsert: false,
        });

      if (uploadError) {
        const uploadMessage = uploadError.message.toLowerCase();
        if (
          uploadMessage.includes("too large") ||
          uploadMessage.includes("limit") ||
          uploadMessage.includes("exceed") ||
          uploadMessage.includes("413")
        ) {
          throw new Error(
            "O Supabase recusou o arquivo por tamanho. No plano gratuito, ele deve ter até 50 MB; confira também o limite do bucket songs.",
          );
        }
        if (
          uploadMessage.includes("storage") ||
          uploadMessage.includes("quota") ||
          uploadMessage.includes("space")
        ) {
          throw new Error(
            "O armazenamento do Supabase está sem espaço. O limite por arquivo é 50 MB, mas pode ser necessário liberar espaço excluindo arquivos antigos.",
          );
        }
        throw new Error(
          `Não foi possível enviar o arquivo ao Supabase: ${uploadError.message}`,
        );
      }

      const response = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.get("title"),
          artist: formData.get("artist"),
          path: storagePath,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Não foi possível enviar a música.");

      form.reset();
      setSuccess(true);
      await loadSongs();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Falha ao conectar com o servidor.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-pink-50 to-amber-50 px-4 py-10 text-slate-800 sm:px-8 sm:py-14">
      <div className="pointer-events-none absolute -left-16 top-24 h-72 w-72 rounded-full bg-pink-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-12 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />

      <div className="relative mx-auto max-w-6xl space-y-10">
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <div className="mb-2 inline-flex items-center justify-center rounded-full border border-pink-200/70 bg-white/70 p-3 text-rose-500 shadow-sm">
            <Music2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Nossa trilha sonora
          </h1>
          <p className="mx-auto max-w-lg text-sm leading-relaxed text-rose-800/75 sm:text-base">
            Guarde aqui as músicas que fazem parte da nossa história e ouça
            quando quiser.
          </p>
        </header>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Card className="border-pink-200/70 bg-white/85 shadow-xl shadow-rose-900/5 backdrop-blur-sm">
            <CardHeader className="border-b border-pink-100/80 pb-4">
              <CardTitle className="flex items-center gap-2 font-serif text-xl text-rose-950">
                <span className="rounded-full bg-pink-100 p-2 text-rose-500">
                  <Upload className="h-4 w-4" aria-hidden="true" />
                </span>
                Adicionar música
              </CardTitle>
              <CardDescription className="text-rose-800/70">
                Escolha um áudio do seu dispositivo para incluir na playlist.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-rose-900">
                    Nome da música
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Ex.: Nossa canção"
                    required
                    maxLength={120}
                    className="h-11 rounded-xl border-pink-200 bg-white focus-visible:border-rose-400 focus-visible:ring-rose-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist" className="text-rose-900">
                    Artista
                  </Label>
                  <Input
                    id="artist"
                    name="artist"
                    placeholder="Ex.: Nome do artista"
                    required
                    maxLength={120}
                    className="h-11 rounded-xl border-pink-200 bg-white focus-visible:border-rose-400 focus-visible:ring-rose-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file" className="text-rose-900">
                    Arquivo de áudio
                  </Label>
                  <Input
                    id="file"
                    name="file"
                    type="file"
                    accept=".mp3,.wav,.m4a,.ogg,.aac,.flac,.opus,.wma,audio/*"
                    required
                    className="h-auto min-h-11 cursor-pointer rounded-xl border-pink-200 bg-white py-2 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-100 file:px-3 file:py-1 file:font-semibold file:text-rose-700 hover:file:bg-pink-200"
                  />
                  <p className="text-xs text-rose-700/65">
                    MP3, WAV, M4A ou outro formato de áudio · até 50 MB
                  </p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
                  >
                    {error}
                  </p>
                )}
                {success && (
                  <output className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                    Música adicionada à playlist. 💗
                  </output>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 font-semibold text-white shadow-md shadow-pink-500/20 transition hover:from-pink-600 hover:to-rose-600 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando música...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Adicionar à playlist
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <section aria-labelledby="playlist-title" className="space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200/70 pb-3">
              <h2
                id="playlist-title"
                className="flex items-center gap-2 font-serif text-2xl font-bold text-rose-950"
              >
                <Heart
                  className="h-5 w-5 fill-rose-500 text-rose-500"
                  aria-hidden="true"
                />{" "}
                Playlist
              </h2>
              <Badge className="rounded-full border border-pink-200 bg-white/80 px-3 text-rose-700">
                {songs.length} {songs.length === 1 ? "música" : "músicas"}
              </Badge>
            </div>

            {fetching ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-pink-100 bg-white/60 p-12 text-rose-500">
                <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
                <p className="text-sm text-rose-800/70">
                  Carregando playlist...
                </p>
              </div>
            ) : songs.length === 0 ? (
              <Card className="border-2 border-dashed border-pink-200 bg-white/50 p-8 text-center shadow-none">
                <Music
                  className="mx-auto mb-3 h-10 w-10 text-pink-300"
                  aria-hidden="true"
                />
                <p className="font-medium text-rose-900">
                  Sua playlist está esperando a primeira música.
                </p>
                <p className="mt-1 text-sm text-rose-700/65">
                  Adicione uma canção especial pelo formulário.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {songs.map((song) => (
                  <Card
                    key={song.id}
                    className="border-pink-100 bg-white/85 shadow-sm transition hover:border-pink-200 hover:shadow-md"
                  >
                    <CardContent className="space-y-3 p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white shadow-sm">
                          <Music2 className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-rose-950">
                            {song.title}
                          </h3>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-rose-700/65">
                            <User className="h-3.5 w-3.5" aria-hidden="true" />
                            {song.artist}
                          </p>
                        </div>
                      </div>
                      {/* biome-ignore lint/a11y/useMediaCaption: This player is for music, not spoken dialogue. */}
                      <audio
                        controls
                        preload="none"
                        src={song.url}
                        className="h-10 w-full accent-rose-500"
                      >
                        Seu navegador não oferece suporte à reprodução de áudio.
                      </audio>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
