import { NgIf, PercentPipe } from '@angular/common'
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
import { SessionService } from '../services/session.service'

@Component({
  standalone: true,
  selector: 'tiptap-results-dialog',
  templateUrl: './results-dialog.component.html',
  styleUrls: ['./results-dialog.component.scss'],
  imports: [MatDialogModule, NgIf, MatButtonModule, RouterLink, PercentPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Metrica,
    private readonly sessionService: SessionService,
    private readonly dialogRef: MatDialogRef<ResultsDialogComponent>
  ) {}

  ngOnInit(): void {}

  resetSession() {
    this.sessionService.reset()
    this.dialogRef.close()
  }
}
