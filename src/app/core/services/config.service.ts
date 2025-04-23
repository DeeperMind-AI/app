import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  locStor = localStorage;

  notifications:any[] = [];

  URL = 'assets/dashboard.json';


  //CATEGS LIST
  selectedPath:string = "/";
  //
  filesList:any[] = [];
  aiResponseContexts:any[] = [];
  aiResponseFiles:any[] = [];
  fileFilterTerm:string = "";
  //
  isPoc = environment.ispoc;
  
  defChatParams = {
    customPrompt:`You are an assistant for question-answering tasks. Use only the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Please be as detailed as possible in your answers.`,
    fixedPromptParams:`\nQuestion: {question}\nContext: {context}\nAnswer:`,
    promptAddQuestions:true,
    promptAddQuestionsNumber:3,
    k:50,
    model:"gpt-4o-mini",
    histo:true
  };


  constructor(private http: HttpClient,private router: Router) { 
    //SI ON A LE USER ALORS ON CHARGE

  

    //{
      //alert(JSON.parse(this.locStor.getItem('currentUser'))["email"]);
      //this.loadConfig(JSON.parse(this.locStor.getItem('currentUser'))["email"]);
    //}
  }

  hasFileChilds(path) {
    for (var reliC = 0;reliC < this.filesList.length;reliC++) {
      if (!this.filesList[reliC].category || (this.filesList[reliC].category == path)) {
        return true;
      }
    }
    return false;
  }

  getConfig() : Observable<any> {

    return this.http.get<any>(`${this.URL}`)

  }
}
