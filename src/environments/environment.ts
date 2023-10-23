// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'tip-tap-e5cf7',
    appId: '1:829596691349:web:00abd76dc21dd44266649c',
    storageBucket: 'tip-tap-e5cf7.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyCKe8ZERravi9CydPuVPSYI435D0Tgd3s8',
    authDomain: 'tip-tap-e5cf7.firebaseapp.com',
    messagingSenderId: '829596691349',
  },
  production: false,
  httpInterceptor: {
    allowedList: ['http://localhost:3000/*', 'https://api.tiptap.academy'],
  },
  rwg: {
    defaults: {
      wordSize: 5,
      wordCount: 200,
    },
  },
  services: {
    book: {
      url: `http://localhost:3000/books`,
    },
  },
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
