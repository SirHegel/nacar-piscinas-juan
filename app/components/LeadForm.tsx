"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, CheckIcon, MessageIcon } from "./Icons";

type Fields = {
  name: string;
  city: string;
  whatsapp: string;
  email: string;
  projectType: string;
  projectStage: string;
  poolVolume: string;
  priority: string;
  message: string;
  consent: boolean;
  website: string;
};

const initialFields: Fields = {
  name: "",
  city: "",
  whatsapp: "",
  email: "",
  projectType: "",
  projectStage: "",
  poolVolume: "",
  priority: "",
  message: "",
  consent: false,
  website: "",
};

const priorities = [
  "Elevar la experiencia del agua",
  "Actualizar el tratamiento actual",
  "Simplificar el cuidado de la piscina",
  "Integrarlo desde el diseño",
];

export default function LeadForm({
  whatsappNumber = "",
  ownerName = "Juan",
  brandName = "NÁCAR",
}: {
  whatsappNumber?: string;
  ownerName?: string;
  brandName?: string;
}) {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<Fields>(initialFields);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [reference, setReference] = useState("");
  const submissionId = useRef("");

  const update = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateStepOne = () => {
    const next: Record<string, string> = {};
    if (fields.name.trim().length < 2) next.name = "Escribe tu nombre.";
    if (fields.city.trim().length < 2) next.city = "Indica la ciudad o zona del proyecto.";
    if (fields.whatsapp.replace(/\D/g, "").length < 7) next.whatsapp = "Escribe un número válido.";
    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) next.email = "Revisa el correo electrónico.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStepTwo = () => {
    const next: Record<string, string> = {};
    if (!fields.projectType) next.projectType = "Selecciona el tipo de proyecto.";
    if (!fields.projectStage) next.projectStage = "Selecciona la etapa actual.";
    if (!fields.priority) next.priority = "Elige tu prioridad principal.";
    if (!fields.consent) next.consent = "Necesitamos tu autorización para contactarte.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStepOne()) return;
    setStep(2);
    requestAnimationFrame(() => document.querySelector<HTMLHeadingElement>("#form-step-title")?.focus());
  };

  const whatsappUrl = useMemo(() => {
    const configuredNumber = whatsappNumber.replace(/\D/g, "") || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "";
    const summary = [
      `Hola, ${ownerName}. Acabo de solicitar un diagnóstico privado para un sistema mineral ${brandName}.`,
      `Nombre: ${fields.name}`,
      `Proyecto: ${fields.projectType || "por definir"} · ${fields.projectStage || "por definir"}`,
      `Ubicación: ${fields.city}`,
      `Prioridad: ${fields.priority || "por definir"}`,
      reference ? `Referencia: ${reference}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    const base = configuredNumber ? `https://wa.me/${configuredNumber}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(summary)}`;
  }, [brandName, fields, ownerName, reference, whatsappNumber]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateStepTwo()) return;
    setStatus("sending");
    if (!submissionId.current) submissionId.current = crypto.randomUUID();

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, submissionId: submissionId.current }),
      });
      const result = (await response.json()) as { ok?: boolean; reference?: string; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "No se pudo enviar la solicitud.");
      setReference(result.reference || "");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <span className="success-icon"><CheckIcon /></span>
        <p className="eyebrow">Solicitud recibida</p>
        <h3>Gracias, {fields.name.split(" ")[0]}.</h3>
        <p>
          {ownerName} ya tiene el contexto inicial de tu proyecto. Si quieres acelerar la conversación, envía ahora el resumen por WhatsApp.
        </p>
        {reference && <span className="reference">Referencia {reference}</span>}
        <a className="button button-light button-full" href={whatsappUrl} target="_blank" rel="noreferrer">
          <MessageIcon /> Continuar por WhatsApp <ArrowUpRight />
        </a>
        <button
          className="text-button"
          type="button"
          onClick={() => {
            setFields(initialFields);
            setStep(1);
            setStatus("idle");
            setReference("");
            submissionId.current = "";
          }}
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={submit} noValidate>
      <div className="form-progress" aria-label={`Paso ${step} de 2`}>
        <span>Paso {step} de 2</span>
        <span className="progress-track"><span style={{ width: `${step * 50}%` }} /></span>
      </div>

      {step === 1 ? (
        <div className="form-step">
          <p className="form-kicker">Empecemos por conocerte</p>
          <h3 id="form-step-title" tabIndex={-1}>¿Dónde está tu proyecto?</h3>
          <p className="form-intro">{ownerName} revisará personalmente esta información antes de ponerse en contacto.</p>

          <div className="field-grid">
            <label className="field field-wide">
              <span>Nombre y apellido</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={fields.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                placeholder="Tu nombre"
              />
              {errors.name && <small id="name-error" className="field-error">{errors.name}</small>}
            </label>

            <label className="field">
              <span>Ciudad o zona</span>
              <input
                type="text"
                name="city"
                autoComplete="address-level2"
                value={fields.city}
                onChange={(event) => update("city", event.target.value)}
                aria-invalid={Boolean(errors.city)}
                aria-describedby={errors.city ? "city-error" : undefined}
                placeholder="Ej. Medellín"
              />
              {errors.city && <small id="city-error" className="field-error">{errors.city}</small>}
            </label>

            <label className="field">
              <span>WhatsApp</span>
              <input
                type="tel"
                name="whatsapp"
                autoComplete="tel"
                inputMode="tel"
                value={fields.whatsapp}
                onChange={(event) => update("whatsapp", event.target.value)}
                aria-invalid={Boolean(errors.whatsapp)}
                aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
                placeholder="+57 300 000 0000"
              />
              {errors.whatsapp && <small id="whatsapp-error" className="field-error">{errors.whatsapp}</small>}
            </label>

            <label className="field field-wide">
              <span>Correo <em>opcional</em></span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={fields.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="tu@correo.com"
              />
              {errors.email && <small id="email-error" className="field-error">{errors.email}</small>}
            </label>
          </div>

          <button className="button button-dark button-full" type="button" onClick={goNext}>
            Continuar <ArrowRight />
          </button>
        </div>
      ) : (
        <div className="form-step">
          <p className="form-kicker">El contexto técnico</p>
          <h3 id="form-step-title" tabIndex={-1}>Háblanos de la piscina.</h3>
          <p className="form-intro">No necesitas tener todos los datos; el diagnóstico existe precisamente para precisarlos.</p>

          <div className="field-grid">
            <label className="field">
              <span>Tipo de proyecto</span>
              <select
                name="projectType"
                value={fields.projectType}
                onChange={(event) => update("projectType", event.target.value)}
                aria-invalid={Boolean(errors.projectType)}
                aria-describedby={errors.projectType ? "project-type-error" : undefined}
              >
                <option value="">Seleccionar</option>
                <option>Residencia privada</option>
                <option>Hotel o proyecto hospitality</option>
                <option>Arquitectura o desarrollo</option>
                <option>Otro proyecto</option>
              </select>
              {errors.projectType && <small id="project-type-error" className="field-error">{errors.projectType}</small>}
            </label>

            <label className="field">
              <span>Etapa actual</span>
              <select
                name="projectStage"
                value={fields.projectStage}
                onChange={(event) => update("projectStage", event.target.value)}
                aria-invalid={Boolean(errors.projectStage)}
                aria-describedby={errors.projectStage ? "stage-error" : undefined}
              >
                <option value="">Seleccionar</option>
                <option>Piscina existente</option>
                <option>Renovación</option>
                <option>Obra nueva</option>
                <option>En fase de diseño</option>
              </select>
              {errors.projectStage && <small id="stage-error" className="field-error">{errors.projectStage}</small>}
            </label>

            <label className="field field-wide">
              <span>Volumen aproximado <em>opcional</em></span>
              <input
                type="text"
                name="poolVolume"
                value={fields.poolVolume}
                onChange={(event) => update("poolVolume", event.target.value)}
                placeholder="Ej. 50 m³ o 8 × 4 m"
              />
            </label>
          </div>

          <fieldset className="priority-fieldset">
            <legend>¿Cuál es tu prioridad principal?</legend>
            <div className="priority-grid">
              {priorities.map((priority) => (
                <label key={priority} className={fields.priority === priority ? "selected" : ""}>
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={fields.priority === priority}
                    onChange={(event) => update("priority", event.target.value)}
                  />
                  <span className="radio-dot" />
                  <span>{priority}</span>
                </label>
              ))}
            </div>
            {errors.priority && <small className="field-error">{errors.priority}</small>}
          </fieldset>

          <label className="field field-wide">
            <span>Algo más que {ownerName} deba saber <em>opcional</em></span>
            <textarea
              name="message"
              rows={3}
              value={fields.message}
              onChange={(event) => update("message", event.target.value)}
              placeholder="Cuéntanos qué te gustaría transformar…"
            />
          </label>

          <div className="honeypot" aria-hidden="true">
            <label>Tu sitio web<input tabIndex={-1} autoComplete="off" name="website" value={fields.website} onChange={(event) => update("website", event.target.value)} /></label>
          </div>

          <label className="consent-field">
            <input
              type="checkbox"
              checked={fields.consent}
              onChange={(event) => update("consent", event.target.checked)}
              aria-invalid={Boolean(errors.consent)}
            />
            <span className="custom-check"><CheckIcon /></span>
            <span>Acepto que {ownerName} me contacte únicamente para responder a esta solicitud.</span>
          </label>
          {errors.consent && <small className="field-error consent-error">{errors.consent}</small>}

          {status === "error" && (
            <p className="submit-error" role="alert">No pudimos enviar la solicitud. Revisa tu conexión e inténtalo de nuevo.</p>
          )}

          <div className="form-actions">
            <button className="text-button" type="button" onClick={() => { setStep(1); setStatus("idle"); }}>
              Volver
            </button>
            <button className="button button-dark" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Enviando…" : "Solicitar diagnóstico"} <ArrowUpRight />
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
