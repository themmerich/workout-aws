# Frontend

Angular 21.1 Anwendung. TypeScript 5.9, SCSS als Style-Sprache, Vitest als Test-Framework.
Paketmanager: `npm@11.6.2` (gepinnt über `packageManager` in `package.json`).

## Commands

Alle Commands aus dem `frontend/`-Verzeichnis:

- Dev-Server: `npm start` (entspricht `ng serve`, Default-Port 4200)
- Build: `npm run build`
- Watch-Build: `npm run watch`
- Tests (Watch-Mode): `npm test` (Vitest)
- Tests (Single-Run): `npx vitest run`
- Lint: `npm run lint` (ESLint via `ng lint`, flat config in `eslint.config.js`)
- Format schreiben: `npm run format` (Prettier über alle Dateien)
- Format prüfen: `npm run format:check` (CI-Check)

## Tech-Stack

- Angular 21.1 (Common, Compiler, Core, Forms, Platform-Browser, Router)
- Angular CLI 21.1 mit Vite-Builder
- RxJS ~7.8
- TypeScript ~5.9
- Vitest ^4.0 (kein Jest, kein Karma/Jasmine)

## Angular-Konventionen (21+)

- **Standalone Components** als Default — keine `NgModule`-Deklarationen für neue Komponenten.
- **Signals** für komponentenlokalen State: `signal()`, `computed()`, `linkedSignal()`. Für async Daten `resource()` / `rxResource()`.
- **Neue Control-Flow-Syntax**: `@if`, `@for`, `@switch` statt struktureller Direktiven (`*ngIf`, `*ngFor`, `*ngSwitchCase`).
- **`inject()`** statt Constructor-Injection bevorzugen.
- **Signal-basierte Component-APIs**: `input()` / `output()` / `model()` statt `@Input()` / `@Output()`.
- **Change-Detection**: `OnPush` als Default setzen.
- **Reactive Forms** verwenden — in neuem Code typisierte Reactive Forms (`FormGroup<T>`).
- Routing: Standalone-APIs (`provideRouter`, Lazy-Loading via `loadComponent` / `loadChildren` mit dynamischem Import).

## Styling

- Component-scoped SCSS (`styleUrl`-Property).
- Keine globalen Styles ohne guten Grund — falls nötig über `src/styles.scss`.

## Environments & Secrets

- `.env`, `.env.local`, `.env.*.local` sind git-ignored.
- Für Feature-Flags/URLs die Angular-`environment.ts`-Dateien nutzen (`src/environments/`, via `fileReplacements` in `angular.json` beim Build ausgetauscht).
- Secrets gehören **nicht** ins Frontend. Alles Sensible bleibt im Backend.

## Testing

- Vitest-Spec-Dateien neben dem SUT: `foo.component.ts` + `foo.component.spec.ts`.
- Für Component-Tests Angulars `TestBed` mit Vitest kombinieren.
- Keine NgModule-basierten Test-Setups.
