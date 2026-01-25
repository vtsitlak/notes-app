# NotesApp

NotesApp version 0.0.0

This project has been migrated to **Angular 21** with **standalone components** and **Signal Store** for state management.

## Description

NotesApp is a demo note managing application that demonstrates modern Angular development practices including:
- **Angular 21** with standalone components (no NgModules)
- **Angular Material** for UI components
- **Tailwind CSS** for utility-first styling
- **Native CSS Animations** for smooth transitions (replacing deprecated Angular animations)
- **Angular Signal Forms** for reactive form handling
- **TypeScript 5.9** for type safety
- **RxJS 7.8** for reactive programming
- **NgRx Signal Store** for signal-based state management
- **Facade Pattern** for clean API abstraction
- **Express** and **json-server** for the REST API backend

The application was originally based on NgRx (with NgRx Data) but has been modernized to use **NgRx Signal Store**, Angular's new signal-based state management solution.

## Key Features

- ✅ **Angular 21** - Latest Angular version with standalone components
- ✅ **Signal Store** - Modern signal-based state management (replacing NgRx Store)
- ✅ **Standalone Components** - No NgModules, all components are standalone by default
- ✅ **Signal-based APIs** - Using `input()`, `output()`, and `viewChild()` signals
- ✅ **Angular Signal Forms** - Modern reactive forms with signal-based validation
- ✅ **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- ✅ **Native CSS Animations** - Using CSS Grid transitions instead of deprecated Angular animations
- ✅ **Facade Pattern** - Clean API layer for components to interact with stores
- ✅ **TypeScript 5.9** - Latest TypeScript features
- ✅ **Angular Material 21** - Material Design components
- ✅ **Signal-based Reactivity** - No async pipes needed, direct signal access
- ✅ **Modern Dependency Injection** - Using `inject()` function instead of constructor injection

## Installation Prerequisites

### Node.js Requirements

This project requires **Node.js version 20.19.0, 22.12.0, or 24.0.0+**.

To check your Node.js version:
```bash
node -v
```

If you need to update Node.js, we recommend using a node version manager:
- **Windows**: [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **macOS/Linux**: [nvm](https://github.com/nvm-sh/nvm)

### Angular CLI

Install the Angular CLI globally:

```bash
npm install -g @angular/cli
```

Verify installation:
```bash
ng version
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

If you encounter peer dependency conflicts, you may need to use:
```bash
npm install --legacy-peer-deps
```

## Running the Application

### Start the Backend Server

In one terminal, start the REST API server:

```bash
npm run server
```

This starts a Node.js Express server with json-server at `http://localhost:3000`.

### Start the Development Server

In another terminal, start the Angular development server:

```bash
npm start
```

The application will be available at [http://localhost:4200](http://localhost:4200).

The `npm start` command uses a proxy configuration (`proxy.json`) to forward API requests to the backend server.

## Project Structure

```
src/app/
├── app.component.ts          # Root component (standalone)
├── app.config.ts            # Application configuration (providers)
├── app.routes.ts            # Route definitions
├── auth/
│   ├── store/
│   │   ├── auth.store.ts     # Signal Store for authentication
│   │   ├── auth.service.ts  # Authentication HTTP service
│   │   └── auth.facade.ts   # Facade for auth store
│   ├── auth.guard.ts        # Route guard using AuthFacade
│   ├── login/               # Login component (uses Signal Forms)
│   └── model/               # User model
└── notes/
    ├── store/
    │   ├── notes.store.ts    # Signal Store for notes
    │   ├── notes-http.service.ts  # HTTP service for notes
    │   └── notes.facade.ts   # Facade for notes store
    ├── home/                # Home component (standalone)
    ├── notes-table-list/    # Notes table component (uses signal inputs/outputs)
    ├── edit-note-dialog/    # Edit note dialog (uses Signal Forms)
    ├── shared/              # Shared utilities
    └── model/               # Note model
```

## Architecture

### Standalone Components

All components are standalone by default (no `standalone: true` needed in Angular 21). Each component imports its own dependencies:

```typescript
@Component({
  selector: 'app-example',
  imports: [MatButton, MatIcon],
  // ...
})
```

### Signal-based Component APIs

Components use modern signal-based APIs instead of decorators:

```typescript
export class ExampleComponent {
  // Signal inputs/outputs instead of @Input/@Output
  data = input<string>();
  change = output<void>();
  
  // Signal viewChild instead of @ViewChild
  paginator = viewChild(MatPaginator);
  
  // inject() instead of constructor injection
  private service = inject(ExampleService);
}
```

### Angular Signal Forms

Forms use Angular's new Signal Forms API:

```typescript
import { form, FormField, required } from '@angular/forms/signals';

loginModel = signal({ email: '', password: '' });

loginForm = form(this.loginModel, (schemaPath) => {
  required(schemaPath.email, { message: 'Email is required' });
  required(schemaPath.password, { message: 'Password is required' });
});
```

### Signal Store

The application uses **NgRx Signal Store** for state management with a **Facade Pattern** for clean API abstraction:

#### Auth Store (`auth/store/auth.store.ts`)
- Manages user authentication state
- Methods: `login()`, `logout()`, `setUser()`
- Computed signals: `isLoggedIn()`, `isLoggedOut()`
- Accessed via `AuthFacade` in components

#### Notes Store (`notes/store/notes.store.ts`)
- Manages notes collection
- Methods: `loadAll()`, `update()`, `add()`, `delete()`
- Computed signals: `importantNotes()`
- State signals: `notes()`, `loading()`, `loaded()`
- Accessed via `NotesFacade` in components

#### Facade Pattern

Facades provide a clean API layer for components:

```typescript
// Components use facades instead of accessing stores directly
export class NotesFacade {
  private readonly store = inject(NotesStore);
  
  readonly notes = this.store.notes;
  readonly loading = this.store.loading;
  
  loadAll(): void {
    this.store.loadAll();
  }
  
  delete(noteId: string | number): void {
    this.store.delete(noteId);
  }
}
```

### Application Configuration

The `app.config.ts` file contains all application-level providers:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
};
```

### Styling

The application uses **Tailwind CSS** for utility-first styling:

- **Tailwind CSS 4.0** - Modern utility-first CSS framework
- **PostCSS** - CSS processing with Tailwind plugin
- **Material Integration** - Tailwind configured to work alongside Angular Material
- **Native CSS Animations** - CSS Grid-based transitions for smooth animations

Styles are primarily applied using Tailwind utility classes in templates, with minimal component-specific SCSS for Material overrides.

### Bootstrap

The `main.ts` file bootstraps the application:

```typescript
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```

## Build

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## Testing

### Unit Tests

Run unit tests via Karma:

```bash
npm test
# or
ng test
```

The project includes comprehensive unit tests for all components, services, facades, and guards:

- **Component Tests**: All components have corresponding `.spec.ts` files using Angular 21 testing patterns
  - `app.component.spec.ts` - Root component tests
  - `auth/login/login.component.spec.ts` - Login component with Signal Forms tests
  - `notes/home/home.component.spec.ts` - Home component tests
  - `notes/notes-table-list/notes-table-list.component.spec.ts` - Notes table component tests
  - `notes/edit-note-dialog/edit-note-dialog.component.spec.ts` - Edit dialog component tests

- **Service Tests**: HTTP services are tested with `HttpTestingController`
  - `auth/store/auth.service.spec.ts` - Authentication service tests
  - `notes/store/notes-http.service.spec.ts` - Notes HTTP service tests

- **Facade Tests**: Facades are tested with spy objects
  - `auth/store/auth.facade.spec.ts` - Auth facade tests
  - `notes/store/notes.facade.spec.ts` - Notes facade tests

- **Guard Tests**: Route guards are tested
  - `auth/auth.guard.spec.ts` - Authentication guard tests

All tests use:
- `TestBed.configureTestingModule` with standalone component imports
- `provideRouter()` and `provideAnimations()` for providers
- Jasmine spy objects for mocking dependencies
- Signal-based testing patterns for Angular 21

### End-to-End Tests

Run e2e tests:

```bash
npm run e2e
# or
ng e2e
```

## Key Dependencies

### Core Dependencies
- `@angular/core`: ^21.0.0
- `@angular/router`: ^21.0.0
- `@angular/material`: ^21.0.0
- `@angular/forms`: ^21.0.0 (includes Signal Forms)
- `@ngrx/signals`: ^21.0.1
- `rxjs`: ^7.8.1
- `typescript`: ~5.9.0
- `zone.js`: ^0.15.0

### Development Dependencies
- `@angular/cli`: ^21.0.0
- `@angular-devkit/build-angular`: ^21.0.0
- `tailwindcss`: ^4.0.0
- `@tailwindcss/postcss`: ^4.0.0
- `postcss`: ^8.4.47
- `autoprefixer`: ^10.4.20
- `karma`: ^6.4.4
- `karma-coverage`: ^2.2.1
- `karma-jasmine`: ^5.1.0
- `karma-jasmine-html-reporter`: ^2.1.0
- `karma-chrome-launcher`: ^3.2.0
- `jasmine-core`: ^5.4.0
- `@types/jasmine`: ^5.1.4

## Migration Notes

This project was migrated from:
- **Angular 8** → **Angular 21**
- **NgModules** → **Standalone Components**
- **NgRx Store** → **NgRx Signal Store**
- **Observables with async pipe** → **Signals**
- **Reactive Forms** → **Signal Forms**
- **@Input/@Output** → **input()/output()**
- **@ViewChild** → **viewChild()**
- **Constructor injection** → **inject()**
- **Angular Animations** → **Native CSS Animations**
- **Custom CSS** → **Tailwind CSS**

### What Changed

1. **Removed NgModules**: All `@NgModule` decorators removed, components are now standalone by default
2. **Signal Store**: Replaced NgRx Store/Effects with Signal Store for simpler, signal-based state management
3. **Facade Pattern**: Introduced facades (`AuthFacade`, `NotesFacade`) for clean API abstraction
4. **Signal-based APIs**: Migrated to `input()`, `output()`, and `viewChild()` signals
5. **Signal Forms**: Replaced Reactive Forms with Angular Signal Forms
6. **Dependency Injection**: Using `inject()` function instead of constructor injection
7. **Native CSS Animations**: Replaced deprecated Angular animations with CSS Grid-based transitions
8. **Tailwind CSS**: Integrated Tailwind CSS 4.0 for utility-first styling
9. **Direct Signal Access**: Components access state directly via signals instead of observables
10. **Simplified Configuration**: Removed NgRx Store, Effects, Router Store, and Entity Data providers
11. **Modern Control Flow**: Using `@if`, `@for` instead of `*ngIf`, `*ngFor`
12. **CRUD Operations**: Added delete functionality to complete CRUD operations

## Troubleshooting

### Node.js Version Issues

If you see errors about Node.js version, ensure you're using Node.js 20.19.0, 22.12.0, or 24.0.0+.

### Peer Dependency Conflicts

If installation fails due to peer dependencies:

```bash
npm install --legacy-peer-deps
```

### Port Already in Use

If port 4200 is already in use:

```bash
ng serve --port 4201
```

## Further Help

- [Angular Documentation](https://angular.dev)
- [NgRx Signals Documentation](https://ngrx.io/guide/signals)
- [Angular Material Documentation](https://material.angular.io)
- [Angular CLI Documentation](https://angular.dev/tools/cli)

## License

This project is for educational purposes.
