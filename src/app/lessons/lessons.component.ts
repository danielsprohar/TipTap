import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component'
import { Finger, Hand, Lesson, Level } from '../models/lesson'

// TODO: Hard code all the lessons?
export interface LessonData {
  level: Level
  hand: Hand
  finger?: Finger
  isHomeKeys?: boolean
}

@Component({
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
  standalone: true,
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
