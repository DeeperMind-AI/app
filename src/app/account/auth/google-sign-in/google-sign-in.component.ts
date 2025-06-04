import { EventEmitter, Component, OnInit, NgZone, Output } from '@angular/core';

   declare const google: any;

   @Component({
     selector: 'app-google-sign-in',
     templateUrl: './google-sign-in.component.html'
   })
   export class GoogleSignInComponent implements OnInit {
    @Output() loginWithGoogle: EventEmitter<any> = new EventEmitter<any>();

     constructor(private ngZone: NgZone) { }

     ngOnInit(): void {
       this.initializeGoogleSignIn();
     }

     createFakeGoogleWrapper = () => {
      const googleLoginWrapper = document.createElement("div");
      googleLoginWrapper.style.display = "none";
      googleLoginWrapper.classList.add("custom-google-button");
      document.body.appendChild(googleLoginWrapper);
      google.accounts.id.renderButton(
        googleLoginWrapper,
        { type: "icon", width: 200, theme: "outline", size: "large" }  
      );
      const googleLoginWrapperButton = googleLoginWrapper.querySelector(
        "div[role=button]"
      ) as HTMLElement;
      return {
        click: () => {
          googleLoginWrapperButton?.click();
        },
      };
    };
  
    handleGoogleLogin() {
      this.loginWithGoogle.emit(this.createFakeGoogleWrapper());
    }



     initializeGoogleSignIn() {
       google.accounts.id.initialize({
         client_id: '259564130297-f7m7uksgbe104go97525aaghsia9omm0.apps.googleusercontent.com',
         callback: (response: any) => this.handleCredentialResponse(response)
       });
       google.accounts.id.attachClickHandler(document.getElementById('customBtn'))
       
       /*google.accounts.id.renderButton(
         document.getElementById('google-signin-button'),
         { theme: 'outline', size: 'large' }  // customization attributes
       );*/

       google.accounts.id.prompt(); // also display the One Tap dialog
     }

     handleCredentialResponse(response: any) {
       // response.credential is the JWT token
       console.log('Encoded JWT ID token: ' + response.credential);

       // You can decode the JWT token here or send it to your backend for verification
       // For demonstration, we'll just log it

       // If using NgZone, ensure any UI updates are run inside Angular's zone
       this.ngZone.run(() => {
         // Update your application state here, e.g., store user info, navigate, etc.
       });
     }

   }