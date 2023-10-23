import { importProvidersFrom } from '@angular/core'

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import {
  ScreenTrackingService,
  UserTrackingService,
  getAnalytics,
  provideAnalytics,
} from '@angular/fire/analytics'
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideRouter } from '@angular/router'
import { appRoutes } from './app/app-routes'
import { AppComponent } from './app/app.component'

import { initializeApp, provideFirebaseApp } from '@angular/fire/app'
import { getAuth, provideAuth } from '@angular/fire/auth'
import { getFirestore, provideFirestore } from '@angular/fire/firestore'
import { getPerformance, providePerformance } from '@angular/fire/performance'
import { environment } from './environments/environment'

bootstrapApplication(AppComponent, {
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    provideRouter(appRoutes),
    importProvidersFrom(BrowserModule),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    // Firebase
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAnalytics(() => getAnalytics()),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      providePerformance(() => getPerformance())
    ),
  ],
}).catch((err) => console.error(err))
