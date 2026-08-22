import type { Metadata } from "next";
import Image from "next/image";
import Header from "./components/Header";
import LeadForm from "./components/LeadForm";
import MobileCta from "./components/MobileCta";
import { getSiteContent } from "@/lib/cms";
import {
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  CompassIcon,
  DropletIcon,
  MessageIcon,
  PlusIcon,
  ShieldIcon,
  SlidersIcon,
  SparkIcon,
  ToolIcon,
  VolumeIcon,
  WavesIcon,
} from "./components/Icons";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      images: [{ url: content.hero.imagePath }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo.title,
      description: content.seo.description,
      images: [content.hero.imagePath],
    },
  };
}

export default async function Home() {
  const content = await getSiteContent();
  const number = content.contact.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "";
  const whatsappText = encodeURIComponent(
    `Hola, ${content.brand.owner}. Me interesa evaluar un sistema mineral ${content.brand.name} para mi piscina. ¿Podemos hablar?`,
  );
  const whatsappUrl = `${number ? `https://wa.me/${number}` : "https://wa.me/"}?text=${whatsappText}`;
  const primaryHref = content.modules.diagnostic ? "#diagnostico" : whatsappUrl;
  const secondaryHref = content.modules.system
    ? "#sistema"
    : content.modules.process
      ? "#proceso"
      : primaryHref;
  const experienceIcons = [<WavesIcon key="waves" />, <SparkIcon key="spark" />, <SlidersIcon key="sliders" />];

  return (
    <>
      <Header brand={content.brand} modules={content.modules} primaryHref={primaryHref} />
      <main id="contenido">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Image
              src={content.hero.imagePath}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={88}
              unoptimized={content.hero.imagePath.startsWith("/api/media/")}
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-water-glow" aria-hidden="true" />

          <div className="container hero-content">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span /> {content.hero.eyebrow}
              </p>
              <h1 id="hero-title">
                {content.hero.title} <em>{content.hero.emphasis}</em>
              </h1>
              <p className="hero-lead">
                {content.hero.lead}
              </p>
              <div className="hero-actions">
                <a className="button button-light" href={primaryHref} target={primaryHref.startsWith("http") ? "_blank" : undefined} rel={primaryHref.startsWith("http") ? "noreferrer" : undefined}>
                  {content.hero.primaryCta} <ArrowUpRight />
                </a>
                <a className="button button-ghost" href={secondaryHref}>
                  {content.hero.secondaryCta} <ArrowRight />
                </a>
              </div>
              <p className="hero-note">
                Evaluación técnica <i /> Propuesta a medida <i /> Instalación especializada
              </p>
            </div>

            <div className="hero-corner-card">
              <div className="corner-card-top">
                <DropletIcon />
                <span>Proyecto integral</span>
              </div>
              <strong>No es un producto de estantería.</strong>
              <p>Es una solución diseñada alrededor de tu piscina.</p>
              <a href={content.modules.process ? "#proceso" : primaryHref}>Ver cómo trabajamos <ArrowRight /></a>
            </div>
          </div>

          <div className="hero-index" aria-hidden="true">
            <span>Agua</span><i /> <span>Mineral</span><i /> <span>Arquitectura</span>
          </div>
        </section>

        <section className="value-rail" aria-label="Nuestra forma de trabajar">
          <div className="container value-rail-inner">
            <div><CompassIcon /><span><strong>Diagnóstico</strong>A partir de tu piscina real</span></div>
            <div><SlidersIcon /><span><strong>Diseño</strong>Sin paquetes genéricos</span></div>
            <div><ToolIcon /><span><strong>Instalación</strong>Coordinada de principio a fin</span></div>
            <div><ShieldIcon /><span><strong>Seguimiento</strong>Con un responsable claro</span></div>
          </div>
        </section>

        {content.modules.experience && <section className="experience section" id="experiencia">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow dark"><span /> {content.experience.eyebrow}</p>
                <h2>{content.experience.title}</h2>
              </div>
              <div className="split-copy">
                <p className="large-copy">{content.experience.accent}</p>
                <p>{content.experience.body}</p>
              </div>
            </div>

            <div className="experience-grid">
              {content.experience.cards.map((card, index) => (
                <article className="experience-card" key={`${card.title}-${index}`}>
                  <div className="card-meta"><span>{String(index + 1).padStart(2, "0")}</span><span className="icon-disc">{experienceIcons[index]}</span></div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="card-line" />
                </article>
              ))}
            </div>

            <div className="editorial-statement">
              <span className="statement-mark">N</span>
              <p>“{content.experience.statement}”</p>
              <span className="statement-signature">{content.brand.owner} · {content.brand.name}</span>
            </div>
          </div>
        </section>}

        {content.modules.system && <section className="system section" id="sistema">
          <div className="container">
            <div className="system-intro">
              <div>
                <p className="eyebrow light"><span /> {content.system.eyebrow}</p>
                <h2>{content.system.title}</h2>
              </div>
              <div>
                <p>{content.system.body}</p>
                <a className="inline-link" href={primaryHref}>Evaluar mi piscina <ArrowUpRight /></a>
              </div>
            </div>

            <div className="system-stage">
              <div className="system-diagram" aria-label="Esquema conceptual del sistema mineral NÁCAR">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="mineral-particle particle-one" />
                <div className="mineral-particle particle-two" />
                <div className="mineral-particle particle-three" />
                <div className="system-core">
                  <span className="core-cap" />
                  <span className="core-band">{content.brand.name}</span>
                  <span className="core-window"><span /></span>
                  <small>Sistema mineral</small>
                </div>
                <div className="diagram-label label-one"><span>01</span><strong>Lectura</strong><small>Agua y piscina</small></div>
                <div className="diagram-label label-two"><span>02</span><strong>Configuración</strong><small>Mineral + control</small></div>
                <div className="diagram-label label-three"><span>03</span><strong>Calibración</strong><small>Equilibrio operativo</small></div>
              </div>

              <div className="system-specs">
                <p className="spec-index">{content.brand.name} / 01—04</p>
                <h3>{content.system.specTitle}</h3>
                <ul>
                  <li><span><DropletIcon /></span><div><strong>Condiciones del agua</strong><p>Partimos del estado de entrada y del comportamiento actual de la piscina.</p></div></li>
                  <li><span><VolumeIcon /></span><div><strong>Volumen y uso</strong><p>Dimensionamos según tamaño, exposición, frecuencia y tipo de proyecto.</p></div></li>
                  <li><span><SlidersIcon /></span><div><strong>Compatibilidad técnica</strong><p>Integramos filtración, control y formulación mineral con criterio.</p></div></li>
                  <li><span><ToolIcon /></span><div><strong>Operación futura</strong><p>Definimos desde el inicio cómo se cuida y quién acompaña.</p></div></li>
                </ul>
                <p className="technical-note">La composición final se determina después de la evaluación. La imagen representa el concepto de sistema, no un equipo específico.</p>
              </div>
            </div>
          </div>
        </section>}

        {content.modules.approach && <section className="approach section">
          <div className="container">
            <div className="section-heading centered-heading">
              <p className="eyebrow dark"><span /> {content.approach.eyebrow}</p>
              <h2>{content.approach.title}</h2>
              <p>{content.approach.body}</p>
            </div>

            <div className="comparison-shell">
              <div className="comparison-side conventional">
                <p className="comparison-label">Intervención convencional</p>
                <h3>Comprar componentes</h3>
                <ul>
                  <li><span />Selección por catálogo</li>
                  <li><span />Proveedores fragmentados</li>
                  <li><span />Decisiones durante la instalación</li>
                  <li><span />Mantenimiento reactivo</li>
                </ul>
              </div>
              <div className="comparison-center" aria-hidden="true"><span>VS</span></div>
              <div className="comparison-side nacar-side">
                <p className="comparison-label">Proyecto {content.brand.name}</p>
                <h3>Diseñar la experiencia</h3>
                <ul>
                  <li><CheckIcon />Diagnóstico antes de cotizar</li>
                  <li><CheckIcon />Sistema pensado como conjunto</li>
                  <li><CheckIcon />Alcance e inversión definidos</li>
                  <li><CheckIcon />Seguimiento planificado</li>
                </ul>
              </div>
            </div>
          </div>
        </section>}

        {content.modules.process && <section className="process section" id="proceso">
          <div className="container">
            <div className="process-layout">
              <div className="process-sticky">
                <p className="eyebrow dark"><span /> {content.process.eyebrow}</p>
                <h2>{content.process.title}</h2>
                <p>{content.process.body}</p>
                <a className="button button-dark" href={primaryHref}>Empezar mi evaluación <ArrowUpRight /></a>
              </div>
              <ol className="process-list">
                {content.process.items.map((item, index) => (
                  <li key={`${item.title}-${index}`}>
                    <span className="process-number">{String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{item.title}</h3><p>{item.text}</p></div>
                    <ArrowUpRight />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>}

        {content.modules.about && <section className="juan-section">
          <div className="container juan-grid">
            <div className="juan-portrait" aria-label="Monograma de Juan">
              <div className="portrait-rings" />
              <span>J</span>
              <p>Atención personal<br />en cada proyecto</p>
            </div>
            <div className="juan-copy">
              <p className="eyebrow light"><span /> {content.about.eyebrow}</p>
              <h2>{content.about.title}</h2>
              <p>{content.about.body}</p>
              <blockquote>“{content.about.quote}”</blockquote>
              <a className="inline-link light-link" href={primaryHref}>Hablar de mi proyecto <ArrowRight /></a>
            </div>
          </div>
        </section>}

        {content.modules.fit && <section className="fit section">
          <div className="container">
            <div className="fit-heading">
              <p className="eyebrow dark"><span /> {content.fit.eyebrow}</p>
              <h2>{content.fit.title}</h2>
              <p>{content.fit.body}</p>
            </div>
            <div className="fit-grid">
              {content.fit.cards.map((card, index) => (
                <article key={`${card.title}-${index}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span><h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <ArrowUpRight />
                </article>
              ))}
            </div>
          </div>
        </section>}

        {content.modules.diagnostic && <section className="diagnostic section" id="diagnostico">
          <div className="container diagnostic-grid">
            <div className="diagnostic-copy">
              <p className="eyebrow light"><span /> {content.diagnostic.eyebrow}</p>
              <h2>{content.diagnostic.title}</h2>
              <p className="diagnostic-lead">{content.diagnostic.body}</p>
              <ul className="diagnostic-includes">
                <li><CheckIcon /><span><strong>Conversación inicial</strong> para comprender objetivos y contexto</span></li>
                <li><CheckIcon /><span><strong>Lectura técnica preliminar</strong> de la piscina y su etapa</span></li>
                <li><CheckIcon /><span><strong>Siguiente paso claro</strong> sin presión ni paquetes genéricos</span></li>
              </ul>
              <div className="privacy-note"><ShieldIcon /><p>Tu información se usa únicamente para responder esta solicitud.</p></div>
            </div>
            <LeadForm whatsappNumber={number} ownerName={content.brand.owner} brandName={content.brand.name} />
          </div>
        </section>}

        {content.modules.faq && <section className="faq section" id="preguntas">
          <div className="container faq-grid">
            <div className="faq-heading">
              <p className="eyebrow dark"><span /> {content.faq.eyebrow}</p>
              <h2>{content.faq.title}</h2>
              <p>{content.faq.body}</p>
              <a className="inline-link" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageIcon /> Consultar por WhatsApp <ArrowUpRight />
              </a>
            </div>
            <div className="faq-list">
              {content.faq.items.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary><span>{faq.question}</span><span className="faq-plus"><PlusIcon /></span></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>}

        {content.modules.finalCta && <section className="final-cta">
          <div className="final-cta-bg" aria-hidden="true"><Image src={content.hero.imagePath} alt="" fill sizes="100vw" quality={70} unoptimized={content.hero.imagePath.startsWith("/api/media/")} /></div>
          <div className="final-cta-overlay" />
          <div className="container final-cta-content">
            <DropletIcon />
            <p className="eyebrow light">{content.finalCta.eyebrow}</p>
            <h2>{content.finalCta.title}</h2>
            <div>
              <a className="button button-light" href={primaryHref}>{content.finalCta.primaryCta} <ArrowUpRight /></a>
              <a className="button button-ghost" href={whatsappUrl} target="_blank" rel="noreferrer">{content.finalCta.secondaryCta} <MessageIcon /></a>
            </div>
          </div>
        </section>}
      </main>

      <MobileCta href={primaryHref} label={content.hero.primaryCta} />

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand footer-logo" href="#inicio" aria-label={`${content.brand.name}, ir al inicio`}>
              <span className="brand-mark" aria-hidden="true"><span /><span /></span>
              <span className="brand-copy"><strong>{content.brand.name}</strong><small>{content.brand.descriptor}</small></span>
            </a>
            <p>Sistemas premium de tratamiento mineral con magnesio para piscinas, diseñados alrededor de cada proyecto.</p>
          </div>
          <div className="footer-nav">
            <p>Explorar</p>
            {content.modules.experience && <a href="#experiencia">La experiencia</a>}
            {content.modules.system && <a href="#sistema">El sistema</a>}
            {content.modules.process && <a href="#proceso">Proceso</a>}
            {content.modules.faq && <a href="#preguntas">Preguntas</a>}
          </div>
          <div className="footer-contact">
            <p>Proyecto</p>
            <a href={primaryHref}>Solicitar diagnóstico <ArrowUpRight /></a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight /></a>
            {content.contact.email && <a href={`mailto:${content.contact.email}`}>Correo <ArrowUpRight /></a>}
          </div>
        </div>
        <div className="container footer-disclaimer">
          <p>
            La configuración, el rendimiento y el mantenimiento dependen de las condiciones de cada piscina. Toda recomendación está sujeta a evaluación técnica. {content.brand.name} no realiza afirmaciones médicas ni sustituye las obligaciones sanitarias o normativas aplicables.
          </p>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} {content.brand.name} · {content.brand.descriptor} por {content.brand.owner}</span>
          <span>Agua · Ingeniería · Experiencia</span>
        </div>
      </footer>
    </>
  );
}
