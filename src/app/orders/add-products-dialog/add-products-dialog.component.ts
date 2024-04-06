import { Component, Inject, Input } from '@angular/core';
import { Product } from 'src/app/products/product';
import { ProductService } from 'src/app/services/product.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterDialogComponent } from 'src/app/products/filter-dialog/filter-dialog.component';
import { Order } from '../order';

@Component({
  selector: 'app-add-products-dialog',
  templateUrl: './add-products-dialog.component.html',
  styleUrls: ['./add-products-dialog.component.css']
})
export class AddProductsDialogComponent {
  @Input() order?: Order;
  @Input() index?: number | 0;
  //form values
  products$: Observable<Product[]>; // categories observable
  productId?: string;
  quantity: number = 1;
  selectedProductId: string;

  // Additional property for price
  price?: number;

  // Property for quantity in stock
  quantityInStock: number = 0;

  // Edit product property
  editProduct: any;

  //selected product
  selectedProduct$?: Observable<Product>;
  selectedProduct?: Product;
  //boolean for checking if form has input
  hasInput: boolean = false;

  constructor(
    private productService: ProductService,
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedProductId = data.selectedProductId;
    this.order = data.order;
    // Gets all products initially
    this.products$ = this.productService.getProducts();

    this.editProduct = {};
  }


  productForm: FormGroup = new FormGroup({});
  //code from chatgpt to get products that are being edited to pop up in select box
  ngOnInit(): void {
    this.editProduct = this.order?.products.find(
      (product) => product.productId === this.selectedProductId
    );

    this.productForm = new FormGroup({
      productId: new FormControl(
        this.editProduct?.productId || '',
        Validators.required
      ),
      quantity: new FormControl(this.editProduct?.quantity || 1, [
        Validators.pattern('[0-9]+'),
        Validators.min(1),
        Validators.required,
      ]),
      // Add a disabled field for price
      price: new FormControl(this.editProduct?.price || 0, Validators.required),
    });
    this.quantity = this.editProduct?.quantity;
    this.productForm.get('price')?.disable();

    this.products$.subscribe((allProducts) => {
      if (this.order?.products != null) {
        this.products$ = of(allProducts.filter((product) => {
          if (this.selectedProductId !== product._id) {
            return !this.order?.products.some(
              (orderProduct) => orderProduct.productId === product._id
            );
          } else {
            return true;
          }
        }));
      }
    });
    this.productForm
      .get('productId')
      ?.valueChanges.subscribe((selectedProductId) => {
        if (selectedProductId) {
          this.productService
            .getProductById(selectedProductId)
            .subscribe(
              (selected) => {
                this.selectedProduct = selected;
                this.price = selected?.price || 0;
                this.quantityInStock = selected?.quantityInStock || 0;
                this.productForm.patchValue({ price: this.price });
                this.checkFormInputs();
              },
              (error) => {
                console.error(
                  `Error fetching product with ID ${selectedProductId}:`,
                  error
                );
                // Remove the line below to avoid closing the dialog on error
                // this.dialogRef.close(this.productForm.value);
              }
            );
        }
      });

    this.productForm.valueChanges.subscribe(() => {
      this.checkFormInputs();
    });
  }



  onSubmit(): void {
    console.log(this.productForm.dirty)
    const formValues = this.productForm.value;
    const selectedProductId = formValues.productId;

    // Check if the selected product is found
    if (selectedProductId) {
      // Set quantity from the form, fallback to 1 if undefined
      const quantity = formValues.quantity || 1;

      // Ensure that the order object is initialized
      if (this.order && this.order.products) {
        // Check if the product already exists in the order
        const existingProductIndex = this.order.products.findIndex(
          (product) => product.productId === selectedProductId
        );

        if (existingProductIndex !== -1) {
          // Update existing product
          this.productService.getProductById(selectedProductId).subscribe(
            (selectedProduct) => {
              if (selectedProduct) {
                if (this.order) { // Check if this.order is defined
                  this.order.products[existingProductIndex] = {
                    productId: selectedProductId,
                    quantity: quantity,
                    price: selectedProduct.price,
                  };
                  this.dialogRef.close(this.order?.products[existingProductIndex]);
                }
              }
            },
            (error) => {
              console.error(`Error fetching product with ID ${selectedProductId}:`, error);
              this.dialogRef.close(null);
            }
          );
        } else {
          // Add new product only if product ID is defined
          if (selectedProductId) {
            this.productService.getProductById(selectedProductId).subscribe(
              (selectedProduct) => {
                if (selectedProduct) {
                  const newProduct = {
                    productId: selectedProductId,
                    quantity: quantity,
                    price: selectedProduct.price,
                  };

                  this.dialogRef.close(newProduct);
                }
              },
              (error) => {
                console.error(`Error fetching product with ID ${selectedProductId}:`, error);
                this.dialogRef.close(null);
              }
            );
          } else {
            //console.error('Product ID is undefined.');
            this.dialogRef.close(null); // Handle the case where product ID is undefined
          }
        }
      } else {
        console.error('Order or products array is undefined.');
        this.dialogRef.close(null); // Handle the case where order or products array is undefined
      }
    } else {
      console.error('Product ID is undefined.');
      this.dialogRef.close(null); // Handle the case where product ID is undefined
    }
  }









  onDismiss(): void {
    console.log('Is form dirty?', this.productForm.dirty);
    
    //if to determine if the product is being edited or not and to keep product the same if not submitted
    if(this.productForm.value.productId === this.editProduct?.productId){
      this.productForm.value.quantity = this.quantity;
      this.dialogRef.close(this.productForm.value);
    }
    else if(this.productForm.value.productId !== this.editProduct?.productId && this.productForm.dirty){
      this.productForm.value.productId = this.editProduct.productId;
      this.productForm.value.quantity = this.quantity;
      
      this.dialogRef.close(this.productForm.value);
    }
    else{
      // Form is not dirty, close the dialog
      this.dialogRef.close();
    }
  }


  checkFormInputs(): void {
    const formValues = this.productForm.value;
    this.hasInput = Object.values(formValues).some((value) => !!value);
    //this.quantity = formValues.quantity;
  }
}
