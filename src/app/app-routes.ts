import { Routes } from '@angular/router'
import { NotFoundComponent } from './components/not-found/not-found.component'
import { WelcomeComponent } from './components/welcome/welcome.component'

export const appRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'lessons',
    loadComponent: () =>
      import('./lessons/lessons.component').then((component) => component.LessonsComponent),
  },
  {
    path: 'session',
    loadComponent: () =>
      import('./session/session.component').then((component) => component.SessionComponent),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]
