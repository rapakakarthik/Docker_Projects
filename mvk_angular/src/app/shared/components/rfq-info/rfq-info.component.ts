import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rfq-info',
  templateUrl: './rfq-info.component.html',
  styleUrls: ['./rfq-info.component.scss'],
})
export class RfqInfoComponent implements OnInit{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit(): void {
  }
}
