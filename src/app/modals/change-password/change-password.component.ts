import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {MzToastService} from "ng2-materialize/dist";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  validInfo = true;

  constructor(private dialogRef:MdDialogRef<ChangePasswordComponent>,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MD_DIALOG_DATA) private data: {accountId: number}) { }

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

