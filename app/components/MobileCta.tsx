"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "./Icons";

export default function MobileCta({ href = "#diagnostico", label = "Evaluar mi piscina" }: { href?: string; label?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("#inicio");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a className={`mobile-sticky-cta${visible ? " is-visible" : ""}`} href={href}>
      {label} <ArrowUpRight />
    </a>
  );
}
