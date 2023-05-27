import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class KeyboardService {
  private readonly _keyPressed$ = new Subject<string>()

  get keyPressed$() {
    return this._keyPressed$.asObservable()
  }

  setKeyPressed(key: string) {
    this._keyPressed$.next(key)
  }
}
