import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminGuard } from '../admin.guard';

const routes: Routes = [
  {path: 'products', component: ProductListComponent},
  {path: 'products/form', component: ProductFormComponent, canActivate : [AdminGuard]},
  {path: 'products/:id', component: ProductDetailsComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
