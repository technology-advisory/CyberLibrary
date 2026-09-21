---
id: CS-05
name: agent-security
title: AI Agent Security Review
version: 1.0
status: Validada
category: AGENTES
source: CyberLibrary AI
author: "No definido"
responsible: "No definido"
last_review: 18/09/2026
criticality: Alta
execution_role: "AI Security Architect / Security Engineer"
estimated_execution: "4–10 horas según número de herramientas, autonomía y entornos afectados"
integrity: "SHA-256 detached in skill.sha256"
non_repudiation: false
---

# AI Agent Security Review

## 1. Metadatos operativos
- **Identificador:** CS-05
- **Versión / estado:** v1.0 · Validada
- **Autor:** No definido
- **Responsable:** No definido
- **Fecha de última revisión:** 18/09/2026
- **Criticidad:** Alta
- **Rol que ejecuta:** AI Security Architect / Security Engineer
- **Tiempo estimado:** 4–10 horas según número de herramientas, autonomía y entornos afectados
- **Marcos de referencia:** ISO/IEC 27001; NIST AI RMF; NIST CSF 2.0; OWASP GenAI Security Project; AI Act cuando resulte aplicable al sistema

## 2. Objetivo
Evaluar si un agente de IA opera dentro de un perímetro de autoridad explícito y verificable, con identidades, herramientas, memoria, límites, aprobación humana, observabilidad y mecanismos de detención acordes a su impacto.

**Límite explícito:** No aprueba decisiones de negocio o legales delegadas al agente, no valida por sí sola la seguridad interna de cada herramienta y no autoriza acciones ofensivas o destructivas fuera de un entorno controlado.

## 3. Cuándo se usa
### Disparadores
- Antes de habilitar autonomía, ejecución de herramientas o acceso a sistemas productivos.
- Al añadir herramientas, memoria persistente, agentes subordinados, nuevas identidades o nuevos dominios de acción.
- Después de una ejecución no prevista, bucle, acción incorrecta, abuso de herramienta o incidente de autorización.

### Skills relacionadas
LLM Security Review para el componente de modelo; MCP Security Review para herramientas MCP; Cloud AI Security Baseline cuando identidades y runtime residan en cloud.

## 4. Entradas mínimas
- **Obligatoria:** Diagrama del agente: planner/orchestrator, ejecutores, subagentes, memoria, herramientas y sistemas alcanzables.
- **Obligatoria:** Catálogo de acciones permitidas y prohibidas, incluidas operaciones con efecto externo o irreversible.
- **Obligatoria:** Identidades y credenciales utilizadas por agente, subagentes y herramientas, con permisos efectivos.
- **Obligatoria:** Política de aprobación humana y puntos exactos donde se exige confirmación.
- **Obligatoria:** Configuración de memoria/estado, duración, aislamiento y datos que puede persistir.
- **Obligatoria:** Límites de ejecución: presupuesto, número de pasos, timeouts, rate limits y kill switch/disable.
- **Obligatoria:** Logs o trazas que permitan reconstruir plan, tool calls, aprobaciones y resultados.
- **Opcional:** Escenarios de prueba, simulaciones o incidentes previos del agente.

## 5. Secuencia operativa
1. **Definir el perímetro de autoridad.** Enumerar acciones posibles, sistemas alcanzables, efectos externos y operaciones irreversibles.
   - Entregable intermedio: Matriz acción → sistema → impacto → autorización.
2. **Revisar identidades y delegación.** Comprobar identidades por componente, scopes, credenciales y ausencia de privilegios heredados innecesarios.
   - Entregable intermedio: Matriz agente/subagente → identidad → permiso.
3. **Verificar gates humanos.** Identificar qué acciones requieren confirmación y comprobar que el gate sea técnico, no solo una instrucción en prompt.
   - Entregable intermedio: Mapa de puntos de aprobación y evidencia de enforcement.
4. **Revisar memoria y estado.** Comprobar qué se persiste, quién puede leer/escribir y cómo se evita contaminación o reutilización entre contextos.
   - Entregable intermedio: Matriz de memoria/estado y controles de aislamiento.
5. **Probar límites de autonomía.** Ejecutar escenarios controlados de bucle, objetivos ambiguos, fallos de herramienta, reintentos y solicitudes fuera de alcance.
   - Entregable intermedio: Bitácora de pruebas de autonomía y contención.
6. **Verificar detención y recuperación.** Comprobar timeout, presupuesto, kill switch, revocación de credenciales y recuperación tras fallo.
   - Entregable intermedio: Evidencia de detención/revocación y procedimiento asociado.
7. **Verificar trazabilidad.** Confirmar que pueden reconstruirse plan, decisiones, tool calls, aprobaciones y resultado.
   - Entregable intermedio: Traza completa de una ejecución de prueba.
8. **Cerrar la revisión.** Registrar hallazgos, riesgo residual y decisiones que exigen aprobación humana.
   - Entregable intermedio: Informe AI Agent Security Review.

## 6. Controles y evidencias
- **Perímetro de autoridad:** Acciones permitidas/prohibidas expresas; evidencia: policy/configuración y tool allowlist.
- **Mínimo privilegio por identidad:** Scopes limitados por agente/herramienta; evidencia: IAM y tokens/roles configurados.
- **Aprobación humana efectiva:** Gate técnico antes de acciones de alto impacto; evidencia: workflow/configuración y logs.
- **Límites de autonomía:** Máximo de pasos, presupuesto, tiempo y reintentos; evidencia: configuración y prueba.
- **Memoria aislada:** Separación por usuario/tarea/tenant según aplique; evidencia: configuración y pruebas cruzadas.
- **Kill switch y revocación:** Capacidad de detener ejecución y cortar credenciales; evidencia: prueba o procedimiento verificable.
- **Trazabilidad de ejecución:** Plan, tool calls, aprobaciones y resultado correlacionables; evidencia: traza completa.

## 7. Criterios de aceptación
- El perímetro de autoridad está documentado y coincide con permisos efectivos.
- Las acciones de alto impacto tienen gate humano cuando se haya definido como obligatorio.
- El agente puede detenerse y sus credenciales pueden revocarse de forma verificable.
- La memoria no expone datos entre contextos probados.
- Una ejecución de prueba puede reconstruirse de extremo a extremo.
- Los riesgos altos relacionados con autonomía quedan escalados antes de producción.

### Condiciones de escalado
- Capacidad de ejecutar acciones irreversibles sin aprobación o límite técnico.
- Permisos amplios compartidos entre agente y otros servicios.
- Ausencia de kill switch o incapacidad de revocar credenciales.
- Decisiones con impacto legal, financiero, laboral, sanitario o de seguridad física sin autoridad humana definida.

## 8. Salida esperada
Informe AI Agent Security Review con perímetro de autoridad, matriz de identidades/herramientas, gates humanos, límites de autonomía, pruebas, trazas, hallazgos y riesgo residual. Destino: expediente técnico y de gobierno del agente.

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
