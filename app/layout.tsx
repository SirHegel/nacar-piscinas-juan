import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

function getMetadataBase() {
  const configured = process.env.SITE_URL?.trim();
  const vercelHostname = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const candidate = configured || (vercelHostname ? `https://${vercelHostname}` : "http://localhost:3000");

  try {
    const url = new URL(/^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Unsupported protocol");
    return url;
  } catch {
    return new URL("http://localhost:3000");
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "NÁCAR | Piscinas minerales de magnesio por Juan",
    template: "%s | NÁCAR",
  },
  description:
    "Sistemas premium de tratamiento mineral con magnesio para piscinas. Diagnóstico, diseño, instalación y acompañamiento personalizado por Juan.",
  keywords: [
    "piscinas de magnesio",
    "sistema mineral para piscinas",
    "tratamiento de piscina premium",
    "piscina mineral",
    "Juan sistemas de magnesio",
  ],
  openGraph: {
    title: "NÁCAR — Tu piscina, convertida en una experiencia mineral",
    description:
      "Diagnóstico e instalación de sistemas minerales con magnesio para piscinas excepcionales.",
    type: "website",
    locale: "es_CO",
    images: [
      {
        url: "/images/hero-piscina-mineral.png",
        width: 1672,
        height: 941,
        alt: "Piscina residencial contemporánea con agua cristalina al atardecer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NÁCAR — Sistemas minerales por Juan",
    description: "Una experiencia de agua diseñada para tu piscina.",
    images: ["/images/hero-piscina-mineral.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071512",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${manrope.variable} ${newsreader.variable}`}>
      <body>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        {children}
      </body>
    </html>
  );
}
