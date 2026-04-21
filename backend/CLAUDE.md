# Backend

Spring Boot 4.0.5 Anwendung in Java 25. Build-Tool: Gradle (Kotlin DSL).
Package-Root: `de.workout`. Version: `0.0.1-SNAPSHOT`.

## Commands

Alle Commands aus dem `backend/`-Verzeichnis:

- Anwendung starten: `./gradlew bootRun`
- Tests: `./gradlew test`
- Build (inkl. Tests): `./gradlew build`
- Clean: `./gradlew clean`
- Dependency-Check: `./gradlew dependencies`

Der Gradle-Wrapper ist committed (`gradlew`, `gradlew.bat`, `gradle/wrapper/*`). Kein lokales Gradle-Install nötig.

## Docker-Build

Multi-Stage-`Dockerfile` im Backend-Root:

- Build-Stage: `eclipse-temurin:25-jdk`, `./gradlew bootJar -x test` (Tests laufen separat im CI, nicht im Image-Build).
- Runtime-Stage: `eclipse-temurin:25-jre` + `curl` (ECS-Container-Healthcheck ruft `curl -f http://localhost:8080/api/actuator/health`).

Lokal: `docker build -t workout-backend backend/` aus dem Repo-Root.

## Tech-Stack

- Spring Boot 4.0.5: Web MVC, Security, Data JPA, Validation, Actuator
- PostgreSQL-Treiber + Flyway für Migrationen
- Lombok (compile-only)
- JUnit 5 (Spring Boot Starter Test)

## Konfiguration

- `src/main/resources/application.properties` — committete Default-Konfiguration. Datasource, JPA, Flyway, Actuator-Exposure und CORS-Allowed-Origins sind dort gepflegt.
- **Aktueller Ansatz**: Env-Var-Fallbacks im Property-File, z. B. `spring.datasource.url=jdbc:postgresql://${POSTGRES_HOST:localhost}:${POSTGRES_PORT:5433}/${POSTGRES_DB:workout}`. Für lokale Abweichungen reichen gesetzte Env-Vars — **kein** Spring-Profile `local`, **keine** separate `application-local.properties`-Datei im Einsatz.
- Falls später ein Profile-Overlay gebraucht wird: Der Gitignore blockiert bereits `application-local.*`, der Property-Resolver-Order von Spring Boot greift dann automatisch. Kein Setup-Aufwand nötig, nur Datei anlegen und mit `--spring.profiles.active=local` starten.

## Lokale Datenbank

- **Docker-Compose** (im Repo-Root) startet `postgres:17-alpine` auf **Host-Port 5433** (nicht 5432 — s. Ports-Hinweis in der Root-`CLAUDE.md`).
- Default-Credentials (nur für lokale Entwicklung): DB `workout`, User `workout`, Passwort `workout`.
- Start: `docker compose up -d postgres`. Healthcheck via `pg_isready`.

## Konventionen

- **Package-Layout**: `de.workout.{domain}` (z. B. `de.workout.equipment`, `de.workout.user`) — Feature-basiert, nicht Layer-basiert. Cross-cutting Konfiguration (Security, Loader, CORS) unter `de.workout.config`. Als Vorbild dient das bestehende Feature `de.workout.equipment` (Entity, Repository, DTO, Controller im selben Package).
- **REST-URL-Prefix**: Jeder Controller mountet unter `/api/<feature>` via `@RequestMapping("/api/<feature>")`. Controller-Methoden geben **DTOs** zurück, niemals Entities direkt.
- **DTOs** als Java `record` mit statischer `from(Entity)`-Factory — siehe `EquipmentDto`.
- **JPA-Entities** liegen im jeweiligen Feature-Package. Repositories als Spring-Data-Interfaces (`JpaRepository<T, ID>`).
- **Primary Keys**: UUID via `@GeneratedValue(strategy = GenerationType.UUID)`; Java generiert die UUID vor dem Insert, kein DB-Default nötig.
- **Lombok** auf Entities: `@Data`, `@NoArgsConstructor` (JPA-Pflicht), `@AllArgsConstructor`, `@Builder`. Auf Services/Controllern: `@RequiredArgsConstructor` für Constructor-Injection. Test-Code ohne Lombok, um Verhalten explizit zu halten.
- **Enum-Mapping (Wire-Format)**: Enums sind UPPERCASE in Java und DB (`@Enumerated(EnumType.STRING)`), lowercase auf dem Wire. Umsetzung per `@JsonValue` (`name().toLowerCase(Locale.ROOT)`) und `@JsonCreator` (`valueOf(value.toUpperCase(Locale.ROOT))`). Referenz: `EquipmentCategory`. DB-Check-Constraints spiegeln die UPPERCASE-Werte.
- **Flyway-Migrationen** unter `src/main/resources/db/migration/`, Dateischema `V{version}__{snake_description}.sql` (z. B. `V1__create_equipment.sql`). Schema-Create und Seed-Daten in **separaten** Migrationen (`V1__…`, `V2__…`).
- **Spring Security**: Konfiguration per `SecurityFilterChain`-Bean in `de.workout.config.SecurityConfig`, kein `WebSecurityConfigurerAdapter` (deprecated). Aktueller Stand: `anyRequest().permitAll()`, CSRF aus, stateless Sessions, CORS aktiv.
- **CORS**: `CorsConfigurationSource`-Bean in `SecurityConfig`, Allowed-Origins über Property `app.cors.allowed-origins` (komma-separierte Liste). Default in `application.properties`: `http://localhost:4200`.

## Testing

- Unit-Tests: plain JUnit 5 + Mockito, ohne Spring-Context.
- Integrationstests: `@SpringBootTest` + Testcontainers (PostgreSQL) — keine H2-Mocks.
- Testfiles in `src/test/java/de/workout/...` parallel zur Produktionsstruktur.
