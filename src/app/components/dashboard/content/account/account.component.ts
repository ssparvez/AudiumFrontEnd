import { animate, style, transition, trigger } from "@angular/animations";
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CustomerAccount } from "../../../../classes/CustomerAccount";
import { PaymentInfoComponent } from "../../../../modals/payment-info/payment-info.component";
import { DataService } from "../../../../services/data.service";
import { GeneralService } from "../../../../services/general/general.service";
import { AuthenticationService } from "../../../../services/authentication/authentication.service";
import { AppError } from "../../../../errors/AppError";
import { NotFoundError } from "../../../../errors/not-found-error";
import { MzToastService } from "ng2-materialize/dist";
import { ChangePasswordComponent } from "../../../../modals/change-password/change-password.component";
import { ConfirmComponent } from "../../../../modals/confirm-modal/confirm.component";
import { MatDialog } from  "@angular/material";
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from "@angular/router";
import { UserPreferences } from '../../../../classes/UserPreferences';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        animate(500, style({opacity: 1}))
      ]),
      transition('* => void',[
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class AccountComponent implements OnInit {
  public readonly languages: string[] = [ "English", "Spanish", "French", "Chinese" ];
  public readonly streamingQualities: string[] = [ "128kbps", "192kbps", "256kbps", "320kbps", "Lossless" ];
  public readonly profileIcons: string[] = [ 'visibility_off', 'visibility' ];
  public readonly sessionIcons: string[] = [ 'visibility_off', 'visibility' ];
  private readonly now: Date = new Date();
  public unsavedChanges: boolean = false;
  public profileIcon: string = this.profileIcons[1];
  public sessionIcon: string = this.sessionIcons[1];
  public dateOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
    close: 'Ok',
    format: 'mmm dd, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    selectMonths: true,
    selectYears: 120,
    max: new Date(this.now.getFullYear() - 13, this.now.getMonth(), this.now.getDate()),
  };
  public toEditProfile: boolean = false;
  private _privateSession: boolean;
  public readonly premiumUser: string = "PremiumUser";
  public readonly basicUser: string = "BasicUser";

  constructor( private router: Router,
               private currentUser: CustomerAccount,
               private dataService: DataService,
               private service: GeneralService,
               private authService: AuthenticationService,
               private dialog: MatDialog,
               private toastService: MzToastService,
               private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this._privateSession = JSON.parse(sessionStorage.getItem("sessionPrivacy")).private;
    if(this.currentUser == null){
      this.currentUser = new CustomerAccount();
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));
    }
    if (this.currentUser.accountId == null) {
      this.currentUser.loadWithJSON(JSON.parse(sessionStorage.getItem("currentUser")));
      this.currentUser.loadPreferencesWithJSON(JSON.parse(sessionStorage.getItem("preferences")));
      this.currentUser.profilePicURL = this.dataService.mediaURL + "/profiles/" + this.currentUser.accountId + '/Profile.jpg';
    }
    if(this.currentUser.userPreferences == null || this.currentUser.userPreferences.accountId == null) {
      this.currentUser.loadPreferencesWithJSON(JSON.parse(sessionStorage.getItem("preferences")));
      console.log("Current user preferences: " + sessionStorage.getItem("preferences"));
    }
    if(this.currentUser.userPreferences.publicProfile) {
      this.profileIcon = this.profileIcons[1];
    } else {
      this.profileIcon = this.profileIcons[0];
    }
    if(this.privateSession) {
      this.sessionIcon = this.sessionIcons[0];
    } else {
      this.sessionIcon = this.sessionIcons[1];
    }
    console.log("Unsaved user preferences? " + this.checkForUnsavedChanges());
  }

  openNewPaymentDialog() {
    this.dialog.open(PaymentInfoComponent,{ data: {isNew: true}, width: '400px' }, )
      .afterClosed()
      .subscribe(result => {
      });
  }

  openEditPaymentDialog() {
    this.dialog.open(PaymentInfoComponent,{ data: {isNew: false}, width: '400px' } )
      .afterClosed()
      .subscribe(result => {
        if ( result ) {
          this.authService.storeInfo();
        }
      });
  }

  openChangePassDialog() {
    this.dialog.open(ChangePasswordComponent,{ data: {accountId: this.currentUser.accountId},  width: '400px' } )
      .afterClosed()
      .subscribe(result => {
      });
  }

  openDeleteAccountDialog() {
    this.dialog.open(ConfirmComponent, {  data: {message: "Are you sure you want to delete your account?"}, height: '180px' })
    .afterClosed()
    .subscribe(
      result => {
        if(result) {
          this.dialog.open(ConfirmComponent, {  data: {message: "Are you really sure you want to?"}, height: '180px' })
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

  setQuality($event: MouseEvent, i: number): void {
    let changed: string = "set"
    if(this.currentUser.userPreferences.quality != this.streamingQualities[i]) {
      this.currentUser.userPreferences.quality = this.streamingQualities[i];
      changed = "changed";
    }
    console.log("Audio quality " + changed + " to " + this.currentUser.userPreferences.quality);
    this.toastService.show("Audio quality " + changed + " to " + this.currentUser.userPreferences.quality, 3000, 'blue');
    this.checkForUnsavedChanges();
  }

  setLanguage($event: MouseEvent, i: number): void {
    let changed: string = "set"
    if(this.currentUser.userPreferences.language != this.languages[i]) {
      this.currentUser.userPreferences.language = this.languages[i];
      changed = "changed";
    }

    console.log("Language " + changed + " to " + this.currentUser.userPreferences.language);
    switch(this.currentUser.userPreferences.language) {
      case "English":
        this.toastService.show("Language " + changed + " to " + this.currentUser.userPreferences.language, 3000, 'blue');
        break;
      case "Spanish":
        this.toastService.show("Idioma cambiado a español", 3000, 'blue');
        break;
      case "French":
        this.toastService.show("Langue changée en français", 3000, 'blue');
        break;
      case "Chinese":
        this.toastService.show("语言变成了中文", 3000, 'blue');
        break;
      default:
        this.toastService.show("Error: Unknown language", 3000, 'red');
        this.currentUser.userPreferences.language = "English";
        break;
    }
    //this.toastService.show("Language " + changed + " to " + this.currentUser.userPreferences.language, 3000, 'blue');
    this.checkForUnsavedChanges();
  }

  getLanguage(): string {
    return this.languages[this.languages.indexOf(this.currentUser.userPreferences.language)];
  }

  getQuality(): string {
    return this.streamingQualities[this.streamingQualities.indexOf(this.currentUser.userPreferences.quality)];
  }

  checkForUnsavedChanges(): boolean {
    let prefCheck: UserPreferences = new UserPreferences();
    prefCheck.loadWithJSON(JSON.parse(sessionStorage.getItem("preferences")));

    this.unsavedChanges = (prefCheck.publicProfile != this.currentUser.userPreferences.publicProfile
            || prefCheck.showExplicitContent != this.currentUser.userPreferences.showExplicitContent
            || prefCheck.defaultPublicSession != this.currentUser.userPreferences.defaultPublicSession
            || prefCheck.language != this.currentUser.userPreferences.language
            || prefCheck.quality != this.currentUser.userPreferences.quality);
    this.cdRef.detectChanges();
    return this.unsavedChanges;
  }

  savePreferences(forceSave: boolean): void {
    if(this.checkForUnsavedChanges() || forceSave) {
      console.log("Saving user preferences: " + this.currentUser.userPreferences);
      let requestObject = {
        accountId: this.currentUser.accountId,
        language: this.currentUser.userPreferences.language,
        publicProfile: this.currentUser.userPreferences.publicProfile,
        defaultPublicSession: this.currentUser.userPreferences.defaultPublicSession,
        showExplicitContent: this.currentUser.userPreferences.showExplicitContent,
        quality: this.currentUser.userPreferences.quality,
      };
      this.service.update("/accounts/" + this.currentUser.accountId + "/preferences/update", requestObject).subscribe(
        response => {
          this.toastService.show("Account settings updated", 3000, 'blue');
          localStorage.setItem("preferences", JSON.stringify(requestObject));
          sessionStorage.setItem("preferences", JSON.stringify(requestObject));
          this.checkForUnsavedChanges();
        }, (error: AppError) => {
          this.toastService.show("Unable to update preferences. Try again later.", 3000, 'red');
        }
      );
    }
  }

  togglePrivateProfile($event: MouseEvent): void {
    this.currentUser.userPreferences.publicProfile = !this.currentUser.userPreferences.publicProfile;
    if(this.currentUser.userPreferences.publicProfile) {
      this.profileIcon = this.profileIcons[1];
    } else {
      this.profileIcon = this.profileIcons[0];
    }
    console.log("Profile visibility set to " + (this.currentUser.userPreferences.publicProfile ? "private" : "public"));
    this.toastService.show("Profile visibility set to " + (this.currentUser.userPreferences.publicProfile ? "private" : "public"), 3000, 'blue');
    this.checkForUnsavedChanges();
  }

  togglePrivateSession($event: MouseEvent): void {
    this._privateSession = !this.privateSession;
    if(this.privateSession) {
      this.sessionIcon = this.sessionIcons[0];
    } else {
      this.sessionIcon = this.sessionIcons[1];
    }
    localStorage.setItem("sessionPrivacy", JSON.stringify( {private: this.privateSession} ));
    sessionStorage.setItem("sessionPrivacy", JSON.stringify( {private: this.privateSession} ));
    this.checkForUnsavedChanges();
    console.log("Listening session set to " + (this.privateSession ? "private" : "public"));
    this.toastService.show("Listening session set to " + (this.privateSession ? "private" : "public"), 3000, 'blue');
  }

  downgradeAccount(): void {
    this.dialog.open(ConfirmComponent, {  data: {message: "Are you sure you want to downgrade?"}, height: '180px' })
      .afterClosed()
      .subscribe(
        result => {
          if(result) {
            this.service.deleteResource('/accounts/' + this.currentUser.accountId + '/downgrade').subscribe(
              response => {
                if (response && response.token) {
                  localStorage.setItem('token', response.token);
                  this.authService.storeInfo();
                  // Set user preferences to basic settings
                  this.setDefaultUserPreferences(true);
                  this.toastService.show("Your account was downgraded to Basic.", 3500, 'blue');
                } else {
                  this.toastService.show("There was an error. Please try again.", 3000, 'red');
                }
              }, (error: AppError) => {
            });
          }
        }
      );
  }

  public setDefaultUserPreferences(save: boolean): void {
    if(this.privateSession) {
      this.togglePrivateSession(null);
    }
    this.currentUser.userPreferences.defaultPublicSession = true;
    this.currentUser.userPreferences.language = this.languages[0];
    this.currentUser.userPreferences.quality = this.streamingQualities[1];
    this.currentUser.userPreferences.publicProfile = true;
    this.currentUser.userPreferences.showExplicitContent = true;
    if(save) {
      this.savePreferences(true);
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
    values.accountId = this.currentUser.accountId;
    values.role = this.currentUser.role;
    console.log(values);
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
            }
        });
  }

  get privateSession(): boolean {
    return this._privateSession;
  }
}


