import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CategoriesModule } from './categories/categories.module';
import { SharedModule } from './shared/shared.module';
import { ProductsModule } from './products/products.module';
import { HomeComponent } from './home/home.component';
import { OrdersModule } from './orders/orders.module';
import { AuthHttpInterceptor } from '@auth0/auth0-angular';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    CategoriesModule,
    SharedModule,
    ProductsModule,
    OrdersModule,
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
          {
            uri:  `${environment.apiUri}/products/*`,
            httpMethod: 'PUT',
          },
          {
            uri:  `${environment.apiUri}/products`,
            httpMethod: 'POST',
          },
          {
            uri:  `${environment.apiUri}/products/*`,
            httpMethod: 'DELETE',
          },
          {
            uri:  `${environment.apiUri}/orders`,
            httpMethod: 'GET',
          },
          {
            uri:  `${environment.apiUri}/orders/*`,
            httpMethod: 'PUT',
          },
          {
            uri:  `${environment.apiUri}/orders/*`,
            httpMethod: 'DELETE',
          }
         ]}
      })
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
