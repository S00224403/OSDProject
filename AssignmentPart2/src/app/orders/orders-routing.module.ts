import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminGuard } from '../admin.guard';

const routes: Routes = [
  { path: 'orders', component: OrderListComponent, canActivate: [AdminGuard] },
  { path: 'orders/form', component: OrderFormComponent },
  { path: 'orders/:id', component: OrderDetailsComponent, canActivate: [AdminGuard] },
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
