import { Injectable } from '@angular/core'
import {
  Observable,
  Subject,
  finalize,
  interval,
  map,
  share,
  takeUntil,
  timer,
} from 'rxjs'

// In milliseconds
const ONE_MINUTE = 60_000

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly destroy$ = new Subject<void>()
  private readonly startedSource = new Subject<void>()
  private readonly stoppedSource = new Subject<void>()
  private readonly resetSource = new Subject<void>()
  private readonly completedSource = new Subject<void>()
  private _time$: Observable<number> = this.createInterval()

  readonly started$ = this.startedSource.asObservable()
  readonly stopped$ = this.stoppedSource.asObservable()
  readonly reset$ = this.resetSource.asObservable()
  readonly completed$ = this.completedSource.asObservable()

  get time$() {
    return this._time$
  }

  reset(): void {
    this.destroy$.next()
    this.resetSource.next()
    this._time$ = this.createInterval()
  }

  start(): void {
    this.startedSource.next()
  }

  stop(): void {
    this.stoppedSource.next()
    this.destroy$.next()
  }

  createTimer(): Observable<number> {
    return timer(ONE_MINUTE).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.completedSource.next())
    )
  }

  createInterval(): Observable<number> {
    const timer$ = this.createTimer()
    return interval(1000).pipe(
      takeUntil(timer$),
      map((time) => time + 1),
      share()
    )
  }
}
