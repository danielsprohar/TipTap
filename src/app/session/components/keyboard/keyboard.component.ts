import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core'
import { Subject } from 'rxjs'
import { Keys } from '../../../keyboard/keys'
import { KeyboardService } from '../../services/keyboard.service'

@Component({
  standalone: true,
  selector: 'tiptap-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly destroy$ = new Subject<void>()
  private readonly keyboardHintElements: HTMLElement[] = []
  private readonly keyboardHintCSS = 'keyboard-hint'

  @ViewChild('keyboard', { static: true }) keyboardElementRef!: ElementRef

  constructor(
    private readonly keyboard: KeyboardService,
    private readonly renderer: Renderer2,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.keyboard.highlightKey$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((key: string) => {
    //     this.clearHighlightedKeyElements()
    //     if (key) {
    //       this.handleAddKeyboardHint(key)
    //     }
    //   })
  }

  ngAfterViewInit(): void {
    // this.resize()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  // @HostListener('window:resize')
  // resize() {
  //   const keyboard$: HTMLElement | null = document.getElementById('keyboard')
  //   if (keyboard$ && keyboard$.parentNode) {
  //     const parent$ = document.getElementById('content') as HTMLElement
  //     if (parent$) {
  //       const size = Number(parent$.clientWidth / 90).toPrecision(2)
  //       // this.renderer.setStyle(
  //       //   keyboard$,
  //       //   'fontSize',
  //       //   `${size}px`,
  //       //   RendererStyleFlags2.Important
  //       // )
  //     }
  //   }
  // }

  isUpperCaseCharacter(value: string): boolean {
    const charCode = value.charCodeAt(0)
    return 65 <= charCode && charCode <= 90
  }

  isLowerCaseCharacter(value: string): boolean {
    const charCode = value.charCodeAt(0)
    return 97 <= charCode && charCode <= 122
  }

  isAlpha(key: string): boolean {
    return this.isLowerCaseCharacter(key) || this.isUpperCaseCharacter(key)
  }

  isDigit(key: string): boolean {
    return Keys.digits.includes(key)
  }

  isRightHandShiftKey(key: string): boolean {
    return Keys.rightHandShiftKeys.includes(key)
  }

  isLeftHandShiftKey(key: string): boolean {
    return Keys.leftHandShiftKeys.includes(key)
  }

  /**
   * Remove css styling from the currently highlighted elements (keys).
   */
  clearHighlightedKeyElements(): void {
    this.keyboardHintElements.forEach((el) =>
      el.classList.remove(this.keyboardHintCSS)
    )

    while (this.keyboardHintElements.pop()) {}
  }

  /**
   * Add css styling to the given element;
   * highlight the given key on the virtual keyboard.
   * @param el The key element
   */
  addHighlightStyle(el: HTMLElement): void {
    if (el) {
      el.classList.add(this.keyboardHintCSS)
      this.keyboardHintElements.push(el)
    }
  }

  /**
   * Highlight the given key on the virtual keyboard.
   *
   * @param key The key from the keyboard.
   */
  handleAddKeyboardHint(key: string): void {
    this.clearHighlightedKeyElements()

    if (key === ' ') {
      this.addHighlightStyle(document.getElementById('Space')!)
    } else if (this.isDigit(key)) {
      this.addHighlightStyle(document.getElementById(key)!)
    } else if (this.isAlpha(key)) {
      this.addHighlightStyle(document.getElementById(key.toLowerCase())!)

      if (this.isRightHandShiftKey(key)) {
        this.addHighlightStyle(document.getElementById('ShiftRight')!)
      } else if (this.isLeftHandShiftKey(key)) {
        this.addHighlightStyle(document.getElementById('ShiftLeft')!)
      }
    } else {
      // must be a "special" character
      const keyboardEl: HTMLElement = this.keyboardElementRef.nativeElement
      const keyEl =
        document.getElementById(key) ||
        keyboardEl.querySelector(`[data-char='${key}']`)

      if (keyEl) {
        this.addHighlightStyle(keyEl as HTMLElement)
        if (this.isRightHandShiftKey(key)) {
          this.addHighlightStyle(document.getElementById('ShiftRight')!)
        } else if (this.isLeftHandShiftKey(key)) {
          this.addHighlightStyle(document.getElementById('ShiftLeft')!)
        }
      }
    }
  }
}
