import {Component, Inject, OnInit} from '@angular/core';
import {MzToastService} from "ng2-materialize/dist";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  validInfo = true;

  constructor(private dialogRef:MatDialogRef<ChangePasswordComponent>,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data: {accountId: number}) { }

  ngOnInit() {

  }

  submitPassChange(values) {
    this.service.update('/changepassword/' + this.data.accountId, values).subscribe(
      response => {
        this.toastService.show("Your password was changed", 3000, 'blue');
        this.closeDialog();
      }, (error: AppError) => {
        this.validInfo = false;
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }


}

