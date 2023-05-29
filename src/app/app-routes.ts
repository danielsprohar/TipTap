import { Routes } from '@angular/router'
import { NotFoundComponent } from './not-found/not-found.component'
import { sessionLessonResolver, sessionResolver } from './resolvers'
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
    path: 'about',
    loadComponent: () =>
      import('./about/about.component').then(
        (component) => component.AboutComponent
      ),
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
    resolve: {
      words: sessionLessonResolver,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]
