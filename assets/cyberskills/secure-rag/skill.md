---
id: CS-02
name: secure-rag
title: Secure RAG Review
version: 1.0
status: Validada
category: ARQUITECTURA SEGURA
source: CyberLibrary AI
author: "No definido"
responsible: "No definido"
last_review: 18/09/2026
criticality: Alta
execution_role: "Security Architect / AI Architect"
estimated_execution: "4–8 horas para revisión documental; pruebas de recuperación y aislamiento pueden ampliar el tiempo"
integrity: "SHA-256 detached in skill.sha256"
non_repudiation: false
---

# Secure RAG Review

## 1. Metadatos operativos
- **Identificador:** CS-02
- **Versión / estado:** v1.0 · Validada
- **Autor:** No definido
- **Responsable:** No definido
- **Fecha de última revisión:** 18/09/2026
- **Criticidad:** Alta
- **Rol que ejecuta:** Security Architect / AI Architect
- **Tiempo estimado:** 4–8 horas para revisión documental; pruebas de recuperación y aislamiento pueden ampliar el tiempo
- **Marcos de referencia:** ISO/IEC 27001; NIST AI RMF; NIST CSF 2.0; OWASP GenAI Security Project; ENS, DORA o NIS2 cuando resulten aplicables al entorno

## 2. Objetivo
Revisar la cadena completa de una arquitectura RAG para determinar si la ingesta, procedencia, indexación, autorización, recuperación y ensamblado de contexto preservan confidencialidad, integridad y separación entre fuentes y usuarios.

**Límite explícito:** No valida por sí sola la exactitud factual del contenido recuperado ni sustituye la clasificación documental, revisión legal de derechos de uso o evaluación general del LLM.

## 3. Cuándo se usa
### Disparadores
- Antes de habilitar una nueva fuente documental o colección en un RAG.
- Tras modificar chunking, embeddings, vector store, filtros de recuperación, ACL o tenancy.
- Ante indicios de poisoning, fuga entre usuarios/tenants, recuperación indebida o eliminación incompleta.

### Skills relacionadas
LLM Security Review para controles del modelo y prompt; Cloud AI Security Baseline cuando el RAG se despliegue en servicios cloud gestionados.

## 4. Entradas mínimas
- **Obligatoria:** Inventario de fuentes documentales y propietario de cada fuente.
- **Obligatoria:** Diagrama del pipeline de ingesta: adquisición, validación, transformación, chunking, embeddings e indexación.
- **Obligatoria:** Configuración del vector store/índice, namespaces o mecanismo equivalente de segregación.
- **Obligatoria:** Modelo de autorización de documentos y forma en que las ACL se propagan a la recuperación.
- **Obligatoria:** Metadatos de procedencia almacenados por documento/chunk y mecanismo de actualización/eliminación.
- **Obligatoria:** Consultas o filtros de recuperación, top-k/reranking y lógica de ensamblado del contexto.
- **Opcional:** Muestras de documentos hostiles/controlados para pruebas de poisoning e indirect prompt injection.

## 5. Secuencia operativa
1. **Inventariar fuentes y procedencia.** Relacionar cada corpus con origen, propietario, clasificación, método de ingesta y autorización.
   - Entregable intermedio: Matriz fuente → propietario → clasificación → ingestión.
2. **Revisar la cadena de ingesta.** Comprobar validación de tipo/contenido, tratamiento de archivos, origen y cambios antes de indexar.
   - Entregable intermedio: Diagrama validado y lista de controles de ingesta.
3. **Verificar autorización en recuperación.** Comprobar que la decisión de acceso se aplique en consulta/recuperación y no dependa solo del texto generado por el modelo.
   - Entregable intermedio: Pruebas de acceso permitido/denegado y evidencia de filtros/ACL.
4. **Revisar aislamiento y tenancy.** Probar separación entre usuarios, proyectos o tenants y evitar recuperación cruzada no autorizada.
   - Entregable intermedio: Resultados de pruebas de aislamiento.
5. **Evaluar poisoning e instrucciones indirectas.** Introducir contenido controlado en un corpus de prueba y verificar que no pueda alterar indebidamente comportamiento, herramientas o políticas.
   - Entregable intermedio: Bitácora de pruebas de poisoning/inyección indirecta.
6. **Verificar actualización, borrado y reconstrucción.** Comprobar cómo se actualizan/eliminan documentos y chunks y si existe divergencia entre fuente e índice.
   - Entregable intermedio: Evidencia de baja/reindexación y trazabilidad de versiones.
7. **Cerrar la revisión.** Consolidar fallos de procedencia, autorización, aislamiento, integridad y trazabilidad.
   - Entregable intermedio: Informe Secure RAG Review y matriz de evidencias.

## 6. Controles y evidencias
- **Procedencia del contenido:** Cada documento/chunk debe conservar referencia a origen y versión; evidencia: metadatos del índice.
- **Autorización en retrieval:** La recuperación debe respetar permisos efectivos; evidencia: configuración de filtros/ACL y pruebas positivas/negativas.
- **Segregación:** Separación por tenant/proyecto/usuario cuando aplique; evidencia: namespaces, filtros, políticas y pruebas cruzadas.
- **Integridad de ingesta:** Controles sobre fuentes, tipos de archivo y transformaciones; evidencia: pipeline/configuración y logs.
- **Gestión del ciclo de vida:** Alta, actualización, borrado y reindexación trazables; evidencia: logs y pruebas de eliminación.
- **Resistencia a poisoning/inyección indirecta:** Contenido no confiable no debe convertirse en instrucción privilegiada; evidencia: pruebas controladas y configuración del ensamblado de contexto.

## 7. Criterios de aceptación
- Todas las fuentes del alcance tienen propietario y procedencia documentados.
- Las ACL o restricciones equivalentes se verifican en recuperación con pruebas reproducibles.
- No se observa acceso cruzado no autorizado entre dominios de seguridad probados.
- Los documentos retirados o actualizados no permanecen recuperables fuera de la política definida.
- Los fallos de poisoning o inyección indirecta con impacto alto quedan escalados.

### Condiciones de escalado
- Acceso a documentos sin autorización efectiva.
- Fuga entre tenants o ámbitos de datos.
- Ausencia de procedencia suficiente para reconstruir el origen del contexto.
- Derechos de uso, privacidad o retención documental no definidos y con impacto legal.

## 8. Salida esperada
Informe de arquitectura RAG segura con mapa de fuentes, pipeline, matriz de autorización, pruebas de aislamiento/poisoning, evidencias, hallazgos y riesgo residual. Destino: expediente de arquitectura y seguridad del sistema.

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
- ENS, DORA o NIS2 cuando resulten aplicables al entorno
