import { Component, OnInit } from '@angular/core';
import {CustomerAccount} from "../../../../classes/customer-account.service";
import {DataService} from "../../../../services/data.service";
import {AuthHttp} from "angular2-jwt";
import {GeneralService} from "../../../../services/general/general.service";
import {AuthenticationService} from "../../../../services/authentication/authentication.service";
import {AppError} from "../../../../errors/AppError";
import {NotFoundError} from "../../../../errors/not-found-error";

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
  toEditProfile = false;

  constructor( private currentUser: CustomerAccount,
               private dataService:DataService,
               private service: GeneralService,
                private authService: AuthenticationService) { }

  ngOnInit() {
    if ( this.currentUser.accountId == null) {
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));
      this.currentUser.profilePicURL = this.dataService.profilePic + this.currentUser.accountId + '.png';
    }
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
    values.accountid = this.currentUser.accountId;
    values.role = this.currentUser.role;

      this.service.update('/editcustomer',values).subscribe(
        response => {

          let result = {
            token: response['_body']
          };
          console.log(result);
          if ( result && result.token) {
            localStorage.setItem('token', result.token);
            this.authService.storeInfo();
            this.toEditProfile = false;

          } else {
            return false;
          }
        }, (error: AppError) => {

          if ( error instanceof NotFoundError) {
            console.log("working");
          }

          });
  }

}


