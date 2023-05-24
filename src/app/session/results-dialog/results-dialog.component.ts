import { AsyncPipe, NgIf, PercentPipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { RouterLink } from '@angular/router'
import { Metrica } from '../models/metrica'
import { MetricsService } from '../services/metrics.service'
import { SessionService } from '../services/session.service'

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tiptap-results-dialog',
  templateUrl: './results-dialog.component.html',
  styleUrls: ['./results-dialog.component.scss'],
  imports: [
    MatDialogModule,
    NgIf,
    MatButtonModule,
    RouterLink,
    PercentPipe,
    AsyncPipe,
  ],
})
export class ResultsDialogComponent implements OnInit {
  readonly metrics$ = this.metricsService.metrics$

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Metrica,
    private readonly sessionService: SessionService,
    private readonly dialogRef: MatDialogRef<ResultsDialogComponent>,
    private readonly metricsService: MetricsService
  ) {}

  ngOnInit(): void {}

  resetSession() {
    this.sessionService.reset()
    this.dialogRef.close()
  }
}
