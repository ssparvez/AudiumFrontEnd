import {Component, Inject, OnInit} from '@angular/core';

import {Playlist} from "../../classes/Playlist";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {

  playlist: Playlist;

  constructor(private dialogRef:MatDialogRef<CreatePlaylistComponent>,
              private service: GeneralService,
              @Inject(MAT_DIALOG_DATA) private data: {accountId: number, username: string}) { }

  ngOnInit() {
    this.playlist = {name: "", description: "", isPublic: false, accountId: this.data.accountId, username: this.data.username};
  }

  createPlaylist():void {
    console.log(this.playlist.username);
    if ( this.playlist.name !== "") {
      const playlistToSend = {name: this.playlist.name, description: this.playlist.description, isPublic: false,
        creator: {accountId: this.playlist.accountId, username: this.playlist.username}};
      this.service.post('/playlist/newplaylist', playlistToSend).subscribe(
        response => {
          console.log(response);
          this.closeDialog({isValid: true, playlistAdded: response});
        }, (error: AppError) => {

        });
    }
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
