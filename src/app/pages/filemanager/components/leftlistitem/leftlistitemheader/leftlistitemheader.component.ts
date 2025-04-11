import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-leftlistitemheader',
  templateUrl: './leftlistitemheader.component.html',
  styleUrls: ['./leftlistitemheader.component.scss']
})
export class LeftlistitemheaderComponent {
  @Input() element: any
  @Output() selectCategOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() showPreviewEmitter: EventEmitter<any> = new EventEmitter<any>();

  loading:boolean=true;
  iscollapse:boolean=true;

  showPreview(ev) {
    this.showPreviewEmitter.emit(ev);
  }

  selectCateg(path) {
    this.selectCategOutput.emit({path:path.path});
  }
}

