import { NgFor, NgIf, TitleCasePipe } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { RouterLink } from '@angular/router'
import { Finger, Hand } from '../../../enums'
import { Lesson } from '../../../models/lesson'
import { CharacterSpaceBuilder } from '../../builders/character-space-builder'

@Component({
  standalone: true,
  selector: 'tiptap-lesson-detail',
  templateUrl: './lesson-detail.component.html',
  styleUrls: ['./lesson-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatCardModule, RouterLink, NgFor, TitleCasePipe],
})
export class LessonDetailComponent implements OnInit {
  @Input({ required: true }) lesson!: Lesson
  keys!: string[]
  link?: string

  constructor() {}

  ngOnInit(): void {
    this.keys = new CharacterSpaceBuilder(this.lesson).build()
    this.link =
      this.lesson.hand + (this.lesson.hand === Hand.BOTH ? ' Hands' : ' Hand')

    if (this.lesson.finger && this.lesson.finger !== Finger.ALL) {
      this.link += ` - ${this.lesson.finger} Finger`
    }
  }

  trackByKey(_index: number, key: string) {
    return key
  }
}
