---
id: CS-06
name: cloud-ai
title: Cloud AI Security Baseline
version: 1.0
status: Validada
category: CLOUD
source: CyberLibrary AI
author: "No definido"
responsible: "No definido"
last_review: 18/09/2026
criticality: Media
execution_role: "Cloud Security Architect / Cloud Architect"
estimated_execution: "4–8 horas por entorno; la revisión multi-cloud o multi-cuenta puede requerir más tiempo"
integrity: "SHA-256 detached in skill.sha256"
non_repudiation: false
---

# Cloud AI Security Baseline

## 1. Metadatos operativos
- **Identificador:** CS-06
- **Versión / estado:** v1.0 · Validada
- **Autor:** No definido
- **Responsable:** No definido
- **Fecha de última revisión:** 18/09/2026
- **Criticidad:** Media
- **Rol que ejecuta:** Cloud Security Architect / Cloud Architect
- **Tiempo estimado:** 4–8 horas por entorno; la revisión multi-cloud o multi-cuenta puede requerir más tiempo
- **Marcos de referencia:** ISO/IEC 27001; NIST CSF 2.0; NIST AI RMF; CSA Cloud Controls Matrix; ENS, DORA o NIS2 cuando resulten aplicables al entorno

## 2. Objetivo
Establecer y verificar una baseline de seguridad para servicios de IA desplegados en cloud, cubriendo identidad, red, cifrado, datos, secretos, logging, exposición de endpoints y controles operativos del proveedor.

**Límite explícito:** No sustituye una auditoría completa del cloud landing zone, no valida todos los servicios de la cuenta/suscripción/proyecto y no atribuye cumplimiento regulatorio por el mero cumplimiento de esta baseline.

## 3. Cuándo se usa
### Disparadores
- Antes de habilitar un servicio de IA cloud en producción.
- Al desplegar en una nueva cuenta/proyecto/suscripción, región o proveedor.
- Tras cambios relevantes de IAM, red, cifrado, endpoint, logging o tratamiento de datos.
- Durante revisión de arquitectura, hardening o auditoría de un workload de IA cloud.

### Skills relacionadas
LLM Security Review para la capa de aplicación/modelo; Secure RAG Review para recuperación documental; AI Agent Security Review para workloads autónomos.

## 4. Entradas mínimas
- **Obligatoria:** Inventario de cuentas/proyectos/suscripciones y servicios de IA incluidos en el alcance.
- **Obligatoria:** Diagrama de red con endpoints públicos/privados, subredes, gateways, egress y conectividad con otros entornos.
- **Obligatoria:** Export o matriz de IAM: roles, service principals/workload identities y privilegios administrativos.
- **Obligatoria:** Configuración de cifrado y claves/KMS aplicables a datos, almacenamiento y servicios de IA.
- **Obligatoria:** Inventario de buckets/storage, datasets, logs y datos enviados al servicio de IA, con región/ubicación.
- **Obligatoria:** Configuración de secretos y credenciales de aplicaciones/servicios.
- **Obligatoria:** Configuración de audit logs, monitorización, alertas, cuotas y políticas de retención.
- **Opcional:** Evidencia de políticas organizativas, CSPM, policy-as-code o baseline del proveedor ya aplicada.

## 5. Secuencia operativa
1. **Delimitar el entorno cloud.** Identificar cuentas/proyectos, regiones, servicios de IA, owners y dependencias.
   - Entregable intermedio: Inventario de alcance cloud.
2. **Revisar IAM y privilegios.** Verificar roles administrativos, identidades de workload, permisos de servicio y uso de credenciales estáticas.
   - Entregable intermedio: Matriz de privilegios y excepciones.
3. **Revisar exposición de red.** Comprobar endpoints públicos/privados, ingress, egress, DNS, peering y restricciones de acceso.
   - Entregable intermedio: Mapa de exposición y controles de red.
4. **Revisar cifrado, claves y secretos.** Verificar cifrado en tránsito/reposo, gestión de claves, rotación y almacenamiento de secretos.
   - Entregable intermedio: Matriz dato/servicio → clave/secreto → control.
5. **Revisar datos, región y retención.** Comprobar qué datos se envían al servicio, dónde se procesan/almacenan y qué retención/configuración aplica.
   - Entregable intermedio: Registro de datos y ubicación/retención.
6. **Revisar logging, alertas y cuotas.** Confirmar audit logs, eventos de administración, acceso, alertas, límites de consumo y cobertura de monitorización.
   - Entregable intermedio: Matriz evento → log → retención → alerta.
7. **Revisar configuración específica del servicio de IA.** Comprobar opciones de privacidad, exposición de endpoints, acceso a modelos y controles gestionados disponibles.
   - Entregable intermedio: Baseline de configuración efectiva.
8. **Cerrar baseline.** Registrar desviaciones, excepciones, evidencia y riesgo residual por entorno.
   - Entregable intermedio: Cloud AI Security Baseline y registro de excepciones.

## 6. Controles y evidencias
- **IAM mínimo privilegio:** Roles administrativos restringidos y workload identities cuando sea posible; evidencia: export IAM.
- **Exposición de red:** Endpoints y acceso limitados según arquitectura; evidencia: configuración de red/firewall/private endpoint.
- **Cifrado y claves:** Cifrado y KMS conforme a requisitos del entorno; evidencia: configuración de claves y servicios.
- **Secretos:** Uso de secret manager o mecanismo gestionado y ausencia de secretos embebidos; evidencia: referencias/configuración.
- **Trazabilidad cloud:** Audit logs de administración y acceso habilitados según capacidad del servicio; evidencia: configuración y muestra.
- **Datos y región:** Ubicación, retención y uso de datos documentados; evidencia: configuración del servicio y contrato/documentación cuando aplique.
- **Cuotas y protección de abuso:** Límites de consumo y alertas donde estén disponibles; evidencia: configuración efectiva.

## 7. Criterios de aceptación
- Todos los servicios y cuentas del alcance están inventariados con owner y región.
- Los privilegios administrativos y de workload están documentados y las excepciones justificadas.
- La exposición pública no prevista queda eliminada o escalada.
- Cifrado, claves, secretos y logs tienen evidencia verificable.
- Región y tratamiento de datos están documentados para el workload.
- Las desviaciones de baseline tienen propietario, riesgo y decisión registrada.

### Condiciones de escalado
- Endpoint o dato sensible expuesto públicamente sin justificación aprobada.
- Permisos administrativos excesivos o credenciales estáticas compartidas.
- Región, retención o uso de datos del proveedor incompatibles con requisitos jurídicos/contractuales.
- Control crítico dependiente del proveedor sin evidencia suficiente.

## 8. Salida esperada
Baseline de seguridad cloud para IA con inventario de servicios, IAM, red, cifrado, secretos, datos/región, logging, configuración específica, evidencias y excepciones. Destino: expediente de arquitectura cloud y registro de excepciones.

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
- NIST CSF 2.0
- NIST AI RMF
- CSA Cloud Controls Matrix
- ENS, DORA o NIS2 cuando resulten aplicables al entorno
