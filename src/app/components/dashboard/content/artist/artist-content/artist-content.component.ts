import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MzToastService } from 'ng2-materialize';
import { ContentAddComponent } from '../../../../../modals/admin/content-add/content-add.component';
import { AlbumSearchComponent } from '../../../../../modals/admin/search/album-search/album-search.component';
import { ContentInputComponent } from '../../../../../modals/admin/search/content-input/content-input.component';
import { SongSearchComponent } from '../../../../../modals/admin/search/song-search/song-search.component';
import { Album } from '../../../../../classes/Album';
import { GeneralService } from '../../../../../services/general/general.service';
import { environment } from '../../../../../../environments/environment';
import { AppError } from '../../../../../errors/AppError';
import { ConfirmComponent } from '../../../../../modals/confirm-modal/confirm.component';

@Component({
  selector: 'app-artist-content',
  templateUrl: './artist-content.component.html',
  styleUrls: ['./artist-content.component.css']
})
export class ArtistContentComponent implements OnInit {
  editMode = false;
  albums: Album[]
  private currentUser;
  private currentAdminId;
  mediaPath: string;

  constructor(private dialog: MatDialog,
              private toastService: MzToastService,
              private generalService: GeneralService) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    if(this.currentUser != null){
      this.currentAdminId = this.currentUser['_accountId'];
    }
  }

  ngOnInit() {
    this.mediaPath = environment.mediaURL;
    this.generalService.get("/artists/accounts/" + this.currentUser['_accountId'] + "/albums").subscribe((albums) => {
      this.albums = albums;
      console.log(albums);
      // Get artist albums
    });  }

  deleteAlbum(albumId: number) {
    this.dialog.open(ConfirmComponent, {  data: {message: "Are you sure you want to delete this album?"}, height: '180px'})
    .afterClosed()
    .subscribe(
      result => {
        if(result) {
          this.generalService.delete("adasdasd").subscribe(
            response => {
            }, (error: AppError) => {
          });
        }
      }
    );
  }

  openAddWindow(contentType: string) {
    this.dialog.open(ContentAddComponent, {
      data: {
        adminId: this.currentAdminId,
        toAdd: true,
        contentType: contentType
      }
    }).afterClosed()
      .subscribe(contentToEdit => {
        if (contentToEdit) {
          this.toastService.show( contentType + " was added", 3000, 'blue');
          console.log(contentToEdit);
          if ( contentType === 'Playlist') {
            this.openSongSearch(contentToEdit, contentType);
          } else
            if (contentType === 'Album') {
              this.openSongSearch(contentToEdit, contentType);
          }
        }
      });
  }

  openAddSearchWindow(contentType: string) {
    let typeOfSearch;
    if ( contentType === 'Album') {
      typeOfSearch = AlbumSearchComponent;
    }
    this.dialog.open(typeOfSearch, {
      data: {
        adminId: this.currentAdminId,
        toAddSong: true,
      }, width: '850px', height: '800px'
    }).afterClosed()
      .subscribe(contentToEdit => {
        if (contentToEdit) {
          this.openSongSearch(contentToEdit, contentType);
        }
      });
  }

  openAddSongToContent(contentType) {
    this.dialog.open(ContentInputComponent, {
      data: {
        adminId: this.currentAdminId,
        contentType: contentType
      }
    }).afterClosed()
      .subscribe(contentToEdit => {
        if ( contentToEdit) {
          this.openSongSearch(contentToEdit, contentType);
        }
      });
  }


  openSongSearch(contentToEdit, contentType) {
    if (contentToEdit) {
      this.dialog.open(SongSearchComponent, {
        data: {
          adminId: this.currentAdminId,
          contentId: contentToEdit,
          contentType: contentType
        }, width: '850px', height: '800px',
      }).afterClosed()
        .subscribe(result => {
        });
    }
  }

  

}
