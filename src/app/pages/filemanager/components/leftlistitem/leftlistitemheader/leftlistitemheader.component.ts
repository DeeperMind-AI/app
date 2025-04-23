import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-leftlistitemheader',
  templateUrl: './leftlistitemheader.component.html',
  styleUrls: ['./leftlistitemheader.component.scss']
})
export class LeftlistitemheaderComponent {
  @Input() element: any
  @Output() selectCategOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() showPreviewEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(public configService:ConfigService) { }

  loading:boolean=true;
  iscollapse:boolean=true;

  showPreview(ev) {
    console.log("header.showPreview",ev);
    this.showPreviewEmitter.emit(ev);
  }

  check(ev) {
    console.log("header.check",ev);
    this.checkEmitter.emit(ev);
  }

  selectCateg(path) {
    console.log("header.selectCateg",path);
    this.selectCategOutput.emit({path:path.path});
  }
}

