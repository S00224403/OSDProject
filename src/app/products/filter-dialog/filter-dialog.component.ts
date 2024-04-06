import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Category } from 'src/app/categories/category';
import { CategoryService } from 'src/app/services/category.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent {
  //form values
  categories$: Observable<Category[]>;//categories observable
  category?: string;
  productName?: string;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  quantity?: number;

  //string for filter
  filterString: string = '';

  //boolean for checking if form has input
  hasInput: boolean = false;
  constructor(public dialogRef: MatDialogRef<FilterDialogComponent>, private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();//get all categories from service
  }
  filterForm: FormGroup = new FormGroup({});
  ngOnInit(): void {
    this.filterForm = new FormGroup({
      productName: new FormControl(['']),
      category: new FormControl(['']),
      manufacturer: new FormControl(['']),
      minPrice: new FormControl([''], [Validators.pattern('[0-9]+')]),
      maxPrice: new FormControl([''], [Validators.pattern('[0-9]+')]),
      quantity: new FormControl([''], [Validators.pattern('[0-9]+')]),


    });
    // Subscribe to form value changes for each control
    this.filterForm.valueChanges.subscribe(() => {
      this.checkFormInputs();
    });
  }
  onSubmit(): void {
    console.log(this.filterForm.value);
    this.filterString = this.applyFilters(this.filterForm.value);
    this.dialogRef.close(this.filterString);
  }
  onDismiss(): void {
    this.dialogRef.close(this.filterString);
  }
  applyFilters(filterValue: any): string {
    this.productName = filterValue.productName;
    this.category = filterValue.category;
    this.manufacturer = filterValue.manufacturer;
    this.minPrice = filterValue.minPrice;
    this.maxPrice = filterValue.maxPrice;
    this.quantity = filterValue.quantity;
    let filter = '';

    //validate form values for not empty
    if (this.productName && this.productName != '') {
      filter += `productName=${this.productName}&`;
    }
    if (this.category && this.category != '') {
      filter += `category=${this.category}&`;
    }
    if (this.manufacturer && this.manufacturer != '') {
      filter += `manufacturer=${this.manufacturer}&`;
    }
    if (this.minPrice && this.minPrice != 0) {
      filter += `minPrice=${this.minPrice}&`;
    }
    if (this.maxPrice   && this.maxPrice != 0) {
      filter += `maxPrice=${this.maxPrice}&`;
    }
    if (this.quantity && this.quantity != 0) {
      filter += `quantity=${this.quantity}&`;
    }
    return filter;
  }
  checkFormInputs(): void {
    const formValues = this.filterForm.value;
    this.hasInput = Object.values(formValues).some(value => !!value);
  }
}
