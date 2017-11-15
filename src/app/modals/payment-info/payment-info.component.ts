import {Component, Inject, OnInit} from '@angular/core';
import {MdDialogRef,  MD_DIALOG_DATA} from "@angular/material";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";
import {PaymentInfo} from "../../classes/PaymentInfo";
import {CustomerAccount} from "../../classes/customer-account.service";
import {MzToastService} from "ng2-materialize/dist";

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent  implements  OnInit {

  months: number[] = [1, 2, 3, 4, 5 ,6 ,7 ,8 ,9, 10, 11, 12];
  years: number[] = [];
  accountId: number;
  private paymentInfo: PaymentInfo;
  isNew: boolean;
  title: string;
  buttonName: string;
  validInfo = true;

  constructor(private dialogRef:MdDialogRef<PaymentInfoComponent>,
              private currentUser: CustomerAccount,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MD_DIALOG_DATA) private data: { isNew: boolean }) {}

  ngOnInit() {
    this.loadDate();
    this.accountId = this.currentUser.accountId;
    this.isNew = this.data.isNew;
    this.paymentInfo = new PaymentInfo("","","","","");
    if ( this.isNew === false) {
      this.loadPaymentInfo();
    } else {
      this.loadEmpty();
    }
  }


  loadDate() {
    const year = new Date().getFullYear();
    let i;
    for( i = year; i < year+5; i++) {

      this.years.push(i);}
  }

  submitPaymentInfo() {
      const data = {
        accountId: this.accountId,
        creditcardexpire: this.paymentInfo.ccExprYear + '-' + this.paymentInfo.ccExprMonth + '-01',
        zipCode: this.paymentInfo.zipCode,
        creditcardhash: this.paymentInfo.ccNumber
      };
    if ( this.isNew === true) {

      this.service.post('/upgrade',data).subscribe(
        response => {
          console.log(response);
          const result = {
            token: response.token
          };
          if (result && result.token) {
            localStorage.setItem('token', response.token);
            this.currentUser.role = "PremiumUser";
            this.toastService.show("Your membership has been upgraded!", 3000, 'blue');
            this.closeDialog();
          } else {
            this.validInfo = false;
          }
        },
        (error: AppError) => {
          this.validInfo = false;
        }
      );
    } else {
      this.service.update('/editpaymentinfo', data).subscribe(
        response => {
          console.log(response);
          this.toastService.show("Your payment info was changed", 3000, 'blue');
          this.closeDialog();
        },
        (error: AppError) => {
          this.validInfo = false;
        }
      );
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadPaymentInfo() {
    this.service.get('/paymentinfo/' + this.accountId ).subscribe(
      response => {
        const info = response;
        console.log(info);
        console.log(info['ccYear']);
        this.title = "Edit Payment Info";
        this.buttonName = "Submit";
        this.paymentInfo = new PaymentInfo(
            info.ccNumber, info.ccMonth,
            info.ccYear, info.zipCode
          );
        console.log(this.paymentInfo.ccExprYear);
      }, (error: AppError) => {

        this.closeDialog();
        });
  }

  get PaymentInfo() {
      return this.paymentInfo;
  }

  loadEmpty() {
      this.title = "Add Payment Info";
      this.buttonName = "Upgrade";
  }

}

