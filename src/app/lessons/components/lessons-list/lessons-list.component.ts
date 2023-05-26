import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { Lesson } from '../../../models'
import { LessonDetailComponent } from '../lesson-detail/lesson-detail.component'

@Component({
  selector: 'tiptap-lessons-list',
  standalone: true,
  imports: [CommonModule, LessonDetailComponent],
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonsListComponent {
  @Input({ required: true }) lessons!: Lesson[]
}
