import { Component, OnInit } from '@angular/core';
import { AppError } from '../../../../../errors/AppError';
import { NotFoundError } from '../../../../../errors/not-found-error';
import { ConfirmComponent } from '../../../../../modals/confirm-modal/confirm.component';
import { ChangePasswordComponent } from '../../../../../modals/change-password/change-password.component';
import { PaymentInfoComponent } from '../../../../../modals/payment-info/payment-info.component';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MzToastService } from 'ng2-materialize';
import { AuthenticationService } from '../../../../../services/authentication/authentication.service';
import { GeneralService } from '../../../../../services/general/general.service';
import { DataService } from '../../../../../services/data.service';
import { ArtistAccount } from '../../../../../classes/ArtistAccount';

@Component({
  selector: 'app-artist-account',
  templateUrl: './artist-account.component.html',
  styleUrls: ['./artist-account.component.css']
})
export class ArtistAccountComponent implements OnInit {
  public toEditProfile = false;

  constructor( private router: Router,
               private currentUser: ArtistAccount,
               private dataService:DataService,
               private service: GeneralService,
               private authService: AuthenticationService,
               private dialog: MatDialog,
               private toastService: MzToastService) { }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    if ( this.currentUser.accountId == null) {
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));      
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

  openDeleteAccountDialog() {
    this.dialog.open(ConfirmComponent, {  data: {message: "Are you sure you want to delete your account?"}, height: '180px'})
    .afterClosed()
    .subscribe(
      result => {
        if(result) {
          this.dialog.open(ConfirmComponent, {  data: {message: "Are you really sure you want to?"}, height: '180px'})
          .afterClosed()
          .subscribe(
            result => {
              if(result) {
                this.service.deleteResource('/accounts/'+ this.currentUser.accountId).subscribe(
                  response => {
                    if(response) {
                      this.router.navigate(['']);
                    }
                  },
                  (error: AppError) => {
                    this.toastService.show("There was an error. Please try again.", 3000, 'red');
                  }
                );
              }
            }
          );
        }
      }
    );
  }

  downgradeAccount() {
    this.dialog.open(ConfirmComponent, {  data: {message: "Are you sure you want to downgrade?"}, height: '180px'})
      .afterClosed()
      .subscribe(
        result => {
          if(result) {
            this.service.deleteResource('/accounts/' + this.currentUser.accountId + '/downgrade').subscribe(
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

            this.toastService.show("There was an error. Please try again.", 3000, 'red');
            if (error instanceof NotFoundError) {
                console.log("working");
            }

        });
  }



}
