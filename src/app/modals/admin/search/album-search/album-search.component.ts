import {Component, Inject, OnInit} from '@angular/core';
import {ConfirmComponent} from "../../../confirm-modal/confirm.component";
import {AppError} from "../../../../errors/AppError";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../../services/general/general.service";
import {MzToastService} from "ng2-materialize";
import {animate, style, transition, trigger} from "@angular/animations";
import {AdminModifyProfilesComponent} from "../../admin-modify-profiles/admin-modify-profiles.component";
import {Album} from "../../../../classes/Album";


@Component({
  selector: 'app-album-search',
  templateUrl: './album-search.component.html',
  styleUrls: ['./album-search.component.css'],
  animations: [
    trigger('fade',[
      transition('* => void',[
        animate(500, style({opacity: 0}))
      ])
    ])
  ]
})
export class AlbumSearchComponent implements OnInit {

  albums: Album[];
  private toDelete: boolean;
  private toAddSong: boolean;
  constructor(private dialogRef:MatDialogRef<AlbumSearchComponent>,
              private dialog: MatDialog,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data:{ adminId: number, toDelete:boolean, toAddSong:boolean}) { }

  ngOnInit() {
    this.toDelete = this.data.toDelete;
    this.toAddSong = this.data.toAddSong;
  }

  onEnter(keywords: string) {

    // this.router.navigate([{outlets: {songResults: ['searchsong']}}],{ queryParams: {keywords: keywords}} );
    this.service.get("/search/albums/" + keywords).subscribe(
      (albums) => {
        console.log(albums);
        this.albums = albums;

      }, (error: AppError) => {
      });
  }

  deleteAlbum(albumIdToDelete, index) {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this album?"
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if ( confirm) {
            this.service.deleteResource('/admin/' + this.data.adminId + '/album/' + albumIdToDelete
              + '/delete').subscribe(
              response => {
                this.albums.splice(index, 1);
                this.toastService.show("Album was deleted", 3000, 'blue');
              }, (error: AppError) => {
                this.toastService.show("Album could not deleted", 3000, 'red');
              }
            );
        }
      });
  }

  pickToAddSong(albumId) {
    this.closeDialog(albumId);
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
