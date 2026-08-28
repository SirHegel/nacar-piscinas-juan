# NÁCAR — Sistemas minerales por Juan

Landing premium para presentar y vender proyectos de tratamiento mineral con magnesio para piscinas. Incluye sitio público, formulario de diagnóstico, CMS privado y bandeja de prospectos.

## Primer arranque seguro

El repositorio se entrega sin usuario, contraseña, hash, secreto de sesión, token de almacenamiento ni datos de prospectos. Tampoco existe una cuenta predeterminada.

```bash
npm ci
cp .env.example .env.local
npm run setup
```

`npm run setup` solicita en una terminal privada el usuario y una contraseña de al menos 14 caracteres elegidos por el nuevo propietario. La contraseña no se escribe en ningún archivo: se guarda solamente un hash scrypt con sal aleatoria. El comando también genera un secreto de sesión y deja `.env.local` con permisos `600`.

Después hay que configurar un almacenamiento privado de Vercel Blob y agregar su token como `BLOB_READ_WRITE_TOKEN` en `.env.local`. Se puede vincular un proyecto propio y descargar sus variables con:

```bash
npx vercel link
npx vercel env pull .env.local
npm run setup
```

Si `.env.local` ya contiene un acceso, el comando exige escribir `ROTAR` antes de reemplazarlo. Conserva las demás variables. Para iniciar:

```bash
npm run dev
```

Abre `http://localhost:3000`. El panel privado está en `/admin/login` y permanece bloqueado si falta o es inválida cualquiera de sus variables. El alta inicial se hace solo desde la terminal, nunca desde una ruta pública de Internet.

## Variables de entorno

Usa [.env.example](.env.example) como inventario, sin colocar valores reales en ese archivo:

```env
BLOB_READ_WRITE_TOKEN=
SITE_URL=
ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
LEAD_WEBHOOK_URL=
RESEND_API_KEY=
LEADS_TO_EMAIL=
LEADS_FROM_EMAIL=
```

Para producción, define `SITE_URL` con el origen HTTPS completo y registra los valores mediante el gestor de secretos de Vercel o del proveedor elegido. No subas `.env.local`, no pegues secretos en incidencias o pull requests y no uses variables `NEXT_PUBLIC_` para información sensible.

## CMS, acceso y almacenamiento

El panel permite editar la marca, portada, secciones, tarjetas, proceso, FAQ, SEO, contacto e imagen principal; también permite activar u ocultar módulos completos y publicar los cambios.

Los contenidos y prospectos se guardan como JSON privado en Vercel Blob. Los prospectos tienen estados, notas internas y borrado definitivo desde el panel. La sesión dura diez horas, está firmada mediante HMAC y usa una cookie `HttpOnly`, `SameSite=Strict` y `Secure` en producción. El acceso aplica validación de origen y limitación local de intentos; en despliegues distribuidos también debe activarse el rate limit o firewall del proveedor.

## Contactos y entrega de solicitudes

El formulario valida, evita duplicados por reintento, genera una referencia y guarda cada solicitud en la bandeja privada. El WhatsApp y el correo comercial se configuran desde “Marca y contacto” dentro del panel; el número debe usar formato internacional sin `+`, espacios ni guiones.

`LEAD_WEBHOOK_URL` permite enviar además cada solicitud a un webhook HTTPS de Zapier (`hooks.zapier.com/hooks/catch/...`) o Make (`hook.eu1.make.com`, `hook.eu2.make.com`, `hook.us1.make.com` y `hook.us2.make.com`). El servidor reconstruye el destino sobre esos orígenes fijos, valida los tokens y no sigue redirecciones; no se admiten hosts privados, puertos, credenciales, consultas ni fragmentos. Como alternativa, `RESEND_API_KEY`, `LEADS_TO_EMAIL` y `LEADS_FROM_EMAIL` habilitan avisos por correo. Sin esas variables opcionales, las solicitudes siguen guardadas en el CRM privado.

## Verificación

```bash
npm run typecheck
npm test
npm run build
npm run scan:secrets
npm run audit:security
```

GitHub Actions repite estas comprobaciones en cada cambio y Dependabot revisa dependencias de npm y acciones. Consulta [SECURITY.md](SECURITY.md) antes de desplegar o compartir una instalación.

## Identidad

- Concepto: lujo mineral silencioso
- Obsidiana: `#071512`
- Piedra cálida: `#F2EFE6`
- Turquesa mineral: `#9DCAC2`
- Bronce: `#CDB574`
- Titulares: Newsreader
- Interfaz: Manrope

El nombre NÁCAR es una propuesta creativa para revisión. Antes de convertirlo en marca definitiva conviene validar disponibilidad comercial y de dominio.
