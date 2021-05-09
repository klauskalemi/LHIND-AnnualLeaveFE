import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NotFoundComponent} from './dumb-components/not-found/not-found.component';
import {LayoutComponent} from './layout/layout/layout.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from './dumb-components/shared.module';
import {AppComponent} from './app.component';
import {AuthComponent} from './sites/auth/auth.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: 'auth', component: AuthComponent},
    ]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./sites/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'leave-requests',
        loadChildren: () =>
          import('./sites/leave-requests/leave-requests.module').then((m) => m.LeaveRequestsModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./sites/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./sites/reports/reports.module').then((m) => m.ReportsModule),
      },
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: '**', component: NotFoundComponent},
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
