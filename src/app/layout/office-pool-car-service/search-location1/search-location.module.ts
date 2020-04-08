import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchLocationPage } from './search-location.page';
import { ComponentsModule } from "../../../core/components/components.module";

const routes: Routes = [
  {
    path: '',
    component: SearchLocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [SearchLocationPage]
})
export class SearchLocationPageModule { }