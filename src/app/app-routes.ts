import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { randomLessonResolver } from "./resolvers/random-lesson.resolver";
import { sessionLessonResolver } from "./resolvers/session-lesson.resolver";

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
