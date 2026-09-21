# Conservación antes del retiro de Vercel

Fecha: **20 de septiembre de 2026**. El proyecto `nacar-piscinas-juan` fue eliminado de Vercel; la API confirmó la eliminación con HTTP 204 y su ausencia posterior con HTTP 404. El repositorio de GitHub permanece disponible.

- La última versión de producción estaba en `main`, commit `15975530e44bc1075e6e364ce5d397ea7cf83b8b`.
- Se revisaron los 27 despliegues conservados por Vercel. Sus 23 commits de Git están accesibles en ramas o etiquetas del repositorio.
- Se recuperaron seis commits históricos que habían dejado de tener una rama remota, bajo etiquetas `archive/vercel-2026-09-20/<sha>`.
- Se recuperaron los archivos fuente de cuatro despliegues iniciales enviados por CLI. Cada archivo se contrastó con el SHA-1 del manifiesto de Vercel. Están en las etiquetas `archive/vercel-cli/<deployment-id>`, como instantáneas históricas independientes de `main`.
- Los cuatro documentos privados del CMS, 27.098 bytes en total, se descargaron completos y se registró su SHA-256 en un respaldo privado. El documento vigente coincide con `defaultSiteContent` de `lib/cms.ts`, salvo `updatedAt`; no hay contenido editorial ni imágenes nuevas pendientes de incorporar al código.
- La configuración y las variables recuperables se guardaron fuera del repositorio. Las variables marcadas como sensibles que Vercel no permite exportar deben regenerarse si se crea otra instalación.

El almacén privado `nacar-cms-data` **no fue eliminado**: la CLI de Vercel exige que lo haga el propietario de forma interactiva. Queda respaldado y pendiente de ese paso manual. Los respaldos privados, las credenciales y los datos operativos no se publican en GitHub.

Las instantáneas antiguas sirven para conservación; no se recomiendan como versión de producción. Una nueva instalación debe partir de `main`, configurar un alojamiento nuevo y generar sus propias credenciales siguiendo el README.
