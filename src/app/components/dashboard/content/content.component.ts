import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CustomerAccount } from '../../../classes/CustomerAccount';
import { PaymentInfoComponent } from '../../../modals/payment-info/payment-info.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {
  currentUser: CustomerAccount;
  isHidden = false;

  constructor(private router: Router, private dialog: MatDialog) { }

  ngOnInit() {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    console.log(this.currentUser)
  }

  onEnter(keywords: string) {
    this.router.navigate(['/dash/search/', keywords]);
    console.log(keywords);
  }

  openNewPaymentDialog() {
        this.dialog.open(PaymentInfoComponent,{ data: {isNew: true}, width: '400px'}, )
          .afterClosed()
          .subscribe(result => {
          });
      }
}
