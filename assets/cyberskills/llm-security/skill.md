---
id: CS-01
name: llm-security
title: LLM Security Review
version: 1.0
status: Validada
category: SEGURIDAD DE IA
source: CyberLibrary AI
author: "No definido"
responsible: "No definido"
last_review: 18/09/2026
criticality: Alta
execution_role: "Security Engineer / AI Security Engineer"
estimated_execution: "4–8 horas para revisión documental; pruebas controladas pueden ampliar el tiempo"
integrity: "SHA-256 detached in skill.sha256"
non_repudiation: false
---

# LLM Security Review

## 1. Metadatos operativos
- **Identificador:** CS-01
- **Versión / estado:** v1.0 · Validada
- **Autor:** No definido
- **Responsable:** No definido
- **Fecha de última revisión:** 18/09/2026
- **Criticidad:** Alta
- **Rol que ejecuta:** Security Engineer / AI Security Engineer
- **Tiempo estimado:** 4–8 horas para revisión documental; pruebas controladas pueden ampliar el tiempo
- **Marcos de referencia:** ISO/IEC 27001; NIST AI RMF; NIST CSF 2.0; OWASP GenAI Security Project; AI Act cuando resulte aplicable al sistema

## 2. Objetivo
Revisar la superficie de ataque de una solución basada en LLM y determinar si entradas, contexto, herramientas, datos, salidas y dependencias están protegidos con controles verificables. Habilita una decisión de aceptación, remediación o escalado antes de producción o tras un cambio relevante.

**Límite explícito:** No certifica el modelo ni valida por sí sola cumplimiento jurídico, privacidad, seguridad del proveedor ni ausencia total de jailbreaks o prompt injection.

## 3. Cuándo se usa
### Disparadores
- Antes de poner en producción una aplicación con LLM o cambiar de modelo/proveedor.
- Tras incorporar herramientas, function calling, archivos, memoria, conectores o nuevas fuentes de datos.
- Durante una revisión de seguridad, auditoría técnica o respuesta a un incidente relacionado con el LLM.

### Skills relacionadas
Secure RAG Review cuando exista recuperación documental; MCP Security Review cuando las herramientas se publiquen mediante MCP; AI Agent Security Review cuando el LLM pueda planificar y ejecutar acciones autónomas.

## 4. Entradas mínimas
- **Obligatoria:** Diagrama de arquitectura y flujos de datos del componente LLM, incluyendo proveedor, endpoints y fronteras de confianza.
- **Obligatoria:** Inventario de modelos, versiones y parámetros de despliegue utilizados en el entorno revisado.
- **Obligatoria:** System prompts, plantillas de prompt, reglas de tool/function calling y política de contexto accesible al modelo.
- **Obligatoria:** Matriz de identidades y permisos de usuarios, servicios y herramientas invocables por el LLM.
- **Obligatoria:** Clasificación de los datos que pueden entrar en prompts, contexto, memoria o salidas.
- **Obligatoria:** Configuración de logging, retención, filtros/guardrails, límites de uso y gestión de secretos.
- **Opcional:** Resultados previos de red team, pruebas de jailbreak, prompt injection o evaluación de abuso.

## 5. Secuencia operativa
1. **Delimitar la superficie LLM.** Enumerar modelo, prompts, contexto, archivos, memoria, herramientas, APIs, usuarios, datos y dependencias externas.
   - Entregable intermedio: Mapa de superficie y fronteras de confianza.
2. **Revisar exposición de instrucciones y contexto.** Verificar qué instrucciones, secretos, datos internos o metadatos podrían filtrarse mediante interacción directa o indirecta.
   - Entregable intermedio: Registro de vectores de exposición y evidencia asociada.
3. **Evaluar prompt injection y abuso de instrucciones.** Ejecutar pruebas controladas sobre prompts directos e indirectos, instrucciones conflictivas y contenido no confiable sin salir del alcance autorizado.
   - Entregable intermedio: Bitácora de pruebas, resultado, entrada utilizada y comportamiento observado.
4. **Revisar herramientas y autorización.** Comprobar que cada herramienta opere con mínimo privilegio, validación de parámetros, autorización fuera del modelo y límites de acción.
   - Entregable intermedio: Matriz herramienta → identidad → permiso → control.
5. **Revisar datos, memoria y secretos.** Comprobar retención, aislamiento de sesión, tratamiento de PII/confidencial, secretos y persistencia de contexto.
   - Entregable intermedio: Matriz de datos y evidencias de configuración.
6. **Revisar salida, monitorización y respuesta.** Verificar controles de salida, registro de eventos, detección de abuso, límites, alertas y capacidad de revocación.
   - Entregable intermedio: Registro de cobertura de controles detectivos y de respuesta.
7. **Cerrar la revisión.** Consolidar hallazgos, riesgo residual, evidencia pendiente y puntos que requieren aprobación humana o del proveedor.
   - Entregable intermedio: Informe LLM Security Review y registro de pendientes.

## 6. Controles y evidencias
- **Aislamiento de instrucciones y datos:** Separación entre instrucciones de sistema, contenido no confiable y datos sensibles; evidencia: prompts/configuración y pruebas controladas.
- **Autorización de herramientas:** La autorización debe verificarse fuera de la decisión generada por el modelo; evidencia: IAM/policies, código o configuración y logs.
- **Gestión de secretos:** Ausencia de secretos embebidos en prompts, repositorios o parámetros visibles; evidencia: referencias a secret manager y configuración.
- **Mínimo privilegio y límites de acción:** Scopes, allowlists, cuotas, timeouts y restricciones de operación; evidencia: policies y configuración efectiva.
- **Trazabilidad:** Registro suficiente para asociar usuario/sesión, modelo, herramienta y acción; evidencia: muestra de logs y política de retención.
- **Controles de abuso:** Rate limiting, detección de patrones anómalos y mecanismos de bloqueo; evidencia: configuración y eventos de prueba.

## 7. Criterios de aceptación
- Todos los componentes LLM y herramientas relevantes están dentro del alcance documentado.
- Todas las entradas obligatorias han sido revisadas o su ausencia está registrada como limitación.
- Cada hallazgo referencia una evidencia concreta o declara expresamente que la evidencia está pendiente.
- Las pruebas controladas son reproducibles y no exceden el alcance autorizado.
- Los riesgos altos no aceptados quedan escalados con propietario y decisión pendiente.

### Condiciones de escalado
- Exposición confirmada de secretos, datos sensibles o capacidad de acción no autorizada.
- Controles del proveedor no verificables que resulten determinantes para el riesgo.
- Impacto jurídico o de privacidad que requiera DPO/Legal/Compliance.
- Necesidad de pruebas ofensivas fuera del entorno o alcance expresamente autorizado.

## 8. Salida esperada
Informe de revisión de seguridad LLM con alcance, mapa de superficie, matriz de herramientas/permisos, pruebas ejecutadas, evidencias, hallazgos, riesgo residual y acciones pendientes. Destino: expediente técnico o repositorio de evidencias definido por el proyecto.

## 9. Límites y escalado
La skill no decide por sí sola cuestiones jurídicas, aceptación de riesgo, excepciones de seguridad ni garantías del fabricante que no puedan demostrarse con evidencia. No deben asumirse controles, permisos, configuraciones ni estados que no hayan sido verificados. Los puntos abiertos se registran y se escalan al responsable humano correspondiente.

## 10. SKILL.md portable
- **Estructura:** este fichero contiene metadatos, objetivo, triggers, entradas, secuencia, controles/evidencias, criterios de aceptación, salida, límites y referencias.
- **Generación:** representa el mismo contenido operativo publicado en la vista HTML de la skill. En esta versión la sincronización se realiza como parte de la publicación del contenido; no se declara un generador automático independiente.
- **Versionado y congelación:** una versión con estado `Validada` se considera congelada. Los cambios sustantivos deben quedar asociados a una nueva versión; no se sobrescribe silenciosamente el contenido validado.
- **Integridad:** el fichero `skill.sha256` contiene el SHA-256 de este `skill.md`. Sirve para detectar alteraciones y no constituye firma digital, sellado temporal confiable ni no repudio.
- **Autor y fecha:** los campos `author`, `responsible` y `last_review` forman parte de los metadatos. Autor y responsable están actualmente `No definido` porque no consta una asignación formal.
- **Importación / exportación:** puede copiarse como Markdown UTF-8 junto con su `skill.sha256`. No depende del HTML para ser legible.
- **Relación con HTML:** HTML y SKILL.md describen la misma skill y versión. El HTML es la representación de consulta; el SKILL.md es la representación portable. Una discrepancia entre ambos debe tratarse como incidencia de publicación.

## Referencias de marco
- ISO/IEC 27001
- NIST AI RMF
- NIST CSF 2.0
- OWASP GenAI Security Project
- AI Act cuando resulte aplicable al sistema
