import { OrderService } from 'src/app/services/order.service';
import { Order } from '../order';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddProductsDialogComponent } from '../add-products-dialog/add-products-dialog.component';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/products/product';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent {
  @Input() order?: Order;
  productNames: string[] = [];
  product$?: Observable<Product>
  cols: number = 1;//number of columns for grid list

  constructor(private orderService: OrderService, private router: Router,
    private dialog: MatDialog, private productService: ProductService, private fb: FormBuilder, private breakpointObserver: BreakpointObserver, public auth: AuthService) {

  }
  orderForm: FormGroup = new FormGroup({});
  
  ngOnInit(): void {
    // Create products FormArray
    const productsFormArray = this.fb.array([], [Validators.minLength(1), Validators.required]);
  
    // Initialize the products FormArray with existing products if any
    if (this.order?.products) {
      const productControls = this.order.products.map(product => this.createProductFormGroup(product));
      productsFormArray.clear(); // Clear existing controls (if any)
  
      // Use push method to add new controls
      productControls.forEach(control => {
        (productsFormArray as FormArray).push(control);
      });
    }
  
    // Create form group with validation
    this.orderForm = this.fb.group({
      name: [this.order?.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: [this.order?.email, [Validators.required, Validators.email]],
      phone: [this.order?.phone, [Validators.required, Validators.pattern('^[0][8][35679][0-9]{7}$')]],
      address: this.fb.group({
        addressLine: [this.order?.address?.addressLine, [Validators.required, Validators.min(8), Validators.max(50)]],
        town: [this.order?.address?.town, [Validators.required, Validators.min(2), Validators.max(50)]],
        county: [this.order?.address?.county, [Validators.required, Validators.min(4), Validators.max(50)]],
        zip: [this.order?.address?.zip, [Validators.required, Validators.pattern(/^[A-Z][0-9]{2} [A-Z0-9]{4}$/)]],
      }),
      orderDate: [this.order?.orderDate ? new Date(this.order.orderDate) : new Date(), [Validators.required]],
      products: productsFormArray,
    });
  
    console.log(this.orderForm.value);
  
    this.getProductNames();
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
        this.cols = 2;
      }
      if (result.breakpoints[Breakpoints.Medium]) {
        this.cols = 3;
      }
      if (result.breakpoints[Breakpoints.Large]) {
        this.cols = 4;
      }
      if (result.breakpoints[Breakpoints.XLarge]) {
        this.cols = 5; // Adjust the number of columns for XL screens
      }
    });
  }
  
  // Getter for easy access to the products FormArray
get productsFormArray() {
  return this.orderForm.get('products') as FormArray;
}
createProductFormGroup(product: any): FormGroup {
  return this.fb.group({
    productId: [product.productId],
    quantity: [product.quantity, [Validators.required]],
    price: [product.price, [Validators.required]],
  });
}
  // Code from chatgpt due to issues with product name array
  getProductNames(): void {
    if (this.orderForm.value.products) {
      const productObservables: Observable<string>[] = this.orderForm.value.products.map((orderProduct: { productId: string; }) => {
        if (orderProduct.productId) {
          return this.productService.getProductById(orderProduct.productId).pipe(
            map(product => {
              if (product && product.productName) {
                return product.productName;
              } else {
                console.error(`Product with ID ${orderProduct.productId} does not have a valid productName.`);
                return ''; // Returning an empty string as a placeholder
              }
            }),
            catchError(error => {
              console.error(`Error fetching product with ID ${orderProduct.productId}:`, error);
              return of('');
            })
          );
        } else {
          console.error('Product ID is undefined for an order product:', orderProduct);
          return of('');
        }
      });
  
      forkJoin(productObservables).subscribe(productNames => {
        console.log('Product Names:', productNames); // Log the product names
        this.productNames = productNames;
      }, error => {
        console.error('Error in forkJoin:', error);
      });
    }
  }
  
  
  
  // code with adjustments from chat gpt to help with error
  openFilterDialog(index: number): void {
    let id;
    if (index !== -1) {
      id = this.orderForm.value.products[index]?.productId; // Use optional chaining to avoid issues if products[index] is undefined
    } else {
      id = null;
    }
  
    const dialogRef = this.dialog.open(AddProductsDialogComponent, {
      width: '80%',
      data: { selectedProductId: id, order: this.orderForm.value }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
  
      if (result !== false) {
        const products = this.orderForm.get('products') as FormArray;
  
        if (index !== -1) {
          // Update the existing product
          const existingProduct = products.at(index) as FormGroup;
          existingProduct.patchValue({ ...result, productId: result?.productId }); // Use optional chaining
        } else {
          // Add the new product
          const newProductFormGroup = this.createProductFormGroup(result);
          products.push(newProductFormGroup);
        }
        console.log(this.orderForm.value.products);
        // Call getProductNames inside the subscribe block
        this.getProductNames();
      }
    });
  }
  
  
  
  
  removeProduct(index: number): void {
    const products = this.orderForm.get('products') as FormArray;
    products.removeAt(index);
    // Call getProductNames inside the subscribe block
    this.getProductNames();
  }
  
  onSubmit() {
    console.log('Form submitted with:');
    console.log(this.orderForm.value);
  
    const currentProducts = this.orderForm.get('products')?.value || [];
  
    const validProducts = currentProducts.map((product: any) => ({
      productId: product.productId,
      quantity: product.quantity || 0,
      price: product.price || 0,
    }));
  
    // Update the order with the modified products directly
    this.orderForm.patchValue({ products: validProducts });
  
    if (this.order) {
      this.updateOrder(this.order._id, this.orderForm.value);
    } else {
      this.addNewOrder(this.orderForm.value);
    }
  }
  
  
  
  //add new order
  addNewOrder(newOrder: Order): void {
    console.log("adding new order" + JSON.stringify(newOrder));
    this.orderService.postOrder(newOrder).subscribe({
      next: order => {
        this.router.navigateByUrl('/orders/' + order._id);
      },
      error: (err) => console.log(err)
    });
  }
  //update order
  updateOrder(id: string, order: Order): void {

    console.log("updating order" + JSON.stringify(order));
    this.orderService.updateOrder(id, order).subscribe({
      next: order => {
        this.router.navigateByUrl('/orders/' + order._id);
        document.location.reload();
      },
      error: (err) => console.log(err)
    });
  }
  //return to order page
  return(){
    window.location.reload();
  }
}

