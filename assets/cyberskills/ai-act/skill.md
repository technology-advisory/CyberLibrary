---
id: CS-03
name: ai-act
title: AI Act Classification
version: 1.0
status: Validada
category: RIESGO Y CUMPLIMIENTO
source: CyberLibrary AI
author: "No definido"
responsible: "No definido"
last_review: 18/09/2026
criticality: Alta
execution_role: "Compliance Officer / AI Governance Lead, con validación jurídica cuando corresponda"
estimated_execution: "2–6 horas según complejidad de roles, finalidad y caso de uso"
integrity: "SHA-256 detached in skill.sha256"
non_repudiation: false
---

# AI Act Classification

## 1. Metadatos operativos
- **Identificador:** CS-03
- **Versión / estado:** v1.0 · Validada
- **Autor:** No definido
- **Responsable:** No definido
- **Fecha de última revisión:** 18/09/2026
- **Criticidad:** Alta
- **Rol que ejecuta:** Compliance Officer / AI Governance Lead, con validación jurídica cuando corresponda
- **Tiempo estimado:** 2–6 horas según complejidad de roles, finalidad y caso de uso
- **Marcos de referencia:** Reglamento (UE) 2024/1689 (AI Act); RGPD cuando exista tratamiento de datos personales; ISO/IEC 42001 como referencia de gobierno, no como criterio jurídico de clasificación

## 2. Objetivo
Documentar una clasificación preliminar y trazable del sistema frente al AI Act, identificando finalidad prevista, actores, ámbito, posibles prohibiciones, condiciones de alto riesgo, transparencia y puntos que requieren validación jurídica.

**Límite explícito:** No emite una opinión jurídica vinculante, no sustituye el análisis contractual o sectorial y no presume que una clasificación técnica sea definitiva cuando existan hechos o roles ambiguos.

## 3. Cuándo se usa
### Disparadores
- Antes de aprobar un nuevo caso de uso de IA en la UE o introducirlo en el mercado/ponerlo en servicio.
- Cuando cambien finalidad prevista, usuarios, decisiones afectadas, modelo, integración en producto o rol de la organización.
- Durante due diligence, auditoría, evaluación de proveedor o revisión de cumplimiento.

### Skills relacionadas
LLM Security Review, Secure RAG Review, AI Agent Security Review o Cloud AI Security Baseline pueden aportar evidencia técnica; la clasificación jurídica se mantiene separada de esas revisiones.

## 4. Entradas mínimas
- **Obligatoria:** Descripción de la finalidad prevista, usuarios objetivo y decisiones/procesos sobre los que actúa el sistema.
- **Obligatoria:** Identificación de la organización y terceros en los roles relevantes: proveedor, responsable del despliegue/deployer, importador o distribuidor cuando aplique.
- **Obligatoria:** Descripción funcional del sistema y del contexto de despliegue, incluido sector y población afectada.
- **Obligatoria:** Información sobre si el sistema se integra en un producto regulado o componente de seguridad.
- **Obligatoria:** Datos utilizados y resultados generados, incluyendo si afectan a personas físicas o decisiones con efectos relevantes.
- **Obligatoria:** Documentación del modelo de propósito general cuando resulte relevante para el caso.
- **Opcional:** Opiniones jurídicas previas, clasificación interna, contratos o documentación del proveedor que sustenten roles y finalidad.

## 5. Secuencia operativa
1. **Fijar el objeto de clasificación.** Definir exactamente qué sistema/versión, finalidad prevista, territorio y organización se clasifican.
   - Entregable intermedio: Ficha de objeto, versión y finalidad.
2. **Determinar ámbito y roles.** Registrar si el caso entra en el ámbito del AI Act y qué roles regulatorios corresponden a cada participante, dejando supuestos explícitos.
   - Entregable intermedio: Matriz organización → rol → evidencia.
3. **Comprobar prácticas prohibidas.** Contrastar la finalidad y funcionamiento con las prohibiciones aplicables del AI Act sin inferir hechos no documentados.
   - Entregable intermedio: Registro de comprobación y evidencias.
4. **Evaluar posibles rutas de alto riesgo.** Revisar criterios del artículo 6 y anexos pertinentes, incluida la relación con productos regulados y casos del Anexo III cuando aplique.
   - Entregable intermedio: Matriz de clasificación de alto riesgo y fundamento.
5. **Revisar obligaciones de transparencia y GPAI cuando proceda.** Identificar si el caso activa obligaciones específicas de transparencia o elementos relativos a modelos de propósito general.
   - Entregable intermedio: Registro de obligaciones potenciales y supuestos.
6. **Documentar incertidumbres y validación.** Separar hecho, interpretación y punto jurídico abierto; registrar qué debe validar Legal/Compliance.
   - Entregable intermedio: Lista de cuestiones abiertas y responsable de validación.
7. **Emitir clasificación preliminar.** Consolidar conclusión, base normativa, evidencias, versión y fecha sin presentarla como opinión jurídica vinculante.
   - Entregable intermedio: Matriz de clasificación AI Act y expediente de evidencia.

## 6. Controles y evidencias
- **Trazabilidad de finalidad prevista:** La clasificación debe referenciar una versión concreta de la descripción funcional y de la finalidad; evidencia: documento aprobado o ticket/versionado.
- **Asignación de roles:** Cada rol atribuido debe apoyarse en hechos, contrato o responsabilidad documentada; evidencia: RACI, contrato o documentación organizativa.
- **Referencia normativa:** Cada conclusión debe vincularse a la disposición aplicable del AI Act; evidencia: matriz de clasificación con cita normativa.
- **Gestión de supuestos:** Los supuestos no confirmados se mantienen separados de hechos; evidencia: registro de supuestos y cuestiones abiertas.
- **Revisión por cambio material:** Cambios en finalidad, integración, población o rol obligan a reabrir la clasificación; evidencia: control de versiones/revisión.

## 7. Criterios de aceptación
- Objeto, finalidad y versión del sistema están identificados inequívocamente.
- Los roles regulatorios están documentados con su evidencia o marcados como no definidos.
- Se han revisado de forma explícita prohibiciones, ruta de alto riesgo y transparencia cuando aplican.
- Toda conclusión contiene referencia normativa y evidencia factual.
- Los puntos jurídicos no resueltos están escalados y la salida se etiqueta como clasificación preliminar.

### Condiciones de escalado
- Ambigüedad sobre finalidad prevista o rol regulatorio.
- Posible práctica prohibida.
- Clasificación de alto riesgo dudosa o dependiente de interpretación sectorial.
- Excepción, derogación o condición cuya interpretación tenga impacto jurídico material.
- Conflicto entre documentación del proveedor y uso real del sistema.

## 8. Salida esperada
Matriz de clasificación preliminar AI Act con objeto, finalidad, roles, análisis de ámbito, prohibiciones, alto riesgo, transparencia, referencias normativas, evidencias y cuestiones abiertas. Destino: expediente de gobierno/compliance y revisión jurídica cuando sea necesaria.

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
- Reglamento (UE) 2024/1689 (AI Act)
- RGPD cuando exista tratamiento de datos personales
- ISO/IEC 42001 como referencia de gobierno, no como criterio jurídico de clasificación
