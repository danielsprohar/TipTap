import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { ActivatedRoute, ParamMap } from '@angular/router'
import {
  Observable,
  Subject,
  map,
  share,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from 'rxjs'
import { LessonBuilder } from '../lessons/builders/lesson-builder'
import { Lesson } from '../lessons/models/lesson'
import { Book } from '../models/book'
import { MetricsComponent } from './metrics/metrics.component'
import { ResultsDialogComponent } from './results-dialog/results-dialog.component'
import { KeyboardService } from './services/keyboard.service'
import { MetricsService } from './services/metrics.service'
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
    })
  )

  readonly lesson$: Observable<Lesson> = this.route.queryParamMap.pipe(
    map((paramMap: ParamMap) => new LessonBuilder().buildFromParamMap(paramMap))
  )

  constructor(
    private readonly sessionService: SessionService,
    private readonly keyboardService: KeyboardService,
    private readonly metricsService: MetricsService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sessionService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe((resetRequested: boolean) => {
        if (resetRequested) {
          this.stop()
          this.start()
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
  }

  /**
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#instance_properties
   * @param event The KeyboardEvent
   */
  @HostListener('document:keyup', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    // TODO: Check if the session is in progress

    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat
    if (event.repeat) return
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey
    if (event.ctrlKey) return
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey
    if (event.altKey) return
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey
    if (event.metaKey) return
    if (event.key === 'Shift') return
    // Ignore function keys
    if (event.key.length > 1 && event.key.charAt(0) === 'F') return

    this.keyboardService.setKeyPressed(event.key)
  }

  /**
   * Create the session's timer
   * @returns The timer as an `Observable`
   */
  private createTimer() {
    return timer(0, 1000).pipe(
      share(),
      takeWhile(
        (secondsElapsed) => secondsElapsed <= this.sessionService.duration
      ),
      tap((secondsElapsed) => {
        this.metricsService.calcWordsPerMinute(secondsElapsed)
        if (secondsElapsed === this.sessionService.duration) {
          this.openResultsDialog()
        }
      })
    )
  }

  start(): void {}

  stop(): void {}

  reset(): void {}

  private openResultsDialog() {
    this.dialog.open(ResultsDialogComponent)
  }
}
