import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { AdminGuard } from '../admin.guard';
const routes: Routes = [
  {path: "categories", component: CategoriesListComponent, canActivate: [AdminGuard]},
  {path: "categories/form", component: CategoryFormComponent, canActivate: [AdminGuard]},
  {path: "categories/:id", component: CategoryDetailsComponent, canActivate: [AdminGuard]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
