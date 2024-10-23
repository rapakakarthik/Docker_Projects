import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-company-video',
  templateUrl: './company-video.component.html',
  styleUrls: ['./company-video.component.scss']
})
export class CompanyVideoComponent {

  constructor(public dialog: MatDialog){
    
  }

  @ViewChild('videoModal')
  videoModal!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any, any>;
  openVideo(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = '';
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogRef = this.dialog.open(this.videoModal, dialogConfig);

    this.dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
