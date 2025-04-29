// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ispoc:true,
  defaultauth: 'fackbackend',
  googleConfig:{
    apiKey:"259564130297-f7m7uksgbe104go97525aaghsia9omm0.apps.googleusercontent.com"
  },
  stripe: {
    stripePublicKey:"pk_live_794nNEy5tSskxpdnnkUxzfWJ"
  },
  firebaseConfig: {
    apiKey: "AIzaSyAZUppcSdw3FEYTGISN1spTBoCArtRewjM",
    authDomain: "bott-813eb.firebaseapp.com",
    projectId: "bott-813eb",
    storageBucket: "bott-813eb.firebasestorage.app",
    messagingSenderId: "986343673221",
    appId: "1:986343673221:web:1de830620027314cb088ec",
    measurementId: "G-L1GHK7VFG7"
  },
  tradBotServer:"https://apis.deepermind.ai/", //https://apis.deepermind.ai
  ekitServer:'http://apis.agrisource.ekoal.org'
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
