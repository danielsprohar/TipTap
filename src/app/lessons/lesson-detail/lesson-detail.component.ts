import { Component, Input, OnInit } from '@angular/core'
import { CharacterSpaceBuilder } from '../builders/character-space-builder'
import { Lesson } from '../models/lesson'
import { RouterLink } from '@angular/router';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, NgFor, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'app-lesson-detail',
    templateUrl: './lesson-detail.component.html',
    styleUrls: ['./lesson-detail.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatLegacyCardModule,
        RouterLink,
        NgFor,
        TitleCasePipe,
    ],
})
export class LessonDetailComponent implements OnInit {
  @Input() lesson?: Lesson
  keys?: string[]
  link?: string

  constructor() {}

  ngOnInit(): void {
    if (this.lesson) {
      this.keys = new CharacterSpaceBuilder(this.lesson).build()
      this.link =
        this.lesson.hand + (this.lesson.hand === 'both' ? ' Hands' : ' Hand')

      if (this.lesson.finger && this.lesson.finger !== 'all') {
        this.link += ` - ${this.lesson.finger} Finger`
      }
    }
  }
}
