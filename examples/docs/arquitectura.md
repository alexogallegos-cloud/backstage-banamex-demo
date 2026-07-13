# Arquitectura de la Plataforma

## Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENTES EXTERNOS                          │
│              App Móvil          Portal Web                      │
└──────────────────────┬──────────────────┬───────────────────────┘
                       │                  │
┌──────────────────────▼──────────────────▼───────────────────────┐
│                   APIGEE X (GCP)                                │
│        API Gateway externo — rate limiting, OAuth 2.0           │
│    open-banking-api  │  tarjetas-api  │  onboarding-api         │
└──────────────────────┬──────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│              RED HAT OPENSHIFT 4.14 (On-Premise)                │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │  CORE BANKING   │  │ CANALES DIGITALES│  │ RIESGO/FRAUDE │  │
│  │                 │  │                  │  │               │  │
│  │ cuentas-svc     │  │ portal-web       │  │ scoring-svc   │  │
│  │ transferencias  │  │ app-movil-bff    │  │ fraude-svc    │  │
│  │ pagos-svc       │  │ onboarding-svc   │  │               │  │
│  │ creditos-svc    │  │ notificaciones   │  └───────────────┘  │
│  │ tarjetas-svc    │  └──────────────────┘                     │
│  │ stp-connector   │                                            │
│  └────────┬────────┘                                            │
│           │                                                     │
│  ┌────────▼────────────────────────────────────────────────┐   │
│  │              APACHE KAFKA 3.6 (Event Bus)               │   │
│  │   transacciones  │  alertas-fraude  │  notificaciones   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                     DATOS                                       │
│    PostgreSQL 15   │   Oracle 19c   │   Data Lake (Spark)       │
└─────────────────────────────────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                  BANXICO / STP                                  │
│            Liquidación SPEI en tiempo real 24/7                 │
└─────────────────────────────────────────────────────────────────┘
```

## Principios de arquitectura

### 1. API-First
Todos los servicios exponen contratos OpenAPI 3.1 antes de implementar. El catálogo de APIs vive en el BDP.

### 2. OpenShift como plataforma de runtime
Todos los microservicios se despliegan como pods en OpenShift 4.14. Los namespaces reflejan los dominios de negocio:
- `core-banking` — Servicios financieros core
- `banca-digital` — Canales y onboarding
- `riesgo` — Modelos ML y fraude
- `cumplimiento` — Reportes regulatorios

### 3. Apigee como capa de exposición externa
Las APIs internas NO se exponen directamente. Apigee X gestiona:
- Autenticación OAuth 2.0 / mTLS para partners
- Rate limiting por cliente
- Monetización de APIs (futura)
- Gobierno y analytics de consumo

### 4. Event-driven para operaciones asíncronas
Kafka es el bus de eventos para:
- Notificaciones de transacciones en tiempo real
- Detección de fraude (latencia < 50ms P99)
- Reportes regulatorios batch

## Estándares de código

| Categoría | Estándar |
|-----------|---------|
| Lenguaje | Java 17 LTS |
| Framework | Spring Boot 3.x |
| Build | Maven 3.9 + Dockerfile multi-stage |
| Testing | JUnit 5, Mockito, Testcontainers |
| Cobertura mínima | 80% (gate SonarQube) |
| Seguridad | OWASP Top 10, SAST en pipeline |

## Regulación

El stack tecnológico cumple con:
- **CNBV** — Circular Única de Bancos, DORA
- **Banxico** — Circular 14/2017 (SPEI), PLD
- **PCI-DSS 4.0** — Para componentes de tarjetas
- **ISO 27001** — Controles de seguridad de información