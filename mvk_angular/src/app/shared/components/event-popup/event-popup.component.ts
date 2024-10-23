import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-popup',
  templateUrl: './event-popup.component.html',
  styleUrls: ['./event-popup.component.scss']
})
export class EventPopupComponent implements OnInit{

  closeTime: number = 0;
  readonly milliSeconds = 1000;
  
  constructor(
    public dialogRef: MatDialogRef<EventPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.closeTime = this.data.show_event_view_count * this.milliSeconds;
    // console.log(this.data);

    setTimeout(() => {
      this.closeDialog();
    }, this.closeTime)
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
}
