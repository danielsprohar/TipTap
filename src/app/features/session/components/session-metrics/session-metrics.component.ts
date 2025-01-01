import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { of, switchMap } from "rxjs";
import { SessionResults } from "../../models/session-results";
import { MetricsService } from "../../services/metrics.service";
import { SessionService } from "../../services/session.service";
import { MetricsLineChartComponent } from "../metrics-line-chart/metrics-line-chart.component";
import { MetricsTableComponent } from "../metrics-table/metrics-table.component";

@Component({
    selector: "tiptap-session-metrics",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        MatCardModule,
        MetricsLineChartComponent,
        MetricsTableComponent,
    ],
    templateUrl: "./session-metrics.component.html"
})
export class SessionMetricsComponent {
  private readonly metrics = inject(MetricsService);
  private readonly session = inject(SessionService);

  readonly timeSeries$ = this.metrics.timeSeries$;
  readonly sessionResults$ = this.session.completed$.pipe(
    switchMap(() => of(this.calcSessionResults()))
  );

  private calcSessionResults() {
    return SessionResults.builder()
      .totalErrors(this.metrics.getTotalErrors())
      .totalCharacters(this.metrics.getTotalCharacters())
      .totalWords(this.metrics.getTotalWords())
      .totalWordsWithErrors(this.metrics.getTotalWordsWithErrors())
      .accuracy(this.metrics.getAccuracy())
      .startedAt(this.session.getStartedAt()!)
      .completedAt(this.session.getCompletedAt()!)
      .durationSeconds(this.session.getDurationSeconds())
      .build();
  }
}
