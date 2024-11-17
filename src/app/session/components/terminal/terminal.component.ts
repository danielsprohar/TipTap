import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
  viewChild,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Subject, takeUntil } from "rxjs";
import { ThemeService } from "../../../services/theme.service";
import { KeyboardService } from "../../services/keyboard.service";
import { MetricsService } from "../../services/metrics.service";
import { SessionService } from "../../services/session.service";

@Component({
  standalone: true,
  selector: "tiptap-terminal",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./terminal.component.html",
  styleUrls: ["./terminal.component.scss"],
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
})
export class TerminalComponent implements AfterViewInit, OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly themeService = inject(ThemeService);
  private readonly metricsService = inject(MetricsService);
  private readonly sessionService = inject(SessionService);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly keyboardService = inject(KeyboardService);
  private readonly renderer = inject(Renderer2);

  readonly isSessionInProgress = signal<boolean>(false);
  readonly isInitialized = signal(false);
  readonly isDarkTheme = signal<boolean>(false);
  readonly words = input.required<string[]>();
  readonly terminal = viewChild<ElementRef>("terminal");

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    if (this.terminal()) {
      this.render();
    }
  }

  ngOnInit(): void {
    this.themeService.isDarkTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.isDarkTheme.set(value));

    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress.set(true);
        if (!this.isInitialized()) {
          this.clearTerminal();
          this.render();
          this.isInitialized.set(true);
        }
      });

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress.set(false);
        this.isInitialized.set(true);
        this.calcMetrics();
      });
  }

  calcMetrics() {
    const wordsWithErrors: Set<Element> = this.getElementsWithErrors();
    const wordsAttempted: NodeListOf<Element> = this.getWordsAttempted();

    this.metricsService.setWordsAttemptedCount(wordsAttempted.length);
    this.metricsService.setWordsErrorCount(wordsWithErrors.size);
  }

  getAllElementsErrors(): NodeListOf<Element> {
    const terminal: Element = this.terminal()?.nativeElement;
    return terminal.querySelectorAll(".error");
  }

  getWordsAttempted(): NodeListOf<Element> {
    const terminal: Element = this.terminal()?.nativeElement;
    return terminal.querySelectorAll('[data-word="attempted"]');
  }

  getElementsWithErrors(): Set<Element> {
    const elements = this.getAllElementsErrors();
    const errors = new Set<Element>();
    elements.forEach((err) => errors.add(err.parentElement!));
    return errors;
  }

  render(): void {
    const words: string[] = this.words();
    const terminal: Element = this.terminal()?.nativeElement;

    for (const word of words) {
      const wordElement: HTMLElement = this.renderer.createElement("span");
      wordElement.classList.add("word");

      for (const letter of word) {
        const letterElement: HTMLElement = this.renderer.createElement("span");
        letterElement.classList.add("letter");
        letterElement.innerText = letter;
        wordElement.appendChild(letterElement);
      }

      terminal.appendChild(wordElement);

      // Add whitespace
      const whitespaceContainerElement: HTMLElement =
        this.renderer.createElement("span");

      whitespaceContainerElement.classList.add("whitespace");
      const whitespaceElement: HTMLElement = this.renderer.createElement("pre");
      whitespaceElement.innerHTML = " ";
      whitespaceContainerElement.appendChild(whitespaceElement);
      terminal.appendChild(whitespaceContainerElement);
    }

    const firstWord: Element = terminal.firstElementChild!;
    const firstLetter: Element = firstWord.firstElementChild!;
    firstLetter.classList.add("cursor");
    firstLetter.scrollIntoView();
    this.changeDetector.detectChanges();
  }

  clearTerminal() {
    const terminal: HTMLElement = this.terminal()?.nativeElement!;
    terminal.innerHTML = "";
  }

  @HostListener("document:keydown", ["$event"])
  handleKeydown(event: KeyboardEvent): boolean {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isSessionInProgress && event.shiftKey && event.key === "Enter") {
      this.sessionService.start();
      return false;
    }

    if (!this.isSessionInProgress) return false;
    if (event.repeat) return false;
    if (event.key === "Enter") return false;
    if (event.key === "Shift") return false;
    if (event.key === "Control") return false;
    if (event.key === "Alt") return false;
    if (event.metaKey) return false;
    if (event.key.length > 1 && event.key.charAt(0) === "F") return false;
    if (event.key === "Backspace") {
      this.handleBackspace();
    } else {
      this.keyboardService.keyUp(event.key);
      this.handleKey(event.key);
    }

    return false;
  }

  handleKey(key: string): void {
    const terminal: Element = this.terminal()?.nativeElement!;
    const currentLetter: Element = terminal.querySelector(".cursor")!;
    // This helps us calculate the WPM after the session is complete
    this.renderer.setAttribute(currentLetter, "data-key", "attempted");

    if (key === currentLetter.textContent) {
      this.renderer.addClass(currentLetter, "correct");
    } else {
      this.metricsService.incrementErrorCount();
      this.renderer.addClass(currentLetter, "error");
    }

    let nextLetter: Element | null = currentLetter.nextElementSibling;
    if (nextLetter === null) {
      const currentWord: Element = currentLetter.parentElement!;
      const nextWord: Element | null = currentWord.nextElementSibling;
      if (nextWord === null) {
        this.sessionService.stop();
        return;
      }

      nextLetter = nextWord.firstElementChild;
      this.metricsService.incrementWordCount();
      // This helps us calculate the WPM after the session is complete
      this.renderer.setAttribute(nextWord, "data-word", "attempted");
    }

    // Move the cursor to the next letter
    this.renderer.removeClass(currentLetter, "cursor");
    this.renderer.addClass(nextLetter, "cursor");
    this.metricsService.incrementCharacterCount();
    nextLetter?.scrollIntoView();
  }

  handleBackspace(): void {
    const terminal: Element = this.terminal()?.nativeElement!;
    const currentLetter: Element = terminal.querySelector(".cursor")!;
    let previousLetter: Element | null = currentLetter.previousElementSibling;

    if (previousLetter === null) {
      const currentWord: Element = currentLetter.parentElement!;
      const previousWord = currentWord.previousElementSibling;
      if (previousWord === null) {
        return;
      }

      previousLetter = previousWord.lastElementChild!;
    }

    // Check if the current letter has an error
    if (currentLetter.querySelector(".error")) {
      this.metricsService.decrementErrorCount();
    }

    // Move the cursor to the previous letter
    this.renderer.removeClass(currentLetter, "cursor");
    this.renderer.addClass(previousLetter, "cursor");
    this.renderer.removeClass(previousLetter, "correct");
    this.renderer.removeClass(previousLetter, "error");

    this.metricsService.decrementCharacterCount();
    previousLetter.scrollIntoView();
  }
}
