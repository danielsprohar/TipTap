import { Component, OnInit } from '@angular/core'
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

const FINGER_NAME_TO_COLOR_MAP = [
  { finger: 'Little (Pinky)', color: 'Yellow-Green', hexColorCode: '#befc75' },
  { finger: 'Ring', color: 'Lavendar Blue', hexColorCode: '#c0dbfc' },
  { finger: 'Middle', color: 'Aqua Blue (Water)', hexColorCode: '#ccffff' },
  { finger: 'Index (Pointy)', color: 'Yellow (Laser Lemon)', hexColorCode: '#ffff66' },
  { finger: 'Thumb', color: 'Brilliant Lavender', hexColorCode: '#e9befc' },
]

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss'],
    standalone: true,
    imports: [
        MatDividerModule,
        RouterLink,
        NgFor,
    ],
})
export class WelcomeComponent implements OnInit {
  tableColumns = ['finger', 'color', 'hex']
  dataSource = FINGER_NAME_TO_COLOR_MAP

  constructor() {}

  ngOnInit(): void {}
}
