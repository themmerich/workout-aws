# workout-aws

Monorepo für eine Workout-Tracking-Anwendung. Spring Boot Backend, Angular Frontend, PostgreSQL als Datenbank, Deployment-Ziel AWS.

## Repository-Struktur

- `backend/` — Spring Boot 4.0.5 (Java 25, Gradle Kotlin DSL). Details siehe `backend/CLAUDE.md`.
- `frontend/` — Angular 21.2 (TypeScript, Vitest, SCSS). Details siehe `frontend/CLAUDE.md`.

## Git-Workflow

- Default-Branch: `main`. Alle PRs gehen gegen `main`.
- Pro Aufgabe ein eigener Feature-Branch. Namens-Konvention: Feature-Branches: `feature/`, Bugfixes: `bugfix/`
- **Keine automatischen Pushes, keine automatische PR-Erstellung.** Der Entwickler pusht und mergt selbst. Ohne explizite Anweisung nur lokale Änderungen.
- Commits erst auf explizite Anweisung anlegen.
- PRs werden manuell gemergt — kein `gh pr merge`.

## Umgebung

- Entwicklung unter Windows mit Git-Bash. Bash-Syntax, Forward-Slashes in Paths (`/dev/null`, nicht `NUL`).
- Remote: `https://github.com/themmerich/workout-aws`.

## Lokal starten

Drei Terminals, Reihenfolge wie aufgelistet:

```bash
# 1. PostgreSQL (Docker, Port 5433)
docker compose up -d postgres

# 2. Backend (Port 8080)
cd backend && ./gradlew bootRun

# 3. Frontend (Port 4200, leitet /api → http://localhost:8080)
cd frontend && npm start
```

Browser `http://localhost:4200/` → redirect auf `/location/equipment`.

**Port-Belegung:**

| Dienst | Port |
|---|---|
| PostgreSQL (Docker) | `5433` (Host) → `5432` (Container) |
| Spring-Boot-Backend | `8080` |
| Angular-Dev-Server | `4200` |

Der Port-Offset auf 5433 ist Absicht — auf der Dev-Maschine läuft lokal ein natives PostgreSQL auf 5432, daher kollidiert das Docker-Setup mit dem Default. Das Backend ist per Env-Var-Fallback (`POSTGRES_PORT`, Default `5433`) darauf eingestellt.

## Offene Setup-Punkte

- `.env.example` als committete Vorlage für lokale Overrides (noch nicht angelegt).
- AWS-Infrastruktur (CDK oder Terraform, noch offen).
