import { Component, OnInit } from '@angular/core'
import { Finger, Hand, Lesson, Level } from './models/lesson'
import { MatLegacyListModule } from '@angular/material/legacy-list';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';

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
    imports: [
        MatLegacyTabsModule,
        LessonDetailComponent,
        MatLegacyCardModule,
        MatLegacyListModule,
    ],
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
