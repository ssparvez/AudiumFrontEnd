import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../services/general/general.service";
import {AppError} from "../../../errors/AppError";
import {ConfirmComponent} from "../../confirm-modal/confirm.component";
import {isUndefined} from "util";
import {MzToastService} from "ng2-materialize";


@Component({
  selector: 'app-delete-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public toDeleteAccount:boolean;
  public toAddAccount:boolean;
  public toBanAccount: boolean;
  public toUnbanAccount: boolean;
  public registrationCheck = true;
  public title: String;
  public accountIdToUse: string;
  public fN: string;
  public lN: string;
  now = new Date();
  @ViewChild('form') public form;
  public dateOptions: Pickadate.DateOptions = {
    clear: 'Clear', // Clear button text
    today: '',
    close: 'Ok',
    format: 'mmm dd, yyyy',
    formatSubmit: 'yyyy-mm-dd',
    selectMonths: true,
    selectYears: 120,
    max: new Date(this.now.getFullYear() - 13, this.now.getMonth(), this.now.getDate())
    };

  constructor(private dialogRef:MatDialogRef<AccountsComponent>,
              private service: GeneralService,
              private dialog: MatDialog,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data:{adminId: number, toDeleteAccount: boolean, toaddAccount: boolean,
              toBanAccount: boolean, toUnbanAccount}) {
  }

  ngOnInit() {
    this.toDeleteAccount = this.data.toDeleteAccount;
    this.toAddAccount = this.data.toaddAccount;
    this.toBanAccount = this.data.toBanAccount;
    this.toUnbanAccount = this.data.toUnbanAccount;

    if (this.toDeleteAccount) {
      this.title = "Delete an Account";
    }
    if ( this.toAddAccount) {
      this.title = "Add an Account";
    }
    if ( this.toBanAccount) {
      this.title = "Ban an Account";
    }
    if ( this.toUnbanAccount) {
      this.title = "Unban an Account";
    }

  }

  createAccount() {
    if (  this.form.valid) {
      this.dialog.open(ConfirmComponent, {
        data: {
          message: "Are you sure you want to create this account?"
        }, height: '180px'
      }).afterClosed()
        .subscribe( confirm => {
          if (confirm) {
            this.service.post('/register',this.form.value).subscribe(
              response => {
                this.registrationCheck = true;
                this.closeDialog(true);
              }, ( error: AppError) => {
                this.registrationCheck = false;
              }
            );
          }
          console.log(this.form.value);
        });
    }
  }

  deleteAccount() {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this account?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if ( confirm) {
          if ( this.accountIdToUse !== "" || this.accountIdToUse !== undefined ) {
            this.service.deleteResource('/admin/' + this.data.adminId + '/accounts/' + this.accountIdToUse
              + '/delete').subscribe(
              response => {
                this.closeDialog(true);
              }, (error: AppError) => {
                this.toastService.show("Account could ot be deleted", 3000, 'red');
              }
            );
          }
        }
      });
  }

  changeBanStatus(status) {
    let message = "";
    if ( status) {
      message = "Are you sure you want to ban this account?";
    } else {
      message = "Are you sure you want to unban this account?";
    }
    this.dialog.open(ConfirmComponent, {
      data: {
        message: message
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if (confirm) {
          this.service.update('/admin/' + this.data.adminId + '/accounts/' + this.accountIdToUse
            + '/banstatus/' + status, "").subscribe(
            response => {
              this.closeDialog(true);
            }, (error: AppError) => {
              this.toastService.show("Account ban status could not be changed", 3000, 'blue');
            }
          );
        }
      });
  }

  formatFirstLetterFN() {
    console.log(this.fN);
    const value = this.fN;
    if ( value !== undefined) {
      this.fN = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }

  formatFirstLetterLN() {
    const value = this.lN;
    if ( value !== undefined) {
      this.lN = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }
}
