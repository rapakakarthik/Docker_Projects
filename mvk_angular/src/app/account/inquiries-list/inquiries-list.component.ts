import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RfqService } from 'src/app/shared/services/rfq.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { text } from '@fortawesome/fontawesome-svg-core';


@Component({
  selector: 'app-inquiries-list',
  templateUrl: './inquiries-list.component.html',
  styleUrls: ['./inquiries-list.component.scss']
})
export class InquiriesListComponent implements OnInit, OnDestroy {
  inquiryDetails: any;
  
  inquiryOpened: boolean = false;
  rfqOpened: boolean = false;
  dialogRef: any;

  constructor(
    private crud: CrudService,
    private rfq: RfqService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }
  ngOnDestroy(): void {
    localStorage.removeItem('notificationObject');
  }
  ngOnInit(): void {
    this.openNotification();
    this.getInquiryList(0);
    this.getFolders();
  }


  openNotification() {
    let obj = localStorage.getItem('notificationObject');
    if(obj != null) {
      // console.log(obj);
      let parsedobj = JSON.parse(obj);
      if (parsedobj.message_type == "Enquiry") {
        this.getInquiryDetails(parsedobj.enquery_id);
      } else {
        
      }
    }
  }

  form!: FormGroup;
  createForm() {
    this.form = this.fb.group({
      sortBy: ['Desc'],
      filter: [''],
      search: [''],
      new_reply: [false],
    });
  }

  get sortStatus() {
    return this.form.get('sortBy');
  }

  get filter() {
    return this.form.get('filter');
  }

  get Search() {
    return this.form.get('search');
  }

  get newReply() {
    return this.form.get('new_reply');
  }

  serverDown: boolean = false;
  noInquiryFound = false;
  inqiryLoading = false;
  inquiryList: any[] = [];
  totalcount: number = 0;
  skip = 0;
  showDelete = true;
  filterValue = '';
  getInquiryList(skip: number) {
    this.noInquiryFound = false;
    this.inqiryLoading = true;
    const obj: {[name: string]: string | number} = {
      limit: 5,
      skip,
      // order: this.sortStatus?.value,
      filter: this.filterValue,
      search: this.Search?.value,
      new_reply: this.newReply?.value,
    }
    if(this.selectedFolderId > 0) {
      obj['folder_id'] = this.selectedFolderId
      delete obj.filter;
    }
    this.rfq.getInquiryList(obj).subscribe({
      next: (res: any) => {
        this.inqiryLoading = false;
        if (res.status === 200) {
          this.totalcount = res.count;
          this.populateFormArray(res.data);
          this.inquiryList = res.data;
          this.showOptions = false;
          this.showDelete = obj.filter !== 'trash';
          if(this.inquiryList.length == 0) {
            this.noInquiryFound = true;
          }
        }
        else {
          this.inquiryList = [];
          this.noInquiryFound = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        this.inqiryLoading = false;
        if(err.status === 500) {
          this.serverDown = true;
        }
        console.error(err.message, err.error); 
      } 
    });
  }

  
  
  getInquiryDetails(id: number) {
    this.crud.getInquiryDetails(id).subscribe((res) => {
      if (res.status === 200) {
        this.inquiryDetails = res.data;
        this.inquiryOpened = !this.inquiryOpened;
      }
    });
  }


  toggleInquiryProfile() {
    this.inquiryOpened = !this.inquiryOpened;
  }

  getSpanStyle(key: string) {
    return this.rfq.getSpanStyle(key);
  }

  closeInquiry(enquiry_id: number) {
    const obj = {
      update_type : "close",
      flag: 0,
      enquery_id: enquiry_id
    }
    this.rfq.updateEnquiryDetails(obj).subscribe({
      next: (value) => {
        if(value.status === 200) {
          this.inquiryOpened = false;
          this.getInquiryList(this.skip);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
  }
  
  isFav = false;
  addToFav(id: number, flag: number) {
    const obj = {
      update_type : "favourite",
      flag: flag == 1 ? 0 : 1,
      enquery_id: id
    }
    this.rfq.updateEnquiryDetails(obj).subscribe({
      next: (value) => {
        if(value.status === 200) {
          this.toastr.success(value.message);
          this.getInquiryList(this.skip);
        }
      },
      error: (err: HttpErrorResponse) => {
        
      },
    })
    // this.isFav = !this.isFav
  }

  p: number = 1;
  onPageChange(pageNumber: number) {
    this.p = pageNumber;
    this.skip = (pageNumber - 1) * 5;
    this.getInquiryList(this.skip);
    window.scrollTo(0, 0);
  }
  
  showOptions = false;

  clickSelect(event: Event){
    this.showOptions = !this.showOptions;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    this.showOptions = false;
  }


  showInputFolder = false;

  clickMyFolder(){
    this.showInputFolder = true;
    this.folders.forEach((folder, index) => {
      this.folders[index].showInput = false;
    });
  }

  clickSaveFolder(){
    this.createFolder(this.text);
  }

  saveFolder(id: number){
    this.rfq.editFolder(this.text, id).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          let index = this.folders.findIndex(group => group.id === id);
          this.folders[index].showInput = false;
          this.folders[index].name = this.text;
          this.text = '';
        } 
        else {
          this.toastr.error(res.message);
          let index = this.folders.findIndex(group => group.id === id);
          this.folders[index].showInput = false;
          this.text = '';
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          this.toastr.error(err.message);
        }
        console.error(err.message, err.error); 
      } 
    });
  }

  // New Logic filter and searches
  checkboxForm: FormGroup = this.fb.group({});
  populateFormArray(inquiries: any[]) {
    inquiries.forEach(inquiry => {
      this.checkboxForm.addControl(inquiry.enquery_id, new FormControl(false));
    })
  }



  deleteInquiries() {
    let selectedIds = [];
    let fd = this.checkboxForm.value;
    for(let i in fd) {
      if(fd[i]) selectedIds.push(i);
    }
    let str = selectedIds.join(',');
    let obj = {
      update_type: 'delete',
      enquery_id: str
    }
    this.rfq.updateEnquiryDetails(obj).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.getInquiryList(this.skip);
          this.clearSelection();
        }
      },
    })
  }
  
  restoreInquiries() {
    let obj = {
      update_type: 'restore',
      enquery_id: this.selectedIdString
    }
    this.rfq.updateEnquiryDetails(obj).subscribe({
      next: (value) => {
        if(value.status == 200) {
          this.getInquiryList(this.skip);
          this.clearSelection();
        }
      },
    })
  }

  clearSelection() {
    this.checkboxForm.reset();
    this.selectedIdString = '';
    this.selected = false;
    this.selectedCount = 0;
  }

  selectedCount = 0;
  checkSelection() {
    let selectedIds = [];
    let fd = this.checkboxForm.value;
    for(let i in fd) {
      if(fd[i]) selectedIds.push(i);
    }
    this.selected = selectedIds.length > 0;
    this.selectedCount = selectedIds.length;
    this.selectedIdString = selectedIds.join(',');
  }

  selected =  false;
  selectedIdString = '';
  moveTo() {
    let filter = this.filter?.value;
    if(filter == 'un_group') {
      let obj = {
        inquiry_id: this.selectedIdString,
        folder_id: this.selectedFolderId
      }
      this.unGroupFolder(obj);
    } else {
      let obj = {
        inquiry_id: this.selectedIdString,
        folder_id: filter
      }
      this.groupFolder(obj);
    }
  }

  text = "";
  createFolder(name: string) {
    if(name == '') {
      this.toastr.error('Folder name required');
      return;
    }
    this.rfq.createFolder(name).subscribe({
      next: (res: any) => {
        this.text = '';
        this.showInputFolder = false;
        if (res.status === 201) {
          this.getFolders();
          this.toastr.success(res.message);
        } 
        else {
          this.toastr.error(res.message);
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          // this.serverDown = true;
        }
        console.error(err.message, err.error); 
      } 
    });
  }

  folders: {id: number, name: string, showInput: boolean}[] = [];
  getFolders() {
    this.rfq.getFolders().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          let data = res.folder;
          this.folders = data.map((dat: any) => ({...dat, showInput: false }));
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          // this.serverDown = true;
        }
        console.error(err.message, err.error); 
      } 
    });
  }

  deleteFolder(id: number) {
    let index = this.folders.findIndex(folder => folder.id === id);
    this.rfq.deleteFolder(id).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.folders.splice(index, 1);
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
          // this.serverDown = true;
        }
        console.error(err.message, err.error); 
      } 
    });
  }

  editFolder(id: number, name: string) {
    this.text = name;
    // let index = 
    this.showInputFolder = false;
    this.folders.forEach((folder, index) => {
      if(folder.id === id) {
        this.folders[index].showInput = true;
      } else {
        this.folders[index].showInput = false;
      }
    });
    // this.folders[index].showInput = true;
  }

  selectedFolder = 'All';
  getTrash() {
    this.selectedFolder = 'Trash';
    this.filterValue = 'trash';
    this.selectedFolderId = 0;
    this.getInquiryList(0);
  }
  
  getAll() {
    this.selectedFolder = 'All';
    this.filterValue = '';
    this.selectedFolderId = 0;
    this.getInquiryList(0)
  }

  groupFolder(obj: any) {
    this.rfq.groupFolder(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // this.checkboxForm.reset();
          this.filter?.patchValue('');
          this.getInquiryList(0);
          this.clearSelection();
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {

        }
        console.error(err.message, err.error); 
      } 
    });
  }

  unGroupFolder(obj: any) {
    this.rfq.unGroupFolder(obj).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // this.checkboxForm.reset();
          this.filter?.patchValue('');
          this.getInquiryList(0);
          this.clearSelection();
        }
      },
      error: (err: HttpErrorResponse) => {
        if(err.status === 500) {
        }
        console.error(err.message, err.error); 
      } 
    });
  }

  selectedFolderId = 0;
  getGroup(id: number, name: string) {
    this.selectedFolder = name;
    this.selectedFolderId = id;
    this.getInquiryList(0);
  }
}
