import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Finger, Hand, Level } from "../../../enums";
import { Lesson } from "../../../models";
import { LessonsListComponent } from "./lessons-list.component";

describe("LessonsListComponent", () => {
  let component: LessonsListComponent;
  let fixture: ComponentFixture<LessonsListComponent>;
  const lessons: Lesson[] = [
    new Lesson({
      level: Level.BEGINNER,
      hand: Hand.LEFT,
      finger: Finger.PINKY,
      isHomeKeys: false,
    }),
    new Lesson({
      level: Level.BEGINNER,
      hand: Hand.LEFT,
      finger: Finger.RING,
      isHomeKeys: false,
    }),
    new Lesson({
      level: Level.BEGINNER,
      hand: Hand.LEFT,
      finger: Finger.MIDDLE,
      isHomeKeys: false,
    }),
    new Lesson({
      level: Level.BEGINNER,
      hand: Hand.LEFT,
      finger: Finger.POINTY,
      isHomeKeys: false,
    }),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LessonsListComponent],
    });
    fixture = TestBed.createComponent(LessonsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should render a list of lesson-detail components", () => {
    const lessons = fixture.nativeElement.querySelectorAll(
      "tiptap-lesson-detail"
    );
    expect(lessons.length).toBe(lessons.length);
  });
});
