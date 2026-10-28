import FavoritosView from "@/components/favoritos-view";
import { prisma } from "../../../lib/prisma";

export default async function FavoritosPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || "fotos";

  const [fotos, memorias, cartas] = await Promise.all([
    prisma.fotos.findMany({
      where: { favorito: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.memorias.findMany({
      where: { favorito: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.carta.findMany({
      where: { favorito: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <FavoritosView
      activeTab={activeTab}
      fotos={fotos.map((foto) => ({
        ...foto,
        datafoto: foto.datafoto?.toISOString() ?? null,
      }))}
      memorias={memorias.map((memoria) => ({
        ...memoria,
        createdAt: memoria.createdAt.toISOString(),
      }))}
      cartas={cartas.map((carta) => ({
        ...carta,
        createdAt: carta.createdAt.toISOString(),
      }))}
    />
  );
}
