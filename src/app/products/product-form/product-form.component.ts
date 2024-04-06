import { ProductService } from 'src/app/services/product.service';
import { Product } from '../product';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Category } from 'src/app/categories/category';
import { CategoryService } from 'src/app/services/category.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent {
  @Input() product?: Product;
  categories$: Observable<Category[]>;//categories observable
  constructor(private productService: ProductService, private router: Router, private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getCategories();//get all categories from service
   }
  productForm: FormGroup = new FormGroup({});
  
  ngOnInit(): void {
    //create form group with validation
    this.productForm = new FormGroup({
      productName: new FormControl(this.product?.productName, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      description: new FormControl(this.product?.description, [Validators.required, Validators.minLength(2), Validators.maxLength(500)]),
      price: new FormControl(this.product?.price, [Validators.required, Validators.min(0.01), Validators.pattern('^[0-9]*(\\.?[0-9]{0,2}$)')]),
      quantityInStock: new FormControl(this.product?.quantityInStock, [Validators.required, Validators.min(0),Validators.pattern('[0-9]+')]),
      manufacturer: new FormControl(this.product?.manufacturer, [Validators.maxLength(50)]),
      productImage: new FormControl(this.product?.productImage, [Validators.maxLength(500)]),
      category: new FormControl(this.product?.category, [Validators.required]),
    });
    if(this.productForm.value.productImage == "../../../assets/productImages/no-image-found.jpg" ){
      this.productForm.value.productImage = "";
      this.productForm.controls['productImage'].setValue("");
    }
  }
  
  onSubmit() {
    console.log('forms submitted with ')
    console.log(this.productForm.value);
    //if no image set to empty string for api validation
    if(this.productForm.value.productImage == null ){
      this.productForm.value.productImage = "";
    }
    //if manufacturer is null set to empty string for api validation
    if(this.productForm.value.manufacturer == null ){
      this.productForm.value.manufacturer = "";
    }
    //if product exists update, else add new product
    if (this.product) {
      this.updateProduct(this.product._id, this.productForm.value);
      window.location.reload();
    } else {
      this.addNewProduct(this.productForm.value);
    }
  }
  //add new product
  addNewProduct(newProduct: Product): void {
    console.log("adding new product" + JSON.stringify(newProduct));
    this.productService.postProduct(newProduct).subscribe({
      next: product => {
        this.router.navigateByUrl('/products/' + product._id);
      },
      error: (err) => console.log(err)
    });
  }
  //update product
  updateProduct(id: string, product: Product): void {
    
    console.log("updating contact" + JSON.stringify(product));
    this.productService.updateProduct(id, product).subscribe({
      next: product => {
        this.router.navigateByUrl('/products/' + product._id);
        
      },
      error: (err) => console.log(err)
    });
  }
  //return to product details
  return(){
    window.location.reload();
  }
}

