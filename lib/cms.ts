import "server-only";
import { get, list, put } from "@vercel/blob";
import { moduleKeys } from "@/lib/admin-model";
import type { ModuleKey } from "@/lib/admin-model";

export { moduleKeys } from "@/lib/admin-model";
export type { ModuleKey } from "@/lib/admin-model";

const CURRENT_CONTENT_PATH = "cms/content/current.json";

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

export type ContentCard = {
  title: string;
  text: string;
};

export type SiteContent = {
  version: 1;
  updatedAt: string;
  brand: {
    name: string;
    descriptor: string;
    owner: string;
  };
  seo: {
    title: string;
    description: string;
  };
  contact: {
    whatsapp: string;
    email: string;
  };
  modules: Record<ModuleKey, boolean>;
  hero: {
    eyebrow: string;
    title: string;
    emphasis: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    imagePath: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    accent: string;
    body: string;
    statement: string;
    cards: ContentCard[];
  };
  system: {
    eyebrow: string;
    title: string;
    body: string;
    specTitle: string;
  };
  approach: {
    eyebrow: string;
    title: string;
    body: string;
  };
  process: {
    eyebrow: string;
    title: string;
    body: string;
    items: ContentCard[];
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    quote: string;
  };
  fit: {
    eyebrow: string;
    title: string;
    body: string;
    cards: ContentCard[];
  };
  diagnostic: {
    eyebrow: string;
    title: string;
    body: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    body: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export const defaultSiteContent: SiteContent = {
  version: 1,
  updatedAt: "2026-08-22T00:00:00.000Z",
  brand: {
    name: "NÁCAR",
    descriptor: "Sistemas minerales",
    owner: "Juan",
  },
  seo: {
    title: "NÁCAR | Piscinas minerales de magnesio por Juan",
    description:
      "Sistemas premium de tratamiento mineral con magnesio para piscinas. Diagnóstico, diseño, instalación y acompañamiento personalizado por Juan.",
  },
  contact: {
    whatsapp: "",
    email: "",
  },
  modules: {
    experience: true,
    system: true,
    approach: true,
    process: true,
    about: true,
    fit: true,
    diagnostic: true,
    faq: true,
    finalCta: true,
  },
  hero: {
    eyebrow: "Sistemas minerales de magnesio · por Juan",
    title: "Tu piscina, convertida en una",
    emphasis: "experiencia mineral.",
    lead:
      "Diseñamos e instalamos sistemas de tratamiento con minerales de magnesio para piscinas que exigen agua excepcional, integración impecable y atención experta.",
    primaryCta: "Solicitar diagnóstico",
    secondaryCta: "Conocer el sistema",
    imagePath: "/images/hero-piscina-mineral.png",
  },
  experience: {
    eyebrow: "La diferencia se siente",
    title: "Una piscina excepcional no empieza en el revestimiento.",
    accent: "Empieza en el agua.",
    body:
      "NÁCAR transforma el tratamiento técnico en una experiencia coherente con el nivel de tu propiedad: serena, cuidada y diseñada para disfrutarse.",
    statement:
      "No vendemos minerales por separado. Diseñamos la relación completa entre agua, tecnología y servicio.",
    cards: [
      {
        title: "Sensación mineral",
        text: "Una experiencia de baño que prioriza el tacto del agua, su equilibrio y el placer de permanecer en ella.",
      },
      {
        title: "Claridad que se nota",
        text: "Filtración y calibración pensadas para sostener una apariencia limpia, serena y visualmente excepcional.",
      },
      {
        title: "Control sin improvisar",
        text: "Una configuración proporcionada al volumen, uso, entorno y equipamiento real de cada piscina.",
      },
    ],
  },
  system: {
    eyebrow: "Ingeniería mineral",
    title: "El sistema correcto es el que encaja con todo lo demás.",
    body:
      "La formulación mineral es solo una parte. Para que la experiencia sea consistente, Juan estudia el circuito completo y define una arquitectura proporcionada al proyecto.",
    specTitle: "Una arquitectura, cuatro decisiones.",
  },
  approach: {
    eyebrow: "Servicio high-touch",
    title: "El lujo está en no tener que coordinarlo todo.",
    body:
      "Un solo responsable, una visión completa y decisiones explicadas antes de intervenir tu piscina.",
  },
  process: {
    eyebrow: "El método de Juan",
    title: "De una buena conversación a un sistema bien resuelto.",
    body:
      "El proceso reduce incertidumbre: primero entendemos, luego diseñamos y solo entonces instalamos.",
    items: [
      {
        title: "Conversación privada",
        text: "Entendemos la piscina, el proyecto y la experiencia que quieres conseguir.",
      },
      {
        title: "Diagnóstico técnico",
        text: "Revisamos agua, volumen, hidráulica, equipos existentes, uso y espacio disponible.",
      },
      {
        title: "Propuesta a medida",
        text: "Recibes una arquitectura de sistema, alcance, inversión y plan de implementación claros.",
      },
      {
        title: "Instalación y puesta a punto",
        text: "Coordinamos la integración, calibramos el conjunto y dejamos definido el seguimiento.",
      },
    ],
  },
  about: {
    eyebrow: "Detrás de NÁCAR",
    title: "Un único responsable. De la primera pregunta a la última calibración.",
    body:
      "Juan acompaña personalmente el diagnóstico y la definición de cada sistema. Su trabajo no empieza ofreciendo un equipo: empieza escuchando cómo se usa la piscina, qué no funciona hoy y qué nivel de experiencia espera el cliente.",
    quote:
      "La mejor tecnología es la que se siente en el agua y desaparece de tus preocupaciones.",
  },
  fit: {
    eyebrow: "Proyectos seleccionados",
    title: "¿NÁCAR encaja con tu piscina?",
    body:
      "Es una solución para quienes valoran la experiencia completa, no solo la compra de un equipo.",
    cards: [
      {
        title: "Residencias privadas",
        text: "Para propietarios que quieren elevar una piscina existente o integrar el sistema en una nueva casa.",
      },
      {
        title: "Hoteles & wellness",
        text: "Para espacios donde el agua forma parte central de la percepción, el servicio y la identidad del lugar.",
      },
      {
        title: "Arquitectos & desarrolladores",
        text: "Para equipos que necesitan coordinar la solución técnica desde el diseño y evitar improvisaciones en obra.",
      },
    ],
  },
  diagnostic: {
    eyebrow: "Diagnóstico privado",
    title: "El primer paso es entender tu agua.",
    body:
      "Cuéntanos lo esencial. Juan revisará tu caso y te contactará para confirmar si una solución NÁCAR tiene sentido para el proyecto.",
  },
  faq: {
    eyebrow: "Antes de decidir",
    title: "Preguntas honestas. Respuestas claras.",
    body: "Si tu pregunta no está aquí, escríbele directamente a Juan.",
    items: [
      {
        question: "¿Qué es exactamente una piscina mineral de magnesio?",
        answer:
          "Es una piscina cuyo tratamiento incorpora una formulación mineral rica en magnesio dentro de una arquitectura compatible de filtración, control y desinfección. No existe una configuración universal: el diseño depende del agua, el volumen, los equipos y la normativa aplicable.",
      },
      {
        question: "¿Puedo convertir una piscina que ya existe?",
        answer:
          "En muchos casos, sí. Antes de confirmarlo, Juan revisa el sistema hidráulico, el vaso, los equipos instalados, el estado del agua y el espacio técnico para determinar qué se conserva, qué se ajusta y qué conviene sustituir.",
      },
      {
        question: "¿El magnesio elimina por completo otros tratamientos?",
        answer:
          "No debe asumirse de forma automática. La solución mineral trabaja como parte de un sistema completo y su compatibilidad con desinfección, filtración y control se define para cada proyecto. NÁCAR no promete una piscina “sin químicos” sin respaldo técnico específico.",
      },
      {
        question: "¿Qué mantenimiento necesita?",
        answer:
          "Depende de la configuración, el uso, la exposición ambiental y la calidad del agua de aporte. La propuesta incluye las tareas, revisiones y consumibles previstos para que conozcas el cuidado antes de decidir.",
      },
      {
        question: "¿Cuánto cuesta un sistema NÁCAR?",
        answer:
          "Cada inversión se calcula después del diagnóstico. Una conversión de piscina existente, una obra nueva y un proyecto hotelero tienen alcances distintos; por eso Juan presenta una propuesta cerrada y explicada, no un precio genérico que después cambia.",
      },
      {
        question: "¿Ofrece beneficios médicos o terapéuticos?",
        answer:
          "NÁCAR presenta el sistema como una experiencia de agua y una solución técnica para piscinas; no realiza afirmaciones de diagnóstico, tratamiento, cura o prevención. Cualquier decisión relacionada con salud debe consultarse con un profesional cualificado.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Tu próxima experiencia de agua",
    title: "Una piscina distinta empieza con una conversación.",
    primaryCta: "Solicitar diagnóstico",
    secondaryCta: "Hablar con Juan",
  },
};

function safeString(value: unknown, fallback: string, max = 1200) {
  return typeof value === "string" ? value.trim().slice(0, max) : fallback;
}

function safeCards(value: unknown, fallback: ContentCard[], maxItems: number) {
  if (!Array.isArray(value)) return fallback;
  return value.slice(0, maxItems).map((item, index) => {
    const source = typeof item === "object" && item ? (item as Record<string, unknown>) : {};
    const base = fallback[index] || { title: "Nuevo módulo", text: "" };
    return {
      title: safeString(source.title, base.title, 140),
      text: safeString(source.text, base.text, 700),
    };
  });
}

export function normalizeSiteContent(input: unknown): SiteContent {
  const source = typeof input === "object" && input ? (input as Record<string, unknown>) : {};
  const getGroup = (key: string) =>
    typeof source[key] === "object" && source[key] ? (source[key] as Record<string, unknown>) : {};
  const brand = getGroup("brand");
  const seo = getGroup("seo");
  const contact = getGroup("contact");
  const modules = getGroup("modules");
  const hero = getGroup("hero");
  const experience = getGroup("experience");
  const system = getGroup("system");
  const approach = getGroup("approach");
  const process = getGroup("process");
  const about = getGroup("about");
  const fit = getGroup("fit");
  const diagnostic = getGroup("diagnostic");
  const faq = getGroup("faq");
  const finalCta = getGroup("finalCta");

  const normalizedModules = Object.fromEntries(
    moduleKeys.map((key) => [key, typeof modules[key] === "boolean" ? modules[key] : defaultSiteContent.modules[key]]),
  ) as Record<ModuleKey, boolean>;

  const faqItems = Array.isArray(faq.items)
    ? faq.items.slice(0, 12).map((item, index) => {
        const row = typeof item === "object" && item ? (item as Record<string, unknown>) : {};
        const base = defaultSiteContent.faq.items[index] || { question: "Nueva pregunta", answer: "" };
        return {
          question: safeString(row.question, base.question, 220),
          answer: safeString(row.answer, base.answer, 1500),
        };
      })
    : defaultSiteContent.faq.items;

  return {
    version: 1,
    updatedAt: safeString(source.updatedAt, defaultSiteContent.updatedAt, 50),
    brand: {
      name: safeString(brand.name, defaultSiteContent.brand.name, 40),
      descriptor: safeString(brand.descriptor, defaultSiteContent.brand.descriptor, 80),
      owner: safeString(brand.owner, defaultSiteContent.brand.owner, 80),
    },
    seo: {
      title: safeString(seo.title, defaultSiteContent.seo.title, 90),
      description: safeString(seo.description, defaultSiteContent.seo.description, 180),
    },
    contact: {
      whatsapp: safeString(contact.whatsapp, "", 30).replace(/\D/g, ""),
      email: safeString(contact.email, "", 160),
    },
    modules: normalizedModules,
    hero: {
      eyebrow: safeString(hero.eyebrow, defaultSiteContent.hero.eyebrow, 140),
      title: safeString(hero.title, defaultSiteContent.hero.title, 180),
      emphasis: safeString(hero.emphasis, defaultSiteContent.hero.emphasis, 120),
      lead: safeString(hero.lead, defaultSiteContent.hero.lead, 600),
      primaryCta: safeString(hero.primaryCta, defaultSiteContent.hero.primaryCta, 60),
      secondaryCta: safeString(hero.secondaryCta, defaultSiteContent.hero.secondaryCta, 60),
      imagePath: safeString(hero.imagePath, defaultSiteContent.hero.imagePath, 500),
    },
    experience: {
      eyebrow: safeString(experience.eyebrow, defaultSiteContent.experience.eyebrow, 100),
      title: safeString(experience.title, defaultSiteContent.experience.title, 240),
      accent: safeString(experience.accent, defaultSiteContent.experience.accent, 100),
      body: safeString(experience.body, defaultSiteContent.experience.body, 700),
      statement: safeString(experience.statement, defaultSiteContent.experience.statement, 500),
      cards: safeCards(experience.cards, defaultSiteContent.experience.cards, 3),
    },
    system: {
      eyebrow: safeString(system.eyebrow, defaultSiteContent.system.eyebrow, 100),
      title: safeString(system.title, defaultSiteContent.system.title, 240),
      body: safeString(system.body, defaultSiteContent.system.body, 700),
      specTitle: safeString(system.specTitle, defaultSiteContent.system.specTitle, 180),
    },
    approach: {
      eyebrow: safeString(approach.eyebrow, defaultSiteContent.approach.eyebrow, 100),
      title: safeString(approach.title, defaultSiteContent.approach.title, 240),
      body: safeString(approach.body, defaultSiteContent.approach.body, 600),
    },
    process: {
      eyebrow: safeString(process.eyebrow, defaultSiteContent.process.eyebrow, 100),
      title: safeString(process.title, defaultSiteContent.process.title, 240),
      body: safeString(process.body, defaultSiteContent.process.body, 600),
      items: safeCards(process.items, defaultSiteContent.process.items, 6),
    },
    about: {
      eyebrow: safeString(about.eyebrow, defaultSiteContent.about.eyebrow, 100),
      title: safeString(about.title, defaultSiteContent.about.title, 240),
      body: safeString(about.body, defaultSiteContent.about.body, 900),
      quote: safeString(about.quote, defaultSiteContent.about.quote, 500),
    },
    fit: {
      eyebrow: safeString(fit.eyebrow, defaultSiteContent.fit.eyebrow, 100),
      title: safeString(fit.title, defaultSiteContent.fit.title, 200),
      body: safeString(fit.body, defaultSiteContent.fit.body, 600),
      cards: safeCards(fit.cards, defaultSiteContent.fit.cards, 3),
    },
    diagnostic: {
      eyebrow: safeString(diagnostic.eyebrow, defaultSiteContent.diagnostic.eyebrow, 100),
      title: safeString(diagnostic.title, defaultSiteContent.diagnostic.title, 200),
      body: safeString(diagnostic.body, defaultSiteContent.diagnostic.body, 600),
    },
    faq: {
      eyebrow: safeString(faq.eyebrow, defaultSiteContent.faq.eyebrow, 100),
      title: safeString(faq.title, defaultSiteContent.faq.title, 200),
      body: safeString(faq.body, defaultSiteContent.faq.body, 500),
      items: faqItems,
    },
    finalCta: {
      eyebrow: safeString(finalCta.eyebrow, defaultSiteContent.finalCta.eyebrow, 100),
      title: safeString(finalCta.title, defaultSiteContent.finalCta.title, 220),
      primaryCta: safeString(finalCta.primaryCta, defaultSiteContent.finalCta.primaryCta, 60),
      secondaryCta: safeString(finalCta.secondaryCta, defaultSiteContent.finalCta.secondaryCta, 60),
    },
  };
}

async function readJson<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return (await new Response(result.stream).json()) as T;
}

async function listAll(pathPrefix: string) {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix: pathPrefix, limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return blobs;
}

function validateContent(content: SiteContent) {
  if (!content.brand.name || !content.brand.owner) {
    throw new ContentValidationError("Completa el nombre de la marca y del propietario.");
  }
  if (!content.hero.title && !content.hero.emphasis) {
    throw new ContentValidationError("El hero necesita un título principal.");
  }
  const validImage =
    /^\/images\/[a-zA-Z0-9/_-]+\.(png|jpe?g|webp|avif)$/i.test(content.hero.imagePath) ||
    /^\/api\/media\/media\/hero\/[a-zA-Z0-9._-]+$/i.test(content.hero.imagePath);
  if (!validImage) {
    throw new ContentValidationError("Selecciona una imagen válida desde el editor de portada.");
  }
  if (!content.modules.diagnostic && content.contact.whatsapp.length < 8) {
    throw new ContentValidationError(
      "Activa el módulo de diagnóstico o configura un WhatsApp para no dejar los botones sin destino.",
    );
  }
  if (content.contact.email && !/^\S+@\S+\.\S+$/.test(content.contact.email)) {
    throw new ContentValidationError("Revisa el correo comercial antes de publicar.");
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const current = await readJson<SiteContent>(CURRENT_CONTENT_PATH);
    if (current) return normalizeSiteContent(current);

    const blobs = await listAll("cms/content/");
    const latest = blobs
      .filter((blob) => blob.pathname !== CURRENT_CONTENT_PATH)
      .sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
    if (!latest) return structuredClone(defaultSiteContent);
    const content = await readJson<SiteContent>(latest.pathname);
    return content ? normalizeSiteContent(content) : structuredClone(defaultSiteContent);
  } catch (error) {
    if (process.env.NODE_ENV !== "test") console.warn("CMS_CONTENT_FALLBACK", error);
    return structuredClone(defaultSiteContent);
  }
}

export async function saveSiteContent(input: unknown): Promise<SiteContent> {
  const content = {
    ...normalizeSiteContent(input),
    updatedAt: new Date().toISOString(),
  };
  validateContent(content);
  await put(CURRENT_CONTENT_PATH, JSON.stringify(content), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
  return content;
}
