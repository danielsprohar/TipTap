import { Routes } from '@angular/router'
import { environment } from '../environments/environment'
import { NotFoundComponent } from './components/not-found/not-found.component'
import { WelcomeComponent } from './components/welcome/welcome.component'

export const appRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'login',
    redirectTo: `https://${environment.auth.domain}/authorize/`,
    pathMatch: 'full',
  },
  {
    path: 'lessons',
    loadComponent: () =>
      import('./lessons/lessons.component').then((comp) => comp.LessonsComponent),
  },
  {
    path: 'session',
    loadChildren: () =>
      import('./session/session.module').then((m) => m.SessionModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]
