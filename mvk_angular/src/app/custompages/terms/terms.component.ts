import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {


  constructor(  public dialogRef: MatDialogRef<TermsComponent>,)
  {

  }
  ngOnInit(): void {
   
  }
  close()
  {
    this.dialogRef.close();
  }
}
