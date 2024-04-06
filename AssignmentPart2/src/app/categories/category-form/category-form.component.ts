import { CategoryService } from 'src/app/services/category.service';
import { Category } from '../category';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent {
  @Input() category?: Category;
  constructor(private categoryService: CategoryService, private router: Router) { }
  categoryForm: FormGroup = new FormGroup({});

  ngOnInit(): void {
    //create form group with validation
    this.categoryForm = new FormGroup({
      categoryName: new FormControl(this.category?.categoryName, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      description: new FormControl(this.category?.description, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
      categoryImage: new FormControl( this.category?.categoryImage, [Validators.maxLength(500)])
    });
    if(this.categoryForm.value.categoryImage == "../../../assets/categoryImages/no-image-found.jpg" ){
      this.categoryForm.value.categoryImage = "";
      this.categoryForm.controls['categoryImage'].setValue("");
    }
  }
  
  onSubmit() {
    console.log('forms submitted with ')
    console.log(this.categoryForm.value);
    //if no image set to empty string for api validation
    if(this.categoryForm.value.categoryImage == null ){
      this.categoryForm.value.categoryImage = "";
    }
    //if category exists update, else add new category
    if (this.category) {
      this.updateCategory(this.category._id, this.categoryForm.value);
      window.location.reload();
    } else {
      this.addNewCategory(this.categoryForm.value);
    }
  }
  //add new category
  addNewCategory(newCategory: Category): void {
    console.log("adding new category" + JSON.stringify(newCategory));
    this.categoryService.postCategory(newCategory).subscribe({
      next: category => {
        this.router.navigateByUrl('/categories/' + category._id);
      },
      error: (err) => console.log(err)
    });
  }
  //update category
  updateCategory(id: string, category: Category): void {
    
    console.log("updating contact" + JSON.stringify(category));
    this.categoryService.updateCategory(id, category).subscribe({
      next: category => {
        this.router.navigateByUrl('/categories/' + category._id);
        
      },
      error: (err) => console.log(err)
    });
  }
}
