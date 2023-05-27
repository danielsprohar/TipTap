import { Injectable } from '@angular/core'
import {
  Observable,
  Subject,
  finalize,
  interval,
  map,
  share,
  takeUntil,
  tap,
  timer,
} from 'rxjs'
import { MetricsService } from './metrics.service'

const SESSION_LENGTH_MS = 30_000

@Injectable()
export class SessionService {
  private readonly startedSource = new Subject<void>()
  private readonly stoppedSource = new Subject<void>()
  private readonly resetSource = new Subject<void>()
  private readonly completedSource = new Subject<void>()
  private readonly _lengthSeconds = SESSION_LENGTH_MS / 1000
  private _time$: Observable<number> = this.createInterval()

  readonly started$ = this.startedSource.asObservable().pipe(share())
  readonly reset$ = this.resetSource.asObservable().pipe(share())
  readonly completed$ = this.completedSource.asObservable().pipe(share())

  constructor(private readonly metricsService: MetricsService) {}

  get lengthSeconds() {
    return this._lengthSeconds
  }

  get time$() {
    return this._time$
  }

  reset(): void {
    this.resetSource.next()
    this.metricsService.reset()
    this._time$ = this.createInterval()
  }

  start(): void {
    this.metricsService.reset()
    this.startedSource.next()
  }

  stop(): void {
    this.stoppedSource.next()
  }

  createTimer(): Observable<number> {
    return timer(SESSION_LENGTH_MS + 1000).pipe()
  }

  createInterval(): Observable<number> {
    const timer$ = this.createTimer()
    return interval(1000).pipe(
      takeUntil(timer$),
      share(),
      map((timeSeconds) => timeSeconds + 1),
      tap((timeSeconds) => this.metricsService.sample(timeSeconds)),
      finalize(() => this.completedSource.next())
    )
  }
}
