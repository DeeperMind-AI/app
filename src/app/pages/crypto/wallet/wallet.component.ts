import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { WalletService } from './wallet.service';
import { WalletSortableService, SortEvent } from './wallet-sortable.directive';

import { BinanceService } from '../../../core/services/binance.service';

import { ChartType, Activities } from './wallet.model';

import { OveviewChart, activitiesData } from './data';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  providers: [WalletService, DecimalPipe]
})
export class WalletComponent implements OnInit {

  // breadcrumb items
  breadCrumbItems: Array<{}>;
  OveviewChart: ChartType;

  activitiesData: Activities[];

  activities$: Observable<Activities[]>;
  total$: Observable<number>;

  

  @ViewChildren(WalletSortableService) headers: QueryList<WalletSortableService>;

  constructor(public service: WalletService, public binance:BinanceService) {
    this.activities$ = service.activities$;
    this.total$ = service.total$;
  }

  datas = {
    pctDiff: 0.1,
    init:false,
    trades:[],
    mode:"SELL",
    initQuotasGoal:16,
    token:"XAI",
    lastWalletTokenPrice:0,
    highestKeeper:0,
    lowestKeeper:999999,
    pairPrice:0,
    soldes:{
      token:0,
      USDT:0
    },
    graph:[]
  };


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Crypto' }, { label: 'Wallets', active: true }];

    this.OveviewChart = OveviewChart;
    this.activitiesData = activitiesData;

    
    //let test = this.binance.getPrices();
    //for (var reliP = 0;reli < test.leng)
    //console.log(test);
    //const price = this.getPrices();
    setInterval(() => {
      //
      this.datas.pairPrice = this.binance.getPrice(this.datas.token+"USDT"); 
      //
      this.datas.soldes["USDT"] = this.binance.getBalance("USDT");
      this.datas.soldes["token"] = this.binance.getBalance(this.datas.token);
      //
      if ((this.datas.highestKeeper <= this.datas.pairPrice) && (this.datas.pairPrice > 0)) {this.datas.highestKeeper = this.datas.pairPrice;}
      if ((this.datas.pairPrice <= this.datas.lowestKeeper) && (this.datas.pairPrice > 0)) {this.datas.lowestKeeper = this.datas.pairPrice;}
      
      //console.log(this.datas.lowestKeeper+"/"+this.datas.pairPrice);
      let difHighest = (100/this.datas.highestKeeper) * this.datas.pairPrice;
      let difLowest = (100/this.datas.pairPrice) * this.datas.lowestKeeper;

      /*this.datas.graph.push({
        ts:new Date(),
        c:this.datas.pairPrice,
        h:this.datas.highestKeeper,
        l:this.datas.lowestKeeper,
      })*/

        if (this.datas.pairPrice>0) {
          OveviewChart.series[0].data.push(this.datas.highestKeeper);
          OveviewChart.series[1].data.push(this.datas.pairPrice);
          OveviewChart.series[2].data.push(this.datas.lowestKeeper);
          OveviewChart.xaxis.categories.push(new Date().toString());
          
        

        //this.getChart();
        if ((this.datas.mode == "SELL")) {
          //BUY
          
          //this.datas.mode = "BUY";
          //console.log((100 - difHighest) + " / " + this.datas.pctDiff);
          //console.log(this.datas.pctDiff);
          if ((this.datas.initQuotasGoal > 0) || ((((100 - difHighest)) >= this.datas.pctDiff) && (this.datas.pairPrice > this.datas.lastWalletTokenPrice))) { 
            console.log("SELL");
            this.binance.sendOrder({
              symbol: this.datas.token+"USDT",
              side: 'SELL',
              type:"MARKET",
              quantity: Math.floor(this.datas.soldes.token)
            });
            
            this.datas.mode = "BUY";
            this.datas.trades.push({dat:new Date(),action:"SELL",price:this.datas.pairPrice});
            this.datas.lowestKeeper = this.datas.highestKeeper = this.datas.lastWalletTokenPrice = this.datas.pairPrice;
            this.datas.initQuotasGoal = -1;
          }
        }
        else {
          //SELL
          //alert("sELL");
          //ON VA CAL
          //this.datas.mode = "SELL";
          
          /*if (this.datas.initQuotasGoal > 0) {
            let curWallet = this.datas.soldes["token"]*this.datas.pairPrice;
            //console.log(this.datas.soldes["token"]+ "/" + this.datas.pairPrice,curWallet);
            if ((curWallet > this.datas.initQuotasGoal) && (this.datas.pairPrice > this.datas.lastWalletTokenPrice)) {
              //console.log(this.datas.soldes["token"]+ "/" + this.datas.pairPrice,curWallet);
              this.datas.trades.push({dat:new Date(),action:"SELL",price:this.datas.pairPrice});
              this.datas.lowestKeeper = this.datas.highestKeeper = this.datas.lastWalletTokenPrice = this.datas.pairPrice;
              this.datas.mode = "BUY";
              this.datas.initQuotasGoal = -1;
              console.log("SELL");
            } 
          } 
          else {*/
            if (((100 - difLowest) >= this.datas.pctDiff)  && (this.datas.pairPrice < this.datas.lastWalletTokenPrice)) {
              this.binance.sendOrder({
                symbol: this.datas.token+"USDT",
                side: 'BUY',
                type:"MARKET",
                quantity: Math.floor(this.datas.soldes["USDT"]/this.datas.pairPrice)
              });
              this.datas.trades.push({dat:new Date(), action:"BUY",price:this.datas.pairPrice});
              this.datas.lowestKeeper = this.datas.highestKeeper = this.datas.lastWalletTokenPrice = this.datas.pairPrice;
              this.datas.mode = "SELL";
            }
          //}
          
        }
      }
    }, 1000);
  }

  async getChart() {
    for (var reli = 0;reli < this.datas.graph.length;reli++) {
      
    }
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
