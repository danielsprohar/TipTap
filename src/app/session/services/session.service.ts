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

// In milliseconds
const ONE_MINUTE = 60_000

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly destroy$ = new Subject<void>()
  private readonly _started$ = new Subject<void>()
  private readonly _stopped$ = new Subject<void>()
  private readonly _reset$ = new Subject<void>()
  private readonly _completed$ = new Subject<void>()
  private _time$: Observable<number> = this.createInterval()

  get time$() {
    return this._time$
  }

  get started$() {
    return this._started$.asObservable()
  }

  get stopped$() {
    return this._stopped$.asObservable()
  }

  get reset$() {
    return this._reset$.asObservable()
  }

  get completed$() {
    return this._completed$.asObservable()
  }

  reset(): void {
    this.destroy$.next()
    this._reset$.next()
    this._time$ = this.createInterval()
  }

  start(): void {
    this._started$.next()
  }

  stop(): void {
    this._stopped$.next()
    this.destroy$.next()
  }

  createTimer(): Observable<number> {
    // return timer(ONE_MINUTE).pipe(finalize(() => this.destroy$.next()))
    return timer(5000).pipe(
      takeUntil(this.destroy$),
      finalize(() => {
        console.log('finalized: timer')
        this._completed$.next()
      })
    )
  }

  createInterval(): Observable<number> {
    const timer$ = this.createTimer()
    return interval(1000).pipe(
      takeUntil(timer$),
      map((time) => time + 1),
      share(),
      tap((time) => console.log(time))
    )
  }
}
