import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-supplier-type',
  templateUrl: './top-supplier-type.component.html',
  styleUrls: ['./top-supplier-type.component.scss'],
})
export class TopSupplierTypeComponent implements OnInit {
  @Input() type: any;
  constructor(private router: Router) {}
  ngOnInit(): void {}

  goTo(type: string, category_id: number) {
    this.router.navigate(['category/topMan', type, category_id]);
  }
}
