import {Component, Inject, OnInit} from '@angular/core';
import {MD_DIALOG_DATA, MdDialogRef} from "@angular/material";
import {Playlist} from "../../classes/Playlist";
import {GeneralService} from "../../services/general/general.service";
import {AppError} from "../../errors/AppError";

@Component({
  selector: 'app-create-playlist',
  templateUrl: './create-playlist.component.html',
  styleUrls: ['./create-playlist.component.css']
})
export class CreatePlaylistComponent implements OnInit {

  playlist: Playlist;

  constructor(private dialogRef:MdDialogRef<CreatePlaylistComponent>,
              private service: GeneralService,
              @Inject(MD_DIALOG_DATA) private data: {accountId: number, username: string}) { }

  ngOnInit() {
    this.playlist = {name: "", description: "", isPublic: false,
                      creator: {accountId: this.data.accountId}};
  }

  createPlaylist():void {
    if ( this.playlist.name !== "") {
      this.service.post('/playlist/newplaylist', this.playlist).subscribe(
        response => {
          this.closeDialog({isValid: true, playlistAdded: response});
        }, (error: AppError) => {

        });
    }
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }

}
