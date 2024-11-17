import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDividerModule } from '@angular/material/divider'
import { ActivatedRoute } from '@angular/router'
import { map, Subject, takeUntil } from 'rxjs'
import { SessionMetricsComponent } from './components/session-metrics/session-metrics.component'
import { TerminalComponent } from './components/terminal/terminal.component'
import { TimerComponent } from './components/timer/timer.component'
import { KeyboardService } from './services/keyboard.service'
import { MetricsService } from './services/metrics.service'
import { SessionService } from './services/session.service'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-session',
  templateUrl: './session.component.html',
  providers: [SessionService, MetricsService, KeyboardService],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    SessionMetricsComponent,
    TerminalComponent,
    TimerComponent,
  ],
})
export class SessionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  private readonly sessionService = inject(SessionService)
  private readonly route = inject(ActivatedRoute)
  private readonly keyboardService = inject(KeyboardService)

  readonly keyPressed$ = this.keyboardService.key$
  readonly words$ = this.route.data.pipe(
    map((data) => (data['words'] as string[]) ?? [])
  )

  readonly inProgress = signal<boolean>(false)
  readonly completed = signal<boolean>(false)

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.sessionService.stop()
  }

  ngOnInit(): void {
    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.inProgress.set(true)
        this.completed.set(false)
      })

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.inProgress.set(false)
        this.completed.set(true)
      })
  }

  startSession() {
    this.sessionService.start()
  }

  stopSession() {
    this.sessionService.stop()
  }
}
