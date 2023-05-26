import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout'
import { Injectable } from '@angular/core'
import { Observable, map, shareReplay } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class HandsetService {
  readonly isHandset$: Observable<boolean> = this.observer
    .observe([Breakpoints.Handset])
    .pipe(
      map((result: BreakpointState) => result.matches),
      shareReplay()
    )

  constructor(private readonly observer: BreakpointObserver) {}
}
