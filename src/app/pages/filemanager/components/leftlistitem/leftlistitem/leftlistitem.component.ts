import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-leftlistitem',
  templateUrl: './leftlistitem.component.html',
  styleUrls: ['./leftlistitem.component.scss']
})
export class LeftlistitemComponent {
  @Input() element: any

  iscollapse:boolean=true;
}
