import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    ProductFormComponent,
    FilterDialogComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductsRoutingModule,
    MaterialModule,
    SharedModule,
    
  ]
})
export class ProductsModule { }
