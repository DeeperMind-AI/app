import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent {
  formData: UntypedFormGroup;
  messageSubmit: boolean;
  contact:any={description:""};

  constructor(public formBuilder: UntypedFormBuilder,private http: HttpClient,public toastr:ToastrService) { }

  uri = environment.tradBotServer;
  subject = new FormControl('');
  message = new FormControl('');

  ngOnInit(): void {
    

    this.formData = this.formBuilder.group({
      subject:'Contact',
      message: ['', [Validators.required]],
    })

  }

  public onDescChange(event: Event): void {
    //this.contact.description = (event.target as any).value ;
  }
  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }
  messageSave(question:string=null) {
    
    
    let message = (question?question:this.formData.get('message').value);
    const currentDate = new Date();

    //
    if (this.formData.valid && message) {

      const ask$ = this.http.post(this.uri+"nufeedback",{
        message:message,
        dateCreation:new Date(),
        ownerUID:JSON.parse(localStorage.getItem('currentUser')).email,
        subject:this.formData.get('subject').value,
      }).pipe(
        map((result:any) => {

          this.toastr.success('Thank you for your feedback !', 'Success');

      

        }), catchError(err => throwError(err))
      ) 
      ask$.subscribe();

      this.formData = this.formBuilder.group({
        message: null
      });
      
      
    }
    this.messageSubmit = true;
  }
}
