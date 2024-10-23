import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit{
  form!: FormGroup
  constructor(private auth: AuthenticationService, private fb: FormBuilder, private toaster: ToastrService ) {}
  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.form = this.fb.group({
      phone: [''],
      phone_otp: [''],
      reason: ['']
    })
  }

  buyerAccountDelete(obj: any) {
    // console.log(obj.value)
    this.auth.buyerAccountDelete(obj.value).subscribe(res => {
      if(res.status ===400)
      {
        this.toaster.error(res.message);
        
      }
      if(res.status ===500)
      {
        this.toaster.error(res.message);
        
      }
      if(res.status === 200) {
        this.form.reset();
        this.toaster.success(res.message);
        console.log(res.message)
      }
    })
  }
  sendOtp(obj: any) {
    console.log(obj.value)
    // this.auth.sendOtpToDelete(obj.value.phone).subscribe(res => {
    //   if(res.status === 200) {
    //     this.toaster.success(res.message);
    //     console.log("deleted successfully")
    //   }
    //   if(res.status ===400)
    //   {
    //     this.toaster.error(res.message);
        
    //   }
    // })
  }

}
