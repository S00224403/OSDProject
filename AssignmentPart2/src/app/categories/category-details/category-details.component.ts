import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../category';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '@auth0/auth0-angular';
@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  styleUrls: ['./category-details.component.css']
})
export class CategoryDetailsComponent {
  id: string | any;
  category!: Category;
  message: string = "";
  showForm: boolean = false;
  imagePath: string = "../../../assets/categoryImages/";//path to images
  role = '';
  constructor(private route: ActivatedRoute, private categoryService: CategoryService, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar, public auth: AuthService) 
  { 
    this.role = localStorage.getItem('role') || '';
  }
  ngOnInit() {
    //get category id from route
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      //get category by id from service
      this.categoryService.getCategoryById(this.id).subscribe({
        next: (value: Category) => this.category = value,
        complete: () => {
          console.log('category service finished');
          if (!this.category.categoryImage.includes("http")) {
            this.category.categoryImage = this.imagePath + this.category.categoryImage;
          }

        },
        error: (message) => this.message = message
      });

    }

  }
  //if image load error, set image to no image found
  imageLoadError(): void {
    this.category.categoryImage = this.imagePath + "no-image-found.jpg";
  }
  //delete category called open confirm delete dialog
  deleteCategory() {
    this.openConfirmDeleteDialog();
  }
  openConfirmDeleteDialog(): void {
    //open confirm delete dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { title: "Delete Category " + this.category?.categoryName, message: "Are you sure you want to delete this category?" }
    });
    //if user confirms delete, delete category
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.deleteCategory(this.category?._id).subscribe({
          next: (value: any) => {
            this.router.navigateByUrl('/categories');
          },
          error: (message) => this.openErrorSnackBar(message)
        });
      }
    });
    

  }
  //edit category called display form component
  editCategory() {
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
