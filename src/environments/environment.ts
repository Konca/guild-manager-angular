// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'guild-manager-720d2',
    appId: '1:676165518731:web:e0572e55377206060e9b8e',
    databaseURL:
      'https://guild-manager-720d2-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'guild-manager-720d2.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyA5fYCtuR81JZjJLla_7AnrNbylXaRsMOQ',
    authDomain: 'guild-manager-720d2.firebaseapp.com',
    messagingSenderId: '676165518731',
    measurementId: 'G-4EWE6HH739',
  },
  discord: {
    DISCORD_OAUTH_CLIENT_ID: '915190870083506197',
    DISCORD_OAUTH_SECRET: 'D7pyWNyd12RF1KEAfAuHOSP6qeQrzMf_',
    DISCORD_REDIRECT_URL: 'http://localhost:4200/api/auth/discord/redirect',
  },
  production: false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
