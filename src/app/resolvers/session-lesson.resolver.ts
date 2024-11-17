import { inject } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { EMPTY, of } from 'rxjs'
import { CharacterSpace } from '../lessons/character-space'
import { Lesson } from '../models/lesson'
import { RandomWordGeneratorService } from '../session/services/random-word-generator.service'

export const sessionLessonResolver: ResolveFn<string[]> = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const router = inject(Router)
  if (route.queryParamMap.keys.length === 0) {
    router.navigateByUrl('/lessons')
    return EMPTY
  }
  const rwg = inject(RandomWordGeneratorService)
  const wordCount = 1_000
  const wordSize = 5

  const lesson = Lesson.builder().buildFromParamMap(route.queryParamMap)
  const words = rwg.createRandomWords(
    CharacterSpace.fromLesson(lesson),
    wordCount,
    wordSize
  )

  return of(words)
}
