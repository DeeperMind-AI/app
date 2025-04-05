import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  locStor = localStorage;

  notifications:any[] = [];

  URL = 'assets/dashboard.json';

  //
  isPoc = environment.ispoc;
  
  userParams:any = {};
  chatParams:any = {};


  constructor(private http: HttpClient) { 
    //SI ON A LE USER ALORS ON CHARGE
    if (this.locStor.getItem('currentUser'))
    {
      this.loadConfig(JSON.parse(this.locStor.getItem('currentUser'))["email"]);
    }
  }

  loadConfig(ownerUID:string) {
    let promArray = [];
    let uri = environment.tradBotServer;

    if(!this.locStor.getItem("chatParams"))
    {
      promArray.push(new Promise((resolve, reject) => {
        const ask$ = this.http.post(uri+"getUserParams",{ownerUID:ownerUID}).pipe(
            map((result:any) => {resolve(result);}), catchError(err => throwError(err))
        )
        ask$.subscribe();
        
      }));
      promArray.push(new Promise((resolve, reject) => {
        const ask$ = this.http.post(uri+"getUser",{ownerUID:ownerUID}).pipe(
            map((result:any) => {resolve(result);}), catchError(err => throwError(err))
        )
        ask$.subscribe();
        
      }));
      Promise.all(promArray).then(values => {
        
        if (values[0].ret) {
          this.chatParams = values[0].ret;
        }
        else {
          this.chatParams = {
            ownerUID:ownerUID,
            customPrompt:`You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Please be as detailed as possible in your answers.`,
            fixedPromptParams:`\nQuestion: {question}\nContext: {context}\nAnswer:`,
            promptAddQuestions:true,
            promptAddQuestionsNumber:3,
            k:10,
            model:"gpt-4o-mini",
            histo:true
          };
        }
        if (values[1].ret) {
          this.userParams = values[1].ret;
        }
        this.locStor.setItem("chatParams",JSON.stringify(this.chatParams)); 
        this.locStor.setItem("userParams",JSON.stringify(this.userParams)); 
        console.log("This should not run until both have returned", values);
      });
    }
    else {
      this.chatParams = JSON.parse(this.locStor.getItem("chatParams"));
    }

    
  } 

  getConfig() : Observable<any> {

    return this.http.get<any>(`${this.URL}`)

  }
}
