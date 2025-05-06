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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HelperService } from 'src/app/core/services/helper.service';
import { ToastrService } from 'ngx-toastr';

interface IStripeSession {
  id: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  //
  //isLoading: boolean = true;
  modalRef?: BsModalRef;
  locStor = localStorage;
  params:any = {
    chat:{},
    profile:{},
    prompts:[]
  };
  //
  pricingData: Pricing[];
  disableForSave:boolean = false;
  //
  constructor(public configService:ConfigService,private http: HttpClient,
    private stripeFactory: StripeFactoryService,
    private route: ActivatedRoute,
    private loaderService:LoaderService,
    private modalService: BsModalService,
    private helper:HelperService,public toastr:ToastrService) {
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
  //
  ngOnInit(): void {
    
    //this.loaderService.isLoading.subscribe((v) => {
      this.stripe=this.stripeFactory.create(environment.stripe.stripePublicKey);
      this.stripeAmount = 100;
      this.pricingData = pricingData;

      this.params.chat =  JSON.parse(this.locStor.getItem('chatParams'));
      if (!this.params.chat) {
        this.params.chat = this.configService.defChatParams;
      }
      this.params.prompts =  (this.locStor.getItem('prompts')!="undefined"?JSON.parse(this.locStor.getItem('prompts')):[]);
      this.params.profile = JSON.parse(this.locStor.getItem('currentUser'));
      
      


    //});
  }
  ///
  disablePops:boolean = false;
  curPrompt:any = {
    lib:"",
    customPrompt:""
  };
  //
  savePrompt() {
    this.disablePops = true;
    let isNew = false;
    console.log("this.curPrompt",this.curPrompt);
    if (!this.curPrompt.uid) {
      isNew = true;
      this.curPrompt.uid = this.helper.generateGuid();
      this.params.prompts.push(this.curPrompt);
    }
    else {
      for (var reliP = 0;reliP < this.params.prompts.length;reliP++) {
        if (this.params.prompts[reliP].uid == this.curPrompt.uid) {
          this.params.prompts[reliP] = this.curPrompt;
          break;
        }
      }
    }
    
    localStorage.setItem('prompts', JSON.stringify(this.params.prompts));

    const ask$ = this.http.post(environment.tradBotServer+"updatePrompt",{ownerUID:this.params.chat.ownerUID,prompt:this.curPrompt}).pipe(
      map((result:any) => {
        
      }), 
      catchError(err => throwError(err))
    )
      
    ask$.subscribe();

    
    this.curPrompt = {lib:"",customPrompt:""};
    this.modalRef?.hide();
    this.disablePops = false;
  }
  /**
  * Open modal
  * @param content modal content
  */
  openModal(content: any) {
    this.disablePops = false;
    this.modalRef = this.modalService.show(content);
  }
  editPrompt(prpt,content) {
    this.curPrompt=JSON.parse(JSON.stringify(prpt));
    this.modalRef = this.modalService.show(content);
  }
  deletePrompt(prpt) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value==true) {
        const ask$ = this.http.post(environment.tradBotServer+"removePrompt",{ownerUID:this.params.chat.ownerUID,uid:prpt}).pipe(
          map((result:any) => {
            console.log("result",result);
            for (var reliP = 0;reliP < this.params.prompts.length;reliP++) {
              if (this.params.prompts[reliP].uid == prpt) {
                this.params.prompts.splice(reliP,1);
                break;
              }
            }
            //this.disablePops = false;
            //this.modalRef?.hide();
            //this.fetchCategs();
            
          }), 
            catchError(err => throwError(err))
        )
        ask$.subscribe();
      }
    });
    
  }

  public onPopPromptChange(event: Event): void {
  
    this.curPrompt.customPrompt = (event.target as any).value ;
  }
  //APPEL DU VIDAGE DE L'INDEX COTE SERVEUR
  cleanIndex() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.value==true) {
        const ask$ = this.http.post(environment.tradBotServer+"cleanES",{ownerUID:this.params.chat.ownerUID}).pipe(
          map((result:any) => {}), catchError(err => throwError(err))
        )
        ask$.subscribe();
        const ask2$ = this.http.post(environment.tradBotServer+"cleanMDB",{ownerUID:this.params.chat.ownerUID}).pipe(
            map((result:any) => {}), catchError(err => throwError(err))
        )
        ask2$.subscribe();
      }
    });
  }
  //
  public stripe!: StripeInstance;
  public stripeAmount!: number;
  //PAIEMENT SOUSCRIPTION
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
  //SAUVEGARDE DONNEES PROFIL UTILISATEUR
  validUser (){
    this.disableForSave = true;
    this.locStor.setItem("userParams",JSON.stringify(this.params.profile));

    const ask$ = this.http.post(environment.tradBotServer+"updateUser",{ownerUID:this.params.chat.ownerUID,name: this.params.profile.name,surn:this.params.profile.surn,}).pipe(
          map((result:any) => {
            this.toastr.success('Saved !', 'Success');
            
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
    this.params.chat.ownerUID = this.params.chat.ownerUID;
    //delete this.params.chat._id;
    const ask$ = this.http.post(environment.tradBotServer+"updateUserParams",this.params.chat).pipe(
          map((result:any) => {
            this.toastr.success('Saved !', 'Success');
        
            //this.disablePops = false;
            //this.modalRef?.hide();
            //this.fetchCategs();
            
          }), 
            catchError(err => throwError(err))
        )
          
        ask$.subscribe();
  }
  //
}
