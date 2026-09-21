import Image from "next/image";
import LeadForm from "./components/LeadForm";
import MobileCta from "./components/MobileCta";
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

const experienceCards = [
  {
    number: "01",
    icon: <WavesIcon />,
    title: "Sensación mineral",
    text: "Una experiencia de baño que prioriza el tacto del agua, su equilibrio y el placer de permanecer en ella.",
  },
  {
    number: "02",
    icon: <SparkIcon />,
    title: "Claridad que se nota",
    text: "Filtración y calibración pensadas para sostener una apariencia limpia, serena y visualmente excepcional.",
  },
  {
    number: "03",
    icon: <SlidersIcon />,
    title: "Control sin improvisar",
    text: "Una configuración proporcionada al volumen, uso, entorno y equipamiento real de cada piscina.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Conversación privada",
    text: "Entendemos la piscina, el proyecto y la experiencia que quieres conseguir.",
  },
  {
    number: "02",
    title: "Diagnóstico técnico",
    text: "Revisamos agua, volumen, hidráulica, equipos existentes, uso y espacio disponible.",
  },
  {
    number: "03",
    title: "Propuesta a medida",
    text: "Recibes una arquitectura de sistema, alcance, inversión y plan de implementación claros.",
  },
  {
    number: "04",
    title: "Instalación y puesta a punto",
    text: "Coordinamos la integración, calibramos el conjunto y dejamos definido el seguimiento.",
  },
];

const faqs = [
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
];

export default function Home() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "";
  const whatsappText = encodeURIComponent(
    "Hola, Juan. Me interesa evaluar un sistema mineral NÁCAR para mi piscina. ¿Podemos hablar?",
  );
  const whatsappUrl = `${number ? `https://wa.me/${number}` : "https://wa.me/"}?text=${whatsappText}`;

  return (
    <>
      <main id="contenido">
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <Image
              src="/images/hero-piscina-mineral.png"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={88}
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-water-glow" aria-hidden="true" />

          <div className="container hero-content">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow">
                <span /> Sistemas minerales de magnesio · por Juan
              </p>
              <h1 id="hero-title">
                Tu piscina, convertida en una <em>experiencia mineral.</em>
              </h1>
              <p className="hero-lead">
                Diseñamos e instalamos sistemas de tratamiento con minerales de magnesio para piscinas que exigen agua excepcional, integración impecable y atención experta.
              </p>
              <div className="hero-actions">
                <a className="button button-light" href="#diagnostico">
                  Solicitar diagnóstico <ArrowUpRight />
                </a>
                <a className="button button-ghost" href="#sistema">
                  Conocer el sistema <ArrowRight />
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
              <a href="#proceso">Ver cómo trabajamos <ArrowRight /></a>
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

        <section className="experience section" id="experiencia">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow dark"><span /> La diferencia se siente</p>
                <h2>Una piscina excepcional no empieza en el revestimiento.</h2>
              </div>
              <div className="split-copy">
                <p className="large-copy">Empieza en el agua.</p>
                <p>
                  NÁCAR transforma el tratamiento técnico en una experiencia coherente con el nivel de tu propiedad: serena, cuidada y diseñada para disfrutarse.
                </p>
              </div>
            </div>

            <div className="experience-grid">
              {experienceCards.map((card) => (
                <article className="experience-card" key={card.number}>
                  <div className="card-meta"><span>{card.number}</span><span className="icon-disc">{card.icon}</span></div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <span className="card-line" />
                </article>
              ))}
            </div>

            <div className="editorial-statement">
              <span className="statement-mark">N</span>
              <p>“No vendemos minerales por separado. Diseñamos la relación completa entre agua, tecnología y servicio.”</p>
              <span className="statement-signature">Juan · NÁCAR</span>
            </div>
          </div>
        </section>

        <section className="system section" id="sistema">
          <div className="container">
            <div className="system-intro">
              <div>
                <p className="eyebrow light"><span /> Ingeniería mineral</p>
                <h2>El sistema correcto es el que encaja con todo lo demás.</h2>
              </div>
              <div>
                <p>
                  La formulación mineral es solo una parte. Para que la experiencia sea consistente, Juan estudia el circuito completo y define una arquitectura proporcionada al proyecto.
                </p>
                <a className="inline-link" href="#diagnostico">Evaluar mi piscina <ArrowUpRight /></a>
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
                  <span className="core-band">NÁCAR</span>
                  <span className="core-window"><span /></span>
                  <small>Sistema mineral</small>
                </div>
                <div className="diagram-label label-one"><span>01</span><strong>Lectura</strong><small>Agua y piscina</small></div>
                <div className="diagram-label label-two"><span>02</span><strong>Configuración</strong><small>Mineral + control</small></div>
                <div className="diagram-label label-three"><span>03</span><strong>Calibración</strong><small>Equilibrio operativo</small></div>
              </div>

              <div className="system-specs">
                <p className="spec-index">NÁCAR / 01—04</p>
                <h3>Una arquitectura, cuatro decisiones.</h3>
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
        </section>

        <section className="approach section">
          <div className="container">
            <div className="section-heading centered-heading">
              <p className="eyebrow dark"><span /> Servicio high-touch</p>
              <h2>El lujo está en no tener que coordinarlo todo.</h2>
              <p>Un solo responsable, una visión completa y decisiones explicadas antes de intervenir tu piscina.</p>
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
                <p className="comparison-label">Proyecto NÁCAR</p>
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
        </section>

        <section className="process section" id="proceso">
          <div className="container">
            <div className="process-layout">
              <div className="process-sticky">
                <p className="eyebrow dark"><span /> El método de Juan</p>
                <h2>De una buena conversación a un sistema bien resuelto.</h2>
                <p>El proceso reduce incertidumbre: primero entendemos, luego diseñamos y solo entonces instalamos.</p>
                <a className="button button-dark" href="#diagnostico">Empezar mi evaluación <ArrowUpRight /></a>
              </div>
              <ol className="process-list">
                {processSteps.map((item) => (
                  <li key={item.number}>
                    <span className="process-number">{item.number}</span>
                    <div><h3>{item.title}</h3><p>{item.text}</p></div>
                    <ArrowUpRight />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="juan-section">
          <div className="container juan-grid">
            <div className="juan-portrait" aria-label="Monograma de Juan">
              <div className="portrait-rings" />
              <span>J</span>
              <p>Atención personal<br />en cada proyecto</p>
            </div>
            <div className="juan-copy">
              <p className="eyebrow light"><span /> Detrás de NÁCAR</p>
              <h2>Un único responsable. De la primera pregunta a la última calibración.</h2>
              <p>
                Juan acompaña personalmente el diagnóstico y la definición de cada sistema. Su trabajo no empieza ofreciendo un equipo: empieza escuchando cómo se usa la piscina, qué no funciona hoy y qué nivel de experiencia espera el cliente.
              </p>
              <blockquote>“La mejor tecnología es la que se siente en el agua y desaparece de tus preocupaciones.”</blockquote>
              <a className="inline-link light-link" href="#diagnostico">Hablar de mi proyecto <ArrowRight /></a>
            </div>
          </div>
        </section>

        <section className="fit section">
          <div className="container">
            <div className="fit-heading">
              <p className="eyebrow dark"><span /> Proyectos seleccionados</p>
              <h2>¿NÁCAR encaja con tu piscina?</h2>
              <p>Es una solución para quienes valoran la experiencia completa, no solo la compra de un equipo.</p>
            </div>
            <div className="fit-grid">
              <article>
                <span>01</span><h3>Residencias privadas</h3>
                <p>Para propietarios que quieren elevar una piscina existente o integrar el sistema en una nueva casa.</p>
                <ArrowUpRight />
              </article>
              <article>
                <span>02</span><h3>Hoteles & wellness</h3>
                <p>Para espacios donde el agua forma parte central de la percepción, el servicio y la identidad del lugar.</p>
                <ArrowUpRight />
              </article>
              <article>
                <span>03</span><h3>Arquitectos & desarrolladores</h3>
                <p>Para equipos que necesitan coordinar la solución técnica desde el diseño y evitar improvisaciones en obra.</p>
                <ArrowUpRight />
              </article>
            </div>
          </div>
        </section>

        <section className="diagnostic section" id="diagnostico">
          <div className="container diagnostic-grid">
            <div className="diagnostic-copy">
              <p className="eyebrow light"><span /> Diagnóstico privado</p>
              <h2>El primer paso es entender tu agua.</h2>
              <p className="diagnostic-lead">
                Cuéntanos lo esencial. Juan revisará tu caso y te contactará para confirmar si una solución NÁCAR tiene sentido para el proyecto.
              </p>
              <ul className="diagnostic-includes">
                <li><CheckIcon /><span><strong>Conversación inicial</strong> para comprender objetivos y contexto</span></li>
                <li><CheckIcon /><span><strong>Lectura técnica preliminar</strong> de la piscina y su etapa</span></li>
                <li><CheckIcon /><span><strong>Siguiente paso claro</strong> sin presión ni paquetes genéricos</span></li>
              </ul>
              <div className="privacy-note"><ShieldIcon /><p>Tu información se usa únicamente para responder esta solicitud.</p></div>
            </div>
            <LeadForm />
          </div>
        </section>

        <section className="faq section" id="preguntas">
          <div className="container faq-grid">
            <div className="faq-heading">
              <p className="eyebrow dark"><span /> Antes de decidir</p>
              <h2>Preguntas honestas. Respuestas claras.</h2>
              <p>Si tu pregunta no está aquí, escríbele directamente a Juan.</p>
              <a className="inline-link" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageIcon /> Consultar por WhatsApp <ArrowUpRight />
              </a>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary><span>{faq.question}</span><span className="faq-plus"><PlusIcon /></span></summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta-bg" aria-hidden="true"><Image src="/images/hero-piscina-mineral.png" alt="" fill sizes="100vw" quality={70} /></div>
          <div className="final-cta-overlay" />
          <div className="container final-cta-content">
            <DropletIcon />
            <p className="eyebrow light">Tu próxima experiencia de agua</p>
            <h2>Una piscina distinta empieza con una conversación.</h2>
            <div>
              <a className="button button-light" href="#diagnostico">Solicitar diagnóstico <ArrowUpRight /></a>
              <a className="button button-ghost" href={whatsappUrl} target="_blank" rel="noreferrer">Hablar con Juan <MessageIcon /></a>
            </div>
          </div>
        </section>
      </main>

      <MobileCta />

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a className="brand footer-logo" href="#inicio" aria-label="Nácar, ir al inicio">
              <span className="brand-mark" aria-hidden="true"><span /><span /></span>
              <span className="brand-copy"><strong>NÁCAR</strong><small>Sistemas minerales</small></span>
            </a>
            <p>Sistemas premium de tratamiento mineral con magnesio para piscinas, diseñados alrededor de cada proyecto.</p>
          </div>
          <div className="footer-nav">
            <p>Explorar</p>
            <a href="#experiencia">La experiencia</a>
            <a href="#sistema">El sistema</a>
            <a href="#proceso">Proceso</a>
            <a href="#preguntas">Preguntas</a>
          </div>
          <div className="footer-contact">
            <p>Proyecto</p>
            <a href="#diagnostico">Solicitar diagnóstico <ArrowUpRight /></a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight /></a>
          </div>
        </div>
        <div className="container footer-disclaimer">
          <p>
            La configuración, el rendimiento y el mantenimiento dependen de las condiciones de cada piscina. Toda recomendación está sujeta a evaluación técnica. NÁCAR no realiza afirmaciones médicas ni sustituye las obligaciones sanitarias o normativas aplicables.
          </p>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} NÁCAR · Sistemas minerales por Juan</span>
          <span>Agua · Ingeniería · Experiencia</span>
        </div>
      </footer>
    </>
  );
}
