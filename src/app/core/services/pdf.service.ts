import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  

  constructor(private http: HttpClient) {}

  async getPDF(uri) {
    alert(uri);
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('responseType', 'blob')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
    const ask$ = this.http.get(uri, {headers}).pipe(
          map((result) => {
            return result;
          }), catchError(err => throwError(err))
        )
        ask$.subscribe();
    
  }
}