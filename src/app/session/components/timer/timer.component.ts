import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { switchMap } from 'rxjs'
import { SessionService } from '../../services'

@Component({
  selector: 'tiptap-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent implements OnInit {
  readonly sessionLengthSeconds = this.sessionService.lengthSeconds
  readonly time$ = this.sessionService.started$.pipe(
    switchMap(() => this.sessionService.time$)
  )

  constructor(private readonly sessionService: SessionService) {}

  ngOnInit(): void {}
}
