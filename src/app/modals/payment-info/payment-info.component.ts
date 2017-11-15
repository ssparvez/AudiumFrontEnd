import {Component, Inject, OnInit} from '@angular/core';
import {MdDialogRef,  MD_DIALOG_DATA} from "@angular/material";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";
import {PaymentInfo} from "../../classes/PaymentInfo";
import {CustomerAccount} from "../../classes/customer-account.service";

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent {

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
              @Inject(MD_DIALOG_DATA) private data: { isNew: boolean }) {

    this.loadDate();
    this.accountId = this.currentUser.accountId;
    this.isNew = this.data.isNew;
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
    if ( this.isNew === true) {
      const data = {
        accountId: this.accountId,
        creditcardexpire: this.paymentInfo.ccExprYear + '-' + this.paymentInfo.ccExprMonth + '-01',
        zipCode: this.paymentInfo.zipCode,
        creditcardhash: this.paymentInfo.ccNumber
      };
      console.log(data);
      this.service.post('/upgrade',data).subscribe(
        response => {
          response = response['_body'];
          const result = {
            token: response
          };
          if (result && result.token) {
            localStorage.setItem('token', result.token);
            this.currentUser.role = "PremiumUser";
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

    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadPaymentInfo() {
    this.service.get('/paymentinfo' + this.accountId ).subscribe(
      response => {
        const info = response['_body'];
        this.title = "Edit Payment Info";
        this.buttonName = "Submit";
        this.paymentInfo = new PaymentInfo(
            info.ccNumber, info.ccMonth,
            info.ccYear, info.CCV,
            info.zipCode
          );
      }, (error: AppError) => {
        });
  }

  get PaymentInfo() {
      return this.paymentInfo;
  }

  loadEmpty() {
      this.title = "Add Payment Info";
      this.buttonName = "Upgrade";
      this.paymentInfo = new PaymentInfo("","","","","");
  }

}

