import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';


@Component({
  selector: 'app-leftlistitem',
  templateUrl: './leftlistitem.component.html',
  styleUrls: ['./leftlistitem.component.scss'],
})
export class LeftlistitemComponent {
  @Input() element: any
  @Input() type: string
  @Input() showCheck: Boolean;
  @Output() selectCategOutput: EventEmitter<any> = new EventEmitter<any>();
  @Output() showPreviewEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Output() checkEmitter: EventEmitter<any> = new EventEmitter<any>();

  

  constructor(public configService:ConfigService) { }

  iscollapse:boolean=true;


  check(ev) {
    this.checkEmitter.emit(ev);
  }
  showPreview(ev) {
    console.log(ev);
    this.showPreviewEmitter.emit(ev);
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

  onDropToCategory(event:any, categoryName: any) {
    console.log("event",event);
    if (event.previousContainer !== event.container) {
      const item = event.previousContainer.data[event.previousIndex];
      console.log("droped",item);
      // Retirer de la liste d’origine
      //event.previousContainer.data.splice(event.previousIndex, 1);
      // Ajouter à la catégorie
      //this[categoryName].push(item);
    }
  }
  

}
