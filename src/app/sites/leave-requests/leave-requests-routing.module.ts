import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LeaveRequestsComponent} from './leave-requests.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveRequestsComponent,
  },
  {
    path: 'home',
    loadChildren: () => import('./leave-requests.module').then((m) => m.LeaveRequestsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LeaveRequestsRoutingModule {
}
