import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { NotFoundComponent } from './not-found/not-found.component'
import { sessionLessonResolver, randomLessonResolver } from './resolvers'

export const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
    path: 'random',
    loadComponent: () =>
      import('./session/session.component').then(
        (component) => component.SessionComponent
      ),
    resolve: {
      words: randomLessonResolver,
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
]
