import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { Observable, Subject, takeUntil, tap } from 'rxjs'
import { MetricsService } from '../services/metrics.service'
import { SessionService } from '../services/session.service'

@Component({
  selector: 'tiptap-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>()
  readonly metrics$ = this.metricsService.metrics$
  time$?: Observable<number>

  constructor(
    private readonly metricsService: MetricsService,
    private readonly sessionService: SessionService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next()
  }

  ngOnInit(): void {
    this.sessionService.reset$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.metricsService.reset())

    this.sessionService.started$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.metricsService.reset()
        this.time$ = this.sessionService.time$.pipe(
          takeUntil(this.sessionService.stopped$),
          tap((time) => this.metricsService.sample(time))
        )
      })
  }
}
