import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Order } from '../orders/order';
import { retry, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private dataUri = `${environment.apiUri}/orders`;
  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    console.log("get orders called");

    return this.http.get<Order[]>(`${this.dataUri}`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  getOrderById(id: string ): Observable<Order> {
    console.log("get order by id called");
    
    return this.http.get<Order>(`${this.dataUri}/${id}`)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  postOrder(order: Order): Observable<Order> {
    console.log("post order called");
    
    return this.http.post<Order>(`${this.dataUri}`, order)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  updateOrder(id: string, order: Order): Observable<Order> {
    console.log("subscribing to update/" + id);
    
    return this.http.put<Order>(`${this.dataUri}/${id}`, order)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  deleteOrder(id: string): Observable<Order> {
    console.log("delete order called");
    return this.http.delete<Order>(`${this.dataUri}/${id}`)
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

