import { Injectable } from '@angular/core'
import { Subject, shareReplay } from 'rxjs'

@Injectable()
export class KeyboardService {
  private readonly _keyPressed$ = new Subject<string>()
  readonly keyPressed$ = this._keyPressed$.asObservable().pipe(shareReplay())

  setKeyPressed(key: string) {
    this._keyPressed$.next(key)
  }
}
