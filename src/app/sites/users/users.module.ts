import {SharedModule} from '../../dumb-components/shared.module';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {UsersComponent} from './users.component';
import {UsersRoutingModule} from './users-routing.module';
import {UsersTableComponent} from '../../dumb-components/users-table/users-table.component';
import {UserDialogComponent} from './dialog/user-dialog.component';

const COMPONENTS = [
  UsersComponent,
  UsersTableComponent,
  UserDialogComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, UsersRoutingModule, SharedModule],
  providers: [],
})
export class UsersModule {}
