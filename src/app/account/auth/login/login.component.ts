import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';

import { ActivatedRoute, Router } from '@angular/router';
import { catchError, first, map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ConfigService } from 'src/app/core/services/config.service';

declare global {
  interface Window {
    onGoogleSignIn: (response: any) => void;
  }
}

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
  constructor(private socket: Socket,private http: HttpClient,
    private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, 
    private router: Router, private authenticationService: AuthenticationService,
    public configService:ConfigService) { }



  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });


    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
    window.onGoogleSignIn= this.onGoogleSignIn.bind(this);

    this.initializeGoogleSignIn();

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/filemanager';
  }

  onGoogleSignIn() {
    //console.log(res);
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


  googleSignin(googleWrapper: any) {
    googleWrapper.click();
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
          document.getElementById("googleLoginButton2"),
          { theme: "outline", size: "large", text: "continue_with" }
        );
      }
    });
  }*/

  


  enter(res) {
    //Stockages paramètres
    if (!res.params) {
      res.params = this.configService.defChatParams;
    }
    if (!res.prompts) {
      res.prompts = [
        {
          uid:-1,
          title:"Default RAG prompt",
          customPrompt:"You are an assistant for question-answering tasks based on retrieved context and person description. If you don't know the answer, just say that you don't know. "
        }
      ]
    }
    res.params.ownerUID = res.email;
    //
    localStorage.setItem('chatParams', JSON.stringify(res.params));
    delete res.params;
    localStorage.setItem('prompts', JSON.stringify(res.prompts));
    delete res.prompts;
    localStorage.setItem('currentUser', JSON.stringify(res));
    //
    //localStorage.setItem("chatParams",JSON.stringify(res.params)); 
    //localStorage.setItem("userParams",JSON.stringify(res.profile)); 
    //ON STORE LE SOCKET LIE AU CLIENT (x sockets pour 1 clients)
    this.socket.emit('storeClientInfo', { ownerUID:res.email });
    let gotoRoute ="";
    
    
    
    if (this.returnUrl) { gotoRoute = this.returnUrl; } else { gotoRoute = '/filemanager' }
    //HARDCODE
    this.router.navigate(['/filemanager']);
  }


  validGauth(res) {
    
    //Enter in app
    this.enter(res);
    //
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

      //if ((this.f.email.value == "poc@poc.poc") && (this.f.password.value == "poc")) {
        const ask$ = this.http.post(environment.tradBotServer+"auth/custom",{email:this.f.email.value,pass:this.f.password.value}).pipe(
          map((res:any) => {
              this.enter(res);
          }), catchError(err => throwError(err))
        )
        ask$.subscribe();


        
        

         


            //this.authFackservice..next(data.user);
        
        
      //}
      return;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .subscribe((data:any) => 
        {
          if (data.success == true)
          {
            console.log("data.user",data.user);
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
