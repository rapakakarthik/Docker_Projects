import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  @Input() categoriesList?: any;
  @Input() categoriesnew?: any;
  categories: any;
  showChildren: boolean = false;

  showInput: boolean = false; // Initial value, input field is hidden by default
  otherValue: string = '';
  showOthers: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CategoryComponent>
  ) {}
  ngOnInit(): void {
    if (this.categoriesnew == undefined) {
      this.showOthers = true;
      this.categories = this.categoriesList;
      if (!this.categories.show) {
        this.categories = this.categories.map((obj: any) => {
          return { ...obj, show: false };
        });
      }
    } else {
      this.showOthers = false;
      // this.categories = Object.values(this.categoriesnew);
      this.categories = this.categoriesnew;
      this.categories = this.categories.map((obj: any) => {
        return { ...obj, show: false };
      });
    }
  }

  addCategory = () => {
    const obj = {
      type: 'others',
      value: this.otherValue
    }
    this.dialogRef.close(obj);
  }
  
  // text = new FormControl('', [Validators.required]);
  onNoClick = () => this.dialogRef.close();
  selectlist = (c: any) => this.dialogRef.close(c);
  onCategoryClick = (category: any) => category.show = !category.show;
}
