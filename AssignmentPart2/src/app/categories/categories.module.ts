import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { MaterialModule } from '../material.module';
import { CategoryFormComponent } from './category-form/category-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment';

@NgModule({
  declarations: [
    CategoriesListComponent,
    CategoryDetailsComponent,
    CategoryFormComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CategoriesRoutingModule,
    MaterialModule,
    AuthModule.forRoot({...environment.auth0,
      httpInterceptor: {
        allowedList: [
          {
            uri:  `${environment.apiUri}/categories/*`,
            httpMethod: 'PUT',
          },
          {
            uri:  `${environment.apiUri}/categories`,
            httpMethod: 'POST',
          },
          {
            uri:  `${environment.apiUri}/categories/*`,
            httpMethod: 'DELETE',
          },
          
         ]}
      })
    ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    ]
})
export class CategoriesModule { }
