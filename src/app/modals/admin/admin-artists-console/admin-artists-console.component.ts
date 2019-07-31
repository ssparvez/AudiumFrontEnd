import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../services/general/general.service";
import {ConfirmComponent} from "../../confirm-modal/confirm.component";
import {AppError} from "../../../errors/AppError";

@Component({
  selector: 'app-admin-artists-console',
  templateUrl: './admin-artists-console.component.html',
  styleUrls: ['./admin-artists-console.component.css']
})
export class AdminArtistsConsoleComponent implements OnInit {

  public toDeleteArtist:boolean;
  public toAddArtist:boolean;
  public title:string;
  public sT: string;
  private contentAddCheck = true;

  // FOR ADDING //
  private labels: any[];

  // For Deleting //

  private artistIdToDelete: string;

  @ViewChild('form') public form;
  constructor(private dialogRef:MatDialogRef<AdminArtistsConsoleComponent>,
              private service: GeneralService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data:{adminId: number, toDeleteArtist: boolean, toAddArtist: boolean}) { }

  ngOnInit() {
    this.toAddArtist = this.data.toAddArtist;
    this.toDeleteArtist = this.data.toDeleteArtist;

    if (this.toDeleteArtist) {
      this.title = "Delete an Artist";
    }
    if (this.toAddArtist) {
      this.title = "Add an Artist";
      this.loadLabels();
    }
  }

  createArtist() {
    if (  this.form.valid) {
      this.dialog.open(ConfirmComponent, {
        data: {
          message: "Are you sure you want to create this artist?"
        }, height: '180px'
      }).afterClosed()
        .subscribe( confirm => {
          if (confirm) {
            const artist = {artistName: this.form.value.ArtistName, bio: this.form.value.bio,
              label: {accountId: this.form.value.label }};
            console.log(artist);
            this.service.post('/admin/' + this.data.adminId + '/artists/label/' + this.form.value.label +
              '/create', artist).subscribe(
              response => {
                this.contentAddCheck = true;
                this.closeDialog(true);
              }, ( error: AppError) => {
                this.contentAddCheck = false;
              }
            );
          }
        });
    }
  }

  deleteArtist() {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this artist?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if ( confirm) {
          if ( this.artistIdToDelete !== "") {
            this.service.delete('/admin/' + this.data.adminId + '/artists/' + this.artistIdToDelete
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
  private loadLabels() {
    this.service.get('/labels/all').subscribe(
      response => {
        this.labels = response;
      }, (error: AppError) => {
      }
    );
  }

  formatFirstLetter(value) {
    const values = value;
    if ( value !== undefined) {
      value = values.charAt(0).toUpperCase() + values.slice(1);
    }
    return value;
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }
}
