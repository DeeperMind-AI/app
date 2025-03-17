import { Component, OnInit, ViewChildren, QueryList, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

import { OrderSortableService, SortEvent } from './orders-sortable.directive'

import { OrderService } from './orders.service'
import { Orders } from './orders.model'
import { ordersData } from './data'

import { Firestore, collection, collectionData,updateDoc, query,where,orderBy, getDocs,getDoc,doc,onSnapshot } from '@angular/fire/firestore';
import { BinanceService } from 'src/app/core/services/binance.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  providers: [OrderService, DecimalPipe]

})
export class OrdersComponent implements OnInit {
  // breadcrumb items
  breadCrumbItems: Array<{}>;

  ordersData: Orders[];
  firestore;
  trades;
  sumprof=0;
  sumprofAll=0;
  tradesDatas = {};
  total$: Observable<number>;
  @ViewChildren(OrderSortableService) headers: QueryList<OrderSortableService>;

  constructor(public service: OrderService,public binance:BinanceService) {
    this.firestore = inject(Firestore);
    //this.orders = service.orders$;
    
    this.total$ = service.total$;
  }
  sellsOrders;


  async updateSumProf() {
    let tradesCol = collection(this.firestore, 'trades');
      const querySnapshot = await getDocs(tradesCol);
      this.sumprof = 0;
      querySnapshot.forEach((doc) => {
        
        this.sumprof += (this.binance.getBalance(doc.data().pair)*doc.data().latestPrice)-(this.binance.getBalance(doc.data().pair)*doc.data().lastBuyPrice);
        //console.log(this.sumprof);
      });  
    }

  async loadFBase() {
    //BIND ORDERS
    let tradesCol = collection(this.firestore, 'trades');
    //let sellsOrdersCol = collection(this.firestore, 'orders');
    //const q = query(this.sellsOrders, where("side", "==", "SELL"),orderBy("starts"));
    this.trades = collectionData<any>(tradesCol);

    /*async function updateSumProf() {
      const querySnapshot = await getDocs(tradesCol);
      let ss = 0;
      querySnapshot.forEach((doc) => {
        
        ss += (this.binance.getBalance(doc.data().pair)*doc.data().latestPrice)-(this.binance.getBalance(doc.data().pair)*doc.data().lastBuyPrice);
        //console.log(this.sumprof);
      });  
      this.sumprof = 777;
    }
    */

    const qTrades = query(collection(this.firestore, "trades"));
    const unsubscribTrades = onSnapshot(qTrades, (querySnapshot) => {
      this.sumprof=0;
      querySnapshot.forEach((doc) => {
        let curShotTradeVal = (this.binance.getBalance(doc.data().pair)*(doc.data().latestPrice?doc.data().latestPrice:0))-(this.binance.getBalance(doc.data().pair)*(doc.data().lastBuyPrice?doc.data().lastBuyPrice:0));
        if (!this.tradesDatas[doc.data().tradeUID]) {
          this.tradesDatas[doc.data().tradeUID] = {bPrice:0,dailySum:0,quantity:doc.data().tradingAmount,curShotTradeVal:curShotTradeVal};
        }
        else {
          this.tradesDatas[doc.data().tradeUID].quantity = doc.data().tradingAmount;
          this.tradesDatas[doc.data().tradeUID].curShotTradeVal = curShotTradeVal;
        }
        this.sumprof += (this.binance.getBalance(doc.data().pair)*doc.data().latestPrice)-(this.binance.getBalance(doc.data().pair)*(doc.data().lastBuyPrice?doc.data().lastBuyPrice:0));
      });
    });

    
    let d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    const qOrders = query(collection(this.firestore, "orders"),where("starts", ">=", d),orderBy("starts"));
    //const qOrders = query(collection(this.firestore, "orders"),orderBy("starts"));
    const unsubscribOrders = onSnapshot(qOrders, (querySnapshot) => {
      this.sumprofAll=0;
      let bPrice = 0;
      let sPrice = 0;
      querySnapshot.forEach((doc) => {
        if (doc.data().side == "BUY") {
          //bPrice = doc.data().price;
          this.tradesDatas[doc.data().tradeUID].bPrice = doc.data().price;
          //console.log("bprice",bPrice);
        }
        else {
          let qty = this.tradesDatas[doc.data().tradeUID].quantity;
          let bp = this.tradesDatas[doc.data().tradeUID].bPrice;
          //sPrice = doc.data().price;
          //console.log("d",this.quantitys["ADAUSDC"]);
          //console.log("d",this.quantitys["PNUTUSDC"]);
          if (qty && bp && doc.data().price) {
            this.sumprofAll += (doc.data().price*qty)-(bp*qty);
            this.tradesDatas[doc.data().tradeUID].dailySum += 0+(doc.data().price*qty)-(bp*qty);
            console.log("kk",this.tradesDatas[doc.data().tradeUID].dailySum);
            console.log(this.tradesDatas);
          }
          
          
        }
        
        //this.sumprofAll += (this.binance.getBalance(doc.data().symbol)*doc.data().latestPrice)-(this.binance.getBalance(doc.data().pair)*doc.data().lastBuyPrice);
        //this.sumprof += (this.binance.getBalance(doc.data().pair)*doc.data().latestPrice)-(this.binance.getBalance(doc.data().pair)*doc.data().lastBuyPrice);
      });
    });

    /*setInterval(() => {
      this.updateSumProf();
    }, 10000);*/
    
    
      //promises.pu//sh(Resource.query(...));
    
    //this.sellsOrders = collectionData<any>(sellsOrdersCol);


    
  }

  async sellAll() {


    const querySnapshot = await getDocs(collection(this.firestore, 'trades'));
    querySnapshot.forEach((docu) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      updateDoc(doc(this.firestore, "trades", docu.id), {action:"FORCESELL"});
    });

    

    //this.orders
     // .pipe(map(val => { return val}))
     // .subscribe(val => { console.log(val)})
    //this.orders.forEach((order) => {
    //  console.log(order);
    //});
    
    
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Orders', active: true }];

    this.ordersData = ordersData;

    this.loadFBase();
  }

  /**
  * Sort table data
  * @param param0 sort the column
  *
  */
  onSort({ column, direction }: SortEvent) {
  
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
}
