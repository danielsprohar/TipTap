import { KeyValuePipe, NgFor } from '@angular/common'
import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { Hand, Level } from '../enums'
import { Lesson } from '../models/lesson'
import { LessonsListComponent } from './components/lessons-list/lessons-list.component'
import { lessonsGroupedByLevelThenHand } from './data/grouped-lessons'
import { HandPipe } from './pipes/hand.pipe'

@Component({
  selector: 'app-lessons',
  standalone: true,
  templateUrl: './lessons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HandPipe,
    KeyValuePipe,
    LessonsListComponent,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    NgFor,
  ],
})
export class LessonsComponent {
  readonly BOTH_HANDS = Hand.BOTH

  readonly beginnerLessonsGroupedByHand: Map<Hand, Lesson[]> =
    lessonsGroupedByLevelThenHand.get(Level.BEGINNER)!

  readonly intermediateLessonsGroupedByHand: Map<Hand, Lesson[]> =
    lessonsGroupedByLevelThenHand.get(Level.INTERMEDIATE)!
}
