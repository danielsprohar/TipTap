import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { SessionRoutingModule } from './session-routing.module'
import { SessionComponent } from './session.component'
import { TerminalComponent } from './terminal/terminal.component'
import { KeyboardComponent } from './keyboard/keyboard.component'
import { ResultsDialogComponent } from './results-dialog/results-dialog.component'

import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card'
import { MatDividerModule } from '@angular/material/divider'
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog'
import { SessionService } from './services/session.service'
import { KeyboardService } from './services/keyboard.service'
import { RandomWordGeneratorService } from './services/random-word-generator.service'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'

@NgModule({
    imports: [
    CommonModule,
    SessionRoutingModule,
    MatTooltipModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatButtonModule,
    SessionComponent,
    TerminalComponent,
    KeyboardComponent,
    ResultsDialogComponent,
],
    providers: [
        SessionService,
        KeyboardService,
        RandomWordGeneratorService,
        {
            provide: MatDialogRef,
            useValue: {},
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {},
        },
    ],
})
export class SessionModule {}
