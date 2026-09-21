---
id: CS-04
name: mcp-security
title: MCP Security Review
version: 1.0
status: Validada
category: SEGURIDAD DE IA
source: CyberLibrary AI
author: "No definido"
responsible: "No definido"
last_review: 18/09/2026
criticality: Alta
execution_role: "Security Engineer / Application Security Engineer"
estimated_execution: "3–6 horas por conjunto de servidores y herramientas; más si requiere revisión de código"
integrity: "SHA-256 detached in skill.sha256"
non_repudiation: false
---

# MCP Security Review

## 1. Metadatos operativos
- **Identificador:** CS-04
- **Versión / estado:** v1.0 · Validada
- **Autor:** No definido
- **Responsable:** No definido
- **Fecha de última revisión:** 18/09/2026
- **Criticidad:** Alta
- **Rol que ejecuta:** Security Engineer / Application Security Engineer
- **Tiempo estimado:** 3–6 horas por conjunto de servidores y herramientas; más si requiere revisión de código
- **Marcos de referencia:** ISO/IEC 27001; NIST CSF 2.0; NIST AI RMF; NIST Secure Software Development Framework (SSDF); OWASP GenAI Security Project

## 2. Objetivo
Revisar la seguridad de servidores, clientes, herramientas, recursos y prompts expuestos mediante MCP, verificando confianza, identidad, permisos, secretos, cadena de suministro y límites de ejecución.

**Límite explícito:** No valida la seguridad completa de la aplicación que consume MCP ni garantiza la ausencia de vulnerabilidades en dependencias o servicios externos fuera del alcance.

## 3. Cuándo se usa
### Disparadores
- Antes de registrar un nuevo servidor MCP o habilitar una herramienta para usuarios o agentes.
- Tras cambiar transporte, autenticación, scopes, tool definitions, paquetes o repositorios del servidor.
- Ante un incidente de tool abuse, ejecución inesperada, filtración de secretos o compromiso de la cadena de suministro.

### Skills relacionadas
LLM Security Review cuando el cliente sea un LLM; AI Agent Security Review cuando las herramientas MCP formen parte de un agente autónomo; Cloud AI Security Baseline si el servidor se ejecuta en cloud.

## 4. Entradas mínimas
- **Obligatoria:** Inventario de servidores MCP, propietario, ubicación, transporte y clientes autorizados.
- **Obligatoria:** Definición de tools, resources y prompts expuestos por cada servidor.
- **Obligatoria:** Configuración de autenticación/autorización, scopes, identidades de servicio y credenciales utilizadas.
- **Obligatoria:** Repositorio, versión/commit, dependencias y método de despliegue del servidor MCP cuando sean propios.
- **Obligatoria:** Configuración de secretos, variables de entorno, filesystem y acceso de red/egress.
- **Obligatoria:** Logs de invocación de herramientas y errores, o evidencia de que no están habilitados.
- **Opcional:** SBOM, firma de paquetes o resultados de análisis de dependencias/código.

## 5. Secuencia operativa
1. **Inventariar servidores y superficie publicada.** Relacionar servidor, transporte, cliente, herramientas, recursos, prompts y propietario.
   - Entregable intermedio: Inventario MCP versionado.
2. **Verificar origen y cadena de suministro.** Comprobar repositorio, versión, dependencias, paquetes y procedencia del binario/imagen desplegada.
   - Entregable intermedio: Registro de versión, commit/digest y dependencias revisadas.
3. **Revisar autenticación y autorización.** Validar cómo se autentican clientes/usuarios y qué autorización efectiva protege cada capability.
   - Entregable intermedio: Matriz identidad → scope → tool/resource.
4. **Revisar contratos de herramientas.** Examinar parámetros, validación, operaciones destructivas, rutas, comandos y datos que puede alcanzar cada herramienta.
   - Entregable intermedio: Matriz herramienta → entrada → acción → límite.
5. **Revisar secretos y aislamiento de ejecución.** Comprobar secretos, filesystem, procesos, red, egress y privilegios del runtime.
   - Entregable intermedio: Evidencia de secret management y restricciones de entorno.
6. **Probar abuso de herramientas dentro del alcance.** Ejecutar casos controlados de parámetros inesperados, encadenamiento de herramientas y solicitudes no autorizadas.
   - Entregable intermedio: Bitácora de pruebas y resultados.
7. **Verificar auditoría y revocación.** Comprobar que las invocaciones relevantes sean trazables y que un servidor/credencial pueda revocarse.
   - Entregable intermedio: Muestra de logs y procedimiento/evidencia de revocación.
8. **Cerrar la revisión.** Consolidar riesgos de supply chain, permisos, tool abuse, secretos y trazabilidad.
   - Entregable intermedio: Informe MCP Security Review y registro de acciones.

## 6. Controles y evidencias
- **Inventario y procedencia:** Servidor y versión identificables; evidencia: repo, commit, digest o versión desplegada.
- **Autenticación y scopes:** Acceso limitado a clientes/usuarios autorizados; evidencia: configuración de auth y scopes.
- **Validación de parámetros:** Las herramientas validan entradas y no delegan seguridad al texto del modelo; evidencia: schema/código/configuración y pruebas.
- **Aislamiento de runtime:** Filesystem, procesos y egress limitados a lo necesario; evidencia: contenedor/sandbox/policies.
- **Gestión de secretos:** Credenciales fuera de código y tool descriptions; evidencia: secret manager/configuración.
- **Registro de invocaciones:** Actor, servidor, herramienta, parámetros sensibles tratados conforme a política y resultado; evidencia: logs de muestra.

## 7. Criterios de aceptación
- Todos los servidores y herramientas del alcance están inventariados con versión y propietario.
- No existen herramientas de alto impacto sin autorización y límites explícitos.
- Las credenciales y secretos no están embebidos en definiciones o código revisado.
- Las pruebas de abuso no consiguen operaciones fuera del permiso esperado.
- Los eventos críticos pueden trazarse y las credenciales/servidores pueden revocarse.

### Condiciones de escalado
- Herramienta con ejecución arbitraria o acceso destructivo sin control compensatorio.
- Servidor o paquete sin procedencia/versionado verificable.
- Credenciales compartidas o secretos expuestos.
- Dependencia crítica del proveedor que no permite verificar controles esenciales.

## 8. Salida esperada
Informe MCP Security Review con inventario, matriz de capabilities/permisos, procedencia de componentes, pruebas de abuso, evidencias, hallazgos y riesgo residual. Destino: expediente de seguridad de aplicación/agente.

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
- NIST Secure Software Development Framework (SSDF)
- OWASP GenAI Security Project
