import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';

@Component({
  selector: 'app-leftlistitem',
  templateUrl: './leftlistitem.component.html',
  styleUrls: ['./leftlistitem.component.scss']
})
export class LeftlistitemComponent {
  @Input() element: any
  @Input() type: string
  @Output() selectCategOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() showPreviewEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(public configService:ConfigService) { }

  iscollapse:boolean=true;


  showPreview(ev) {
    this.showPreviewEmitter.emit(ev);
  }
  check(z) {
    
  }

  selectCateg(path) {
    
    if (this.configService.selectedPath == path) {
      this.configService.selectedPath = "/";  
    }
    else {
      this.configService.selectedPath = path;
    }
    
    //this.selectCategOutput.emit({path:path});
  }

}
