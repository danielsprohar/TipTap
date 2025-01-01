import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { SessionResults } from "../../models/session-results";

@Component({
  selector: "tiptap-metrics-table",
  imports: [CommonModule],
  templateUrl: "./metrics-table.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsTableComponent {
  readonly sessionResults = input.required<SessionResults>();
}
