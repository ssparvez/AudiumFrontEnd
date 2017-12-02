import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material";
import {MzToastService} from "ng2-materialize";
import {AdminArtistsConsoleComponent} from "../../../../../modals/admin/admin-artists-console/admin-artists-console.component";
import {ArtistSearchComponent} from "../../../../../modals/admin/search/artist-search/artist-search.component";

@Component({
  selector: 'app-admin-artists',
  templateUrl: './admin-artists.component.html',
  styleUrls: ['./admin-artists.component.css']
})
export class AdminArtistsComponent implements OnInit {

  private currentUser;
  private currentAdminId;

  constructor(private dialog: MatDialog,
              private toastService: MzToastService) {
    this.currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    this.currentAdminId = this.currentUser['_accountId'];
  }

  ngOnInit() {
  }

  openDeleteArtistWindow() {
    this.dialog.open(ArtistSearchComponent, {
      data: {
        adminId: this.currentAdminId,
        toDelete: true
      },width: '850px', height: '800px',
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
        } else {
        }
      });
  }


  openCreateArtistWindow() {
    this.dialog.open(AdminArtistsConsoleComponent, {
      data: {
        adminId: this.currentAdminId,
        toAddArtist: true
      }
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.toastService.show("Artist was created", 3000, 'blue');
        }
      });
  }

  openModifyArtistWindow() {
    this.dialog.open(ArtistSearchComponent, {
      data: {
        adminId: this.currentAdminId,
        toDelete: false
      },width: '850px', height: '800px',
    })
      .afterClosed()
      .subscribe(result => {
        if (result) {
        } else {
        }
      });
  }
}
