import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout'
import { OverlayContainer } from '@angular/cdk/overlay'
import { AsyncPipe, DOCUMENT } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterOutlet } from '@angular/router'
import { AuthService } from '@auth0/auth0-angular'
import { Observable, Subject, map, shareReplay, takeUntil } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    LayoutModule,
    RouterLink,
    MatIconModule,
    RouterOutlet,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  // TODO: Add dark mode toggle
  private readonly destroy$ = new Subject<void>()

  readonly isHandset$: Observable<boolean> = this.observer
    .observe([Breakpoints.Handset])
    .pipe(
      takeUntil(this.destroy$),
      map((result) => result.matches),
      shareReplay()
    )

  @HostBinding('class') className = ''

  constructor(
    private readonly observer: BreakpointObserver,
    private readonly overlay: OverlayContainer,
    public readonly auth: AuthService,
    @Inject(DOCUMENT) public document: Document
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit(): void {
    // TODO: Create ThemeService
    this.observer
      .observe('(prefers-color-scheme: dark)')
      .pipe(
        takeUntil(this.destroy$),
        map((result) => result.matches),
        shareReplay()
      )
      .subscribe((isDarkTheme: boolean) => {
        this.className = isDarkTheme ? 'dark-theme' : ''
        if (isDarkTheme) {
          this.overlay.getContainerElement().classList.add('dark-theme')
        } else {
          this.overlay.getContainerElement().classList.remove('dark-theme')
        }
      })
  }

  logout() {
    this.auth.logout({ returnTo: document.location.origin })
  }
}
