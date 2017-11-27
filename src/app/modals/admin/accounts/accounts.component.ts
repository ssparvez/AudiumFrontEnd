import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../services/general/general.service";
import {AppError} from "../../../errors/AppError";
import {ConfirmComponent} from "../../confirm-modal/confirm.component";
import {isUndefined} from "util";


@Component({
  selector: 'app-delete-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public toDeleteAccount:boolean;
  public toAddAccount:boolean;
  public title: String;
  public accountIdToDelete = {accountId: ""};
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
              @Inject(MAT_DIALOG_DATA) private data:{adminId: number, toDeleteAccount: boolean, toaddAccount: boolean}) {
  }

  ngOnInit() {
    this.toDeleteAccount = this.data.toDeleteAccount;
    this.toAddAccount = this.data.toaddAccount;

    if (this.toDeleteAccount) {
      this.title = "Delete an Account";
    }
    if ( this.toAddAccount) {
      this.title = "Add an Account";
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
                this.closeDialog(true);
              }, ( error: AppError) => {
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
          if ( this.accountIdToDelete.accountId !== "") {
            this.service.deleteResource('/admin/' + this.data.adminId + '/accounts/' + this.accountIdToDelete.accountId
              + '/delete').subscribe(
              response => {
                this.closeDialog(true);
              }, (error: AppError) => {
              }
            );
          }
        }
      });
  }

  formatFirstLetterFN() {
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
