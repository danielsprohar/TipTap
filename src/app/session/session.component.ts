import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog'
import { ActivatedRoute, ParamMap } from '@angular/router'
import {
  finalize,
  map,
  Observable,
  shareReplay,
  Subscription,
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
})
export class SessionComponent implements OnInit, OnDestroy {
  private subsink = new Array<Subscription>()
  private timerSub?: Subscription
  private keyboardHandler!: any

  inProgress = false
  time: number = 0
  timer$: Observable<number> | null = null
  metrica$!: Observable<Metrica>
  metrica!: Metrica
  lesson$?: Observable<Lesson>
  book$?: Observable<Book>

  constructor(
    readonly session: SessionService,
    @Inject(DOCUMENT) private document: Document,
    protected keyboard: KeyboardService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.keyboardHandler = this.handleKeyboard.bind(this)
    this.metrica$ = this.session.metrica$
    this.subsink.push(
      this.session.metrica$.subscribe((metrica) => (this.metrica = metrica))
    )

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

    this.subsink.push(
      this.session.reset$.subscribe((value: boolean) => {
        if (value) {
          this.init()
          this.start()
        }
      })
    )

    this.init()
  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe()
      console.log('Unsubscribed from the Timer.')
      this.document.removeEventListener('keydown', this.keyboardHandler, true)
      console.log('Removed the keyboard handler.')
    }

    this.subsink.forEach((sub) => sub.unsubscribe())
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

    this.keyboard.setKeyboardEvent(event)
  }

  /**
   * Create the session's timer
   * @returns The timer as an `Observable`
   */
  private createTimer() {
    return timer(0, 1000).pipe(
      shareReplay(),
      takeWhile((secondsElapsed) => secondsElapsed <= this.session.duration),
      tap((secondsElapsed) => {
        this.session.calcWordsPerMinute(secondsElapsed)
        if (secondsElapsed === this.session.duration) {
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
      data: this.session.metrica,
    })
  }

  /**
   * Initialize the session
   */
  init() {
    this.document.addEventListener('keydown', this.keyboardHandler, true)
    this.timer$ = this.createTimer()
  }

  /**
   * Start the session
   */
  start() {
    if (this.timer$) {
      this.timerSub = this.timer$.subscribe(
        (value: number) => (this.time = value)
      )
    }
  }
}
