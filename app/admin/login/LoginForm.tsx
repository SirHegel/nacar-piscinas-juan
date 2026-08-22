"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, DropletIcon, ShieldIcon } from "@/app/components/Icons";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message || "No fue posible iniciar sesión.");
      window.location.assign("/admin");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No fue posible iniciar sesión.");
      setStatus("error");
    }
  };

  return (
    <main className="admin-login" id="contenido">
      <section className="login-brand-panel">
        <a className="admin-wordmark" href="/" aria-label="Volver al sitio NÁCAR">
          <span><DropletIcon /></span>
          <strong>NÁCAR</strong>
          <small>Studio privado</small>
        </a>
        <div className="login-manifesto">
          <p>Panel de operación</p>
          <h1>La marca, el contenido y cada oportunidad en un solo lugar.</h1>
          <span>Privado · Seguro · En tiempo real</span>
        </div>
        <div className="login-watermark">N</div>
      </section>

      <section className="login-form-panel">
        <form onSubmit={submit} className="admin-login-form">
          <div className="login-lock"><ShieldIcon /></div>
          <p className="admin-kicker">{configured ? "Acceso reservado" : "Primer arranque"}</p>
          <h2>{configured ? "Acceso al panel" : "Configuración pendiente"}</h2>
          <p className="login-intro">
            {configured
              ? "Inicia sesión para gestionar la página y las solicitudes."
              : "El panel permanece bloqueado hasta que el propietario defina sus propias credenciales."}
          </p>

          {configured ? (
            <>
              <label>
                <span>Usuario</span>
                <input
                  name="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                  autoFocus
                />
              </label>
              <label>
                <span>Contraseña</span>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              {status === "error" && <p className="login-error" role="alert">{message}</p>}

              <button className="admin-primary-button" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Verificando…" : "Entrar al panel"} <ArrowRight />
              </button>
              <p className="login-security"><ShieldIcon /> Sesión firmada y protegida con cookie segura.</p>
            </>
          ) : (
            <div className="login-setup-notice" role="status">
              <strong>Configuración privada requerida</strong>
              <p>Desde una terminal segura del proyecto, ejecuta <code>npm run setup</code> y configura las variables resultantes en el proveedor de despliegue.</p>
              <small>No hay usuario ni contraseña predeterminados y el alta no se permite desde Internet.</small>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
