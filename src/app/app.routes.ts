import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NotesResolver } from './notes/services/notes.resolver';
import { HomeComponent } from './notes/home/home.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'notes',
    component: HomeComponent,
    resolve: {
      notes: NotesResolver
    },
    canActivate: [AuthGuard]
  },
  {
    path: 'notes/search',
    component: HomeComponent,
    resolve: {
      notes: NotesResolver
    },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
