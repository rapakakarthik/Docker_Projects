import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-single-select',
  templateUrl: './single-select.component.html',
  styleUrls: ['./single-select.component.scss']
})
export class SingleSelectComponent implements OnInit {

  @Input() step!: number;
  @Input() schoolData!: any;
  @Output() selectedType = new EventEmitter()
  @Input() mobile: number = 0
  @Input() stepNumber: number = 0

  options = [
    { value: 'educationalInstitue', label: 'Educational Institue', image: 'https://picsum.photos/200', description: 'Just add your desired image size (width & height) after our URL, and youll get a random image.' },
    { value: 'reseller', label: 'Reseller', image: 'https://picsum.photos/300', description: 'Just add your desired image size (width & height) after our URL, and youll get a random image.' },
  ];

  selectedOption: string = '';
  constructor(private auth: AuthenticationService) { }
  ngOnInit(): void {
  }

  selectOption() {
    if (this.selectedOption == '') {
      alert('please select atleast one option')
    }
    else {
      if (this.mobile) {
        let data: any = {
          type: this.schoolData.input_name,
          mobile: this.mobile,
          current_signup_step: this.stepNumber
        }
        data[this.schoolData.input_name] = this.selectedOption
        this.auth.updateBuyerDetails(data).subscribe(res => {
          if (res.status == 200) {

          }
        })
      }
      this.selectedType.emit()
    }
  }
}

// Not using this component