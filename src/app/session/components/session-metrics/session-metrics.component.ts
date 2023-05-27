import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MetricsService } from '../../services/metrics.service'
import { MetricsTableComponent } from '../metrics-table/metrics-table.component'

@Component({
  selector: 'tiptap-session-metrics',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MetricsTableComponent],
  templateUrl: './session-metrics.component.html',
  styleUrls: ['./session-metrics.component.scss'],
})
export class SessionMetricsComponent {
  readonly timeSeries$ = this.metricsService.timeSeries$

  constructor(private readonly metricsService: MetricsService) {}
}
