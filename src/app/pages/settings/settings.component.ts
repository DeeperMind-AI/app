import { Component } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

import { StripeFactoryService, StripeInstance } from "ngx-stripe";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map, switchMap, throwError } from "rxjs";


import { Pricing } from './pricing.model';



import { pricingData } from './data';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

interface IStripeSession {
  id: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  
  public stripe!: StripeInstance;
  public stripeAmount!: number;
  isLoading: boolean = true;

  locStor = localStorage;
  params:any = {
    chat:{},
    profile:{}
  };
  pricingData: Pricing[];



  disableForSave:boolean = false;

  constructor(public configService:ConfigService,private http: HttpClient,
    private stripeFactory: StripeFactoryService,
    private route: ActivatedRoute,
    private loaderService:LoaderService) {
      this.route.queryParams.subscribe(params => {
        switch (params["status"]) {
          case "stripe-successful-payment":
            Swal.fire('Paiement validé', '', 'success');
            break;
          case "stripe-canceled-payment":
            Swal.fire('Paiement annulé', '', 'error');
            break;
        }
    });
  }

  
  ngOnInit(): void {
    
    //this.loaderService.isLoading = true;
    this.loaderService.isLoading.subscribe((v) => {


      this.stripe=
      this.stripeFactory.create(environment.stripe.stripePublicKey);
      this.stripeAmount = 100;

      this.pricingData = pricingData;

      this.params.chat = this.configService.chatParams;
      this.params.user = this.configService.userParams;
      this.params.profile = JSON.parse(this.locStor.getItem('currentUser'));
      
        this.isLoading = false;
      
    });
    
    

    
    }

    cleanIndex() {
      const ask$ = this.http.post(environment.tradBotServer+"cleanES",{ownerUID:this.params.chat.ownerUID}).pipe(
              map((result:any) => {}), catchError(err => throwError(err))
          )
      ask$.subscribe();
      const ask2$ = this.http.post(environment.tradBotServer+"cleanMDB",{ownerUID:this.params.chat.ownerUID}).pipe(
        map((result:any) => {}), catchError(err => throwError(err))
    )
      ask2$.subscribe();
    }

    buy(amount) {
      this.http.post(environment.tradBotServer + 'stripe/create-checkout-session', { data: { amount: amount } }, { observe: 'response' })
        .pipe(
          switchMap((response: HttpResponse<Object>) => {
            const session: IStripeSession = response.body as IStripeSession;
            console.log(session.id);
            return this.stripe.redirectToCheckout({ sessionId: session.id });
          })
        )
        .subscribe(result => {
          // If `redirectToCheckout` fails due to a browser or network
          if (result.error) {
            console.log(result.error)
          }
        });
    }
    
    //SAUVEGARDE DONNEES PROFIL
    validUser (){
      this.disableForSave = true;
      this.locStor.setItem("userParams",JSON.stringify(this.params.profile));
      this.configService.userParams = this.params.profile;
      const ask$ = this.http.post(environment.tradBotServer+"updateUser",this.params.profile).pipe(
            map((result:any) => {
          
              //this.disablePops = false;
              //this.modalRef?.hide();
              //this.fetchCategs();
              
            }), 
              catchError(err => throwError(err))
          )
            
          ask$.subscribe();


    }
    //Changement parmètre contenu prompt custom
    public onPromptChange(event: Event): void {
    
      this.params.chat.customPrompt = (event.target as any).value ;
    }
    //sauvegarde paramètres glbaux -> chat
    validParamsChat (){
      this.disableForSave = true;
      this.locStor.setItem("chatParams",JSON.stringify(this.params.chat));
      this.configService.chatParams = this.params.chat;
      this.params.chat.ownerUID = this.params.chat.ownerUID;
      const ask$ = this.http.post(environment.tradBotServer+"updateUserParams",this.params.chat).pipe(
            map((result:any) => {
          
              //this.disablePops = false;
              //this.modalRef?.hide();
              //this.fetchCategs();
              
            }), 
              catchError(err => throwError(err))
          )
            
          ask$.subscribe();
    }
  
}
