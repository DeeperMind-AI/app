import { HttpClient,HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import { catchError, finalize,last,map, tap } from 'rxjs/operators';
import { ChatMessage } from '../chat/chat.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { Socket } from 'ngx-socket-io';
import { AlertColor } from '../ui/alerts/alerts.model';

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss']
})
export class FilemanagerComponent implements OnInit {
  // bread crumb items
  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;

  uri = environment.tradBotServer;
  //uri = "http://saas.apis.ekoal.org";
  //uri = "http://fileai.api.ekoal.org";
  //uri = "http://localhost:5002";
  locStor = localStorage;
  nuDirName:string="";
  dirStructure:any[] = [
              {uid:"filesAll",libelle:"Tous les fichiers",title:"Toutes vos ressources",icon:"mdi-folder-table",color:"#F8D775",isColapse:false},
              {uid:"filesIaSel",libelle:"Sélection IA",title:"",icon:"mdi-folder-search",color:"#F8D775",isColapse:false},
              {uid:"filesClassif",libelle:"Classification auto",title:"",icon:"mdi-folder-pound",color:"#F8D775",isColapse:false},
            ];
  breadCrumbItems: Array<{}>;
  modalRef?: BsModalRef;
  radialoptions;
  question:string="";
  aiResponse:string = "";
  aiResponseContexts:any[] = [];
  chat_history = [];
  loading = false;
  chatMessagesData: ChatMessage[];
  pdfPreviewURL;
  pdfMetas="";
  filesList = [];
  isColapseFilesAll:boolean = false;
  isColapseFilesIa:boolean = false;
  isColapseFilesClass:boolean = false;
  docTabSelected:number = 1;
  datasProcess = [];
  disablePops = false;
  //
  metas:any;
  //Paramètres des uploads/requetes
  params:any;
  newSourcePop:any = {sourceType:"file"};

  tmpMetas = [];

  formData: UntypedFormGroup;
  chatSubmit: boolean;

  file:File;
  constructor(private socket: Socket,public toastr:ToastrService,public sanitizer: DomSanitizer,private modalService: BsModalService,private http: HttpClient,public formBuilder: UntypedFormBuilder, public configService:ConfigService) { }
  public isCollapsed = false;
  
  firstMessage = false;

  loadingDocs = false;
  fetchDocs() {
    this.loadingDocs = true;
    const ask$ = this.http.post(this.uri+"loadDocs",{ownerUID:this.params.ownerUID}).pipe(
      map((result:any) => {
        this.filesList=result.ret;
        this.loadingDocs = false;
        let message:string = ""
        if (!this.firstMessage) {
          if (this.filesList.length > 0){
            message = "What do you want to find in your datas ?";
          }
          else {
            message = "There is no datas, start by adding some by clicking on add in left panel!";
          }
          const currentDate = new Date();
          this.chatMessagesData.push({
            align: 'left',
            name: 'Assistant',
            message,
            time: currentDate.getHours() + ':' + currentDate.getMinutes()
          });
          this.onListScroll();
          this.firstMessage = true;
        }
        
      }), 
        catchError(err => throwError(err))
    )
      
    ask$.subscribe();
  }

  removertAlert(processUID) {
    for (var reliP=0;reliP<this.datasProcess.length;reliP++) {
      if (this.datasProcess[reliP].processUID == processUID) 
      {
        this.datasProcess.splice(reliP,1);
        this.fetchDocs();
        return;
      }
    }
  }

  onServerMessage(data) {
    this.toastr.success('New file indexed !.', 'Information');
    this.removertAlert(data.processUID);
    
   
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Apps' }, { label: 'File Manager', active: true }];
    this.chatMessagesData = [];
    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
    let that = this;
    
    //console.log(this.socket.connect());
    this.socket.on('connect', () => {
      this.socket.emit('storeClientInfo', { ownerUID:this.params.ownerUID });
      console.log("client connected");
      //this.socket.emit(message, { data: "I'm connected!" });
    });

    this.socket.on("message",function(data) {
      console.log("message recu",data);
      that.onServerMessage(data);
    });
    
    /*const ask$ = this.http.post(this.uri+"cleanES",{}).pipe(
      map((result:any) => {console.log(result.ret);this.filesList=result.ret;this.loadingDocs = false;}), catchError(err => throwError(err))
    )
      ask$.subscribe();
*/
    //AJOUT MESSAGE BONJOUR
    

    this.params = this.configService.chatParams;

    this.fetchDocs();

    this.radialoptions =  {
      series: [76],
      chart: {
        height: 150,
        type: 'radialBar',
        sparkline: {
          enabled: true
        }
      },
      colors: ['#485388'],
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5, // margin is in pixels
          },
          hollow: {
            size: '60%',
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '16px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      stroke: {
        dashArray: 3
      },
      labels: ['Storage'],
    }
  }
  
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.disablePops = false;
    this.modalRef = this.modalService.show(content);
  }
  /**
   * Open modal
   * @param content modal content
   */

  private getEventMessage(event: HttpEvent<any>, file: File) {
  
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading.`;
  
      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
        if ((Math.round(100 * event.loaded / event.total)) >= 100)
          return `Vectorizing.`;
        else {
          return `${percentDone}% uploaded.`;
        }
        
      
        
      case HttpEventType.Response:
        return `Vectorizing.`;
  
      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }
  uploadStatus = "";
  showProgress(val) {
    
    this.uploadStatus=val;
  }

  saveFile() {
    //CHECK CBO DATA TYPE
    switch (this.newSourcePop.sourceType) {
      case "file":
        if (this.file) {
          
          //return;
          this.disablePops = true;
          const formData = new FormData();
    
          formData.append("fileinp", this.file);
          //ON ENVOIE le nom modifié par l'utilisateur
          //formData.append("meta.name", this.tmpMetas.name);
          let processUID = "p_"+this.generateGuid();
          formData.append("meta.ownerUID", this.params.ownerUID);
          formData.append("processUID", processUID);
          const upload$ = this.http.post(this.uri+"upload", formData,{
            reportProgress: true,
            observe: 'events'
          })
          .pipe(
            map(event => this.getEventMessage(event, this.file)),
            tap(message => this.showProgress(message)),
            last(),
            finalize(() => {
              
              this.reset();
              //this.fetchDocs();
              this.modalRef?.hide();
              
              this.datasProcess.push({
                processUID:processUID,
                percent:0,
                msg:"Your data is being indexed",
                dataTitle: this.file.name
              });
              this.toastr.info('Your data is being indexed, a message will be displayed when it is available.', 'Information');
              }
            )
          );
          upload$.subscribe();
        }
        break;
      case "free":

        break;
    }
    
    //this.upload();
  }

  generateGuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

   // Delete Message
   deleteMessage(event:any){
    event.target.closest('li').remove();
  }

  // Copy Message
  copyMessage(event:any){
    navigator.clipboard.writeText(event.target.closest('li').querySelector('p').innerHTML);
  }

  // Delete All Message
  deleteAllMessage(event:any){
    var allMsgDelete:any = document.querySelector('.chat-conversation')?.querySelectorAll('li');
    allMsgDelete.forEach((item:any)=>{
      item.remove();
    })
  }

  onListScroll() {
    if (this.scrollRef !== undefined) {
      setTimeout(() => {
        this.scrollRef.SimpleBar.getScrollElement().scrollTop =
          this.scrollRef.SimpleBar.getScrollElement().scrollHeight + 1500;
      }, 500);
    }
  }
  messageSave() {
    const message = this.formData.get('message').value;
    const currentDate = new Date();
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: 'right',
        name: 'You',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });
      this.onListScroll();

      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });

      this.loading = true;
      const ask$ = this.http.post(this.uri+"askToFullDb2",{
        question:message,
        chat_history:this.chat_history,
        ownerUID:this.params.ownerUID,
        prompt:this.params.customPrompt,
        k:this.params.k,
        model:this.params.model,
      }).pipe(
        map((result:any) => {this.saveNuDir(result)}), catchError(err => throwError(err))
    )
      ask$.subscribe();
    }

    this.chatSubmit = true;
  }


  /**
   * Returns form
   */
  get form() {
    return this.formData.controls;
  }

  saveNuDir(result) {
    
    this.chat_history.push({human:this.question,ai:result.answer});
    this.aiResponse = result.answer;
    let found = false;
    this.aiResponseContexts = [];
    for (var reliC = 0;reliC < result.context.length;reliC++)
    {
      found = false;
      for (var reliC2 = 0;reliC2 < this.aiResponseContexts.length;reliC2++)
      {
        console.log(result.context[reliC]);
          if (result.context[reliC].metadata.fname == this.aiResponseContexts[reliC2].metadata.fname) {
            console.log(result.context[reliC].metadata.fname,this.aiResponseContexts[reliC2].metadata.fname);
            found = true;
            break;
          }
      }
      if (!found) {
        console.log(result.context[reliC])
        result.context[reliC].occurs=0;
        this.aiResponseContexts.push(result.context[reliC]);
      }
      else {
        for (var reliC2 = 0;reliC2 < this.aiResponseContexts.length;reliC2++)
          {
            
              if (result.context[reliC].metadata.fname == this.aiResponseContexts[reliC2].metadata.fname) {
                this.aiResponseContexts[reliC2].occurs+=1;
                break;
              }
          }
        
      }
    }
    //this.aiResponseContexts = result.context;
    this.loading = false;

    const currentDate = new Date();
    let message :string=this.aiResponse.toString();
    this.chatMessagesData.push({
      align: 'left',
      name: 'Assistant',
      message,
      time: currentDate.getHours() + ':' + currentDate.getMinutes()
    });
    this.onListScroll();

    // Set Form Data Reset
    this.formData = this.formBuilder.group({
      message: null
    });


  }
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
  
  searchKeyPress(event: KeyboardEvent) {
    if(event.charCode==13) {
      //alert(this.params.ownerUID);
      this.loading = true;
      const ask$ = this.http.post(this.uri+"askToFullDb2",{
        question:this.question,
        chat_history:this.chat_history,
        ownerUID:this.params.ownerUID,
        prompt:this.params.customPrompt,
        k:this.params.k,
      }).pipe(
        map((result:any) => {this.saveNuDir(result)}), catchError(err => throwError(err))
    )
      ask$.subscribe();
      
      
    }
  }
  showPreview(uri,f) {
    
    this.pdfPreviewURL = "https://medias.deepermind.ai/"+uri;
    console.log(f);
    this.pdfMetas = JSON.stringify(f); 
    
  }
  /**
   * Open modal
   * @param content modal content
   */

  onFileSelected(event) {

    this.file = event.target.files[0];
    this.tmpMetas = [
      {lib:"name",val:this.file.name},
      {lib:"size",val:this.file.size},
      {lib:"type",val:this.file.type},
    ]    
    
  }
  //RESET DATAS FORM NEW DATA
  reset() {
    this.tmpMetas = [];
    this.uploadStatus = "";
  }

  // tslint:disable-next-line: no-shadowed-variable
  close(processUID:string) {
    this.removertAlert(processUID);
  }
}
