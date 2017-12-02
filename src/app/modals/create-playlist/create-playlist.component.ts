import {Component, Inject, OnInit} from '@angular/core';

import {Playlist} from "../../classes/Playlist";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {MzToastService} from "ng2-materialize";

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {

  playlist: Playlist;
  public isNew: boolean;

  constructor(private dialogRef:MatDialogRef<CreatePlaylistComponent>,
              private service: GeneralService,
              private toastService: MzToastService,
              @Inject(MAT_DIALOG_DATA) private data: {accountId: number, username: string,
                playlistId: number, isNew: boolean}) {
    this.isNew = data.isNew;
  }

  ngOnInit() {
    this.playlist = {name: "", description: "", isPublic: false, accountId: this.data.accountId,
      username: this.data.username};
  }

  createPlaylist(): void {
    if ( this.playlist.name !== "") {
      const playlistToSend = {name: this.playlist.name, description: this.playlist.description, isPublic: false,
        creator: {accountId: this.playlist.accountId, username: this.playlist.username}};
      this.service.post('/playlist/newplaylist', playlistToSend).subscribe(
        response => {
          console.log(response);
          this.closeDialog({isValid: true, playlistAdded: response});
        }, (error: AppError) => {
          this.toastService.show("Playlist could not be created", 3000, 'blue');
        });
    }
  }

  editPlaylist(): void {
    if ( this.playlist.name !== "") {
      const playlistToSend = {playlistId:this.data.playlistId, name: this.playlist.name,
        description: this.playlist.description, isPublic: false };
      this.service.update('/accounts/' + this.data.accountId + '/playlist/edit', playlistToSend).subscribe(
        response => {
          console.log(response);
          this.closeDialog({isValid: true, newName: this.playlist.name});
        }, (error: AppError) => {
          this.toastService.show("Playlist name could not be changed", 3000, 'red');
        });
    }
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
