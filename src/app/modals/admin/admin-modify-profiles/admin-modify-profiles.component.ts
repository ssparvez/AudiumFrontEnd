import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {MzToastService} from "ng2-materialize";
import {GeneralService} from "../../../services/general/general.service";
import {Artist} from "../../../classes/Artist";
import {ConfirmComponent} from "../../confirm-modal/confirm.component";
import {AppError} from "../../../errors/AppError";

@Component({
  selector: 'app-admin-modify-profiles',
  templateUrl: './admin-modify-profiles.component.html',
  styleUrls: ['./admin-modify-profiles.component.css']
})
export class AdminModifyProfilesComponent implements OnInit {

  private artist: Artist;
  private title: string;
  private account: any;

  constructor(private dialogRef:MatDialogRef<AdminModifyProfilesComponent>,
              private dialog: MatDialog,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data:{ adminId: number, accountType: string, account: any}) { }

  ngOnInit() {
    if ( this.data.accountType === 'Artist') {
      this.artist = this.data.account;
      this.title = 'Modify Artist';
    }
  }

  updateInfo() {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to update?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if ( confirm) {
          this.service.update('/admin/' + this.data.adminId + '/' + this.data.accountType.toLowerCase() + '/' + this.artist.artistId +
          '/update',this.artist).subscribe(
            response => {
              this.closeDialog(true);
            }, (error: AppError) => {
              this.toastService.show("There was an error updating", 3000, 'red');
            }
          );
        }
      });
  }


  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
