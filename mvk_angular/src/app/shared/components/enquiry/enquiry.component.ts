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
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.scss']
})
export class EnquiryComponent implements OnInit {
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
    public dialogRef: MatDialogRef<EnquiryComponent>,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private rfqService: RfqService,
    @Inject(MAT_DIALOG_DATA) public sellerDetails: any
  ) {
    this.setForm();
  }

  productNameReadonly: boolean = false;
  ngOnInit(): void {
    if(this.sellerDetails && this.sellerDetails.productName) {
      this.form.get('product_name')?.patchValue(this.sellerDetails.productName);
      this.productNameReadonly = true;
    }
    this.getAllDoprdowns();
    this.setUserDetails();
    // if (this.sellerDetails.category_id) this.getAttributeslist(this.sellerDetails.category_id);
  }

  required = Validators.required;
  setForm() {
    this.form = this.fb.group({
      product_name: ['', this.required],
      quantity: ['', this.required],
      units: ['', this.required],

      description: [''],
      order_value: [''],
      currency: [''],
      required_frequency: [''],
      quote_from_others: ['']
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
      details: JSON.stringify(details),
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
        if(this.sellerDetails && this.sellerDetails.units) {
          let id = [...this.units].find(obj=>obj.val==this.sellerDetails.units).id;
          this.form.get('units')?.patchValue(id);
        }
      } else {
      }
    });
  }


  // not using
  getAttributeslist(id: any) {
    this.rfqService.getAttributes(id).subscribe((res) => {
      if (res.status == 200) {
        this.attrData = res.data;
        this.myMethod(res.data);
      } else {
      }
    });
  }

  // Not using
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

  closeCategorypopup = () => this.categoryDialogRef.close();
  closeRFQpopup = () => this.dialogRef.close();
  closeConfirmation = () => this.thankyouDialogRef.close();

  // Not Using
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.keywordsList.push(value);
      this.form.controls['keyword'].setValue(this.keywordsList);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  // Not Using
  remove(kw: string): void {
    const index = this.keywordsList.indexOf(kw);
    if (index >= 0) {
      this.keywordsList.splice(index, 1);
    }
  }

  formNumber: number = 1;
  filledDetails = {
    productName: '',
    quantity: '',
    unit: {id: '', val: ''}
  }
  //Form Submit
  submit(formData: any) {
    let fd = formData.value;
    this.unit = fd.units;
    this.quantity = fd.quantity;
    this.description = fd.description

    this.filledDetails.productName = fd.product_name;
    this.filledDetails.quantity = fd.quantity;
    this.filledDetails.unit = this.units.find((u: { id: string, val: string }) => u.id === fd.units);
    // console.log(this.filledDetails);
    
    let attrnames: any = [];

    // if(this.attrData) {
    //   this.attrData.forEach((dat: any) => {
    //     attrnames.push({ name: dat.name, type: dat.type, value: fd[dat.name].toString()});
    //   });
    // }
    const sd = this.sellerDetails;

    if(this.formNumber == 1) {
      let submitData: any = {
        company_id: sd.sellerAccountId,
        seller_id: sd.sellerId,
        buyer_id: this.buyerId,
        enquery_type: sd.env,
        product_name: fd.product_name,
        quantity: fd.quantity,
        units: fd.units,
        description: fd.description,
        screen: 'screen1',
      };
      if(sd.category_id) submitData['category_id'] = sd.category_id;
      if(sd.product_id) submitData['product_id'] = sd.product_id;
      // console.log(submitData)
      this.enquerySubmit(submitData);
    }
    if(this.formNumber == 2) {
      let submitData = {
        order_value: fd.order_value,
        currency: fd.currency,
        required_frequency: fd.required_frequency,
        quote_from_others: fd.quote_from_others ? 1 : 0,
        enquery_id: this.enquiryResponse.enquery_id,
        screen: 'screen2',
        enquery_type: sd.env,
      };
      console.log(submitData)
      this.enquerySubmit(submitData);
    }

  }
  
  enquiryResponse: any;
  enquerySubmit(submitData: any) {
    this.rfqService.enquerySubmitV2(submitData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.toastr.success("Submit Form Successfully");
          if(this.formNumber == 1) {
            this.formNumber++;
            this.enquiryResponse = res.data;
            if(this.containsBuyerDetails && this.containsSellerDetails) {
              console.info('Update function to  firebase called');
              this.updateData(res.data);
            } else {
              console.error('Missing either seller or Buyer Details')
            }
          }
          else {
            this.openConfirmation();
          }         
        } else {
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

  get Description() {
    return this.form.get('description');
  }

  description: string = "";
  addSentenceToDescription(sentence: string) {
    let index = this.description.indexOf(sentence);
    if(index >= 0) {
      let desc = this.description.split("");
      desc.splice(index, sentence.length + 1);
      this.description = desc.join("")
    } else {
      this.description = this.description + sentence + "\n"
    }
    // this.description = this.Description?.value +  sentence + '\n' 
    this.form.patchValue({
      description: this.description
    })
  }
}
