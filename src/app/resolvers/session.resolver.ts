import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router'
import dataSource from '../../assets/data/word-data.json'

export const sessionResolver: ResolveFn<string[]> = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const data: string[][] = dataSource
  const randomIndex = Math.floor(Math.random() * data.length)
  const randomElement = data[randomIndex]
  return randomElement
    .map((phrase) => phrase.split(' '))
    .flatMap((words) => words)
}
