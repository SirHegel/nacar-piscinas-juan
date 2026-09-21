# NÁCAR — Sistemas minerales por Juan

Landing premium para presentar y vender proyectos de tratamiento mineral con magnesio para piscinas.

## Enlaces

- Producción: https://nacar-piscinas-juan.vercel.app
- Panel privado: https://nacar-piscinas-juan.vercel.app/admin/login
- Proyecto Vercel: `sir-hegel/nacar-piscinas-juan`

## Ejecutar en local

```bash
npm install
npm run dev
```

Después, abrir `http://localhost:3000`. El entorno local requiere las variables de Vercel; se descargan con:

```bash
vercel link
vercel env pull .env.local
```

## CMS, acceso y almacenamiento

El panel permite editar la marca, portada, secciones, tarjetas, proceso, FAQ, SEO, contacto e imagen principal; también permite activar u ocultar módulos completos y publicar los cambios.

Los contenidos y prospectos se guardan como JSON privado en Vercel Blob. Los prospectos tienen estados, notas internas y borrado definitivo desde el panel. La contraseña no se almacena en texto plano: `ADMIN_PASSWORD_HASH` usa scrypt y la sesión se firma con `ADMIN_SESSION_SECRET`.

Para generar un hash nuevo:

```bash
ADMIN_PASSWORD='una-contraseña-segura' node -e 'const c=require("node:crypto");const s=c.randomBytes(24);const h=c.scryptSync(process.env.ADMIN_PASSWORD,s,64);console.log(s.toString("hex")+":"+h.toString("hex"))'
```

Configurar en Vercel:

```env
BLOB_READ_WRITE_TOKEN=
ADMIN_USERNAME=juan
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
```

## Contactos y entrega de solicitudes

El formulario valida, evita duplicados por reintento, genera una referencia y guarda cada solicitud en la bandeja privada. El WhatsApp y el correo comercial se configuran desde “Marca y contacto” dentro del panel; el número debe usar formato internacional sin `+`, espacios ni guiones.

Para recibir además cada solicitud fuera de Vercel, se puede usar una de estas vías:

```env
LEAD_WEBHOOK_URL=
```

o:

```env
RESEND_API_KEY=
LEADS_TO_EMAIL=
LEADS_FROM_EMAIL=
```

Sin esas variables opcionales, las solicitudes siguen quedando guardadas y disponibles en el CRM privado.

## Identidad

- Concepto: lujo mineral silencioso
- Obsidiana: `#071512`
- Piedra cálida: `#F2EFE6`
- Turquesa mineral: `#9DCAC2`
- Bronce: `#CDB574`
- Titulares: Newsreader
- Interfaz: Manrope

El nombre NÁCAR es una propuesta creativa para revisión. Antes de convertirlo en marca definitiva conviene validar disponibilidad comercial y de dominio.

## Estado

- Build de producción verificado
- TypeScript verificado
- Responsive probado en escritorio y móvil
- Formulario y endpoint probados en producción
- CMS, login y bandeja persistente conectados a Vercel Blob privado
- Lighthouse: 100 en accesibilidad, buenas prácticas y SEO
- Proyecto desplegado directamente desde local, sin GitHub
