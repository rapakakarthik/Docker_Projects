import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-filter-v2',
  templateUrl: './filter-v2.component.html',
  styleUrl: './filter-v2.component.scss'
})
export class FilterV2Component implements OnInit, OnChanges {

  @Input() filterData: any;
  @Input() relatedCategories: any;
  @Input() categoriesNews: any;
  @Input() category_id: number = 0;
  @Input('resultsPage') showDefaultCategories: boolean = true;
  @Output() filteredCheckData: any = new EventEmitter();
  @Output() categoryChanged = new EventEmitter();
  filter: boolean = false
  panelOpenState: boolean = false;

  resp: any;
  filtered: any;
  checkbox: string[] = [];
  fillData: Array<Object> = [];
  toApi: FilterOptions[] = [];
  checkData: {name: string, id: number}[] = []

  checkboxForm: FormGroup;


  constructor(private fb: FormBuilder, private api: CrudService, private router: Router) {
    this.checkboxForm = this.fb.group({});
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.filterData) {
      this.myMethod(this.filterData);
    }
  }

  ngOnInit(): void {
    this.showAnyDept = this.showDefaultCategories;
    // if (this.filterData) {
    //   this.myMethod(this.filterData);
    // }

    this.getProductCatList(this.category_id);
  }

  logData() {
    this.fillData = [];
    //getting checked filters
    let selected: string[] = Object.keys(this.checkboxForm.value).filter(key => this.checkboxForm.value[key])
    this.filterData.filter((obj: any) => {
      if(obj.select == 'multi' || Array.isArray(obj.children)) {
        return obj.children.some((res: any) => selected.includes(res.id.toString()));
      }
    })
      .map((obj: any) => {
        this.filtered = obj.children.filter((res: any) => selected.includes(res.id.toString()));
        for (let i = 0; i < this.filtered.length; i++) {
          this.fillData.push(this.filtered[i]);
        }
      })
      // console.log(this.fillData);

    this.checkData = this.fillData.map((obj: any) => {
      return {name: obj.display_text, id: obj.id}
    })
    this.toApi = this.fillData.map((obj: any): FilterOptions => {
      return {
        name: obj.display_text,
        filter_id: obj.parent_id,
        filter_option_id: obj.id,
        filter_type: ""
      }
    })
    this.filteredCheckData.emit([this.toApi, this.checkData])
  }

  showFilters = false
  myMethod(filterData: any) {
    this.filterData = filterData.filter((dat: any) => {
      if(dat.select == 'multi'|| Array.isArray(dat.children)) {
        dat.children.forEach((res: any) => {
          this.checkboxForm.addControl(res.id, new FormControl(''));
        })
        return true;
      } else {
        this.checkboxForm.addControl(dat.children.id, new FormControl(''));
        return false;
      }
    })
    this.showFilters = true;
  }

  showAll = false;

  toggleMore(){
    this.showAll = !this.showAll;
  }
  
  getCategoryProducts(id: number) {
    this.getProductCatList(id);
  }

  productCatList!: ProductCatList;

  getProductCatList(id: number){
    this.api.getProductCat(id).subscribe({
      next: (value: any) => {
        if(value.status == 200) {
          this.productCatList = value.data;
          this.showDefaultCategories = false;
        }
      },
      error: (err) => {
        
      },
    })
  }
  
  getHeirarchy(id:number){
    this.getProductCatList(id);
    this.categoryChanged.emit(id);
  }

  // Go back to search results page 
  showAnyDept = false;
  showDefault() {
    this.showDefaultCategories = true;
    this.categoryChanged.emit(0);
  }
}


interface FilterOptions {
  name: string,
  filter_id: number,
  filter_option_id: number,
  filter_type: string
}


export interface ProductCatList {
  id: number
  name: string
  hierarchy: Hierarchy[]
  sub_categories: SubCategory[]
}

export interface Hierarchy {
  cat_id: number
  cat_name: string
}

export interface SubCategory {
  pk_id: number
  cat_name: string
}