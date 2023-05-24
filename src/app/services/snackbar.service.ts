import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly messageSubject = new BehaviorSubject<string>('')

  constructor() {}

  get message$() {
    return this.messageSubject.asObservable()
  }

  open(message: string) {
    this.messageSubject.next(message)
  }

  close() {
    this.messageSubject.next('')
  }
}
