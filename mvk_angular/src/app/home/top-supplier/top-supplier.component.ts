import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-top-supplier',
  templateUrl: './top-supplier.component.html',
  styleUrls: ['./top-supplier.component.scss']
})
export class TopSupplierComponent implements OnInit {
  mfgData:any;
  loader:boolean=false;
  constructor(private curdService:CrudService) {}
  ngOnInit(): void {
   this.getDetails();
  }

  getDetails() {
    this.loader=true;
    let skip = 0;
    this.curdService.getTopRanking('manufacture', 1, skip).subscribe(res => {
    this.loader=false
    if(res.status == 200)
    {
      this.mfgData = res.data.manufactures
    }
    else{
      this.mfgData=[];
    }
  })
}


}
