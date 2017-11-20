import { Component, OnInit } from '@angular/core';
import {CustomerAccount} from "../../../../classes/customer-account.service";
import { PaymentInfoComponent } from "../../../../modals/payment-info/payment-info.component";
import {DataService} from "../../../../services/data.service";
import {GeneralService} from "../../../../services/general/general.service";
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {AppError} from "../../../../errors/AppError";
import {NotFoundError} from "../../../../errors/not-found-error";
import {MzToastService} from "ng2-materialize/dist";
import {ChangePasswordComponent} from "../../../../modals/change-password/change-password.component";
import {ConfirmComponent} from "../../../../modals/confirm-modal/confirm.component";
import {MatDialog} from  "@angular/material";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public dateOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
    close: 'Ok',
    format: 'mmm dd, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    selectMonths: true,
    selectYears: 100,
    max: new Date()

  };
  public toEditProfile = false;
  public premiumUser = "PremiumUser";
  public basicUser = "BasicUser";

  constructor( private currentUser: CustomerAccount,
               private dataService:DataService,
               private service: GeneralService,
               private authService: AuthenticationService,
               private dialog: MatDialog,
               private toastService: MzToastService) { }

  ngOnInit() {
    if ( this.currentUser.accountId == null) {
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));
      this.currentUser.profilePicURL = this.dataService.profilePic + this.currentUser.accountId + '.png';
    }
  }


  openNewPaymentDialog() {

    this.dialog.open(PaymentInfoComponent,{ data: {isNew: true}, width: '400px'}, )
      .afterClosed()
      .subscribe(result => {
      });
  }

  openEditPaymentDialog() {
      this.dialog.open(PaymentInfoComponent,{ data: {isNew: false}, width: '400px'} )
          .afterClosed()
          .subscribe(result => {
            if ( result ) {
              this.authService.storeInfo();
            }
          });
  }

  openChangePassDialog() {
    this.dialog.open(ChangePasswordComponent,{ data: {accountId: this.currentUser.accountId},  width: '400px'} )
      .afterClosed()
      .subscribe(result => {
      });
  }

  downgradeAccount() {
    this.dialog.open(ConfirmComponent, {  data: {message: "Are you sure you want to downgrade?"}, height: '180px'})
      .afterClosed()
      .subscribe(
        result => {
          if(result) {
            this.service.deleteResource('/downgradeaccount/'+ this.currentUser.accountId).subscribe(
              response => {
                if (response && response.token) {
                  localStorage.setItem('token', response.token);
                  this.authService.storeInfo();
                  this.toastService.show("Your account was downgraded to Basic.", 3500, 'blue');
                } else {
                  this.toastService.show("There was an error. Please try again.", 3000, 'blue');
                }
              }, (error: AppError) => {
            });
          }
        }
      );
  }


  getCurrentUser() {
      return this.currentUser;
  }

  editProfile() {
      this.toEditProfile = true;
  }
  cancelEditProfile() {
      this.toEditProfile = false;
  }

  submitEditProfile(values) {
    values.accountId = this.currentUser.accountId;
    values.role = this.currentUser.role;
    this.service.update('/editcustomer', values).subscribe(
        response => {
          console.log(response);
            const result = {
                token: response.token
            };
            if (result && result.token) {
                localStorage.setItem('token', result.token);
                this.authService.storeInfo();
                this.toastService.show("Your Profile info was saved.", 3500, 'blue');
                this.toEditProfile = false;
            } else {
              this.toastService.show("There was an error. Please try again.", 3000, 'blue');
            }
        }, (error: AppError) => {

            this.toastService.show("There was an error. Please try again.", 3000, 'blue');
            if (error instanceof NotFoundError) {
                console.log("working");
            }

        });
  }


}


