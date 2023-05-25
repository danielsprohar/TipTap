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
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable, Subject, map, share, takeUntil } from 'rxjs'
import { LessonBuilder } from '../lessons/builders/lesson-builder'
import { Lesson } from '../lessons/models/lesson'
import { Book } from '../models/book'
import { MetricsComponent } from './metrics/metrics.component'
import { ResultsDialogComponent } from './results-dialog/results-dialog.component'
import { KeyboardService } from './services/keyboard.service'
import { SessionService } from './services/session.service'
import { TerminalComponent } from './terminal/terminal.component'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MetricsComponent,
    NgIf,
    TerminalComponent,
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
    map((paramMap: ParamMap) => new LessonBuilder().buildFromParamMap(paramMap))
  )

  isSessionInProgress = false

  constructor(
    private readonly sessionService: SessionService,
    private readonly keyboardService: KeyboardService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.isSessionInProgress = true))

    this.sessionService.stopped$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = false
        this.changeDetector.detectChanges()
      })

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = false
        this.changeDetector.detectChanges()
        this.openResultsDialog()
      })

    this.sessionService.reset$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.sessionService.start()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  /**
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#instance_properties
   * @param event The KeyboardEvent
   */
  @HostListener('document:keyup', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.isSessionInProgress) return
    if (event.key === 'Enter') return
    if (event.key === 'Shift') return

    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
    if (event.repeat) return

    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey
    if (event.ctrlKey) return

    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey
    if (event.altKey) return

    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
    if (event.metaKey) return

    // Ignore function keys
    if (event.key.length > 1 && event.key.charAt(0) === 'F') return

    this.keyboardService.setKeyPressed(event.key)
  }

  start(): void {
    this.sessionService.start()
  }

  stop(): void {
    this.sessionService.stop()
  }

  openResultsDialog() {
    this.dialog.open(ResultsDialogComponent)
  }
}
