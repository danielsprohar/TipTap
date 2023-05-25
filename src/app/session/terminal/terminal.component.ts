import { AsyncPipe, NgIf } from '@angular/common'
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
import { ThemeService } from '../../services/theme.service'
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
  imports: [AsyncPipe, NgIf, MatCardModule, MatProgressSpinnerModule],
})
export class TerminalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly terminalFlashDuration$ = timer(100)
  private readonly wordCount = 1500

  readonly isDarkTheme$ = this.themeService.isDarkTheme$
  queue = 'Click "Start" to begin'
  stack = ''

  @Input() lesson?: Lesson
  @Input() book?: Book

  @ViewChild('terminal') terminal!: ElementRef

  constructor(
    private readonly themeService: ThemeService,
    private readonly keyboardService: KeyboardService,
    private readonly metricsService: MetricsService,
    private readonly sessionService: SessionService,
    private readonly rwg: RandomWordGeneratorService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.lesson === undefined && this.book === undefined) {
      throw new Error()
    }

    this.keyboardService.keyPressed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((key: string) => this.handleKeyPressed(key))

    this.sessionService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.reset())

    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.init())
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  init() {
    this.reset()

    if (this.lesson) {
      const charSpace = new CharacterSpaceBuilder(this.lesson!).build()
      this.queue = this.rwg.createSessionText(charSpace, this.wordCount)
    } else if (this.book && this.book.chapter) {
      this.queue = this.book.chapter.text
    }

    this.changeDetector.detectChanges()
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
}
