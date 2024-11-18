import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class KeyboardService {
  private readonly pressedkey = new Subject<string>();
  readonly pressedKey$ = this.pressedkey.asObservable();

  setPressedKey(key: string) {
    this.pressedkey.next(key);
  }
}
