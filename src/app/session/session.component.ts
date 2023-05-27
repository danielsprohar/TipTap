/**
 * References:
 * - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
 * - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
 * - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey
 * - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey
 * - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
 */

import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable, Subject, map, share, takeUntil } from 'rxjs'
import { Book, Lesson } from '../models'
import { TerminalComponent } from './components/terminal/terminal.component'
import { TimerComponent } from './components/timer/timer.component'
import { KeyboardService, MetricsService, SessionService } from './services'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  providers: [KeyboardService, SessionService, MetricsService],
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDividerModule,
    NgIf,
    TerminalComponent,
    TimerComponent,
    TitleCasePipe,
  ],
})
export class SessionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  readonly book$: Observable<Book> = this.route.data.pipe(
    map((data) => {
      return data['book'] as Book
    }),
    share()
  )

  readonly lesson$: Observable<Lesson> = this.route.queryParamMap.pipe(
    map((paramMap: ParamMap) => Lesson.builder().buildFromParamMap(paramMap))
  )

  isSessionInProgress = false
  isSessionCompleted = false

  constructor(
    private readonly sessionService: SessionService,
    private readonly keyboardService: KeyboardService,
    private readonly route: ActivatedRoute,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.sessionService.stop()
  }

  ngOnInit(): void {
    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = true
        this.isSessionCompleted = false
        this.changeDetector.detectChanges()
      })

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = false
        this.isSessionCompleted = true
        this.changeDetector.detectChanges()
      })

    this.sessionService.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.sessionService.start()
    })
  }

  @HostListener('document:keyup', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    event.preventDefault()
    if (!this.isSessionInProgress && event.ctrlKey && event.key === 'Enter') {
      this.start()
      return false
    }
    
    if (!this.isSessionInProgress) return
    if (event.repeat) return
    if (event.key === 'Enter') return
    if (event.key === 'Shift') return
    if (event.key === 'Control') return
    if (event.key === 'Alt') return
    if (event.metaKey) return
    if (event.key.length > 1 && event.key.charAt(0) === 'F') return

    this.keyboardService.setKeyPressed(event.key)
    return false
  }

  start(): void {
    this.sessionService.start()
  }

  stop(): void {
    this.sessionService.stop()
  }
}
