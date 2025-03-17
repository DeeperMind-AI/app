import { Component } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

import { Pricing } from './pricing.model';

import { pricingData } from './data';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  
  locStor = localStorage;
  params:any;
  pricingData: Pricing[];


  constructor(public configService:ConfigService) {

  }

  
  ngOnInit(): void {
      
    this.pricingData = pricingData;
      this.params = {
        
        ownerUID:(JSON.parse(this.locStor.getItem('currentUser'))["email"]?JSON.parse(this.locStor.getItem('currentUser'))["email"]:JSON.parse(this.locStor.getItem('currentUser'))["mail"]),
        customPrompt:`You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
                Question: {question} 
    Context: {context} 
  Answer:`,
        k:10,
        model:"gpt-4o-mini",
        histo:true
      };
    }

  public onPromptChange(event: Event): void {
    
    const value = (event.target as any).value;
    this.params.customPrompt = value;

    this.configService.chatParams = this.params;
  }
}
