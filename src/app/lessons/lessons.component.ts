import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { Finger, Hand, Level } from '../enums'
import { Lesson } from '../models'
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component'

// TODO: Hard code all the lessons?
export interface LessonData {
  level: Level
  hand: Hand
  finger?: Finger
  isHomeKeys?: boolean
}

@Component({
  selector: 'app-lessons',
  standalone: true,
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  imports: [LessonDetailComponent, MatCardModule, MatListModule, MatTabsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  createLesson(data: LessonData) {
    return new Lesson({
      level: data.level,
      hand: data.hand,
      finger: data.finger,
      isHomeKeys: data.isHomeKeys,
    })
  }
}
