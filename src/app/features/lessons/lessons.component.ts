import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatTabsModule } from "@angular/material/tabs";
import { Hand } from "../../enums/hand.enum";
import { Level } from "../../enums/level.enum";
import { Lesson } from "../../models/lesson";
import { LessonDetailComponent } from "./components/lesson-detail/lesson-detail.component";
import { lessonsGroupedByLevelThenHand } from "./data/grouped-lessons";
import { HandPipe } from "./pipes/hand.pipe";

@Component({
  selector: "app-lessons",
  templateUrl: "./lessons.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HandPipe,
    CommonModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    LessonDetailComponent,
  ],
})
export class LessonsComponent {
  readonly BOTH_HANDS = Hand.BOTH;

  readonly beginnerLessonsGroupedByHand: Map<Hand, Lesson[]> =
    lessonsGroupedByLevelThenHand.get(Level.BEGINNER)!;

  readonly intermediateLessonsGroupedByHand: Map<Hand, Lesson[]> =
    lessonsGroupedByLevelThenHand.get(Level.INTERMEDIATE)!;
}
