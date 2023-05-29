import { Routes } from '@angular/router'
import { sessionLessonResolver } from '../resolvers'
import { SessionComponent } from './session.component'

export const sessionRoutes: Routes = [
  {
    path: '',
    component: SessionComponent,
    resolve: {
      words: sessionLessonResolver,
    },
  },
]
