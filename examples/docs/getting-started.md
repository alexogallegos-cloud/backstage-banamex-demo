# Getting Started — Nuevo Developer Banamex

Bienvenido al equipo de Tecnología Banamex. Esta guía te lleva desde cero hasta tu primer commit en producción.

## 1. Accesos iniciales

Solicita a IT4T (it4t@banamex.com) los siguientes accesos:

| Sistema | Propósito |
|---------|-----------|
| GitLab Banamex | Repositorios de código fuente |
| OpenShift Console | Visualización de pods y logs |
| Dynatrace | Observabilidad y trazas |
| Jenkins | Pipelines CI/CD |
| SonarQube | Calidad de código |
| Vault (HashiCorp) | Gestión de secretos |
| Jira | Tickets y sprints |

## 2. Setup local

### Prerequisitos
```bash
# Java 17 LTS
java -version  # debe mostrar 17.x

# Maven 3.9+
mvn -version

# Docker Desktop (para Testcontainers)
docker --version

# kubectl + oc CLI
oc version
```

### Clonar un microservicio
```bash
git clone https://gitlab.banamex.com/core-banking/cuentas-service.git
cd cuentas-service

# Instalar dependencias y correr tests
mvn clean test

# Levantar en local
mvn spring-boot:run -Dspring.profiles.active=local
```

El servicio arranca en `http://localhost:8080`. Swagger UI en `http://localhost:8080/swagger-ui.html`.

## 3. Estructura estándar de un microservicio Banamex

```
{servicio}-service/
├── src/
│   ├── main/java/com/banamex/{servicio}/
│   │   ├── api/          # Controllers REST
│   │   ├── domain/       # Entidades y lógica de negocio
│   │   ├── infrastructure/  # Repos, Kafka, clientes externos
│   │   └── config/       # Spring config, security
│   └── resources/
│       ├── application.yml
│       └── application-local.yml
├── src/test/              # JUnit 5 + Testcontainers
├── Dockerfile             # Multi-stage build
├── catalog-info.yaml      # Registro en BDP
└── mkdocs.yml + docs/     # Documentación TechDocs
```

## 4. Crear un nuevo microservicio

Usa el **Scaffolder del BDP** para generar un proyecto con todas las configuraciones correctas:

1. En el BDP, ve a **Create** (ícono de estrella en el menú izquierdo)
2. Selecciona el template **"Microservicio Spring Boot — Banamex"**
3. Completa el formulario (nombre, equipo owner, namespace OpenShift)
4. El scaffolder crea automáticamente:
   - Repositorio en GitLab con estructura estándar
   - Pipeline Jenkins pre-configurado
   - Registro en el catálogo BDP (`catalog-info.yaml`)
   - Namespace en OpenShift (si es nuevo)

## 5. Flujo de trabajo (GitFlow)

```
main ─────────────────────────────────────► producción
       └── develop ──────────────────────► staging
              └── feature/JIRA-123 ──────► review
```

```bash
# Crear rama de feature
git checkout -b feature/BANAMEX-1234-nueva-funcionalidad

# Commit con convención
git commit -m "feat(cuentas): agregar endpoint de consulta por RFC"

# Push y abrir MR en GitLab
git push origin feature/BANAMEX-1234-nueva-funcionalidad
```

## 6. Pipeline CI/CD — GitHub Actions

Cada push a `develop` o `main` dispara el workflow automáticamente:

```
Build (Maven) → Unit Tests → SonarQube → Docker Build → Push GHCR → Deploy Staging → Integration Tests → [Aprobación manual] → Deploy Producción (OpenShift)
```

El workflow vive en `.github/workflows/ci-cd.yml` en cada repositorio. El scaffolder genera este archivo pre-configurado al crear el servicio.

**Gates obligatorios**:
- ✅ Cobertura de tests ≥ 80%
- ✅ SonarQube: 0 issues críticos
- ✅ OWASP Dependency Check: 0 CVEs críticos
- ✅ docker scout — 0 vulnerabilidades críticas en imagen
- ✅ Aprobación del Tech Lead (GitHub Environment protection rule) para deploy a producción

## 7. Convenciones de código

```java
// Naming: camelCase para variables, PascalCase para clases
// Paquete base: com.banamex.{dominio}.{servicio}

@RestController
@RequestMapping("/v2/cuentas")
@Slf4j
public class CuentasController {

    @GetMapping("/{clabe}")
    public ResponseEntity<CuentaDto> getCuenta(
            @PathVariable @Size(min = 18, max = 18) String clabe) {
        // Siempre loguear con MDC para trazabilidad
        MDC.put("clabe", clabe);
        log.info("Consultando cuenta");
        // ...
    }
}
```

## Dudas y soporte

- **Slack**: `#bdp-support` (Plataforma TI)
- **Slack**: `#core-banking-dev` (Core Banking)
- **Email**: it4t@banamex.com
- **Jira**: Proyecto BDP para bugs del portal