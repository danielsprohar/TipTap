import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { switchMap } from 'rxjs'
import { SessionService } from '../../services'

@Component({
  selector: 'tiptap-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent {
  readonly sessionLengthSeconds = this.sessionService.getDurationSeconds()
  readonly time$ = this.sessionService.started$.pipe(
    switchMap(() => this.sessionService.time$)
  )

  constructor(private readonly sessionService: SessionService) {}
}
