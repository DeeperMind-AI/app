import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {

  locStor = localStorage;


  URL = 'assets/dashboard.json';

  chatParams:any = {
    ownerUID:(JSON.parse(this.locStor.getItem('currentUser'))["email"]?JSON.parse(this.locStor.getItem('currentUser'))["email"]:JSON.parse(this.locStor.getItem('currentUser'))["mail"]),
    customPrompt:`You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
            Question: {question} 
Context: {context} 
Answer:`,
    k:10,
    model:"gpt-4o-mini",
    histo:true
  };


  constructor(private http: HttpClient) { }
  getConfig() : Observable<any> {
    return this.http.get<any>(`${this.URL}`)
  }
}
