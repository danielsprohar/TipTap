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
import { Subject, takeUntil } from 'rxjs'
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
  private readonly wordCount = 200
  private isInitialRender = true

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
        this.calcMetrics()
      })
  }

  calcMetrics() {
    const wordsWithErrors: Set<Element> = this.getWordsWithErrors()
    const wordsAttempted: NodeListOf<Element> = this.getWordsAttempted()
    const errors: NodeListOf<Element> = this.getAllErrors()

    this.metricsService.setWordsAttemptedCount(wordsAttempted.length)
    this.metricsService.setWordsErrorCount(wordsWithErrors.size)
    this.metricsService.setErrorCount(errors.length)
  }

  getAllErrors(): NodeListOf<Element> {
    const terminal: Element = this.terminalRef.nativeElement
    return terminal.querySelectorAll('.error')
  }

  getWordsAttempted(): NodeListOf<Element> {
    const terminal: Element = this.terminalRef.nativeElement
    return terminal.querySelectorAll('[data-word="attempted"]')
  }

  getWordsWithErrors() {
    const errors = this.getAllErrors()
    const badWords = new Set<Element>()
    errors.forEach((err) => badWords.add(err.parentElement!))
    return badWords
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

  handleKey(key: string) {
    const terminal: Element = this.terminalRef.nativeElement!
    const currentLetter: Element = terminal.querySelector('.cursor')!
    // This helps us calculate the WPM after the session is complete
    this.renderer.setAttribute(currentLetter, 'data-key', 'attempted')

    if (key !== currentLetter.textContent) {
      this.metricsService.incrementErrorCount()
      this.renderer.addClass(currentLetter, 'error')
    } else {
      if (currentLetter.classList.contains('error')) {
        this.renderer.removeClass(currentLetter, 'error')
      }
      this.renderer.addClass(currentLetter, 'correct')
    }

    let nextLetter: Element | null = currentLetter.nextElementSibling
    if (nextLetter === null) {
      const currentWord: Element = currentLetter.parentElement!
      const nextWord: Element | null = currentWord.nextElementSibling
      if (nextWord === null) {
        this.sessionService.stop()
        return
      }

      nextLetter = nextWord.firstElementChild
      this.metricsService.incrementWordCount()
      // This helps us calculate the WPM after the session is complete
      this.renderer.setAttribute(nextWord, 'data-word', 'attempted')
    }

    // Move the cursor to the next letter
    this.renderer.removeClass(currentLetter, 'cursor')
    this.renderer.addClass(nextLetter, 'cursor')
    this.metricsService.incrementCharacterCount()
    if (this.metricsService.getTotalCharacters() % 5 === 0) {
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
