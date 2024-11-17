import {
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { Finger, Hand, Level } from "../../enums";
import { Lesson } from "../../models/lesson";
import { MetricsService } from "./metrics.service";
import { SessionService } from "./session.service";

describe("SessionService", () => {
  let session: SessionService;
  let metrics: MetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService, MetricsService],
    });
    session = TestBed.inject(SessionService);
    metrics = TestBed.inject(MetricsService);
  });

  it("should be created", () => {
    expect(session).toBeTruthy();
  });

  it("should set the lesson", () => {
    const lesson: Lesson = Lesson.builder()
      .setLevel(Level.INTERMEDIATE)
      .setHand(Hand.LEFT)
      .setFinger(Finger.MIDDLE)
      .build();

    session.setLesson(lesson);

    expect(session.getLesson()).toEqual(lesson);
  });

  it("should start the session", (done: DoneFn) => {
    const subscription = session.started$.subscribe(() => {
      expect(session.getStartedAt()).toBeTruthy();
      done();
    });

    session.start();
    subscription.unsubscribe();
  });

  it("should reset the session", (done: DoneFn) => {
    const subscription = session.reset$.subscribe(() => {
      expect(session.getStartedAt()).toBeNull();
      expect(session.getCompletedAt()).toBeNull();
      done();
    });

    session.reset();
    subscription.unsubscribe();
  });

  it("should complete the session", (done: DoneFn) => {
    const subscription = session.completed$.subscribe(() => {
      expect(session.getCompletedAt()).toBeTruthy();
      done();
    });

    session.stop();
    subscription.unsubscribe();
  });

  it("should create an interval", fakeAsync(() => {
    const subscription = session.time$.subscribe((time) => {
      expect(time).toBeGreaterThanOrEqual(0);
    });

    session.start();
    tick(1000);
    subscription.unsubscribe();
    discardPeriodicTasks();
  }));
});
