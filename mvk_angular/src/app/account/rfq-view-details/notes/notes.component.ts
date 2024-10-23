import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service';


export type Note = {
  quote_id: number,
  note: string
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit{
  note: string = '';
  quoteId: number = 0;
  isEmpty: boolean = true;
  constructor(
    private rfq: RfqService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public noteData: Note,
    public dialogRef: MatDialogRef<NotesComponent>
  ) {}
  ngOnInit(): void {
    this.note = this.noteData.note;
    this.quoteId = this.noteData.quote_id;
  }
  

  addNotes() {
    const noteData: Note = {
      quote_id: this.quoteId,
      note: this.note
    };
    this.rfq.addNotes(noteData).subscribe({
      next: (value: any) => {
        if(value.status === 200) {
          this.toastr.success(value.message);
          this.note = value.note_details.note;
          this.dialogRef.close();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error("add notes error: " + error.message);
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
