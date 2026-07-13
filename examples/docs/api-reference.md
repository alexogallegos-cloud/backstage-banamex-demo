# API Reference

Todas las APIs siguen el estándar **OpenAPI 3.1** y están publicadas en el catálogo del BDP. Los contratos completos se pueden visualizar en la sección "APIs" del portal.

## APIs Internas (Core Banking)

### Cuentas API v2
**Base URL**: `https://api-interna.banamex.com/v2/cuentas`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/cuentas/{clabe}` | Consultar cuenta por CLABE (18 dígitos) |
| `GET` | `/cuentas/{clabe}/saldo` | Saldo en tiempo real |
| `GET` | `/cuentas` | Listar cuentas del cliente |
| `POST` | `/cuentas` | Apertura de nueva cuenta |

**Autenticación**: JWT Bearer (IAM interno Banamex)

---

### Transferencias API v1 — SPEI/SPID
**Base URL**: `https://api-interna.banamex.com/v1/transferencias`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/spei` | Enviar transferencia SPEI |
| `GET` | `/spei/{folio}/status` | Consultar estatus |

**Regulación**: Circular Banxico 14/2017 — SPEI 24/7

---

### Tarjetas API v1
**Base URL**: `https://api-interna.banamex.com/v1/tarjetas`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/tarjetas/{pan}/saldo` | Saldo y límite disponible |
| `POST` | `/tarjetas/{pan}/bloqueo` | Bloqueo inmediato |
| `GET` | `/tarjetas/{pan}/cvv-dinamico` | CVV dinámico (válido 30s) |

---

### Scoring API v1 (Interna)
**Base URL**: `https://api-interna.banamex.com/v1/scoring`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/score` | Calcular score crediticio ML |

**SLA**: Respuesta < 200ms P99 | Disponibilidad 99.9%

---

## APIs Externas (Apigee X)

Las siguientes APIs están expuestas a través de **Apigee X** en GCP y disponibles para partners y fintechs autorizados.

### Open Banking API v1 — CNBV Open Finance
**Base URL**: `https://openbanking.banamex.com/v1`

**Autenticación**: OAuth 2.0 Authorization Code + PKCE

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/consents` | Crear consentimiento del cliente |
| `GET` | `/accounts` | Listar cuentas (scope: accounts:read) |
| `GET` | `/accounts/{id}/transactions` | Movimientos con consentimiento |

**Regulación**: CNBV Disposiciones Open Finance 2024

---

### Onboarding Digital API v1
**Base URL**: `https://api.banamex.com/v1/onboarding`

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/solicitudes` | Iniciar proceso de alta |
| `POST` | `/solicitudes/{id}/kyc` | Enviar documentos eKYC |
| `POST` | `/solicitudes/{id}/biometria` | Captura biométrica facial |
| `POST` | `/solicitudes/{id}/cuenta` | Activar cuenta express |

---

## Códigos de error estándar

| Código | Significado |
|--------|-------------|
| `400` | Request inválido — validar payload |
| `401` | Sin autenticación o token expirado |
| `403` | Sin autorización para el recurso |
| `404` | Recurso no encontrado |
| `422` | Error de negocio (ej. saldo insuficiente) |
| `429` | Rate limit excedido |
| `503` | Servicio no disponible (mantenimiento) |

## Headers requeridos

```http
Authorization: Bearer <token>
X-Request-ID: <uuid-v4>        # Trazabilidad
X-Channel: WEB | MOBILE | API  # Canal de origen
Content-Type: application/json
```