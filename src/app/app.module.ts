import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './layout/header/header.component';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './dumb-components/shared.module';
import {LayoutComponent} from './layout/layout/layout.component';
import {SideNavbarComponent} from './layout/side-navbar/side-navbar.component';
import {AuthComponent} from './sites/auth/auth.component';
import {ChangePasswordDialogComponent} from './dumb-components/change-password-dialog/change-password-dialog.component';
import {HttpClientModule} from '@angular/common/http';

const COMPONENTS = [
  AppComponent,
  AuthComponent,
  LayoutComponent,
  SideNavbarComponent,
  HeaderComponent,
  ChangePasswordDialogComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
