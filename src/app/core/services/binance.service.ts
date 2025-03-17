import { Injectable } from '@angular/core';
import { catchError, finalize,map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BinanceService {

  binanceDatas: {
    prices:{},
    account:{}
  }

  //app = initializeApp(environment.firebaseConfig);
  //db = getFirestore(this.app);

  constructor(private http: HttpClient) {
    console.log("constructor");
    this.binanceDatas = {
      prices:null,
      account:null
    }
    
    this.start();
    

   }

  async start() {
    console.log("start");
    
    //console.log(dRef);
    setInterval(() => {
      this.getPrices();
      this.getAccount();
    },5000)
    
  }

  pairs = ["USDT"]

/*  this.getTradessRef().subscribe(res => {
    this.trades = res;
    this.content_loaded = true;
  }); 
  
}*/

  //getTradessRef(): Observable<Object[]> {
    //
    
    //const q = query(dRef,,orderBy("starts"));
    //return collectionData(q, { idField: 'id'}) as Observable<Object[]>;
  //}

  getPrices() {
    const ask$ = this.http.get("http://saas.apis.ekoal.org/binance/prices").pipe(
      map((result) => {this.binanceDatas.prices=result["ret"];}), catchError(err => throwError(err))
    )
    ask$.subscribe();
  }
  getAccount() {
    const ask$ = this.http.get("http://saas.apis.ekoal.org/binance/accountInfos").pipe(
      map((result) => {console.log(result);this.binanceDatas.account=result["ret"];}), catchError(err => throwError(err))
    )
    ask$.subscribe();
  }
  
  getPrice(pair) {
    if (!this.binanceDatas.prices) { return 0; }
    return (this.binanceDatas.prices[pair]?this.binanceDatas.prices[pair]:0);
  }
  getBalance(token) {
    if (!this.binanceDatas.account) { return 0; }
    let realToken = token.replace("USDC","").replace("USDT","");
    for (var reliB = 0;reliB < this.binanceDatas.account["balances"].length;reliB++)
    {
        if (this.binanceDatas.account["balances"][reliB].asset == realToken) {
          return this.binanceDatas.account["balances"][reliB]["free"];
        }
    }
  }
  
  sendOrder(datas) {
    const ask$ = this.http.post("http://saas.apis.ekoal.org/binance/sendOrder",datas).pipe(
      map((result) => {console.log(result)}), catchError(err => throwError(err))
    )
    ask$.subscribe();
  }
}
