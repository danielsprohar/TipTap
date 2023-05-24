import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Metrica } from '../models/metrica'

@Injectable({
  providedIn: 'root',
})
export class MetricsService {
  private readonly wordSize = 5
  private readonly _metrica$ = new BehaviorSubject<Metrica>(new Metrica())
  readonly metrics$ = this._metrica$.asObservable()

  constructor() {}

  setMetrics(metrica: Metrica) {
    this._metrica$.next(metrica)
  }

  reset() {
    this._metrica$.next(new Metrica())
  }

  /**
   * Calculate the number of words per minute (WPM).
   * @param deltaSeconds The time delta (in seconds)
   */
  calcWordsPerMinute(deltaSeconds: number) {
    // https://www.speedtypingonline.com/typing-equations
    if (deltaSeconds === 0) return

    this._metrica$.next(
      new Metrica({
        ...this._metrica$.value,
        wpm: Math.floor(
          // words
          this._metrica$.value.characterCount /
            this.wordSize /
            // over time
            (deltaSeconds / 60)
        ),
      })
    )
  }

  incrementCharacterCount(value = 1) {
    this._metrica$.next(
      new Metrica({
        ...this._metrica$.value,
        characterCount: this._metrica$.value.characterCount + value,
      })
    )
  }

  incrementWordCount(value = 1) {
    this._metrica$.next(
      new Metrica({
        ...this._metrica$.value,
        wordCount: this._metrica$.value.wordCount + value,
      })
    )
  }

  incrementErrorCount(value = 1) {
    this._metrica$.next(
      new Metrica({
        ...this._metrica$.value,
        errorCount: this._metrica$.value.errorCount + value,
      })
    )
  }
}
