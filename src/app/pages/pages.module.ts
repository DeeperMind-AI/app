import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { SimplebarAngularModule } from 'simplebar-angular';
import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';

import { FilemanagerComponent } from './filemanager/filemanager.component';
import { SettingsComponent } from './settings/settings.component';
import { MarkdownModule } from 'ngx-markdown';

import { TranslateModule } from '@ngx-translate/core';
import { FileTextFilter } from './filemanager/pipes/fileTextFilter';
import { SuggestionsComponent } from './filemanager/components/suggestions/suggestions.component';
import { LeftlistitemComponent } from './filemanager/components/leftlistitem/leftlistitem/leftlistitem.component';
import { LeftlistitemheaderComponent } from './filemanager/components/leftlistitem/leftlistitemheader/leftlistitemheader.component';
import { CategListPathFilter } from './filemanager/pipes/categListPathFilter';
import { HowtoComponent } from './howto/howto.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FeedbackComponent } from './feedback/feedback.component';
import { ContextFilter } from './filemanager/pipes/contextesFilter';
import {CdkDrag,CdkDropList, DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [FilemanagerComponent, SettingsComponent, SuggestionsComponent, LeftlistitemComponent, LeftlistitemheaderComponent, HowtoComponent, FeedbackComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FileTextFilter,
    CdkDrag,
    CdkDropList,
    DragDropModule,
    CategListPathFilter,
    ContextFilter,
    MarkdownModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    ReactiveFormsModule,
    DashboardsModule,
    UIModule,
    WidgetModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SimplebarAngularModule,
  ],
})
export class PagesModule { }
