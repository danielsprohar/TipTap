import { ResolveFn } from '@angular/router'
import CatchPhrases from '../../assets/words/catch-phrases.json'

export const sessionResolver: ResolveFn<string[]> = (route, state) => {
  return CatchPhrases.map((phrase) => phrase.split(' ')).flatMap(
    (words) => words
  )
}
