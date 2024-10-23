import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CrudService } from 'src/app/shared/services/crud.service';
import { ContactInfoComponent } from '../contact-info/contact-info.component';
import { CompanyInfoComponent } from '../company-info/company-info.component';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { SourcingInfoComponent } from '../sourcing-info/sourcing-info.component';
import { AddressInfoComponent } from '../address-info/address-info.component';
import { StatutoryComponent } from '../statutory/statutory.component';
import { IntelletualComponent } from '../intelletual/intelletual.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { RfqService } from 'src/app/shared/services/rfq.service'

@Component({
  selector: 'app-account-profile-v3',
  templateUrl: './account-profile-v3.component.html',
  styleUrl: './account-profile-v3.component.scss'
})
export class AccountProfileV3Component implements OnInit{

  buyerProfileDetails: any;
  dialogRef!: MatDialogRef<any>;
  userObj: any;

  user: any;
  contact: any;
  company: any;
  sourcing: any;
  address: any;
  statutory: any;
  intellectual: any;
  dropdowns: any;
  departments: any;
  divisionType: any;

  constructor(private crud: CrudService, private dialog: MatDialog,private toastr: ToastrService, private rfq: RfqService) {}
  ngOnInit(): void {
    this.getUserDetails();
    // this.getBuyerProfileDetails();
  }

  userDet: any;
  userAddress: any;
  serverDown: boolean = false;
  getUserDetails() {
    const token = localStorage.getItem('token') ?? "";
    this.rfq.getUserDetails(token).subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.user = value.data;
          this.userAddress = value.data.user_address
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          this.serverDown = true;
        }
        this.toastr.error(err.error.message)
        console.error(err.message, err.error);
      }
    })
  }

  selectedFile!: File;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.updateUserPic(this.selectedFile);
  }
  
  // Image preview function
  prepareImageForUpload(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }
  
  updateUserPic(image: File) {
    let obj = new FormData();
    obj.append('avatar', image);
    this.rfq.updateUserPic(obj).subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.user.mob_user_avatar = value.fileUrl
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err.message, err.error);
      }
    })
  }

  // Getting Buyer Profile Details Not using
  getBuyerProfileDetails() {
    if (localStorage.getItem('userObj')) {
      this.userObj = JSON.parse(localStorage.getItem('userObj') || '{}');
    }
    this.crud.getBuyerProfileDetails(this.userObj.buyerId).subscribe({
      next: (res: any) => {
        if(res.status == 200) {
          this.user = res.user
          this.contact = res.contact
          this.company = res.company
          this.sourcing = res.sourcing
          this.address = res.address
          this.statutory = res.statutory
          this.intellectual = res.intellectual;
          this.getBuyerUpdateProfileDropdown();
        } else {
          console.log(res)
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          this.serverDown = true;
        }
        this.toastr.error(err.error.message)
      }
      // complete: () => {
      //   console.info("Request completed")
      // }
    })
  }
  
  department: string = '';
  division: string = '';
  getBuyerUpdateProfileDropdown() {
    this.crud.getBuyerUpdateProfileDropdown().subscribe((res) => {
      if (res.status === 200) {
        this.dropdowns = res.dropdowns;
        this.departments = this.dropdowns.departments;
        this.divisionType = this.dropdowns.divisions;
        if(this.user) {
          this.department = this.departments[this.user.user_department];
          this.division = this.divisionType[this.user.user_division_type];
          }
      }
    });
  }

  getMobDesignation(): any {
    return [{"id":1,"name":"Teacher"},{"id":2,"name":"Principal"}, {"id":3,"name":"School Owner"}].find((el) => el.id == this.user.mob_user_designation)?.name;
  }

  // Edit Button Components
  editBasicDetails() {
    this.dialogRef = this.dialog.open(BasicDetailsComponent, {
      width: '1000px',
      data: {user: this.user, company: this.company}
    });
    this.dialogRef.afterClosed().subscribe(() => this.getUserDetails());
  }

  editContact() {
    this.dialogRef = this.dialog.open(ContactInfoComponent, {
      width: '1000px',
      data: this.user
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getUserDetails()
    });
  }


  // Not using below methods

  editAddress() {
    this.dialogRef = this.dialog.open(AddressInfoComponent, {
      width: '1000px',
      data: this.address
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getBuyerProfileDetails()
    });
  }

  editStatutory() {
    this.dialogRef = this.dialog.open(StatutoryComponent, {
      width: '1000px',
      data: this.statutory
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getBuyerProfileDetails()
    });
  }

  editIntellictual() {
    this.dialogRef = this.dialog.open(IntelletualComponent, {
      width: '1000px',
      data: this.intellectual
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getBuyerProfileDetails()
    });
  }

  editCompany() {
    this.dialogRef = this.dialog.open(CompanyInfoComponent, {
      width: '1000px',
      data: this.company
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getBuyerProfileDetails()
    });
  }

  editSourcingInfo() {
    
    this.dialogRef = this.dialog.open(SourcingInfoComponent, {
      width: '1000px',
      data: this.sourcing
    });
    this.dialogRef.afterClosed().subscribe((_result: any) => {
      this.getBuyerProfileDetails()
    });
  }

}

