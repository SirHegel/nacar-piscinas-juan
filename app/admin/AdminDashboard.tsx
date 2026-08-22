"use client";

import { ChangeEvent, ReactNode, useMemo, useState } from "react";
import type { SiteContent, ContentCard } from "@/lib/cms";
import type { LeadRecord } from "@/lib/leads";
import { moduleKeys, leadStatuses } from "@/lib/admin-model";
import type { ModuleKey, LeadStatus } from "@/lib/admin-model";
import {
  ArrowRight,
  ArrowUpRight,
  CheckIcon,
  CloseIcon,
  DropletIcon,
  MenuIcon,
  MessageIcon,
  PlusIcon,
  ShieldIcon,
  SlidersIcon,
  SparkIcon,
} from "@/app/components/Icons";

type Tab = "overview" | "leads" | "content" | "modules" | "settings";

const moduleLabels: Record<ModuleKey, { title: string; detail: string }> = {
  experience: { title: "Experiencia", detail: "Beneficios y declaración de marca" },
  system: { title: "El sistema", detail: "Narrativa técnica y especificaciones" },
  approach: { title: "Comparativa", detail: "Servicio NÁCAR frente al convencional" },
  process: { title: "Proceso", detail: "Método de trabajo y sus etapas" },
  about: { title: "Juan", detail: "Historia personal y autoridad" },
  fit: { title: "Tipos de proyecto", detail: "Residencias, hoteles y arquitectura" },
  diagnostic: { title: "Diagnóstico", detail: "Oferta y formulario de captación" },
  faq: { title: "Preguntas", detail: "Acordeón de dudas frecuentes" },
  finalCta: { title: "Cierre", detail: "Llamado a la acción final" },
};

const statusLabels: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  won: "Ganado",
  archived: "Archivado",
};

function Field({ label, value, onChange, textarea = false, hint }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  hint?: string;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function EditorSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <details className="editor-section" open>
      <summary>
        <span><strong>{title}</strong><small>{description}</small></span>
        <PlusIcon />
      </summary>
      <div className="editor-section-body">{children}</div>
    </details>
  );
}

export default function AdminDashboard({
  initialContent,
  initialLeads,
  initialLeadError,
  username,
}: {
  initialContent: SiteContent;
  initialLeads: LeadRecord[];
  initialLeadError: string;
  username: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [content, setContent] = useState(initialContent);
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(initialLeads[0]?.id || null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userInitial = username.trim().charAt(0).toUpperCase() || "A";

  const selectedLead = leads.find((lead) => lead.id === selectedLeadId) || null;
  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesStatus = filter === "all" || lead.status === filter;
      const haystack = `${lead.id} ${lead.name} ${lead.city} ${lead.whatsapp} ${lead.email}`.toLowerCase();
      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [filter, leads, search]);

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter((lead) => lead.status === "new").length,
    active: leads.filter((lead) => ["contacted", "qualified"].includes(lead.status)).length,
    won: leads.filter((lead) => lead.status === "won").length,
  }), [leads]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };

  const setGroup = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setContent((current) => ({ ...current, [key]: value }));
  };

  const updateCards = (group: "experience" | "process" | "fit", cards: ContentCard[]) => {
    setContent((current) => ({
      ...current,
      [group]: { ...current[group], [group === "process" ? "items" : "cards"]: cards },
    }));
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = (await response.json()) as { ok?: boolean; content?: SiteContent; message?: string };
      if (!response.ok || !result.ok || !result.content) throw new Error(result.message || "No se pudo publicar.");
      setContent(result.content);
      flash("Cambios publicados en la web.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "No se pudo publicar.");
    } finally {
      setSaving(false);
    }
  };

  const updateLeadRecord = async (lead: LeadRecord) => {
    try {
      const response = await fetch(`/api/admin/leads/${encodeURIComponent(lead.id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: lead.status, note: lead.note }),
      });
      const result = (await response.json()) as { ok?: boolean; lead?: LeadRecord; message?: string };
      if (!response.ok || !result.lead) throw new Error(result.message || "No se pudo actualizar.");
      setLeads((current) => current.map((item) => (item.id === lead.id ? result.lead! : item)));
      flash("Solicitud actualizada.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "No se pudo actualizar.");
    }
  };

  const deleteLeadRecord = async (lead: LeadRecord) => {
    const confirmed = window.confirm(
      `¿Eliminar definitivamente la solicitud ${lead.id} de ${lead.name}? Esta acción también borra su historial y no se puede deshacer.`,
    );
    if (!confirmed) return;
    try {
      const response = await fetch(`/api/admin/leads/${encodeURIComponent(lead.id)}`, { method: "DELETE" });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "No se pudo eliminar.");
      const remaining = leads.filter((item) => item.id !== lead.id);
      setLeads(remaining);
      setSelectedLeadId(remaining[0]?.id || null);
      flash("Solicitud y datos personales eliminados.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "No se pudo eliminar.");
    }
  };

  const uploadHero = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const result = (await response.json()) as { ok?: boolean; path?: string; message?: string };
      if (!response.ok || !result.path) throw new Error(result.message || "No se pudo subir la imagen.");
      setGroup("hero", { ...content.hero, imagePath: result.path });
      flash("Imagen cargada. Publica para verla en el sitio.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.assign("/admin/login");
  };

  const navigate = (nextTab: Tab) => {
    setTab(nextTab);
    setSidebarOpen(false);
  };

  return (
    <main className="admin-app" id="contenido">
      {toast && <div className="admin-toast" role="status"><CheckIcon />{toast}</div>}

      <aside className={`admin-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="admin-sidebar-head">
          <a className="admin-wordmark compact" href="/">
            <span><DropletIcon /></span><strong>NÁCAR</strong><small>Studio</small>
          </a>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar navegación"><CloseIcon /></button>
        </div>
        <nav aria-label="Panel de administración">
          <button className={tab === "overview" ? "active" : ""} onClick={() => navigate("overview")}><SparkIcon /><span>Resumen</span></button>
          <button className={tab === "leads" ? "active" : ""} onClick={() => navigate("leads")}><MessageIcon /><span>Solicitudes</span>{stats.new > 0 && <em>{stats.new}</em>}</button>
          <button className={tab === "content" ? "active" : ""} onClick={() => navigate("content")}><SlidersIcon /><span>Contenido</span></button>
          <button className={tab === "modules" ? "active" : ""} onClick={() => navigate("modules")}><PlusIcon /><span>Módulos</span></button>
          <button className={tab === "settings" ? "active" : ""} onClick={() => navigate("settings")}><ShieldIcon /><span>Marca y contacto</span></button>
        </nav>
        <div className="admin-sidebar-foot">
          <div className="admin-user-avatar">{userInitial}</div>
          <div><strong>{username}</strong><span>Propietario</span></div>
          <button onClick={logout} aria-label="Cerrar sesión"><ArrowRight /></button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <button className="sidebar-open" onClick={() => setSidebarOpen(true)} aria-label="Abrir navegación"><MenuIcon /></button>
          <div className="admin-live"><span /> Sitio en producción</div>
          <div className="admin-top-actions">
            <a href="/" target="_blank" rel="noreferrer">Vista pública <ArrowUpRight /></a>
            {(tab === "content" || tab === "modules" || tab === "settings") && (
              <button className="publish-button" onClick={saveContent} disabled={saving}>
                {saving ? "Publicando…" : "Guardar y publicar"} <ArrowUpRight />
              </button>
            )}
          </div>
        </header>

        <div className="admin-page">
          {initialLeadError && <div className="admin-data-warning"><ShieldIcon />{initialLeadError}</div>}
          {tab === "overview" && (
            <div className="admin-view">
              <div className="admin-page-title">
                <p>Panel general</p>
                <h1>Hola, {username}.</h1>
                <span>Aquí está lo importante de NÁCAR hoy.</span>
              </div>
              <div className="stats-grid">
                <article className="stat-primary"><small>Solicitudes nuevas</small><strong>{stats.new.toString().padStart(2, "0")}</strong><span>Por revisar</span></article>
                <article><small>En conversación</small><strong>{stats.active.toString().padStart(2, "0")}</strong><span>Contactados + calificados</span></article>
                <article><small>Proyectos ganados</small><strong>{stats.won.toString().padStart(2, "0")}</strong><span>Marcados en el panel</span></article>
                <article><small>Total histórico</small><strong>{stats.total.toString().padStart(2, "0")}</strong><span>Solicitudes persistentes</span></article>
              </div>

              <div className="overview-grid">
                <section className="dashboard-card recent-card">
                  <div className="dashboard-card-head"><div><p>Actividad</p><h2>Solicitudes recientes</h2></div><button onClick={() => navigate("leads")}>Ver todas <ArrowRight /></button></div>
                  {leads.length ? (
                    <div className="recent-list">
                      {leads.slice(0, 5).map((lead) => (
                        <button key={lead.id} onClick={() => { setSelectedLeadId(lead.id); navigate("leads"); }}>
                          <span className="lead-initial">{lead.name.charAt(0).toUpperCase()}</span>
                          <span><strong>{lead.name}</strong><small>{lead.city} · {lead.projectType}</small></span>
                          <em className={`status-pill status-${lead.status}`}>{statusLabels[lead.status]}</em>
                          <time>{new Intl.DateTimeFormat("es", { day: "2-digit", month: "short" }).format(new Date(lead.createdAt))}</time>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state"><MessageIcon /><strong>Aún no hay solicitudes</strong><p>Haz una prueba desde la web pública y aparecerá aquí.</p></div>
                  )}
                </section>

                <section className="dashboard-card site-card">
                  <div className="site-card-visual"><span>N</span><i /></div>
                  <p>Estado de la landing</p>
                  <h2>{Object.values(content.modules).filter(Boolean).length} módulos activos</h2>
                  <span>Última publicación: {new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(new Date(content.updatedAt))}</span>
                  <button onClick={() => navigate("content")}>Editar contenido <ArrowRight /></button>
                </section>
              </div>
            </div>
          )}

          {tab === "leads" && (
            <div className="admin-view">
              <div className="admin-page-title inline-title">
                <div><p>CRM privado</p><h1>Solicitudes</h1><span>Cada formulario queda guardado aquí.</span></div>
                <div className="lead-controls">
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar nombre, ciudad o referencia" aria-label="Buscar solicitudes" />
                  <select value={filter} onChange={(event) => setFilter(event.target.value as LeadStatus | "all")} aria-label="Filtrar por estado">
                    <option value="all">Todos los estados</option>
                    {leadStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                  </select>
                </div>
              </div>

              <div className="lead-workbench">
                <section className="lead-list-panel">
                  <div className="lead-list-head"><span>{filteredLeads.length} solicitudes</span><small>Más recientes primero</small></div>
                  {filteredLeads.length ? filteredLeads.map((lead) => (
                    <button key={lead.id} className={selectedLeadId === lead.id ? "selected" : ""} onClick={() => setSelectedLeadId(lead.id)}>
                      <span className="lead-initial">{lead.name.charAt(0).toUpperCase()}</span>
                      <span className="lead-list-copy"><strong>{lead.name}</strong><small>{lead.city} · {lead.priority}</small><em>{lead.id}</em></span>
                      <span><em className={`status-pill status-${lead.status}`}>{statusLabels[lead.status]}</em><time>{new Intl.DateTimeFormat("es", { day: "2-digit", month: "short" }).format(new Date(lead.createdAt))}</time></span>
                    </button>
                  )) : <div className="empty-state compact-empty"><MessageIcon /><strong>Sin resultados</strong></div>}
                </section>

                <section className="lead-detail-panel">
                  {selectedLead ? (
                    <>
                      <div className="lead-detail-head">
                        <span className="lead-detail-avatar">{selectedLead.name.charAt(0).toUpperCase()}</span>
                        <div><p>{selectedLead.id}</p><h2>{selectedLead.name}</h2><span>{selectedLead.city}</span></div>
                        <em className={`status-pill status-${selectedLead.status}`}>{statusLabels[selectedLead.status]}</em>
                      </div>
                      <div className="lead-quick-actions">
                        <a href={`https://wa.me/${selectedLead.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${selectedLead.name.split(" ")[0]}, soy Juan de NÁCAR. Recibí tu solicitud ${selectedLead.id}.`)}`} target="_blank" rel="noreferrer"><MessageIcon /> WhatsApp</a>
                        {selectedLead.email && <a href={`mailto:${selectedLead.email}`}><ArrowUpRight /> Correo</a>}
                      </div>
                      <dl className="lead-data-grid">
                        <div><dt>Proyecto</dt><dd>{selectedLead.projectType}</dd></div>
                        <div><dt>Etapa</dt><dd>{selectedLead.projectStage}</dd></div>
                        <div><dt>Volumen</dt><dd>{selectedLead.poolVolume || "No indicado"}</dd></div>
                        <div><dt>Prioridad</dt><dd>{selectedLead.priority}</dd></div>
                        <div><dt>WhatsApp</dt><dd>{selectedLead.whatsapp}</dd></div>
                        <div><dt>Correo</dt><dd>{selectedLead.email || "No indicado"}</dd></div>
                      </dl>
                      {selectedLead.message && <div className="lead-message"><span>Mensaje</span><p>{selectedLead.message}</p></div>}
                      <div className="lead-edit-fields">
                        <label><span>Estado</span><select value={selectedLead.status} onChange={(event) => setLeads((current) => current.map((lead) => lead.id === selectedLead.id ? { ...lead, status: event.target.value as LeadStatus } : lead))}>{leadStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
                        <label><span>Nota interna</span><textarea rows={4} value={selectedLead.note} onChange={(event) => setLeads((current) => current.map((lead) => lead.id === selectedLead.id ? { ...lead, note: event.target.value } : lead))} placeholder="Acuerdos, siguiente paso o contexto…" /></label>
                        <button className="admin-primary-button" onClick={() => updateLeadRecord(selectedLead)}>Guardar seguimiento <ArrowRight /></button>
                        <button className="delete-lead-button" onClick={() => deleteLeadRecord(selectedLead)}>Eliminar solicitud y datos</button>
                      </div>
                    </>
                  ) : <div className="empty-state"><MessageIcon /><strong>Selecciona una solicitud</strong></div>}
                </section>
              </div>
            </div>
          )}

          {tab === "content" && (
            <div className="admin-view editor-view">
              <div className="admin-page-title inline-title"><div><p>Editor visual</p><h1>Contenido</h1><span>Edita los mensajes principales sin tocar código.</span></div><a className="preview-link" href="/" target="_blank" rel="noreferrer">Abrir sitio <ArrowUpRight /></a></div>
              <div className="editor-stack">
                <EditorSection title="Hero principal" description="La primera impresión y los llamados a la acción">
                  <div className="editor-grid">
                    <Field label="Etiqueta superior" value={content.hero.eyebrow} onChange={(value) => setGroup("hero", { ...content.hero, eyebrow: value })} />
                    <Field label="Título principal" value={content.hero.title} onChange={(value) => setGroup("hero", { ...content.hero, title: value })} />
                    <Field label="Texto destacado" value={content.hero.emphasis} onChange={(value) => setGroup("hero", { ...content.hero, emphasis: value })} />
                    <Field label="Descripción" value={content.hero.lead} onChange={(value) => setGroup("hero", { ...content.hero, lead: value })} textarea />
                    <Field label="Botón principal" value={content.hero.primaryCta} onChange={(value) => setGroup("hero", { ...content.hero, primaryCta: value })} />
                    <Field label="Botón secundario" value={content.hero.secondaryCta} onChange={(value) => setGroup("hero", { ...content.hero, secondaryCta: value })} />
                  </div>
                  <div className="image-editor">
                    <div className="image-preview" style={{ backgroundImage: `url(${content.hero.imagePath})` }} />
                    <div><strong>Imagen de portada</strong><p>JPG, PNG, WebP o AVIF. Recomendado: horizontal 16:9, mínimo 1600 px.</p><label className="upload-button">{uploading ? "Subiendo…" : "Cambiar imagen"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={uploadHero} disabled={uploading} /></label></div>
                  </div>
                </EditorSection>

                <EditorSection title="La experiencia" description="Propuesta sensorial, tarjetas y declaración">
                  <div className="editor-grid">
                    <Field label="Etiqueta" value={content.experience.eyebrow} onChange={(value) => setGroup("experience", { ...content.experience, eyebrow: value })} />
                    <Field label="Título" value={content.experience.title} onChange={(value) => setGroup("experience", { ...content.experience, title: value })} />
                    <Field label="Frase de acento" value={content.experience.accent} onChange={(value) => setGroup("experience", { ...content.experience, accent: value })} />
                    <Field label="Descripción" value={content.experience.body} onChange={(value) => setGroup("experience", { ...content.experience, body: value })} textarea />
                    <Field label="Declaración de marca" value={content.experience.statement} onChange={(value) => setGroup("experience", { ...content.experience, statement: value })} textarea />
                  </div>
                  <div className="repeater-grid">{content.experience.cards.map((card, index) => <div className="repeater-card" key={index}><span>Tarjeta {index + 1}</span><Field label="Título" value={card.title} onChange={(value) => updateCards("experience", content.experience.cards.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item))} /><Field label="Texto" value={card.text} onChange={(value) => updateCards("experience", content.experience.cards.map((item, itemIndex) => itemIndex === index ? { ...item, text: value } : item))} textarea /></div>)}</div>
                </EditorSection>

                <EditorSection title="Sistema y comparativa" description="Posicionamiento técnico y valor del servicio">
                  <div className="editor-grid">
                    <Field label="Etiqueta del sistema" value={content.system.eyebrow} onChange={(value) => setGroup("system", { ...content.system, eyebrow: value })} />
                    <Field label="Título del sistema" value={content.system.title} onChange={(value) => setGroup("system", { ...content.system, title: value })} />
                    <Field label="Descripción del sistema" value={content.system.body} onChange={(value) => setGroup("system", { ...content.system, body: value })} textarea />
                    <Field label="Título técnico" value={content.system.specTitle} onChange={(value) => setGroup("system", { ...content.system, specTitle: value })} />
                    <Field label="Etiqueta comparativa" value={content.approach.eyebrow} onChange={(value) => setGroup("approach", { ...content.approach, eyebrow: value })} />
                    <Field label="Título comparativo" value={content.approach.title} onChange={(value) => setGroup("approach", { ...content.approach, title: value })} />
                    <Field label="Descripción comparativa" value={content.approach.body} onChange={(value) => setGroup("approach", { ...content.approach, body: value })} textarea />
                  </div>
                </EditorSection>

                <EditorSection title="Proceso" description="Método de trabajo y etapas">
                  <div className="editor-grid">
                    <Field label="Etiqueta" value={content.process.eyebrow} onChange={(value) => setGroup("process", { ...content.process, eyebrow: value })} />
                    <Field label="Título" value={content.process.title} onChange={(value) => setGroup("process", { ...content.process, title: value })} />
                    <Field label="Descripción" value={content.process.body} onChange={(value) => setGroup("process", { ...content.process, body: value })} textarea />
                  </div>
                  <div className="repeater-grid process-repeaters">{content.process.items.map((item, index) => <div className="repeater-card" key={index}><span>Paso {String(index + 1).padStart(2, "0")}</span><Field label="Título" value={item.title} onChange={(value) => updateCards("process", content.process.items.map((row, rowIndex) => rowIndex === index ? { ...row, title: value } : row))} /><Field label="Texto" value={item.text} onChange={(value) => updateCards("process", content.process.items.map((row, rowIndex) => rowIndex === index ? { ...row, text: value } : row))} textarea /></div>)}</div>
                </EditorSection>

                <EditorSection title="Juan y tipos de proyecto" description="Autoridad personal y clientes ideales">
                  <div className="editor-grid">
                    <Field label="Etiqueta de Juan" value={content.about.eyebrow} onChange={(value) => setGroup("about", { ...content.about, eyebrow: value })} />
                    <Field label="Título de Juan" value={content.about.title} onChange={(value) => setGroup("about", { ...content.about, title: value })} />
                    <Field label="Historia" value={content.about.body} onChange={(value) => setGroup("about", { ...content.about, body: value })} textarea />
                    <Field label="Cita" value={content.about.quote} onChange={(value) => setGroup("about", { ...content.about, quote: value })} textarea />
                    <Field label="Etiqueta de proyectos" value={content.fit.eyebrow} onChange={(value) => setGroup("fit", { ...content.fit, eyebrow: value })} />
                    <Field label="Título de proyectos" value={content.fit.title} onChange={(value) => setGroup("fit", { ...content.fit, title: value })} />
                    <Field label="Descripción de proyectos" value={content.fit.body} onChange={(value) => setGroup("fit", { ...content.fit, body: value })} textarea />
                  </div>
                  <div className="repeater-grid">{content.fit.cards.map((card, index) => <div className="repeater-card" key={index}><span>Perfil {index + 1}</span><Field label="Título" value={card.title} onChange={(value) => updateCards("fit", content.fit.cards.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item))} /><Field label="Texto" value={card.text} onChange={(value) => updateCards("fit", content.fit.cards.map((item, itemIndex) => itemIndex === index ? { ...item, text: value } : item))} textarea /></div>)}</div>
                </EditorSection>

                <EditorSection title="Diagnóstico y cierre" description="Formulario y última llamada a la acción">
                  <div className="editor-grid">
                    <Field label="Etiqueta del diagnóstico" value={content.diagnostic.eyebrow} onChange={(value) => setGroup("diagnostic", { ...content.diagnostic, eyebrow: value })} />
                    <Field label="Título del diagnóstico" value={content.diagnostic.title} onChange={(value) => setGroup("diagnostic", { ...content.diagnostic, title: value })} />
                    <Field label="Descripción del diagnóstico" value={content.diagnostic.body} onChange={(value) => setGroup("diagnostic", { ...content.diagnostic, body: value })} textarea />
                    <Field label="Etiqueta final" value={content.finalCta.eyebrow} onChange={(value) => setGroup("finalCta", { ...content.finalCta, eyebrow: value })} />
                    <Field label="Título final" value={content.finalCta.title} onChange={(value) => setGroup("finalCta", { ...content.finalCta, title: value })} />
                    <Field label="Botón final principal" value={content.finalCta.primaryCta} onChange={(value) => setGroup("finalCta", { ...content.finalCta, primaryCta: value })} />
                    <Field label="Botón final secundario" value={content.finalCta.secondaryCta} onChange={(value) => setGroup("finalCta", { ...content.finalCta, secondaryCta: value })} />
                  </div>
                </EditorSection>

                <EditorSection title="Preguntas frecuentes" description="Edita, añade o elimina preguntas">
                  <div className="editor-grid">
                    <Field label="Etiqueta" value={content.faq.eyebrow} onChange={(value) => setGroup("faq", { ...content.faq, eyebrow: value })} />
                    <Field label="Título" value={content.faq.title} onChange={(value) => setGroup("faq", { ...content.faq, title: value })} />
                    <Field label="Descripción" value={content.faq.body} onChange={(value) => setGroup("faq", { ...content.faq, body: value })} textarea />
                  </div>
                  <div className="faq-editor-list">{content.faq.items.map((item, index) => <div className="faq-editor-row" key={index}><span>{String(index + 1).padStart(2, "0")}</span><div><Field label="Pregunta" value={item.question} onChange={(value) => setGroup("faq", { ...content.faq, items: content.faq.items.map((row, rowIndex) => rowIndex === index ? { ...row, question: value } : row) })} /><Field label="Respuesta" value={item.answer} onChange={(value) => setGroup("faq", { ...content.faq, items: content.faq.items.map((row, rowIndex) => rowIndex === index ? { ...row, answer: value } : row) })} textarea /></div><button onClick={() => setGroup("faq", { ...content.faq, items: content.faq.items.filter((_, rowIndex) => rowIndex !== index) })} aria-label={`Eliminar pregunta ${index + 1}`}><CloseIcon /></button></div>)}</div>
                  {content.faq.items.length < 12 && <button className="add-row-button" onClick={() => setGroup("faq", { ...content.faq, items: [...content.faq.items, { question: "Nueva pregunta", answer: "Escribe aquí la respuesta." }] })}><PlusIcon /> Añadir pregunta</button>}
                </EditorSection>
              </div>
            </div>
          )}

          {tab === "modules" && (
            <div className="admin-view">
              <div className="admin-page-title"><p>Arquitectura de página</p><h1>Módulos</h1><span>Activa u oculta secciones completas sin perder su contenido.</span></div>
              <div className="module-manager">
                <div className="structural-module"><span>Siempre activo</span><div><strong>Hero + navegación</strong><p>La entrada principal de la marca y los enlaces del sitio.</p></div><ShieldIcon /></div>
                {moduleKeys.map((key, index) => (
                  <label className={`module-row${content.modules[key] ? " enabled" : ""}`} key={key}>
                    <span className="module-order">{String(index + 1).padStart(2, "0")}</span>
                    <span><strong>{moduleLabels[key].title}</strong><small>{moduleLabels[key].detail}</small></span>
                    <input type="checkbox" checked={content.modules[key]} onChange={(event) => setGroup("modules", { ...content.modules, [key]: event.target.checked })} />
                    <span className="module-switch"><i /></span>
                  </label>
                ))}
                <div className="structural-module footer-module"><span>Siempre activo</span><div><strong>Footer legal</strong><p>Marca, navegación, aviso técnico y acceso al panel.</p></div><ShieldIcon /></div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="admin-view editor-view">
              <div className="admin-page-title"><p>Configuración</p><h1>Marca y contacto</h1><span>Datos globales utilizados en toda la experiencia.</span></div>
              <div className="settings-grid">
                <section className="dashboard-card settings-card"><p>Identidad</p><h2>Marca principal</h2><Field label="Nombre de marca" value={content.brand.name} onChange={(value) => setGroup("brand", { ...content.brand, name: value })} /><Field label="Descriptor" value={content.brand.descriptor} onChange={(value) => setGroup("brand", { ...content.brand, descriptor: value })} /><Field label="Nombre del propietario" value={content.brand.owner} onChange={(value) => setGroup("brand", { ...content.brand, owner: value })} /></section>
                <section className="dashboard-card settings-card"><p>Conversión</p><h2>Contacto directo</h2><Field label="WhatsApp internacional" value={content.contact.whatsapp} onChange={(value) => setGroup("contact", { ...content.contact, whatsapp: value.replace(/\D/g, "") })} hint="Sin +, espacios ni guiones. Ejemplo: 573001234567" /><Field label="Correo comercial" value={content.contact.email} onChange={(value) => setGroup("contact", { ...content.contact, email: value })} /></section>
                <section className="dashboard-card settings-card seo-card"><p>Posicionamiento</p><h2>SEO y compartir</h2><Field label="Título del sitio" value={content.seo.title} onChange={(value) => setGroup("seo", { ...content.seo, title: value })} /><Field label="Descripción" value={content.seo.description} onChange={(value) => setGroup("seo", { ...content.seo, description: value })} textarea /><div className="search-preview"><span>Dominio configurado para esta instalación</span><strong>{content.seo.title}</strong><p>{content.seo.description}</p></div></section>
                <section className="dashboard-card settings-card security-card"><p>Seguridad</p><h2>Acceso privado</h2><div className="security-state"><ShieldIcon /><div><strong>Protección activa</strong><span>Cookie HttpOnly · SameSite Strict · sesión de 10 horas</span></div></div><p className="security-copy">Para cambiar el acceso, ejecuta de nuevo <code>npm run setup</code> y actualiza las tres variables del administrador en el proveedor. La contraseña nunca se almacena en texto plano.</p><button className="secondary-admin-button" onClick={logout}>Cerrar esta sesión <ArrowRight /></button></section>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
