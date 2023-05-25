import { Injectable } from '@angular/core'
import { BehaviorSubject, share } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _isDarkTheme$ = new BehaviorSubject<boolean>(false)
  readonly isDarkTheme$ = this._isDarkTheme$.asObservable().pipe(share())

  constructor() {}

  setDarkTheme() {
    this._isDarkTheme$.next(true)
  }

  setLightTheme() {
    this._isDarkTheme$.next(false)
  }

  toggle() {
    this._isDarkTheme$.next(!this._isDarkTheme$.value)
  }
}
