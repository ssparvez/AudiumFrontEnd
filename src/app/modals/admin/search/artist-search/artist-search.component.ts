import {Component, Inject, OnInit} from '@angular/core';
import {ConfirmComponent} from "../../../confirm-modal/confirm.component";
import {AppError} from "../../../../errors/AppError";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../../services/general/general.service";
import {MzToastService} from "ng2-materialize";
import {Artist} from "../../../../classes/Artist";
import {animate, style, transition, trigger} from "@angular/animations";
import {AdminModifyProfilesComponent} from "../../admin-modify-profiles/admin-modify-profiles.component";

@Component({
  selector: 'app-artist-search',
  templateUrl: './artist-search.component.html',
  styleUrls: ['./artist-search.component.css'],
  animations: [
    trigger('fade',[
      transition('* => void',[
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class ArtistSearchComponent implements OnInit {

  artists: Artist[];
  private toDelete: boolean;

  constructor(private dialogRef:MatDialogRef<ArtistSearchComponent>,
              private dialog: MatDialog,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data:{ adminId: number, toDelete:boolean}) { }

  ngOnInit() {
    this.toDelete = this.data.toDelete;
  }

  onEnter(keywords: string) {

    // this.router.navigate([{outlets: {songResults: ['searchsong']}}],{ queryParams: {keywords: keywords}} );
    this.service.get("/search/artists/" + keywords).subscribe(
      (artists) => {
        console.log(artists);
        this.artists = artists;
      }, (error: AppError) => {
      });
  }

  deleteArtist(artistIdToDelete, index) {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this artist?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if ( confirm) {
          if ( artistIdToDelete !== "") {
            this.service.delete('/admin/' + this.data.adminId + '/artist/' + artistIdToDelete
              + '/delete').subscribe(
              response => {
                this.artists.splice(index, 1);
                this.toastService.show("Artist was deleted", 3000, 'blue');
              }, (error: AppError) => {
                this.toastService.show("Artist could not deleted", 3000, 'red');
              }
            );
          }
        }
      });
  }

  openProfileEdit(accountToEdit) {
    this.dialog.open(AdminModifyProfilesComponent, {
      data: {
        adminId: this.data.adminId,
        accountType: 'Artist',
        account: accountToEdit
      }, width: "500px"
    }).afterClosed()
      .subscribe( result => {
        if (result) {
          this.toastService.show("Info was updated", 3000, 'blue');
        }
      });
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
