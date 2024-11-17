import { importProvidersFrom } from "@angular/core";

import { MAT_CARD_CONFIG, MatCardConfig } from "@angular/material/card";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { appRoutes } from "./app/app-routes";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(BrowserModule),
    provideAnimations(),
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: "outlined",
      } as MatCardConfig,
    },
  ],
}).catch((err) => console.error(err));
