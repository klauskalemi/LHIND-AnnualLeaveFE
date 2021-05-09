import {SharedModule} from '../../dumb-components/shared.module';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {LeaveRequestsComponent} from './leave-requests.component';
import {LeaveRequestsRoutingModule} from './leave-requests-routing.module';
import {LeaveRequestDialogComponent} from './dialog/leave-request-dialog.component';
import {LeaveRequestsTableComponent} from '../../dumb-components/leave-requests-table/leave-requests-table.component';
import {ReactiveFormsModule} from '@angular/forms';

const COMPONENTS = [
  LeaveRequestsComponent,
  LeaveRequestsTableComponent,
  LeaveRequestDialogComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, LeaveRequestsRoutingModule, SharedModule, ReactiveFormsModule],
  providers: [],
  exports: [LeaveRequestsTableComponent],
})
export class LeaveRequestsModule {}
