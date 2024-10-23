import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.scss']
})
export class TextBoxComponent implements OnInit {


  @Output() next = new EventEmitter()
  @Input() type: string = ''
  @Input() name: string = ''
  @Input() label: string = ''
  @Input() mobile: number = 0
  @Input() stepNumber: number = 0

  form = new FormGroup({});
  userObj = {
    email: '',
    mobile: 0,
    // userId: 0,
    name: '',
    buyerId: 0,
    institueName: '',
    avatar: ''
  }


  constructor(private authenticationService: AuthenticationService, private toastr: ToastrService, private router: Router) { }
  ngOnInit(): void {
    this.form.addControl(this.name, new FormControl('', Validators.required))
  }

  get name1() {
    return this.form.get(this.name)
  }

  submitName(event: Event) {
    if (this.mobile) {
      const data: any = {
        type: this.name,
        mobile: this.mobile,
        current_signup_step: this.stepNumber
      }
      data[this.name] = this.name1?.value
      this.authenticationService.updateBuyerDetails(data).subscribe({
        next: (value: any) => {
          if (value.status == 200) {
            this.toastr.success(this.name + ' is updated successfully')
            if (this.name == 'pincode') {
              this.setLoginDetails(value.data.user);
              this.router.navigate(['/products']);
            }
          } else {
            this.toastr.warning('Enter valid details')
          }
        },
        error: (err: HttpErrorResponse) => {
          this.toastr.error('Server Error')
        }
      })
    }
    event.preventDefault()
    this.next.emit()
  }

  setLoginDetails(res: any) {
    this.authenticationService.deleteUserObj();
    this.userObj.email = res.mob_email ?? "";
    this.userObj.mobile = res.mob_user_phone ??  0;
    this.userObj.name = res.mob_first_name ?? "";
    this.userObj.buyerId = res.pk_mobile_user_id ?? 0
    this.userObj.institueName = res.mob_user_school_name ?? "";
    // this.userObj.avatar = res.mob_user_avatar ?? "";
    this.authenticationService.setUserObj(JSON.stringify(this.userObj))
  }

}

// Not using this component