import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogModule } from '@angular/material/legacy-dialog'
import { Metrica } from '../models/metrica'
import { SessionService } from '../services/session.service'
import { RouterLink } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgIf, PercentPipe } from '@angular/common';

@Component({
    selector: 'app-results-dialog',
    templateUrl: './results-dialog.component.html',
    styleUrls: ['./results-dialog.component.scss'],
    standalone: true,
    imports: [
        MatLegacyDialogModule,
        NgIf,
        MatLegacyButtonModule,
        RouterLink,
        PercentPipe,
    ],
})
export class ResultsDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Metrica,
    private readonly session: SessionService,
    private dialogRef: MatDialogRef<ResultsDialogComponent>
  ) {}

  ngOnInit(): void {}

  resetSession() {
    this.session.reset()
    this.dialogRef.close()
  }
}
