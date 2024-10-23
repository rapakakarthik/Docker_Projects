import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss']
})
export class RecommendationCardComponent implements OnInit {
  @Input() route!: string;
  @Input() type: any;
  recomtype: any;
  routelink:any
  constructor(private router: Router) { }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');

    // console.log(this.type)

  }

  goTo(t: any) {
    // console.log(t);
    this.recomtype=t.seller_id;
    let cname = t.account_name;
    cname = encodeURIComponent(cname).toLowerCase();
    let url = cname + "-" + this.recomtype;
    
    this.routelink = '/category/topranking';
    this.router.navigate([this.route, url])
    // if (t == 'top_search') {
    //   this.routelink = '/category/topsearch'
    // } else if (t == 'most_popular') {
    //   this.routelink = '/category/mostpopular'
    // } else if (t == 'newly_added') {
    //   this.routelink = '/category/newlyadded'
    // }
   
  }

}
