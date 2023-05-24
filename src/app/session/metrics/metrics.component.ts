import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SessionService } from '../services/session.service'
import { MetricsService } from '../services/metrics.service'

@Component({
  selector: 'tiptap-metrics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsComponent {
  readonly metrics$ = this.metricsService.metrics$

  constructor(private readonly metricsService: MetricsService) {}
}
