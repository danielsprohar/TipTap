import { AsyncPipe, NgIf } from '@angular/common'
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { Subject, takeUntil } from 'rxjs'
import { ThemeService } from '../../../services/theme.service'
import { MetricsService, SessionService } from '../../services'

@Component({
  standalone: true,
  selector: 'tiptap-terminal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  imports: [AsyncPipe, NgIf, MatCardModule, MatProgressSpinnerModule],
})
export class TerminalComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private isSessionInProgress = false
  private isInitialRender = true
  readonly isDarkTheme$ = this.themeService.isDarkTheme$

  @Input({ required: true }) words!: string[]
  @ViewChild('terminal') terminalRef!: ElementRef

  constructor(
    private readonly themeService: ThemeService,
    private readonly metricsService: MetricsService,
    private readonly sessionService: SessionService,
    private readonly changeDetector: ChangeDetectorRef,
    private readonly renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  ngAfterViewInit(): void {
    if (this.terminalRef) this.render()
  }

  ngOnInit(): void {
    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = true
        if (!this.isInitialRender) {
          this.clearTerminal()
          this.render()
          this.isInitialRender = false
        }
      })

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = false
        this.isInitialRender = false
        this.calcMetrics()
      })
  }

  calcMetrics() {
    const wordsWithErrors: Set<Element> = this.getWordsWithErrors()
    const wordsAttempted: NodeListOf<Element> = this.getWordsAttempted()

    this.metricsService.setWordsAttemptedCount(wordsAttempted.length)
    this.metricsService.setWordsErrorCount(wordsWithErrors.size)
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
    const words: string[] = this.words
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

  @HostListener('document:keyup', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    event.preventDefault()

    if (!this.isSessionInProgress && event.shiftKey && event.key === 'Enter') {
      this.sessionService.start()
      return false
    }

    if (!this.isSessionInProgress) return false
    if (event.repeat) return false
    if (event.key === 'Enter') return false
    if (event.key === 'Shift') return false
    if (event.key === 'Control') return false
    if (event.key === 'Alt') return false
    if (event.metaKey) return false
    if (event.key.length > 1 && event.key.charAt(0) === 'F') return false
    if (event.key === 'Backspace') {
      this.handleBackspace()
    } else {
      this.handleKey(event.key)
    }

    return false
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
