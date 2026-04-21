# Frontend

Angular 21.2 Anwendung. TypeScript 5.9, SCSS als Style-Sprache, Vitest als Test-Framework.
Paketmanager: `npm@11.6.2` (gepinnt über `packageManager` in `package.json`).

`.npmrc` setzt `legacy-peer-deps=true`, weil `@softarc/eslint-plugin-sheriff` einen veralteten Peer-Dep-Range auf ESLint hat (`^8 || ^9`), das Projekt aber ESLint 10 nutzt. Ohne das flag schlägt `npm ci` in CI fehl.

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
- Architektur-Check: `npx sheriff verify src/main.ts` (Sheriff-Import-Regeln aus `sheriff.config.ts`)

## Tech-Stack

- Angular 21.2 (Common, Compiler, Core, Forms, Platform-Browser, Router, Animations)
- Angular CLI 21.2 mit Vite-Builder
- `@angular/cdk` 21.2 — Peer-Dep für PrimeNG-Overlays/Portale
- RxJS ~7.8
- TypeScript ~5.9
- Vitest ^4.0 (kein Jest, kein Karma/Jasmine)
- PrimeNG 21 mit `@primeuix/themes` (Aura-Preset, Dark-Mode via `.dark-mode`)
- NgRx SignalStore (`@ngrx/signals`) für globalen/Feature-State — lokaler State bleibt bei `signal()`/`computed()` in der Komponente
- Transloco (`@jsverse/transloco`) für i18n — Default `de`, Fallback `en`
- Sheriff (`@softarc/sheriff-core`, `@softarc/eslint-plugin-sheriff`) als Architektur-Linter

## Architektur / Ordnerstruktur

DDD-artige Aufteilung unter `src/app/`:

- `core/` — App-weite, foundationale Dinge (z. B. HTTP-Interceptoren, Loader wie `transloco-http-loader.ts`).
- `shared/` — Cross-Cutting-Wiederverwendbares (UI-Bausteine, Pipes, Utils), für alle Domains zugänglich.
- `domains/<domain>/` — fachlicher Schnitt, jede Domain (z. B. `location`) enthält:
  - `api/` — Routen-Konfigurationen (`*.routes.ts`), die per `loadComponent` / `loadChildren` Features lazy-laden.
  - `data/` — Services, SignalStores, Mock-Daten.
  - `feat-<feature>/` — Feature-UI (Page-Component + HTML/SCSS).
  - `model/` — Pure Datenklassen/Interfaces/Typen, keine Angular-Abhängigkeiten.

Sheriff taggt automatisch anhand dieser Struktur (`type:api|data|feature|model|core|shared`, `domain:<domain>`) und erzwingt über `sheriff.config.ts`:

- `root` → `api`, `core`, `shared`
- `api` → `feature`, `data`, `model`, `shared`, `core`
- `feature` → `feature` (nur innerhalb derselben Domain), `data`, `model`, `shared`, `core`
- `data` → `model`, `shared`, `core`
- `model` → `shared` (sonst Leaf, keine Abhängigkeiten auf Angular/Services)
- `shared` → `shared`; `core` → `shared`
- **Cross-Domain-Imports sind verboten** (`domain:*` → `sameTag`).

Sheriff läuft im **Barrel-less-Modus**: kein `index.ts` je Ordner nötig. Wenn ein Ordner eine `internal/`-Subfolder hat, sind die darin liegenden Files gekapselt und außerhalb des Moduls nicht erreichbar.

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
- PrimeNG-Theme (Aura) wird über `providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.dark-mode' } } })` zur Laufzeit injected — kein Theme-CSS-Import nötig.
- PrimeIcons sind global via `@import 'primeicons/primeicons.css';` in `src/styles.scss`.

## i18n (Transloco)

- Konfiguration: `provideTransloco(...)` in `src/app/app.config.ts` mit `availableLangs: ['de', 'en']`, `defaultLang: 'de'`, `fallbackLang: 'en'`, `reRenderOnLangChange: true`.
- HTTP-Loader: `src/app/core/transloco-http-loader.ts` fetched `/i18n/<lang>.json`.
- JSON-Files: `frontend/public/i18n/de.json` und `en.json` (Angular CLI serviert `public/*` vom Server-Root — kein `angular.json`-Assets-Eintrag nötig).
- **Template-Pattern**:
  ```html
  <ng-container *transloco="let t">
    <input [placeholder]="t('my.key')" />
    <span>{{ 'my.other.key' | transloco }}</span>
  </ng-container>
  ```
  `t(...)` für Attribute-Bindings, `| transloco`-Pipe für Displayed-Text — beide re-rendern automatisch bei Lang-Change.
- **Enum-/Kategorie-Anzeige**: Rohwert bleibt in den Daten (`category: 'dumbbell'`), Anzeige via `{{ 'scope.enumName.' + value | transloco }}`.
- Jedes neue Feature muss Keys in **beide** JSON-Files (`de.json`, `en.json`) einpflegen — sonst greift der `fallbackLang`.

## Dev-Proxy (Backend-Anbindung)

- Der Angular-Dev-Server leitet `/api/*`-Requests auf `http://localhost:8080` um. Konfiguration: `frontend/proxy.conf.json`, eingehängt in `angular.json` unter `projects.frontend.architect.serve.options.proxyConfig`.
- HTTP-Aufrufe im Code nutzen **relative** Pfade, z. B. `http.get<Equipment[]>('/api/equipment')`. Dadurch funktioniert derselbe Code im Dev (via Vite-Proxy) und in Prod (via Reverse-Proxy / gleicher Origin), ohne dass CORS pro Umgebung anders laufen muss.
- Ändert sich der Backend-Port, nur `proxy.conf.json` anpassen — Code bleibt wie er ist.

## Environments & Secrets

- `.env`, `.env.local`, `.env.*.local` sind git-ignored.
- Für Feature-Flags/URLs die Angular-`environment.ts`-Dateien nutzen (`src/environments/`, via `fileReplacements` in `angular.json` beim Build ausgetauscht).
- Secrets gehören **nicht** ins Frontend. Alles Sensible bleibt im Backend.

## Testing

- Vitest-Spec-Dateien neben dem SUT: `foo.component.ts` + `foo.component.spec.ts`.
- Für Component-Tests Angulars `TestBed` mit Vitest kombinieren.
- Keine NgModule-basierten Test-Setups.
