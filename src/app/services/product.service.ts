import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private dataUri = `${environment.apiUri}/products`;
  constructor(private http: HttpClient) { }

  getProducts(filter?:string): Observable<Product[]> {
    console.log("get products called");
    const url = filter ? `${this.dataUri}?${filter}` : this.dataUri;
    return this.http.get<Product[]>(`${url}` )
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  getProductById(id: string ): Observable<Product> {
    console.log("get category by id called");
    
    return this.http.get<Product>(`${this.dataUri}/${id}`)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  postProduct(category: Product): Observable<Product> {
    console.log("post category called");
    
    return this.http.post<Product>(`${this.dataUri}`, category)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  updateProduct(id: string, category: Product): Observable<Product> {
    console.log("subscribing to update/" + id);
    
    return this.http.put<Product>(`${this.dataUri}/${id}`, category)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  deleteProduct(id: string): Observable<Product> {
    console.log("delete category called");
    return this.http.delete<Product>(`${this.dataUri}/${id}`)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  //taken from: https://angular.io/guide/http
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
