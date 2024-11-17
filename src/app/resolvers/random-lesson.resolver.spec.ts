import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";

import { randomLessonResolver } from "./random-lesson.resolver";

describe("randomLessonResolver", () => {
  const executeResolver: ResolveFn<string[]> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() =>
      randomLessonResolver(...resolverParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeResolver).toBeTruthy();
  });
});
