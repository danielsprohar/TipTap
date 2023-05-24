import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { Subscription } from 'rxjs'
import { CharacterSpaceBuilder } from 'src/app/lessons/builders/character-space-builder'
import { Lesson } from 'src/app/lessons/models/lesson'
import { Book } from 'src/app/models/book'
import { KeyboardService } from '../services/keyboard.service'
import { RandomWordGeneratorService } from '../services/random-word-generator.service'
import { SessionService } from '../services/session.service'
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-terminal',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.scss'],
    standalone: true,
    imports: [NgIf, MatLegacyCardModule],
})
export class TerminalComponent implements OnInit, OnDestroy {
  private subsink = new Array<Subscription>()
  private readonly wordCount = 150
  queue = ''
  stack = ''

  @Input() lesson?: Lesson
  @Input() book?: Book
  @ViewChild('terminal') terminalEl!: ElementRef

  constructor(
    private keyboard: KeyboardService,
    private session: SessionService,
    private rwg: RandomWordGeneratorService
  ) // private bs: BookService
  {}

  ngOnInit(): void {
    this.subsink.push(this.keyboard.event$.subscribe(this.parseKey.bind(this)))
    if (this.lesson || this.book) {
      this.init()
    }

    this.subsink.push(
      this.session.reset$.subscribe((value: boolean) => {
        if (value) {
          this.reset()
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subsink.forEach((sub) => sub.unsubscribe())
  }

  /**
   * Initialize the terminal
   * @returns
   */
  init() {
    if (this.lesson) {
      const charSpace = new CharacterSpaceBuilder(this.lesson!).build()
      this.queue = this.rwg.createSessionText(charSpace, this.wordCount)
      this.keyboard.setHighlightKey(this.queue.charAt(0))
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
    const el$ = this.terminalEl.nativeElement as HTMLElement
    el$.classList.add('flash')
    setTimeout(() => {
      el$.classList.remove('flash')
    }, 100)
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
      this.keyboard.setHighlightKey(this.queue.charAt(0))
    }
  }

  /**
   * Handle the key after it has been parsed.
   * @param key The key value
   */
  handleKey(key: string) {
    if (key !== this.queue[0]) {
      this.flashTerminal()
      this.session.incrementErrorCount()
    } else {
      this.stack += this.queue[0]
      this.queue = this.queue.substring(1)

      if (this.queue.length && this.queue.charAt(0) === ' ') {
        this.session.incrementWordCount()
      } else {
        this.session.incrementCharacterCount()
      }
    }
  }

  handleBackspace() {
    if (this.stack.length === 0) return

    if (this.queue.charAt(0) === ' ') {
      this.session.incrementWordCount(-1)
    }

    const popped = this.stack.charAt(this.stack.length - 1)
    this.queue = popped + this.queue
    this.stack = this.stack.substring(0, this.stack.length - 1)
    this.session.incrementCharacterCount(-1)
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
