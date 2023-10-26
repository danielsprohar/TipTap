import { Injectable } from '@angular/core'
import {
  Observable,
  Subject,
  finalize,
  interval,
  map,
  share,
  shareReplay,
  takeUntil,
  tap,
  timer,
} from 'rxjs'
import { Lesson } from '../../models'
import { MetricsService } from './metrics.service'

export const SESSION_DURATION_MILLISECONDS = 60_000

@Injectable()
export class SessionService {
  private readonly startedSubject = new Subject<void>()
  private readonly stoppedSubject = new Subject<void>()
  private readonly resetSubject = new Subject<void>()
  private readonly completedSubject = new Subject<void>()
  private _durationSeconds = SESSION_DURATION_MILLISECONDS / 1000
  private _lesson: Lesson | null = null
  private _startedAt: Date | null = null
  private _completedAt: Date | null = null
  private _time$: Observable<number> = this.createInterval()
  private _wordSize = 5

  readonly started$ = this.startedSubject.asObservable().pipe(shareReplay())
  readonly reset$ = this.resetSubject.asObservable().pipe(shareReplay())
  readonly completed$ = this.completedSubject.asObservable().pipe(shareReplay())

  constructor(private readonly metricsService: MetricsService) {}

  get time$() {
    return this._time$
  }

  getWordSize(): number {
    return this._wordSize
  }

  getDurationSeconds() {
    return this._durationSeconds
  }

  getLesson() {
    return this._lesson
  }

  getStartedAt() {
    return this._startedAt
  }

  getCompletedAt() {
    return this._completedAt
  }

  setLesson(lesson: Lesson) {
    this._lesson = lesson
  }

  reset(): void {
    this._startedAt = null
    this._completedAt = null
    this.resetSubject.next()
    this.metricsService.reset()
    this._time$ = this.createInterval()
  }

  start(): void {
    this._startedAt = new Date()
    this.metricsService.reset()
    this.startedSubject.next()
  }

  stop(): void {
    this._completedAt = new Date()
    this.stoppedSubject.next()
    this.completedSubject.next()
  }

  createTimer(): Observable<number> {
    return timer(SESSION_DURATION_MILLISECONDS + 1000).pipe(
      takeUntil(this.stoppedSubject)
    )
  }

  createInterval(): Observable<number> {
    const timer$ = this.createTimer()
    return interval(1000).pipe(
      takeUntil(timer$),
      takeUntil(this.stoppedSubject),
      share(),
      map((timeSeconds) => timeSeconds + 1),
      tap((timeSeconds) =>
        this.metricsService.sample(timeSeconds, this._wordSize)
      ),
      finalize(() => this.stop())
    )
  }
}
