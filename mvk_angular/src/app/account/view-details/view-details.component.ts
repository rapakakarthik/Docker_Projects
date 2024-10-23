import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.scss'],
})
export class ViewDetailsComponent implements OnInit {

  route = inject(ActivatedRoute);
  
  constructor() {}
  ngOnInit(): void {
    this.toggleNotify();
    this.openRfqList();
  }

  selectedTabIndex: number = 0;
  toggleNotify() {
    let obj = localStorage.getItem('notificationObject');
    if(obj != null) {
      let parsedobj = JSON.parse(obj);
      if (parsedobj.message_type == "RFQ") {
        this.selectedTabIndex = 1;
      } else if(parsedobj.message_type == "Enquiry") {
        this.selectedTabIndex = 0;
      }
    }
  }

  getOnlyQuotes = false;
  openRfqList() {
    this.route.queryParamMap.subscribe(params => {
      let paramString = params.get('rfq');
      switch (paramString) {
        case 'quote':
          this.selectedTabIndex = 1;
          this.getOnlyQuotes = true;
          break;
        case 'all':
          this.selectedTabIndex = 1;
        break;
        default:
          break;
      }
    })
  }
}
