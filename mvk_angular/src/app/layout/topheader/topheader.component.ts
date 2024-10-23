import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ServService } from './serv.service';

@Component({
  selector: 'app-topheader',
  templateUrl: './topheader.component.html',
  styleUrls: ['./topheader.component.scss']
})
export class TopheaderComponent implements OnInit {
  title = 'autocomplete';

  options = ["Sam", "Varun", "Jasmine"];

  filteredOptions:any;


  formGroup! : FormGroup;
  constructor(private service : ServService, private fb : FormBuilder){}

  ngOnInit(){
    this.initForm();
    this.getNames();
  }

  initForm(){
    this.formGroup = this.fb.group({
      'employee' : ['']
    })
    this.formGroup.get('employee')?.valueChanges
    .pipe(debounceTime(1000))
    .subscribe(response => {
      if(response && response.length){
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
      
    })
  }

  filterData(enteredData: any){
    this.filteredOptions = this.options.filter(item => {
      return item.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getNames(){
    this.service.getData().subscribe(response => {
      this.options = response;
    })
  }


  
}