import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JobsComponent } from './dashboards/jobs/jobs.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { SettingsComponent } from './settings/settings.component';
import { HowtoComponent } from './howto/howto.component';
import { FeedbackComponent } from './feedback/feedback.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: JobsComponent
  },
  { path: 'dashboard', component: JobsComponent },
  //{ path: 'chat', component: ChatComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'filemanager', component: FilemanagerComponent },
  { path: 'howto', component: HowtoComponent },
  { path: 'feedback', component: FeedbackComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
