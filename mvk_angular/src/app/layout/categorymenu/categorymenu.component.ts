import { Component, HostListener, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-categorymenu',
  templateUrl: './categorymenu.component.html',
  styleUrls: ['./categorymenu.component.scss']
})
export class CategorymenuComponent implements OnInit {
menulist:any;
clsName:any;
  constructor(private curdService: CrudService, private toastr: ToastrService) { }


  ngOnInit(): void {
 this.getMenuDetails();
  }

  

  menuExpanded = false;

  toggleMenu() {
    setTimeout(() => {
      this.menuExpanded = !this.menuExpanded;
    }, 0);
  }

  @HostListener('window:click', ['$event'])
  listenToOutsideClick() {
    const target = event!.target as HTMLElement;
    const isToggler = target.getAttribute('id') === 'navbarDropdown'
    if (!this.menuExpanded || isToggler) {
      return;
    }

    this.menuExpanded = false;
  }




  getMenuDetails() {
    
      this.curdService.getMenu().subscribe(res => {
      
      this.menulist=res.data;
      })
   
  }

  getMainClass(mlist:any)
  {

    let l2wl3 = mlist.with_l3.length;
    let l2woutl3= mlist.without_l3.length; 
    


    if(l2wl3 <= 2)  // 1 or 2
      {
        return 'flex25'
      }
    else if(l2wl3 <= 4)
      {
        return 'flex50'
      }
    else if(l2wl3 <= 6)
    {
      return 'flex75'
    } else if(l2wl3 > 6)
    {
      return 'flex100'
    }
    else
    {
      return 'noflex'
    }



  }


  getClass(item: any) {
if(item && item.length >0  && item.length < 9)
{
    return 'flex' + item.length
}
else if( item && item.length > 8)
{
  return 'flex9'
}
else
{
  return '';
}
    // if (item.status === 'success' && item.value > 5) {
    //   return 'success';
    // } else if (item.status === 'warning' || (item.status === 'success' && item.value <= 5)) {
    //   return 'warning';
    // } else {
    //   return 'error';
    // }
  }


}

// Not Using