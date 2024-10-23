import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<PrivacyComponent>) {}
  ngOnInit(): void {}
  close() {
    this.dialogRef.close();
  }
}
