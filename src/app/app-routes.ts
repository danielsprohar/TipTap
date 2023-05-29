import { Routes } from '@angular/router'
import { NotFoundComponent } from './components/not-found/not-found.component'
import { sessionResolver } from './resolvers'
import { SessionComponent } from './session/session.component'

export const appRoutes: Routes = [
  {
    path: '',
    component: SessionComponent,
    resolve: {
      words: sessionResolver,
    },
  },
  {
    path: 'lessons',
    loadComponent: () =>
      import('./lessons/lessons.component').then(
        (component) => component.LessonsComponent
      ),
  },
  {
    path: 'session',
    loadComponent: () =>
      import('./session/session.component').then(
        (component) => component.SessionComponent
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]
