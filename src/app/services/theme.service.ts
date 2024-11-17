import { Injectable } from "@angular/core";
import { BehaviorSubject, shareReplay } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly isDarkThemeSource = new BehaviorSubject<boolean>(false);
  readonly isDarkTheme$ = this.isDarkThemeSource
    .asObservable()
    .pipe(shareReplay());

  constructor() {}

  setDarkTheme() {
    this.isDarkThemeSource.next(true);
  }

  setLightTheme() {
    this.isDarkThemeSource.next(false);
  }

  toggle() {
    this.isDarkThemeSource.next(!this.isDarkThemeSource.value);
  }
}
