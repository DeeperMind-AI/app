import { HttpClient,HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { throwError } from 'rxjs';
import { catchError, finalize,last,map, tap } from 'rxjs/operators';
import { ChatMessage } from './models/chat.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { Socket } from 'ngx-socket-io';
import { AlertColor } from '../ui/alerts/alerts.model';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { HelperService } from 'src/app/core/services/helper.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.scss'],
})
export class FilemanagerComponent implements OnInit {
  // bread crumb items
  @ViewChild('scrollEle') scrollEle;
  @ViewChild('scrollRef') scrollRef;
  @ViewChild('workContent') workContent;
  @ViewChild('suggestions') suggestions:SuggestionsComponent;
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.changeHeight(this.workContent.nativeElement,(window.innerHeight -200).toString()); 
  }
  changeHeight(element: HTMLElement, newHeight: string) {
    this.renderer.setStyle(element, 'height', newHeight + "px");
  }
  //
  uri = environment.tradBotServer;
  //uri = "http://saas.apis.ekoal.org";
  //uri = "http://fileai.api.ekoal.org";
  //uri = "http://localhost:5002";
  locStor = localStorage;
  //
  breadCrumbItems: Array<{}>;
  modalRef?: BsModalRef;
  radialoptions;
  question:string="";

  aiResponse:string = "";
  aiQuestions:string[] = [];
  
  chat_history = [];
  loading = false;
  chatMessagesData: ChatMessage[];
  pdfPreviewURL;
  pdfMetas="";
  isColapseFilesAll:boolean = false;
  isColapseFilesIa:boolean = false;
  isColapseFilesClass:boolean = false;
  docTabSelected:number = 4;
  datasProcess = [];
  disablePops = false;
  //
  
  
  //
  fileStructure = [
    {uid:1,title: "FILEMANAGER.SIDEBARLEFT.ALL_DATAS.TEXT",icon:'mdi-database',iconColor:"#1234ff",childs:[]},
    {uid:2,title:"FILEMANAGER.SIDEBARLEFT.PRESET.TEXT",icon:'mdi-robot',iconColor:"#ce6436",childs:[]}
  ];
  //
            maintabSelected = 1;
  //
  metas:any;
  //Paramètres des uploads/requetes
  params:any= {};
  newSourcePop:any = {sourceType:"file"};

  tmpMetas = [];

  formData: UntypedFormGroup;
  chatSubmit: boolean;

  file:File;
  constructor(private socket: Socket,public toastr:ToastrService,
    public sanitizer: DomSanitizer,private modalService: BsModalService,
    private http: HttpClient,public formBuilder: UntypedFormBuilder, 
    public configService:ConfigService,private renderer: Renderer2, 
    private helper: HelperService,public translate: TranslateService,
    private cookieService: CookieService) { }
  public isCollapsed = false;
  
  firstMessage = false;

  //Chargement des données
  filesList = [];
  loadingDocs = false;

  



  fetchDocs() {
    this.loadingDocs = true;
    const ask$ = this.http.post(this.uri+"loadDocs",{ownerUID:JSON.parse(localStorage.getItem('currentUser'))["email"]}).pipe(
      map((result:any) => {
        this.filesList=result.ret;
        this.configService.filesList = result.ret;
        this.loadingDocs = false;
        let message:string = ""
        if (!this.firstMessage) {
          if (this.filesList.length > 0){
            message = "FILEMANAGER.CHAT.WELCOME.TEXT";
          }
          else {
            message = "FILEMANAGER.CHAT.WELCOMENODATA.TEXT";
          }
          const currentDate = new Date();
          this.chatMessagesData.push({
            welcome:true,
            align: 'left',
            name: 'FILEMANAGER.CHAT.MESSAGE.IANAME',
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
  //Chargement des catégories
  categsList:any[] = [];
  loadingCategs = false;
  fetchCategs() {
    this.loadingCategs = true;
    const ask$ = this.http.post(this.uri+"loadCategs",{ownerUID:JSON.parse(localStorage.getItem('currentUser'))["email"]}).pipe(
      map((result:any) => {
        
        this.fileStructure[0].childs = this.generateCategTree(result.ret,"");;
        console.log(this.categsList)
        this.loadingCategs = false;
      }), 
        catchError(err => throwError(err))
    )
      
    ask$.subscribe();
  }

  redo(str) {
    this.messageSave(str);
  }

  generateCategTree(categs,path):any[] {
    let returnTree:any[] = [];
    
    for (var reli = 0;reli < categs.length;reli++) {
      //console.log("path",path);
      //console.log("this.categsList[reli].path",this.categsList[reli].path);
      if (categs[reli].path == path + "/" + categs[reli].name) {
        let el = categs[reli];
        el.childs = this.generateCategTree(categs,categs[reli].path);
        returnTree.push(el);
      }
    }

    return returnTree;

  }

  copy(str) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = str;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    //MESSAGE
    this.toastr.success('Copied to clipboard !', 'Success');
  }

  removertAlert(processUID) {
    for (var reliP=0;reliP<this.datasProcess.length;reliP++) {
      if (this.datasProcess[reliP].processUID == processUID) 
      {
        this.datasProcess.splice(reliP,1);
        
        break;;
      }
    }
    this.fetchDocs();
  }

  onServerMessage(data) {
    //this.toastr.success('New file indexed !.', 'Information');
    //this.removertAlert(data.processUID);
    
    this.configService.updateNotification(data);
    //SI STATUS = DONE OR SUMARRIZING
    this.fetchDocs();

  }

  ngAfterViewInit(): void {
    this.changeHeight(this.workContent.nativeElement,(window.innerHeight -200).toString());
  }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Apps' }, { label: 'File Manager', active: true }];
    this.chatMessagesData = [];
    
    this.configService.aiResponseContexts = [];
    this.configService.aiResponseFiles = [];

    this.formData = this.formBuilder.group({
      message: ['', [Validators.required]],
    });
    let that = this;
    
    //console.log(this.socket.connect());
    this.socket.on('connect', () => {
      this.socket.emit('storeClientInfo', { ownerUID:JSON.parse(localStorage.getItem('currentUser'))["email"] });
      console.log("client connected");
      //this.socket.emit(message, { data: "I'm connected!" });
    });

    this.socket.on("message",function(data) {
      
      that.onServerMessage(data);
    });
    
    /*const ask$ = this.http.post(this.uri+"cleanES",{}).pipe(
      map((result:any) => {console.log(result.ret);this.filesList=result.ret;this.loadingDocs = false;}), catchError(err => throwError(err))
    )
      ask$.subscribe();
*/
    //AJOUT MESSAGE BONJOUR
    this.params.chat =  JSON.parse(this.locStor.getItem('chatParams'));
    if (!this.params.chat) {
      this.params.chat = this.configService.defChatParams;
    }
    //
    this.params.prompts =  (this.locStor.getItem('prompts')!="undefined"?JSON.parse(this.locStor.getItem('prompts')):[]);
    //
    this.selectedPrompt = this.params.prompts[0];
    console.log("this.selectedPrompt",this.selectedPrompt);
    //this.params.chat =  JSON.parse(this.locStor.getItem('chatParams'));
    //if (!this.params.chat) {
      //this.params.chat = this.configService.defChatParams;
    //}
    this.fetchCategs();
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
  //
  selectedPrompt:any;
  selectPromptVal = "-1";
  selectPromptChange(e,val) {
    for (var reliP=0;reliP<this.params.prompts.length;reliP++) {
      if (this.params.prompts[reliP].uid==val)
      {
        this.selectedPrompt = this.params.prompts[reliP];
        break;
      }
    }
  }
  //
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

  selectedCateg:string = "/";
  categ:any = {};

  selectCategElem(level,label) {
    
  }

  //Bridge parent/childs
  showData(e) {
    this.showPreview(eval.name,e.el);
  }

  selectCateg(path) {
    let sCats = path.path.split("/");
    this.selectedCateg = path.path;
    for (var reli = 0;reli< this.categsList.length;reli++) {
      if (this.categsList[reli].path == path.path) {
        this.categsList[reli].selected = !this.categsList[reli].selected;
      }
      else {
        this.categsList[reli].selected = false;
      }
    }

  }
  saveCateg() {
    this.disablePops = true;
    let categ=this.categ;
    categ.path = (this.configService.selectedPath=="/"?"/"+categ.name:this.configService.selectedPath+"/" + categ.name);
    categ.ownerUID = JSON.parse(localStorage.getItem('currentUser')).email;
    const ask$ = this.http.post(this.uri+"addCateg",categ).pipe(
      map((result:any) => {
    
        this.disablePops = false;
        this.modalRef?.hide();
        this.reset();
        this.fetchCategs();

        
      }), 
        catchError(err => throwError(err))
    )
      
    ask$.subscribe();
  }

  saveFile() {
    let processUID = "p_"+this.helper.generateGuid();

    

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
          
          formData.append("meta.ownerUID", JSON.parse(localStorage.getItem('currentUser')).email);
          formData.append("processUID", processUID);
          formData.append("categ", this.configService.selectedPath);
          formData.append("autoCat", this.newSourcePop.autoCat);
              

          const upload$ = this.http.post(this.uri+"upload", formData,{
            reportProgress: true,
            observe: 'events'
          })
          .pipe(
            map(event => this.getEventMessage(event, this.file)),
            tap(message => this.showProgress(message)),
            last(),
            finalize(() => {
              
              this.modalRef?.hide();
              //EMPTY FORM
              //ADD NEW PROCESS IN STACK
              this.configService.notifications.push(
                {
                  processUID:processUID,
                  msg:"Working",
                  dataTitle: this.file.name
                }
              );
              this.datasProcess.push({
                processUID:processUID,
                percent:0,
                msg:"Your data is being indexed",
                dataTitle: this.file.name
              });
              this.reset();
              //this.toastr.info('Your data is being indexed, a message will be displayed when it is available.', 'Information');
              }
            )
          );
          upload$.subscribe();
        }
        break;
      case "free":
        //ENVOI DU CONTENU LIBRE
        const ask$ = this.http.post(this.uri+"uploadFree",{
          title:this.newSourcePop.freeTitle,
          content:this.newSourcePop.freeContent,
          ownerUID:JSON.parse(localStorage.getItem('currentUser')).email,
          categ:this.selectCateg
        }).pipe(
          map((result:any) => {
            this.modalRef?.hide();
            //EMPTY FORM
            this.reset();
            //ADD NEW PROCESS IN STACK
            this.configService.notifications.push(
              {
                processUID:processUID,
                percent:0,
                msg:"Your data is being indexed",
                dataTitle: this.file.name
              }
            );
            this.datasProcess.push({
              processUID:processUID,
              percent:0,
              msg:"Your data is being indexed",
              dataTitle: this.newSourcePop.freeTitle
            });
          }), catchError(err => throwError(err))
      )
        ask$.subscribe();
        
        
        break;
    }
    
    //this.upload();
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
  messageSave(question:string=null) {
    let message = (question?question:this.formData.get('message').value);
    const currentDate = new Date();
    this.suggestions.toggle(true)
    this.suggestions.setLabels([]);
    //
    this.configService.aiResponseContexts = [];
    this.configService.aiResponseFiles = [];
    //
    if (this.formData.valid && message) {
      // Message Push in Chat
      this.chatMessagesData.push({
        align: 'right',
        name: 'FILEMANAGER.CHAT.MESSAGE.USERNAME',
        message,
        time: currentDate.getHours() + ':' + currentDate.getMinutes()
      });
      this.onListScroll();
      // Set Form Data Reset
      this.formData = this.formBuilder.group({
        message: null
      });
      //
      this.loading = true;


      //A appliquer peut etre dans les suggestions
      let langResp = "Reply in ";
      switch (this.cookieService.get('lang')) {
        case "fr":
          langResp+="french."
          break;  
        case "en":
          langResp+="english."
          break;
      }
      
      const ask$ = this.http.post(this.uri+"askIASimilarity",{
        question:message,
        chat_history:this.chat_history,
        ownerUID:JSON.parse(localStorage.getItem('currentUser')).email,
        prompt:this.selectedPrompt.customPrompt + this.params.chat.fixedPromptParams,
        k:this.params.chat.k,
        metaUID:(this.filterOnFileUID?this.filterOnFileUID:null),
        model:this.params.model,
      }).pipe(
        map((result:any) => {this.addMessage(result)}), catchError(err => throwError(err))
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


  cleanVector() {
    //recump des chunks ids pour suppression
    alert("cleanVector");
    console.log(JSON.parse(this.pdfMetas).chunksUids);
    const ask$ = this.http.post(environment.tradBotServer+"deleteVectors",{ownerUID:this.params.chat.ownerUID,docsIds:JSON.parse(this.pdfMetas).chunksUids}).pipe(
      map((result:any) => {
        const ask2$ = this.http.post(environment.tradBotServer+"deleteDoc",{metaUID:this.curFile._id}).pipe(
          map((result:any) => {
            this.fetchDocs();
          }), catchError(err => throwError(err))
          
      )
        ask2$.subscribe();
      }), 
      catchError(err => throwError(err))
    )
    ask$.subscribe();
    
  }
  
  onSelectSuggest($event) { 
    this.messageSave($event.str);
  }
  updateSuggestions(res) {
    this.suggestions.setLabels(res.kwargs.content.split("?"));
  }

  addMessage(result) {
    
    this.chat_history.push({human:this.question,ai:result.answer});
    
    this.aiResponse = result.answer;
    this.aiQuestions = result.questions;
    let found = false;
    this.configService.aiResponseContexts = [];
    for (var reliC = 0;reliC < result.context.length;reliC++)
    {
      found = false;
      for (var reliC2 = 0;reliC2 < this.configService.aiResponseContexts.length;reliC2++)
      {
        
          if (result.context[reliC].metadata.fname == this.configService.aiResponseContexts[reliC2].metadata.fname) {
            
            found = true;
            break;
          }
      }
      if (!found) {
        
        result.context[reliC].occurs=0;

        //this.aiResponseContexts.push(result.context[reliC]);
        this.configService.aiResponseContexts.push(result.context[reliC]);
        this.configService.aiResponseFiles.push(result.context[reliC].metadata);
      }
      else {
        for (var reliC2 = 0;reliC2 < this.configService.aiResponseContexts.length;reliC2++)
          {
            
              if (result.context[reliC].metadata.fname == this.configService.aiResponseContexts[reliC2].metadata.fname) {
                //this.aiResponseContexts[reliC2].occurs+=1;
                this.configService.aiResponseContexts[reliC2].occurs+=1;
                break;
              }
          }
        
      }
    }
    //this.aiResponseContexts = result.context;

    this.configService.aiResponseContexts.push(result.context[reliC]);


    this.loading = false;

    const currentDate = new Date();
    let message :string= this.aiResponse.toString();
    this.chatMessagesData.push({
      align: 'left',
      name: 'FILEMANAGER.CHAT.MESSAGE.IANAME',
      message,
      time: currentDate.getHours() + ':' + currentDate.getMinutes()
    });
    this.onListScroll();

    //ASK FOR SUGGECTIONS QUESTIONS
    setTimeout(() => {
      this.suggestions.setLabels(this.aiQuestions);
      this.suggestions.toggle(false);  
      //APPEL SUGGESTIONS
      const ask$ = this.http.post(this.uri+"askIARagFromGivenContext",{
        context:message,
        chat_history:this.chat_history,
        ownerUID:JSON.parse(localStorage.getItem('currentUser')).email,
        prompt:this.params.customPrompt + this.params.fixedPromptParams,
        k:this.params.k,
        model:this.params.model,
        promptAddQuestions:this.params.promptAddQuestions,
        promptAddQuestionsNumber:this.params.promptAddQuestionsNumber,
      }).pipe(
        map((result:any) => {this.updateSuggestions(result)}), catchError(err => throwError(err))
    )
      ask$.subscribe();
    }, (100));
    

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

  filterOnFileUID:string;
  check(fil) {
    for (var reliF = 0;reliF < this.filesList.length;reliF++)
    {
      if (this.filesList[reliF]._id == fil._id)
      {
        this.filesList[reliF].checked = !this.filesList[reliF].checked;
        if (this.filesList[reliF].checked) {
          this.filterOnFileUID = this.filesList[reliF].uid;
        }else{
          this.filterOnFileUID = "";
        }        
      }
      else {
        this.filesList[reliF].checked = false;
      }
        
    }
    //fil.checked = (fil.checked == true?false:true);
    
  }
  



  curFile:any;
  loadingCurFile:boolean = false;

  showPreview(uri,f) {
    //LOAD FULL METAS    
    this.maintabSelected = 1;
    this.loadingCurFile = true;
    if (f._id) {
      const ask$ = this.http.post(this.uri+"getDoc",{metaUID:f._id}).pipe(
        map((result:any) => {
          this.curFile = result.ret;
          switch (this.curFile.source_type) {
            case "image/png":
              this.pdfPreviewURL = "https://medias.deepermind.ai/"+f.fname+".png";
              break;
            case "image/jpeg":
              this.pdfPreviewURL = "https://medias.deepermind.ai/"+f.fname+".jpg";
              break;
            case "file/pdf":
              this.pdfPreviewURL = "https://medias.deepermind.ai/"+f.fname+".pdf";
              break;
          }
          
          this.pdfMetas = JSON.stringify(result.ret); 
          this.loadingCurFile = false;
          this.maintabSelected = 2;
        }), 
          catchError(err => throwError(err))
      )
        
      ask$.subscribe();
    }
    else {
      this.curFile = f;
        switch (this.curFile.source_type) {
          case "image/png":
            this.pdfPreviewURL = "https://medias.deepermind.ai/"+f.fname+".png";
            break;
          case "image/jpeg":
            this.pdfPreviewURL = "https://medias.deepermind.ai/"+f.fname+".jpg";
            break;
          case "file/pdf":
            this.pdfPreviewURL = "https://medias.deepermind.ai/"+f.fname+".pdf";
            break;
        }
        
        this.pdfMetas = JSON.stringify(f); 
        this.loadingCurFile = false;
        this.maintabSelected = 2;
    }
    
    
    //return;
    
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
    this.categ = {};
    this.newSourcePop = {sourceType:"file"};
  }

  // tslint:disable-next-line: no-shadowed-variable
  close(processUID:string) {
    this.removertAlert(processUID);
  }
}



