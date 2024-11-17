import { TestBed } from "@angular/core/testing";
import { ResolveFn, Router } from "@angular/router";

import { Component, inject } from "@angular/core";
import {
  RouterTestingHarness,
  RouterTestingModule,
} from "@angular/router/testing";
import { RandomWordGeneratorService } from "../session/services";
import { sessionLessonResolver } from "./session-lesson.resolver";

@Component({ template: "" })
class LessonsComponent {}

@Component({ template: "" })
class SessionComponent {}

describe("sessionLessonResolver", () => {
  let harness: RouterTestingHarness;

  const executeResolver: ResolveFn<string[]> = (...params) =>
    TestBed.runInInjectionContext(() => sessionLessonResolver(...params));

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [RandomWordGeneratorService],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: "lessons",
            component: LessonsComponent,
          },
          {
            path: "session",
            component: SessionComponent,
            resolve: { lesson: sessionLessonResolver },
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it("should be created", () => {
    jasmine.createSpyObj("ActivatedRouteSnapshot", ["toString"]);
    expect(executeResolver).toBeTruthy();
  });

  it("should navigate back to the Lessons component when there is no query params", async () => {
    await harness.navigateByUrl("/session");

    TestBed.runInInjectionContext(() => {
      const router = inject(Router);
      expect(router.url).toEqual("/lessons");
    });
  });

  it("should navigate Sessions component when there is no query params", async () => {
    const path =
      "/session?level=BEGINNER&hand=LEFT&finger=MIDDLE&isHomeKeys=true";
    await harness.navigateByUrl(path);

    TestBed.runInInjectionContext(() => {
      const router = inject(Router);
      expect(router.url).toContain("/session");
    });
  });
});
