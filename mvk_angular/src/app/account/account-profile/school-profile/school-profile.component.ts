import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-school-profile',
  templateUrl: './school-profile.component.html',
  styleUrl: './school-profile.component.scss'
})
export class SchoolProfileComponent implements OnInit{
  
  private toastr = inject(ToastrService);
  private router = inject(Router);
  
  @Input({required: true}) dropdowns: any[] = [];
  @Input({required: true}) schoolDropdowns: any;
  @Input({required: true}) user: any;
  showStaffForm: boolean = false;
  constructor() {
    this.createSchoolProfileForm();
    this.getSchoolProfile();
  }

  ngOnInit() {
    this.setRooms(this.schoolDropdowns.number_of_rooms);
    this.sourcingForm.valueChanges.subscribe(res => {
      this.showCwsnDrop = res.cwsn == '1';
      this.showResidentailDrop = res.residential == '1';
    });
    this.schoolDropdowns.staff_strength.forEach((staff: any) => {
      this.staffForm.addControl('form' + staff.id, new FormControl())
    });
    this.showStaffForm = true;
    // this.updateProfileForm(this.user);
  }

  // email: string = '';
  // mobile: number = 0;
  schoolData: any;
  getSchoolProfile() {
    this.auth.getSchoolProfile().subscribe({
      next: (value: any) => {
        if (value.status === 200) {
          this.schoolData = value.data;
          if(value.data.head_of_school.hos_status) {
            this.showHeadSection = false;
          }
          this.updateProfileForm(value.data.contact_details, value.data.school_details, value.data.head_of_school, value.data.sourcing_details);
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          // this.serverDown = true;
        }
        // this.toastr.error(err.error.message)
        console.error(err.message, err.error);
      }
    })
  }

  private fb = inject(FormBuilder);
  private auth = inject(AuthenticationService);
  
  schoolProfileForm!: FormGroup;
  createSchoolProfileForm() {
    this.schoolProfileForm = this.fb.group({
      school_details: this.fb.group({
        school_name: [''],
        udise_code: [''],
        street: [''],
        postal_code: ['', Validators.required],
        city: [''],
        medium: [''],
        school_management: [''],
        school_type: [''],
        school_board: [''],
        streams: ['default'],
        other_streams: [''],
        type_of_school: [''],
        year: ['']
      }),
      contact_details: this.fb.group({
        website: [''],
        std_code: [''],
        landline_number: [''],
        email: [''],
        mobile: ['']
      }),
      head_of_school: this.fb.group({
        hos_type: [''],
        hos_name: [''],
        hos_contact: [''],
        hos_email: ['']
      }),
      secondary_school: this.fb.group({
        secondary: [''],
        higher_secondary: [''],
      })
    })
  }

  get schoolDetails() {
    return this.schoolProfileForm.get('school_details') as FormGroup;
  }

  get contactDetails() {
    return this.schoolProfileForm.get('contact_details') as FormGroup;
  }

  get hos() {
    return this.schoolProfileForm.get('head_of_school') as FormGroup;
  }

  get secondarySchool () {
    return this.schoolProfileForm.get('secondary_school') as FormGroup;
  }

  city = "";
  state = "";
  country = "India";
  updateProfileForm(contact: any, school: any, hos: any, sourcing: any) {
    // this.email = contact.email;
    // this.mobile = contact.mobile_number;
    this.city = school.city_name;
    this.state = school.state_name;
    // this.country = school.country_name;
    this.schoolDetails.patchValue({
      school_name: school.school_name,
      udise_code: school.udise_code || '',
      street: school.street,
      city: this.city,
      postal_code: school.pincode,
      medium: school.medium_id,
      school_management: school.school_management_id,
      school_type: school.school_type_id,
      school_board: school.school_board_id,
      // streams: school.stream_avilable_id,
      streams: school.stream_avilable_id == '0' && school.stream_avilable_name == '' ? 'default' : school.stream_avilable_id,
      other_streams: school.stream_avilable_id == '0' ? school.stream_avilable_name : '',
      type_of_school: school.type_of_school_id,
      year: school.established_year
    })
    this.stateBoards(school.school_board_id);
    this.contactDetails.patchValue({
      website: contact.website,
      std_code: contact.std_code,
      landline_number: contact.landline_number || '',
      email: contact.email,
      mobile: contact.mobile_number
    })
    this.hos.patchValue({
      hos_type: hos.type_id,
      hos_name: hos.hos_name,
      hos_contact: hos.hos_number || '',
      hos_email: hos.hos_email
    })
    this.secondarySchool.patchValue({
      secondary: sourcing.affliation_board_section_id ? "1" : "0",
      higher_secondary: sourcing.affliation_board_higher_section_id ? "1" : "0"
    })
    this.sourcingForm.patchValue({
      primary: sourcing.primary_school_status ? "1" : "0",
      residential: sourcing.residential_school_status ? "1" : "0",
      training: sourcing.skill_training_center_status ? "1" : "0",
      cwsn: sourcing.cwsn_status ? "1" : "0",
      resVal: sourcing.residential_school_id,
      cwsnVal: sourcing.cwsn_id == '0' && sourcing.other_cwsn_name == '' ? 'default' : sourcing.cwsn_id,
      cwsnDesc: sourcing.other_cwsn_name ?? '',
      cce: sourcing.cce_status ? "1" : "0",
      fit_india_school: sourcing.fit_india_school_status ? "1" : "0",
      playground_facility: sourcing.playground_facility_status ? "1" : "0"
    })
    sourcing.staff.forEach((staff: any) => {
      this.staffForm.get('form' + staff.staff_id)?.patchValue(staff.staff_strength);
    });
    sourcing.rooms.forEach((room: any) => {
      this.roomsCount1[room.room_id] = room.quantity;
      this.totalRooms = this.totalRooms + room.quantity;
      let idsArray: number[];
      if(room.room_dropdown_id) {
        idsArray = (room.room_dropdown_id as string).split(',').map(v => parseInt(v));
      } else {
        idsArray = [0];
      }
      this.roomsForm.get('form' + room.room_id)?.patchValue(idsArray);
    });
    this.showDescriptionBox = sourcing.cwsn_id == 0 && sourcing.other_cwsn_name != '';
    this.showDescriptionBoxStreams = school.stream_avilable_id == 0 && school.stream_avilable_name != '';
    this.getCwsn().valueChanges.subscribe(res => {
      this.showDescriptionBox = res == 0;
    })
    this.getStreams().valueChanges.subscribe(res => {
      this.showDescriptionBoxStreams = res == 0;
    })
  }

  get pincode() {
    return this.schoolDetails.get('postal_code') as FormControl
  }
  
  pinResponse: string = '';
  isPincodeValid: boolean = true;
  pincodeVerify() {
    if(this.pincode.valid) {
      this.pinResponse = "";
      // this.isPincodeValid = false;
      this.auth.pincodeVerify(this.pincode.value).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.stateBoards(0);
            this.isPincodeValid = true;
            this.pinResponse = res.data
            let data = this.pinResponse.split(',');
            this.city = data[0];
            this.schoolDetails.patchValue({
              city: this.city,
            })
            this.state = data[1].trimStart();
          }
          if(res.status === 400) {
            this.isPincodeValid = false;
            this.pinResponse = res.message
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('pincode error', err.message)
        }
      })
    }
  }

  boards: any[] = []
  stateBoards(selectedId: number){
    this.auth.stateBoards(this.pincode.value).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.isPincodeValid = true;
          this.boards = res.boards;
          this.schoolDetails.patchValue({
            school_board: selectedId,
          })
        }
        if(res.status === 400) {
          this.isPincodeValid = false;
          this.pinResponse = res.message
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('pincode error', err.message)
      }
    })
  }

  showHeadSection = true;


  // Rooms section
  roomsForm: FormGroup = this.fb.group({});
  showRooms = false;
  totalRooms = 0;

  roomsCount1: {[name: number]: number} = {}
  setRooms(rooms: any[]) {
    rooms.forEach((room) => {
      this.roomsCount1[room.pk_id] = 0;
      this.roomsForm.addControl('form' + room.pk_id, new FormControl())
      if(room.is_dropdown == 1) {
      }
    })
    this.showRooms = true
  }

  addRoom1(name: number, type: string) {
    if(type == 'increase' && this.roomsCount1[name] < 20) {
      this.roomsCount1[name]++;
      this.totalRooms++;
    } else if(type == 'decrease' && this.roomsCount1[name] > 0) {
      this.roomsCount1[name]--;
      this.totalRooms--;
    }
  }
  
  // roomsCount: {[name: string]: number} = {
  //   head: 0,
  //   assistant: 0,
  //   girls: 0,
  //   teacher: 0
  // }

  // addRoom(name: string, type: string) {
  //   if(type == 'increase' && this.roomsCount[name] < 20) {
  //     this.roomsCount[name]++;
  //     this.totalRooms++;
  //   } else if(type == 'decrease' && this.roomsCount[name] > 0) {
  //     this.roomsCount[name]--;
  //     this.totalRooms--;
  //   }
  // }


  // staff and sourcing forms
  staffForm: FormGroup = this.fb.group({})

  sourcingForm: FormGroup = this.fb.group({
    primary: [''],
    residential: [''],
    training: [''],
    cwsn: [''],
    resVal: [''],
    cwsnVal: [''],
    cwsnDesc: [''],
    cce: [''],
    fit_india_school: [''], 
    playground_facility: [''] 
  })

  showResidentailDrop = false;
  showCwsnDrop = false;
  
  saveSchoolDetails() {
    // let roomsValue: any[] = [];
    // this.schoolDropdowns.number_of_rooms.forEach((room: any) => {
    //   let roomId = 0;
    //   if(room.is_dropdown == 1) {
    //     roomId = this.roomsForm.get('form' + room.pk_id)?.value;
    //   }
    //   roomsValue.push({
    //     room_id: room.pk_id,
    //     room_dropdown_id: roomId,
    //     quantity: this.roomsCount1[room.pk_id]
    //   })
    // })
    const obj = {
      // secondarySchool: this.secondarySchool.value
      // head_room: this.roomsCount.head,
      // assistant_room: this.roomsCount.assistant,
      // girls_room: this.roomsCount.girls,
      // subjects: this.subjects.value,
      // staff: this.staffForm.value,
      // sourcing: this.sourcingForm.value,
      // staff_selections: staff_selections
      // room_selections: roomsValue
    }

  }

  editSchoolProfile() {
    let schoolFd = this.schoolProfileForm.value.school_details;
    let contactFd = this.schoolProfileForm.value.contact_details;
    let hosFd = this.schoolProfileForm.value.head_of_school;
    let roomsValue: any[] = [];
    this.schoolDropdowns.number_of_rooms.forEach((room: any) => {
      let roomId: string[] = ['0'];
      if(room.is_dropdown == 1) {
        roomId = this.roomsForm.get('form' + room.pk_id)?.value ?? ['0'];
      }
      let ids = roomId.join(',')
      roomsValue.push({
        room_id: room.pk_id,
        room_dropdown_id: ids,
        quantity: this.roomsCount1[room.pk_id]
      })
    })
    let staff_selections: {staff_id: number,staff_strength: string}[] = [];
    let staffValue: {[name: string]: string} = this.staffForm.value;
    for(let key in staffValue) {
      let id = parseInt(key.slice(4));
      staff_selections.push({staff_id: id, staff_strength: staffValue[key]})
    }
    let secondary = this.secondarySchool.value;
    let sourcing = this.sourcingForm.value;
    let obj = {
      // school details
      school_name: schoolFd.school_name,
      udise_code: schoolFd.udise_code,
      street: schoolFd.street,
      pincode: schoolFd.postal_code,
      city: schoolFd.city,
      medium: schoolFd.medium,
      school_management: schoolFd.school_management,
      school_type: schoolFd.school_type,
      school_board: schoolFd.school_board,
      school_streams: schoolFd.streams,
      other_streams: schoolFd.other_streams,
      type_of_school: schoolFd.type_of_school,
      year: schoolFd.year,
      // contact detais
      std_code: contactFd.std_code,
      landline_number: contactFd.landline_number,
      website: contactFd.website,
      contact_email: contactFd.email,
      contact_mobile_number: contactFd.mobile,
      // head of the school
      type_id: hosFd.hos_type ?? 0,
      hos_name: hosFd.hos_name ?? '',
      hos_number: hosFd.hos_contact ?? 0,
      hos_email: hosFd.hos_email ?? '',
      // secondary section
      secondary_section: secondary.secondary,
      higher_secondary_section: secondary.higher_secondary,
      // sourcing section
      primary_school_status: parseInt(sourcing.primary),
      residential_school_status: parseInt(sourcing.residential),
      residential_school: sourcing.resVal,
      skill_training_status: parseInt(sourcing.training),
      cwsn_status: parseInt(sourcing.cwsn),
      cwsn: sourcing.cwsnVal,
      other_cwsn_value: sourcing.cwsnDesc,
      cce_status: parseInt(sourcing.cce),
      fit_india_school_status: parseInt(sourcing.fit_india_school),
      playground_facility_status: parseInt(sourcing.playground_facility),
      // total rooms count section
      room_selections: roomsValue,
      // staff section
      staff_selections: staff_selections
    };
    if(!this.validationsCheck(obj)) {
      return;
    }
    if(!this.checkRoomValidation()) {
      return;
    }
    
    // console.log(obj);    
    this.updateSchoolProfile(obj);
  }

  updateSchoolProfile(obj: any) {
    // if(!this.validationsCheck(obj)) {
    //   return;
    // }
    this.auth.updateSchoolProfile(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.toastr.success(res.message);
          } else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('edit school profile error', err.message)
      }
    })
  }



  // Errors

  schoolNameError = false;
  udiseError = false;
  streetError = false;
  cityError = false;
  pincodeError = false;
  yearError = false;
  // streetError = false;

  validationsCheck(fd: any): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const urlRegex: RegExp = /^(https?:\/\/)(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/;
    const currentYear = new Date().getFullYear();
    const allowNums = ['6', '7', '8', '9'];
    const allSTDCodes = ["03192", "0891", "0866", "0360", "0361", "0612", "0172", "0771","0260","011", "0832", "079", "0261", "0124", "0129", "0177","0194", "0191", "0651","080", "0821", "0471", "0484", "04896","0755", "0731", "022", "020", "0712", "0385", "0364", "0389","0370", "0674", "0413", "0161", "0183", "0141", "0294", "03592","044", "0422", "040", "0381", "0522", "0512", "0120", "0135", "033"
    ]

    // let telephoneNum: string = fd.telephone.toString();

    // School profile
    if(!this.schoolProfileValidations(fd)) {
      return false;
    }

    // Contact details
    if(!this.contactDetailsValidations(fd)) {
      return false;
    }

    // Head of the school
    if(this.showHeadSection && !this.hosValidations(fd)) {
      return false;
    }

    let parsedFd = JSON.parse(JSON.stringify(fd));
    if(parsedFd.year < 1800 || parsedFd.year > currentYear) {
      this.toastr.error('The year must be between 1800 and current year');
      return false;
    } 
    else if(this.showDescriptionBox && parsedFd.other_cwsn_value == '') {
      this.toastr.error('Cwsn others value required');
      return false;
    }
    else if(this.showDescriptionBoxStreams && parsedFd.other_streams == '') {
      this.toastr.error('Streams others value required');
      return false;
    }
    else {
      return true;
    }
  }

  schoolProfileValidations(fd: any): boolean {
    this.schoolNameError = false;
    this.udiseError = false;
    this.streetError = false;
    this.pincodeError = false;
    this.cityError = false;
    this.yearError = false;
    let isValid = false;
    if(!fd.school_name) {
      this.toastr.error('School name required');
      this.schoolNameError = true;
    }
    else if(!fd.udise_code) {
      this.toastr.error('Udise code required');
      this.udiseError = true;
    }
    else if(!fd.street) {
      this.toastr.error('Street required');
      this.streetError = true;
    }
    else if(!fd.pincode) {
      this.toastr.error('pincode required');
      this.pincodeError = true;
    }
    else if(!fd.city) {
      this.toastr.error('City required');
      this.cityError = true;
    }
    else if(fd.school_management === 0) {
      this.toastr.error('School management required');
    }
    else if(fd.school_type === 0) {
      this.toastr.error('School Type required');
    }
    else if(fd.school_board === 0) {
      this.toastr.error('School Board required');
    } 
    else if(fd.school_streams == 'default') {
      this.toastr.error('School Streams required');
    }
    else if(fd.type_of_school == 0) {
      this.toastr.error('Type of School required');
    }
    else if(fd.year == 0) {
      this.yearError = true;
      this.toastr.error('Year Established required');
    } 
    else {
      isValid = true;
    }
    return isValid;
  }

  websiteError = false;
  contactEmailError = false;
  stdCodeError = false;
  contactMobileError = false;
  contactLandlineError = false;
  contactDetailsValidations(fd: any): boolean {
    this.websiteError = false;
    this.contactEmailError = false;
    this.stdCodeError = false;
    this.contactMobileError = false;
    this.contactLandlineError = false;
    let isValid = false;    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const urlRegex: RegExp = /^(https?:\/\/)(www\.)?[a-zA-Z0-9@:%._\+~#?&//=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._\+~#?&//=]*)$/;
    const allowNums = ['6', '7', '8', '9'];
    const allSTDCodes = ["03192", "0891", "0866", "0360", "0361", "0612", "0172", "0771","0260","011", "0832", "079", "0261", "0124", "0129", "0177","0194", "0191", "0651","080", "0821", "0471", "0484", "04896","0755", "0731", "022", "020", "0712", "0385", "0364", "0389","0370", "0674", "0413", "0161", "0183", "0141", "0294", "03592","044", "0422", "040", "0381", "0522", "0512", "0120", "0135", "033"
    ]
    if(!fd.std_code) {
      this.toastr.error('Std code required');
      this.stdCodeError = true;
    }
    else if(!allSTDCodes.includes(fd.std_code)) {
      this.toastr.error('Std code is invalid');
      this.stdCodeError = true;
    }
    else if(!fd.landline_number) {
      this.toastr.error('Landline required');
      this.contactLandlineError = true;
    }
    else if(fd.landline_number.toString().length < 4) {
      this.toastr.error('Landline number is invalid');
      this.contactLandlineError = true;
    }
    else if(!fd.website) {
      this.toastr.error('Website required');
      this.websiteError = true;
    }
    else if(!urlRegex.test(fd.website)) {
      this.toastr.error('website is invalid');
      this.websiteError = true;
    }
    else if(!fd.contact_email) {
      this.toastr.error('Contact email required');
      this.contactEmailError = true;
    }
    else if(!emailRegex.test(fd.contact_email)) {
      this.toastr.error('Contact email is invalid');
      this.contactEmailError = true;
    }
    else if(!fd.contact_mobile_number) {
      this.toastr.error('Contact Mobile required');
      this.contactMobileError = true;
    }
    else if(!allowNums.includes(fd.contact_mobile_number.toString().slice(0,1)) || fd.contact_mobile_number.toString().length < 10) {
      this.toastr.error('Contact Mobile is invalid');
      this.contactMobileError = true;
    }
    else {
      isValid = true;
    }
    return isValid;
  }


  hosTypeError = false;
  hosNameError = false;
  hosNumberError = false;
  hosEmailError = false;
  hosValidations(fd: any): boolean {
    this.hosTypeError = false;
    this.hosNameError = false;
    this.hosNumberError = false;
    this.hosEmailError = false;
    let isValid = false;    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const allowNums = ['6', '7', '8', '9'];
    
    if(!fd.type_id) {
      this.toastr.error('HOS type required');
      this.hosTypeError = true;
    }
    else if(!fd.hos_number) {
      this.toastr.error('Hos contact required');
      this.hosNumberError = true;
    }
    else if(!allowNums.includes(fd.hos_number.toString().slice(0,1)) || fd.hos_number.toString().length < 10) {
      this.toastr.error('Hos contact is invalid');
      this.hosNumberError = true;
    }
    else if(!fd.hos_name) {
      this.toastr.error('Hos name required');
      this.hosNameError = true;
    }
    else if(!fd.hos_email) {
      this.toastr.error('Hos email required');
      this.hosEmailError = true;
    }
    else if(!emailRegex.test(fd.hos_email)) {
      this.toastr.error('Hos email is invalid');
      this.hosEmailError = true;
    }
    else {
      isValid = true;
    }
    return isValid;
  }

  checkRoomValidation(): boolean {
    let isValid = true;
    this.schoolDropdowns.number_of_rooms.forEach((room: any) => {
      if(room.is_dropdown == 1 && this.roomsCount1[room.pk_id] > 0) {
        let selectedIds: number[] = this.roomsForm.get('form' + room.pk_id)?.value;
        if(selectedIds.length == 0 || selectedIds.includes(0)) {
          this.toastr.error("please select atleast one room");
          isValid = false;
          return;
        }
      }
    })
    return isValid;
  }

  showDescriptionBox = false;

  getCwsn() {
    return this.sourcingForm.get('cwsnVal') as FormControl;
  }

  showDescriptionBoxStreams = false;
  getStreams() {
    return this.schoolDetails.get('streams') as FormControl;
  }

  cancelSchoolProfile() {
    this.router.navigateByUrl("/")
  }
}