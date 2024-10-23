import {Component,ElementRef,Inject,OnInit,TemplateRef,ViewChild} from '@angular/core';
import {  FormBuilder,  FormControl,  FormGroup,  Validators} from '@angular/forms';
import { RfqService } from '../../services/rfq.service';
import {  MatDialog,  MatDialogRef,  MAT_DIALOG_DATA,} from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChatService } from '../../services/chat.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-enquiry-v2',
  templateUrl: './enquiry-v2.component.html',
  styleUrls: ['./enquiry-v2.component.scss'],
})
export class EnquiryV2Component implements OnInit {
  form!: FormGroup;
  unitdetails: any;
  categoryList: any;
  @ViewChild('thankyoutemplate')
  thankyoutemplate!: TemplateRef<any>;
  categoryDialogRef: any;
  selectedSubcategories: any;
  sourceType: any;
  units: any;
  currency: any;
  frequency: any;
  businessType: any;
  questions: any;
  orderval: any;
  categories: any;
  selectedCategories: any;
  showChildren = false;
  catName: any = 'Select Category';
  attrData: any[] = [];
  keywordsList: any = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('keyInput') keyInput: ElementRef<HTMLInputElement> | undefined;
  thankyouDialogRef: any;

  constructor(
    private toastr: ToastrService,
    private chatService: ChatService,
    public dialogRef: MatDialogRef<EnquiryV2Component>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private rfqService: RfqService,
    @Inject(MAT_DIALOG_DATA) public sellerDetails: any
  ) {
    this.setForm();
  }

  productNameReadonly: boolean = false;
  ngOnInit(): void {
    console.log(this.sellerDetails)
    if(this.sellerDetails.productName) {
      this.form.get('product_name')?.patchValue(this.sellerDetails.productName);
      this.productNameReadonly = true;
    }
    this.setUserDetails();
    this.getAllDoprdowns();
    if (this.sellerDetails.category_id) this.getAttributeslist(this.sellerDetails.category_id);
  }

  setForm() {
    this.form = this.fb.group({
      product_name: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      units: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      order_value: new FormControl('', Validators.required),
      currency: new FormControl('', Validators.required),
      required_frequency: new FormControl('', Validators.required),
      quote_from_others: new FormControl('')

      // sourcing_type: new FormControl(''),
      // supplier_business: new FormControl(''),
      // packaging_type: new FormControl(''),
      // valid_to: new FormControl('', Validators.required),
      // lead_time: new FormControl('',Validators.required),
      // keywords: new FormControl(''),
    });
  }

  // Setting details for chat start
  userObj: any;
  buyerId: number = 0;
  buyerName: string = '';
  institueName: string = '';
  profilePhoto: string = '';
  quantity: string = "";
  unit: string = "";
  description: string = "";
  containsBuyerDetails: boolean  = false;
  containsSellerDetails: boolean  = false;
  setUserDetails() {
    if(this.sellerDetails) this.containsSellerDetails = true;
    else this.containsSellerDetails = false;
    const Uobj = JSON.parse(localStorage.getItem('userObj') || '{}');
    if(Object.keys(Uobj).length != 0) {
      this.buyerName = Uobj.name;
      this.buyerId = Uobj.buyerId;
      this.institueName = Uobj.institueName;
      this.profilePhoto = Uobj.avatar;
      this.containsBuyerDetails = true;
    } else {
      this.containsBuyerDetails = false;
    }
  }

  updateData(data: any) {
    this.sendMessage(data);
    this.sendBuyerDetails();
    this.sendBuyerSellers();
    this.sendSellerBuyers();
    this.sendSellerDetails();
  }

  sendBuyerDetails() {
    const obj = {
      activeNow: true,
      activeTime: new Date().getTime(), //number
      companyId: this.buyerId.toString(), //buyer_user_id //string
      companyName: this.institueName, //school name
      createAt: new Date().getTime(), //current time
      fcmRegToken: null, //fire base token
      profilePhoto: this.profilePhoto, //photo url
      userId: this.buyerId.toString(), //user_id //string
      userName: this.buyerName, //user name
      userType: 2, // number
    };
    if (this.buyerId != 0) {
      this.chatService.createBuyerDetails(obj, this.buyerId).then(() => {
        console.log('updated succesfully');
      });
    } else {
      console.log('failed');
    }
  }

  sendMessage(data: any) {
    const details = {
      company_id: this.sellerDetails.sellerAccountId,
      description: this.description,
      inquiry_code: data.enquery_code,
      inquiry_id: data.enquery_id,
      inquiry_type: 'company',
      // product_id: '2114',
      // product_image: 'https://api.myverkoper.com/uploads/prod_img/p1.png","product_name',
      // product_name: 'Std-1 / Class-1 ACE 6 Book',
      quantity: this.quantity,
      units: this.unit,
    };
    const obj = {
      details: details,
      deviceId: '',
      device_type: '2',
      filePath: '',
      from: 'Buyer_' + this.buyerId.toString(),
      message: '',
      messageId: '',
      seen: false,
      seenTime: 0,
      time: new Date().getTime(),
      to: 'Seller_' + this.sellerDetails.sellerId,
      type: 'inquiry',
    };
    this.chatService
      .createMessage(
        obj,
        this.sellerDetails.sellerAccountId,
        this.sellerDetails.sellerId,
        this.buyerId
      )
      .then(() => {
        console.log('msg sent successfully');
      });
  }

  sendBuyerSellers() {
    const obj = {
      companyId: this.sellerDetails.sellerAccountId.toString(), //string
      companyLogo: this.sellerDetails.companyLogo,
      companyName: this.sellerDetails.companyName,
      lastMessage: '',
      lastMsgTime: new Date().getTime(),
      msgType: 'inquiry',
      newMsgCount: 0, //number
      userId: this.sellerDetails.sellerId.toString(), //string
      userName: this.sellerDetails.companyName,
      buyer_seller_status: 0
    };
    if (this.buyerId != 0) {
      this.chatService
        .createBuyerSellers(
          obj,
          this.buyerId,
          this.sellerDetails.sellerAccountId,
          this.sellerDetails.sellerId
        )
        .then(() => {
          console.log('updated succesfully');
        });
    } else {
      console.log('failed');
    }
  }

  sendSellerBuyers() {
    const obj = {
      chatRequest: '0',  //string
      companyId: this.buyerId.toString(), //string
      companyName: this.institueName, //buyer company
      lastMessage: 'inquiry',
      lastMsgTime: new Date().getTime(),
      msgType: 'inquiry',
      newMsgCount: 1, //number
      profilePhoto: this.profilePhoto,
      userId: this.buyerId.toString(), //buyer id  //string
      userName: this.buyerName,
      buyer_seller_status: 0
    };
    if (this.buyerId != 0) {
      this.chatService
        .createSellerBuyers(
          obj,
          this.buyerId,
          this.sellerDetails.sellerAccountId,
          this.sellerDetails.sellerId
        )
        .then(() => {
          console.log('updated succesfully');
        });
    } else {
      console.log('failed');
    }
  }

  sendSellerDetails() {
    const obj = {
      activeNow: false,
      activeTime: 0,  //number
      companyId: this.sellerDetails.sellerAccountId.toString(), //seller company
      comanyLogo: this.sellerDetails.companyLogo,
      companyName: this.sellerDetails.companyName, //seller company name
      createAt: new Date().getTime(),
      createdBy: this.buyerId.toString(), //buyer id
      fcmRegToken: null,
      userId: this.sellerDetails.sellerId.toString(), //seller user //string
      userName: this.sellerDetails.companyName,
      userType: 0, //number
    };
    if (this.sellerDetails.sellerId != 0) {
      this.chatService
        .createSellerDetails(
          obj,
          this.sellerDetails.sellerAccountId,
          this.sellerDetails.sellerId
        )
        .then(() => {
          console.log('updated succesfully');
        });
    } else {
      console.log('failed');
    }
  }
  //  Chat End
  
  getAllDoprdowns() {
    this.rfqService.getAlldropdownData('2').subscribe((r) => {
      if (r.status == 200) {
        let res = r.data;

        this.businessType = res.business_type;
        this.currency = res.currency;
        this.frequency = res.frequency;
        this.orderval = res.order_val;
        this.questions = res.questions;
        this.sourceType = res.sourcing_type;
        this.units = res.units;
        this.categories = res.categories;
      } else {
      }
    });
  }


  getAttributeslist(id: any) {
    this.rfqService.getAttributes(id).subscribe((res) => {
      if (res.status == 200) {
        this.attrData = res.data;
        this.myMethod(res.data);
      } else {
      }
    });
  }

  myMethod(attData: any) {
    attData.forEach((dat: any) => {
      this.form.addControl(dat.name, new FormControl(''));
    });
  }


  openConfirmation() {
    this.thankyouDialogRef = this.dialog.open(this.thankyoutemplate, {
      width: '350px',
      disableClose: true,
    });

    this.thankyouDialogRef.afterClosed().subscribe((res: any) => {
      this.dialogRef.close();
    });

    setTimeout(() => {
      this.thankyouDialogRef.close();
    }, 6000);
  }

  closeCategorypopup() {
    this.categoryDialogRef.close();
  }
  closeRFQpopup() {
    this.dialogRef.close();
  }
  closeConfirmation() {
    this.thankyouDialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.keywordsList.push(value);
      this.form.controls['keyword'].setValue(this.keywordsList);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(kw: string): void {
    const index = this.keywordsList.indexOf(kw);
    if (index >= 0) {
      this.keywordsList.splice(index, 1);
    }
  }

  //Form Submit
  submit(formData: any) {
    let fd = formData.value;
    this.unit = fd.units;
    this.quantity = fd.quantity;
    this.description = fd.description
    let attrnames: any = [];

    // if(this.attrData) {
    //   this.attrData.forEach((dat: any) => {
    //     attrnames.push({ name: dat.name, type: dat.type, value: fd[dat.name].toString()});
    //   });
    // }
    const sd = this.sellerDetails;
    let submitData = {
      company_id: sd.sellerAccountId,
      seller_id: sd.sellerId,
      buyer_id: this.buyerId,
      product_id: sd.product_id,
      enquery_type: sd.env,
      product_name: fd.product_name,
      quantity: fd.quantity,
      units: fd.units,
      description: fd.description,
      order_value: fd.order_value,
      currency: fd.currency,
      quote_from_others: fd.quote_from_others ? 1 : 0,
      required_frequency: fd.required_frequency,
      // attributes: attrnames,
    };
    console.log(submitData)
    this.enquerySubmit(submitData);
  }
  
  enquerySubmit(submitData: any) {
    this.rfqService.enquerySubmit(submitData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success("Submit Form Successfully")
          if(this.containsBuyerDetails && this.containsSellerDetails) {
            console.log('Updated in firebase also');
            this.updateData(res.data);
          } else {
            console.error('Missing either seller or Buyer Details')
          }
          this.openConfirmation();
        } else if (res.status == 400) {
          this.toastr.warning(res.message);
          console.warn(res.message);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error(error.message)
        console.error("Inquiry form submit: " + error.message)
      }
    });
  }
}

// Not Using
