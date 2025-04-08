import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-leftlistitemheader',
  templateUrl: './leftlistitemheader.component.html',
  styleUrls: ['./leftlistitemheader.component.scss']
})
export class LeftlistitemheaderComponent {
  @Input() element: any
  
  loading:boolean=true;
  iscollapse:boolean=true;
}
