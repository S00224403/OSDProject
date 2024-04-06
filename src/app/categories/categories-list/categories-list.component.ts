import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../category';
import { CategoryService } from '../../services/category.service';
import { OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent {
  categories$: Observable<Category[]>;// observable array of categories
  role = '';
  constructor(private categoryService: CategoryService, public auth: AuthService) { 
    this.categories$ = this.categoryService.getCategories();//get all categories from service
    this.role = localStorage.getItem('role') || '';
  }
  
}
