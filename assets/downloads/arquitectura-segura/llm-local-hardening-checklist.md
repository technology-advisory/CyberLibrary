# LLM local · Checklist de hardening
CyberLibrary AI · cyberlibrary-ai.es · Revisado julio 2026

Secuencia recomendada: Bind -> Parche -> Firewall -> Proxy -> Tunel.

## 1. Binding
- [ ] El servicio escucha solo en 127.0.0.1 (verificar: `ss -ltnp | grep 11434`)
- [ ] Si se necesita red, bind a IP concreta de LAN, nunca 0.0.0.0 sin firewall

## 2. Parcheo
- [ ] Runtime en ultima version estable
- [ ] Suscrito a los avisos de seguridad del proyecto
- [ ] Fecha de ultima actualizacion registrada

## 3. Firewall
- [ ] El firewall rechaza el acceso externo al puerto (p. ej. 11434)
- [ ] Solo IPs/subredes de confianza permitidas

## 4. Proxy inverso
- [ ] Proxy (Nginx u otro) delante, runtime en localhost por detras
- [ ] TLS activo
- [ ] Autenticacion (Basic Auth o capa de identidad)

## 5. Acceso remoto
- [ ] Acceso via VPN o tunel privado
- [ ] SIN port-forwarding del puerto en el router

## 6. Aislamiento y control
- [ ] Ejecucion en contenedor / segmento de red aislado
- [ ] Origenes CORS restringidos (OLLAMA_ORIGINS)
- [ ] Limites de CPU/GPU/memoria y control de tasa
- [ ] Trafico de salida controlado (telemetria/red)
- [ ] Procedencia del modelo verificada (hash y origen)
- [ ] Logging con retencion y control de acceso

Evidencia a conservar: salida de ss, version del runtime, reglas de firewall,
config del proxy y certificados, config de VPN/tunel, hash de los modelos.
