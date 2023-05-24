import { AsyncPipe, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { Observable, tap } from 'rxjs'
import { SnackbarService } from 'src/app/services/snackbar.service'

@Component({
  selector: 'app-snackbar',
  template: `
    <ng-container *ngIf="message$ | async as message">
      <div id="snackbar">
        {{ message }}
      </div>
    </ng-container>
  `,
  styleUrls: ['./snackbar.component.scss'],
  standalone: true,
  imports: [NgIf, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent implements OnInit {
  message$?: Observable<string>

  constructor(private snackbar: SnackbarService) {}

  ngOnInit(): void {
    this.message$ = this.snackbar.message$.pipe(
      tap((message: string) => {
        if (message) {
          setTimeout(() => {
            this.snackbar.close()
          }, 3000)
        }
      })
    )
  }
}
