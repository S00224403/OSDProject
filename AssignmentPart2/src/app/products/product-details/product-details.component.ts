import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product';
import { ProductService } from 'src/app/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { Category } from 'src/app/categories/category';
import { CategoryService } from 'src/app/services/category.service';
import { Observable } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  id: string | any;
  product!: Product;
  message: string = "";
  showForm: boolean = false;
  imagePath: string = "../../../assets/productImages/";//path to images
  category$?: Observable<Category>;//categories observable
  role = '';
  constructor(private route: ActivatedRoute, private productService: ProductService, 
    private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar,
    private categoryService: CategoryService, public auth: AuthService) { 
      this.role = localStorage.getItem('role') || '';
    }
  ngOnInit() {
    //get product id from route
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      //get product by id from service
      this.productService.getProductById(this.id).subscribe({
        next: (value: Product) => this.product = value,
        complete: () => {
          console.log('product service finished');
          if (!this.product.productImage.includes("http")) {
            this.product.productImage = this.imagePath + this.product.productImage;
          }
          this.category$ = this.categoryService.getCategoryById(this.product.category);//get category by id from service
        },
        error: (message) => this.message = message
      });

    }
    
    
  }
  //if image load error, set image to no image found
  imageLoadError(): void {
    this.product.productImage = this.imagePath + "no-image-found.jpg";
  }
  //delete product called open confirm delete dialog
  deleteProduct() {
    this.openConfirmDeleteDialog();
  }
  openConfirmDeleteDialog(): void {
    //open confirm delete dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { title: "Delete Product " + this.product?.productName, message: "Are you sure you want to delete this product?" }
    });
    //if user confirms delete, delete product
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(this.product?._id).subscribe({
          next: (value: any) => {
            this.router.navigateByUrl('/products');
          },
          error: (message) => this.openErrorSnackBar(message)
        });
      }
    });
    

  }
  //edit product called display form component
  editProduct() {
    this.showForm = true;
  }
  //handle error messages from delete
  openErrorSnackBar(message: string): void {
    this.snackBar.open(message, 'Dismiss', {
      duration: 15000,//set duration visible in ms
      panelClass: ['error-snackbar'],
    });
  }
}

