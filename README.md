# workout-aws

Monorepo für eine Workout-Tracking-Anwendung. Spring-Boot-Backend, Angular-Frontend, PostgreSQL als Datenbank, Deployment-Ziel AWS.

## Prerequisites

Lokal benötigt:

- **Java 25** (z. B. Temurin) — Gradle-Wrapper im Repo, kein lokales Gradle nötig
- **Node.js 24+** mit **npm 11.6.x** (gepinnt via `packageManager`-Feld in `frontend/package.json`)
- **Docker** (Desktop oder Engine) für die lokale PostgreSQL-Instanz
- **Git**

Unter Windows wird Git-Bash als Shell vorausgesetzt (Bash-Syntax, Forward-Slashes in Pfaden).

## Quick Start

Drei Terminals, Reihenfolge wie aufgelistet:

```bash
# 1. PostgreSQL starten (Docker, Host-Port 5433)
docker compose up -d postgres

# 2. Backend starten (Port 8080, wartet auf Postgres)
cd backend && ./gradlew bootRun

# 3. Frontend starten (Port 4200, proxt /api → http://localhost:8080)
cd frontend && npm install   # nur beim ersten Mal oder nach lock-Änderung
npm start
```

Browser öffnet `http://localhost:4200/` und wird automatisch auf `/location/equipment` geleitet.

### Warum Port 5433 für Postgres?

Die Docker-Compose-Instanz published auf Host-Port **5433**, nicht den PostgreSQL-Standard `5432`. Hintergrund: Auf manchen Dev-Maschinen läuft bereits ein nativer PostgreSQL-Dienst auf 5432. Durch das Offset kollidiert Docker nicht mit dem existierenden Dienst. Das Backend ist über einen Env-Var-Fallback (`POSTGRES_PORT`, Default `5433`) passend konfiguriert.

## Repository-Struktur

```
workout-aws/
├── backend/           Spring Boot 4.0.5, Java 25, Gradle Kotlin DSL
├── frontend/          Angular 21.2, TypeScript, SCSS, Vitest
├── docker-compose.yml PostgreSQL 17 für lokale Entwicklung
├── CLAUDE.md          Projekt-Überblick + Git-Workflow
└── README.md
```

| Bereich | Details |
|---|---|
| Backend | Siehe [`backend/CLAUDE.md`](backend/CLAUDE.md) |
| Frontend | Siehe [`frontend/CLAUDE.md`](frontend/CLAUDE.md) |

## Tech-Stack (Kurzform)

**Backend**
- Spring Boot 4.0.5 (Web MVC, Security, Data JPA, Validation, Actuator)
- PostgreSQL + Flyway (versionierte Migrationen mit getrennten Schema- und Seed-Files)
- Lombok (compile-only)
- Feature-basiertes Package-Layout (`de.workout.<feature>`), DTOs als Java `record`, `/api/<feature>`-URL-Prefix

**Frontend**
- Angular 21.2, TypeScript 5.9, SCSS, Vitest
- PrimeNG 21 mit `@primeuix/themes` (Aura-Preset, Dark-Mode über `.dark-mode`-Selector)
- NgRx SignalStore für globalen/Feature-State
- Transloco (Default `de`, Fallback `en`) mit JSON-Files unter `public/i18n/`
- Sheriff-Architektur-Linter (DDD-Layout `core/`, `shared/`, `domains/<domain>/{api,data,feat-<feature>,model}`)
- ESLint (Flat-Config) + Prettier

## Häufige Commands

### Backend (aus `backend/`)

```bash
./gradlew bootRun       # Anwendung starten
./gradlew test          # Tests
./gradlew build         # Clean Build inkl. Tests
./gradlew clean         # Build-Output löschen
```

### Frontend (aus `frontend/`)

```bash
npm start                       # Dev-Server (Port 4200)
npm run build                   # Produktions-Build
npm test                        # Vitest Watch
npx vitest run                  # Vitest Single-Run
npm run lint                    # ESLint
npm run format                  # Prettier schreiben
npm run format:check            # Prettier prüfen
npx sheriff verify src/main.ts  # Architektur-Regeln prüfen
```

### Datenbank

```bash
docker compose up -d postgres   # Postgres starten
docker compose logs -f postgres # Logs verfolgen
docker compose down             # Stoppen (Volume bleibt erhalten)
docker compose down -v          # Stoppen + Daten wegwerfen
```

Direkter Zugriff:

```bash
docker compose exec -T postgres psql -U workout -d workout
```

Dev-Credentials (nur lokal): DB `workout`, User `workout`, Passwort `workout`.

## Git-Workflow

- Default-Branch: `main`. PRs gehen gegen `main`.
- Pro Aufgabe ein Feature-Branch: `feature/<name>`, Bugfixes: `bugfix/<name>`.
- PRs werden manuell erstellt und gemergt — keine automatisierten Push/Merge-Schritte.

Siehe `CLAUDE.md` im Repo-Root für die vollständigen Workflow-Regeln.

## Offene Setup-Punkte

- `.env.example` als committete Vorlage für lokale Overrides (noch nicht angelegt).
- AWS-Deployment-Infrastruktur (CDK oder Terraform — noch offen).
