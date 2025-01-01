import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { RouterLink } from "@angular/router";
import { Finger } from "../../../../enums/finger.enum";
import { Hand } from "../../../../enums/hand.enum";
import { Lesson } from "../../../../models/lesson";
import { CharacterSpace } from "../../character-space";

@Component({
    selector: "tiptap-lesson-detail",
    templateUrl: "./lesson-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MatCardModule, RouterLink]
})
export class LessonDetailComponent implements OnInit {
  readonly lesson = input.required<Lesson>();
  readonly characterSpace = signal<CharacterSpace | null>(null);
  readonly link = signal<string>("");

  ngOnInit(): void {
    const lesson = this.lesson();

    this.characterSpace.set(CharacterSpace.fromLesson(lesson));

    let link = lesson.hand + (lesson.hand === Hand.BOTH ? " Hands" : " Hand");
    if (lesson.finger && lesson.finger !== Finger.ALL) {
      link += ` - ${lesson.finger} Finger`;
    }

    this.link.set(link);
  }
}
