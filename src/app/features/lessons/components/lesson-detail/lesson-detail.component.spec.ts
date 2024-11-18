import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivatedRoute } from "@angular/router";
import { Finger, Hand, Level } from "../../../enums";
import { Keys } from "../../../keyboard/keys";
import { Lesson } from "../../../models";
import { LessonDetailComponent } from "./lesson-detail.component";

describe("LessonDetailComponent", () => {
  let component: LessonDetailComponent;
  let fixture: ComponentFixture<LessonDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  it("should render the keys for a lesson: Beginner, Left Hand, All Fingers", () => {
    fixture = TestBed.createComponent(LessonDetailComponent);
    component = fixture.componentInstance;

    component.lesson = Lesson.builder()
      .setLevel(Level.BEGINNER)
      .setHand(Hand.LEFT)
      .setFinger(Finger.ALL)
      .build();

    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const kbds = host.querySelectorAll("kbd");
    expect(kbds.length).toBe(Keys.beginner.left.all.length);

    const keys = Array.from(kbds).map((kbd) => kbd.textContent?.trim());
    expect(keys.sort()).toEqual([...Keys.beginner.left.all].sort());
  });
});
