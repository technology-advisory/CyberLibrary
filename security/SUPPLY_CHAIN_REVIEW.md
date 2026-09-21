# P13.4 — Supply Chain Review

Fecha de revisión: 16/09/2026
Proyecto: CyberLibrary AI
Ámbito: árbol estático aprobado tras P13.1/P13.3 y mejoras editoriales posteriores.

## Resultado ejecutivo

La superficie de cadena de suministro del runtime es reducida. CyberLibrary AI se entrega como HTML/CSS/JS estático y no incorpora un gestor de paquetes ni dependencias de ejecución de terceros.

### Confirmado

- 0 `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, `requirements.txt` o equivalentes.
- 0 scripts, hojas CSS, imágenes, iframes, audio o vídeo cargados desde CDNs/dominios externos en runtime.
- Los enlaces externos existentes son navegación saliente; no ejecutan código remoto dentro del sitio.
- 0 archivos `.env`.
- 0 claves privadas/certificados privados detectados.
- 0 patrones de credenciales/API keys detectados por búsqueda estática.
- 0 source maps (`*.map`).
- 0 ZIP/TAR/7Z/RAR de backup o distribución dentro del árbol público.
- 17/17 JavaScript locales referenciados por páginas activas.
- 31/31 CSS locales referenciados por páginas activas.
- 0 JS/CSS huérfanos detectados.
- Las cargas `fetch()` identificadas se dirigen a recursos JSON locales del propio sitio.

## Riesgo residual

1. Los datos y recursos locales siguen formando parte de la cadena de suministro del despliegue: un cambio malicioso en repositorio, estación de trabajo o pipeline podría modificar HTML/JS/CSS/JSON antes de publicar.
2. Los enlaces externos pueden cambiar de contenido o destino aunque no ejecuten código en CyberLibrary.
3. La ausencia de dependencias de terceros reduce, pero no elimina, el riesgo de compromiso del repositorio, cuenta de Cloudflare o proceso de publicación.
4. La baseline SHA-256 de P13.5 permite detectar desviaciones del árbol local aprobado, pero no sustituye controles de acceso, MFA, revisión de cambios ni protección de la cuenta/pipeline.

## Criterio operativo

- Mantener el sitio sin dependencias remotas de runtime salvo necesidad justificada.
- Si en el futuro se introduce un paquete, CDN o librería externa, registrar proveedor, versión, licencia, procedencia y método de actualización.
- Recalcular la baseline de integridad únicamente después de aprobar una nueva versión.
- Conservar una copia de la baseline fuera del hosting publicado para poder compararla tras un incidente.
