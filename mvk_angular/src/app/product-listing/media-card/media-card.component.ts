import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-media-card',
  templateUrl: './media-card.component.html',
  styleUrls: ['./media-card.component.scss']
})
export class MediaCardComponent implements OnInit{

  MediaData: any;
  length!: number;
  companyData : any
  currentIndex : number = 0;

  @Input() category_id! : number;  
  constructor(private crud: CrudService, private router: Router) {}
  ngOnInit(): void {
    this.getMedia();
    setInterval(() => {
      this.updateIndex()
    }, 6000);
  }

  goTo(route: string, id: number) {
    this.router.navigate([`/${route}/${id}`])
  }
  
  getMedia() {
    this.crud.getMediaCardV2(this.category_id).subscribe((res: any) => {
      this.MediaData = res?.data?.products;
      this.length = this.MediaData?.length-2;
      this.companyData = res?.data?.company_details;
    })
  }
  

  getObj() {
    return this.MediaData.slice(this.currentIndex, this.currentIndex + 2);
  }
  
  updateIndex() {
    if (this.currentIndex >= this.length) {
      this.currentIndex = 0;
    }
    else {
      this.currentIndex = this.currentIndex + 2 ;
    }
  }


  
  
}
