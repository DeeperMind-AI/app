import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-leftlistitemheader',
  templateUrl: './leftlistitemheader.component.html',
  styleUrls: ['./leftlistitemheader.component.scss']
})
export class LeftlistitemheaderComponent {
  @Input() element: any
  @Output() selectCategOutput: EventEmitter<any> = new EventEmitter<any>();

  loading:boolean=true;
  iscollapse:boolean=true;

  selectCateg(path) {
    console.log(path.path);
    this.selectCategOutput.emit({path:path.path});
  }
}

