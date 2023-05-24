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

  // TODO: add class list inside terminal component?
  @ViewChild('terminal') terminalComponent!: ElementRef

  constructor(
    private readonly keyboardService: KeyboardService,
    private readonly sessionService: SessionService,
    private readonly rwg: RandomWordGeneratorService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.keyboardService.event$
      .pipe(takeUntil(this.destroy$))
      .subscribe(this.parseKey.bind(this))

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
      this.keyboardService.setHighlightKey(this.queue.charAt(0))
    } else if (this.book && this.book.chapter) {
      this.queue = this.book.chapter.text
    }
  }

  reset() {
    this.queue = this.stack + this.queue
    this.stack = ''
  }

  /**
   * Flash the terminal when an incorrect key is pressed
   */
  flashTerminal() {
    // TODO: Create a TerminalService to handle this?
    const terminalElement = this.terminalComponent.nativeElement as HTMLElement
    terminalElement.classList.add('flash')
    // this.changeDetector.detectChanges()

    this.terminalFlashDuration$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      terminalElement.classList.remove('flash')
    })

    // TODO: Replace this with a timer()
    // setTimeout(() => {
    //   el$.classList.remove('flash')
    // }, 100)
  }

  parseKey(event: KeyboardEvent) {
    if (this.queue.length === 0) return

    const { key } = event
    if (key === 'Shift') return
    if (key === 'F12') return

    if (key === 'Backspace') {
      this.handleBackspace()
    } else {
      this.handleKey(key)
    }

    if (this.queue.length) {
      // Highlight the next key in the queue
      this.keyboardService.setHighlightKey(this.queue.charAt(0))
    }
  }

  /**
   * Handle the key after it has been parsed.
   * @param key The key value
   */
  handleKey(key: string) {
    if (key !== this.queue[0]) {
      this.flashTerminal()
      this.sessionService.incrementErrorCount()
    } else {
      this.stack += this.queue[0]
      this.queue = this.queue.substring(1)

      if (this.queue.length && this.queue.charAt(0) === ' ') {
        this.sessionService.incrementWordCount()
      } else {
        this.sessionService.incrementCharacterCount()
      }
    }
  }

  handleBackspace() {
    if (this.stack.length === 0) return

    if (this.queue.charAt(0) === ' ') {
      this.sessionService.incrementWordCount(-1)
    }

    const popped = this.stack.charAt(this.stack.length - 1)
    this.queue = popped + this.queue
    this.stack = this.stack.substring(0, this.stack.length - 1)
    this.sessionService.incrementCharacterCount(-1)
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
