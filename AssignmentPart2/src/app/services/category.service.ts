import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Category } from '../categories/category';
import { retry, catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private dataUri = `${environment.apiUri}/categories`;
  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    console.log("get categories called");

    return this.http.get<Category[]>(`${this.dataUri}`)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  getCategoryById(id: string ): Observable<Category> {
    console.log("get category by id called");
    
    return this.http.get<Category>(`${this.dataUri}/${id}`)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  postCategory(category: Category): Observable<Category> {
    console.log("post category called");
    
    return this.http.post<Category>(`${this.dataUri}`, category)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  updateCategory(id: string, category: Category): Observable<Category> {
    console.log("subscribing to update/" + id);
    
    return this.http.put<Category>(`${this.dataUri}/${id}`, category)
    .pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  deleteCategory(id: string): Observable<Category> {
    console.log("delete category called");
    return this.http.delete<Category>(`${this.dataUri}/${id}`)
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

