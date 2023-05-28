import { AsyncPipe, NgIf } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Subject, takeUntil, timer } from 'rxjs'
import { CharacterSpace } from '../../../lessons/character-space'
import { Book, Lesson } from '../../../models'
import { ThemeService } from '../../../services/theme.service'
import {
  KeyboardService,
  MetricsService,
  RandomWordGeneratorService,
  SessionService,
} from '../../services'

@Component({
  standalone: true,
  selector: 'tiptap-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  imports: [AsyncPipe, NgIf, MatCardModule, MatProgressSpinnerModule],
  providers: [RandomWordGeneratorService],
})
export class TerminalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly terminalFlashDuration$ = timer(100)
  private readonly wordCount = 1500

  readonly isDarkTheme$ = this.themeService.isDarkTheme$
  queue = '"Shift" + "Enter" to start'
  stack = ''

  @Input() lesson?: Lesson
  // TODO: Remove this
  @Input() book?: Book

  @ViewChild('terminal') terminal!: ElementRef
  @ViewChild('stack') stackRef?: ElementRef

  constructor(
    private readonly themeService: ThemeService,
    private readonly keyboardService: KeyboardService,
    private readonly metricsService: MetricsService,
    private readonly sessionService: SessionService,
    private readonly rwg: RandomWordGeneratorService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (this.lesson === undefined && this.book === undefined) {
      throw new Error('Lesson or book must be provided')
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

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Cound how many child nodes of the stack element have the error class
        const stackElement = this.stackRef!.nativeElement as HTMLElement
        const errorCount = stackElement.querySelectorAll('.error').length
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  init() {
    this.reset()

    if (this.lesson) {
      const characterSpace = CharacterSpace.fromLesson(this.lesson)
      this.queue = this.rwg
        .createRandomWords(characterSpace, this.wordCount)
        .join(' ')
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
    const stackElement = this.stackRef!.nativeElement as HTMLElement
    let child: HTMLElement | null = null

    if (this.queue.charAt(0) === ' ') {
      child = this.renderer.createElement('pre') as HTMLPreElement
      child.innerHTML = '&nbsp;'
    } else {
      child = this.renderer.createElement('span') as HTMLSpanElement
      child.innerText = this.queue.charAt(0)
    }

    if (key !== this.queue[0]) {
      this.flashTerminal()
      this.metricsService.incrementErrorCount()
      child.classList.add('error')
    }

    this.queue = this.queue.substring(1)
    if (this.queue.length && this.queue.charAt(0) === ' ') {
      this.metricsService.incrementWordCount()
    } else {
      this.metricsService.incrementCharacterCount()
    }

    stackElement.innerHTML = child.outerHTML + stackElement.innerHTML
    this.changeDetector.detectChanges()
  }

  handleBackspace() {
    const stackElement = this.stackRef!.nativeElement as HTMLElement
    if (stackElement.childElementCount === 0) return
    
    if (this.queue.charAt(0) === ' ') {
      this.metricsService.incrementWordCount(-1)
    }

    const child = stackElement.firstElementChild as HTMLElement
    if (child) {
      // stackElement.removeChild(child)
      this.renderer.removeChild(stackElement, child)
    }

    this.queue = child.innerText + this.queue
    this.stack = this.stack.substring(1)
    this.metricsService.incrementCharacterCount(-1)

    this.changeDetector.detectChanges()
  }
}
