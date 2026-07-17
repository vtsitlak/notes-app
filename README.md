# NotesApp

NotesApp version 0.0.0

This project runs on **Angular 22** with **standalone components** and **NgRx Signal Store** for state management.

## Description

NotesApp is a demo note managing application that demonstrates modern Angular development practices including:

- **Angular 22** with standalone components (no NgModules)
- **Angular Material 22** for UI components
- **Tailwind CSS** for utility-first styling
- **Angular Signal Forms** (stable) for reactive form handling
- **TypeScript 6** for type safety
- **RxJS 7.8** for reactive programming
- **NgRx Signal Store** for signal-based state management
- **Facade Pattern** for clean API abstraction
- **Express** and **json-server** for the REST API backend

The application was originally based on NgRx (with NgRx Data) but has been modernized to use **NgRx Signal Store**, Angular's signal-based state management solution.

## Key Features

- **Angular 22** — latest stable Angular with standalone-first architecture
- **Signal Forms** — stable `form()` API with signal-based validation
- **Signal Store** — signal-based state management (replacing classic NgRx Store)
- **Standalone Components** — each component declares its own `imports`
- **OnPush by default** — components use `ChangeDetectionStrategy.OnPush`
- **Signal-based APIs** — `input()`, `output()`, `viewChild()`, and `effect()`
- **Tailwind CSS 4** — utility-first styling alongside Material
- **Facade Pattern** — `AuthFacade` and `NotesFacade` as the component API layer
- **Fetch-based HttpClient** — Angular 22 default (no `withXhr()` unless upload progress is needed)
- **Modern DI** — `inject()` instead of constructor injection

## Installation Prerequisites

### Node.js Requirements

Angular 22 requires **Node.js v22.22.3+**, **v24.15.0+**, or **v26.0.0+**. Node.js 20 is no longer supported.

To check your Node.js version:

```bash
node -v
```

If you need to switch versions, use a node version manager:

- **Windows**: [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **macOS/Linux**: [nvm](https://github.com/nvm-sh/nvm)

Example:

```bash
nvm install 24.15.0
nvm use 24.15.0
```

### Angular CLI

Use the project-local CLI (recommended):

```bash
npx ng version
```

Or install globally:

```bash
npm install -g @angular/cli@22
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/vtsitlak/notes-app.git
cd notes-app
```

2. Install dependencies:

```bash
npm install
```

If you encounter peer dependency conflicts (common while `@ngrx/signals` v22 is pending), use:

```bash
npm install --legacy-peer-deps
```

The project also includes `package.json` overrides for `@ngrx/signals` peer dependencies on Angular 22.

## Running the Application

You need **two terminals** — one for the API and one for the Angular dev server.

### Start the Backend Server

```bash
npm run server
```

This starts the json-server REST API at **http://localhost:9000**.

### Start the Development Server

```bash
npm start
```

The application will be available at [http://localhost:4200](http://localhost:4200).

The `npm start` command uses `proxy.json` to forward `/api/*` requests to the backend on port 9000.

## Project Structure

```
src/app/
├── app.component.ts          # Root component (standalone, OnPush)
├── app.config.ts             # Application providers (router, HTTP, animations)
├── app.routes.ts             # Route definitions
├── auth/
│   ├── store/
│   │   ├── auth.store.ts     # Signal Store for authentication
│   │   ├── auth.service.ts   # Authentication HTTP service
│   │   └── auth.facade.ts    # Facade for auth store
│   ├── auth.guard.ts         # Route guard using AuthFacade
│   ├── login/                # Login component (Signal Forms)
│   └── model/                # User model
└── notes/
    ├── store/
    │   ├── notes.store.ts    # Signal Store for notes
    │   ├── notes-http.service.ts  # HTTP service for notes
    │   └── notes.facade.ts   # Facade for notes store
    ├── home/                 # Home component (standalone)
    ├── notes-table-list/     # Notes table (signal inputs/outputs)
    ├── edit-note-dialog/     # Edit/create dialog (Signal Forms)
    ├── shared/               # Shared utilities
    └── model/                # Note model
server/
├── server.ts                 # Express + json-server entry point
├── db.json                   # Mock database
└── auth.route.ts             # Login endpoint
```

## Architecture

### Standalone Components

All feature components are standalone and declare their own dependencies:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon],
})
export class ExampleComponent {}
```

### Signal-based Component APIs

```typescript
export class ExampleComponent {
  data = input<string>();
  change = output<void>();
  paginator = viewChild(MatPaginator);

  private service = inject(ExampleService);

  constructor() {
    effect(() => {
      // reactive side effects in constructor injection context
    });
  }
}
```

### Angular Signal Forms (stable in v22)

Forms use the stable Signal Forms API:

```typescript
import { form, FormField, required } from '@angular/forms/signals';

loginModel = signal({ email: '', password: '' });

loginForm = form(this.loginModel, (schemaPath) => {
  required(schemaPath.email, { message: 'Email is required' });
  required(schemaPath.password, { message: 'Password is required' });
});
```

Template validation pattern:

```html
@if (loginForm.email().touched() && loginForm.email().invalid()) {
  @for (error of loginForm.email().errors(); track error.kind) {
  }
}
```

### Signal Store

State is managed with **NgRx Signal Store** and exposed through facades.

#### Auth Store (`auth/store/auth.store.ts`)

- Methods: `login()`, `logout()`, `setUser()`
- Computed: `isLoggedIn()`, `isLoggedOut()`
- Accessed via `AuthFacade`

#### Notes Store (`notes/store/notes.store.ts`)

- Methods: `loadAll()`, `update()`, `add()`, `delete()`
- Computed: `importantNotes()`
- State: `notes()`, `loading()`, `loaded()`
- Accessed via `NotesFacade`

`rxMethod` calls pass an explicit `Injector` for compatibility with Angular 22's injection context rules.

### Application Configuration

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),   // required by Angular Material
    provideHttpClient()    // Fetch backend (Angular 22 default)
  ]
};
```

### HTTP API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate user |
| GET | `/api/notes` | List all notes |
| POST | `/api/notes` | Create note |
| PATCH | `/api/notes/:id` | Update note (partial) |
| DELETE | `/api/notes/:id` | Delete note |

Note updates use **PATCH** so fields like `created` are preserved (PUT would replace the entire record).

### Styling

- **Tailwind CSS 4** — utility classes in templates
- **Angular Material 22** — form fields, table, dialog, tabs
- **PostCSS** — Tailwind processing via `@tailwindcss/postcss`

## Build

### Development Build

```bash
npm run build
```

### Production Build

```bash
npx ng build --configuration production
```

Build artifacts are stored in `dist/notes-app/`.

## Testing

### Unit Tests

```bash
npm test
# or headless single run:
npx ng test --watch=false --browsers=ChromeHeadless
```

Specs cover components, services, facades, guards, and Signal Stores:

| Area | Spec files |
|------|------------|
| App shell | `app.component.spec.ts` |
| Auth | `login.component.spec.ts`, `auth.guard.spec.ts`, `auth.service.spec.ts`, `auth.facade.spec.ts`, `auth.store.spec.ts` |
| Notes | `home.component.spec.ts`, `notes-table-list.component.spec.ts`, `edit-note-dialog.component.spec.ts`, `notes-http.service.spec.ts`, `notes.facade.spec.ts`, `notes.store.spec.ts` |

Karma coverage uses `istanbul-lib-instrument` (required as an explicit peer on Angular 22).

### End-to-End Tests (Playwright)

Protractor was removed (unsupported on Angular 22). E2E uses **Playwright**.

1. Install browsers once:

```bash
npx playwright install chromium
```

2. Start the API server (required for login):

```bash
npm run server
```

3. Run e2e tests (Playwright starts `npm start` if needed):

```bash
npm run e2e
```

Optional UI mode:

```bash
npm run e2e:ui
```

Covered flows: login page, login → notes, logout, open create-note dialog.

## Key Dependencies

### Core

| Package | Version |
|---------|---------|
| `@angular/core` | ^22.0.6 |
| `@angular/material` | ^22.0.4 |
| `@angular/forms` | ^22.0.6 (Signal Forms) |
| `@ngrx/signals` | ^21.0.1 (Angular 22 via overrides) |
| `rxjs` | ^7.8.1 |
| `typescript` | ~6.0.3 |
| `zone.js` | ^0.15.0 |

### Development

| Package | Version |
|---------|---------|
| `@angular/cli` | ^22.0.6 |
| `@angular-devkit/build-angular` | ^22.0.6 |
| `tailwindcss` | ^4.0.0 |
| `karma` + `karma-coverage` | ^6.4.4 / ^2.2.1 |
| `istanbul-lib-instrument` | ^6.0.3 |
| `@playwright/test` | ^1.61.1 |
| `@types/json-server` | ^0.14.8 |

## Migration Notes

### Angular 21 → Angular 22

| Area | Change |
|------|--------|
| Node.js | Requires v22.22.3+, v24.15.0+, or v26.0.0+ |
| TypeScript | Upgraded to ~6.0.3 |
| Signal Forms | Graduated from experimental to **stable** |
| Change detection | **OnPush** is the default for new components |
| HttpClient | Fetch backend is default; `withXhr()` only if upload progress is needed |
| Karma coverage | `istanbul-lib-instrument` is an optional peer — added explicitly |
| `@ngrx/signals` | Still on v21; use `overrides` or `--legacy-peer-deps` until v22 ships |

Upgrade command used:

```bash
npx ng update @angular/core@22 @angular-devkit/build-angular@22 @angular/cdk@22 @angular/material@22
```

### Earlier history

- **Angular 8** → **Angular 21** → **Angular 22**
- **NgModules** → **Standalone Components**
- **NgRx Store** → **NgRx Signal Store**
- **Observables + async pipe** → **Signals**
- **Reactive Forms** → **Signal Forms**
- **@Input/@Output** → **input()/output()**
- **@ViewChild** → **viewChild()**
- **Constructor injection** → **inject()**
- **Custom CSS** → **Tailwind CSS**

## Troubleshooting

### Node.js Version Errors

Angular 22 will refuse to run on unsupported Node versions. Use v24.15.0+ (recommended) or v22.22.3+.

### `npx ng` / CLI Not Found

If `npx ng` fails with "could not determine executable to run", dependencies may be incomplete. Run `npm install`, or use:

```bash
npx @angular/cli@22 <command>
```

### Peer Dependency Conflicts

```bash
npm install --legacy-peer-deps
```

### API Connection Refused (`ECONNREFUSED` on port 9000)

Start the backend in a separate terminal:

```bash
npm run server
```

### Port Already in Use

**Frontend (4200):**

```bash
npx ng serve --port 4201
```

**Backend (9000):**

```bash
netstat -ano | findstr :9000
Stop-Process -Id <PID> -Force
npm run server
```

### Notes List Breaks After Edit

Ensure note updates use **PATCH** (not PUT) so `created` and other fields are not wiped from `db.json`.

## Further Help

- [Angular Documentation](https://angular.dev)
- [Angular 22 release notes](https://angular.dev/reference/versions)
- [NgRx Signals Documentation](https://ngrx.io/guide/signals)
- [Angular Material Documentation](https://material.angular.io)
- [Angular CLI Documentation](https://angular.dev/tools/cli)

## License

This project is for educational purposes.
