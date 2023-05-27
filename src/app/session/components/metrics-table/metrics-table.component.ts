import { CommonModule, DecimalPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { TimeSeriesSample } from '../../models/time-series-sample'

@Component({
  selector: 'tiptap-metrics-table',
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatTableModule],
  templateUrl: './metrics-table.component.html',
  styleUrls: ['./metrics-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsTableComponent {
  @Input({ required: true }) timeSeries!: TimeSeriesSample[]
  readonly displayedColumns: string[] = [
    "deltaSeconds",
    "cpm",
    "characterCount",
    "wordCount",
    "wpm",
    "errorCount",
    "accuracy"
  ]
}
