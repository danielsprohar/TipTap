import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { switchMap } from "rxjs";
import { SessionService } from "../../services/session.service";

@Component({
    selector: "tiptap-timer",
    imports: [CommonModule],
    templateUrl: "./timer.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent {
  private readonly sessionService = inject(SessionService);

  readonly sessionLengthSeconds = this.sessionService.getDurationSeconds();
  readonly time$ = this.sessionService.started$.pipe(
    switchMap(() => this.sessionService.time$)
  );
}
