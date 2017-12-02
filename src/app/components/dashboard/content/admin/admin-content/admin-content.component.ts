import { Component, OnInit } from '@angular/core';
import {ContentAddComponent} from "../../../../../modals/admin/content-add/content-add.component";
import {MzToastService} from "ng2-materialize";
import {MatDialog} from "@angular/material";
import {SongSearchComponent} from "../../../../../modals/admin/search/song-search/song-search.component";
import {ContentInputComponent} from "../../../../../modals/admin/search/content-input/content-input.component";
import {AlbumSearchComponent} from "../../../../../modals/admin/search/album-search/album-search.component";

@Component({
  selector: 'app-admin-songs',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.css']
})
export class AdminContentComponent implements OnInit {

  private currentUser;
  private currentAdminId;

  constructor(private dialog: MatDialog,
              private toastService: MzToastService) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAdminId = this.currentUser['_accountId'];
  }

  ngOnInit() {
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

  openDeleteWindow(contentType: string) {
    this.dialog.open(ContentAddComponent, {
      data: {
        adminId: this.currentAdminId,
        toDelete: true,
        contentType: contentType
      }
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.toastService.show( contentType + " was deleted", 3000, 'blue');
        }
      });
  }

  openDeleteSearchWindow(contentType: string) {
    let typeOfSearch;
    if ( contentType === 'Album') {
      typeOfSearch = AlbumSearchComponent;
    }
    this.dialog.open(typeOfSearch, {
      data: {
        adminId: this.currentAdminId,
        toDelete: true,
      }, width: '850px', height: '800px'
    }).afterClosed()
      .subscribe(result => {
        if (result) {
          this.toastService.show( contentType + " was deleted", 3000, 'blue');
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
