import {
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from "@angular/core";

import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { appRoutes } from "./app/app-routes";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(BrowserModule),
    provideExperimentalZonelessChangeDetection(),
    provideAnimations(),
  ],
}).catch((err) => console.error(err));
