import { AsyncPipe, DOCUMENT, NgIf, TitleCasePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { ActivatedRoute, ParamMap } from '@angular/router'
import {
  Observable,
  Subject,
  finalize,
  map,
  shareReplay,
  takeUntil,
  takeWhile,
  tap,
  timer,
} from 'rxjs'
import { LessonBuilder } from '../lessons/builders/lesson-builder'
import { Lesson } from '../lessons/models/lesson'
import { Book } from '../models/book'
import { Metrica } from './models/metrica'
import { ResultsDialogComponent } from './results-dialog/results-dialog.component'
import { KeyboardService } from './services/keyboard.service'
import { SessionService } from './services/session.service'
import { TerminalComponent } from './terminal/terminal.component'

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  providers: [
    {
      provide: Document,
      useValue: document,
    },
  ],
  standalone: true,
  imports: [
    NgIf,
    MatDividerModule,
    TerminalComponent,
    AsyncPipe,
    TitleCasePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private keyboardHandler!: any
  readonly metrica$: Observable<Metrica> = this.sessionService.metrica$

  inProgress = false
  time: number = 0
  timer$: Observable<number> | null = null
  metrica!: Metrica
  lesson$?: Observable<Lesson>
  book$?: Observable<Book>

  constructor(
    @Inject(DOCUMENT) private document: Document,
    readonly sessionService: SessionService,
    protected readonly keyboardService: KeyboardService,
    private readonly route: ActivatedRoute,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.keyboardHandler = this.handleKeyboard.bind(this)
    this.metrica$
      .pipe(takeUntil(this.destroy$))
      .subscribe((metrica) => (this.metrica = metrica))

    // Check if we are doing a random word sequence
    this.lesson$ = this.route.queryParamMap.pipe(
      map((paramMap: ParamMap) =>
        new LessonBuilder().buildFromParamMap(paramMap)
      )
    )

    // Check if we are doing an "advanced" lesson
    this.book$ = this.route.data.pipe(
      map((data) => {
        return data['book'] as Book
      })
    )

    this.sessionService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.init()
          this.start()
        }
      })

    this.init()
  }

  ngOnDestroy() {
    this.destroy$.next()
  }

  /**
   * Handle the keyboard event
   * @param event The keyboard event
   * @returns
   */
  private handleKeyboard(event: KeyboardEvent) {
    if (event.isComposing) return
    // event.preventDefault()

    if (!this.inProgress) {
      this.inProgress = true
      this.start()
    }

    this.keyboardService.setKeyboardEvent(event)
  }

  /**
   * Create the session's timer
   * @returns The timer as an `Observable`
   */
  private createTimer() {
    return timer(0, 1000).pipe(
      shareReplay(),
      takeWhile(
        (secondsElapsed) => secondsElapsed <= this.sessionService.duration
      ),
      tap((secondsElapsed) => {
        this.sessionService.calcWordsPerMinute(secondsElapsed)
        if (secondsElapsed === this.sessionService.duration) {
          this.showResults()
        }
      }),
      finalize(() => {
        this.document.removeEventListener('keydown', this.keyboardHandler, true)
      })
    )
  }

  private showResults() {
    this.dialog.open(ResultsDialogComponent, {
      data: this.sessionService.metrica,
    })
  }

  /**
   * Initialize the session
   */
  init() {
    // TODO: Replace this with a HostListener
    this.document.addEventListener('keydown', this.keyboardHandler, true)
    this.timer$ = this.createTimer()
  }

  /**
   * Start the session
   */
  start() {
    // TODO: Refactor this shit code
    // this.timer$.pipe(takeUntil(this.destroy$)).subscribe(
    //   (value: number) => (this.time = value)
    // )
  }
}
