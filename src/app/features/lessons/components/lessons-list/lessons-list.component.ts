import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { Lesson } from "../../../../models/lesson";
import { LessonDetailComponent } from "../lesson-detail/lesson-detail.component";

@Component({
    selector: "tiptap-lessons-list",
    imports: [CommonModule, LessonDetailComponent],
    templateUrl: "./lessons-list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonsListComponent {
  readonly lessons = input.required<Lesson[]>();
}
