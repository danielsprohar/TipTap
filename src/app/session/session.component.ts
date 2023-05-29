import { AsyncPipe, NgIf, TitleCasePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { MatDividerModule } from '@angular/material/divider'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { Observable, Subject, map, takeUntil, tap } from 'rxjs'
import { Lesson } from '../models'
import { SessionMetricsComponent } from './components/session-metrics/session-metrics.component'
import { TerminalComponent } from './components/terminal/terminal.component'
import { TimerComponent } from './components/timer/timer.component'
import { MetricsService, SessionService } from './services'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  providers: [SessionService, MetricsService],
  imports: [
    AsyncPipe,
    MatDividerModule,
    NgIf,
    SessionMetricsComponent,
    TerminalComponent,
    TimerComponent,
    TitleCasePipe,
  ],
})
export class SessionComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>()
  lesson$: Observable<Lesson> = this.route.queryParamMap.pipe(
    map((paramMap: ParamMap) => Lesson.builder().buildFromParamMap(paramMap)),
    tap((lesson) => this.sessionService.setLesson(lesson))
  )

  isSessionInProgress = false
  isSessionCompleted = false

  constructor(
    private readonly sessionService: SessionService,
    private readonly route: ActivatedRoute,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    this.sessionService.stop()
  }

  ngOnInit(): void {
    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = true
        this.isSessionCompleted = false
        this.changeDetector.detectChanges()
      })

    this.sessionService.completed$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isSessionInProgress = false
        this.isSessionCompleted = true
        this.changeDetector.detectChanges()
      })

    this.changeDetector.detectChanges()
  }
}
