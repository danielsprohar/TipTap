import { AsyncPipe, NgIf } from '@angular/common'
import {
  AfterViewInit,
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
import { Lesson } from '../../../models'
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
export class TerminalComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly terminalFlashDuration$ = timer(100)
  private isInitialRender = true
  private readonly wordCount = 250

  readonly isDarkTheme$ = this.themeService.isDarkTheme$
  @Input({ required: true }) lesson!: Lesson
  @ViewChild('terminal') terminalRef!: ElementRef

  constructor(
    private readonly themeService: ThemeService,
    private readonly keyboardService: KeyboardService,
    private readonly metricsService: MetricsService,
    private readonly sessionService: SessionService,
    private readonly rwg: RandomWordGeneratorService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  ngAfterViewInit(): void {
    this.render()
  }

  ngOnInit(): void {
    this.keyboardService.keyPressed$
      .pipe(takeUntil(this.destroy$))
      .subscribe((key: string) => {
        if (key === 'Backspace') {
          this.handleBackspace()
        } else {
          this.handleKey(key)
        }
      })

    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.isInitialRender) {
          this.clearTerminal()
          this.render()
          this.isInitialRender = false
        }
      })

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isInitialRender = false
      })
  }

  render() {
    const characterSpace = CharacterSpace.fromLesson(this.lesson)
    const words: string[] = this.rwg.createRandomWords(
      characterSpace,
      this.wordCount
    )

    const terminal: Element = this.terminalRef.nativeElement
    for (const word of words) {
      const wordElement: HTMLElement = this.renderer.createElement('span')
      wordElement.classList.add('word')

      for (const letter of word) {
        const letterElement: HTMLElement = this.renderer.createElement('span')
        letterElement.classList.add('letter')
        letterElement.innerText = letter
        wordElement.appendChild(letterElement)
      }

      terminal.appendChild(wordElement)

      // Add whitespace
      const whitespaceContainerElement: HTMLElement =
        this.renderer.createElement('span')

      whitespaceContainerElement.classList.add('whitespace')
      const whitespaceElement: HTMLElement = this.renderer.createElement('pre')

      // Render a dot on the screen for whitespace
      // whitespaceElement.innerHTML = '&nbsp;'
      whitespaceElement.innerHTML = ' '
      whitespaceContainerElement.appendChild(whitespaceElement)
      terminal.appendChild(whitespaceContainerElement)
    }

    const firstWord: Element = terminal.firstElementChild!
    const firstLetter: Element = firstWord.firstElementChild!
    firstLetter.classList.add('cursor')
    firstLetter.scrollIntoView()
    this.changeDetector.detectChanges()
  }

  clearTerminal() {
    const terminal: HTMLElement = this.terminalRef.nativeElement!
    terminal.innerHTML = ''
  }

  flashTerminal() {
    const terminalElement = this.terminalRef.nativeElement as HTMLElement
    terminalElement.classList.add('flash')
    this.terminalFlashDuration$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      terminalElement.classList.remove('flash')
    })
  }

  handleKey(key: string) {
    const terminal: Element = this.terminalRef.nativeElement!
    const currentLetter: Element = terminal.querySelector('.cursor')!

    if (key !== currentLetter.textContent) {
      this.metricsService.incrementErrorCount()
      this.renderer.addClass(currentLetter, 'error')
    } else {
      if (currentLetter.classList.contains('error')) {
        this.renderer.removeClass(currentLetter, 'error')
      }
      this.renderer.addClass(currentLetter, 'correct')
    }

    // Get the next letter
    let nextLetter: Element | null = currentLetter.nextElementSibling
    if (nextLetter === null) {
      // Go to the next word
      const currentWord: Element = currentLetter.parentElement!
      const nextWord: Element | null = currentWord.nextElementSibling
      if (nextWord === null) {
        this.sessionService.stop()
        return
      }

      nextLetter = nextWord.firstElementChild
      this.metricsService.incrementWordCount()
    }

    // Move the cursor to the next letter
    this.renderer.removeClass(currentLetter, 'cursor')
    this.renderer.addClass(nextLetter, 'cursor')

    this.metricsService.incrementCharacterCount()
    if (this.metricsService.totalCharacters % 10 === 0) {
      nextLetter?.scrollIntoView()
    }

    this.changeDetector.detectChanges()
  }

  handleBackspace() {
    const terminal: Element = this.terminalRef.nativeElement!
    const currentLetter: Element = terminal.querySelector('.cursor')!
    currentLetter.className = ''

    let previousLetter: Element | null = currentLetter.previousElementSibling

    if (previousLetter === null) {
      const currentWord: Element = currentLetter.parentElement!
      const previousWord = currentWord.previousElementSibling
      if (previousWord === null) {
        return
      }

      previousLetter = previousWord.lastElementChild!
    }

    // Check if the current letter has an error
    if (currentLetter.querySelector('.error')) {
      this.metricsService.decrementErrorCount()
    }

    // Move the cursor to the previous letter
    this.renderer.removeClass(currentLetter, 'cursor')
    this.renderer.addClass(previousLetter, 'cursor')
    this.renderer.removeClass(previousLetter, 'correct')
    this.renderer.removeClass(previousLetter, 'error')

    this.metricsService.decrementCharacterCount()
    previousLetter.scrollIntoView()
    this.changeDetector.detectChanges()
  }
}
