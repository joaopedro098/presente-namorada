"use client";

import {
  Clock,
  Heart,
  HouseHeart,
  Image as ImageIcon,
  Mail,
  Menu,
  Music2,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/carta", label: "Carta", icon: Mail },
  { href: "/galeria", label: "Galeria", icon: ImageIcon },
  { href: "/muralMemorias", label: "Mural de Memórias", icon: Sparkles },
  { href: "/contagem", label: "Contagem", icon: Clock },
  { href: "/favoritos", label: "Favoritos", icon: HouseHeart },
  { href: "/musicas", label: "Músicas", icon: Music2 },
];

const linkClassName =
  "flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-pink-200/60 bg-gradient-to-r from-rose-100 via-pink-50 to-rose-100 shadow-sm">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-pink-700"
          aria-label="Nossas memórias, início"
          onClick={() => setMenuOpen(false)}
        >
          <Heart className="h-6 w-6 shrink-0 animate-pulse fill-pink-500 text-pink-500" />
          <span className="truncate text-sm font-semibold sm:text-base">
            Nossas memórias
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-2 xl:flex"
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={linkClassName}>
              <Icon
                className="h-4 w-4 shrink-0 text-pink-100"
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-pink-700 transition hover:bg-pink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 xl:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navegação principal"
          className="grid grid-cols-1 gap-2 border-t border-pink-200/60 px-4 py-3 sm:grid-cols-2 xl:hidden"
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={linkClassName}
              onClick={() => setMenuOpen(false)}
            >
              <Icon
                className="h-4 w-4 shrink-0 text-pink-100"
                aria-hidden="true"
              />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
