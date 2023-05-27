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

@Injectable()
export class SessionService {
  private readonly startedSource = new Subject<void>()
  private readonly stoppedSource = new Subject<void>()
  private readonly resetSource = new Subject<void>()
  private readonly completedSource = new Subject<void>()
  private readonly _lengthSeconds = 30
  private _time$: Observable<number> = this.createInterval()

  readonly started$ = this.startedSource.asObservable()
  readonly reset$ = this.resetSource.asObservable()
  readonly completed$ = this.completedSource.asObservable()

  constructor(private readonly metricsService: MetricsService) {}

  get lengthSeconds() {
    return this._lengthSeconds
  }

  get time$() {
    return this._time$
  }

  reset(): void {
    this.resetSource.next()
    this._time$ = this.createInterval()
  }

  start(): void {
    this.startedSource.next()
  }

  stop(): void {
    this.stoppedSource.next()
  }

  createTimer(): Observable<number> {
    return timer(31_000).pipe(
      takeUntil(this.stoppedSource.asObservable()),
      finalize(() => this.completedSource.next())
    )
  }

  createInterval(): Observable<number> {
    const timer$ = this.createTimer()
    return interval(1000).pipe(
      takeUntil(timer$),
      map((time) => time + 1),
      tap((time) => this.metricsService.sample(time)),
      share()
    )
  }
}
