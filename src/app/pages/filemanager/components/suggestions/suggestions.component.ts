import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state(
        'open',
        style({
          opacity: 0,
          height:0
          
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0.8,
        }),
        
      ),
      transition('open => closed', [animate('0.5s')]),
      transition('closed => open', [animate('0.5s')]),
    ]),
  ],
})
export class SuggestionsComponent {
  @Output() callParentFunc: EventEmitter<any> = new EventEmitter<any>();
  isOpen = true;
  labels = [];
  public toggle(val) {
    this.isOpen = val;
  }
  public setLabels(val) {
    this.labels = val;
  }

  selectSuggest(str) {
    this.callParentFunc.emit({ str: str });
  }
}
