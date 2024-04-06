import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../products/product';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

import { Observable } from 'rxjs';
import { Order } from 'src/app/orders/order';
import { OrderService } from 'src/app/services/order.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {
  id: string | any;
  products$?: Observable<Product[]>;
  message: string = "";
  showForm: boolean = false;
  order!: Order;
  productName: string = "";
  product!: Product;
  totalPrice: number = 0;
  productNames: string[] = [];
  productDetailsVisibility: boolean[] = [];
  role!: string;
  cols: number = 1;//number of columns for grid list
  constructor(private route: ActivatedRoute, private productService: ProductService, 
    private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar,
    private orderService: OrderService, private breakpointObserver: BreakpointObserver) { 
      this.role = localStorage.getItem('role') || '';
      //get order id from route
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      //get order by id from service
      this.orderService.getOrderById(this.id).subscribe({
        next: (value: Order) => this.order = value,
        complete: () => {
          console.log('order service finished');
          this.order.products.forEach(product => {
            this.totalPrice += product.price * product.quantity;
          });
          //get product names from service and push to array of product names for displaying
          this.order.products.forEach(product => {
            let productName: string = "";
            this.productService.getProductById(product.productId).subscribe({
              next: (value: Product) => {
                productName = value.productName;
                this.productNames.push(productName);
              },
              complete: () => {
                console.log('product service finished');
              },
              error: (message) => this.message = message
            });
          });
        },
        error: (message) => this.message = message
      });
      
    }
      
    }
  ngOnInit() {
    
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.cols = 1;
      }
      if (result.breakpoints[Breakpoints.Small]) {
        this.cols = 1;
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 2;
      }
      if (result.breakpoints[Breakpoints.Large]) {
        this.cols = 2;
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 2; // Adjust the number of columns for XL screens
      }
    });
    
  }
  // Method to toggle visibility for a specific product
  toggleProductDetails(index: number): void {
    this.productDetailsVisibility[index] = !this.productDetailsVisibility[index];
  } 
  //delete order called open confirm delete dialog
  deleteOrder() {
    this.openConfirmDeleteDialog();
  }
  openConfirmDeleteDialog(): void {
    //open confirm delete dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { title: "Delete Order " + this.order?.name, message: "Are you sure you want to delete this order?" }
    });
    //if user confirms delete, delete order
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.orderService.deleteOrder(this.order?._id).subscribe({
          next: (value: any) => {
            this.router.navigateByUrl('/orders');
          },
          error: (message) => this.openErrorSnackBar(message)
        });
      }
    });
    

  }
  //edit product called display form component
  editOrder() {
    this.showForm = true;
  }
  //handle error messages from delete
  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,//set duration visible in ms
      panelClass: ['error-snackbar'],
    });
  }
  getProductName(id: string): void {
    
  }
  
}

