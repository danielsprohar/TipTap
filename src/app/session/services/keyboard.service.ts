import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

@Injectable()
export class KeyboardService {
  private readonly _key = new Subject<string>()
  readonly key$ = this._key.asObservable()

  keyUp(key: string) {
    this._key.next(key)
  }
}
