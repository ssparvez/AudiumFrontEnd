import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ConfirmComponent} from "../../confirm-modal/confirm.component";
import {AppError} from "../../../errors/AppError";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../../services/general/general.service";
import {Genre} from "../../../classes/Genre";

@Component({
  selector: 'app-content-add',
  templateUrl: './content-add.component.html',
  styleUrls: ['./content-add.component.css']
})
export class ContentAddComponent implements OnInit {

  public toDelete:boolean;
  public toAdd:boolean;
  public contentAddCheck = true;
  public title: String;
  public contentIdToDelete = {contentId: ""};
  public contentTypeToDelete: string;

  // FOR SONG //
  public genres: Genre[];
  public sT = "";
  @ViewChild('form') public form;

  constructor(private dialogRef:MatDialogRef<ContentAddComponent>,
              private service: GeneralService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data:{adminId: number, toDelete:boolean, toAdd:boolean,
                contentType?:string }) {}

  ngOnInit() {
    console.log(this.data);
    this.toDelete = this.data.toDelete;
    this.toAdd = this.data.toAdd;
    this.contentTypeToDelete = this.data.contentType;
    if ( this.data.contentType === 'Song' ) {
      this.initializeSongDialog();
      if (this.toAdd) {
        this.loadGenres();
      }
    }
    if ( this.data.contentType === 'Playlist' ) {
      this.initializePlaylistDialog();
    }
    if ( this.data.contentType === 'Album' ) {
      this.initializeAlbumDialog();
    }
  }

  addContent() {
    let values;
    if ( this.form.valid) {
      if ( this.data.contentType === 'Song') {
        const dateString = this.form.value.year + '-01-01';
        values = {
          title: this.form.value.title,
          file: 'music/' + this.form.value.title.replace(/\s+/g, '') + '.mp3',
          year: new Date(dateString),
          genre: {genreId: this.form.value.genre},
          isExplicit: this.form.value.isExplicit,
          duration: this.form.value.duration,
          artistId: this.form.value.artist
        };
      }
      if ( this.data.contentType === 'Playlist') {
        values = { name: this.form.value.playlist, isPublic: true, creator: {accountId: 1}};
      }

      if ( this.data.contentType === 'Album') {
        const dateString = this.form.value.year + '-01-01';
        values = { albumTitle: this.form.value.title,
          releaseYear: new Date(dateString),
          artist: {artistId: this.form.value.artist} };
      }
        console.log(values);
        this.service.post('/admin/' + this.data.adminId + '/' + this.contentTypeToDelete.toLowerCase()
          + '/add',values).subscribe(
          response => {
            console.log(response);
            this.closeDialog(response);
          }, (error: AppError) => {
          }
        );
      }
    }

  deleteContent() {
    this.dialog.open(ConfirmComponent, {
      data: {
        message: "Are you sure you want to delete this " + this.contentTypeToDelete.toLowerCase() + '?'
      }, height: '180px'
    }).afterClosed()
      .subscribe( confirm => {
        if ( confirm) {
          if ( this.contentIdToDelete.contentId !== "") {
            this.service.deleteResource('/admin/' + this.data.adminId + '/' + this.contentTypeToDelete.toLowerCase()
              + '/' + this.contentIdToDelete.contentId + '/delete').subscribe(
              response => {
                this.closeDialog(true);
              }, (error: AppError) => {
              }
            );
          }
        }
      });
  }

  addSongToPlaylist() {

  }

  private initializeSongDialog(): void {
    if (this.toDelete) {
      this.title = "Delete a Song";
    }
    if ( this.toAdd) {
      this.title = "Add a Song";
    }
  }

  private initializePlaylistDialog(): void {
    if (this.toDelete) {
      this.title = "Delete a Playlist";
    }
    if ( this.toAdd) {
      this.title = "Add a Playlist";
    }
  }
  private initializeAlbumDialog(): void {
    if (this.toDelete) {
      this.title = "Delete an Album";
    }
    if ( this.toAdd) {
      this.title = "Add an Album";
    }
  }

  private loadGenres() {
    this.service.get('/genres/all').subscribe(
      response => {
        this.genres = response;
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

interface SongToAdd {
  name: string;
  year: number;
  genre: { genreId: number};
  isExplicit: boolean;
  duration: string;
}
