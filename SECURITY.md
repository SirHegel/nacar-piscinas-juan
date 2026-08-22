# Seguridad

Este repositorio no incluye usuarios, contraseñas, hashes, tokens ni datos de prospectos. La configuración sensible pertenece a cada instalación y debe vivir en `.env.local` o en el gestor de secretos del proveedor.

## Primer arranque

Ejecuta `npm run setup` desde una terminal privada. El comando solicita un usuario y una contraseña, guarda solamente un hash scrypt con sal aleatoria, genera un secreto de sesión criptográfico y protege `.env.local` con permisos `600`.

No existe una cuenta predeterminada ni un endpoint web de alta inicial. Esta decisión evita que un tercero reclame una instalación nueva antes que su propietario.

## Reglas de operación

- Nunca confirmes archivos `.env*` salvo `.env.example`.
- Configura los secretos de producción directamente en Vercel o en el proveedor elegido.
- No envíes contraseñas, hashes o tokens por chat, correo, incidencias o pull requests.
- Si un secreto se expone, revócalo en el proveedor, ejecuta de nuevo `npm run setup` y reemplaza todas sus copias.
- Conserva privado el almacenamiento Blob: el CMS y los prospectos usan acceso de servidor.
- Define `SITE_URL` con el origen HTTPS exacto y activa el rate limit o firewall del proveedor en producción.
- Ejecuta `npm run check`, `npm run scan:secrets` y `npm run audit:security` antes de cada entrega.

## Reportar una vulnerabilidad

No abras una incidencia pública con detalles explotables. Usa un aviso de seguridad privado de GitHub o contacta directamente al propietario del repositorio.
