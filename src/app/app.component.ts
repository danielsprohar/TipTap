import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule,
} from '@angular/cdk/layout'
import { OverlayContainer } from '@angular/cdk/overlay'
import { AsyncPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatListModule } from '@angular/material/list'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { RouterLink, RouterOutlet } from '@angular/router'
import { Observable, Subject, map, shareReplay, takeUntil, tap } from 'rxjs'
import { ThemeService } from './services/theme.service'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    AsyncPipe,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class') className = ''

  private readonly destroy$ = new Subject<void>()
  readonly isHandset$: Observable<boolean> = this.observer
    .observe([Breakpoints.Handset])
    .pipe(
      takeUntil(this.destroy$),
      map((result) => result.matches),
      shareReplay()
    )

  readonly isDarkTheme$ = this.themeService.isDarkTheme$.pipe(
    tap((isDarkTheme: boolean) => {
      this.className = isDarkTheme ? 'dark-theme' : ''
      if (isDarkTheme) {
        this.overlay.getContainerElement().classList.add('dark-theme')
      } else {
        this.overlay.getContainerElement().classList.remove('dark-theme')
      }
    })
  )

  constructor(
    private readonly observer: BreakpointObserver,
    private readonly overlay: OverlayContainer,
    private readonly themeService: ThemeService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit(): void {
    this.observer
      .observe('(prefers-color-scheme: dark)')
      .pipe(
        takeUntil(this.destroy$),
        map((result) => result.matches)
      )
      .subscribe((isDarkTheme: boolean) => {
        if (isDarkTheme) {
          this.themeService.setDarkTheme()
        } else {
          this.themeService.setLightTheme()
        }

        this.changeDetector.detectChanges()
      })
  }

  toggleTheme() {
    this.themeService.toggle()
  }
}
