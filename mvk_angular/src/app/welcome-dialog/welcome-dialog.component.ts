import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-dialog',
  templateUrl: './welcome-dialog.component.html',
  styleUrl: './welcome-dialog.component.scss'
})
export class WelcomeDialogComponent implements OnInit{
  constructor(
    public dialogRef: MatDialogRef<WelcomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public name: string,
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.onClose();
    }, 2000)
  }


  onClose(): void {
    this.dialogRef.close();
  }
}
