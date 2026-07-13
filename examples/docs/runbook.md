# Runbook Operacional

> **Audiencia**: SRE, On-Call Engineers, Core Banking Ops
> **Actualización**: 2026-Q2 | Plataforma TI — IT4T Banamex

## Alertas críticas y respuesta

### P0 — SPEI no disponible

**Síntoma**: `stp-connector-service` sin heartbeat o errores 5xx sostenidos > 1 min

**Impacto**: Todas las transferencias SPEI/SPID bloqueadas — regulatorio Banxico

**Respuesta inmediata**:
```bash
# 1. Verificar pod en OpenShift
oc get pods -n core-banking -l app=stp-connector-service

# 2. Revisar logs últimos 5 minutos
oc logs -n core-banking deployment/stp-connector-service --since=5m

# 3. Si pod en CrashLoopBackOff — restart
oc rollout restart deployment/stp-connector-service -n core-banking

# 4. Verificar conectividad con STP Banxico
curl -k https://stp.banxico.gob.mx/health
```

**Escalamiento**: Si no resuelve en 10 min → escalar a Core Banking Lead + notificar Banxico (número de guardia)

---

### P0 — Fraude: tasa de falsas alarmas > 5%

**Síntoma**: `fraude-service` alertando en Kafka topic `alertas-fraude` con ratio anómalo

**Respuesta**:
```bash
# Revisar métricas del modelo en Dynatrace
# Dashboard: "Fraud Detection — Model Health"

# Pausar modelo y activar reglas fallback
oc set env deployment/fraude-service -n riesgo MODEL_MODE=RULES_ONLY
```

---

### P1 — Degradación de cuentas-service

**Síntoma**: Latencia P99 > 500ms o error rate > 1%

**Métricas a revisar**:

| Métrica | Umbral normal | Umbral alerta |
|---------|--------------|---------------|
| Latencia P50 | < 50ms | > 200ms |
| Latencia P99 | < 200ms | > 500ms |
| Error rate | < 0.1% | > 1% |
| Throughput | ~5,000 RPS | < 3,000 RPS |

```bash
# Escalar horizontalmente si es por carga
oc scale deployment/cuentas-service --replicas=6 -n core-banking

# Verificar pool de conexiones a PostgreSQL
oc logs -n core-banking deployment/cuentas-service | grep "HikariPool"
```

---

## Procedimientos de mantenimiento

### Actualización de microservicio (zero-downtime)

```bash
# 1. Verificar que el nuevo tag existe en registry
oc get is cuentas-service -n core-banking

# 2. Rolling update (OpenShift lo hace automáticamente con el pipeline)
oc set image deployment/cuentas-service \
  cuentas-service=registry.banamex.com/core-banking/cuentas-service:v2.3.1 \
  -n core-banking

# 3. Monitorear rollout
oc rollout status deployment/cuentas-service -n core-banking

# 4. Si hay problema — rollback inmediato
oc rollout undo deployment/cuentas-service -n core-banking
```

### Renovación de certificados Apigee

1. Generar nuevo certificado en PKI interna Banamex
2. Subir a Apigee Console → Organization → Environments → production → Keystores
3. Asignar al virtual host correspondiente
4. Verificar con: `openssl s_client -connect api.banamex.com:443`

---

## Contactos de escalamiento

| Nivel | Equipo | Contacto | Tiempo respuesta |
|-------|--------|----------|-----------------|
| L1 | NOC Banamex | noc@banamex.com | Inmediato |
| L2 | Plataforma TI | it4t@banamex.com | < 15 min |
| L3 | Core Banking Lead | core-banking@banamex.com | < 30 min |
| L3 | Banxico (SPEI) | Número guardia regulatorio | < 60 min |
| Vendor | Red Hat Support | Ticket Priority 1 | < 1 hora |
| Vendor | Google (Apigee) | GCP Support Console | < 4 horas |

## SLOs definidos

| Servicio | Disponibilidad | Latencia P99 |
|----------|---------------|-------------|
| cuentas-service | 99.95% | < 200ms |
| transferencias-service (SPEI) | 99.99% | < 500ms |
| fraude-service | 99.99% | < 50ms |
| open-banking-api (Apigee) | 99.9% | < 300ms |