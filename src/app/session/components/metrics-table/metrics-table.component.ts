import { CommonModule, DecimalPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { SessionResults } from "../../models/session-results";

@Component({
  selector: "tiptap-metrics-table",
  standalone: true,
  imports: [CommonModule, DecimalPipe, MatTableModule],
  templateUrl: "./metrics-table.component.html",
  styleUrls: ["./metrics-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetricsTableComponent implements OnInit {
  @Input({ required: true }) sessionResults!: SessionResults;
  readonly dataSource: SessionResults[] = [];
  readonly displayedColumns: string[] = [
    "accuracy",
    "rawWPM",
    "netWPM",
    "totalWords",
    "totalWordsWithErrors",
    "totalCharacters",
  ];

  ngOnInit(): void {
    this.dataSource.push(this.sessionResults);
  }
}
