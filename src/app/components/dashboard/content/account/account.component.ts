import { Component, OnInit } from '@angular/core';
import {CustomerAccount} from "../../../../classes/customer-account.service";
import { PaymentInfoComponent } from "../../../../modals/payment-info/payment-info.component";
import {DataService} from "../../../../services/data.service";
import {GeneralService} from "../../../../services/general/general.service";
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {AppError} from "../../../../errors/AppError";
import {NotFoundError} from "../../../../errors/not-found-error";
import {MdDialog} from "@angular/material";

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
               private dialog: MdDialog) { }

  ngOnInit() {
    if ( this.currentUser.accountId == null) {
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));
      this.currentUser.profilePicURL = this.dataService.profilePic + this.currentUser.accountId + '.png';
    }
  }


  openDialog() {

    this.dialog.open(PaymentInfoComponent, { width: '400px'})
      .afterClosed()
      .subscribe(result => {});
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

      this.service.update('/editcustomer',values).subscribe(
        response => {
          let result = {
            token: response['_body']
          };
          if ( result && result.token) {
            localStorage.setItem('token', result.token);
            this.authService.storeInfo();
            this.toEditProfile = false;
          } else {
          }
        }, (error: AppError) => {

          if ( error instanceof NotFoundError) {
            console.log("working");
          }

          });
  }

}


