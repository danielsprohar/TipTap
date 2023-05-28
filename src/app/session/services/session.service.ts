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

export const SESSION_DURATION_MILLISECONDS = 30_000

@Injectable()
export class SessionService {
  private readonly startedSource = new Subject<void>()
  private readonly stoppedSource = new Subject<void>()
  private readonly resetSource = new Subject<void>()
  private readonly completedSource = new Subject<void>()
  private _durationSeconds = SESSION_DURATION_MILLISECONDS / 1000
  private _lesson: Lesson | null = null
  private _startedAt: Date | null = null
  private _completedAt: Date | null = null
  private _time$: Observable<number> = this.createInterval()
  private _wordSize = 5

  readonly started$ = this.startedSource.asObservable().pipe(shareReplay())
  readonly reset$ = this.resetSource.asObservable().pipe(shareReplay())
  readonly completed$ = this.completedSource.asObservable().pipe(shareReplay())

  constructor(private readonly metricsService: MetricsService) {}

  get time$() {
    return this._time$
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
    this.resetSource.next()
    this.metricsService.reset()
    this._time$ = this.createInterval()
  }

  start(): void {
    this._startedAt = new Date()
    this.metricsService.reset()
    this.startedSource.next()
  }

  stop(): void {
    this._completedAt = new Date()
    this.stoppedSource.next()
    this.completedSource.next()
  }

  createTimer(): Observable<number> {
    return timer(SESSION_DURATION_MILLISECONDS + 1000).pipe(
      takeUntil(this.stoppedSource)
    )
  }

  createInterval(): Observable<number> {
    const timer$ = this.createTimer()
    return interval(1000).pipe(
      takeUntil(timer$),
      share(),
      map((timeSeconds) => timeSeconds + 1),
      tap((timeSeconds) =>
        this.metricsService.sample(timeSeconds, this._wordSize)
      ),
      finalize(() => this.stop())
    )
  }
}
