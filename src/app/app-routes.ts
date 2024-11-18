import { Routes } from "@angular/router";
import { randomLessonResolver } from "./features/session/resolvers/random-lesson.resolver";
import { sessionLessonResolver } from "./features/session/resolvers/session-lesson.resolver";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";

export const appRoutes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "lessons",
    loadComponent: () =>
      import("./features/lessons/lessons.component").then(
        (component) => component.LessonsComponent
      ),
  },
  {
    path: "session",
    loadComponent: () =>
      import("./features/session/session.component").then(
        (component) => component.SessionComponent
      ),
    resolve: {
      words: sessionLessonResolver,
    },
  },
  {
    path: "random",
    loadComponent: () =>
      import("./features/session/session.component").then(
        (component) => component.SessionComponent
      ),
    resolve: {
      words: randomLessonResolver,
    },
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
