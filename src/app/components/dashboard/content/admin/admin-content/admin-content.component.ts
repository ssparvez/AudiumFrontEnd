import { Component, OnInit } from '@angular/core';
import {ContentAddComponent} from "../../../../../modals/admin/content-add/content-add.component";
import {MzToastService} from "ng2-materialize";
import {MatDialog} from "@angular/material";
import {SongSearchComponent} from "../../../../../modals/admin/search/song-search/song-search.component";
import {ContentInputComponent} from "../../../../../modals/admin/search/content-input/content-input.component";

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
            this.openAddOptions(contentToEdit, contentType);
          } else
            if (contentType === 'Album') {
              this.openAddOptions(contentToEdit, contentType);
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

  openAddSongToPlaylistWindow() {
    this.dialog.open(ContentInputComponent, {
      data: {
        adminId: this.currentAdminId,
        contentType: 'Playlist'
      }
    }).afterClosed()
      .subscribe(contentToEdit => {
        if ( contentToEdit) {
          this.openAddOptions(contentToEdit, 'Playlist');
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
          this.openAddOptions(contentToEdit, contentType);
        }
      });
  }


  openAddOptions(contentToEdit, contentType) {
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
