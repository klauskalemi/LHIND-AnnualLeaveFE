import {SharedModule} from '../../dumb-components/shared.module';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReportsComponent} from './reports.component';
import {ReportsRoutingModule} from './reports-routing.module';

const COMPONENTS = [
  ReportsComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ReportsRoutingModule, SharedModule],
  providers: [],
})
export class ReportsModule {}
