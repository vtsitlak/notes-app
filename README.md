# NotesApp

NotesApp version 0.0.0

This project has been migrated to **Angular 21** with **standalone components** and **Signal Store** for state management.

## Description

NotesApp is a demo note managing application that demonstrates modern Angular development practices including:
- **Angular 21** with standalone components (no NgModules)
- **Angular Material** for UI components
- **Angular Animations** for smooth transitions
- **TypeScript 5.9** for type safety
- **RxJS 7.8** for reactive programming
- **NgRx Signals** for signal-based state management
- **Express** and **json-server** for the REST API backend

The application was originally based on NgRx (with NgRx Data) but has been modernized to use **NgRx Signal Store**, Angular's new signal-based state management solution.

## Key Features

- ✅ **Angular 21** - Latest Angular version with standalone components
- ✅ **Signal Store** - Modern signal-based state management (replacing NgRx Store)
- ✅ **Standalone Components** - No NgModules, all components are standalone
- ✅ **TypeScript 5.9** - Latest TypeScript features
- ✅ **Angular Material 21** - Material Design components
- ✅ **Signal-based Reactivity** - No async pipes needed, direct signal access

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
│   ├── auth.store.ts        # Signal Store for authentication
│   ├── auth.service.ts      # Authentication HTTP service
│   ├── auth.guard.ts        # Route guard using Signal Store
│   ├── login/               # Login component (standalone)
│   └── model/               # User model
└── notes/
    ├── notes.store.ts       # Signal Store for notes
    ├── home/                # Home component (standalone)
    ├── notes-table-list/    # Notes table component (standalone)
    ├── edit-note-dialog/    # Edit note dialog (standalone)
    ├── services/            # HTTP services
    └── model/               # Note model
```

## Architecture

### Standalone Components

All components are standalone (no NgModules). Each component imports its own dependencies:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon],
  // ...
})
```

### Signal Store

The application uses **NgRx Signal Store** for state management:

#### Auth Store (`auth.store.ts`)
- Manages user authentication state
- Methods: `login()`, `logout()`, `setUser()`
- Computed signals: `isLoggedIn()`, `isLoggedOut()`

#### Notes Store (`notes.store.ts`)
- Manages notes collection
- Methods: `loadAll()`, `update()`, `add()`
- Computed signals: `importantNotes()`
- State signals: `notes()`, `loading()`, `loaded()`

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
- `@ngrx/signals`: ^21.0.1
- `rxjs`: ^7.8.1
- `typescript`: ~5.9.0

### Development Dependencies
- `@angular/cli`: ^21.0.0
- `@angular-devkit/build-angular`: ^21.0.0
- `karma`: ^6.4.4
- `jasmine-core`: ^5.4.0

## Migration Notes

This project was migrated from:
- **Angular 8** → **Angular 21**
- **NgModules** → **Standalone Components**
- **NgRx Store** → **NgRx Signal Store**
- **Observables with async pipe** → **Signals**

### What Changed

1. **Removed NgModules**: All `@NgModule` decorators removed, components are now standalone
2. **Signal Store**: Replaced NgRx Store/Effects with Signal Store for simpler, signal-based state management
3. **Direct Signal Access**: Components access state directly via signals instead of observables
4. **Simplified Configuration**: Removed NgRx Store, Effects, Router Store, and Entity Data providers

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
