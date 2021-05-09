import {SharedModule} from '../../dumb-components/shared.module';
import {CommonModule} from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {NgModule} from '@angular/core';
import {LeaveRequestsModule} from '../leave-requests/leave-requests.module';

const COMPONENTS = [
  DashboardComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, DashboardRoutingModule, SharedModule, LeaveRequestsModule],
  providers: [],
})
export class DashboardModule {}
