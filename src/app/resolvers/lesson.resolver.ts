import { inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { EMPTY, of } from 'rxjs'
import { Lesson } from '../models'

export const lessonResolver: ResolveFn<Lesson> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router)
  if (route.queryParamMap.keys.length === 0) {
    router.navigateByUrl('/lessons')
    return EMPTY
  }

  const lesson = Lesson.builder().buildFromParamMap(route.queryParamMap)
  return of(lesson)
}
