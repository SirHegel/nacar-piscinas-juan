# NÁCAR — Sistemas minerales por Juan

Landing premium para presentar y vender proyectos de tratamiento mineral con magnesio para piscinas.

## Enlaces

- Producción: https://nacar-piscinas-juan.vercel.app
- Proyecto Vercel: `sir-hegel/nacar-piscinas-juan`

## Ejecutar en local

```bash
npm install
npm run dev
```

Después, abrir `http://localhost:3000`.

## Contactos y entrega de solicitudes

El formulario valida, envía al endpoint `/api/lead`, genera una referencia y prepara el resumen para WhatsApp. Para dirigir los contactos a Juan, configurar en Vercel:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
```

Usar el número internacional sin `+`, espacios ni guiones y volver a desplegar.

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

Sin esas variables, las solicitudes de prueba se registran de forma estructurada en los logs de funciones de Vercel.

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
- Lighthouse: 100 en accesibilidad, buenas prácticas y SEO
- Proyecto desplegado directamente desde local, sin GitHub
