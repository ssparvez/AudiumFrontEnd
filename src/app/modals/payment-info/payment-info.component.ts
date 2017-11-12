import {Component, Inject, OnInit} from '@angular/core';
import {MdDialogRef} from "@angular/material";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";
import {PaymentInfo} from "../../classes/PaymentInfo";

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent {

  months: number[] = [1, 2, 3, 4, 5 ,6 ,7 ,8 ,9, 10, 11, 12];
  years: number[] = [];
  accountId: number;

  constructor(private dialogRef:MdDialogRef<PaymentInfoComponent>,
              private service: GeneralService,
              private paymentInfo: PaymentInfo) {
    this.loadDate();
    this.accountId = JSON.parse(sessionStorage.getItem('currentUser'))._accountId;
}

  loadDate() {
    const year = new Date().getFullYear();
    let i;
    for( i = year; i < year+10; i++) {

      this.years.push(i);}
  }

  submitPaymentInfo(values) {
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  loadPaymentInfo() {
    this.service.get('/paymentinfo', {accountId: this.accountId} ).subscribe(
      response => {
        const info = response._body;
        // this.paymentInfo.ccNumber
      }, (error: AppError) => {

      });
  }


}
