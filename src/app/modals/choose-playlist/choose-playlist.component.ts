import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {GeneralService} from "../../services/general/general.service";
import {Playlist} from "../../classes/Playlist";
import {AppError} from "../../errors/AppError";
import {animate, style, transition, trigger} from "@angular/animations";


@Component({
  selector: 'app-choose-playlist',
  templateUrl: './choose-playlist.component.html',
  styleUrls: ['./choose-playlist.component.css'],
  animations: [
    trigger('fade',[
      transition('void => *',[
        animate(600, style({opacity: 0}))
      ]),
      transition('* => void',[
        animate(600, style({opacity: 0}))
      ])
    ])
  ]
})
export class ChoosePlaylistComponent implements OnInit {

  public playlists: Playlist[];
  constructor(private dialogRef:MatDialogRef<ChoosePlaylistComponent>,
              private service: GeneralService,
              @Inject(MAT_DIALOG_DATA) private data: {accountId: number, songId: number}) { }

  ngOnInit() {
    this.loadUserPlaylists();
  }



  loadUserPlaylists() {
    this.service.get('/accounts/' + this.data.accountId + '/playlists/owned').subscribe(
      response => {
        console.log(response);
        this.playlists = response;
      }, (error: AppError) => {

      }
    );
  }

  addSongToPlaylist(playlistToAddTo) {
    this.service.post('/accounts/' + this.data.accountId + '/playlist/' +
      playlistToAddTo +'/add/song/' + this.data.songId, null).subscribe(
      response => {
        this.closeDialog(true);
      }, (error: AppError) => {

      }
    );
  }

  closeDialog( argument?) {
    this.dialogRef.close(argument);
  }
}

