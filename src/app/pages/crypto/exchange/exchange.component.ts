import { Component, inject, OnInit } from '@angular/core';

import { ChartType, Notification } from './exchange.model';

import { priceCandlestickChart, notificationData } from './data';
import { BinanceService } from 'src/app/core/services/binance.service';
import { Firestore, collection, collectionData,query,where,orderBy, getDoc,doc,onSnapshot,setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {
  // breadcrumb items
  breadCrumbItems: Array<{}>;

  priceCandlestickChart: ChartType;

  notificationData: Notification[];

  tradeUID;
  firestore;
  trade;
  orders;
  curParams;
  

  constructor(public binance:BinanceService,private route: ActivatedRoute,private http: HttpClient) {
    this.firestore = inject(Firestore);
  }


  async loadFBase() {
    //LOAD TRADE
    const docRef = doc(this.firestore, "trades", this.tradeUID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      this.trade = docSnap.data();
      const unsub = onSnapshot(docRef, (doc) => {
          this.trade = doc.data();
      });

      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    //BIND ORDERS
    let ordersCol = collection(this.firestore, 'orders');
    const q = query(ordersCol, where("tradeUID", "==", this.tradeUID),orderBy("starts"));
    this.orders = collectionData<any>(q);



    
  }



  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Exchange', active: true }];

    this.priceCandlestickChart = priceCandlestickChart;
    this.notificationData = notificationData;

    //BIND TRADE
    //let tradesColl = collection(this.firestore, 'orders');
    //let trade = getDoc(tradesColl,)

    this.tradeUID = this.route.snapshot.paramMap.get("tradeUID");
    
    if (this.tradeUID == -1) {
      let nGuid = this.newGuid();
      this.trade = { 
        tradeUID:nGuid,
        actualizationInterval:30000,
        tradingAmount:100,
        pair:"ADAUSDC",
        baseTrailingStopPercent:2,
        dynamicProfitThreshold:4,
        smaPeriod:14,
        rsiPeriod:14,
        sellMode:"RSI",
        interval:"1m",
        waitBuyInterval:300000
      };
      

      this.tradeUID = nGuid;
    }
    else {
      this.loadFBase();
    }

    
    

    
    //this.orders = this.binance.getOrders("c7e73a40-c885-11ef-a07e-11835aac00bf");
    //console.log(this.orders);
  }
  async updateTrade() {
    //CREER LE TRADE ET METTRE SPOLDE A ZERO
    //alert("save");

    

    console.log(this.curParams);
    this.trade.starts = new Date();
    this.trade.action = "";
    await setDoc(doc(this.firestore, "trades", this.tradeUID), this.trade);

    const ask$ = this.http.post("http://fileai.api.ekoal.org/binance/startTradBot", {tradeUID:this.tradeUID})
    .pipe(
        finalize(() => console.log("ook"))
    );

    ask$.subscribe();
  }
}
