# workout-aws

Monorepo für eine Workout-Tracking-Anwendung. Spring Boot Backend, Angular Frontend, PostgreSQL als Datenbank, Deployment-Ziel AWS.

## Repository-Struktur

- `backend/` — Spring Boot 4.0.5 (Java 25, Gradle Kotlin DSL). Details siehe `backend/CLAUDE.md`.
- `frontend/` — Angular 21.1 (TypeScript, Vitest, SCSS). Details siehe `frontend/CLAUDE.md`.

## Git-Workflow

- Default-Branch: `main`. Alle PRs gehen gegen `main`.
- Pro Aufgabe ein eigener Feature-Branch. Namens-Konvention: Feature-Branches: `feature/`, Bugfixes: `bugfix/`
- **Keine automatischen Pushes, keine automatische PR-Erstellung.** Der Entwickler pusht und mergt selbst. Ohne explizite Anweisung nur lokale Änderungen.
- Commits erst auf explizite Anweisung anlegen.
- PRs werden manuell gemergt — kein `gh pr merge`.

## Umgebung

- Entwicklung unter Windows mit Git-Bash. Bash-Syntax, Forward-Slashes in Paths (`/dev/null`, nicht `NUL`).
- Remote: `https://github.com/themmerich/workout-aws`.

## Nächste geplante Schritte (Setup)

- `docker-compose.yml` für PostgreSQL (lokale Entwicklung).
- Spring-Boot-Konfigurationsdateien (`application.yml` + `application-local.yml`).
- `.env.example` als committete Vorlage.
- Root-`README.md` mit Setup-Anleitung.
- AWS-Infrastruktur (CDK oder Terraform, noch offen).
