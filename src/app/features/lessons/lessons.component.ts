import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Hand } from "../../enums/hand.enum";
import { Level } from "../../enums/level.enum";
import { Lesson } from "../../models/lesson";
import { LessonDetailComponent } from "./components/lesson-detail/lesson-detail.component";
import { lessonsGroupedByLevelThenHand } from "./data/grouped-lessons";

@Component({
  selector: "app-lessons",
  templateUrl: "./lessons.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LessonDetailComponent],
})
export class LessonsComponent {
  readonly BOTH_HANDS = Hand.BOTH;

  readonly beginnerLessonsGroupedByHand: Map<Hand, Lesson[]> =
    lessonsGroupedByLevelThenHand.get(Level.BEGINNER)!;

  readonly intermediateLessonsGroupedByHand: Map<Hand, Lesson[]> =
    lessonsGroupedByLevelThenHand.get(Level.INTERMEDIATE)!;
}
