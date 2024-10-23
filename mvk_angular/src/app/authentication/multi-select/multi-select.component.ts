import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export  class MultiSelectComponent implements OnInit {
  @Input() products!: string;
  multiSelect: FormGroup;

  company: string[] = ['retailer', 'manufacturer', 'individual', 'onlinestore']

  constructor(private _formBuilder: FormBuilder) {
    this.multiSelect = this._formBuilder.group({})
  }
  ngOnInit(): void {
    this.company.forEach(checkbox => {
      this.multiSelect.addControl(checkbox, this._formBuilder.control(false))
    })
  }


  applyColor(label: string) {
    const checkboxControl = this.multiSelect.get(label);
    if (checkboxControl)
      checkboxControl.setValue(!checkboxControl.value);
    console.log(this.multiSelect.value)
  }

  onCheckboxClick(event: MouseEvent) {
    event.stopPropagation();
  }

}
