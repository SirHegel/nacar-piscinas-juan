"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CloseIcon, MenuIcon } from "./Icons";
import type { ModuleKey } from "@/lib/admin-model";

const links = [
  { href: "#experiencia", label: "La experiencia", module: "experience" },
  { href: "#sistema", label: "El sistema", module: "system" },
  { href: "#proceso", label: "Proceso", module: "process" },
  { href: "#preguntas", label: "Preguntas", module: "faq" },
];

export default function Header({
  brand,
  modules,
  primaryHref = "#diagnostico",
}: {
  brand: { name: string; descriptor: string };
  modules: Record<ModuleKey, boolean>;
  primaryHref?: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="nav-shell">
        <a className="brand" href="#inicio" aria-label="Nácar, ir al inicio" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>{brand.name}</strong>
            <small>{brand.descriptor}</small>
          </span>
        </a>

        <nav className={`desktop-nav${open ? " is-open" : ""}`} aria-label="Navegación principal">
          {links.filter((link) => modules[link.module as ModuleKey]).map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a className="nav-mobile-cta" href={primaryHref} onClick={() => setOpen(false)}>
            Solicitar diagnóstico <ArrowUpRight />
          </a>
        </nav>

        <a className="nav-cta" href={primaryHref}>
          Diagnóstico privado <ArrowUpRight />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
