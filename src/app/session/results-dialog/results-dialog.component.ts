import { AsyncPipe, NgIf, PercentPipe } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { RouterLink } from '@angular/router'
import { MetricsService } from '../services/metrics.service'
import { SessionService } from '../services/session.service'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-results-dialog',
  templateUrl: './results-dialog.component.html',
  styleUrls: ['./results-dialog.component.scss'],
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    NgIf,
    PercentPipe,
    RouterLink,
  ],
})
export class ResultsDialogComponent {
  readonly metrics$ = this.metricsService.metrics$

  constructor(
    private readonly sessionService: SessionService,
    private readonly dialogRef: MatDialogRef<ResultsDialogComponent>,
    private readonly metricsService: MetricsService
  ) {}

  resetSession() {
    this.sessionService.reset()
    this.dialogRef.close()
  }
}
