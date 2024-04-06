import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../filter-dialog/filter-dialog.component';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products$: Observable<Product[]>;//products observable
  appliedFilter: string = '';
  appliedSort: string = '';
  filterSortString: string = '';
  sortSelect:string = '';
  role = '';
  constructor(private productService: ProductService, private dialog: MatDialog, public auth: AuthService) {
    this.products$ = this.productService.getProducts();//get all products from service
    this.role = localStorage.getItem('role') || '';
  }
  openFilterDialog(): void{
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.appliedFilter = '';
      console.log('The dialog was closed');
      if(result != '' && result != undefined){
        this.appliedFilter += result;
        this.filterSortString = this.appliedFilter + this.appliedSort;
        this.products$ = this.productService.getProducts(this.filterSortString);//get all products from service
      }

    });
  }
  //clear values for select and filter
  clearFilters(): void {
    this.filterSortString = '';
    this.appliedFilter = '';

    this.sortSelect = '';
    this.products$ = this.productService.getProducts();//get all products from service
  }
  //sort product method
  onChange(selectedValue: string) {
    this.appliedSort = '';
    console.log(selectedValue);
    this.sortSelect = selectedValue;
    //switch case to determine which sort to apply
    switch (this.sortSelect) {
      case 'nameAsc':
        this.appliedSort += 'sortBy=productName&sortOrder=asc&';
        break;
      case 'nameDesc':
        this.appliedSort += 'sortBy=productName&sortOrder=desc&';
        break;
      case 'priceAsc':
        this.appliedSort += 'sortBy=price&sortOrder=asc&';
        break;
      case 'priceDesc':
        this.appliedSort += 'sortBy=price&sortOrder=desc&';
        break;
      default:
        this.appliedSort += '';
        break;
        
    }
    this.filterSortString = this.appliedFilter + this.appliedSort;
    //apply filter to service
    this.products$ = this.productService.getProducts(this.filterSortString);//get all products from service
  }
}
