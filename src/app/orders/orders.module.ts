import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { MaterialModule } from '../material.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderFormComponent } from './order-form/order-form.component';
import { AddProductsDialogComponent } from './add-products-dialog/add-products-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    OrderListComponent,
    OrderDetailsComponent,
    OrderFormComponent,
    AddProductsDialogComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    OrdersRoutingModule,
    MaterialModule,
    
  ]
})
export class OrdersModule { }
