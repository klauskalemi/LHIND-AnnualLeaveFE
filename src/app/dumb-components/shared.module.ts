import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MAT_MODULES} from './material-libs.module';
import {NotFoundComponent} from './not-found/not-found.component';
import {FormsModule} from '@angular/forms';
import {RolePipe} from "../domain/pipes/role.pipe";

export const MAT_MODULES_DEPENDENCIES = [
  FlexLayoutModule,
  OverlayModule,
];

const COMPONENTS = [
  NotFoundComponent,
];

const PIPES = [
  RolePipe,
];

@NgModule({
  declarations: [...COMPONENTS, ...PIPES],
  imports: [
    CommonModule,
    FormsModule,
    ...MAT_MODULES,
    ...MAT_MODULES_DEPENDENCIES,
  ],
  exports: [
    FormsModule,
    ...MAT_MODULES,
    ...MAT_MODULES_DEPENDENCIES,
    ...COMPONENTS,
    ...PIPES,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
