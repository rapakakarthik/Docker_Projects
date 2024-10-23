import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MainCatList } from 'src/app/recommendation/recommendation.component';
import { CrudService } from 'src/app/shared/services/crud.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manufactures-tab',
  templateUrl: './manufactures-tab.component.html',
  styleUrls: ['./manufactures-tab.component.scss']
})
export class ManufacturesTabComponent implements OnInit {
  manufacturesToShow: any[] = [];
  pageLength: number = 0;
  mfgCard: CardDetails[] = [];
  mfgData: any[] = [];
  noProdFound: boolean = false
  catId!: any;
  mainCatList: MainCatList[] = [];
  CategoryList: SubCategory[] = []
  loader: boolean = false;
  //data to pass post API for companyList
  data: ListData = {
    category_id: 0,
    limit: 50,
    skip: 0
  }


  constructor(private curdService: CrudService, private changeDetectorRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getMainCategories();
    this.getManufactureCard();
  }

  getManufactureCard() {
    this.curdService.getManufactureCard().subscribe(res => {
      if (res.status == 200) {
        this.mfgCard = res.data
      }
    })
  }

  //sub categories when clicked on main category by passing the main category ID
  getAllCategories(id: number) {
    let skip = 0;
    this.curdService.getTopRanking('manufacture', 1, skip, id).subscribe(res => {
      if (res.status == 200) {
        this.CategoryList = res.sub_categories
      }
    })
  }

  //Main Category only names for displaying purpose
  getMainCategories() {
    this.curdService.getMainCategories().subscribe(res => {
      if (res.status == 200) {
        this.mainCatList = res.data
      }
    })
  }

  onTabClick(event: MatTabChangeEvent) {
    this.loader = true;

    //Filtering the id Selected 
    this.mainCatList.forEach(cat => {
      if (cat.category_name == event.tab.textLabel) {
        this.catId = cat.category_id
      }
    })

    this.getAllCategories(this.catId);

    this.data.category_id = this.catId

    //getting company list based on main category id
    this.curdService.getCompanyList(this.data).subscribe(res => {
      if (res.status == 200) {
        this.loader = false;
        this.mfgData = res.data
        this.pageLength = res.total_count
        this.manufacturesToShow = this.mfgData.slice(0, 5)
      }
    },
      err => {
        this.loader = false;
        if (err.status = 500) {
          this.mfgData = []
          this.noProdFound = true
        }
      })
  }

  //getting company list based on main category id and sub category
  subChange(cat_id: number) {
    let skip = 0;
    this.curdService.getTopRanking('manufacture', 1, skip, this.data.category_id, cat_id).subscribe(res => {
      if (res.status == 200) {
        this.mfgData = res.data.manufactures
        this.pageLength = res.total_count
        this.manufacturesToShow = this.mfgData.slice(0, 5)
      }
    })
  }

  onPageChange(event: any) {
    const start = event.pageIndex * event.pageSize
    console.log(event.pageIndex)
    this.manufacturesToShow = this.mfgData.slice(start, start + event.pageSize);
  }


}
export interface SubCategory {
  pk_id: number,
  cat_name: string
}

export interface ListData {
  category_id: number,
  limit: number,
  skip: number,
  user_id?: number
}

interface CardDetails {
  id: number,
  title: string,
  types: Array<{
    id: number,
    name: string,
    image: string
  }>
}

