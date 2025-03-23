import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { ActivatedRoute, Router } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';


declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {
  @Output() loginWithGoogle: EventEmitter<any> = new EventEmitter<any>();

  loginForm: UntypedFormGroup;
  submitted = false;
  error = '';
  returnUrl: string;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private http: HttpClient,private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) { }



  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.initializeGoogleSignIn();

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/filemanager';
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }
 
 
  initializeGoogleSignIn() {
    google.accounts.id.initialize({
      client_id: environment.googleConfig.apiKey,
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById("googleLoginButton"),
      { theme: "outline", size: "large", text: "continue_with" }
    );
    
    google.accounts.id.prompt(); 
  }

  /*triggerGoogleSignIn() {
    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // Try manual rendering
        google.accounts.id.renderButton(
          document.getElementById("googleLoginButton"),
          { theme: "outline", size: "large", text: "continue_with" }
        );
      }
    });
  }*/


  validGauth(res) {
    
    localStorage.setItem('currentUser', JSON.stringify(res));
    //this.authFackservice..next(data.user);
    let gotoRoute;
    if (this.returnUrl) { gotoRoute = this.returnUrl; } else { gotoRoute = '/filemanager' }
    this.router.navigate([gotoRoute]);
  }
  handleCredentialResponse(response: any) {
    console.log(response.credential);
    const ask$ = this.http.post(environment.tradBotServer+"auth/google",response).pipe(
            map((result:any) => {this.validGauth(result)}), catchError(err => throwError(err))
        )
          ask$.subscribe();
    

  }
 
  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {

    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .subscribe((data:any) => 
        {
          if (data.success == true)
          {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            //this.authFackservice..next(data.user);
            let gotoRoute;
            if (this.returnUrl) { gotoRoute = this.returnUrl; } else { gotoRoute = '/filemanager' }
            this.router.navigate([gotoRoute]);
            console.log("iii",data);
          }
          else {
            console.log("èèè",data);
          }
        }
    );

    }
  }
}
