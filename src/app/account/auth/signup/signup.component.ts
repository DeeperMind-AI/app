import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';
import { catchError, first, map } from 'rxjs/operators';
import { UserProfileService } from '../../../core/services/user.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: UntypedFormGroup;
  submitted = false;
  error = '';
  successmsg = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private userService: UserProfileService,public configService:ConfigService,private http: HttpClient) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * On submit form
   */
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    } else {
      //console.log(this.f);
      //return;
      const ask$ = this.http.post(environment.tradBotServer+"auth/register",{email:this.f.email.value,username:this.f.username.value,pass:this.f.password.value}).pipe(
        map((result:any) => {
          
          console.log(result);
          if (result.register == true) {
            this.router.navigate(["/account/login"]);
          }
            
        }), catchError(err => throwError(err))
      )
      ask$.subscribe();
    }
  }
}
