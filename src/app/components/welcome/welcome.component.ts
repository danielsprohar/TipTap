import { NgFor } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatDividerModule } from '@angular/material/divider'
import { RouterLink } from '@angular/router'

const FINGER_NAME_TO_COLOR_MAP = [
  { finger: 'Little (Pinky)', color: 'Yellow-Green', hexColorCode: '#befc75' },
  { finger: 'Ring', color: 'Lavendar Blue', hexColorCode: '#c0dbfc' },
  { finger: 'Middle', color: 'Aqua Blue (Water)', hexColorCode: '#ccffff' },
  {
    finger: 'Index (Pointy)',
    color: 'Yellow (Laser Lemon)',
    hexColorCode: '#ffff66',
  },
  { finger: 'Thumb', color: 'Brilliant Lavender', hexColorCode: '#e9befc' },
]

@Component({
  selector: 'tiptap-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDividerModule, RouterLink, NgFor],
})
export class WelcomeComponent {
  readonly tableColumns = ['finger', 'color', 'hex']
  readonly dataSource = FINGER_NAME_TO_COLOR_MAP
}
