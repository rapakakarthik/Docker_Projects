import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { apiObject } from '../rfq-list/rfq-list.component';

@Component({
  selector: 'app-conversation-profile',
  templateUrl: './conversation-profile.component.html',
  styleUrls: ['./conversation-profile.component.scss'],
})
export class ConversationProfileComponent implements OnInit {
  @Output() more = new EventEmitter();
  @Input() companyDetails!: any;

  
  constructor(private rfq: RfqService) {}
  ngOnInit(): void {
    this.getFrqList()
  }

  rfqlist: any;
  getFrqList() {
    let obj: apiObject = {
      limit: 10,
      skip: 0,
      order: 'Asc',
      filter: ''
    }
    this.rfq.getRfqList(obj).subscribe(res => {
      if(res.status ===200) {
        this.rfqlist = res.data
      }
    })
  }



  showMore() {
    this.more.emit();
  }
}
