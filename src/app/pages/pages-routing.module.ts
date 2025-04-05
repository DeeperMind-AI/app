import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { JobsComponent } from './dashboards/jobs/jobs.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { SettingsComponent } from './settings/settings.component';

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
  //{ path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  //{ path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  //{ path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  //{ path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  //{ path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  //{ path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  //{ path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  //{ path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  //{ path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  //{ path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  //{ path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  //{ path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  //{ path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  //{ path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
