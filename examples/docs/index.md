# Banamex Technology Platform

Bienvenido al **Banamex Developer Portal (BDP)** — la plataforma interna de developer experience construida sobre Backstage OSS y desplegada en Red Hat OpenShift.

## ¿Qué es el BDP?

El BDP es el catálogo central de todos los componentes de tecnología de Banamex. Aquí encontrarás:

- **Microservicios** desplegados en OpenShift
- **APIs** gestionadas por Apigee X
- **Pipelines CI/CD** en Jenkins
- **Documentación técnica** de cada componente
- **Scaffolder** para crear nuevos microservicios con las mejores prácticas de Banamex

## Plataforma tecnológica

| Capa | Tecnología |
|------|-----------|
| Contenedores | Red Hat OpenShift 4.14 |
| API Gateway | Google Apigee X |
| CI/CD | Jenkins + GitLab CI |
| Source Control | GitLab CE |
| Messaging | Apache Kafka 3.6 |
| Observabilidad | Dynatrace + Prometheus |
| Base de datos | PostgreSQL 15 / Oracle |
| Lenguaje | Java 17 (Spring Boot 3.x) |

## Sistemas principales

### Core Banking Platform
Gestión de cuentas, transferencias SPEI/SPID y pagos. Regulado CNBV/Banxico.

- **cuentas-service** — Apertura, consulta y bloqueo de cuentas
- **transferencias-service** — SPEI, SPID y transferencias internas
- **pagos-service** — 200+ convenios CIE (CFE, Telmex, SAT, IMSS)
- **creditos-service** — Personales, automotrices e hipotecarios
- **tarjetas-service** — Crédito/débito, autorización, CVV dinámico
- **stp-connector-service** — Liquidación SPEI 24/7 con Banxico

### Canales Digitales
Portal web Angular 17 y app móvil iOS/Android — 4.2M usuarios activos.

- **portal-web** — Banca en línea personas físicas y empresas
- **app-movil-bff** — Backend for Frontend para la app móvil
- **onboarding-service** — Alta digital con eKYC y biométrica
- **notificaciones-service** — Push, SMS, email y WhatsApp Business

### API Management — Apigee
APIs externas reguladas expuestas a partners y fintechs.

- **open-banking-api** — Open Finance CNBV (PSD2 equivalente México)
- **tarjetas-api** — Consulta y gestión de tarjetas vía Apigee
- **onboarding-api** — Alta digital express vía Apigee

## Contacto

| Equipo | Email |
|--------|-------|
| Plataforma TI (IT4T) | it4t@banamex.com |
| Core Banking | core-banking@banamex.com |
| Banca Digital | banca-digital@banamex.com |
| Ciberseguridad | ciberseguridad@banamex.com |