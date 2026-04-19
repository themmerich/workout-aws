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

## Tech-Stack

- Spring Boot 4.0.5: Web MVC, Security, Data JPA, Actuator
- PostgreSQL-Treiber + Flyway für Migrationen
- Lombok (compile-only)
- JUnit 5 (Spring Boot Starter Test)

## Konfiguration & Profile

- `src/main/resources/application.yml` — committete Default-Konfiguration (noch nicht vorhanden, muss angelegt werden).
- `src/main/resources/application-local.yml` — lokale Overrides (DB-Credentials, Dev-Secrets). **Git-ignored**, nie committen.
- Lokal starten mit Profil `local`: `SPRING_PROFILES_ACTIVE=local ./gradlew bootRun`.

## Konventionen

- **Flyway-Migrationen** unter `src/main/resources/db/migration/`, Dateischema `V{version}__{snake_description}.sql` (z. B. `V1__create_workout_table.sql`).
- **Package-Layout**: `de.workout.{domain}` (z. B. `de.workout.workout`, `de.workout.user`) — Feature-basiert, nicht Layer-basiert.
- **Lombok**: `@Data`, `@Builder`, `@RequiredArgsConstructor` wo sinnvoll. Test-Code ohne Lombok, um Verhalten explizit zu halten.
- **DTOs** als Java `record` bevorzugt.
- **Spring Security**: Konfiguration per `SecurityFilterChain`-Bean, kein `WebSecurityConfigurerAdapter` (deprecated).
- **JPA-Entities** liegen im jeweiligen Feature-Package. Repositories als Spring-Data-Interfaces.

## Testing

- Unit-Tests: plain JUnit 5 + Mockito, ohne Spring-Context.
- Integrationstests: `@SpringBootTest` + Testcontainers (PostgreSQL) — keine H2-Mocks.
- Testfiles in `src/test/java/de/workout/...` parallel zur Produktionsstruktur.
