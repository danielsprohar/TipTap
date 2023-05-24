import { NgIf } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Subject, takeUntil, timer } from 'rxjs'
import { CharacterSpaceBuilder } from 'src/app/lessons/builders/character-space-builder'
import { Lesson } from 'src/app/lessons/models/lesson'
import { Book } from 'src/app/models/book'
import { KeyboardService } from '../services/keyboard.service'
import { MetricsService } from '../services/metrics.service'
import { RandomWordGeneratorService } from '../services/random-word-generator.service'
import { SessionService } from '../services/session.service'

@Component({
  standalone: true,
  selector: 'tiptap-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  imports: [NgIf, MatCardModule, MatProgressSpinnerModule],
})
export class TerminalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly terminalFlashDuration$ = timer(100)
  private readonly wordCount = 1500
  queue = ''
  stack = ''

  @Input() lesson?: Lesson
  @Input() book?: Book

  @ViewChild('terminal') terminal!: ElementRef

  constructor(
    private readonly keyboardService: KeyboardService,
    private readonly metricsService: MetricsService,
    private readonly sessionService: SessionService,
    private readonly rwg: RandomWordGeneratorService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.keyboardService.keyPressed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((key: string) => this.handleKeyPressed(key))

    if (this.lesson || this.book) {
      this.init()
    }

    this.sessionService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.reset()
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  /**
   * Initialize the terminal
   * @returns
   */
  init() {
    if (this.lesson) {
      const charSpace = new CharacterSpaceBuilder(this.lesson!).build()
      this.queue = this.rwg.createSessionText(charSpace, this.wordCount)
    } else if (this.book && this.book.chapter) {
      this.queue = this.book.chapter.text
    }
  }

  reset() {
    this.queue = this.stack + this.queue
    this.stack = ''
  }

  flashTerminal() {
    const terminalElement = this.terminal.nativeElement as HTMLElement
    terminalElement.classList.add('flash')
    this.terminalFlashDuration$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      terminalElement.classList.remove('flash')
    })
  }

  handleKeyPressed(key: string) {
    if (this.queue.length === 0) return
    if (key === 'Backspace') {
      this.handleBackspace()
    } else {
      this.handleKey(key)
    }
  }

  handleKey(key: string) {
    if (key !== this.queue[0]) {
      this.flashTerminal()
      this.metricsService.incrementErrorCount()
    } else {
      console.log('handleKey', key)
      this.stack += this.queue[0]
      this.queue = this.queue.substring(1)

      if (this.queue.length && this.queue.charAt(0) === ' ') {
        this.metricsService.incrementWordCount()
      } else {
        this.metricsService.incrementCharacterCount()
      }

      this.changeDetector.detectChanges()
    }
  }

  handleBackspace() {
    if (this.stack.length === 0) return

    if (this.queue.charAt(0) === ' ') {
      this.metricsService.incrementWordCount(-1)
    }

    const popped = this.stack.charAt(this.stack.length - 1)
    this.queue = popped + this.queue
    this.stack = this.stack.substring(0, this.stack.length - 1)
    this.metricsService.incrementCharacterCount(-1)
  }

  /**
   * Checks if the given value is a whitespace character.
   * @param value The key value
   * @returns TRUE if the given value is a whitespace character;
   * otherwise, FALSE.
   */
  // isHTMLWhitespace(value: string): boolean {
  //   return value.charCodeAt(0) === 32 || value.charCodeAt(0) === 160
  // }
}
