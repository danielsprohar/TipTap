import { Injectable } from '@angular/core'
import { BehaviorSubject, Subject } from 'rxjs'
import { Metrica } from '../models/metrica'

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly metricaSubject = new BehaviorSubject<Metrica>(new Metrica())
  private readonly showResultsSubject = new Subject<Metrica>()
  private readonly resetSubject = new Subject<boolean>()
  private readonly sessionDuration = 60
  private readonly wordSize = 5

  constructor() {}

  get metrica() {
    return this.metricaSubject.value
  }

  get metrica$() {
    return this.metricaSubject.asObservable()
  }

  get duration() {
    return this.sessionDuration
  }

  get results$() {
    return this.showResultsSubject.asObservable()
  }

  get reset$() {
    return this.resetSubject.asObservable()
  }

  setMetrica(metrica: Metrica) {
    this.metricaSubject.next(metrica)
  }

  reset() {
    this.resetSubject.next(true)
    this.metricaSubject.next(new Metrica())
  }

  /**
   * Calculate the number of words per minute (WPM).
   * @param dt The time delta (in seconds)
   */
  calcWordsPerMinute(dt: number) {
    // https://www.speedtypingonline.com/typing-equations
    if (dt === 0) return

    this.metricaSubject.next(
      new Metrica({
        ...this.metricaSubject.value,
        wpm: Math.floor(
          // words
          this.metricaSubject.value.characterCount /
            this.wordSize /
            // over time
            (dt / 60)
        ),
      })
    )
  }

  incrementCharacterCount(value = 1) {
    this.metricaSubject.next(
      new Metrica({
        ...this.metricaSubject.value,
        characterCount: this.metricaSubject.value.characterCount + value,
      })
    )
  }

  incrementWordCount(value = 1) {
    this.metricaSubject.next(
      new Metrica({
        ...this.metricaSubject.value,
        wordCount: this.metricaSubject.value.wordCount + value,
      })
    )
  }

  incrementErrorCount(value = 1) {
    this.metricaSubject.next(
      new Metrica({
        ...this.metricaSubject.value,
        errorCount: this.metricaSubject.value.errorCount + value,
      })
    )
  }
}
