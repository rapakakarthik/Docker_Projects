import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupsigninformComponent } from 'src/app/authentication/signin/popupsigninform/popupsigninform.component';
import { RfqInfoComponent } from 'src/app/shared/components/rfq-info/rfq-info.component';
import { RfqComponent } from 'src/app/shared/components/rfq/rfq.component';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RfqService } from 'src/app/shared/services/rfq.service';

@Component({
  selector: 'app-quotebanner',
  templateUrl: './quotebanner.component.html',
  styleUrls: ['./quotebanner.component.scss'],
})
export class QuotebannerComponent implements OnInit {
  data!: Data;
  units: any;
  form!: FormGroup;
  loader: boolean = true;
  dialogRef: any;

  constructor(
    private api: CrudService,
    private rfqService: RfqService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getAnalytics();
    this.getAllDoprdowns();
    this.setForm();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PopupsigninformComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  setForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      units: ['', Validators.required],
    });
  }

  onSubmit(formData: any) {
    const buyerContactData = formData.value;
    const dialogRef = this.dialog.open(RfqComponent, {
      width: '450px',
      data: buyerContactData
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  getAllDoprdowns() {
    this.rfqService.getAlldropdownData('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;
        this.units = res.units;
      }
    });
  }

  getAnalytics() {
    this.loader = true;
    this.api.getHomeAnalytics().subscribe({
      next: (res) => {
        if (res.status == 200) {
          this.data = res.data;
          this.loader = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.loader = false;
        console.error("quote Banner error", err.message)
      }
    });
  }

  learnMore() {
    if (!localStorage.getItem('token')) {
      this.openDialog();
    } else {
      this.dialogRef = this.dialog.open(RfqInfoComponent, {
        width: '1050px',
        data: this.data,
      });

      this.dialogRef.afterClosed().subscribe((_result: any) => {
        console.log('The dialog was closed');
      });
    }
  }
}

interface Data {
  rfqs: number;
  avg_response_time: string;
  active_suppliers: number;
  industries: number;
}
